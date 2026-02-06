<template>
  <ArrayOperationsVisualizerBase
    title="Delete at End"
    description="Removes the last element from the array."
    :generateSteps="generateSteps"
    :pseudocode="deleteAtEndPseudo"
  />
</template>

<script setup>
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import { generateDeleteAtEndSteps } from "@/algorithms/arrayOperations/deleteAtEndSteps"
import { deleteAtEndPseudo } from "@/algorithms/arrayOperations/pseudocode/deleteAtEndPseudo"

function generateSteps(arr) {
  return generateDeleteAtEndSteps(arr)
}
</script>
