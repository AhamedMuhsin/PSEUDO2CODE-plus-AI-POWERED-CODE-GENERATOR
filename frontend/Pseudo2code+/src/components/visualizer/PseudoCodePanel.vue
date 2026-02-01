<template>
  <div class="pseudo">
    <div
      v-for="(line, i) in code"
      :key="i"
      class="line"
      :class="{ active: i === activeLine }"
    >
      <span class="num">{{ i + 1 }}</span>
      <span class="text">{{ line }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  code: Array,
  activeLine: Number
})
</script>

<style scoped>
.pseudo {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 18px;
  border: 1px solid rgba(255,255,255,0.06);
  font-family: monospace;
  font-size: 0.85rem;
}

.line {
  display: flex;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 8px;
  color: #94a3b8;
}

.line.active {
  background: rgba(99,102,241,0.15);
  color: #e0e7ff;
}

.num {
  opacity: 0.5;
  width: 20px;
}
</style>
