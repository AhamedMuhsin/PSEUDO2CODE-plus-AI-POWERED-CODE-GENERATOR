<template>
  <AuthNavbar />
  <div class="graph-hub-container">
    <GraphOperationsVisualizerBase />
  </div>
</template>

<script setup>
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import GraphOperationsVisualizerBase from "@/components/visualizer/GraphOperationsVisualizerBase.vue"
</script>

<style scoped>
.graph-hub-container {
  width: 100%;
  min-height: 100vh;
}
</style>
