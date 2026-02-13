<template>
    <AuthNavbar />
    <GraphVisualizerBase 
        title="Kruskal's Algorithm"
        description="Find the Minimum Spanning Tree (MST) by sorting edges and adding them if they don't create a cycle. Uses Union-Find to detect cycles efficiently."
        :generateSteps="kruskalSteps" 
        :algorithmName="'Kruskal\'s Algorithm'"
        :currentOperation="operation"
        :showPseudoCode="false"
        :defaultWeighted="true" />
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue'
import GraphVisualizerBase from '@/components/visualizer/GraphVisualizerBase.vue'
import { kruskalSteps } from '@/algorithms/graphOperations/kruskalSteps'

const operation = {
  name: "Kruskal's Algorithm",
  best: 'O(E log E)',
  average: 'O(E log E)',
  worst: 'O(E log E)',
  space: 'O(V)',
  stable: 'N/A',
  inPlace: false,
  description: "Kruskal's algorithm builds a Minimum Spanning Tree by sorting all edges by weight and greedily adding the lightest edges that don't create cycles. It uses Union-Find (Disjoint Set Union) data structure to efficiently detect whether adding an edge would create a cycle. Perfect for sparse graphs where edge count is low."
}
</script>
