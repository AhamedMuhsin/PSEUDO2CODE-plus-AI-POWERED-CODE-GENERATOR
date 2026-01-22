<template>
  <div class="leaderboard-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.type"
      :class="{ active: modelValue === tab.type }"
      @click="$emit('update:modelValue', tab.type)"
    >
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
  background: linear-gradient(145deg, #0b1220, #0e1628);
  border-radius: 14px;
  margin-top: 18px;
  border: 1px solid #1e293b;
}

.leaderboard-tabs button {
  padding: 8px 16px;
  border-radius: 10px;
  background: transparent;
  border: none;
  font-weight: 600;
  font-size: 0.85rem;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.leaderboard-tabs button:hover {
  color: #e5e7eb;
}

.leaderboard-tabs button.active {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}
</style>