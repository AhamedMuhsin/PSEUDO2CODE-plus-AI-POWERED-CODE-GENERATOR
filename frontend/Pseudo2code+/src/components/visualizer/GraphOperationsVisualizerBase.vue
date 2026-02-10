<template>
  <div class="graph-op-visualizer">
    <!-- BACK BUTTON & HEADER -->
    <div class="top-section">
      <button class="back-btn" @click="router.push('/algorithm-hub')">
        <img :src="arrowLeft" class="arrow" />
        Back
      </button>
    </div>

    <!-- PAGE HEADER -->
    <header class="page-header">
      <h1>Graph Operations</h1>
      <p>Visualize graph algorithms step by step</p>
    </header>

    <!-- OPERATION SELECTOR -->
    <section class="operation-selector-section">
      <GraphOperationSelector v-model="selectedOp" />
    </section>

    <!-- OPERATION DETAILS -->
    <section class="operation-details">
      <!-- OPERATION HEADER -->
      <div class="operation-header">
        <div class="operation-title-group">
          <h2>{{ currentOperation.label }}</h2>
          <button v-if="currentOperation.info" class="info-btn" @click="showInfo = true">ⓘ</button>
        </div>
        <p class="operation-desc">{{ currentOperation.description }}</p>
      </div>

      <!-- COMPLEXITY BADGES -->
      <div v-if="currentOperation.info" class="complexity-badges">
        <span class="badge">⏱️ Time: {{ currentOperation.info.time }}</span>
        <span class="badge">💾 Space: {{ currentOperation.info.space }}</span>
        <span class="badge" :class="currentOperation.info.stable ? 'stable' : 'unstable'">
          {{ currentOperation.info.stable ? '✓ Stable' : '✗ Unstable' }}
        </span>
      </div>

      <!-- CONTROLS ROW 1: Graph Input -->
      <div class="input-row">
        <button class="btn random-btn" @click="generateRandomGraph">
          🎲 Random Graph
        </button>

        <button class="btn ghost" @click="loadSampleGraph">
          📊 Sample Graph
        </button>

        <button class="btn ghost" @click="goToGenerateCode">
          💻 Generate Code
        </button>
      </div>

      <!-- CONTROLS ROW 2: Parameter Input (for operations with params) -->
      <div v-if="operationType === 'twoNodes'" class="input-row">
        <label>From Node:</label>
        <input 
          v-model="operationParams.from" 
          type="text" 
          placeholder="Node ID (e.g., A)"
          class="param-input"
        />
        <label>To Node:</label>
        <input 
          v-model="operationParams.to" 
          type="text" 
          placeholder="Node ID (e.g., B)"
          class="param-input"
        />
        <button class="btn ghost" @click="executeOperation" v-if="operationParams.from && operationParams.to">
          ▶ Run
        </button>
      </div>

      <!-- CONTROLS ROW 3: Play Controls -->
      <div class="controls-row">
        <button @click="prev" :disabled="stepIndex === 0" class="control-btn">
          ⬅ Prev
        </button>
        <button 
          @click="play" 
          :disabled="!isPlayable" 
          class="control-btn primary"
        >
          {{ playing ? '⏸ Pause' : '▶ Play' }}
        </button>
        <button 
          @click="next" 
          :disabled="stepIndex === steps.length - 1" 
          class="control-btn"
        >
          Next ➡
        </button>
        <button class="control-btn danger" @click="reset">
          🔄 Reset
        </button>

        <span class="step-counter">
          Step {{ stepIndex + 1 }} / {{ steps.length }}
        </span>
      </div>
    </section>

    <!-- MAIN VISUALIZATION AREA -->
    <section class="visualization-area">
      <!-- LEFT: CANVAS -->
      <div class="canvas-section">
        <h3>Graph Visualization</h3>
        <GraphOperationCanvas 
          :nodes="currentStep.graph" 
          :edges="currentStep.edges"
          :visitedNodes="currentStep.visitedNodes"
          :activeNode="currentStep.activeNode"
          :highlightedEdges="currentStep.highlightedEdges"
        />
      </div>

      <!-- RIGHT: PSEUDOCODE -->
      <div class="pseudo-code-section">
        <h3>Algorithm Pseudocode</h3>
        <PseudoCodePanel 
          v-if="currentOperation.pseudocode" 
          :code="currentOperation.pseudocode" 
          :activeLine="currentStep.activePseudoLine" 
        />
      </div>
    </section>

    <!-- EXPLANATION SECTION -->
    <section class="explanation-section">
      <h3>Step Explanation</h3>
      <div class="explanation-content">
        <p>{{ currentStep.explanation }}</p>
        <div v-if="currentStep.distances" class="distances-display">
          <strong>Distances:</strong>
          <span v-for="(dist, node) in currentStep.distances" :key="node" class="distance-item">
            {{ node }}: {{ dist === Infinity ? '∞' : dist }}
          </span>
        </div>
        <div v-if="currentStep.queueState && currentStep.queueState.length > 0" class="queue-display">
          <strong>Queue:</strong> [{{ currentStep.queueState.join(", ") }}]
        </div>
        <div v-if="currentStep.stackState && currentStep.stackState.length > 0" class="stack-display">
          <strong>Stack:</strong> [{{ currentStep.stackState.join(", ") }}]
        </div>
      </div>
    </section>

    <!-- INFO MODAL -->
    <AlgorithmInfoModal 
      v-if="showInfo && currentOperation.info" 
      :info="currentOperation.info" 
      @close="showInfo = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import arrowLeft from "@/assets/arrow-left.svg"
