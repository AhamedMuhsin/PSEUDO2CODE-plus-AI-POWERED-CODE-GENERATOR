import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
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
