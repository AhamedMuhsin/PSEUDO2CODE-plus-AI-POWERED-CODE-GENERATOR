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
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 8px;
  margin-bottom: 16px;
}

.section-label {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.operation-dropdown {
  flex: 1;
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  border: 1px solid #475569;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.operation-dropdown:hover {
  border-color: #64748b;
  background: rgba(15, 23, 42, 0.95);
}

.operation-dropdown:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
}

.operation-dropdown option {
  background: #0f172a;
  color: #e2e8f0;
  padding: 8px;
}

.operation-dropdown optgroup {
  background: #1e293b;
  color: #94a3b8;
  font-weight: 600;
  font-style: normal;
}
</style>
