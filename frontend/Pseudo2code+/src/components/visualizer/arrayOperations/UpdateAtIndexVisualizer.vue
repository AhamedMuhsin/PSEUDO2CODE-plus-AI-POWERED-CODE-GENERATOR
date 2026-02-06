<template>
  <ArrayOperationBase
    title="Update Element"
    description="Updates the value at a specific index in the array."
    :generateSteps="steps"
  />
</template>

<script setup>
import ArrayOperationBase from "@/components/array-ops/ArrayOperationBase.vue"
import { generateUpdateAtIndexSteps } from "@/algorithms/array/updateAtIndexSteps"

const steps = (arr) => generateUpdateAtIndexSteps(arr, 2, 99)
</script>
