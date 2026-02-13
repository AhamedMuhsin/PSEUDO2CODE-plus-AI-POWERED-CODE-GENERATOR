<template>
    <AuthNavbar />
    <GraphVisualizerBase 
        title="Dijkstra's Algorithm"
        description="Find the shortest path from a source node to all other nodes in a weighted graph using a greedy approach."
        :generateSteps="dijkstraSteps" 
        :algorithmName="'Dijkstra\'s Algorithm'"
        :currentOperation="operation"
        :showPseudoCode="false"
        :defaultWeighted="true" />
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue'
import GraphVisualizerBase from '@/components/visualizer/GraphVisualizerBase.vue'
import { dijkstraSteps } from '@/algorithms/graphOperations/dijkstraSteps'

const operation = {
  name: "Dijkstra's Algorithm",
  best: 'O((V + E) log V)',
  average: 'O((V + E) log V)',
  worst: 'O(V²)',
  space: 'O(V)',
  stable: 'N/A',
  inPlace: false,
  description: "Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative weights. It uses a greedy approach, always selecting the unvisited node with the smallest tentative distance."
}
</script>
