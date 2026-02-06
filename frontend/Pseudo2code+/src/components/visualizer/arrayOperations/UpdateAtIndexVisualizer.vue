<template>
  <ArrayOperationsVisualizerBase
    title="Update Element"
    description="Updates the value at a specific index in the array."
    :generateSteps="generateSteps"
    :pseudocode="updateAtIndexPseudo"
  />
</template>

<script setup>
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import { generateUpdateAtIndexSteps } from "@/algorithms/arrayOperations/updateAtIndexSteps"
import { updateAtIndexPseudo } from "@/algorithms/arrayOperations/pseudocode/updateAtIndexPseudo"

function generateSteps(arr, params) {
  return generateUpdateAtIndexSteps(arr, params.index, params.value)
}
</script>
