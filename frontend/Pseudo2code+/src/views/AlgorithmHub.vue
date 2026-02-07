<template>
  <AuthNavbar />
  <main class="algorithm-hub">
    <div class="container">
      <!-- HEADER -->
      <header class="page-header">
        <h1>Algorithm Visualizer</h1>
        <p>
          Learn algorithms step by step with interactive visualizations
        </p>
      </header>

      <!-- SORTING -->
      <section class="algo-section">
        <h2>Sorting Algorithms</h2>
        <p class="section-desc">
          Master the fundamentals of sorting data efficiently
        </p>

        <div class="card-grid">
          <AlgoCard title="Bubble Sort" level="Beginner" desc="Compare adjacent elements and swap if needed"
            :icon="ArrowUpDown" route="/visualize/sorting/bubble-sort" :info="{
              name: 'Bubble Sort',
              best: 'O(n)',
              average: 'O(n²)',
              worst: 'O(n²)',
              space: 'O(1)',
              stable: true,
              inPlace: true,
              description: 'Repeatedly compares adjacent elements and swaps them if they are in the wrong order.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Selection Sort" level="Beginner" desc="Find minimum element and place it at the beginning"
            :icon="ListOrdered" route="/visualize/sorting/selection-sort" :info="{
              name: 'Selection Sort',
              best: 'O(n²)',
              average: 'O(n²)',
              worst: 'O(n²)',
              space: 'O(1)',
              stable: false,
              inPlace: true,
              description: 'Repeatedly selects the minimum element from the unsorted part and places it at the beginning.'
            }" @show-info="selectedInfo = $event" />

          <AlgoCard title="Insertion Sort" level="Beginner" desc="Build sorted array one element at a time"
            :icon="MoveDown" route="/visualize/sorting/insertion-sort" :info="{
              name: 'Insertion Sort',
              best: 'O(n)',
              average: 'O(n²)',
              worst: 'O(n²)',
              space: 'O(1)',
              stable: true,
              inPlace: true,
              description: 'Builds the final sorted array one element at a time by inserting elements into their correct position.'
            }" @show-info="selectedInfo = $event" />

          <AlgoCard title="Merge Sort" level="Intermediate" desc="Divide and conquer sorting algorithm" :icon="Split"
            route="/visualize/sorting/merge-sort" :info="{
              name: 'Merge Sort',
              best: 'O(n log n)',
              average: 'O(n log n)',
              worst: 'O(n log n)',
              space: 'O(n)',
              stable: true,
              inPlace: false,
              description: 'Divides the array into halves, recursively sorts them, and merges the sorted halves.'
            }" @show-info="selectedInfo = $event" />

          <AlgoCard title="Quick Sort" level="Intermediate" desc="Partition-based sorting with pivot element"
            :icon="Zap" route="/visualize/sorting/quick-sort" :info="{
              name: 'Quick Sort',
              best: 'O(n log n)',
              average: 'O(n log n)',
              worst: 'O(n²)',
              space: 'O(log n)',
              stable: false,
              inPlace: true,
              description: 'Selects a pivot element and partitions the array so that smaller elements are on one side and larger on the other.'
            }" @show-info="selectedInfo = $event" />

          <AlgoCard title="Heap Sort" level="Intermediate" desc="Binary heap-based sorting algorithm" :icon="Layers"
            route="/visualize/sorting/heap-sort" :info="{
              name: 'Heap Sort',
              best: 'O(n log n)',
              average: 'O(n log n)',
              worst: 'O(n log n)',
              space: 'O(1)',
              stable: false,
              inPlace: true,
              description: 'Builds a max heap and repeatedly extracts the maximum element to produce a sorted array.'
            }" @show-info="selectedInfo = $event" />
        </div>
      </section>

      <!-- DATA STRUCTURES -->
      <section class="algo-section">
        <h2>Data Structures</h2>
        <p class="section-desc">
          Understand how data is organized and manipulated
        </p>

        <div class="card-grid">
          <AlgoCard title="Array Operations" level="Beginner" desc="Insert, delete, and search in arrays"
            :icon="Rows" route="/array-operations" :info="{
              name: 'Array Operations',
              best: 'O(1) - O(log n)',
              average: 'O(n)',
              worst: 'O(n)',
              space: 'O(1)',
              stable: 'Varies',
              inPlace: true,
              description: 'Master fundamental array operations including traversal, searching, insertion, deletion, and updates. Each operation has different time complexities depending on the implementation.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Stack" level="Beginner" desc="LIFO data structure operations" :icon="Layers3" route="/stack-operations" :info="{
              name: 'Stack',
              best: 'O(1)',
              average: 'O(1)',
              worst: 'O(1)',
              space: 'O(n)',
              stable: 'N/A',
              inPlace: true,
              description: 'A Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end called the top. All operations (push, pop, peek) have constant time complexity.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Queue" level="Beginner" desc="FIFO data structure operations" :icon="AlignLeft" route="/queue-operations" :info="{
              name: 'Queue',
              best: 'O(1)',
              average: 'O(1)',
              worst: 'O(1)',
              space: 'O(n)',
              stable: 'N/A',
              inPlace: true,
              description: 'A First-In-First-Out (FIFO) data structure where elements are added at the back (rear) and removed from the front. All operations (enqueue, dequeue, peek) have constant time complexity.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Linked List" level="Intermediate" desc="Node-based linear data structure" :icon="Link" />
          <AlgoCard title="Binary Tree" level="Intermediate" desc="Hierarchical tree data structure"
            :icon="GitBranch" />
          <AlgoCard title="Graph" level="Intermediate" desc="Vertices and edges data structure" :icon="Network" />
        </div>
      </section>

      <!-- GRAPH & PATHFINDING -->
      <section class="algo-section">
        <h2>Graph & Pathfinding</h2>
        <p class="section-desc">
          Explore graph traversal and shortest path algorithms
        </p>

        <div class="card-grid">
          <AlgoCard title="Breadth-First Search" level="Beginner" desc="Level-by-level graph traversal" :icon="Route" />
          <AlgoCard title="Depth-First Search" level="Beginner" desc="Explore as far as possible along each branch"
            :icon="CornerDownRight" />
          <AlgoCard title="Dijkstra's Algorithm" level="Intermediate" desc="Shortest path in weighted graphs"
            :icon="Map" />
          <AlgoCard title="A* Algorithm" level="Intermediate" desc="Heuristic-based pathfinding" :icon="Navigation" />
          <AlgoCard title="Prim's Algorithm" level="Intermediate" desc="Minimum spanning tree algorithm"
            :icon="TreePine" />
          <AlgoCard title="Kruskal's Algorithm" level="Intermediate" desc="Minimum spanning tree with edge sorting"
            :icon="Merge" />
        </div>
      </section>

      <!-- AI ALGORITHMS -->
      <section class="algo-section">
        <h2>AI Algorithms</h2>
        <p class="section-desc">
          Learn fundamental machine learning and AI algorithms
        </p>

        <div class="card-grid">
          <AlgoCard title="K-Means Clustering" level="Intermediate" desc="Partition data into K clusters"
            :icon="ScatterChart" />
          <AlgoCard title="Linear Regression" level="Beginner" desc="Find best-fit line for data points"
            :icon="TrendingUp" />
          <AlgoCard title="Gradient Descent" level="Intermediate" desc="Optimization algorithm for machine learning"
            :icon="TrendingDown" />
          <AlgoCard title="Perceptron" level="Intermediate" desc="Simple neural network for classification"
            :icon="Brain" />
          <AlgoCard title="Decision Tree" level="Intermediate" desc="Tree-based classification algorithm"
            :icon="Workflow" />
          <AlgoCard title="K-Nearest Neighbors" level="Beginner" desc="Classification based on nearest data points"
            :icon="Target" />
        </div>
      </section>
      <Transition name="modal">
        <AlgorithmInfoModal v-if="selectedInfo" :info="selectedInfo" @close="selectedInfo = null" />
      </Transition>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import AlgoCard from "@/components/visualizer/AlgoCard.vue"
import AlgorithmInfoModal from '@/components/visualizer/AlgorithmInfoModal.vue'
import {
  ArrowUpDown,
  ListOrdered,
  MoveDown,
  Split,
  Zap,
  Layers,
  Rows,
  Layers3,
  AlignLeft,
  Link,
  GitBranch,
  Network,
  Route,
  CornerDownRight,
  Map,
  Navigation,
  TreePine,
  Merge,
  ScatterChart,
  TrendingUp,
  TrendingDown,
  Brain,
  Workflow,
  Target,
} from "lucide-vue-next"

const selectedInfo = ref(null)
</script>

<style scoped>
.algorithm-hub {
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 48px 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 56px;
}

.page-header h1 {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-header p {
  color: #94a3b8;
  font-size: 1rem;
}

.algo-section {
  margin-bottom: 64px;
}

.algo-section h2 {
  font-size: 1.6rem;
  margin-bottom: 6px;
}

.section-desc {
  color: #94a3b8;
  margin-bottom: 24px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Modal enter/leave animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-to {
  opacity: 1;
  transform: scale(1);
}

.modal-leave-from {
  opacity: 1;
  transform: scale(1);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
