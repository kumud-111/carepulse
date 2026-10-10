import { useState } from 'react'
import { EXTRA_REGIONS } from './regions.js'
import { useLang } from '../i18n.jsx'

/** Tap a body part to pick a region. Front/back toggle; skin, fever and mind live outside the body. */
export default function BodyMap({ region, onSelect, counts = {} }) {
  const { t, region: rl } = useLang()
  const [view, setView] = useState('front')

  const part = (id, shape) => (
    <g className={`bm-part${region === id ? ' on' : ''}`} role="button" tabIndex={0} aria-label={rl(id)} aria-pressed={region === id}
      onClick={() => onSelect(id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id) } }}>
      <title>{rl(id)}</title>{shape}
    </g>
  )

  return (
    <div className="bodymap">
      <div className="bm-toggle" role="group">
        {['front', 'back'].map((v) => (
          <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{t(v)}</button>
        ))}
      </div>
      <svg viewBox="0 0 200 410" className="bm-svg" role="img" aria-label={t('where_hurts')}>
        {part('limbs', <>
          <rect x="34" y="92" width="24" height="132" rx="12" />
          <rect x="142" y="92" width="24" height="132" rx="12" />
          <rect x="66" y="232" width="32" height="165" rx="14" />
          <rect x="102" y="232" width="32" height="165" rx="14" />
        </>)}
        {part('head', <ellipse cx="100" cy="42" rx="27" ry="31" />)}
        {view === 'front' && <>
          {part('eyes', <><ellipse cx="89" cy="38" rx="6" ry="4" /><ellipse cx="111" cy="38" rx="6" ry="4" /></>)}
          {part('ent', <><rect x="91" y="50" width="18" height="11" rx="5" /><rect x="91" y="68" width="18" height="16" rx="4" />
            <ellipse cx="71" cy="44" rx="4" ry="7" /><ellipse cx="129" cy="44" rx="4" ry="7" /></>)}
          {part('chest', <path d="M64 88 h72 q6 0 6 8 v58 h-84 v-58 q0 -8 6 -8z" />)}
          {part('abdomen', <path d="M58 158 h84 v56 q0 14 -14 14 h-56 q-14 0 -14 -14z" />)}
        </>}
        {view === 'back' && <>
          {part('back', <path d="M64 88 h72 q6 0 6 8 v118 q0 14 -14 14 h-56 q-14 0 -14 -14 v-118 q0 -8 6 -8z" />)}
          {part('ent', <rect x="90" y="68" width="20" height="16" rx="4" />)}
        </>}
      </svg>
      <div className="bm-extra">
        {EXTRA_REGIONS.map((id) => (
          <button key={id} className={`chip${region === id ? ' on' : ''}`} onClick={() => onSelect(id)}>
            {rl(id)}{counts[id] ? <b>{counts[id]}</b> : null}
          </button>
        ))}
      </div>
    </div>
  )
}
