import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'
import { useLang } from '../i18n.jsx'
import { loadLoc } from '../components/LocationPicker.jsx'

export default function Guide({ go, params }) {
  const { t, lang, cond, spec } = useLang()
  const [list, setList] = useState([])
  const [q, setQ] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { api.conditions().then(setList).catch((e) => setError(e.message)) }, [])

  const shown = useMemo(() => {
    const n = q.trim().toLowerCase()
    const l = n ? list.filter((c) => [c.name, c.hi, c.about].join(' ').toLowerCase().includes(n)) : list
    return [...l].sort((a, b) => (a.id === params.open ? -1 : b.id === params.open ? 1 : a.name.localeCompare(b.name)))
  }, [list, q, params.open])

  return (
    <div className="wrap page">
      <h1>{t('guide_title')}</h1>
      <p className="muted">{t('guide_lead')}</p>
      {lang !== 'EN' && <p className="muted">{t('detail_note')}</p>}
      <label className="sr" htmlFor="gq">{t('guide_search')}</label>
      <input id="gq" className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('guide_ph')} />
      {error && <p className="err">{error}</p>}
      <div className="glist">
        {shown.map((c) => (
          <details key={c.id} className="card" open={c.id === params.open}>
            <summary>
              <b>{cond(c)}</b>
              <small className="pill">{t('c_' + c.commonness.replace(' ', '_'))}</small>
            </summary>
            <p>{c.about}</p>
            <h4>{t('home_helps')}</h4>
            <ul>{c.homeCare.map((x) => <li key={x}>{x}</li>)}</ul>
            <h4>{t('see_if')}</h4>
            <ul>{c.seeDoctorIf.map((x) => <li key={x}>{x}</li>)}</ul>
            <button className="btn sm" onClick={() => { const l = loadLoc(); go('doctors', { specialty: c.specialty, state: l.state, city: l.city }) }}>
              {t('find_a', { spec: spec(c.specialty) })}
            </button>
          </details>
        ))}
        {shown.length === 0 && !error && <div className="card empty">{t('guide_none', { q })}</div>}
      </div>
    </div>
  )
}
