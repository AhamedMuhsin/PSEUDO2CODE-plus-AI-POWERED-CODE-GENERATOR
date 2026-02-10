<template>
  <AuthNavbar />
  <AIProblemsVisualizerBase :initialProblem="problemKey" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import AIProblemsVisualizerBase from '@/components/visualizer/AIProblemsVisualizerBase.vue'

const route = useRoute()

const problemMap = {
  'nqueens': 'nQueens',
  'hanoi': 'towerOfHanoi',
  'waterjug': 'waterJug',
  'minimax': 'minimax',
  'missionaries': 'missionariesCannibals',
  'puzzle': 'numberPuzzle',
  'vacuum': 'vacuumCleaner',
  'alphabeta': 'alphaBeta',
  'hillclimbing': 'hillClimbing',
  'annealing': 'simulatedAnnealing',
  'mapcoloring': 'mapColoring',
  'genetic': 'geneticAlgorithm'
}

const problemKey = computed(() => problemMap[route.params.problem] || 'nQueens')
</script>

<style scoped>
</style>
