<script setup>
const emit = defineEmits(["click"])

defineProps({
  title: String,
  value: Number,
  subtitle: String,
  icon: Object,
  iconColor: { type: String, default: "blue" },
})
</script>

<template>
  <div class="stat-card" @click="emit('click')">
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
  cursor: pointer;
  /* ✅ important */
  background: var(--bg-card);
  border-radius: 12px;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.icon-container {
  flex-shrink: 0;
}

.icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--accent-bg);
  color: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon.blue {
  background: var(--accent-bg);
  color: var(--accent-light);
}

.icon.purple {
  background: rgba(168, 85, 247, 0.15);
  color: var(--accent-lighter);
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
  color: var(--text-tertiary);
  margin: 0;
  letter-spacing: 0.3px;
}

.value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.subtitle {
  font-size: 0.85rem;
  color: var(--success);
}
</style>
