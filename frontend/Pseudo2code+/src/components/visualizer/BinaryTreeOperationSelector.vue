<template>
  <div class="operation-selector">
    <label class="section-label">Select Operation:</label>
    <select v-model="selectedOp" @change="$emit('operation-changed', selectedOp)" class="operation-dropdown">
      <optgroup label="Basic Operations">
        <option value="insert">Insert Node</option>
        <option value="search">Search Node</option>
        <option value="delete">Delete Node</option>
      </optgroup>
      <optgroup label="Traversals">
        <option value="inorder">Inorder Traversal (LNR)</option>
        <option value="preorder">Preorder Traversal (NLR)</option>
        <option value="postorder">Postorder Traversal (LRN)</option>
        <option value="levelorder">Level Order Traversal (BFS)</option>
      </optgroup>
      <optgroup label="Utilities">
        <option value="height">Height of Tree</option>
        <option value="countNodes">Count All Nodes</option>
        <option value="countLeaves">Count Leaf Nodes</option>
      </optgroup>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: String,
    default: "insert"
  }
})

const emit = defineEmits(["update:modelValue", "operation-changed"])

const selectedOp = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    selectedOp.value = newVal
  }
)

watch(
  selectedOp,
  (newVal) => {
    emit("update:modelValue", newVal)
  }
)
</script>

<style scoped>
.operation-selector {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  background: rgba(18, 18, 18, 0.5);
  border: 1px solid #334155;
  border-radius: 8px;
  margin-bottom: 16px;
}

.section-label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.operation-dropdown {
  flex: 1;
  padding: 8px 12px;
  background: var(--bg-code);
  color: var(--text-secondary);
  border: 1px solid #475569;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.operation-dropdown:hover {
  border-color: #64748b;
  background: var(--bg-overlay);
}

.operation-dropdown:focus {
  outline: none;
  border-color: var(--accent-light);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
}

.operation-dropdown option {
  background: var(--bg-surface);
  color: var(--text-secondary);
  padding: 8px;
}

.operation-dropdown optgroup {
  background: var(--bg-surface);
  color: var(--text-muted);
  font-weight: 600;
  font-style: normal;
}
</style>
