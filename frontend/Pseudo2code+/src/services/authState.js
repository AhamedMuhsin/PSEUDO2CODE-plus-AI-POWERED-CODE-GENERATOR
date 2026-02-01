import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

let currentUser = null
let authStateResolved = false

// Initialize auth state listener
onAuthStateChanged(auth, (user) => {
  currentUser = user
  authStateResolved = true
})

export function getCurrentUser() {
  return new Promise((resolve) => {
    if (authStateResolved) {
      // Auth state already determined
      resolve(currentUser)
    } else {
      // Still waiting for auth state
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        currentUser = user
        authStateResolved = true
        resolve(user)
      })
      
      // Timeout after 5 seconds to prevent indefinite waiting
      setTimeout(() => {
        resolve(currentUser)
      }, 5000)
    }
  })
}