import GraphOperationCanvas from "./canvases/GraphOperationCanvas.vue"
import { useRouter } from "vue-router"
import PseudoCodePanel from "@/components/visualizer/PseudoCodePanel.vue"
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"
import GraphOperationSelector from "@/components/visualizer/GraphOperationSelector.vue"
import { graphOperations } from "@/algorithms/graphOperations/graphOperationsMap"
import { Graph } from "@/algorithms/graphOperations/Graph"

const router = useRouter()
const selectedOp = ref("bfs")
const stepIndex = ref(0)
const playing = ref(false)
const showInfo = ref(false)
const steps = ref([])

// Sample graph for operations
let currentGraph = new Graph(false, false)

const operationParams = ref({
  from: null,
  to: null,
  startNode: null
})

const currentOperation = computed(() => graphOperations[selectedOp.value])

const operationType = computed(() => {
  if (selectedOp.value === "checkPath") return "twoNodes"
  return null
})

const currentStep = computed(() =>
  steps.value[stepIndex.value] || {
    graph: [],
    edges: [],
    visitedNodes: [],
    activeNode: null,
    highlightedEdges: [],
    activePseudoLine: 0,
    explanation: ""
  }
)

const isPlayable = computed(() => {
  if (operationType.value === "twoNodes") {
    return operationParams.value.from && operationParams.value.to
  }
  return steps.value.length > 0
})

let timer = null

// Initialize graph on mount
onMounted(() => {
  loadSampleGraph()
})

// Watch for operation changes
watch(selectedOp, () => {
  operationParams.value = { from: null, to: null, startNode: null }
  initializeSteps()
})

const initializeGraph = () => {
  currentGraph = new Graph(false, false)
}

const loadSampleGraph = () => {
  // Create a sample graph
  initializeGraph()
  const nodes = ["A", "B", "C", "D", "E", "F"]
  nodes.forEach(n => currentGraph.addNode(n))

  // Add edges for a connected graph
  currentGraph.addEdge("A", "B", 1)
  currentGraph.addEdge("A", "C", 1)
  currentGraph.addEdge("B", "D", 1)
  currentGraph.addEdge("C", "D", 1)
  currentGraph.addEdge("C", "E", 1)
  currentGraph.addEdge("D", "F", 1)
  currentGraph.addEdge("E", "F", 1)

  initializeSteps()
}

const generateRandomGraph = () => {
  initializeGraph()
  const nodeCount = Math.floor(Math.random() * 3) + 4 // 4-6 nodes
  const nodes = Array.from({ length: nodeCount }, (_, i) => String.fromCharCode(65 + i))
  nodes.forEach(n => currentGraph.addNode(n))

  // Add random edges
  for (let i = 0; i < nodes.length; i++) {
    const connectTo = Math.floor(Math.random() * Math.min(3, nodes.length - 1)) + 1
    for (let j = 0; j < connectTo; j++) {
      const targetIdx = Math.floor(Math.random() * nodes.length)
      if (nodes[i] !== nodes[targetIdx]) {
        currentGraph.addEdge(nodes[i], nodes[targetIdx], 1)
      }
    }
  }

  initializeSteps()
}

