<template>
  <div class="nav-card">
    <h4 class="title">Navigation</h4>

    <ul class="nav-list">
      <li v-for="item in items" :key="item.to" :class="{ active: route.path === item.to }" @click="go(item.to)">
        <component :is="item.icon" size="18" />
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import {
  LayoutDashboard,
  History,
  Trophy,
  BarChart3,
  Code,
  Eye,
  Sparkles,
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

const items = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Generate Code",
    to: "/generate-code",
    icon: Sparkles,
  },
  {
    label: "Visualize Code",
    to: "/visualize-playground",
    icon: Eye,
  },
  {
    label: "Activity History",
    to: "/history",
    icon: History,
  },
  {
    label: "Badges",
    to: "/badges",
    icon: Trophy,
  },
  {
    label: "Leaderboard",
    to: "/leaderboard",
    icon: BarChart3,
  },
];

const go = (to) => {
  if (route.path !== to) router.push(to);
};
</script>

<style scoped>
.nav-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.title {
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.nav-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  margin: 0;
}

.nav-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  color: var(--text-tertiary);
  transition: background 0.2s ease;
}

.nav-list li:hover {
  background: var(--border-default);
}

.nav-list li.active {
  background: var(--bg-surface);
  color: var(--text-primary);
}
</style>
