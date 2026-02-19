<template>
  <div class="callback-page">
    <div class="content">
      <img src="@/assets/logo_f.png" alt="Logo" class="logo" />
      <p class="text">{{ statusText }}</p>
      <div v-if="!errorMsg" class="spinner"></div>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <button v-if="errorMsg" class="retry-btn" @click="goLogin">Back to Login</button>
    </div>
  </div>
</template>

<script setup>
/**
 * OAuth Callback Page
 * - Desktop popup mode: parent window reads URL params, this page just shows spinner
 * - Mobile redirect mode: this page extracts the code, exchanges it, and navigates to dashboard
 */
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { exchangeOAuthCode } from '@/services/authService'

const router = useRouter()
const route = useRoute()
const statusText = ref('Completing sign in...')
const errorMsg = ref('')

function goLogin() {
  router.replace('/login')
}

onMounted(async () => {
  const code = route.query.code
  // Determine provider from the current path
  const path = route.path // e.g. /auth/callback/google or /auth/callback/github
  const provider = path.includes('google') ? 'google' : path.includes('github') ? 'github' : null

  if (!code || !provider) {
    // No code = opened as popup placeholder (desktop flow handles it)
    // Or invalid URL — just wait for parent to close us
    return
  }

  // Check if this is a redirect flow (mobile) — oauth_provider was set before redirect
  const savedProvider = localStorage.getItem('oauth_provider')
  if (savedProvider) {
    // This is a mobile redirect flow — exchange the code ourselves
    localStorage.removeItem('oauth_provider')
    try {
      statusText.value = 'Signing you in...'
      await exchangeOAuthCode(provider, code)
      statusText.value = 'Success! Redirecting...'
      router.replace('/dashboard')
    } catch (err) {
      console.error('OAuth callback error:', err)
      errorMsg.value = err?.response?.data?.detail || err?.message || 'Sign in failed. Please try again.'
    }
  }
  // If no savedProvider, this is a desktop popup — parent window handles code extraction
})
</script>

<style scoped>
.callback-page {
  height: 100vh;
  background: var(--bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.content {
  text-align: center;
  padding: 20px;
}

.logo {
  width: 80px;
  margin-bottom: 16px;
}

.text {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.error {
  color: var(--error, #ef4444);
  font-size: 0.95rem;
  margin-bottom: 16px;
  max-width: 360px;
}

.retry-btn {
  padding: 10px 24px;
  border-radius: 10px;
  border: 1px solid var(--border-default);
  background: var(--bg-card);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  border-color: var(--accent-border);
  background: var(--bg-hover);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--accent-border);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
