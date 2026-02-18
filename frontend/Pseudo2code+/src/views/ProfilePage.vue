<template>
  <AuthNavbar />
  <main class="profile-page">
    <div class="profile-container">
      <!-- BACK BUTTON -->
      <div class="back-top-bar">
        <button class="back-btn-compact" @click="router.push('/dashboard')">
          <img :src="arrowLeft" class="arrow" />
          Back
        </button>
      </div>

      <section class="header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </section>

      <!-- Personal Information -->
      <section class="card">
        <h3>Personal Information</h3>
        <div class="profile-row">
          <div class="avatar-wrapper">
            <div class="avatar" :style="{ backgroundImage: form.avatar ? `url(${form.avatar})` : '' }">
              {{ !form.avatar ? initials : '' }}
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleAvatarChange"
            />
          </div>
          <div class="avatar-actions">
            <button class="btn ghost" @click="$refs.avatarInput.click()">
              Change Avatar
            </button>
            <button v-if="form.avatar" class="btn ghost" @click="removeAvatar">
              Remove Avatar
            </button>
          </div>
        </div>

        <div class="form-grid">
          <div>
            <label>Full Name</label>
            <input v-model="form.name" type="text" />
          </div>
          <div>
            <label>Email</label>
            <input v-model="form.email" type="email" disabled />
          </div>
        </div>

        <div v-if="successMessage" class="success-msg">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>

        <button class="btn primary" @click="saveProfile" :disabled="isLoading">
          {{ isLoading ? "Saving..." : "Save Changes" }}
        </button>
      </section>

      <!-- Change Password -->
      <section class="card">
        <h3>Change Password</h3>
        <div class="form-grid single">
          <div>
            <label>Current Password</label>
            <input v-model="password.current" type="password" placeholder="Enter your current password" />
          </div>
          <div>
            <label>New Password</label>
            <input v-model="password.new" type="password" placeholder="Enter your new password" />
          </div>
          <div>
            <label>Confirm Password</label>
            <input v-model="password.confirm" type="password" placeholder="Confirm your new password" />
          </div>
        </div>

        <div v-if="passwordSuccessMessage" class="success-msg">{{ passwordSuccessMessage }}</div>
        <div v-if="passwordErrorMessage" class="error-msg">{{ passwordErrorMessage }}</div>

        <button class="btn primary" @click="updatePassword" :disabled="isPasswordLoading">
          {{ isPasswordLoading ? "Updating..." : "Update Password" }}
        </button>
      </section>

      <!-- Danger Zone -->
      <section class="card danger">
        <h3>Danger Zone</h3>
        <p>Permanently delete your account and all data</p>
        <button class="btn danger-btn" @click="showDeleteModal = true">
          Delete Account
        </button>
      </section>

      <ConfirmModal
        v-if="showDeleteModal"
        title="Delete Account"
        message="This action is irreversible. All your data will be permanently deleted."
        confirmText="Delete"
        isDanger
        @cancel="showDeleteModal = false"
        @confirm="confirmDelete"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/userStore"
import arrowLeft from '@/assets/arrow-left.svg';

import { fetchMe } from "@/services/userService"
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import ConfirmModal from "@/components/common/ConfirmModal.vue"
import { updateProfile, changePassword, deleteAccount } from "@/services/profileService"
import { logout } from "@/services/authService"

const router = useRouter()
const userStore = useUserStore()
const showDeleteModal = ref(false)
const avatarInput = ref(null)

// ✅ FORM STATE
const form = ref({
  name: "",
  email: "",
  avatar: "",
})

// ✅ PASSWORD STATE
const password = ref({
  current: "",
  new: "",
  confirm: "",
})

// ✅ LOADING & MESSAGE STATES
const isLoading = ref(false)
const isPasswordLoading = ref(false)
const successMessage = ref("")
const errorMessage = ref("")
const passwordSuccessMessage = ref("")
const passwordErrorMessage = ref("")

// ✅ LOAD USER DATA
onMounted(async () => {
  try {
    const me = await fetchMe()
    form.value.name = me.name
    form.value.email = me.email
    form.value.avatar = me.avatar || ""
  } catch (err) {
    errorMessage.value = "Failed to load profile data"
    console.error(err)
  }
})

// ✅ AVATAR INITIALS
const initials = computed(() => {
  if (!form.value.name) return "?"
  return form.value.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
})

// ✅ HANDLE AVATAR CHANGE
async function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = "Image size must be less than 5MB"
    return
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    errorMessage.value = "Please select a valid image file"
    return
  }

  try {
    // Convert to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.avatar = e.target.result
      successMessage.value = "Avatar updated! Click 'Save Changes' to confirm."
      errorMessage.value = ""
    }
    reader.readAsDataURL(file)
  } catch (err) {
    errorMessage.value = "Failed to process image"
    console.error(err)
  }
}

