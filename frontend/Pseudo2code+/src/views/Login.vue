<template>
  <div class="page">
    <!-- Back -->
    <div class="back" @click="router.push('/')">
      <img :src="arrowLeft" class="arrow" />
      Back to Home
    </div>

    <!-- App Title -->
    <div class="app-title">
      <img :src="logo" alt="Pseudo2code+ Logo" class="icon" width="100" />
    </div>

    <!-- Login Card -->
    <div class="card">
      <h1>Welcome Back</h1>
      <p class="subtitle">
        Sign in to your account to continue learning
      </p>

      <!-- Email -->
      <label>Email</label>
      <input type="email" placeholder="demo@example.com" v-model="email" />

      <!-- Password -->
      <div class="password-row">
        <label>Password</label>
        <span class="forgot" @click="handleForgotPassword">Forgot password?</span>
      </div>
      <input type="password" placeholder="test@123" v-model="password" />
      <p v-if="error" class="error-msg">{{ error }}</p>
      <p v-if="success" class="success-msg">{{ success }}</p>

      <!-- Sign In -->
      <button class="primary-btn" @click="handleEmailLogin" :disabled="loading">Sign In</button>

      <!-- Divider -->
      <div class="divider">OR CONTINUE WITH</div>

      <!-- Google -->
      <button class="social-btn google" @click="handleGoogleLogin" :disabled="loading">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" />
        Sign in with Google
      </button>

      <!-- GitHub -->
      <button class="social-btn github" @click="handleGithubLogin" :disabled="loading">
        <img src="https://www.svgrepo.com/show/512317/github-142.svg" />
        Sign in with GitHub
      </button>

      <!-- Footer -->
      <p class="footer">
        Don't have an account?
        <span @click="router.push('/signup')">Sign up</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import logo from "@/assets/logo_f.png";
import arrowLeft from "@/assets/arrow-left.svg";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { forgotPassword } from "@/services/authService";
import { isValidEmail, isValidPassword } from "@/utils/validators";

import {
  loginWithEmail,
  loginWithGoogle,
  loginWithGithub,
} from "@/services/authService";

