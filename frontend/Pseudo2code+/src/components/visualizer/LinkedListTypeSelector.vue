<template>
  <div class="type-selector">
    <label>Select Linked List Type:</label>
    <div class="type-buttons">
      <button
        v-for="type in types"
        :key="type.key"
        :class="['type-btn', { active: selected === type.key }]"
        @click="$emit('update:modelValue', type.key)"
      >
        <span class="icon">{{ type.icon }}</span>
        <span class="label">{{ type.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: String,
  types: Array
})

const selected = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  selected.value = newVal
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.type-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

label {
  color: #cbd5f5;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

.type-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.type-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.15);
  border: 2px solid rgba(99, 102, 241, 0.3);
  color: #a78bfa;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.type-btn:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(167, 139, 250, 0.5);
  transform: translateY(-2px);
}

.type-btn.active {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.icon {
  font-size: 1.1rem;
  font-weight: bold;
}

.label {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .type-selector {
    flex-direction: column;
    align-items: stretch;
  }

  label {
    width: 100%;
  }

  .type-buttons {
    width: 100%;
  }

  .type-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