// ✅ REMOVE AVATAR
async function removeAvatar() {
  try {
    errorMessage.value = ""
    successMessage.value = ""
    
    isLoading.value = true
    
    // Remove avatar from form
    form.value.avatar = ""
    
    // Save profile without avatar
    await updateProfile({
      name: form.value.name.trim(),
      avatar: "",
    })
    
    successMessage.value = "✅ Avatar removed successfully"
    
    // Update global user store so changes reflect everywhere
    userStore.updateUser({
      name: form.value.name.trim(),
      avatar: "",
    })
  } catch (err) {
    errorMessage.value = "❌ Failed to remove avatar"
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// ✅ SAVE PROFILE
async function saveProfile() {
  try {
    errorMessage.value = ""
    successMessage.value = ""

    if (!form.value.name || !form.value.name.trim()) {
      errorMessage.value = "Name cannot be empty"
      return
    }

    isLoading.value = true
    await updateProfile({
      name: form.value.name.trim(),
      avatar: form.value.avatar,
    })
    successMessage.value = "✅ Profile updated successfully"

    // Update global user store so changes reflect everywhere
    userStore.updateUser({
      name: form.value.name.trim(),
      avatar: form.value.avatar,
    })
  } catch (err) {
    errorMessage.value = "❌ Failed to update profile"
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// ✅ UPDATE PASSWORD
async function updatePassword() {
  try {
    passwordErrorMessage.value = ""
    passwordSuccessMessage.value = ""

    // Validation
    if (!password.value.current) {
      passwordErrorMessage.value = "Please enter your current password"
      return
    }

    if (!password.value.new) {
      passwordErrorMessage.value = "Please enter a new password"
      return
    }

    if (password.value.new.length < 6) {
      passwordErrorMessage.value = "New password must be at least 6 characters"
      return
    }

    if (password.value.new !== password.value.confirm) {
      passwordErrorMessage.value = "New passwords do not match"
      return
    }

    if (password.value.current === password.value.new) {
      passwordErrorMessage.value = "New password must be different from current password"
      return
    }

    isPasswordLoading.value = true
    await changePassword({
      currentPassword: password.value.current,
      newPassword: password.value.new,
    })

    // Clear password fields
    password.value.current = ""
    password.value.new = ""
    password.value.confirm = ""

    passwordSuccessMessage.value = "✅ Password changed successfully"
  } catch (err) {
    if (err.response?.status === 401) {
      passwordErrorMessage.value = "❌ Current password is incorrect"
    } else {
      passwordErrorMessage.value = "❌ Failed to change password"
    }
    console.error(err)
  } finally {
    isPasswordLoading.value = false
  }
}

// ✅ DELETE ACCOUNT
async function confirmDelete() {
  try {
    showDeleteModal.value = false
    await deleteAccount()
    // Logout and redirect
    await logout()
    router.push("/login")
  } catch (err) {
    errorMessage.value = "❌ Failed to delete account"
    console.error(err)
  }
}
</script>

<style scoped>
/* ════════ BACK ════════ */
.back-top-bar { flex-shrink: 0; }
.back-btn-compact { display: flex; align-items: center; gap: 6px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #e0e7ff; padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
.back-btn-compact:hover { background: rgba(99,102,241,0.25); transform: translateX(-2px); }
.arrow { width: 16px; height: 16px; }

.profile-page {
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 32px;
  min-height: calc(100vh - 70px);
}

.profile-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Mobile */
@media (max-width: 640px) {
  .profile-page {
    padding: 16px;
  }
}

.header h1 {
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 8px;
}

.header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
}

.card h3 {
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.card p {
  color: #cbd5e1;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.profile-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.2);
  color: #c7d2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.4rem;
  background-size: cover;
  background-position: center;
  border: 2px solid rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.form-grid.single {
  grid-template-columns: 1fr;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-row {
    flex-direction: column;
  }
}

label {
  font-size: 0.8rem;
  color: #94a3b8;
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(2, 6, 23, 0.8);
}

input:disabled {
  background: rgba(30, 41, 59, 0.5);
  color: #64748b;
  cursor: not-allowed;
}

.btn {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.btn.ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e5e7eb;
}

.btn.ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}

.card.danger {
  border: 1px solid rgba(239, 68, 68, 0.4);
  background: rgba(127, 29, 29, 0.1);
}

.danger-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 12px 24px;
}

.danger-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

.success-msg {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  margin-bottom: 16px;
  animation: slideIn 0.3s ease;
}

.error-msg {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  margin-bottom: 16px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
