import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // User data
  const user = ref(null)
  const lastUpdated = ref(null)

  // Update user data
  function updateUser(newUserData) {
    user.value = {
      ...user.value,
      ...newUserData,
    }
    lastUpdated.value = new Date()
  }

  // Set complete user profile
  function setUser(newUser) {
    user.value = newUser
    lastUpdated.value = new Date()
  }

  // Clear user (on logout)
  function clearUser() {
    user.value = null
    lastUpdated.value = null
  }

  return {
    user,
    lastUpdated,
    updateUser,
    setUser,
    clearUser,
  }
})
