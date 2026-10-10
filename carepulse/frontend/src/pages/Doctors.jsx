import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'
import { useLang } from '../i18n.jsx'
import LocationPicker, { loadLoc, saveLoc } from '../components/LocationPicker.jsx'

function sortDoctors(list, sort) {
  const a = [...list]
  if (sort === 'fee') return a.sort((x, y) => x.fee - y.fee)
  if (sort === 'rating') return a.sort((x, y) => y.rating - x.rating || x.fee - y.fee)
  if (sort === 'exp') return a.sort((x, y) => y.experienceYears - x.experienceYears)
  const good = a.filter((d) => d.rating >= 4.2).sort((x, y) => x.fee - y.fee)
  const rest = a.filter((d) => d.rating < 4.2).sort((x, y) => x.fee - y.fee)
  return [...good, ...rest]
}

export default function Doctors({ params, user, needAuth, go }) {
  const { t, spec } = useLang()
  const [meta, setMeta] = useState({ states: [], specialties: [] })
  const stored = loadLoc()
  const [loc, setLoc] = useState({
    state: params.state ?? stored.state ?? '', city: params.city ?? stored.city ?? '', area: '',
  })
  const [specialty, setSpecialty] = useState(params.specialty || '')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('value')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { api.meta().then(setMeta).catch((e) => setError(e.message)) }, [])
  useEffect(() => {
    setLoading(true); setError('')
    const timer = setTimeout(() => {
      api.doctors({ state: loc.state, city: loc.city, area: loc.area, specialty, q })
        .then(setList).catch((e) => setError(e.message)).finally(() => setLoading(false))
    }, 200)
    return () => clearTimeout(timer)
  }, [loc.state, loc.city, loc.area, specialty, q])

  const sorted = useMemo(() => sortDoctors(list, sort), [list, sort])
  const changeLoc = (v) => { setLoc(v); saveLoc(v) }
  const count = loading ? t('loading') : sorted.length === 1 ? t('one_doctor') : t('n_doctors', { n: sorted.length })

  return (
    <div className="wrap page">
      <h1>{t('doc_title')}</h1>
      <p className="muted">{t('doc_lead')}</p>

      <div className="filters card">
        <LocationPicker meta={meta} value={loc} onChange={changeLoc} withArea />
        <label>{t('specialty')}
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
            <option value="">{t('all_specialties')}</option>
            {meta.specialties.map((s) => <option key={s} value={s}>{spec(s)}</option>)}
          </select>
        </label>
        <label>{t('sort_by')}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {['value', 'fee', 'rating', 'exp'].map((k) => <option key={k} value={k}>{t('sort_' + k)}</option>)}
          </select>
        </label>
        <label className="grow">{t('search_label')}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search_ph')} />
        </label>
      </div>

      {error && <p className="err" role="alert">{error}</p>}
      <p className="count">{count}</p>
      {!loading && sorted.length === 0 && !error && <div className="card empty">{t('no_match')}</div>}

      <div className="dlist">
        {sorted.map((d, i) => <DoctorCard key={d.id} d={d} best={sort === 'value' && i === 0} user={user} needAuth={needAuth} go={go} />)}
      </div>
    </div>
  )
}

function DoctorCard({ d, best, user, needAuth, go }) {
  const { t, spec, locale } = useLang()
  const fmtDay = (iso) => new Date(iso).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })
  const fmtTime = (iso) => new Date(iso).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })
  const [open, setOpen] = useState(false)
  const [slots, setSlots] = useState(null)
  const [chosen, setChosen] = useState(null)
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = () => api.slots(d.id).then(setSlots).catch((e) => setMsg({ err: e.message }))
  const toggle = () => { setOpen(!open); if (!open && !slots) load() }

  const days = useMemo(() => {
    const g = {}
    ;(slots || []).forEach((s) => { (g[fmtDay(s.startTime)] ||= []).push(s) })
    return Object.entries(g)
  }, [slots, locale])

  const doBook = async () => {
    setBusy(true); setMsg(null)
    try {
      const a = await api.book(chosen.id, note)
      setMsg({ ok: t('booked', { when: `${fmtDay(a.startTime)}, ${fmtTime(a.startTime)}` }) })
      setChosen(null); setNote(''); load()
    } catch (e) { setMsg({ err: e.message }); load(); setChosen(null) } finally { setBusy(false) }
  }
  const book = () => (user ? doBook() : needAuth(doBook))

  return (
    <article className="card doc">
      {best && <span className="tag">{t('best_value')}</span>}
      <div className="doc-top">
        <div className="avatar" aria-hidden="true">{d.name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('').slice(0, 2)}</div>
        <div className="doc-main">
          <h3>{d.name}</h3>
          <p className="spec">{spec(d.specialty)} <span className="muted">· {d.qualification}</span></p>
          <p className="muted">{t('exp_years', { n: d.experienceYears })} · {t('speaks', { x: d.languages })}</p>
        </div>
        <div className="doc-fee">
          <b>₹{d.fee}</b><small>{t('consult')}</small>
          <span className="rate" aria-label={`${d.rating} / 5`}>★ {d.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="doc-contact">
        <p><b>{d.clinic}</b><br />{d.address}</p>
        <div className="doc-actions">
          <a className="btn ghost sm" href={`tel:${d.phone.replace(/\s/g, '')}`}>{t('call_phone', { p: d.phone })}</a>
          <a className="btn ghost sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.clinic + ', ' + d.address)}`}>{t('directions')}</a>
          <button className="btn sm" onClick={toggle} aria-expanded={open}>{open ? t('hide_times') : t('book_slot')}</button>
        </div>
      </div>

      {open && (
        <div className="slots">
          {!slots && !msg?.err && <p className="muted">{t('loading_times')}</p>}
          {slots && days.length === 0 && <p className="muted">{t('no_times')}</p>}
          {days.map(([day, list]) => (
            <div key={day} className="slot-day">
              <b>{day}</b>
              <div className="chips">
                {list.map((s) => (
                  <button key={s.id} disabled={s.booked} className={`chip${chosen?.id === s.id ? ' on' : ''}`} onClick={() => setChosen(s)}>{fmtTime(s.startTime)}</button>
                ))}
              </div>
            </div>
          ))}
          {chosen && (
            <div className="confirm">
              <label>{t('reason')}
                <input value={note} maxLength={400} onChange={(e) => setNote(e.target.value)} placeholder={t('reason_ph')} />
              </label>
              <button className="btn" disabled={busy} onClick={book}>{busy ? t('booking') : t('confirm', { when: `${fmtDay(chosen.startTime)}, ${fmtTime(chosen.startTime)}` })}</button>
            </div>
          )}
          {msg?.ok && <p className="ok" role="status">{msg.ok} <button className="link" onClick={() => go('records')}>{t('view_records')}</button></p>}
          {msg?.err && <p className="err" role="alert">{msg.err}</p>}
        </div>
      )}
    </article>
  )
}
