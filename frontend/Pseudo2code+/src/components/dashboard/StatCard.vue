<script setup>
defineProps({
  title: String,
  value: Number,
  subtitle: String,
  icon: Object,
  iconColor: { type: String, default: "blue" },
});
</script>

<template>
  <div class="stat-card">
    <div class="content">
      <h4 class="title">{{ title }}</h4>
      <div class="value">{{ value }}</div>
      <span class="subtitle">{{ subtitle }}</span>
    </div>

    <div class="icon-container">
      <div class="icon" :class="iconColor">
        <component :is="icon" size="24" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.icon-container {
  flex-shrink: 0;
}

.icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon.blue {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
}

.icon.purple {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
}

.icon.cyan {
  background: rgba(34, 211, 238, 0.15);
  color: #22d3ee;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #cbd5e1;
  margin: 0;
  letter-spacing: 0.3px;
}

.value {
  font-size: 2rem;
  font-weight: 700;
  color: #f1f5f9;
}

.subtitle {
  font-size: 0.85rem;
  color: #4ade80;
}
</style>
