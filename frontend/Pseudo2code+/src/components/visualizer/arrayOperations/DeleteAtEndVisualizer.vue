<template>
  <ArrayOperationBase
    title="Delete at End"
    description="Removes the last element from the array."
    :generateSteps="steps"
  />
</template>

<script setup>
import ArrayOperationBase from "@/components/array-ops/ArrayOperationBase.vue"
import { generateDeleteAtEndSteps } from "@/algorithms/array/deleteAtEndSteps"

const steps = (arr) => generateDeleteAtEndSteps(arr)
</script>
