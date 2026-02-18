<template>
  <div class="leaderboard-tabs">
    <button v-for="tab in tabs" :key="tab.type" :class="{ active: modelValue === tab.type }"
      @click="$emit('update:modelValue', tab.type)">
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(["update:modelValue"])

const tabs = [
  { label: "Level", type: "level" },
  { label: "XP", type: "xp" },
  { label: "Codes Generated", type: "codes" },
  { label: "Visualizations", type: "visualizations" }
]
</script>
<style>
.leaderboard-tabs {
  display: inline-flex;
  gap: 6px;
  padding: 6px;
  background: var(--bg-card);
  border-radius: 12px;
  margin-top: 18px;
  border: 1px solid var(--border-default);
}

.leaderboard-tabs button {
  padding: 8px 16px;
  border-radius: 10px;
  background: transparent;
  border: none;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.leaderboard-tabs button:hover {
  color: var(--text-secondary);
}

.leaderboard-tabs button.active {
  background: var(--accent);
  color: var(--text-primary);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

/* ===== Mobile Responsive ===== */
@media (max-width: 640px) {
  .leaderboard-tabs {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 4px;
    padding: 4px;
    margin-top: 14px;
    width: 100%;
  }

  .leaderboard-tabs::-webkit-scrollbar {
    display: none;
  }

  .leaderboard-tabs button {
    padding: 7px 12px;
    font-size: 0.78rem;
    white-space: nowrap;
    flex-shrink: 0;
  }
}

@media (max-width: 380px) {
  .leaderboard-tabs button {
    padding: 6px 10px;
    font-size: 0.72rem;
  }
}
</style>