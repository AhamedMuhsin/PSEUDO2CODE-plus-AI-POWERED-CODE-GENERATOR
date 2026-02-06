<template>
  <div class="selector">
    <label>Operation</label>
    <select v-model="model">
      <option
        v-for="(op, key) in operations"
        :key="key"
        :value="key"
      >
        {{ op.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  operations: Object,
  modelValue: String
})

defineEmits(["update:modelValue"])

const model = defineModel()
</script>

<style scoped>
.selector {
  margin-bottom: 24px;
}
select {
  padding: 12px;
  border-radius: 10px;
  background: rgba(15,23,42,0.8);
  color: white;
  border: 1px solid rgba(255,255,255,0.15);
}
</style>
