<template>
  <div class="bars">
    <div v-for="(value, i) in array" :key="i" class="bar" :class="{
      active: active.includes(i),
      swap: swap && active.includes(i),
      sorted: sorted.includes(i),
      range: range && i >= range[0] && i <= range[1],
      pivot: pivot === i
    }" :style="{ height: (value / max) * 100 + '%' }">
      {{ value }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  array: Array,
  active: Array,
  swap: Boolean,
  max: Number,
  sorted: {
    type: Array,
    default: () => []
  },
  range: {
    type: Array,
    default: () => null
  },
  pivot: {
    type: Number,
    default: null
  }
})
</script>

<style scoped>
.bars {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 260px;
}

.bar {
  flex: 1;
  background-color: var(--accent);
  border-radius: 8px 8px 0 0;
  color: var(--text-primary);
  font-size: 0.75rem;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  transition: all 0.3s ease;
}

.bar.active {
  background: #22c55e;
}

.bar.swap {
  background: #ef4444;
}

.bar.sorted {
  background: rgba(255, 255, 255, 0.25);
  color: var(--text-secondary);
  opacity: 0.6;
}

.bar.pivot {
  background: #a855f7; /* purple */
}

.bar.range {
  outline: 2px dashed rgba(99, 102, 241, 0.6);
  outline-offset: -2px;
}
</style>
