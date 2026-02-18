import axios from 'axios'
import router from '@/router'

// Use the same hostname the browser is on so mobile / LAN access works
const API_HOST = window.location.hostname   // e.g. "10.38.152.190" or "localhost"
const API_PORT = 8000

const api = axios.create({
  baseURL: `http://${API_HOST}:${API_PORT}`,
})

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
