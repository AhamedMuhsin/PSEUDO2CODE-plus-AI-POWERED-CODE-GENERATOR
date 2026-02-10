<template>
  <AuthNavbar />
  <main class="visualizer-page">
    <div class="container">
      <BinaryTreeVisualizerBase />
    </div>
  </main>
</template>

<script setup>
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import BinaryTreeVisualizerBase from "@/components/visualizer/BinaryTreeVisualizerBase.vue"
</script>

<style scoped>
.visualizer-page {
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 32px;
  min-height: calc(100vh - 70px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .visualizer-page {
    padding: 16px;
  }
}
</style>
