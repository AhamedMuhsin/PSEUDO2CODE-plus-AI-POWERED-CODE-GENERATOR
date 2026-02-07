<template>
    <AuthNavbar />
  <div class="queue-hub-container">
    <QueueOperationsVisualizerBase />
  </div>
</template>

<script setup>
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import QueueOperationsVisualizerBase from "@/components/visualizer/QueueOperationsVisualizerBase.vue"
</script>

<style scoped>
.queue-hub-container {
  width: 100%;
  min-height: 100vh;
}
</style>
