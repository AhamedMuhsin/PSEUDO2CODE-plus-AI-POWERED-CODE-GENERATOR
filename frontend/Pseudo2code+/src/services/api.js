import axios from 'axios'
import router from '@/router'

// When served through a tunnel (HTTPS) use the Vite proxy at /api.
// For local / LAN dev (HTTP) hit the backend directly.
const isTunnel = window.location.protocol === 'https:'
const baseURL = isTunnel
  ? '/api'                                                   // proxied by Vite
  : `http://${window.location.hostname}:8000`                 // direct

const api = axios.create({ baseURL })

/* ────────── REQUEST INTERCEPTOR ────────── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* ────────── RESPONSE INTERCEPTOR ────────── */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized — token expired or invalid
    if (error.response?.status === 401) {
      // Don't redirect if we're already on auth routes
      const url = error.config?.url || ''
      if (!url.includes('/auth/login') && !url.includes('/auth/signup')) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        router.push('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default api
