import axios from 'axios'
import router from '@/router'

// Environment-based API URL configuration
let baseURL

// Determine the API base URL based on environment
if (import.meta.env.VITE_API_URL) {
  // Use environment variable if available
  baseURL = import.meta.env.VITE_API_URL
} else if (import.meta.env.PROD) {
  // Production default: DigitalOcean live backend hostname
  baseURL = 'https://pseudo2code-backend-q7bcz.ondigitalocean.app'
} else {
  // Development: use local backend
  baseURL = `http://${window.location.hostname}:8000`
}

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
