<template>
  <ArrayOperationsVisualizerBase
    title="Array Traversal"
    description="Visit each element of the array one by one from start to end."
    :generateSteps="generateTraverseSteps"
    :pseudocode="traversePseudo"
  />
</template>

<script setup>
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import { generateTraverseSteps } from "@/algorithms/arrayOperations/traverseSteps"
import { traversePseudo } from "@/algorithms/arrayOperations/pseudocode/traversePseudo"
</script>
