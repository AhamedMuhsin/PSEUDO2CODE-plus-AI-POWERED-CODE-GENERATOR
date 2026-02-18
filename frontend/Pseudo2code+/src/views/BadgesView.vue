<template>
  <AuthNavbar />

  <div class="badges-page">
    <div class="page-layout">
      <!-- LEFT SIDEBAR -->
      <aside class="sidebar">
        <ProfileCard v-if="user" :name="user.name" :email="user.email" :avatar="user.avatar" :level="user.level" :xp="user.xp"
          :nextXp="user.nextXp" :totalXp="user.totalXp" :streak="user.streak" />
        <NavigationCard />
        <BadgeProgressCard :earned="earnedCount" :locked="lockedCount" />

      </aside>

      <!-- MAIN CONTENT -->
      <main class="badges-container">
        <!-- BACK BUTTON -->
        <div class="back-top-bar">
          <button class="back-btn-compact" @click="router.push('/dashboard')">
            <img :src="arrowLeft" class="arrow" />
            Back
          </button>
        </div>

        <header class="badges-header">
          <h1>Your Badges</h1>
          <p>Achievements earned from learning and practice</p>

          <div class="filter-row">
            <label>Filter by: </label>
            <select v-model="selectedCategory">
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>

        </header>

        <!-- EARNED -->
        <section class="badge-section">
          <h2>🏆 Earned Badges ({{ earnedBadges.length }})</h2>
          <div class="badge-grid">

            <BadgeCard v-for="badge in earnedBadges" :key="badge.id" v-bind="badge" />
          </div>
        </section>

        <!-- LOCKED -->
        <section class="badge-section">
          <h2>🔒 Locked Badges ({{ lockedBadges.length }})</h2>
          <div class="badge-grid">

            <BadgeCard v-for="badge in lockedBadges" :key="badge.id" v-bind="badge" />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from "@/stores/userStore"
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import arrowLeft from '@/assets/arrow-left.svg';

const router = useRouter();
import ProfileCard from "@/components/dashboard/ProfileCard.vue";
import NavigationCard from "@/components/dashboard/NavigationCard.vue";
import BadgeCard from "@/components/badges/BadgeCard.vue";
import BadgeProgressCard from "@/components/badges/BadgeProgressCard.vue"
import { BADGES } from "@/config/badges"
import { ref, computed, onMounted } from "vue"
import api from "@/services/api"

const userStore = useUserStore()
const userBadges = ref([])
const user = ref(null);
const earnedCount = computed(() => earnedBadges.value.length)
const lockedCount = computed(() => lockedBadges.value.length)


const selectedCategory = ref("all")

const categories = [
  { label: "All Categories", value: "all" },
  { label: "Code", value: "code" },
  { label: "Visualization", value: "visualization" },
  { label: "Level", value: "level" },
  { label: "XP", value: "xp" },
]

onMounted(async () => {
  const res = await api.get("/me")
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

  userBadges.value = res.data.badges || []
})

const allBadges = computed(() => {
  return BADGES
    .filter(badge => {
      if (selectedCategory.value === "all") return true
      return badge.category === selectedCategory.value
    })
    .map(badge => {
      const earned = userBadges.value.find(
        b => b.id === badge.id
      )

      return {
        ...badge,
        earned: !!earned,
        earnedAt: earned?.earned_at || null
      }
    })
})

const earnedBadges = computed(() =>
  allBadges.value.filter(b => b.earned)
)

const lockedBadges = computed(() =>
  allBadges.value.filter(b => !b.earned)
)

const completionPercent = computed(() => {
  const total = earnedCount.value + lockedCount.value
  if (!total) return 0
  return Math.round((earnedCount.value / total) * 100)
})

</script>
<style scoped>
/* ════════ BACK ════════ */
.back-top-bar { flex-shrink: 0; }
.back-btn-compact { display: flex; align-items: center; gap: 6px; background: var(--accent-bg); border: 1px solid var(--accent-border); color: var(--accent-lighter); padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
.back-btn-compact:hover { background: var(--accent-bg-hover); transform: translateX(-2px); }
.arrow { width: 16px; height: 16px; }

.badges-page {
  min-height: 100vh;
  background: var(--bg-page);
}

.page-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 28px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.badges-container {
  padding: 32px;
}

.badges-header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-primary);
}

.badges-header p {
  color: var(--text-muted);
  margin-top: 6px;
}

.filter-row {
  margin-top: 18px;
}

.filter-row select {
  min-width: 160px;
  flex-shrink: 0;
}

select {
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
}

.badge-section {
  margin-top: 40px;
}

.badge-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.badge-grid.empty {
  color: var(--text-dim);
}

.badge-card.locked .description {
  color: var(--text-dim);
  font-style: italic;
}

.badge-progress-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-default);
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.progress-bar {
  margin-top: 12px;
  height: 8px;
  background: var(--bg-page);
  border-radius: 999px;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 999px;
}

.progress-text {
  margin-top: 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .page-layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
  .badges-container {
    padding: 24px 16px;
  }
}

@media (max-width: 640px) {
  .page-layout {
    padding: 20px 10px;
    gap: 16px;
  }
  .badges-header h1 {
    font-size: 1.5rem;
  }
  .badge-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
  }
  .badge-progress-card {
    padding: 14px;
  }
}
</style>
