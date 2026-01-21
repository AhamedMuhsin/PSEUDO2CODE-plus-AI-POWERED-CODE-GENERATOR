<template>
  <div class="nav-card">
    <h4 class="title">Navigation</h4>

    <ul class="nav-list">
      <li
        v-for="item in items"
        :key="item.to"
        :class="{ active: route.path === item.to }"
        @click="go(item.to)"
      >
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
  background: rgba(15, 23, 42, 0.85); 
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
}

.title {
  color: #cbd5f5;
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
  color: #cbd5f5;
  transition: background 0.2s ease;
}

.nav-list li:hover {
  background: rgba(255, 255, 255, 0.05);
}

.nav-list li.active {
  background: #1e293b;
  color: white;
}
</style>
