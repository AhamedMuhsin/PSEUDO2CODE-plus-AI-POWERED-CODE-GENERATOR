<template>
  <AuthNavbar />

  <main class="visualizer-page">
    <div class="container">
      <div class="top-section">
        <button class="back-btn" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" />
          Back
        </button>
      </div>
      <header class="page-header">
        <h1>Array Operations</h1>
        <p>Visualize common array operations step by step</p>
      </header>

      <section class="operation-selector-section">
        <ArrayOperationSelector v-model="selectedOp" :operations="arrayOperations" />
      </section>
      <ArrayOperationsVisualizerBase v-if="currentOperation" :title="currentOperation.label"
        :description="currentOperation.description" :generateSteps="currentOperation.generator"
        :pseudocode="currentOperation.pseudocode" :algorithmName="currentOperation.algorithmName"
        :info="currentOperation.info" />
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue"
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue"
import arrowLeft from "@/assets/arrow-left.svg";
import ArrayOperationsVisualizerBase from "@/components/visualizer/ArrayOperationsVisualizerBase.vue"
import ArrayOperationSelector from "@/components/visualizer/ArrayOperationSelector.vue"
import { arrayOperations } from "@/algorithms/arrayOperations/arrayOperationsMap"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
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

.top-section {
  margin-bottom: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a78bfa;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.back-btn:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.5);
  transform: translateX(-2px);
}

.arrow {
  width: 18px;
  height: 18px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  color: white;
  font-size: 2.2rem;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #a78bfa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
}

/* OPERATION SELECTOR SECTION */
.operation-selector-section {
  margin-bottom: 24px;
  max-width: 400px;
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