const initializeSteps = () => {
  const op = graphOperations[selectedOp.value]
  if (op?.generateSteps) {
    steps.value = op.generateSteps(currentGraph, operationParams.value)
    stepIndex.value = 0
  }
}

const executeOperation = () => {
  if (operationType.value === "twoNodes" && operationParams.value.from && operationParams.value.to) {
    initializeSteps()
    play()
  }
}

const play = () => {
  if (stepIndex.value === steps.value.length - 1) {
    reset()
  }

  playing.value = !playing.value

  if (playing.value) {
    timer = setInterval(() => {
      if (stepIndex.value < steps.value.length - 1) {
        stepIndex.value++
      } else {
        playing.value = false
        clearInterval(timer)
      }
    }, 800)
  } else {
    clearInterval(timer)
  }
}

const next = () => {
  if (stepIndex.value < steps.value.length - 1) {
    stepIndex.value++
  }
}

const prev = () => {
  if (stepIndex.value > 0) {
    stepIndex.value--
  }
}

const reset = () => {
  playing.value = false
  clearInterval(timer)
  stepIndex.value = 0
}

const goToGenerateCode = () => {
  const prompt = `Generate code to perform ${currentOperation.value.algorithmName} operation on a graph data structure. Include implementation details and example usage.`
  router.push({
    name: "GenerateCode",
    query: { prompt }
  })
}
</script>

<style scoped>
.graph-op-visualizer {
  background: radial-gradient(circle at top, #0f172a, #020617);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

/* BACK BUTTON & TOP SECTION */
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

/* PAGE HEADER */
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
  display: flex;
  gap: 16px;
  align-items: center;
}

/* OPERATION DETAILS */
.operation-details {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.operation-header {
  margin-bottom: 16px;
}

.operation-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.operation-header h2 {
  color: #e0e7ff;
  font-size: 1.4rem;
  margin: 0;
}

.info-btn {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a78bfa;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.info-btn:hover {
  background: rgba(99, 102, 241, 0.4);
  border-color: rgba(99, 102, 241, 0.6);
}

.operation-desc {
  color: #cbd5e1;
  font-size: 0.95rem;
  margin: 0;
}

/* COMPLEXITY BADGES */
.complexity-badges {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.badge {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #c7d2fe;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge.stable {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
  color: #86efac;
}

.badge.unstable {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

/* INPUT ROWS */
.input-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.input-row label {
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 500;
}

.param-input {
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #e0e7ff;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.param-input:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* BUTTONS */
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.random-btn {
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #d8b4fe;
}

.btn.random-btn:hover {
  background: rgba(168, 85, 247, 0.3);
  border-color: rgba(168, 85, 247, 0.6);
}

.btn.ghost {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a78bfa;
}

.btn.ghost:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.5);
}

/* CONTROLS ROW */
.controls-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 16px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 10px 16px;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a78bfa;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.3);
  border-color: rgba(99, 102, 241, 0.5);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.primary {
  background: rgba(99, 102, 241, 0.3);
  border-color: rgba(99, 102, 241, 0.5);
}

.control-btn.danger {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.control-btn.danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
}

.step-counter {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-left: auto;
}

/* VISUALIZATION AREA */
.visualization-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.canvas-section,
.pseudo-code-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.canvas-section h3,
.pseudo-code-section h3 {
  color: #e0e7ff;
  font-size: 1.1rem;
  margin: 0;
  margin-bottom: 8px;
}

/* EXPLANATION SECTION */
.explanation-section {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.explanation-section h3 {
  color: #e0e7ff;
  font-size: 1.1rem;
  margin: 0 0 12px 0;
}

.explanation-content {
  color: #cbd5e1;
  line-height: 1.6;
  font-size: 0.95rem;
}

.explanation-content p {
  margin: 0 0 12px 0;
}

.distances-display {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 8px;
}

.distances-display strong {
  color: #e0e7ff;
}

.distance-item {
  background: rgba(99, 102, 241, 0.15);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  color: #a78bfa;
}

.queue-display,
.stack-display {
  margin-top: 12px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.4);
  border-radius: 8px;
  font-family: monospace;
  color: #a78bfa;
}

.queue-display strong,
.stack-display strong {
  color: #e0e7ff;
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .visualization-area {
    grid-template-columns: 1fr;
  }
}
</style>
