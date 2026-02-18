<template>
  <div class="page">
    <!-- Back -->
    <div class="back" @click="router.push('/')">
      <img :src="arrowLeft" class="arrow" />
      Back to Home
    </div>

    <!-- Logo -->
    <div class="app-title">
      <img :src="logo" alt="pseudo2code logo" class="icon" width="100" />
    </div>

    <!-- Card -->
    <div class="card">
      <h1>Create Account</h1>
      <p class="subtitle">Start your coding journey today</p>

      <!-- Full Name -->
      <label>Full Name</label>
      <input v-model="name" type="text" placeholder="John Doe" />

      <!-- Email -->
      <label>Email</label>
      <input v-model="email" type="email" placeholder="you@example.com" />

      <!-- Password -->
      <label>Password</label>
      <input v-model="password" type="password" placeholder="••••••••" />

      <!-- Confirm Password -->
      <label>Confirm Password</label>
      <input v-model="confirmPassword" type="password" placeholder="••••••••" />

      <!-- Create -->
      <p v-if="error" class="error-msg">{{ error }}</p>
      <p v-if="success" class="success-msg">{{ success }}</p>

      <button class="primary-btn" @click="handleSignup" :disabled="loading">
        Create Account
      </button>

      <!-- Divider -->
      <div class="divider">OR CONTINUE WITH</div>

      <!-- Google -->
      <button class="social-btn google" @click="handleGoogle">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" />
        Sign up with Google
      </button>

      <!-- GitHub -->
      <button class="social-btn github" @click="handleGithub">
        <img src="https://www.svgrepo.com/show/512317/github-142.svg" />
        Sign up with GitHub
      </button>

      <!-- Footer -->
      <p class="footer">
        Already have an account?
        <span @click="router.push('/login')">Sign in</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import logo from "@/assets/logo_f.png";
import arrowLeft from "@/assets/arrow-left.svg";

import {
  signupWithEmail,
  loginWithGoogle,
  loginWithGithub,
} from "@/services/authService";
import { isValidEmail, isValidPassword } from "@/utils/validators";

function getErrorMessage(err) {
  if (err?.response?.data?.detail) {
    return err.response.data.detail;
  }
  if (err?.message) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

const handleSignup = async () => {
  error.value = "";
  success.value = "";

  if (!name.value || !name.value.trim()) {
    error.value = "Please enter your full name.";
    return;
  }

  if (!email.value) {
    error.value = "Please enter your email address.";
    return;
  }

  if (!isValidEmail(email.value)) {
    error.value = "Please enter a valid email address.";
    return;
  }

  if (!isValidPassword(password.value)) {
    error.value = "Password must be at least 6 characters.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    return;
  }

  try {
    loading.value = true;

    await signupWithEmail(email.value, password.value, name.value);
    router.push("/dashboard");
  } catch (err) {
    error.value = getErrorMessage(err);
  } finally {
    loading.value = false;
  }
};

const handleGoogle = async () => {
  try {
    error.value = "";
    success.value = "";
    loading.value = true;
    
    await loginWithGoogle();
    router.push("/dashboard");
  } catch (err) {
    console.error('Google signup error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      error.value = "Sign up was cancelled.";
    } else {
      error.value = getErrorMessage(err) || "Google sign-up failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};

const handleGithub = async () => {
  try {
    error.value = "";
    success.value = "";
    loading.value = true;
    
    await loginWithGithub();
    router.push("/dashboard");
  } catch (err) {
    console.error('GitHub signup error:', err);
    if (err.code === 'auth/popup-closed-by-user') {
      error.value = "Sign up was cancelled.";
    } else {
      error.value = getErrorMessage(err) || "GitHub sign-up failed. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-primary);
}

.back {
  position: absolute;
  top: 24px;
  left: 32px;
  display: flex;
  gap: 8px;
  cursor: pointer;
  opacity: 0.8;
}

/* Divider */
.divider {
  text-align: center;
  color: var(--text-dim);
  font-size: 12px;
  margin: 22px 0;
  position: relative;
}

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

.arrow {
  width: 18px;
}

.error-msg {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 14px;
}

.success-msg {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 14px;
}

.app-title {
  margin-top: 10px;
  margin-bottom: 10px;
}

.icon {
  color: var(--accent);
  margin-right: 2px;
}

.card {
  /* margin-top: 30px; */
  margin-bottom: 20px;
  width: 100%;
  max-width: 500px;
  padding: 36px;
  border-radius: 12px;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

h1 {
  text-align: center;
  margin-bottom: 6px;
}

.subtitle {
  text-align: center;
  opacity: 0.7;
  margin-bottom: 24px;
}

label {
  font-size: 14px;
  margin-top: 14px;
  display: block;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  border-radius: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
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

.divider {
  margin: 22px 0;
  text-align: center;
  font-size: 12px;
  opacity: 0.6;
}

.github {
  transition: all 0.25s ease;
}

.github:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.footer span {
  transition: color 0.2s ease;
}

.footer span:hover {
  color: var(--accent-light);
  text-decoration: underline;
}

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
    margin-bottom: 18px;
  }

  label {
    font-size: 13px;
    margin-top: 10px;
  }

  input {
    padding: 10px;
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