function getErrorMessage(err) {
  // Handle backend API errors
  if (err?.response?.data?.detail) {
    return err.response.data.detail;
  }
  // Handle popup/network errors
  if (err?.message) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

const handleForgotPassword = async () => {
  error.value = "";
  success.value = "";

  if (!email.value) {
    error.value = "Please enter your email first.";
    return;
  }

  if (!isValidEmail(email.value)) {
    error.value = "Please enter a valid email address.";
    return;
  }

  try {
    loading.value = true;

    await forgotPassword(email.value);

    success.value =
      "If an account exists with this email, you will receive a password reset link.";
  } catch (err) {
    success.value = "";
    error.value =
      err?.message || "Failed to send password reset email.";
  } finally {
    loading.value = false;
  }
};

const handleEmailLogin = async () => {
  try {
    error.value = "";
    success.value = "";
    
    if (!email.value || !password.value) {
      error.value = "Please enter both email and password.";
      return;
    }

    if (!isValidEmail(email.value)) {
      error.value = "Please enter a valid email address.";
      return;
    }

    loading.value = true;

    await loginWithEmail(email.value, password.value);
    router.push("/dashboard");
  } catch (err) {
    error.value = getErrorMessage(err);
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  try {
    loading.value = true;
    error.value = "";
    success.value = "";

    const user = await loginWithGoogle();
    // If user is undefined, we're in redirect flow (mobile) — page is navigating away
    if (user) router.push("/dashboard");

  } catch (err) {
    console.error('Google login error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      error.value = "Sign in was cancelled.";
    } else if (err?.message?.includes('network') || err?.message?.includes('Network')) {
      error.value = "Network error. Please check your internet connection.";
    } else {
      error.value = getErrorMessage(err) || "Google sign-in failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};

const handleGithubLogin = async () => {
  try {
    loading.value = true;
    error.value = "";
    success.value = "";

    const user = await loginWithGithub();
    if (user) router.push("/dashboard");

  } catch (err) {
    console.error('GitHub login error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      error.value = "Sign in was cancelled.";
    } else if (err?.message?.includes('network') || err?.message?.includes('Network')) {
      error.value = "Network error. Please check your internet connection.";
    } else {
      error.value = getErrorMessage(err) || "GitHub sign-in failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};

</script>

<style scoped>
/* Page */
* {
  margin: 0;
  padding: 0;
}

.page {
  min-height: 100vh;
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-primary);
}

/* Back */
.back {
  position: absolute;
  top: 24px;
  left: 32px;
  display: flex;
  gap: 8px;
  cursor: pointer;
  opacity: 0.8;
}

.arrow {
  width: 18px;
}

.error-msg {
  margin-top: 15px;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 14px;
}

.success-msg {
  margin-top: 15px;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 14px;
}

/* App title */
.app-title {
  margin-top: 10px;
  margin-bottom: 10px;
}

.icon {
  color: var(--accent);
  margin-right: 2px;
}

/* Card */
.card {
  width: 100%;
  max-width: 500px;
  padding: 36px;
  border-radius: 12px;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.2s ease;
  margin-bottom: 20px;
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

/* ===== Google & GitHub Button Base ===== */
.social-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  background: var(--bg-surface);
  color: var(--text-primary);
  font-weight: 700;
  border: 1px solid var(--border-default);
  transition: all 0.25s ease;
}

/* ===== Hover Effect ===== */
.social-btn:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
  transform: translateY(-2px);
  border: 1px solid var(--border-medium);
  box-shadow: var(--shadow-md);
}

.social-btn img {
  width: 18px;
  transition: filter 0.25s ease;
}

.social-btn:hover img {
  filter: none;
}

.google {
  transition: all 0.25s ease;
}

.google:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

/* GitHub hover */
.github {
  transition: all 0.25s ease;
}

.github:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

/* Forgot password hover */
.forgot {
  transition: color 0.2s ease;
}

.forgot:hover {
  color: var(--accent-light);
  text-decoration: underline;
}

/* Sign up hover */
.footer span {
  transition: color 0.2s ease;
}

.footer span:hover {
  color: var(--accent-light);
  text-decoration: underline;
}

/* Headings */
h1 {
  text-align: center;
  margin-bottom: 6px;
}

.subtitle {
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 28px;
}

/* Labels */
label {
  font-size: 14px;
  margin-top: 14px;
  display: block;
}


/* Inputs */
input {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  border-radius: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
}

/* Password row */
.password-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot {
  font-size: 12px;
  color: var(--accent);
  cursor: pointer;
}

/* Primary button */
.primary-btn {
  width: 100%;
  padding: 14px;
  background: var(--accent);
  border: none;
  border-radius: 12px;
  color: var(--text-on-accent);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
}

.primary-btn:hover {
  background: var(--accent-dark);
}

/* Divider */
.divider {
  text-align: center;
  color: var(--text-dim);
  font-size: 12px;
  margin: 22px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  height: 2px;
  width: 30%;
  background: var(--bg-surface);
  position: absolute;
  top: 50%;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

/* Footer */
.footer {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  color: var(--text-muted);
}

.footer span {
  color: var(--accent);
  cursor: pointer;
}

/* ===== Mobile Responsive ===== */
@media (max-width: 640px) {
  .page {
    padding: 16px;
  }

  .back {
    top: 16px;
    left: 16px;
    font-size: 13px;
  }

  .app-title {
    margin-top: 48px;
  }

  .app-title .icon {
    width: 72px;
  }

  .card {
    padding: 24px 18px;
    border-radius: 12px;
  }

  h1 {
    font-size: 1.4rem;
  }

  .subtitle {
    font-size: 13px;
    margin-bottom: 20px;
  }

  .primary-btn {
    padding: 12px;
    font-size: 15px;
  }

  .social-btn {
    padding: 11px;
    font-size: 14px;
  }

  .divider {
    margin: 16px 0;
  }
}

@media (max-width: 380px) {
  .card {
    padding: 20px 14px;
  }

  h1 {
    font-size: 1.25rem;
  }
}
</style>
