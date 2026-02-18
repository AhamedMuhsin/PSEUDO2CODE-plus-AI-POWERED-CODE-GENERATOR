/**
 * Auth Service - JWT-based authentication
 * Self-hosted JWT + OAuth (Google, GitHub) — no Firebase dependency
 */

import api from '@/services/api'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

// ==================== TOKEN MANAGEMENT ====================

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getStoredUser() {
  try {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// ==================== EMAIL/PASSWORD ====================

export const signupWithEmail = async (email, password, name) => {
  const res = await api.post('/auth/signup', { email, password, name })
  const { token, user } = res.data
  setToken(token)
  setStoredUser(user)
  return user
}

export const loginWithEmail = async (email, password) => {
  const res = await api.post('/auth/login', { email, password })
  const { token, user } = res.data
  setToken(token)
  setStoredUser(user)
  return user
}

// ==================== GOOGLE OAUTH ====================

export const loginWithGoogle = async () => {
  // Get the OAuth URL from backend
  const res = await api.get('/auth/google/url')
  const { url } = res.data

  return new Promise((resolve, reject) => {
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      url,
      'Google Sign In',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'))
      return
    }

    const interval = setInterval(async () => {
      try {
        if (popup.closed) {
          clearInterval(interval)
          reject({ code: 'auth/popup-closed-by-user' })
          return
        }

        const currentUrl = popup.location.href
        if (currentUrl.includes('/auth/callback/google')) {
          clearInterval(interval)
          const urlParams = new URL(currentUrl).searchParams
          const code = urlParams.get('code')
          popup.close()

          if (code) {
            const res = await api.post('/auth/google/callback', { code })
            const { token, user } = res.data
            setToken(token)
            setStoredUser(user)
            resolve(user)
          } else {
            reject(new Error('No authorization code received from Google'))
          }
        }
      } catch (e) {
        // Cross-origin access error expected until redirect
      }
    }, 500)

    setTimeout(() => {
      clearInterval(interval)
      if (!popup.closed) popup.close()
      reject(new Error('Sign in timed out'))
    }, 120000)
  })
}

// ==================== GITHUB OAUTH ====================

export const loginWithGithub = async () => {
  const res = await api.get('/auth/github/url')
  const { url } = res.data

  return new Promise((resolve, reject) => {
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      url,
      'GitHub Sign In',
      `width=${width},height=${height},left=${left},top=${top}`
    )

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'))
      return
    }

    const interval = setInterval(async () => {
      try {
        if (popup.closed) {
          clearInterval(interval)
          reject({ code: 'auth/popup-closed-by-user' })
          return
        }

        const currentUrl = popup.location.href
        if (currentUrl.includes('/auth/callback/github')) {
          clearInterval(interval)
          const urlParams = new URL(currentUrl).searchParams
          const code = urlParams.get('code')
          popup.close()

          if (code) {
            const res = await api.post('/auth/github/callback', { code })
            const { token, user } = res.data
            setToken(token)
            setStoredUser(user)
            resolve(user)
          } else {
            reject(new Error('No authorization code received from GitHub'))
          }
        }
      } catch (e) {
        // Cross-origin access error expected until redirect
      }
    }, 500)

    setTimeout(() => {
      clearInterval(interval)
      if (!popup.closed) popup.close()
      reject(new Error('Sign in timed out'))
    }, 120000)
  })
}

// ==================== FORGOT PASSWORD ====================

export const forgotPassword = async (email) => {
  if (!email) throw new Error('Please enter your email')
  const res = await api.post('/auth/forgot-password', { email })
  return res.data
}

// ==================== LOGOUT ====================

export const logout = async () => {
  removeToken()
}

// ==================== AUTH CHECK ====================

export function isAuthenticated() {
  return !!getToken()
}
