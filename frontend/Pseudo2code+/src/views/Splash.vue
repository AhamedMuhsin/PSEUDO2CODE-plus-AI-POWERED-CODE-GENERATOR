<template>
  <div class="splash">
    <div class="content">
      <img src="@/assets/logo_f.png" alt="Logo" class="logo" />

      <h1 class="title">Pseudo2Code+</h1>
      <p class="subtitle">From Pseudocode to Code — Instantly.</p>

      <!-- GIF Loader -->
      <img src="@/assets/loading.gif" alt="Loading" class="loader" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "@/services/authService";

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, 1500);
});
</script>

<style scoped>
.splash {
  height: 100vh;
  background: radial-gradient(circle at top, #0f172a, #020617);
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
}

.logo {
  width: 120px;
  margin-bottom: 20px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #6366f1, #22d3ee);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 30px;
}

/* GIF Styling */
.loader {
  width: 60px;
  height: auto;
}

@media (max-width: 480px) {
  .logo {
    width: 80px;
  }
  .title {
    font-size: 1.8rem;
  }
  .subtitle {
    font-size: 0.85rem;
  }
}
</style>
