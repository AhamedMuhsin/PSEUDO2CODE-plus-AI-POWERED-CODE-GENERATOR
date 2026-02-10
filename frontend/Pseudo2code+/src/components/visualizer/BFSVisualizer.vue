<template>
    <AuthNavbar />
    <GraphVisualizerBase 
        title="Breadth-First Search (BFS)"
        description="Level-by-level graph traversal using a queue. Explores all neighbors before moving to the next level."
        :generateSteps="bfsSteps" 
        :algorithmName="'Breadth-First Search'"
        :currentOperation="operation"
        :showPseudoCode="false" />
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue'
import GraphVisualizerBase from '@/components/visualizer/GraphVisualizerBase.vue'
import { bfsSteps } from '@/algorithms/graphOperations/bfsSteps'

const operation = {
  name: 'Breadth-First Search',
  best: 'O(V + E)',
  average: 'O(V + E)',
  worst: 'O(V + E)',
  space: 'O(V)',
  stable: 'N/A',
  inPlace: false,
  description: 'BFS explores graph level by level using a queue, visiting all neighbors of a node before moving to the next level. Useful for finding shortest paths in unweighted graphs and level-order traversal.'
}
</script>
