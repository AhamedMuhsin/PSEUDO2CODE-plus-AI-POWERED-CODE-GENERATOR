<template>
  <AuthNavbar />
  <main class="visualizer-page">
    <div class="container">
      <AdvancedLinkedListVisualizerBase />
    </div>
  </main>
</template>

<script setup>
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import AdvancedLinkedListVisualizerBase from "@/components/visualizer/AdvancedLinkedListVisualizerBase.vue"
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

header {
  margin-bottom: 32px;
}

header h1 {
  font-size: 1.8rem;
  color: #ffffff;
  margin-bottom: 8px;
}

header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

@media (max-width: 640px) {
  .visualizer-page {
    padding: 16px;
  }
}
</style>
