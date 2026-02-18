<template>
  <div class="ai-problem-selector">
    <label>Select Problem:</label>
    <select v-model="selectedValue" class="selector" @change="updateSelection">
      <option v-for="(problem, key) in aiProblems" :key="key" :value="key">
        {{ problem.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { aiProblems } from "@/algorithms/aiProblems/aiProblemsMap"

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(["update:modelValue"])

const selectedValue = computed({
  get: () => props.modelValue || "nQueens",
  set: (value) => emit("update:modelValue", value)
})

const updateSelection = (e) => {
  selectedValue.value = e.target.value
}
</script>

<style scoped>
.ai-problem-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-problem-selector label {
  color: var(--text-tertiary);
  font-size: 0.95rem;
  font-weight: 500;
}

.selector {
  padding: 8px 12px;
  background: rgba(18, 18, 18, 0.8);
  border: 1px solid var(--accent-border);
  color: var(--accent-lighter);
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 250px;
}

.selector:hover {
  border-color: var(--accent-border);
  background: rgba(18, 18, 18, 1);
}

.selector:focus {
  outline: none;
  border-color: var(--accent-light);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.selector option {
  background: var(--bg-surface);
  color: var(--accent-lighter);
  padding: 8px;
}
</style>
