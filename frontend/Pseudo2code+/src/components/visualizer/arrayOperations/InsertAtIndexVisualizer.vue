<template>
  <ArrayOperationsVisualizerBase
    title="Insert at Index"
    description="Inserts a new element at a specific index by shifting elements."
    :generateSteps="generateSteps"
    :pseudocode="insertAtIndexPseudo"
  />
</template>

<script setup>
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import { generateInsertAtIndexSteps } from "@/algorithms/arrayOperations/insertAtIndexSteps"
import { insertAtIndexPseudo } from "@/algorithms/arrayOperations/pseudocode/insertAtIndexPseudo"

function generateSteps(arr, params) {
  return generateInsertAtIndexSteps(arr, params.value, params.index)
}
</script>
