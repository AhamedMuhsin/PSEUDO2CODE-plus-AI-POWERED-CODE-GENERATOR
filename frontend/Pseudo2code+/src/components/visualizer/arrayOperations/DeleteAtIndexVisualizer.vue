<template>
  <ArrayOperationsVisualizerBase
    title="Delete at Index"
    description="Removes an element at a specific index and shifts elements."
    :generateSteps="generateSteps"
    :pseudocode="deleteAtIndexPseudo"
  />
</template>

<script setup>
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import { generateDeleteAtIndexSteps } from "@/algorithms/arrayOperations/deleteAtIndexSteps"
import { deleteAtIndexPseudo } from "@/algorithms/arrayOperations/pseudocode/deleteAtIndexPseudo"

function generateSteps(arr, params) {
  return generateDeleteAtIndexSteps(arr, params.index)
}
</script>
