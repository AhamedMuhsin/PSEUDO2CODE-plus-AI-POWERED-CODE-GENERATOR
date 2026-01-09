<template>
  <AuthNavbar />
  <main class="dashboard">
    <div class="dashboard-grid">

      <!-- LEFT COLUMN -->
      <div class="left-column">
        <ProfileCard v-if="user" :name="user.name" :email="user.email" :level="user.level" :xp="user.xp"
          :nextXp="user.nextXp" :totalXp="user.totalXp" :streak="user.streak" />
        <QuickActions />
<SuggestedTasks :tasks="suggestedTasks" />

      </div>

      <!-- RIGHT COLUMN -->
      <div class="right-column dashboard-main">
        <WelcomeHeader v-if="user" :name="user.name" />
        <StatsCards v-if="stats" :stats="stats" />
<RecentActivity :activities="activities" />


      </div>
    </div>
  </main>

</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Code, Eye, Trophy, LayoutDashboard, ArrowUp } from "lucide-vue-next";

import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import ProfileCard from "@/components/dashboard/ProfileCard.vue";
import QuickActions from "@/components/dashboard/QuickActions.vue";
import SuggestedTasks from "@/components/dashboard/SuggestedTasks.vue";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader.vue";
import StatsCards from "@/components/dashboard/StatsCards.vue";
import RecentActivity from "@/components/dashboard/RecentActivity.vue";

import api from "@/services/api";
import { logout } from "@/services/authService";

const router = useRouter();

// STATE
const user = ref(null);
const stats = ref(null);
const activities = ref([]);
const loading = ref(true);
const suggestedTasks = ref([
  {
    id: "first_code",
    title: "Generate your first code",
    description: "Turn pseudocode into executable code",
    icon: Code,
    action: "/generate",
  },
  {
    id: "visualize",
    title: "Visualize an algorithm",
    description: "Understand algorithms step-by-step",
    icon: Eye,
    action: "/visualize",
  },
  {
    id: "badge",
    title: "Earn your first badge",
    description: "Complete tasks to unlock achievements",
    icon: Trophy,
    action: "/dashboard",
  },
]);

// 🔹 Activity mapper (IMPORTANT)
const activityMap = {
  code: { icon: Code, color: "blue" },
  visual: { icon: Eye, color: "purple" },
  badge: { icon: Trophy, color: "yellow" },
  level: { icon: ArrowUp, color: "green" },
};

onMounted(async () => {
  try {
    const res = await api.get("/me");
    const me = res.data;

    // USER
    user.value = {
      name: me.name,
      email: me.email,
      level: me.stats.level,
      xp: me.stats.xp,
      nextXp: me.stats.xp_next_level,
      totalXp: me.stats.xp,
      streak: me.stats.streak,
    };

    // STATS
    stats.value = me.stats;
      stats.value = res.data.stats;
  suggestedTasks.value = buildSuggestedTasks(stats.value);

    // RECENT ACTIVITY (mapped)
    activities.value = (me.recent_activity || []).map((a) => ({
      title: a.title,
      time: new Date(a.created_at).toLocaleString(),
      icon: activityMap[a.type]?.icon || "•",
      color: activityMap[a.type]?.color || "blue",
    }));

  } catch (err) {
    console.error("Failed to load dashboard", err);
    router.push("/login");
  } finally {
    loading.value = false;
  }
});

const handleLogout = async () => {
  await logout();
  router.push("/login");
};
const buildSuggestedTasks = (stats) => {
  const tasks = [];

  if (stats.codes_generated === 0) {
    tasks.push({
      id: "first_code",
      title: "Generate your first code",
      description: "Turn pseudocode into executable code",
      icon: Code,
      action: "/generate",
    });
  }

  if (stats.visualizations === 0) {
    tasks.push({
      id: "first_visual",
      title: "Visualize an algorithm",
      description: "Understand algorithms step-by-step",
      icon: Eye,
      action: "/visualize",
    });
  }

  if (stats.badges === 0) {
    tasks.push({
      id: "first_badge",
      title: "Earn your first badge",
      description: "Complete tasks to unlock achievements",
      icon: Trophy,
      action: "/dashboard",
    });
  }

  // Static always-visible task
  tasks.push({
    id: "explore",
    title: "Explore dashboard",
    description: "Track your learning progress",
    icon: LayoutDashboard,
    action: "/dashboard",
  });

  return tasks;
};

</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
}

.dashboard-main {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.dashboard {
  min-height: calc(100vh - 70px);
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 32px;
}

.dashboard-card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
}

/* TABLET */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

/* MOBILE */
@media (max-width: 640px) {
  .stat-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .icon-wrapper {
    margin-bottom: 8px;
  }

  .dashboard {
    padding: 16px;
  }
}

/* Mobile responsiveness later */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>