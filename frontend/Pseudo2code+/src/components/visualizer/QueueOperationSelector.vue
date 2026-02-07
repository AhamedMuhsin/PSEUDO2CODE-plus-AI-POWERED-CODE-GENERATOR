<template>
  <div class="operation-selector">
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option value="">Select Operation...</option>
      <option v-for="(op, key) in operations" :key="key" :value="key">
        {{ op.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  operations: Object
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.operation-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

select {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

select:hover {
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(2, 6, 23, 0.7);
}

select:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(2, 6, 23, 0.8);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

option {
  background: #0f172a;
  color: white;
}
</style>
