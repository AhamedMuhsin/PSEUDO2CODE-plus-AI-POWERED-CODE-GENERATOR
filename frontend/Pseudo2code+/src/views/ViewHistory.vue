<template>
  <AuthNavbar />

  <main class="history-container">
    <header class="page-header">
      <h1>Code History</h1>
      <p>Your previously generated code snippets</p>
    </header>

    <section v-if="history.length" class="history-list">
      <div
        v-for="(item, index) in history"
        :key="index"
        class="history-card"
      >
        <div class="meta">
          <span class="lang">{{ item.language }}</span>
          <span class="level">{{ item.level }}</span>
          <span class="date">{{ formatDate(item.created_at) }}</span>
        </div>

        <p class="pseudocode">
          {{ item.pseudocode }}
        </p>
      </div>
    </section>

    <div v-else class="empty-state">
      No history yet. Generate some code first 🚀
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import api from "@/services/api";

const history = ref([]);

onMounted(async () => {
  try {
    const res = await api.get("/me");
    history.value = res.data.generated_codes || [];
  } catch (err) {
    console.error("Failed to load history", err);
  }
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString();
};
</script>

<style scoped>
.history-container {
  min-height: 100vh;
  padding: 40px 24px;
  background: radial-gradient(circle at top, #0f172a, #020617);
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 32px;
}

.page-header h1 {
  color: #f8fafc;
  font-size: 2rem;
  font-weight: 800;
}

.page-header p {
  color: #94a3b8;
  margin-top: 6px;
}

.history-list {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 18px;
}

.history-card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.meta {
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
  color: #cbd5f5;
}

.lang {
  text-transform: uppercase;
  font-weight: 600;
}

.level {
  opacity: 0.8;
}

.pseudocode {
  margin-top: 12px;
  color: #e5e7eb;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  margin-top: 80px;
}
</style>
