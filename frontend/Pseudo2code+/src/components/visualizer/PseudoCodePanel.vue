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
  background: var(--bg-card);
  border-radius: 12px;
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
  color: var(--text-muted);
}

.line.active {
  background: var(--accent-bg);
  color: var(--accent-lighter);
}

.num {
  opacity: 0.5;
  width: 20px;
}
</style>
