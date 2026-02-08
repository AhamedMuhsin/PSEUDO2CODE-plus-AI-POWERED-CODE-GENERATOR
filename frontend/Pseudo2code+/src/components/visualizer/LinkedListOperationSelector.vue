<template>
  <div class="selector">
    <label>Select Operation:</label>
    <select v-model="selected" @change="$emit('update:modelValue', selected)">
      <option value="insert">Insert - Add at position</option>
      <option value="delete">Delete - Remove at position</option>
      <option value="search">Search - Find value</option>
      <option value="traverse">Traverse - Display all nodes</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: String,
  operations: Object
})

const selected = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  selected.value = newVal
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.selector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

label {
  color: #cbd5f5;
  font-weight: 500;
}

select {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

select:hover {
  border-color: rgba(99, 102, 241, 0.4);
}

select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

option {
  background: #1e293b;
  color: white;
}
</style>
