import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'
import { useLang } from '../i18n.jsx'

export default function Records({ user, needAuth, go }) {
  const { t, spec, locale } = useLang()
  const when = (iso) => new Date(iso).toLocaleString(locale, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
  const [appts, setAppts] = useState([])
  const [checks, setChecks] = useState([])
  const [patients, setPatients] = useState([])
  const [error, setError] = useState('')
  const isDoctor = user?.role === 'DOCTOR'

  const load = useCallback(() => {
    if (!user) return
    setError('')
    Promise.all([
      api.myAppointments().then(setAppts),
      api.myAssessments().then(setChecks),
      isDoctor ? api.doctorAppointments().then(setPatients) : Promise.resolve(),
    ]).catch((e) => setError(e.message))
  }, [user, isDoctor])
  useEffect(load, [load])

  if (!user) {
    return (
      <div className="wrap page">
        <h1>{t('rec_title')}</h1>
        <div className="card empty"><p>{t('rec_signin')}</p><button className="btn" onClick={() => needAuth()}>{t('sign_in')}</button></div>
      </div>
    )
  }

  const cancel = async (id) => {
    if (!window.confirm(t('confirm_cancel'))) return
    try { await api.cancel(id); load() } catch (e) { setError(e.message) }
  }

  return (
    <div className="wrap page">
      <h1>{t('rec_title')}</h1>
      {error && <p className="err" role="alert">{error}</p>}

      {isDoctor && (
        <section>
          <h2>{t('upcoming')}</h2>
          {patients.length === 0 ? <div className="card empty">{t('no_upcoming')}</div> : (
            <div className="rlist">{patients.map((a) => (
              <div key={a.id} className="card rec"><div><b>{a.patientName}</b><p className="muted">{a.note || t('no_reason')}</p></div><span className="when">{when(a.startTime)}</span></div>
            ))}</div>
          )}
        </section>
      )}

      <section>
        <h2>{t('appts')}</h2>
        {appts.length === 0 ? (
          <div className="card empty"><p>{t('no_appts')}</p><button className="btn sm" onClick={() => go('doctors')}>{t('nav_doctors')}</button></div>
        ) : (
          <div className="rlist">{appts.map((a) => (
            <div key={a.id} className={`card rec${a.status === 'CANCELLED' ? ' off' : ''}`}>
              <div>
                <b>{a.doctorName}</b> <span className="muted">· {spec(a.specialty)}</span>
                <p className="muted">{a.clinic}, {a.address}</p>
                <p><a href={`tel:${a.phone.replace(/\s/g, '')}`}>{a.phone}</a></p>
              </div>
              <div className="rec-side">
                <span className="when">{when(a.startTime)}</span>
                {a.status === 'BOOKED' ? <button className="btn ghost sm" onClick={() => cancel(a.id)}>{t('cancel')}</button> : <span className="pill">{t('cancelled')}</span>}
              </div>
            </div>
          ))}</div>
        )}
      </section>

      <section>
        <h2>{t('sym_checks')}</h2>
        {checks.length === 0 ? (
          <div className="card empty"><p>{t('no_checks')}</p><button className="btn sm" onClick={() => go('check')}>{t('nav_check')}</button></div>
        ) : (
          <div className="rlist">{checks.map((c) => (
            <div key={c.id} className="card rec">
              <div><b>{c.symptoms}</b><p className="muted">{c.summary}</p></div>
              <div className="rec-side"><span className={`pill lvl ${c.riskLevel.toLowerCase()}`}>{t('lvl_' + c.riskLevel)}</span><span className="when">{when(c.createdAt)}</span></div>
            </div>
          ))}</div>
        )}
      </section>
    </div>
  )
}
