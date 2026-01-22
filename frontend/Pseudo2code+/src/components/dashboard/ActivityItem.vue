<template>
  <div class="activity-item">
    <div class="icon" :class="color">
      <component :is="icon" size="16" />
    </div>

    <div class="content">
      <p class="text">{{ text }}</p>
      <span class="time">{{ time }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: Object,
  text: String,
  time: String,
  color: String,
});
</script>

<style scoped>
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 0;
}

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

.content {
  display: flex;
  flex-direction: column;
}

.text {
  font-size: 14px;
  color: #e5e7eb;
}

.time {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

/* Color variants */
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
</style>
