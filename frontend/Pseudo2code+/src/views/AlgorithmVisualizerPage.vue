<template>
  <component :is="VisualizerComponent" />
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

import BubbleSortVisualizer from "@/components/visualizer/BubbleSortVisualizer.vue"
import SelectionSortVisualizer from "@/components/visualizer/SelectionSortVisualizer.vue"

const route = useRoute()

const visualizerMap = {
  "sorting/bubble-sort": BubbleSortVisualizer,
  "sorting/selection-sort": SelectionSortVisualizer,
}

const key = computed(() =>
  `${route.params.category}/${route.params.algorithm}`
)

const VisualizerComponent = computed(() =>
  visualizerMap[key.value] || null
)
</script>
