<template>
  <main class="visualizer-page">
    <div class="container-compact">
      <div class="top-section-compact">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>

      <header class="page-header-compact">
        <div class="header-top-row">
          <div class="operation-title-group-compact">
            <h1>{{ currentOperation.label || 'Graph Operations' }}</h1>
            <button v-if="currentOperation.info" class="info-btn-compact" @click="showInfo = true"><Info :size="16" /></button>
          </div>
          <GraphOperationSelector v-model="selectedOp" class="selector-inline" />
        </div>
        <p class="operation-desc-compact">{{ currentOperation.description || 'Visualize graph algorithms' }}</p>
        <div v-if="currentOperation.info" class="algo-badges-compact">
          <span class="badge-compact">Time: {{ currentOperation.info.time }}</span>
          <span class="badge-compact">Space: {{ currentOperation.info.space }}</span>
        </div>
      </header>

      <div class="two-column-layout">
        <div class="left-column">
          <section class="input-section-compact">
            <div class="input-row-compact">
              <button class="btn-compact ghost" @click="generateRandomGraph">Random</button>
              <button class="btn-compact ghost" @click="loadSampleGraph">Sample</button>
              <template v-if="operationType === 'twoNodes'">
                <input v-model="operationParams.from" type="text" placeholder="From" class="custom-input-compact" />
                <input v-model="operationParams.to" type="text" placeholder="To" class="custom-input-compact" />
                <button class="btn-compact ghost" @click="executeOperation" v-if="operationParams.from && operationParams.to">Run</button>
              </template>
              <button class="btn-compact ghost" @click="goToGenerateCode">Code</button>
            </div>
          </section>

          <section class="controls-compact">
            <button class="btn-compact ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
            <button class="btn-compact primary" @click="play" :disabled="!isPlayable">{{ playing ? 'Pause' : 'Play' }}</button>
            <button class="btn-compact ghost" @click="next" :disabled="stepIndex === steps.length - 1">Next</button>
            <button class="btn-compact danger" @click="reset">Reset</button>
            <div class="step-counter-compact">{{ stepIndex + 1 }}/{{ steps.length }}</div>
          </section>

          <section class="canvas-compact">
            <GraphOperationCanvas
              :nodes="currentStep.graph"
              :edges="currentStep.edges"
              :visitedNodes="currentStep.visitedNodes"
              :activeNode="currentStep.activeNode"
              :highlightedEdges="currentStep.highlightedEdges"
            />
          </section>
        </div>

        <div class="right-column">
          <section class="pseudo-section-compact">
            <h3 class="section-title-compact">Pseudocode</h3>
            <div class="pseudo-scroll">
              <PseudoCodePanel v-if="currentOperation.pseudocode" :code="currentOperation.pseudocode" :activeLine="currentStep.activePseudoLine" />
            </div>
          </section>

          <section class="explanation-compact">
            <h3>Explanation</h3>
            <p>{{ currentStep.explanation }}</p>
            <div v-if="currentStep.distances" class="data-row-compact">
              <strong>Distances:</strong>
              <span v-for="(dist, node) in currentStep.distances" :key="node" class="data-tag">{{ node }}: {{ dist === Infinity ? '∞' : dist }}</span>
            </div>
            <div v-if="currentStep.gScore" class="data-row-compact">
              <strong>g-Score:</strong>
              <span v-for="(score, node) in currentStep.gScore" :key="node" class="data-tag">{{ node }}: {{ score === Infinity ? '∞' : score }}</span>
            </div>
            <div v-if="currentStep.fScore" class="data-row-compact">
              <strong>f-Score:</strong>
              <span v-for="(score, node) in currentStep.fScore" :key="node" class="data-tag">{{ node }}: {{ score === Infinity ? '∞' : typeof score === 'number' ? score.toFixed(2) : score }}</span>
            </div>
            <div v-if="currentStep.heuristic" class="data-row-compact">
              <strong>Heuristic:</strong>
              <span v-for="(h, node) in currentStep.heuristic" :key="node" class="data-tag">{{ node }}: {{ h }}</span>
            </div>
            <div v-if="currentStep.openSet && currentStep.openSet.length > 0" class="data-row-compact">
              <strong>Open:</strong> [{{ currentStep.openSet.join(", ") }}]
            </div>
            <div v-if="currentStep.closedSet && currentStep.closedSet.length > 0" class="data-row-compact">
              <strong>Closed:</strong> [{{ currentStep.closedSet.join(", ") }}]
            </div>
            <div v-if="currentStep.path && currentStep.path.length > 0" class="data-row-compact path-found">
              <strong><Target :size="14" /> Path:</strong> {{ currentStep.path.join(" → ") }}
            </div>
            <div v-if="currentStep.queueState && currentStep.queueState.length > 0" class="data-row-compact">
              <strong>Queue:</strong> [{{ currentStep.queueState.join(", ") }}]
            </div>
            <div v-if="currentStep.stackState && currentStep.stackState.length > 0" class="data-row-compact">
              <strong>Stack:</strong> [{{ currentStep.stackState.join(", ") }}]
            </div>
          </section>
        </div>
      </div>
    </div>
    <AlgorithmInfoModal v-if="showInfo && currentOperation.info" :info="currentOperation.info" @close="showInfo = false" />
  </main>
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
import { Info, Target, Check, X } from 'lucide-vue-next'

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

  // Add edges for a connected graph with varying weights
  // This creates a scenario where A* can show its advantage over Dijkstra
  currentGraph.addEdge("A", "B", 4)
  currentGraph.addEdge("A", "C", 2)
  currentGraph.addEdge("B", "D", 5)
  currentGraph.addEdge("C", "D", 1)
  currentGraph.addEdge("C", "E", 10)
  currentGraph.addEdge("D", "E", 3)
  currentGraph.addEdge("D", "F", 2)
  currentGraph.addEdge("E", "F", 1)

  initializeSteps()
}

