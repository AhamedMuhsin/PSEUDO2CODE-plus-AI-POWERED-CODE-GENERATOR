<template>
  <main class="visualizer-page">
    <div class="container-compact">
      <!-- BACK -->
      <div class="top-section-compact">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>

      <!-- HEADER -->
      <header class="page-header-compact">
        <div class="header-top-row">
          <div class="operation-title-group-compact">
            <h1>{{ currentOperation.label || 'Binary Tree Operations' }}</h1>
            <button v-if="currentOperation.info" class="info-btn-compact" @click="showInfo = true"><Info :size="16" /></button>
          </div>
          <BinaryTreeOperationSelector v-model="selectedOp" class="selector-inline" />
        </div>
        <p class="operation-desc-compact">{{ currentOperation.description || 'Visualize binary tree operations' }}</p>
        <div v-if="currentOperation.info" class="algo-badges-compact">
          <span class="badge-compact">Time: {{ currentOperation.info.time }}</span>
          <span class="badge-compact">Space: {{ currentOperation.info.space }}</span>
        </div>
      </header>

      <!-- TWO COLUMN LAYOUT -->
      <div class="two-column-layout">
        <!-- LEFT COLUMN -->
        <div class="left-column">
          <!-- INPUT -->
          <section class="input-section-compact">
            <div class="input-row-compact">
              <button class="btn-compact ghost" @click="generateRandomTree">Random</button>
              <input v-model="customTreeInput" placeholder="10,20,30,40,50" @keydown.enter="applyCustomTree" class="custom-input-compact" />
              <template v-if="operationType === 'value'">
                <input v-model.number="inputValue" type="number" :placeholder="inputLabel" class="custom-input-compact" @keydown.enter="executeOperation" />
              </template>
              <button class="btn-compact ghost" @click="generateCode">Code</button>
            </div>
          </section>

          <!-- CONTROLS -->
          <section class="controls-compact">
            <button class="btn-compact ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
            <button class="btn-compact primary" @click="togglePlay" :disabled="steps.length === 0">{{ playing ? 'Pause' : 'Play' }}</button>
            <button class="btn-compact ghost" @click="next" :disabled="stepIndex === steps.length - 1 || steps.length === 0">Next</button>
            <button class="btn-compact danger" @click="reset">Reset</button>
            <div class="step-counter-compact">{{ stepIndex + 1 }}/{{ steps.length }}</div>
          </section>

          <!-- CANVAS -->
          <section class="canvas-compact">
            <BinaryTreeCanvas
              :treeArray="currentStep.treeArray"
              :activeNodeIndex="currentStep.activeNode"
              :targetIndex="currentStep.targetIndex"
              :highlightNodes="currentStep.highlightNodes || []"
              :traversalOrder="currentStep.traversalOrder || []"
              :leafNodes="currentStep.leafNodes || []"
            />
          </section>
        </div>

        <!-- RIGHT COLUMN -->
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
          </section>
        </div>
      </div>
    </div>
    <AlgorithmInfoModal v-if="showInfo && currentOperation.info" :info="currentOperation.info" @close="showInfo = false" />
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import BinaryTreeOperationSelector from "@/components/visualizer/BinaryTreeOperationSelector.vue"
import BinaryTreeCanvas from "@/components/visualizer/canvases/BinaryTreeCanvas.vue"
import PseudoCodePanel from "@/components/visualizer/PseudoCodePanel.vue"
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"
import arrowLeft from "@/assets/arrow-left.svg"
import { Info, Check, X } from 'lucide-vue-next'

import { BinaryTree } from "@/algorithms/binaryTreeOperations/BinaryTree.js"
import { BinaryTreeExecutor } from "@/algorithms/binaryTreeOperations/executor.js"
import { binaryTreeOperations } from "@/algorithms/binaryTreeOperations/binaryTreeOperationsMap.js"

const router = useRouter()

// State
const selectedOp = ref("inorder")
const tree = ref(new BinaryTree())
const steps = ref([])
const stepIndex = ref(0)
const playing = ref(false)
const showInfo = ref(false)
const customTreeInput = ref("")
const inputValue = ref("")
let playInterval = null

// Computed properties
const currentOperation = computed(() => binaryTreeOperations[selectedOp.value] || {})

const operationType = computed(() => {
  if (currentOperation.value.paramType === "value") return "value"
  return null
})

const inputLabel = computed(() => {
  const op = selectedOp.value
  if (op === "insert") return "Enter node value to insert:"
  if (op === "search") return "Enter node value to search:"
  if (op === "delete") return "Enter node value to delete:"
  return "Enter value:"
})

const currentStep = computed(() => {
  if (steps.value.length === 0) {
    return {
      type: "empty",
      message: "No steps",
      treeArray: [],
      activeNode: -1,
      targetIndex: -1,
      highlightNodes: [],
      traversalOrder: [],
      leafNodes: [],
      explanation: "Select an operation and click execute to begin.",
      activePseudoLine: 0
    }
  }
  return steps.value[stepIndex.value] || {}
})

// Methods
const generateRandomTree = () => {
  tree.value = new BinaryTree()
  const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 1)
  values.forEach(val => tree.value.insert(val))
  executeOperation()
}

const applyCustomTree = () => {
  if (!customTreeInput.value) return
  tree.value = new BinaryTree()
  const values = customTreeInput.value.split(",").map(v => {
    const num = parseInt(v.trim())
    return isNaN(num) ? 0 : num
  })
  values.forEach(val => tree.value.insert(val))
  executeOperation()
}

