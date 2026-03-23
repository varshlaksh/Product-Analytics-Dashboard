import { getToken, removeToken } from '../utils/auth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    removeToken()
    window.location.href = '/login'
    return
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || data.error || 'Request failed')
  return data
}

// ── Auth ──  ✅ fixed paths to match /auth/login and /auth/register
export const login = (username, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })

export const register = (username, password, age, gender) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password, age, gender }) })

// ── Tracking ──
export const trackEvent = (feature_name) =>
  request('/track', { method: 'POST', body: JSON.stringify({ feature_name }) })

// ── Analytics ──
export const fetchAnalytics = ({ startDate, endDate, feature } = {}) => {
  const params = new URLSearchParams()
  if (startDate) params.set('startDate', startDate)
  if (endDate)   params.set('endDate',   endDate)
  if (feature)   params.set('feature',   feature)
  return request(`/analytics?${params}`)
}