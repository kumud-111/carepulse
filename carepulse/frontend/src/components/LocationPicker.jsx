import { useLang } from '../i18n.jsx'

/** State > City > Area cascade. `meta.states` comes from /api/doctors/meta. */
export default function LocationPicker({ meta, value, onChange, withArea = false, className = '' }) {
  const { t } = useLang()
  const states = meta?.states || []
  const cities = states.find((s) => s.state === value.state)?.cities || []
  const areas = cities.find((c) => c.city === value.city)?.areas || []
  const set = (patch) => onChange({ ...value, ...patch })
  return (
    <>
      <label className={className}>{t('state')}
        <select value={value.state || ''} onChange={(e) => set({ state: e.target.value, city: '', area: '' })}>
          <option value="">{t('all_states')}</option>
          {states.map((s) => <option key={s.state}>{s.state}</option>)}
        </select>
      </label>
      <label className={className}>{t('city')}
        <select value={value.city || ''} disabled={!value.state} onChange={(e) => set({ city: e.target.value, area: '' })}>
          <option value="">{value.state ? t('all_cities') : t('pick_state_first')}</option>
          {cities.map((c) => <option key={c.city}>{c.city}</option>)}
        </select>
      </label>
      {withArea && (
        <label className={className}>{t('area')}
          <select value={value.area || ''} disabled={!value.city} onChange={(e) => set({ area: e.target.value })}>
            <option value="">{value.city ? t('all_areas') : t('pick_city_first')}</option>
            {areas.map((a) => <option key={a}>{a}</option>)}
          </select>
        </label>
      )}
    </>
  )
}

export const loadLoc = () => { try { return JSON.parse(localStorage.getItem('cp_loc')) || {} } catch { return {} } }
export const saveLoc = (v) => localStorage.setItem('cp_loc', JSON.stringify({ state: v.state || '', city: v.city || '' }))
