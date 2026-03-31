import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useUserStore = defineStore('user', () => {
  // User data
  const user = ref(null)
  const lastUpdated = ref(null)

  // ============ SUBSCRIPTION STATE ============
  const subscription = ref(null)
  const quotas = ref(null)
  const loadingSubscription = ref(false)
  const subscriptionError = ref(null)

  // ============ COMPUTED ============
  const isPremium = computed(() => subscription.value?.tier === 'premium')
  const isFree = computed(() => subscription.value?.tier === 'free' || !subscription.value)

  const remainingCodeGenerations = computed(() => quotas.value?.code_generations?.remaining ?? null)
  const remainingVisualizations = computed(() => quotas.value?.visualizations?.remaining ?? null)
  const remainingDownloads = computed(() => quotas.value?.downloads?.remaining ?? null)

  const canGenerateCode = computed(() => {
    // Premium users can always generate
    if (isPremium.value) return true
    // Free users need quota
    return remainingCodeGenerations.value !== null && remainingCodeGenerations.value > 0
  })

  const canVisualize = computed(() => {
    if (isPremium.value) return true
    return remainingVisualizations.value !== null && remainingVisualizations.value > 0
  })

  // ============ ACTIONS ============

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
    subscription.value = null
    quotas.value = null
  }

  // ============ SUBSCRIPTION ACTIONS ============

  async function fetchSubscription() {
    loadingSubscription.value = true
    subscriptionError.value = null
    try {
      const response = await api.get('/subscription/me')
      subscription.value = response.data
      return subscription.value
    } catch (error) {
      subscriptionError.value = error.message || 'Failed to fetch subscription'
      console.error('Subscription error:', error)
      return null
    } finally {
      loadingSubscription.value = false
    }
  }

  async function fetchQuotas() {
    try {
      const response = await api.get('/subscription/quotas')
      quotas.value = response.data
      return quotas.value
    } catch (error) {
      console.error('Quotas error:', error)
      return null
    }
  }

  async function upgradeToPremiun() {
    try {
      const response = await api.post('/subscription/upgrade')
      subscription.value = {
        ...subscription.value,
        tier: 'premium',
        is_premium: true,
      }
      // Reset quotas to unlimited
      quotas.value = {
        code_generations: { unlimited: true, remaining: null },
        visualizations: { unlimited: true, remaining: null },
        downloads: { unlimited: true, remaining: null },
      }
      return response.data
    } catch (error) {
      console.error('Upgrade error:', error)
      throw error
    }
  }

  async function downgradeToFree() {
    try {
      const response = await api.post('/subscription/downgrade')
      subscription.value = {
        ...subscription.value,
        tier: 'free',
        is_premium: false,
      }
      // Refresh quotas
      await fetchQuotas()
      return response.data
    } catch (error) {
      console.error('Downgrade error:', error)
      throw error
    }
  }

  function setSubscription(sub) {
    subscription.value = sub
  }

  function setQuotas(q) {
    quotas.value = q
  }

  return {
    // User data
    user,
    lastUpdated,
    updateUser,
    setUser,
    clearUser,

    // Subscription
    subscription,
    quotas,
    loadingSubscription,
    subscriptionError,

    // Computed
    isPremium,
    isFree,
    remainingCodeGenerations,
    remainingVisualizations,
    remainingDownloads,
    canGenerateCode,
    canVisualize,

    // Actions
    fetchSubscription,
    fetchQuotas,
    upgradeToPremiun,
    downgradeToFree,
    setSubscription,
    setQuotas,
  }
})
