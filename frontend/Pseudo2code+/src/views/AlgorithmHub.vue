<template>
  <AuthNavbar />
  <main class="hub-page">
    <!-- Header -->
    <section class="hub-header">
      <h1>Algorithm Visualizer</h1>
      <p>Learn algorithms step by step with interactive visualizations</p>
    </section>

    <!-- Sorting -->
    <section class="hub-section">
      <h2>Sorting Algorithms</h2>

      <div class="card-grid">
        <AlgorithmCard
          title="Bubble Sort"
          level="Beginner"
          description="Compare and swap adjacent elements"
          @click="open('bubble-sort')"
        />

        <AlgorithmCard
          title="Selection Sort"
          level="Beginner"
          description="Select minimum element repeatedly"
          @click="open('selection-sort')"
        />
      </div>
    </section>

    <!-- Data Structures -->
    <section class="hub-section">
      <h2>Data Structures</h2>

      <div class="card-grid">
        <AlgorithmCard
          title="Stack"
          level="Beginner"
          description="LIFO data structure operations"
          @click="open('stack')"
        />

        <AlgorithmCard
          title="Queue"
          level="Beginner"
          description="FIFO data structure operations"
          @click="open('queue')"
        />
      </div>
    </section>

    <!-- AI Algorithms -->
    <section class="hub-section">
      <h2>AI Algorithms</h2>

      <div class="card-grid">
        <AlgorithmCard
          title="K-Means Clustering"
          level="Intermediate"
          description="Group data points into clusters"
          @click="open('k-means')"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from "vue-router"
import AlgorithmCard from "@/components/visualizer/AlgorithmCard.vue"
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"

const router = useRouter()

function open(id) {
  router.push(`/visualize/${id}`)
}
</script>

<style scoped>

.hub-page {
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 32px;
  max-width: 1200px;
  margin: auto;
}

.hub-header h1 {
  font-size: 2rem;
}

.hub-header p {
  color: #94a3b8;
  margin-top: 6px;
}

.hub-section {
  margin-top: 40px;
}

.hub-section h2 {
  margin-bottom: 16px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
</style>
