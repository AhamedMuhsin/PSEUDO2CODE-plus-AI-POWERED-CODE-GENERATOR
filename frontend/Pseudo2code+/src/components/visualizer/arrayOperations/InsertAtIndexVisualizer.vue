<template>
  <ArrayOperationBase
    title="Insert at Index"
    description="Inserts a new element at a specific index by shifting elements."
    :generateSteps="steps"
  />
</template>

<script setup>
import ArrayOperationBase from "@/components/array-ops/ArrayOperationBase.vue"
import { generateInsertAtIndexSteps } from "@/algorithms/array/insertAtIndexSteps"

const steps = (arr) => generateInsertAtIndexSteps(arr, 10, 2)
</script>
