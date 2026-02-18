<template>
  <div class="algo-card">
    <!-- ICON -->
    <div class="icon">
      <component :is="icon" size="28" />
    </div>

    <!-- LEVEL -->
    <span class="badge" :class="level.toLowerCase()">
      {{ level }}
    </span>

    <h3>{{ title }}</h3>
    <p>{{ desc }}</p>

    <div class="actions">
      <button class="primary" @click="$router.push(route)">
        Try Now
      </button>
      <button class="info" @click="$emit('show-info', info)">
        <Info :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Info, Check, X } from 'lucide-vue-next'

defineProps({
  title: String,
  desc: String,
  level: String,
  icon: Object,
  route: String,
  info: Object,
})

defineEmits(['show-info'])
</script>

<style scoped>
.algo-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-default);
  position: relative;
  transition: all 0.25s ease;
}

.algo-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--accent-bg);
  color: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.badge {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 999px;
}

.badge.beginner {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.badge.intermediate {
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
}

h3 {
  margin-top: 6px;
  margin-bottom: 8px;
}

p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.primary {
  background-color: var(--accent);
  color: var(--text-primary);
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  transition: all 0.2s ease;
  font-weight: 500;
}

.primary:hover {
  background-color: var(--accent-hover);
  transform: translateY(-1px);
}

.info {
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  color: var(--accent-light);
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
}

.info:hover {
  background: var(--accent-bg-hover);
  border-color: var(--accent-border);
  transform: translateY(-1px);
}
</style>
