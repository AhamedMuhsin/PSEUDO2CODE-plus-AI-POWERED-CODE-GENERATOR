<template>
  <div class="binarytree-visualizer">
    <!-- BACK BUTTON & HEADER -->
    <div class="top-section">
      <button class="back-btn" @click="router.push('/algorithm-hub')">
        <img :src="arrowLeft" class="arrow" />
        Back
      </button>
    </div>

    <!-- PAGE HEADER -->
    <header class="page-header">
      <h1>Binary Tree Operations</h1>
      <p>Visualize Binary Tree data structure operations step by step</p>
    </header>

    <!-- OPERATION SELECTOR -->
    <section class="operation-selector-section">
      <BinaryTreeOperationSelector v-model="selectedOp" />
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

      <!-- CONTROLS ROW 1: Tree Input -->
      <div class="input-row">
        <button class="btn random-btn" @click="generateRandomTree">
          🎲 Random Tree
        </button>

        <input 
          v-model="customTreeInput" 
          placeholder="Enter values: 10,20,30,40,50"
          @keydown.enter="applyCustomTree" 
          class="tree-input" 
        />

        <button class="btn ghost" @click="applyCustomTree" v-if="customTreeInput">
          Apply
        </button>

        <button class="btn ghost" @click="generateCode">
          💻 Generate Code
        </button>
      </div>

      <!-- CONTROLS ROW 2: Value Input (for operations with params) -->
      <div v-if="operationType === 'value'" class="input-row">
        <label>{{ inputLabel }}</label>
        <input 
          v-model.number="inputValue" 
          type="number" 
          placeholder="Enter a number (then press Run)"
          class="param-input"
          @keydown.enter="executeOperation"
        />
        <button class="btn ghost" @click="executeOperation" v-if="inputValue !== null && inputValue !== ''">
          ▶ Run
        </button>
      </div>

      <!-- CONTROLS ROW 3: Play Controls -->
      <div class="controls-row">
        <button @click="prev" :disabled="stepIndex === 0" class="control-btn">
          ⬅ Prev
        </button>
        <button 
          @click="togglePlay" 
          :disabled="steps.length === 0" 
          class="control-btn primary"
        >
          {{ playing ? '⏸ Pause' : '▶ Play' }}
        </button>
        <button 
          @click="next" 
          :disabled="stepIndex === steps.length - 1 || steps.length === 0" 
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
        <h3>Binary Tree Visualization</h3>
        <BinaryTreeCanvas 
          :treeArray="currentStep.treeArray" 
          :activeNodeIndex="currentStep.activeNode"
          :targetIndex="currentStep.targetIndex"
          :highlightNodes="currentStep.highlightNodes || []"
          :traversalOrder="currentStep.traversalOrder || []"
          :leafNodes="currentStep.leafNodes || []"
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
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"
import BinaryTreeOperationSelector from "@/components/visualizer/BinaryTreeOperationSelector.vue"
import BinaryTreeCanvas from "@/components/visualizer/canvases/BinaryTreeCanvas.vue"
import PseudoCodePanel from "@/components/visualizer/PseudoCodePanel.vue"
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"
import arrowLeft from "@/assets/arrow-left.svg"

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
.binarytree-visualizer {
  background: radial-gradient(circle at top, #0f172a, #020617);
  min-height: 100vh;
  padding: 24px;
  color: #e2e8f0;
}

.top-section {
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  color: #818cf8;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.back-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
}

.arrow {
  width: 16px;
  height: 16px;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-header p {
  font-size: 1.1rem;
  color: #94a3b8;
}

.operation-selector-section {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.operation-details {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 24px;
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
  font-size: 1.5rem;
  color: #e2e8f0;
  margin: 0;
}

.info-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid #4f46e5;
  color: #6366f1;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.info-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: #818cf8;
}

.operation-desc {
  color: #cbd5e1;
  margin: 0;
  font-size: 0.95rem;
}

.complexity-badges {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 12px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 20px;
  font-size: 0.85rem;
  color: #cbd5e1;
  transition: all 0.2s ease;
}

.badge.stable {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
}

.badge.unstable {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.input-row,
.controls-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.tree-input,
.param-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 14px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.tree-input:focus,
.param-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn.random-btn {
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  color: white;
}

.btn.random-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn.ghost {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #818cf8;
}

.btn.ghost:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
}

.control-btn {
  flex: 1;
  min-width: 100px;
  padding: 10px 14px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  color: #818cf8;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.primary {
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  border: none;
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.control-btn.danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.control-btn.danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
}

.step-counter {
  padding: 10px 14px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  color: #cbd5e1;
  font-size: 0.9rem;
  min-width: 120px;
  text-align: center;
}

.visualization-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.canvas-section,
.pseudo-code-section {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 24px;
}

.canvas-section h3,
.pseudo-code-section h3 {
  color: #e2e8f0;
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.15rem;
}

.explanation-section {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.explanation-section h3 {
  color: #e2e8f0;
  margin-top: 0;
  margin-bottom: 12px;
}

.explanation-content {
  color: #cbd5e1;
  line-height: 1.6;
}

.explanation-content p {
  margin: 0;
}

.modal {
  margin: 24px;
  max-width: calc(100% - 48px);
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal h3 {
  color: #ffffff;
  margin-bottom: 16px;
  font-size: 1.3rem;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid #4f46e5;
  border-radius: 50%;
  color: #6366f1;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: #818cf8;
  color: #818cf8;
}

.modal-content {
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.6;
}

.modal-content p {
  margin-bottom: 16px;
}

.complexity-info h4 {
  color: #a78bfa;
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.complexity-info ul {
  list-style: none;
  padding-left: 0;
  margin: 0 0 8px 0;
}

.complexity-info li {
  padding: 6px 0;
  color: #cbd5e1;
}

/* Responsive */
@media (max-width: 1024px) {
  .visualization-area {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.8rem;
  }

  .input-row {
    flex-direction: column;
  }

  .tree-input {
    min-width: 100%;
  }

  .controls-row {
    flex-direction: column;
  }

  .control-btn {
    width: 100%;
  }

  .step-counter {
    margin-left: 0;
    width: 100%;
    text-align: center;
  }

  .visualization-area {
    grid-template-columns: 1fr;
  }

  .modal {
    margin: 16px;
    max-width: calc(100% - 32px);
  }
}

@media (max-width: 480px) {
  .binarytree-visualizer {
    padding: 16px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .input-row {
    flex-direction: column;
  }

  .tree-input,
  .param-input {
    font-size: 0.8rem;
    padding: 8px 10px;
  }
}
</style>
