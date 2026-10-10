import { useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'
import { useLang } from '../i18n.jsx'
import BodyMap from '../components/BodyMap.jsx'
import { loadLoc } from '../components/LocationPicker.jsx'

const DAYS = [['1', 'd1'], ['2', 'd2'], ['5', 'd3'], ['10', 'd4']]

export default function Checker({ go, user, needAuth, params }) {
  const { t, lang, sym, region: regionLabel } = useLang()
  const [symptoms, setSymptoms] = useState([])
  const [conds, setConds] = useState({})
  const [region, setRegion] = useState(params.region || 'general')
  const [picked, setPicked] = useState([])
  const [text, setText] = useState('')
  const [age, setAge] = useState('')
  const [days, setDays] = useState('2')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.symptoms().then(setSymptoms).catch((e) => setError(e.message))
    api.conditions().then((l) => setConds(Object.fromEntries(l.map((c) => [c.id, c])))).catch(() => {})
  }, [])

  const byId = useMemo(() => Object.fromEntries(symptoms.map((s) => [s.id, s])), [symptoms])
  const inRegion = symptoms.filter((s) => s.region === region)
  const counts = useMemo(() => {
    const c = {}
    picked.forEach((id) => { const r = byId[id]?.region; if (r) c[r] = (c[r] || 0) + 1 })
    return c
  }, [picked, byId])
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const submit = async () => {
    setBusy(true); setError(''); setResult(null)
    try {
      const res = await api.triage({ symptomIds: picked, text, age: age ? Number(age) : null, days: Number(days), lang })
      setResult(res)
      setTimeout(() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  const reset = () => { setResult(null); setPicked([]); setText('') }

  return (
    <div className="wrap page">
      <h1>{t('chk_title')}</h1>
      <p className="muted">{t('chk_lead')}</p>

      <div className="checker">
        <div className="card map-card"><BodyMap region={region} onSelect={setRegion} counts={counts} /></div>

        <div className="card pick">
          <h2>{regionLabel(region)}</h2>
          {symptoms.length === 0 && !error && <p className="muted">{t('loading_symptoms')}</p>}
          <div className="chips">
            {inRegion.map((s) => (
              <button key={s.id} className={`chip${picked.includes(s.id) ? ' on' : ''}${s.redFlag ? ' warn' : ''}`}
                aria-pressed={picked.includes(s.id)} onClick={() => toggle(s.id)}>{sym(s)}</button>
            ))}
          </div>

          <h3>{t('your_symptoms', { n: picked.length })}</h3>
          {picked.length === 0 ? <p className="muted">{t('none_selected')}</p> : (
            <div className="chips">
              {picked.map((id) => (
                <button key={id} className="chip on" onClick={() => toggle(id)} aria-label={t('remove', { x: byId[id] ? sym(byId[id]) : id })}>
                  {byId[id] ? sym(byId[id]) : id} ×
                </button>
              ))}
            </div>
          )}

          <label>{t('own_words')}
            <textarea rows={3} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('own_ph')} />
          </label>
          <div className="row2">
            <label>{t('age')}<input type="number" min="0" max="120" value={age} onChange={(e) => setAge(e.target.value)} placeholder={t('years')} /></label>
            <label>{t('how_long')}
              <select value={days} onChange={(e) => setDays(e.target.value)}>
                {DAYS.map(([v, k]) => <option key={v} value={v}>{t(k)}</option>)}
              </select>
            </label>
          </div>

          {error && <p className="err" role="alert">{error}</p>}
          <button className="btn block" disabled={busy || (picked.length === 0 && !text.trim())} onClick={submit}>
            {busy ? t('checking') : t('check_btn')}
          </button>
        </div>
      </div>

      {result && <Result r={result} conds={conds} go={go} user={user} needAuth={needAuth} reset={reset} />}
    </div>
  )
}

function Result({ r, conds, go, user, needAuth, reset }) {
  const { t, lang, spec, cond } = useLang()
  const sp = spec(r.specialty)
  const advice = t('adv_' + r.level, { spec: sp })
  return (
    <section id="result" className={`result ${r.level.toLowerCase()}`} aria-live="polite">
      <h2>{t('t_' + r.level)}</h2>
      <p>{t('sum_' + r.level, { spec: sp })}</p>
      <ul className="advice">
        {advice.map((a) => <li key={a}>{a}</li>)}
        {r.selfHarm && <li>{t('adv_selfharm')}</li>}
      </ul>

      {r.helplines.length > 0 && (
        <div className="helplines">
          {r.helplines.map((h) => { const n = h.split(' ')[0]; return <a key={h} className="btn danger" href={`tel:${n}`}>{t('call_n', { n })}</a> })}
        </div>
      )}

      {r.aiNote && <p className="ai"><b>{t('simple_words')}</b> {r.aiNote}</p>}

      {r.level !== 'EMERGENCY' && (
        <>
          <div className="cta-row">
            <button className="btn" onClick={() => { const l = loadLoc(); go('doctors', { specialty: r.specialty, state: l.state, city: l.city }) }}>
              {t('find_a', { spec: sp })}
            </button>
            <button className="btn ghost" onClick={reset}>{t('start_over')}</button>
          </div>

          {r.matches.length > 0 && (
            <div className="matches">
              <h3>{t('causes')}</h3>
              {lang !== 'EN' && <p className="muted">{t('detail_note')}</p>}
              {r.matches.map((m) => (
                <details key={m.id} className="card">
                  <summary><b>{conds[m.id] ? cond(conds[m.id]) : m.name}</b></summary>
                  <p>{m.about}</p>
                  <h4>{t('home_helps')}</h4>
                  <ul>{m.homeCare.map((x) => <li key={x}>{x}</li>)}</ul>
                  <h4>{t('see_if')}</h4>
                  <ul>{m.seeDoctorIf.map((x) => <li key={x}>{x}</li>)}</ul>
                </details>
              ))}
            </div>
          )}
        </>
      )}

      {r.saved
        ? <p className="muted">{t('saved_in')} <button className="link" onClick={() => go('records')}>{t('nav_records')}</button>.</p>
        : !user && <p className="muted"><button className="link" onClick={() => needAuth()}>{t('sign_in')}</button> {t('sign_in_to_save')}</p>}
      <p className="disc">{t('disclaimer')}</p>
    </section>
  )
}
