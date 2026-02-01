<template>
  <div class="bars">
    <div v-for="(value, i) in array" :key="i" class="bar" :class="{
      active: active.includes(i),
      swap: swap && active.includes(i),
      sorted: sorted.includes(i)
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
  background: #6366f1;
  border-radius: 8px 8px 0 0;
  color: white;
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
  color: #e5e7eb;
  opacity: 0.6;
}

</style>
