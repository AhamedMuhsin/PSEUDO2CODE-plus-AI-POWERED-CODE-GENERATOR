<template>
  <component :is="VisualizerComponent" />
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"

import BubbleSortVisualizer from "@/components/visualizer/BubbleSortVisualizer.vue"
import SelectionSortVisualizer from "@/components/visualizer/SelectionSortVisualizer.vue"
import InsertionSortVisualizer from "@/components/visualizer/InsertionSortVisualizer.vue"
import MergeSortVisualizer from "@/components/visualizer/MergeSortVisualizer.vue"
import QuickSortVisualizer from "@/components/visualizer/QuickSortVisualizer.vue"
import HeapSortVisualizer from "@/components/visualizer/HeapSortVisualizer.vue"

const route = useRoute()

const visualizerMap = {
  "sorting/bubble-sort": BubbleSortVisualizer,
  "sorting/selection-sort": SelectionSortVisualizer,
  "sorting/insertion-sort": InsertionSortVisualizer,
  "sorting/merge-sort": MergeSortVisualizer,
  "sorting/quick-sort": QuickSortVisualizer,
  "sorting/heap-sort": HeapSortVisualizer,
}

const key = computed(() =>
  `${route.params.category}/${route.params.algorithm}`
)

const VisualizerComponent = computed(() =>
  visualizerMap[key.value] || null
)
</script>
