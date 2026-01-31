import axios from 'axios'
import { getAuth } from 'firebase/auth'
import router from '@/router'   // 👈 IMPORTANT

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

/* ---------------- REQUEST ---------------- */
api.interceptors.request.use(async (config) => {
  const auth = getAuth()
  const user = auth.currentUser

  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* ---------------- RESPONSE ---------------- */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const auth = getAuth()
      await auth.signOut()

      router.push('/login')
    }

    return Promise.reject(error)
  }
)

export default api
