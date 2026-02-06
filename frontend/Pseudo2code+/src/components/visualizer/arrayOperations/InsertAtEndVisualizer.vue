<template>
  <ArrayOperationsVisualizerBase
    title="Insert at End"
    description="Adds a new element at the end of the array."
    :generateSteps="generateSteps"
    :pseudocode="insertAtEndPseudo"
  />
</template>

<script setup>
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import { generateInsertAtEndSteps } from "@/algorithms/arrayOperations/insertAtEndSteps"
import { insertAtEndPseudo } from "@/algorithms/arrayOperations/pseudocode/insertAtEndPseudo"

function generateSteps(arr, params) {
  return generateInsertAtEndSteps(arr, params.value)
}
</script>
