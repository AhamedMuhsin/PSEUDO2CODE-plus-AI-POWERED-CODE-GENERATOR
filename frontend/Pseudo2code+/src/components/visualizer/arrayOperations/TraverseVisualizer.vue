<template>
  <ArrayOperationsVisualizerBase
    title="Array Traversal"
    description="Visit each element of the array one by one from start to end."
    :generateSteps="generateTraverseSteps"
  />
</template>

<script setup>
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import { generateTraverseSteps } from "@/algorithms/arrayOperations/traverseSteps"
</script>
