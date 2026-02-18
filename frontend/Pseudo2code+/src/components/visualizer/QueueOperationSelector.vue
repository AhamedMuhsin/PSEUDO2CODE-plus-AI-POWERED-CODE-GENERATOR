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
  background: var(--bg-overlay);
  border: 1px solid var(--accent-border);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

select:hover {
  border-color: var(--accent-border);
  background: var(--bg-deep);
}

select:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-code);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

option {
  background: var(--bg-surface);
  color: var(--text-primary);
}
</style>
