import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useLang } from '../i18n.jsx'
import BodyMap from '../components/BodyMap.jsx'
import LocationPicker, { loadLoc, saveLoc } from '../components/LocationPicker.jsx'

const SMALL = [
  ['s_fever', 'viral_fever'], ['s_cold', 'common_cold'], ['s_acidity', 'acidity'], ['s_loose', 'gastroenteritis'],
  ['s_head', 'tension_headache'], ['s_back', 'back_strain'], ['s_itch', 'fungal_infection'], ['s_tooth', 'dental_problem'],
]

export default function Home({ go }) {
  const { t } = useLang()
  const [meta, setMeta] = useState(null)
  const [loc, setLoc] = useState(loadLoc())
  useEffect(() => { api.meta().then(setMeta).catch(() => {}) }, [])

  const find = (e) => { e.preventDefault(); saveLoc(loc); go('doctors', { state: loc.state, city: loc.city }) }

  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-copy">
            <h1>{t('hero_title')}</h1>
            <p className="lead">{t('hero_lead')}</p>
            <form className="findbar" onSubmit={find}>
              <LocationPicker meta={meta} value={loc} onChange={setLoc} className="fb" />
              <button className="btn">{t('find_doctors')}</button>
            </form>
            <p className="hint">{t('free_hint')}</p>
          </div>
          <div className="hero-map card">
            <h2 className="map-title">{t('where_hurts')}</h2>
            <BodyMap region={null} onSelect={(r) => go('check', { region: r })} />
          </div>
        </div>
      </section>

      <section className="wrap section">
        <h2>{t('small_title')}</h2>
        <p className="muted">{t('small_lead')}</p>
        <div className="chips">
          {SMALL.map(([key, id]) => <button key={id} className="chip" onClick={() => go('guide', { open: id })}>{t(key)}</button>)}
          <button className="chip solid" onClick={() => go('guide')}>{t('see_all')}</button>
        </div>
      </section>

      <section className="wrap section three">
        {[1, 2, 3].map((n) => (
          <article key={n} className="card"><h3>{t(`f${n}_t`)}</h3><p>{t(`f${n}_p`)}</p></article>
        ))}
      </section>
    </>
  )
}
