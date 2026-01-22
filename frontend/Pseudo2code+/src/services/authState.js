import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

let currentUser = null

onAuthStateChanged(auth, (user) => {
  currentUser = user
})

export function getCurrentUser() {
  return new Promise((resolve) => {
    if (currentUser !== null) {
      resolve(currentUser)
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe()
        resolve(user)
      })
    }
  })
}
