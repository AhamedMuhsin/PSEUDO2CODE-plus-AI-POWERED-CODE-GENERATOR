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
  color: #cbd5e1;
  font-size: 0.95rem;
  font-weight: 500;
}

.selector {
  padding: 8px 12px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #e0e7ff;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 250px;
}

.selector:hover {
  border-color: rgba(99, 102, 241, 0.6);
  background: rgba(30, 41, 59, 1);
}

.selector:focus {
  outline: none;
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.selector option {
  background: #1e293b;
  color: #e0e7ff;
  padding: 8px;
}
</style>
