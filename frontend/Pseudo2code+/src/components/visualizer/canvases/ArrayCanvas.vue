<template>
  <div class="array-canvas">
    <div
      v-for="(value, index) in state.array"
      :key="index"
      class="bar"
      :class="{
        compare: state.compare?.includes(index),
        swap: state.swap && state.compare?.includes(index),
        sorted: state.sortedIndices?.includes(index)
      }"
      :style="{ height: value * 4 + 'px' }"
    >
      {{ value }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  state: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.array-canvas {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 260px;
  padding: 20px;
}

.bar {
  width: 32px;
  background: #334155;
  border-radius: 6px;
  text-align: center;
  font-size: 12px;
  color: #e5e7eb;
  transition: all 0.3s ease;
}

.bar.compare {
  background: #6366f1;
}

.bar.swap {
  background: #f59e0b;
}

.bar.sorted {
  background: #22c55e;
}
</style>
