<template>
  <div class="graph-operation-selector">
    <label>Select Algorithm:</label>
    <select v-model="selectedValue" class="selector" @change="updateSelection">
      <option v-for="(op, key) in graphOperations" :key="key" :value="key">
        {{ op.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { graphOperations } from "@/algorithms/graphOperations/graphOperationsMap"

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(["update:modelValue"])

const selectedValue = computed({
  get: () => props.modelValue || "bfs",
  set: (value) => emit("update:modelValue", value)
})

const updateSelection = (e) => {
  selectedValue.value = e.target.value
}
</script>

<style scoped>
.graph-operation-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.graph-operation-selector label {
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
  min-width: 200px;
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
