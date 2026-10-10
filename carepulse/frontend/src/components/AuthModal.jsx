import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useLang, LANGS, langForState } from '../i18n.jsx'

export default function AuthModal({ onClose, onAuthed }) {
  const { t, lang, setLang } = useLang()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [states, setStates] = useState([])
  const [st, setSt] = useState('')
  useEffect(() => { api.meta().then((m) => setStates(m.states)).catch(() => {}) }, [])
  const pickState = (v) => { setSt(v); if (v) setLang(langForState(v)) }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      const res = mode === 'login'
        ? await api.login({ email: form.email, password: form.password })
        : await api.register({ ...form, language: lang })
      onAuthed(res)
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return (
    <div className="modal-bg" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-label={t('sign_in')}>
        <button type="button" className="x" onClick={onClose} aria-label={t('close')}>×</button>
        <h2>{mode === 'login' ? t('welcome') : t('create_title')}</h2>
        <p className="muted">{t('auth_sub')}</p>
        {mode === 'register' && (
          <>
            <label>{t('full_name')}<input required value={form.name} onChange={set('name')} autoComplete="name" /></label>
            <fieldset className="langpick">
              <legend>{t('pref_lang')}</legend>
              <label>{t('state')}
                <select value={st} onChange={(e) => pickState(e.target.value)}>
                  <option value="">{t('all_states')}</option>
                  {states.map((s) => <option key={s.state}>{s.state}</option>)}
                </select>
              </label>
              <small className="muted">{t('lang_by_state')}</small>
              <div className="chips">
                {LANGS.map((l) => (
                  <button type="button" key={l.code} className={`chip${lang === l.code ? ' on' : ''}`} aria-pressed={lang === l.code} onClick={() => setLang(l.code)}>{l.label}</button>
                ))}
              </div>
              <small className="muted">{t('pref_lang_hint')}</small>
            </fieldset>
          </>
        )}
        <label>{t('email')}<input required type="email" value={form.email} onChange={set('email')} autoComplete="email" /></label>
        <label>{t('password')}<input required type="password" minLength={6} value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
        {error && <p className="err" role="alert">{error}</p>}
        <button className="btn block" disabled={busy}>{busy ? t('please_wait') : mode === 'login' ? t('sign_in') : t('create_btn')}</button>
        <p className="switch">
          {mode === 'login' ? t('new_here') : t('already')}{' '}
          <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
            {mode === 'login' ? t('create_btn') : t('sign_in')}
          </button>
        </p>
      </form>
    </div>
  )
}
