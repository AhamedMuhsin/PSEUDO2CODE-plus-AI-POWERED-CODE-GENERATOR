import axios from 'axios'
import { getAuth } from 'firebase/auth'
import router from '@/router'   // 👈 IMPORTANT

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

/* ────────── REQUEST INTERCEPTOR ────────── */
api.interceptors.request.use(async (config) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    try {
      // Force refresh token to ensure it's not expired
      const token = await user.getIdToken(true)
      config.headers.Authorization = `Bearer ${token}`
    } catch (error) {
      console.error('Error getting ID token:', error)
      // If token refresh fails, sign out the user
      await auth.signOut()
      router.push('/login')
      return Promise.reject(error)
    }
  }

  return config
})

/* ────────── RESPONSE INTERCEPTOR ────────── */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const auth = getAuth()
      
      try {
        // Try to refresh the token
        const user = auth.currentUser
        if (user) {
          const newToken = await user.getIdToken(true)
          // Retry the original request with new token
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${newToken}`
            return api.request(error.config)
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }
      
      // If token refresh failed or no user, sign out
      await auth.signOut()
      router.push('/login')
    }

    return Promise.reject(error)
  }
)

export default api
