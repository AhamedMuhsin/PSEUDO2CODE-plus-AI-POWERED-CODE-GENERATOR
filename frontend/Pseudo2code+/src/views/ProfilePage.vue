<template>
  <AuthNavbar />
  <main class="profile-page">
    <div class="profile-container">
      <section class="header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </section>

      <!-- Personal Information -->
      <section class="card">
        <h3>Personal Information</h3>
        <div class="profile-row">
          <div class="avatar">{{ initials }}</div>
          <button class="btn ghost">Change Avatar</button>
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

        <button class="btn primary" @click="saveProfile">Save Changes</button>
      </section>

      <!-- Change Password -->
      <section class="card">
        <h3>Change Password</h3>
        <div class="form-grid single">
          <div>
            <label>Current Password</label>
            <input v-model="password.current" type="password" />
          </div>
          <div>
            <label>New Password</label>
            <input v-model="password.new" type="password" />
          </div>
          <div>
            <label>Confirm Password</label>
            <input v-model="password.confirm" type="password" />
          </div>
        </div>
        <button class="btn primary" @click="updatePassword">Update Password</button>
      </section>

      <!-- Danger Zone -->
      <section class="card danger">
        <h3>Danger Zone</h3>
        <p>Permanently delete your account and all data</p>
        <button class="btn danger-btn" @click="showDeleteModal = true">
          Delete
        </button>

      </section>
      <ConfirmModal v-if="showDeleteModal" title="Delete Account"
        message="This action is irreversible. All your data will be permanently deleted." confirmText="Delete"
        @cancel="showDeleteModal = false" @confirm="confirmDelete" />

    </div>
  </main>
</template>
<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"

import { fetchMe } from "@/services/userService"
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import ConfirmModal from "@/components/common/ConfirmModal.vue"
import { updateProfile, deleteAccount } from "@/services/profileService"
import { logout } from "@/services/authService"

const router = useRouter()
const showDeleteModal = ref(false)

// ✅ FORM STATE
const form = ref({
  name: "",
  email: "",
})

// ✅ PASSWORD STATE
const password = ref({
  current: "",
  new: "",
  confirm: "",
})

// ✅ LOAD USER DATA
onMounted(async () => {
  const me = await fetchMe()
  form.value.name = me.name
  form.value.email = me.email
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

// ✅ SAVE PROFILE
async function saveProfile() {
  try {
    await updateProfile(form.value.name)
    alert("Profile updated ✅")
  } catch (err) {
    alert("Failed to update profile ❌")
  }
}

async function confirmDelete() {
  try {
    showDeleteModal.value = false
    await deleteAccount()
  } catch (err) {
    console.error(err)
  } finally {
    // Always logout & redirect
    await logout()
    router.push("/login")
  }
}


// ✅ UPDATE PASSWORD (frontend validation only)
async function updatePassword() {
  if (!password.value.current || !password.value.new) {
    alert("Please fill all password fields")
    return
  }

  if (password.value.new !== password.value.confirm) {
    alert("Passwords do not match")
    return
  }

  // 🔴 Backend endpoint not implemented yet
  alert("Password update backend not wired yet ⚠️")
}

// ✅ DELETE ACCOUNT
async function handleDeleteAccount() {
  const confirmed = confirm(
    "This action is irreversible. Your account will be permanently deleted."
  )

  if (!confirmed) return

  try {
    await deleteAccount()
    await logout()
    router.push("/login")
  } catch (err) {
    alert("Failed to delete account ❌")
  }
}

</script>

<style scoped>
.profile-page {
  /* min-height: calc(100vh - 70px); */
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 32px;
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

.profile-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(99, 102, 241, .2);
  color: #c7d2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
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

label {
  font-size: .8rem;
  color: #94a3b8;
}

input {
  width: 100%;
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, .08);
  color: #e5e7eb;
}

.btn {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.btn.primary {
  background: #6366f1;
  color: white;
}

.btn.ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, .15);
  color: #e5e7eb;
}

.card.danger {
  border: 1px solid rgba(239, 68, 68, .4);
}

.danger-btn {
  background: #ef4444;
  color: white;
}
</style>