const executeOperation = () => {
  try {
    const operation = binaryTreeOperations[selectedOp.value]
    if (!operation || !operation.generator) {
      console.error("Operation not found or generator missing")
      return
    }
    
    // Properly handle input value - check if it's defined and valid
    let params = {}
    if (operation.hasParams) {
      // For operations that need input, validate the inputValue is not empty
      if (inputValue.value === "" || inputValue.value === null || inputValue.value === undefined) {
        console.error("Input value is required for this operation")
        return
      }
      params = { value: Number(inputValue.value) }
    }
    
    const result = operation.generator(tree.value, params)
    
    // Handle both formats: array of steps or object with { steps, result }
    if (Array.isArray(result)) {
      steps.value = result
    } else if (result && result.steps) {
      steps.value = result.steps
    } else {
      steps.value = []
    }
    
    stepIndex.value = 0
  } catch (error) {
    console.error("Error executing operation:", error)
    steps.value = []
  }
}

const generateCode = () => {
  const prompt = `Generate code to perform ${currentOperation.value.label} operation on a binary tree data structure. Include implementation details and example usage.`
  router.push({
    name: "GenerateCode",
    query: { prompt }
  })
}

const togglePlay = () => {
  if (playing.value) {
    playing.value = false
    if (playInterval) clearInterval(playInterval)
  } else {
    playing.value = true
    playInterval = setInterval(() => {
      if (stepIndex.value < steps.value.length - 1) {
        stepIndex.value++
      } else {
        playing.value = false
        if (playInterval) clearInterval(playInterval)
      }
    }, 800)
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
  stepIndex.value = 0
  playing.value = false
  if (playInterval) clearInterval(playInterval)
  inputValue.value = ""
}

// Watchers
watch(selectedOp, () => {
  executeOperation()
})

// Lifecycle
onMounted(() => {
  generateRandomTree()
})

onUnmounted(() => {
  if (playInterval) clearInterval(playInterval)
})
</script>

<style scoped>
/* ── PAGE SHELL ── */
.visualizer-page {
  background: radial-gradient(circle at top, #0f172a, #020617);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e2e8f0;
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
  border: 1px solid rgba(99,102,241,.25);
  color: #a78bfa;
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
  background: linear-gradient(135deg, #a78bfa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.info-btn-compact {
  background: rgba(99,102,241,.18);
  border: 1px solid rgba(99,102,241,.35);
  color: #a78bfa;
  width: 26px; height: 26px;
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s;
  padding: 0;
}
.info-btn-compact:hover { background: rgba(99,102,241,.32); }
.selector-inline { max-width: 220px; }
.operation-desc-compact { color: #94a3b8; font-size: .78rem; margin: 2px 0 0; line-height: 1.3; }
.algo-badges-compact { display: flex; gap: 6px; margin-top: 4px; }
.badge-compact {
  background: rgba(99,102,241,.12);
  border: 1px solid rgba(99,102,241,.25);
  color: #cbd5f5;
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
  background: rgba(2,6,23,.55);
  border: 1px solid rgba(99,102,241,.25);
  color: #fff;
  font-size: .78rem;
  flex: 1;
  min-width: 80px;
  transition: border-color .2s;
}
.custom-input-compact:focus { outline: none; border-color: #6366f1; }
.controls-compact { display: flex; gap: 6px; align-items: center; flex-shrink: 0; flex-wrap: wrap; }
.step-counter-compact { margin-left: auto; color: #94a3b8; font-size: .75rem; font-weight: 500; }
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
.btn-compact.ghost { background: rgba(99,102,241,.12); border: 1px solid rgba(99,102,241,.25); color: #a78bfa; }
.btn-compact.ghost:hover { background: rgba(99,102,241,.22); }
.btn-compact.primary { background: #6366f1; color: #fff; }
.btn-compact.primary:hover:not(:disabled) { background: #4f46e5; box-shadow: 0 3px 10px rgba(99,102,241,.35); }
.btn-compact.danger { background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.25); color: #fca5a5; }
.btn-compact.danger:hover:not(:disabled) { background: rgba(239,68,68,.22); }
.btn-compact:disabled { opacity: .4; cursor: not-allowed; }
.canvas-compact {
  flex: 1;
  min-height: 0;
  background: rgba(15,23,42,.7);
  border: 1px solid rgba(99,102,241,.15);
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
  background: rgba(15,23,42,.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(99,102,241,.15);
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.section-title-compact {
  color: #cbd5f5;
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
  max-height: 90px;
  background: rgba(15,23,42,.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(99,102,241,.15);
  border-radius: 10px;
  padding: 8px 10px;
  overflow-y: auto;
}
.explanation-compact::-webkit-scrollbar { width: 4px; }
.explanation-compact::-webkit-scrollbar-track { background: transparent; }
.explanation-compact::-webkit-scrollbar-thumb { background: rgba(99,102,241,.25); border-radius: 4px; }
.explanation-compact h3 { color: #cbd5f5; font-size: .75rem; font-weight: 600; margin: 0 0 3px; text-transform: uppercase; letter-spacing: .5px; }
.explanation-compact p { color: #94a3b8; font-size: .78rem; line-height: 1.45; margin: 0; }
@media (max-width: 900px) {
  .two-column-layout { grid-template-columns: 1fr; }
  .visualizer-page { height: auto; overflow: auto; }
}
</style>
