<template>
  <ArrayOperationBase
    title="Binary Search"
    description="Searches a sorted array by repeatedly dividing the search interval in half."
    :generateSteps="steps"
  />
</template>

<script setup>
import ArrayOperationBase from "@/components/array-ops/ArrayOperationBase.vue"
import { generateBinarySearchSteps } from "@/algorithms/array/binarySearchSteps"

const steps = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b)
  return generateBinarySearchSteps(sorted, 8)
}
</script>
