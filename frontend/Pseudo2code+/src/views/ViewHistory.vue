<template>
  <AuthNavbar />
  <div class="history-page">
    <div class="page-layout">
      <aside class="sidebar">
        <ProfileCard v-if="user" :name="user.name" :email="user.email" :level="user.level" :xp="user.xp"
          :nextXp="user.nextXp" :totalXp="user.totalXp" :streak="user.streak" />
        <NavigationCard />
      </aside>
      <main>
        <header class="history-header">
          <!-- Title row -->
          <div class="header-text">
            <h1>Activity History</h1>
            <p>Track everything you’ve done on the platform</p>
          </div>

          <!-- Search + filter row -->
          <div class="header-controls">
            <div class="search-box">
              <Search size="18" />
              <input v-model="search" placeholder="Search by language, level, or keyword" />
            </div>

            <select v-model="activeFilter">
              <option value="all">All</option>
              <option value="generated_code">Generated</option>
              <option value="visualized_code">Visualized</option>
              <option value="badge_earned">Badges</option>
              <option value="level_up">Levels</option>
            </select>
          </div>
        </header>

        <!-- FILTERS
      <div class="filters">
        <button v-for="f in filters" :key="f.key" :class="{ active: activeFilter === f.key }" @click="setFilter(f.key)">
          {{ f.label }}
        </button>
      </div> -->

        <!-- LIST -->
        <div v-if="filteredActivities.length" class="history-list">
          <div v-for="item in filteredActivities" :key="item.created_at" class="history-item">


            <!-- LEFT ICON -->
            <div class="icon-circle" :class="getColor(item.type)">
              <component :is="getIcon(item.type)" size="18" />
            </div>

            <!-- CENTER CONTENT -->
            <div class="content">
              <p class="title">{{ item.title }}</p>
              <span class="time">{{ formatDate(item.created_at) }}</span>
            </div>

            <!-- RIGHT ACTIONS -->
            <!-- RIGHT ACTIONS -->
            <div class="actions">
              <!-- Generated code -->
              <button v-if="item.type === 'generated_code'" class="btn action-blue" @click.stop="viewCode(item)">
                View Code
              </button>

              <button v-if="item.type === 'visualized_code'" class="btn action-purple" @click.stop="reVisualize(item)">
                Re-visualize
              </button>

              <button v-if="item.type === 'badge_earned'" class="btn action-gold" @click.stop="viewBadge(item)">
                View Badge
              </button>

              <button v-if="item.type === 'level_up'" class="btn action-cyan" @click.stop="viewLevel(item)">
                Level Details
              </button>


              <button v-if="item.type === 'generated_code' || item.type === 'visualized_code'" class="btn danger"
                @click.stop="deleteActivity(item)">
                🗑
              </button>

            </div>

          </div>

        </div>

        <div v-else class="empty">
          No activity found.
        </div>
      </main>
      <BaseModal v-if="showLevelModal" @close="showLevelModal = false">
        <template #header>
          <h3>Level Progress</h3>
        </template>

        <div class="level-modal">
          <div class="level-header">
            <h2>Level {{ user.level }}</h2>
            <p class="muted">
              {{ levelActivity?.title }}
            </p>
          </div>

          <!-- XP Progress -->
          <div class="xp-section">
            <div class="xp-info">
              <span>XP</span>
              <span>{{ user.xp }} / {{ user.nextXp }}</span>
            </div>

            <div class="xp-bar">
              <div class="xp-fill" :style="{ width: xpPercent + '%' }"></div>
            </div>
          </div>

          <!-- XP Rules -->
          <div class="xp-rules">
            <h4>How XP works</h4>
            <ul>
              <li>Generate code → <strong>+10 XP</strong></li>
              <li>Visualize code → <strong>+8 XP</strong></li>
              <li>Earn badge → <strong>+5 XP</strong></li>
              <li>Level up bonus → <strong>+20 XP</strong></li>
            </ul>
          </div>
        </div>
      </BaseModal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { Search } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import ProfileCard from "@/components/dashboard/ProfileCard.vue";
