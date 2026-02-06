<template>
  <AuthNavbar />

  <main class="visualizer-page">
    <div class="container">
      <header>
        <h1>Array Operations</h1>
        <p>Visualize common array operations step by step</p>
      </header>

      <ArrayOperationSelector
        v-model="selectedOp"
        :operations="arrayOperations"
      />

      <ArrayOperationsVisualizerBase
        v-if="currentOperation"
        :title="currentOperation.label"
        :description="currentOperation.description"
        :generateSteps="currentOperation.generator"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue"
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import ArrayOperationSelector from "@/components/visualizer/ArrayOperationSelector.vue"
import { arrayOperations } from "@/algorithms/arrayOperations/arrayOperationsMap"

const selectedOp = ref("traverse")

const currentOperation = computed(() =>
  arrayOperations[selectedOp.value]
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
