<script setup>
import { History } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
const emit = defineEmits(["select"]);

const goToHistory = () => {
  router.push("/history");
};

const props = defineProps({
  activities: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="activity-card">
    <div class="header">
      <h3>Recent Activity</h3>
      <span class="view-all" @click="goToHistory">
        View All →
      </span>

    </div>

    <div v-if="!activities.length" class="empty-state">
      <div class="empty-icon">
        <History size="40" />
      </div>
      <h4>No activity yet</h4>
      <p>Start by generating your first code or visualizing an algorithm.</p>
    </div>

    <ul v-else class="activity-list">
      <li v-for="(item, i) in activities" :key="i" class="activity-item" @click="emit('select', item)">
        <div class="icon-circle" :class="item.color">
          <component :is="item.icon" size="16" />
        </div>


        <div class="content">
          <p class="title">{{ item.title }}</p>
          <span class="time">{{ item.time }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.activity-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-item {
  cursor: pointer;
  transition: background 0.2s ease;
}

.activity-item:hover {
  background: var(--bg-elevated);
}

.view-all {
  color: var(--accent-light);
  cursor: pointer;
  font-size: 0.9rem;
}

/* Activity list */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-list li {
  display: flex;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-default);
}

/* Icons */
.icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

/* ICON CIRCLE */
.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 15px;
}

/* COLORS */
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

.blue {
  background: rgba(96, 165, 250, 0.15);
  color: var(--accent-light);
}

.purple {
  background: rgba(192, 132, 252, 0.15);
  color: var(--accent-lighter);
}

.yellow {
  background: rgba(250, 204, 21, 0.15);
  color: var(--warning);
}

.green {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

/* Content */
.content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 0.9;
}

.time {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 0.9;
}


/* .title {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.time {
  font-size: 0.75rem;
  color: var(--text-muted);
} */

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
}

.empty-icon {
  color: var(--text-dim);
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.empty-state h4 {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.empty-state p {
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
