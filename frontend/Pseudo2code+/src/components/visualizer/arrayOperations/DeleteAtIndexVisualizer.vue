<template>
  <ArrayOperationBase
    title="Delete at Index"
    description="Removes an element at a specific index and shifts elements."
    :generateSteps="steps"
  />
</template>

<script setup>
import ArrayOperationBase from "@/components/array-ops/ArrayOperationBase.vue"
import { generateDeleteAtIndexSteps } from "@/algorithms/array/deleteAtIndexSteps"

const steps = (arr) => generateDeleteAtIndexSteps(arr, 2)
</script>
