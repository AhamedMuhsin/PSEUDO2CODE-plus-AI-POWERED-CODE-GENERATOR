<template>
  <ArrayOperationsVisualizerBase
    title="Binary Search"
    description="Searches a sorted array by repeatedly dividing the search interval in half."
    :generateSteps="generateSteps"
    :needsTarget="true"
    :pseudocode="binarySearchPseudo"
  />
</template>

<script setup>
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import { generateBinarySearchSteps } from "@/algorithms/arrayOperations/binarySearchSteps"
import { binarySearchPseudo } from "@/algorithms/arrayOperations/pseudocode/binarySearchPseudo"

function generateSteps(arr, target) {
  const sorted = [...arr].sort((a, b) => a - b)
  return generateBinarySearchSteps(sorted, target)
}
</script>
