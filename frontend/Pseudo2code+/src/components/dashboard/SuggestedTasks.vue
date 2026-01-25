<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { fetchSuggestedTasks } from "@/services/taskService"
import {
  Code,
  Flame,
  Eye,
  Trophy,
  Rocket,
  BarChart3,
  History,
} from "lucide-vue-next"

const router = useRouter()
const tasks = ref([])
const loading = ref(true)
const iconMap = {
  code: Code,
  flame: Flame,
  eye: Eye,
  trophy: Trophy,
  rocket: Rocket,
  leaderboard: BarChart3,
  history: History,
}

onMounted(async () => {
  try {
    tasks.value = await fetchSuggestedTasks()
  } catch (e) {
    console.error("Failed to load suggested tasks", e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="dashboard-card">
    <h3 class="card-title">Suggested Tasks</h3>

    <div v-if="loading" class="empty">
      Loading tasks…
    </div>

    <div v-else-if="tasks.length === 0" class="empty">
      🎉 You’re all caught up!
    </div>

    <ul v-else class="tasks">
      <li v-for="task in tasks" :key="task.id" class="task-item" @click="router.push(task.route)">
        <div class="task-icon">
          <component :is="iconMap[task.icon] || Code" size="18" />
        </div>

        <div class="task-content">
          <p class="title">{{ task.title }}</p>
          <span class="desc">{{ task.description }}</span>
        </div>

        <div class="arrow">→</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dashboard-card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
}

.card-title {
  margin-bottom: 20px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.tasks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateX(4px);
}

.task-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.title {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e5e7eb;
  margin: 0;
}

.desc {
  font-size: 0.8rem;
  color: #94a3b8;
}

.task-item:nth-child(1) .task-icon {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
}

.task-item:nth-child(2) .task-icon {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
}

.task-item:nth-child(3) .task-icon {
  background: rgba(250, 204, 21, 0.15);
  color: #fbbf24;
}

.task-item:nth-child(4) .task-icon {
  background: rgba(34, 211, 238, 0.15);
  color: #22d3ee;
}

.arrow {
  color: #6366f1;
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-item:hover .arrow {
  opacity: 1;
}
</style>
