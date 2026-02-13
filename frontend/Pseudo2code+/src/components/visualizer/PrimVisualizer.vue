<template>
    <AuthNavbar />
    <GraphVisualizerBase 
        title="Prim's Algorithm"
        description="Find the Minimum Spanning Tree (MST) by greedily adding the cheapest edge connecting the tree to a new vertex."
        :generateSteps="primSteps" 
        :algorithmName="'Prim\'s Algorithm'"
        :currentOperation="operation"
        :showPseudoCode="false"
        :defaultWeighted="true" />
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue'
import GraphVisualizerBase from '@/components/visualizer/GraphVisualizerBase.vue'
import { primSteps } from '@/algorithms/graphOperations/primSteps'

const operation = {
  name: "Prim's Algorithm",
  best: 'O(E log V)',
  average: 'O(E log V)',
  worst: 'O(V²)',
  space: 'O(V)',
  stable: 'N/A',
  inPlace: false,
  description: "Prim's algorithm builds a Minimum Spanning Tree by starting from any node and repeatedly adding the cheapest edge that connects a node in the MST to a node outside it. It uses a greedy approach, guaranteeing the minimum total edge weight to connect all vertices."
}
</script>
