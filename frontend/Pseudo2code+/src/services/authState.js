/**
 * Auth State - JWT-based (replaces Firebase onAuthStateChanged)
 * Simply checks localStorage for a valid token
 */

import { getToken, getStoredUser } from '@/services/authService'

export function getCurrentUser() {
  // Synchronous check — no need for Firebase listener
  const token = getToken()
  if (!token) return Promise.resolve(null)
  
  // Return stored user data (basic info for router guard)
  const user = getStoredUser()
  return Promise.resolve(user || { authenticated: true })
}
