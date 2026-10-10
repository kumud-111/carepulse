import { useState, useCallback } from 'react'
import { auth, api } from './api.js'
import { useLang, LANGS } from './i18n.jsx'
import Home from './pages/Home.jsx'
import Checker from './pages/Checker.jsx'
import Doctors from './pages/Doctors.jsx'
import Guide from './pages/Guide.jsx'
import Records from './pages/Records.jsx'
import AuthModal from './components/AuthModal.jsx'

const NAV = [['check', 'nav_check'], ['doctors', 'nav_doctors'], ['guide', 'nav_guide'], ['records', 'nav_records']]

export default function App() {
  const { t, lang, setLang } = useLang()
  const [view, setView] = useState({ page: 'home', params: {} })
  const [user, setUser] = useState(auth.user)
  const [authOpen, setAuthOpen] = useState(false)
  const [afterAuth, setAfterAuth] = useState(null)

  const go = useCallback((page, params = {}) => { setView({ page, params }); window.scrollTo({ top: 0 }) }, [])
  const needAuth = useCallback((cb) => { setAfterAuth(() => cb || null); setAuthOpen(true) }, [])

  const onAuthed = (res) => {
    auth.save(res)
    setUser({ name: res.name, email: res.email, role: res.role, language: res.language })
    if (res.language) setLang(res.language)   // the saved profile language wins after sign-in
    setAuthOpen(false)
    if (afterAuth) afterAuth()
    setAfterAuth(null)
  }
  const logout = () => { auth.clear(); setUser(null); go('home') }
  const changeLang = (code) => {
    setLang(code)
    if (user) { api.updateLanguage(code).then((r) => { auth.save({ ...r, token: auth.token }); setUser(auth.user) }).catch(() => {}) }
  }

  const ctx = { go, user, needAuth }
  const { page, params } = view
  return (
    <>
      <header className="top">
        <div className="wrap top-in">
          <button className="brand" onClick={() => go('home')} aria-label="CarePulse">
            <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" fill="#0B7A75" /><path d="M3 15h6l3-7 4 12 3-5h6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            CarePulse
          </button>
          <nav className="nav" aria-label="Main">
            {NAV.map(([id, key]) => <button key={id} className={page === id ? 'on' : ''} onClick={() => go(id)}>{t(key)}</button>)}
          </nav>
          <select className="langsel" aria-label={t('language')} value={lang} onChange={(e) => changeLang(e.target.value)}>
            {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          {user ? (
            <div className="who"><span>{t('hi_name', { name: user.name.split(' ')[0] })}</span><button className="btn ghost sm" onClick={logout}>{t('sign_out')}</button></div>
          ) : (
            <button className="btn sm" onClick={() => needAuth()}>{t('sign_in')}</button>
          )}
        </div>
      </header>

      <main>
        {page === 'home' && <Home {...ctx} />}
        {page === 'check' && <Checker {...ctx} params={params} />}
        {page === 'doctors' && <Doctors {...ctx} params={params} />}
        {page === 'guide' && <Guide {...ctx} params={params} />}
        {page === 'records' && <Records {...ctx} />}
      </main>

      <footer className="foot">
        <div className="wrap">
          <p><b>{t('foot_emergency')}</b> {t('foot_call', { a: '112', b: '108', c: '14416' })}</p>
          <p className="muted">{t('foot_disclaimer')}</p>
        </div>
      </footer>

      {authOpen && <AuthModal onClose={() => { setAuthOpen(false); setAfterAuth(null) }} onAuthed={onAuthed} />}
    </>
  )
}