import NavigationCard from "@/components/dashboard/NavigationCard.vue";
import { Code, Eye, Trophy, ArrowUp } from "lucide-vue-next";
import BaseModal from "@/components/common/BaseModal.vue";

const search = ref("");
const route = useRoute();
const router = useRouter();
const user = ref(null);
const stats = ref(null);
const activeFilter = ref("all");
const activities = ref([]);
const showLevelModal = ref(false);
const levelActivity = ref(null);

const filters = [
  { key: "all", label: "All" },
  { key: "generated_code", label: "Generated" },
  { key: "visualized_code", label: "Visualized" },
  { key: "badge_earned", label: "Badges" },
  { key: "level_up", label: "Levels" },
];

onMounted(async () => {
  const res = await api.get("/me");
  const data = res.data;
  user.value = {
    name: data.name,
    email: data.email,
    level: data.stats.level,
    xp: data.stats.xp,
    nextXp: data.stats.xp_next_level,
    totalXp: data.stats.xp,
    streak: data.stats.streak,
  };

  activities.value = data.recent_activity || [];
  if (route.query.type) {
    activeFilter.value = route.query.type;
  }
});

const setFilter = (key) => {
  router.push({
    query: key === "all" ? {} : { type: key }
  });
};
watch(activeFilter, (value) => {
  router.replace({
    query: value === "all" ? {} : { type: value },
  });
});

const getIcon = (type) => {
  switch (type) {
    case "generated_code": return Code;
    case "visualized_code": return Eye;
    case "badge_earned": return Trophy;
    case "level_up": return ArrowUp;
    default: return Code;
  }
};
const filteredActivities = computed(() => {
  let list = activities.value;

  /* 1️⃣ Apply dropdown filter (if selected) */
  if (activeFilter.value !== "all") {
    list = list.filter(a => a.type === activeFilter.value);
  }

  /* 2️⃣ Search logic */
  const query = search.value
    .toLowerCase()
    .trim()
    .split(/\s+/)        // split by spaces
    .filter(Boolean);    // remove empty strings

  if (!query.length) return list;

  return list.filter(a => {
    const haystack = [
      a.title,
      a.type,
      a.meta?.language,
      a.meta?.level,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    // ALL words must be found somewhere
    return query.every(word => haystack.includes(word));
  });
});


const hasActions = (item) => {
  return item.type === "visualized_code" || item.type === "generated_code";
};

const xpPercent = computed(() => {
  if (!user.value) return 0;
  return Math.min(
    Math.round((user.value.xp / user.value.nextXp) * 100),
    100
  );
});

const reVisualize = (item) => {
  if (!item.meta || !item.meta.code || !item.meta.language) {
    console.error("Missing visualization data", item.meta);
    return;
  }

  sessionStorage.setItem("visualize_code", item.meta.code);
  sessionStorage.setItem("visualize_language", item.meta.language);

  router.push("/visualize-playground");
};


const getColor = (type) => {
  switch (type) {
    case "generated_code": return "blue";
    case "visualized_code": return "purple";
    case "badge_earned": return "yellow";
    case "level_up": return "green";
    default: return "blue";
  }
};


const formatDate = (d) => new Date(d).toLocaleString();

const viewCode = (item) => {
  if (!item?.meta) return;

  sessionStorage.setItem(
    "generate_pseudocode",
    item.meta.pseudocode || ""
  );

  sessionStorage.setItem(
    "generate_code",
    item.meta.code || ""
  );

  sessionStorage.setItem(
    "generate_language",
    item.meta.language || "python"
  );

  sessionStorage.setItem(
    "generate_level",
    item.meta.level || "intermediate"
  );

  router.push("/generate-code");
};


const viewBadge = () => {
  router.push("/badges");
};

const viewLevel = (item) => {
  levelActivity.value = item;
  showLevelModal.value = true;
};

const deleteActivity = (item) => {
  alert("Delete coming next");
};
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, #0f172a, transparent 60%),
    radial-gradient(circle at top right, #020617, transparent 60%),
    linear-gradient(180deg, #020617, #020617);
}

.history-container {
  padding: 32px;
  border-radius: 20px;
  background: linear-gradient(145deg, #0b1220, #0e1628);
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 24px;
}

.page-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 28px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

.history-header {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 28px;
}

.header-text h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #f8fafc;
}

.header-text p {
  color: #94a3b8;
  margin-top: 6px;
}

/* Search + filter row */
.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  /* 👈 THIS IS CRITICAL */
}

/* Search box stays wide */
.header-controls .search-box {
  flex: 1;
  width: 100%;
}

/* Filter dropdown */
.header-controls select {
  min-width: 120px;
}

/* Hide actions safely */
.history-item .actions {
  visibility: hidden;
  transform: translateX(8px);
  pointer-events: none;
  transition: transform 0.2s ease;
}

/* Show actions on hover */
.history-item:hover .actions {
  visibility: visible;
  transform: translateX(0);
  pointer-events: auto;
}

.actions .btn {
  white-space: nowrap;
}

.history-item {
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.04);
  box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.15);
}

