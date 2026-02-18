import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  // 'dark' | 'light' | 'system'
  const preference = ref(localStorage.getItem('theme-preference') || 'dark')

  const systemDark = ref(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    systemDark.value = e.matches
    if (preference.value === 'system') applyTheme()
  })

  const activeTheme = computed(() => {
    if (preference.value === 'system') {
      return systemDark.value ? 'dark' : 'light'
    }
    return preference.value
  })

  function setPreference(pref) {
    preference.value = pref
    localStorage.setItem('theme-preference', pref)
    applyTheme()
  }

  function applyTheme() {
    const theme = activeTheme.value
    document.documentElement.setAttribute('data-theme', theme)
  }

  // Initialize on creation
  applyTheme()

  return {
    preference,
    activeTheme,
    systemDark,
    setPreference,
    applyTheme,
  }
})
