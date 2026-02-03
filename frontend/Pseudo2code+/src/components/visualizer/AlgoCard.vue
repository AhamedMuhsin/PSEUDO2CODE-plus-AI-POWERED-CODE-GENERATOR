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
        ⓘ
      </button>
    </div>
  </div>
</template>

<script setup>
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
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  transition: all 0.25s ease;
}

.algo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
}

.icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
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
  color: #94a3b8;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.primary {
  background: #6366f1;
  color: white;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
}

.info {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 10px;
  padding: 8px 12px;
}
</style>