const generateRandomGraph = () => {
  initializeGraph()
  const nodeCount = Math.floor(Math.random() * 3) + 4 // 4-6 nodes
  const nodes = Array.from({ length: nodeCount }, (_, i) => String.fromCharCode(65 + i))
  nodes.forEach(n => currentGraph.addNode(n))

  // Add random edges with random weights
  for (let i = 0; i < nodes.length; i++) {
    const connectTo = Math.floor(Math.random() * Math.min(3, nodes.length - 1)) + 1
    for (let j = 0; j < connectTo; j++) {
      const targetIdx = Math.floor(Math.random() * nodes.length)
      if (nodes[i] !== nodes[targetIdx]) {
        const weight = Math.floor(Math.random() * 10) + 1 // Random weight 1-10
        currentGraph.addEdge(nodes[i], nodes[targetIdx], weight)
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
.visualizer-page {
  background: var(--bg-page);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.container-compact {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 18px;
  min-height: 0;
  overflow: hidden;
}
.top-section-compact { margin-bottom: 4px; }
.back-btn-compact {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(99,102,241,.12);
  border: 1px solid var(--accent-border);
  color: var(--accent-light);
  padding: 4px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: .78rem;
  font-weight: 500;
  transition: all .2s;
}
.back-btn-compact:hover { background: rgba(99,102,241,.22); }
.arrow { width: 15px; height: 15px; }
.page-header-compact { margin-bottom: 6px; }
.header-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.operation-title-group-compact { display: flex; align-items: center; gap: 8px; }
.page-header-compact h1 {
  font-size: 1.15rem;
  margin: 0;
  background: var(--accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.info-btn-compact {
  background: rgba(99,102,241,.18);
  border: 1px solid var(--accent-border);
  color: var(--accent-light);
  width: 26px; height: 26px;
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s;
  padding: 0;
}
.info-btn-compact:hover { background: rgba(99,102,241,.32); }
.selector-inline { max-width: 220px; }
.operation-desc-compact { color: var(--text-muted); font-size: .78rem; margin: 2px 0 0; line-height: 1.3; }
.algo-badges-compact { display: flex; gap: 6px; margin-top: 4px; }
.badge-compact {
  background: rgba(99,102,241,.12);
  border: 1px solid var(--accent-border);
  color: var(--text-tertiary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: .72rem;
  font-weight: 500;
}
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  overflow: hidden;
}
.input-section-compact { flex-shrink: 0; }
.input-row-compact { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.custom-input-compact {
  padding: 5px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0,.55);
  border: 1px solid var(--accent-border);
  color: var(--text-primary);
  font-size: .78rem;
  flex: 1;
  min-width: 50px;
  max-width: 80px;
  transition: border-color .2s;
}
.custom-input-compact:focus { outline: none; border-color: var(--accent); }
.controls-compact { display: flex; gap: 6px; align-items: center; flex-shrink: 0; flex-wrap: wrap; }
.step-counter-compact { margin-left: auto; color: var(--text-muted); font-size: .75rem; font-weight: 500; }
.btn-compact {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 7px;
  font-size: .76rem;
  font-weight: 500;
  cursor: pointer;
  transition: all .2s;
  border: none;
  white-space: nowrap;
}
.btn-compact.ghost { background: rgba(99,102,241,.12); border: 1px solid var(--accent-border); color: var(--accent-light); }
.btn-compact.ghost:hover { background: rgba(99,102,241,.22); }
.btn-compact.primary { background-color: var(--accent); color: var(--text-primary); }
.btn-compact.primary:hover:not(:disabled) { background-color: var(--accent-hover); box-shadow: 0 3px 10px rgba(99,102,241,.35); }
.btn-compact.danger { background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.25); color: var(--error-text); }
.btn-compact.danger:hover:not(:disabled) { background: rgba(239,68,68,.22); }
.btn-compact:disabled { opacity: .4; cursor: not-allowed; }
.canvas-compact {
  flex: 1;
  min-height: 0;
  background: var(--bg-deep);
  border: 1px solid var(--accent-border);
  border-radius: 10px;
  padding: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pseudo-section-compact {
  flex: 1;
  min-height: 0;
  background: var(--bg-deep);
  backdrop-filter: blur(8px);
  border: 1px solid var(--accent-border);
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.section-title-compact {
  color: var(--text-tertiary);
  font-size: .75rem;
  font-weight: 600;
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: .5px;
  flex-shrink: 0;
}
.pseudo-scroll { flex: 1; min-height: 0; overflow-y: auto; }
.pseudo-scroll::-webkit-scrollbar { width: 4px; }
.pseudo-scroll::-webkit-scrollbar-track { background: transparent; }
.pseudo-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,.25); border-radius: 4px; }
.explanation-compact {
  flex-shrink: 0;
  max-height: 140px;
  background: var(--bg-deep);
  backdrop-filter: blur(8px);
  border: 1px solid var(--accent-border);
  border-radius: 10px;
  padding: 8px 10px;
  overflow-y: auto;
}
.explanation-compact::-webkit-scrollbar { width: 4px; }
.explanation-compact::-webkit-scrollbar-track { background: transparent; }
.explanation-compact::-webkit-scrollbar-thumb { background: rgba(99,102,241,.25); border-radius: 4px; }
.explanation-compact h3 { color: var(--text-tertiary); font-size: .75rem; font-weight: 600; margin: 0 0 3px; text-transform: uppercase; letter-spacing: .5px; }
.explanation-compact p { color: var(--text-muted); font-size: .78rem; line-height: 1.45; margin: 0 0 4px; }
.data-row-compact {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  font-size: .72rem;
  color: var(--accent-light);
  margin-top: 3px;
}
.data-row-compact strong { color: var(--text-tertiary); font-size: .72rem; }
.data-tag {
  background: rgba(99,102,241,.12);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: .7rem;
}
.data-row-compact.path-found {
  background: rgba(34,197,94,.1);
  border: 1px solid rgba(34,197,94,.25);
  border-radius: 6px;
  padding: 3px 6px;
  color: var(--success-text);
}
@media (max-width: 900px) {
  .two-column-layout { grid-template-columns: 1fr; }
  .visualizer-page { height: auto; overflow: auto; }
}
</style>
