<template>
    <AuthNavbar />
    <GraphVisualizerBase 
        title="Depth-First Search (DFS)"
        description="Explore as far as possible along each branch before backtracking. Uses a stack (recursion) to traverse the graph."
        :generateSteps="dfsSteps" 
        :algorithmName="'Depth-First Search'"
        :currentOperation="operation"
        :showPseudoCode="false" />
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue'
import GraphVisualizerBase from '@/components/visualizer/GraphVisualizerBase.vue'
import { dfsSteps } from '@/algorithms/graphOperations/dfsSteps'

const operation = {
  name: 'Depth-First Search',
  best: 'O(V + E)',
  average: 'O(V + E)',
  worst: 'O(V + E)',
  space: 'O(V)',
  stable: 'N/A',
  inPlace: false,
  description: 'DFS explores graph by going as deep as possible along each branch before backtracking. Uses a stack (or recursion) for traversal. Useful for topological sorting, cycle detection, pathfinding, and connected components.'
}
</script>
