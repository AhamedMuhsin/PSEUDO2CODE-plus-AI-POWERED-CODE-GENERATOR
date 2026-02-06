<template>
  <ArrayOperationBase
    title="Insert at End"
    description="Adds a new element at the end of the array."
    :generateSteps="steps"
  />
</template>

<script setup>
import ArrayOperationBase from "@/components/array-ops/ArrayOperationBase.vue"
import { generateInsertAtEndSteps } from "@/algorithms/array/insertAtEndSteps"

const steps = (arr) => generateInsertAtEndSteps(arr, 10)
</script>
