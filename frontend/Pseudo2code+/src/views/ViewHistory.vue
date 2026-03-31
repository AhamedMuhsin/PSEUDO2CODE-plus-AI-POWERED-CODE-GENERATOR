<template>
  <AuthNavbar />
  <div class="history-page">
    <div class="page-layout">
      <aside class="sidebar">
        <ProfileCard v-if="user" :name="user.name" :email="user.email" :avatar="user.avatar" :level="user.level" :xp="user.xp"
          :nextXp="user.nextXp" :totalXp="user.totalXp" :streak="user.streak" />
        <NavigationCard />
      </aside>
      <main>
        <!-- BACK BUTTON -->
        <div class="back-top-bar">
          <button class="back-btn-compact" @click="router.push('/dashboard')">
            <img :src="arrowLeft" class="arrow" />
            Back
          </button>
        </div>

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
import { useUserStore } from "@/stores/userStore"
import { Search } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import arrowLeft from '@/assets/arrow-left.svg';
import api from "@/services/api";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import ProfileCard from "@/components/dashboard/ProfileCard.vue";
import NavigationCard from "@/components/dashboard/NavigationCard.vue";
import { Code, Eye, Trophy, ArrowUp } from "lucide-vue-next";
import BaseModal from "@/components/common/BaseModal.vue";

const userStore = useUserStore()
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
    avatar: data.avatar || "",
    level: data.stats.level,
    xp: data.stats.xp,
    nextXp: data.stats.xp_next_level,
    totalXp: data.stats.xp,
    streak: data.stats.streak,
  };

  // Update global store
  userStore.setUser(user.value)

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
  sessionStorage.setItem("visualize_source", "history");

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


const viewBadge = (item) => {
  const badgeId = item.meta?.badge_id;

  if (!badgeId) {
    console.warn("No badge_id found in activity");
    router.push("/badges");
    return;
  }

  router.push({
    path: "/badges",
    query: { highlight: badgeId }
  });
};

const viewLevel = (item) => {
  levelActivity.value = item;
  showLevelModal.value = true;
};

const deleteActivity = async (activity) => {
  const backup = [...activities.value]

  // instant UI update
  activities.value = activities.value.filter(
    a => a.created_at !== activity.created_at
  )

  try {
    await api.delete("/activity", {
      data: activity
    })
  } catch (err) {
    console.error("Delete failed", err)
    activities.value = backup
  }
}

</script>

<style scoped>
/* ════════ BACK ════════ */
.back-top-bar { flex-shrink: 0; }
.back-btn-compact { display: flex; align-items: center; gap: 6px; background: var(--accent-bg); border: 1px solid var(--accent-border); color: var(--accent-lighter); padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
.back-btn-compact:hover { background: var(--accent-bg-hover); transform: translateX(-2px); }
.arrow { width: 16px; height: 16px; }

.history-page {
  min-height: 100vh;
  background: var(--bg-page);
}

.history-container {
  padding: 32px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
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
  color: var(--text-primary);
}

.header-text p {
  color: var(--text-muted);
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
  background: var(--bg-elevated);
  box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.15);
}

.code-meta {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.actions .btn {
  background-image: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

/* Force color buttons to override base .btn */
.actions .action-blue {
  background: var(--accent-bg) !important;
  color: var(--accent-lighter) !important;
  border-color: var(--accent-border) !important;
}

.actions .action-blue:hover {
  background: var(--accent-bg-hover) !important;
  border-color: var(--accent-light) !important;
  transform: translateY(-1px);
}

.actions .action-purple {
  background: var(--accent-bg) !important;
  color: var(--accent-lighter) !important;
  border-color: var(--accent-border) !important;
}

.actions .action-purple:hover {
  background: var(--accent-bg-hover) !important;
  border-color: var(--accent-light) !important;
  transform: translateY(-1px);
}

.actions .action-gold {
  background: var(--warning-bg) !important;
  color: var(--warning) !important;
  border-color: rgba(234, 179, 8, 0.2) !important;
}

.actions .action-gold:hover {
  background: rgba(234, 179, 8, 0.15) !important;
  transform: translateY(-1px);
}

.actions .action-cyan {
  background: var(--success-bg) !important;
  color: var(--success) !important;
  border-color: rgba(34, 197, 94, 0.2) !important;
}

.actions .action-cyan:hover {
  background: rgba(34, 197, 94, 0.15) !important;
  transform: translateY(-1px);
}

.actions .danger {
  background: var(--error-bg) !important;
  border-color: var(--error-border) !important;
  color: var(--error) !important;
}

.actions .danger:hover {
  background: rgba(239, 68, 68, 0.12) !important;
  transform: translateY(-1px);
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
  color: var(--text-primary);
}

.muted {
  color: var(--text-muted);
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
  color: var(--text-tertiary);
}

.xp-bar {
  height: 10px;
  border-radius: 999px;
  background: var(--bg-page);
  overflow: hidden;
  border: 1px solid var(--border-default);
}

.xp-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
}

.xp-rules h4 {
  font-size: 0.95rem;
  margin-bottom: 6px;
}

.xp-rules ul {
  padding-left: 16px;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.level-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.level-stats div {
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 10px;
  text-align: center;
}

.level-stats span {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.level-stats strong {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.code-preview {
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 14px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  max-height: 420px;
  overflow: auto;
}

.history-header p {
  color: var(--text-muted);
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
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--text-muted);
  flex: 1;
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-secondary);
  width: 260px;
}

.header-controls select {
  min-width: 160px;
  flex-shrink: 0;
}

/* Filter */
select {
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  padding: 10px 14px;
  border-radius: 12px;
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
  color: var(--text-primary);
  font-size: 2rem;
}

.page-header p {
  color: var(--text-muted);
}

.history-item {
  cursor: pointer;
  transition: background 0.2s ease;
}

.history-item:hover {
  background: var(--bg-elevated);
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
  color: var(--text-muted);
  margin-bottom: 8px;
}

.filters button {
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--border-default);
  color: var(--text-tertiary);
  border: none;
  cursor: pointer;
}

.filters button.active {
  background-color: var(--accent);
  color: var(--text-primary);
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
  background: var(--bg-card);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border-default);
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
  color: var(--accent-light);
}

