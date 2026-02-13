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
          <AlgoCard title="Linked List" level="Intermediate" desc="Node-based linear data structure" :icon="Link" route="/linkedlist-operations" :info="{
              name: 'Linked List',
              best: 'O(1) - O(n)',
              average: 'O(n)',
              worst: 'O(n)',
              space: 'O(n)',
              stable: 'N/A',
              inPlace: true,
              description: 'A node-based linear data structure where elements are stored in nodes linked via pointers. Common operations include insert, delete, search, and traverse with varying time complexities.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Binary Tree" level="Intermediate" desc="Hierarchical tree data structure"
            :icon="GitBranch" route="/binary-tree-operations" :info="{
              name: 'Binary Tree',
              best: 'O(log n) - O(n)',
              average: 'O(n)',
              worst: 'O(n)',
              space: 'O(n)',
              stable: 'N/A',
              inPlace: false,
              description: 'A hierarchical tree data structure where each node has at most two children (left and right). Supports various operations including insert, search, delete, and multiple traversal methods.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Graph" level="Intermediate" desc="Vertices and edges data structure" :icon="Network" route="/graph-operations" :info="{
              name: 'Graph',
              best: 'O(V + E)',
              average: 'O(V + E)',
              worst: 'O(V + E)',
              space: 'O(V + E)',
              stable: 'N/A',
              inPlace: false,
              description: 'A graph is a non-linear data structure consisting of vertices (nodes) and edges. Supports traversal algorithms (BFS, DFS), shortest path algorithms (Dijkstra), and cycle detection.'
            }" @show-info="selectedInfo = $event" />
        </div>
      </section>

      <!-- GRAPH & PATHFINDING -->
      <section class="algo-section">
        <h2>Graph & Pathfinding</h2>
        <p class="section-desc">
          Explore graph traversal and shortest path algorithms
        </p>

        <div class="card-grid">
          <AlgoCard title="Breadth-First Search" level="Beginner" desc="Level-by-level graph traversal" :icon="Route"
            route="/visualize/graph/bfs" :info="{
              name: 'Breadth-First Search',
              best: 'O(V + E)',
              average: 'O(V + E)',
              worst: 'O(V + E)',
              space: 'O(V)',
              stable: 'N/A',
              inPlace: false,
              description: 'BFS explores graph level by level using a queue. It visits all neighbors of a node before moving to the next level. Essential for shortest path in unweighted graphs, level-order traversal, and finding connected components.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Depth-First Search" level="Beginner" desc="Explore as far as possible along each branch"
            :icon="CornerDownRight" route="/visualize/graph/dfs" :info="{
              name: 'Depth-First Search',
              best: 'O(V + E)',
              average: 'O(V + E)',
              worst: 'O(V + E)',
              space: 'O(V)',
              stable: 'N/A',
              inPlace: false,
              description: 'DFS explores graph by going as deep as possible along each branch before backtracking. Uses a stack (or recursion) for traversal. Useful for topological sorting, cycle detection, pathfinding, and connected components.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Dijkstra's Algorithm" level="Intermediate" desc="Shortest path in weighted graphs"
            :icon="Map" route="/visualize/graph/dijkstra" :info="{
              name: 'Dijkstra\'s Algorithm',
              best: 'O((V + E) log V)',
              average: 'O((V + E) log V)',
              worst: 'O(V²)',
              space: 'O(V)',
              stable: 'N/A',
              inPlace: false,
              description: 'Dijkstra\'s algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with non-negative weights. It uses a greedy approach, always selecting the unvisited node with the smallest tentative distance.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="A* Algorithm" level="Intermediate" desc="Heuristic-based pathfinding" :icon="Navigation" 
            route="/visualize/graph/astar" :info="{
              name: 'A* Algorithm',
              best: 'O((V + E) log V)',
              average: 'O((V + E) log V)',
              worst: 'O(b^d)',
              space: 'O(V)',
              stable: 'N/A',
              inPlace: false,
              description: 'A* is an informed search algorithm that finds the optimal path from start to goal node. It uses f(n) = g(n) + h(n) where g(n) is the actual cost from start and h(n) is the heuristic estimated cost to goal. More efficient than Dijkstra when a good heuristic exists.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Prim's Algorithm" level="Intermediate" desc="Minimum spanning tree algorithm"
            :icon="TreePine" route="/visualize/graph/prim" :info="{
              name: 'Prim\'s Algorithm',
              best: 'O(E log V)',
              average: 'O(E log V)',
              worst: 'O(V²)',
              space: 'O(V)',
              stable: 'N/A',
              inPlace: false,
              description: 'Prim\'s algorithm builds a Minimum Spanning Tree by starting from any node and repeatedly adding the cheapest edge connecting the MST to a non-MST node. Greedy approach guarantees minimum total weight.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Kruskal's Algorithm" level="Intermediate" desc="Minimum spanning tree with edge sorting"
            :icon="Merge" route="/visualize/graph/kruskal" :info="{
              best: 'O(E log E)',
              average: 'O(E log E)',
              worst: 'O(E log E)',
              space: 'O(V)',
              stable: 'N/A',
              inPlace: false,
              description: 'Kruskal\'s algorithm builds a Minimum Spanning Tree by sorting all edges by weight and greedily adding the lightest edges that don\'t create cycles. Uses Union-Find to detect cycles efficiently. Perfect for sparse graphs.'
            }" @show-info="selectedInfo = $event" />
        </div>
      </section>

      <!-- AI & SEARCH PROBLEMS -->
      <section class="algo-section">
        <h2>AI & Search Problems</h2>
        <p class="section-desc">
          Solve classic AI problems using search and optimization algorithms
        </p>

        <div class="card-grid">
          <AlgoCard title="N-Queens Problem" level="Intermediate" desc="Place N queens on chessboard with no conflicts"
            :icon="Grid3x3" route="/ai-problems/nqueens" :info="{
              name: 'N-Queens Problem',
              best: 'O(N!)',
              average: 'O(N!)',
              worst: 'O(N!)',
              space: 'O(N²)',
              stable: 'N/A',
              inPlace: false,
              description: 'Classic backtracking problem. Place N queens on an N×N chessboard so that no two queens threaten each other. Uses constraint satisfaction and backtracking.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Tower of Hanoi" level="Intermediate" desc="Move disks between rods following rules"
            :icon="Layers3" route="/ai-problems/hanoi" :info="{
              name: 'Tower of Hanoi',
              best: 'O(2^N)',
              average: 'O(2^N)',
              worst: 'O(2^N)',
              space: 'O(N)',
              stable: 'N/A',
              inPlace: false,
              description: 'Classic recursive puzzle. Move all disks from source to destination rod using an auxiliary rod. Only smaller disks can be placed on larger ones. Minimum moves: 2^N - 1.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Water Jug Problem" level="Intermediate" desc="Measure exact amount using two jugs"
            :icon="Droplet" route="/ai-problems/waterjug" :info="{
              name: 'Water Jug Problem',
              best: 'O(M × N)',
              average: 'O(M × N)',
              worst: 'O(M × N)',
              space: 'O(M × N)',
              stable: 'N/A',
              inPlace: false,
              description: 'State-space search problem. Given two jugs of different capacities, find sequence of operations (fill, empty, pour) to measure exact target amount. Uses BFS to find shortest solution.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="MinMax Algorithm" level="Intermediate" desc="Optimal strategy for two-player games"
            :icon="Brain" route="/ai-problems/minimax" :info="{
              name: 'MinMax Algorithm',
              best: 'O(b^d)',
              average: 'O(b^d)',
              worst: 'O(b^d)',
              space: 'O(d)',
              stable: 'N/A',
              inPlace: false,
              description: 'Game theory algorithm for perfect play in two-player zero-sum games. Maximizing player seeks highest score, minimizing player seeks lowest. Used in chess, tic-tac-toe, etc.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Missionaries & Cannibals" level="Intermediate" desc="River crossing puzzle with constraints"
            :icon="Users" route="/ai-problems/missionaries" :info="{
              name: 'Missionaries and Cannibals',
              best: 'O(N²)',
              average: 'O(N²)',
              worst: 'O(N²)',
              space: 'O(N²)',
              stable: 'N/A',
              inPlace: false,
              description: 'Classic river crossing puzzle. Transport 3 missionaries and 3 cannibals across river safely. Boat holds 2 people. Cannibals cannot outnumber missionaries on either side.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="8-Puzzle Problem" level="Intermediate" desc="Sliding tile puzzle using A* search"
            :icon="LayoutGrid" route="/ai-problems/puzzle" :info="{
              name: '8-Puzzle Problem',
              best: 'O(b^d)',
              average: 'O(b^d)',
              worst: 'O(b^d)',
              space: 'O(b^d)',
              stable: 'N/A',
              inPlace: false,
              description: 'Sliding tile puzzle solved using A* search with Manhattan distance heuristic. Arrange tiles in correct order by sliding them into empty space. Classic AI search problem.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Vacuum Cleaner Agent" level="Beginner" desc="Simple reflex agent in grid world"
            :icon="Sparkles" route="/ai-problems/vacuum" :info="{
              name: 'Vacuum Cleaner Agent',
              best: 'O(N²)',
              average: 'O(N²)',
              worst: 'O(N²)',
              space: 'O(N²)',
              stable: 'N/A',
              inPlace: true,
              description: 'First AI agent concept. Simple reflex agent that perceives environment and acts. Demonstrates agent types: simple reflex vs. model-based. Core AI fundamental.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Alpha-Beta Pruning" level="Intermediate" desc="Optimized minimax with branch pruning"
            :icon="Scissors" route="/ai-problems/alphabeta" :info="{
              name: 'Alpha-Beta Pruning',
              best: 'O(b^(d/2))',
              average: 'O(b^(3d/4))',
              worst: 'O(b^d)',
              space: 'O(d)',
              stable: 'N/A',
              inPlace: false,
              description: 'Optimization of minimax algorithm. Prunes branches that cannot affect final decision. Significantly reduces nodes evaluated in game trees. Essential for game AI.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Hill Climbing" level="Intermediate" desc="Local search optimization algorithm"
            :icon="TrendingUp" route="/ai-problems/hillclimbing" :info="{
              name: 'Hill Climbing',
              best: 'O(∞)',
              average: 'Varies',
              worst: 'O(∞)',
              space: 'O(1)',
              stable: 'N/A',
              inPlace: true,
              description: 'Greedy local search that always moves to best neighbor. Fast but can get stuck in local maxima. No backtracking. Good for quick approximate solutions.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Simulated Annealing" level="Intermediate" desc="Probabilistic optimization with cooling"
            :icon="Flame" route="/ai-problems/annealing" :info="{
              name: 'Simulated Annealing',
              best: 'O(∞)',
              average: 'Probabilistic',
              worst: 'O(∞)',
              space: 'O(1)',
              stable: 'N/A',
              inPlace: true,
              description: 'Probabilistic hill climbing inspired by metallurgy. Accepts worse solutions with decreasing probability (temperature). Can escape local maxima. Used in optimization.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Map Coloring CSP" level="Intermediate" desc="Constraint satisfaction with backtracking"
            :icon="Palette" route="/ai-problems/mapcoloring" :info="{
              name: 'Map Coloring',
              best: 'O(d^n)',
              average: 'O(d^n)',
              worst: 'O(d^n)',
              space: 'O(n)',
              stable: 'N/A',
              inPlace: false,
              description: 'Classic CSP problem. Color map regions so no adjacent regions share same color. Demonstrates constraint satisfaction, backtracking, and constraint propagation.'
            }" @show-info="selectedInfo = $event" />
          <AlgoCard title="Genetic Algorithm" level="Intermediate" desc="Evolutionary optimization algorithm"
            :icon="Dna" route="/ai-problems/genetic" :info="{
              name: 'Genetic Algorithm',
              best: 'O(g × p × f)',
              average: 'O(g × p × f)',
              worst: 'O(g × p × f)',
              space: 'O(p)',
              stable: 'N/A',
              inPlace: false,
              description: 'Evolutionary algorithm mimicking natural selection. Population evolves through selection, crossover, and mutation. Excellent for complex optimization in large search spaces.'
            }" @show-info="selectedInfo = $event" />
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
import { sortingMeta } from "@/algorithms/sorting/sortingMeta"
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
  Grid3x3,
  Droplet,
  Brain,
  Users,
  LayoutGrid,
  Sparkles,
  Scissors,
  TrendingUp,
  Flame,
  Palette,
  Dna,
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
