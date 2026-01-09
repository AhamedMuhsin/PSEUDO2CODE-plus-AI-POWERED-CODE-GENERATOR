<script setup>
import { History } from "lucide-vue-next";

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
      <span class="view-all">View All →</span>
    </div>

    <div v-if="!activities.length" class="empty-state">
      <div class="empty-icon">
        <History size="40" />
      </div>
      <h4>No activity yet</h4>
      <p>Start by generating your first code or visualizing an algorithm.</p>
    </div>

    <ul v-else class="activity-list">
      <li v-for="(item, i) in activities" :key="i" :class="item.color">
        <div class="icon">
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
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.view-all {
  color: #60a5fa;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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

.blue {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.purple {
  background: rgba(192, 132, 252, 0.15);
  color: #c084fc;
}

.yellow {
  background: rgba(250, 204, 21, 0.15);
  color: #facc15;
}

.green {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

/* Content */
.content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 0.95rem;
  color: #e5e7eb;
}

.time {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-icon {
  color: #64748b;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.empty-state h4 {
  font-size: 1.1rem;
  color: #e5e7eb;
  margin-bottom: 6px;
}

.empty-state p {
  font-size: 0.9rem;
  line-height: 1.5;
}
</style>
