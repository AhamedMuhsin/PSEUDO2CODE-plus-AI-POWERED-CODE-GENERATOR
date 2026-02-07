<template>
  <AuthNavbar />
  <main class="visualizer-page">
    <div class="container">
      <StackOperationsVisualizerBase
        v-if="currentOperation"
        :title="currentOperation.label"
        :description="currentOperation.description"
        :generateSteps="currentOperation.generator"
        :pseudocode="currentOperation.pseudocode"
        :algorithmName="currentOperation.algorithmName"
        :info="currentOperation.info"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue"
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import StackOperationsVisualizerBase from "@/components/visualizer/StackOperationsVisualizerBase.vue"
import { stackOperations } from "@/algorithms/stackOperations/stackOperationsMap"

const selectedOp = ref("push")

const currentOperation = computed(() =>
  stackOperations[selectedOp.value]
)
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