.code-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.actions .btn {
  background-image: none;
  /* reset */
}

/* Force color buttons to override base .btn */
.actions .action-blue {
  background: #4f46e5 !important;
}

.actions .action-purple {
  background: linear-gradient(135deg, #9333ea, #7c3aed) !important;
}

.actions .action-gold {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: #1f2937 !important;
}

.actions .action-cyan {
  background: linear-gradient(135deg, #06b6d4, #0891b2) !important;
}

.actions .danger {
  background: #020617 !important;
  border-color: #7f1d1d !important;
  color: #fca5a5 !important;
}

.actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-modal {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.level-header h2 {
  font-size: 1.8rem;
  color: #f8fafc;
}

.muted {
  color: #94a3b8;
  font-size: 0.85rem;
}

.xp-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.xp-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #cbd5f5;
}

.xp-bar {
  height: 10px;
  border-radius: 999px;
  background: #020617;
  overflow: hidden;
  border: 1px solid #1e293b;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #22d3ee);
  transition: width 0.3s ease;
}

.xp-rules h4 {
  font-size: 0.95rem;
  margin-bottom: 6px;
}

.xp-rules ul {
  padding-left: 16px;
  color: #94a3b8;
  font-size: 0.8rem;
}

.level-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.level-stats div {
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
}

.level-stats span {
  font-size: 0.7rem;
  color: #94a3b8;
}

.level-stats strong {
  font-size: 1.1rem;
  color: #f8fafc;
}

.code-preview {
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 14px;
  color: #e5e7eb;
  font-size: 0.85rem;
  max-height: 420px;
  overflow: auto;
}

.history-header p {
  color: #94a3b8;
  margin-top: 6px;
}

.controls {
  display: flex;
  gap: 14px;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 12px 16px;
  color: #94a3b8;
  flex: 1;
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  color: #e5e7eb;
  width: 260px;
}

.header-controls select {
  min-width: 160px;
  flex-shrink: 0;
}

/* Filter */
select {
  background: #020617;
  border: 1px solid #1e293b;
  color: #e5e7eb;
  padding: 10px 14px;
  border-radius: 14px;
  cursor: pointer;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content {
  min-width: 0;
}

.page-header h1 {
  color: #f8fafc;
  font-size: 2rem;
}

.page-header p {
  color: #94a3b8;
}

.history-item {
  cursor: pointer;
  transition: background 0.2s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

/* FILTERS */
.filters {
  display: flex;
  gap: 12px;
  margin: 0 auto 24px;
  max-width: 1200px;
}

.meta {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 8px;
}

.filters button {
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
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
  background: rgba(96, 165, 250, 0.18);
  color: #60a5fa;
}

.icon-circle.purple {
  background: rgba(192, 132, 252, 0.18);
  color: #c084fc;
}

.icon-circle.yellow {
  background: rgba(250, 204, 21, 0.18);
  color: #facc15;
}

.icon-circle.green {
  background: rgba(34, 197, 94, 0.18);
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
