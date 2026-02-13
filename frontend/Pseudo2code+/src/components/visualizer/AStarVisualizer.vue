<template>
    <AuthNavbar />
    <GraphVisualizerBase 
        title="A* Algorithm"
        description="Find the optimal path between nodes using heuristic-guided search (combines Dijkstra with estimated cost to goal)."
        :generateSteps="astarSteps" 
        :algorithmName="'A* Algorithm'"
        :currentOperation="operation"
        :showPseudoCode="false"
        :defaultWeighted="true" />
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue'
import GraphVisualizerBase from '@/components/visualizer/GraphVisualizerBase.vue'
import { astarSteps } from '@/algorithms/graphOperations/astarSteps'

const operation = {
  name: "A* Algorithm",
  best: 'O((V + E) log V)',
  average: 'O((V + E) log V)',
  worst: 'O(b^d)',
  space: 'O(V)',
  stable: 'N/A',
  inPlace: false,
  description: "A* is an informed search algorithm that finds the optimal path from start to goal node. It uses f(n) = g(n) + h(n) where g(n) is the actual cost from start to node n, and h(n) is the heuristic estimated cost from n to goal. By combining actual cost with estimated cost, A* efficiently explores the most promising paths first."
}
</script>
