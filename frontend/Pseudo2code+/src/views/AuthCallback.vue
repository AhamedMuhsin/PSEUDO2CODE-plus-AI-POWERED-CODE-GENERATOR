<template>
  <div class="callback-page">
    <div class="content">
      <img src="@/assets/logo_f.png" alt="Logo" class="logo" />
      <p class="text">Completing sign in...</p>
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
/**
 * OAuth Callback Page
 * This page is opened inside the OAuth popup.
 * The parent window (Login/Signup) reads the URL parameters (code)
 * from this page and handles the token exchange.
 * This page just shows a loading state — the popup closes automatically.
 */
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
