// Thin API client. In dev, Vite proxies /api to the Spring Boot backend on :8080.
const BASE = import.meta.env.VITE_API_URL || ''

export const auth = {
  get token() { return localStorage.getItem('cp_token') },
  get user() {
    try { return JSON.parse(localStorage.getItem('cp_user')) } catch { return null }
  },
  save(res) {
    localStorage.setItem('cp_token', res.token)
    localStorage.setItem('cp_user', JSON.stringify({ name: res.name, email: res.email, role: res.role, language: res.language }))
  },
  clear() { localStorage.removeItem('cp_token'); localStorage.removeItem('cp_user') },
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth.token) headers.Authorization = `Bearer ${auth.token}`
  let res
  try {
    res = await fetch(`${BASE}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running on port 8080.')
  }
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { /* not json */ }
  if (!res.ok) {
    if (res.status === 401 && auth.token) auth.clear()
    const err = new Error((data && data.error) || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return data
}

const cache = {}
const once = (key, fn) => (cache[key] ||= fn())

export const api = {
  register: (b) => request('/auth/register', { method: 'POST', body: b }),
  login: (b) => request('/auth/login', { method: 'POST', body: b }),
  updateLanguage: (language) => request('/auth/language', { method: 'PUT', body: { language } }),
  symptoms: () => once('symptoms', () => request('/symptoms')),
  conditions: () => once('conditions', () => request('/conditions')),
  meta: () => once('meta', () => request('/doctors/meta')),
  doctors: (p) => request('/doctors?' + new URLSearchParams(Object.entries(p).filter(([, v]) => v))),
  slots: (id) => request(`/doctors/${id}/slots`),
  triage: (b) => request('/triage', { method: 'POST', body: b }),
  book: (slotId, note) => request('/appointments', { method: 'POST', body: { slotId, note } }),
  myAppointments: () => request('/appointments/mine'),
  cancel: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),
  myAssessments: () => request('/records/assessments'),
  doctorAppointments: () => request('/doctor/appointments'),
}