.icon-circle.purple {
  background: rgba(192, 132, 252, 0.18);
  color: var(--accent-lighter);
}

.icon-circle.yellow {
  background: rgba(250, 204, 21, 0.18);
  color: var(--warning);
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
  color: var(--text-secondary);
}

.time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.empty {
  text-align: center;
  color: var(--text-muted);
  margin-top: 60px;
}

.history-container {
  min-height: 100vh;
  padding: 40px 24px;
  background: var(--bg-page);
}

/* Header */
.page-header {
  max-width: 1200px;
  margin: 0 auto 32px;
}

.page-header h1 {
  color: var(--text-primary);
  font-size: 2.2rem;
  font-weight: 800;
}

.page-header p {
  color: var(--text-muted);
  margin-top: 6px;
}

.search-input {
  margin-top: 20px;
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
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
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.history-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.title {
  color: var(--text-primary);
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
  background: var(--accent-bg);
  color: var(--accent);
  text-transform: uppercase;
  border: 1px solid var(--accent-border);
}

.level {
  background: var(--bg-elevated);
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
}

/* Date */
.date {
  margin-top: 10px;
  font-size: 0.75rem;
  color: var(--text-muted);
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
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
}

.btn.primary {
  background-color: var(--accent-hover);
  border-color: var(--accent);
}

.btn.danger {
  flex: 0;
  width: 40px;
  background: var(--error-bg);
  border-color: var(--error-border);
  color: var(--error);
}

/* Empty */
.empty-state {
  text-align: center;
  color: var(--text-muted);
  margin-top: 80px;
}

/* ===== Mobile Responsive ===== */
@media (max-width: 1024px) {
  .page-layout {
    grid-template-columns: 1fr;
    padding: 24px 16px;
  }

  .sidebar {
    display: none;
  }

  .history-item .actions {
    visibility: visible;
    transform: translateX(0);
    pointer-events: auto;
  }

  .back-top-bar {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .page-layout {
    padding: 20px 14px;
  }

  .history-header {
    gap: 14px;
    margin-bottom: 20px;
  }

  .header-text h1 {
    font-size: 1.6rem;
  }

  .header-text p {
    font-size: 0.9rem;
  }

  .header-controls {
    flex-direction: column;
    gap: 12px;
  }

  .header-controls select {
    width: 100%;
    min-width: unset;
  }

  .search-box {
    width: 100%;
  }

  .search-box input {
    width: 100%;
  }

  .history-item {
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px;
  }

  .icon-circle {
    margin-top: 0;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .actions {
    width: 100%;
    margin-left: 0;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .actions .btn {
    flex: 1;
    min-width: 100px;
  }

  .actions .danger {
    flex: 0;
    min-width: 44px;
    width: 44px;
  }
}

@media (max-width: 640px) {
  .page-layout {
    padding: 16px 12px;
  }

  .header-text h1 {
    font-size: 1.5rem;
  }

  .header-text p {
    font-size: 0.85rem;
  }

  .history-item {
    padding: 12px;
    border-radius: 12px;
  }

  .icon-circle {
    width: 32px;
    height: 32px;
    margin-top: 12px;
  }

  .title {
    font-size: 0.9rem;
  }

  .actions .btn {
    padding: 6px 10px;
    font-size: 0.75rem;
  }

  .level-stats {
    grid-template-columns: 1fr;
  }
}
</style>
