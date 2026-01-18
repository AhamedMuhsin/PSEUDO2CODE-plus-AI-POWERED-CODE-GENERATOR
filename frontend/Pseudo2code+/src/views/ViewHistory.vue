<template>
  <AuthNavbar />

  <main class="history-container">
    <header class="page-header">
      <h1>Code History</h1>
      <p>Your learning timeline</p>
    </header>

    <!-- FILTERS -->
    <div class="filters">
      <button v-for="f in filters" :key="f.key" :class="{ active: activeFilter === f.key }"
        @click="activeFilter = f.key">
        {{ f.label }}
      </button>
    </div>

    <!-- TIMELINE -->
    <div v-if="filteredActivities.length" class="history-list">
      <div v-for="(item, index) in filteredActivities" :key="index" class="history-item">
        <div class="icon-circle" :class="getColor(item.type)">
          <component :is="getIcon(item.type)" size="16" />
        </div>

        <div class="content">
          <p class="title">{{ item.title }}</p>
          <span class="time">
            {{ formatDate(item.created_at) }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="empty">
      No activity found for this filter.
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import {
  Code,
  Eye,
  Trophy,
  ArrowUp
} from "lucide-vue-next";


const activities = ref([]);
const activeFilter = ref("all");

const filters = [
  { key: "all", label: "All" },
  { key: "generated_code", label: "Generated" },
  { key: "visualized_code", label: "Visualized" },
  { key: "badge_earned", label: "Badges" },
  { key: "level_up", label: "Level Ups" },
];

onMounted(async () => {
  const res = await api.get("/me");
  activities.value = res.data.recent_activity || [];
});
const filteredActivities = computed(() => {
  if (activeFilter.value === "all") {
    return activities.value;
  }
  return activities.value.filter(
    (a) => a.type === activeFilter.value
  );
});

const getIcon = (type) => {
  switch (type) {
    case "generated_code":
      return Code;
    case "visualized_code":
      return Eye;
    case "badge_earned":
      return Trophy;
    case "level_up":
      return ArrowUp;
    default:
      return Code;
  }
};

const getColor = (type) => {
  switch (type) {
    case "generated_code":
      return "blue";
    case "visualized_code":
      return "purple";
    case "badge_earned":
      return "yellow";
    case "level_up":
      return "green";
    default:
      return "blue";
  }
};

const formatDate = (date) =>
  new Date(date).toLocaleString();

</script>

<style scoped>
  .history-container {
  min-height: 100vh;
  padding: 40px 24px;
  background: radial-gradient(circle at top, #0f172a, #020617);
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 24px;
}

.page-header h1 {
  color: #f8fafc;
  font-size: 2rem;
}

.page-header p {
  color: #94a3b8;
}

/* FILTERS */
.filters {
  display: flex;
  gap: 12px;
  margin: 0 auto 24px;
  max-width: 1200px;
}

.filters button {
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  color: #cbd5f5;
  border: none;
  cursor: pointer;
}

.filters button.active {
  background: #6366f1;
  color: white;
}

/* LIST */
.history-list {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.history-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: rgba(15, 23, 42, 0.85);
  padding: 16px;
  border-radius: 14px;
}

/* ICON */
.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.icon-circle.blue {
  background: rgba(96,165,250,0.18);
  color: #60a5fa;
}

.icon-circle.purple {
  background: rgba(192,132,252,0.18);
  color: #c084fc;
}

.icon-circle.yellow {
  background: rgba(250,204,21,0.18);
  color: #facc15;
}

.icon-circle.green {
  background: rgba(34,197,94,0.18);
  color: #22c55e;
}

/* CONTENT */
.content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 10px;
}
.title {
  color: #e5e7eb;
}

.time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.empty {
  text-align: center;
  color: #94a3b8;
  margin-top: 60px;
}

.history-container {
  min-height: 100vh;
  padding: 40px 24px;
  background: radial-gradient(circle at top, #0f172a, #020617);
}

/* Header */
.page-header {
  max-width: 1200px;
  margin: 0 auto 32px;
}

.page-header h1 {
  color: #f8fafc;
  font-size: 2.2rem;
  font-weight: 800;
}

.page-header p {
  color: #94a3b8;
  margin-top: 6px;
}

.search-input {
  margin-top: 20px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  background: #020617;
  border: 1px solid #1e293b;
  color: #e5e7eb;
}

/* Grid */
.history-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* Card */
.history-card {
  background: linear-gradient(145deg, #0b1220, #0e1628);
  border: 1px solid #1e293b;
  border-radius: 18px;
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.history-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.title {
  color: #f8fafc;
  font-size: 1.05rem;
  font-weight: 600;
}

/* Tags */
.tags {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.tag {
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 600;
}

.lang {
  background: #1e40af;
  color: #e0e7ff;
  text-transform: uppercase;
}

.level {
  background: #374151;
  color: #e5e7eb;
}

/* Date */
.date {
  margin-top: 10px;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Actions */
.actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  padding: 8px;
  border-radius: 10px;
  background: #020617;
  border: 1px solid #1e293b;
  color: #e5e7eb;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn.primary {
  background: #4f46e5;
  border-color: #4f46e5;
}

.btn.danger {
  flex: 0;
  width: 40px;
  background: #020617;
  border-color: #7f1d1d;
  color: #fca5a5;
}

/* Empty */
.empty-state {
  text-align: center;
  color: #94a3b8;
  margin-top: 80px;
}
</style>
