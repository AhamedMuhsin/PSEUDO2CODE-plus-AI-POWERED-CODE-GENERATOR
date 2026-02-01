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
            :icon="ArrowUpDown" route="/visualize/sorting/bubble-sort"/>
          <AlgoCard title="Selection Sort" level="Beginner" desc="Find minimum element and place it at the beginning"
            :icon="ListOrdered" route="/visualize/sorting/selection-sort"/>
          <AlgoCard title="Insertion Sort" level="Beginner" desc="Build sorted array one element at a time"
            :icon="MoveDown" />
          <AlgoCard title="Merge Sort" level="Intermediate" desc="Divide and conquer sorting algorithm" :icon="Split" />
          <AlgoCard title="Quick Sort" level="Intermediate" desc="Partition-based sorting with pivot element"
            :icon="Zap" />
          <AlgoCard title="Heap Sort" level="Intermediate" desc="Binary heap-based sorting algorithm" :icon="Layers" />
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
            :icon="Rows" />
          <AlgoCard title="Stack" level="Beginner" desc="LIFO data structure operations" :icon="Layers3" />
          <AlgoCard title="Queue" level="Beginner" desc="FIFO data structure operations" :icon="AlignLeft" />
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
    </div>
  </main>
</template>

<script setup>
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import AlgoCard from "@/components/visualizer/AlgoCard.vue"
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
