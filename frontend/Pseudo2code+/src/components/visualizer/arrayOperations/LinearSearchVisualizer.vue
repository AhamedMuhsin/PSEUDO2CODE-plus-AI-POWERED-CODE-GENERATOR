<template>
  <ArrayOperationsVisualizerBase
    title="Linear Search"
    description="Searches for a value by checking each element one by one."
    :generateSteps="generateSteps"
    :needsTarget="true"
  />
</template>

<script setup>
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import { generateLinearSearchSteps } from "@/algorithms/arrayOperations/linearSearchSteps"

function generateSteps(arr, target) {
  return generateLinearSearchSteps(arr, target)
}
</script>
