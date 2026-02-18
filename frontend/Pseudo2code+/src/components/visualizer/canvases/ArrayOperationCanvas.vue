<template>
  <div class="array-canvas">
    <div v-for="(value, i) in array" :key="i" class="cell" :class="{
      active: i === activeIndex,
      mid: i === midIndex,
      found: i === foundIndex,
      out: range && (i < range[0] || i > range[1])
    }">
      {{ value }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  array: {
    type: Array,
    required: true
  },
  activeIndex: {
    type: Number,
    default: null
  },
  targetIndex: {
    type: Number,
    default: null
  },
  found: {
    type: Boolean,
    default: false
  },
  removedIndex: {
    type: Number,
    default: null
  },
  insertedIndex: {
    type: Number,
    default: null
  }, foundIndex: {
    type: Number,
    default: null
  }
})
</script>

<style scoped>
.array-canvas {
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
  min-height: 120px;
  flex-wrap: wrap;
}

/* Base cell */
.cell {
  min-width: 56px;
  padding: 14px 0;
  border-radius: 12px;
  background-color: var(--accent);
  color: var(--text-primary);
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
}

/* Active index */
.cell.active {
  background: #22c55e;
  transform: scale(1.05);
}

/* Target index */
.cell.target {
  background: #facc15;
  color: var(--text-primary);
}

/* Found (search success) */
.cell.found {
  background: #10b981;
}

/* Removed */
.cell.removed {
  background: #ef4444;
  opacity: 0.5;
}

/* Inserted */
.cell.inserted {
  background: #38bdf8;
  animation: pop 0.4s ease;
}
.cell.removed {
  background: #ef4444;
  opacity: 0.5;
}
@keyframes pop {
  0% {
    transform: scale(0.7);
  }

  100% {
    transform: scale(1);
  }
}
</style>
