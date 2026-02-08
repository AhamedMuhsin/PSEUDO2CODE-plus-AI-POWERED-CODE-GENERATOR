<template>
  <div class="linkedlist-op-visualizer">
    <!-- BACK BUTTON & HEADER -->
    <div class="top-section">
      <button class="back-btn" @click="router.push('/algorithm-hub')">
        <img :src="arrowLeft" class="arrow" />
        Back
      </button>
    </div>

    <!-- PAGE HEADER -->
    <header class="page-header">
      <h1>LinkedList Operations</h1>
      <p>Visualize linked list data structure operations step by step</p>
    </header>

    <!-- OPERATION SELECTOR -->
    <section class="operation-selector-section">
      <LinkedListOperationSelector
        v-model="selectedOp"
        :operations="linkedListOperations"
      />
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

      <!-- CONTROLS ROW 1: List Input -->
      <div class="input-row">
        <button class="btn random-btn" @click="generateRandom">
          🎲 Random List
        </button>

        <input 
          v-model="customInput" 
          placeholder="Enter values: 10,20,30,40,50"
          @keydown.enter="applyCustomList" 
          class="list-input" 
        />

        <button class="btn ghost" @click="applyCustomList" v-if="customInput">
          Apply
        </button>

        <button class="btn ghost" @click="goToGenerateCode">
          💻 Generate Code
        </button>
      </div>

      <!-- CONTROLS ROW 2: Operation Parameters -->
      <div v-if="operationType === 'position-value'" class="input-row">
        <label>Position:</label>
        <input 
          v-model.number="insertPosition" 
          type="number" 
          placeholder="0"
          min="0"
          class="param-input"
        />
        <label>Value:</label>
        <input 
          v-model.number="insertValue" 
          type="number" 
          placeholder="Enter value"
          class="param-input"
          @keydown.enter="applyInsert"
        />
        <button class="btn ghost" @click="applyInsert" v-if="insertPosition !== null && insertValue !== null">
          Apply Insert
        </button>
      </div>

      <div v-else-if="operationType === 'position'" class="input-row">
        <label>Position:</label>
        <input 
          v-model.number="deletePosition" 
          type="number" 
          placeholder="0"
          min="0"
          class="param-input"
          @keydown.enter="applyDelete"
        />
        <button class="btn ghost" @click="applyDelete" v-if="deletePosition !== null">
          Apply Delete
        </button>
      </div>

      <div v-else-if="operationType === 'value'" class="input-row">
        <label>Search Value:</label>
        <input 
          v-model.number="searchValue" 
          type="number" 
          placeholder="Enter value"
          class="param-input"
          @keydown.enter="applySearch"
        />
        <button class="btn ghost" @click="applySearch" v-if="searchValue !== null">
          Apply Search
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
        <div class="canvas-header">
          <h3>LinkedList Visualization</h3>
          <span class="list-info">Nodes: {{ currentStep.list.length }}</span>
        </div>
        <LinkedListOperationCanvas 
          :list="currentStep.list" 
          :highlight="currentStep.highlight"
          :currentIndex="currentStep.currentIndex" 
        />
      </div>

      <!-- RIGHT: PSEUDOCODE -->
      <div class="pseudo-code-section">
        <h3>Algorithm Pseudocode</h3>
        <PseudoCodePanel 
          v-if="currentOperation.pseudocode" 
          :code="currentOperation.pseudocode" 
          :activeLine="currentStep.activeLine" 
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
import { ref, computed, watch, onMounted } from "vue"
import arrowLeft from "@/assets/arrow-left.svg"
import LinkedListOperationCanvas from "./canvases/LinkedListOperationCanvas.vue"
import { useRouter } from "vue-router"
import PseudoCodePanel from "@/components/visualizer/PseudoCodePanel.vue"
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"
import LinkedListOperationSelector from "@/components/visualizer/LinkedListOperationSelector.vue"
import { linkedListOperations } from "@/algorithms/linkedListOperations/linkedListOperationsMap"

const props = defineProps({
  title: String,
  description: String,
  algorithmName: String,
  info: Object
})

const selectedOp = ref("traverse")

const router = useRouter()
// Initialize with a dummy linked list
const baseList = ref([1, 2, 3, 4, 5])
const customInput = ref("")
const stepIndex = ref(0)
const playing = ref(false)
const showInfo = ref(false)

// Operation parameters
const insertPosition = ref(0)
const insertValue = ref(10)
const deletePosition = ref(0)
const searchValue = ref(3)

const currentOperation = computed(() =>
  linkedListOperations[selectedOp.value]
)

const operationType = computed(() => {
  if (selectedOp.value === "insert") return "position-value"
  if (selectedOp.value === "delete") return "position"
  if (selectedOp.value === "search") return "value"
  return null
})

const generateAndUpdateSteps = () => {
  const op = linkedListOperations[selectedOp.value]
  if (op?.generator) {
    let params = {}
    if (selectedOp.value === "insert") {
      params = { position: insertPosition.value, value: insertValue.value }
    } else if (selectedOp.value === "delete") {
      params = { position: deletePosition.value }
    } else if (selectedOp.value === "search") {
      params = { value: searchValue.value }
    }
    steps.value = op.generator(baseList.value, params)
  }
}

const steps = ref([])

const currentStep = computed(() =>
  steps.value[stepIndex.value] || {
    list: baseList.value,
    highlight: [],
    currentIndex: -1,
    activeLine: 0,
    explanation: "Ready to perform a linked list operation."
  }
)

onMounted(() => {
  generateAndUpdateSteps()
})

let timer = null

watch(selectedOp, () => {
  generateAndUpdateSteps()
  reset()
})

watch(
  baseList,
  () => {
    generateAndUpdateSteps()
    reset()
  },
  { deep: true }
)

watch([insertPosition, insertValue, deletePosition, searchValue], () => {
  generateAndUpdateSteps()
  reset()
})

function applyInsert() {
  if (insertPosition.value !== null && insertValue.value !== null) {
    generateAndUpdateSteps()
    reset()
  }
}

function applyDelete() {
  if (deletePosition.value !== null) {
    generateAndUpdateSteps()
    reset()
  }
}

function applySearch() {
  if (searchValue.value !== null) {
    generateAndUpdateSteps()
    reset()
  }
}

watch(baseList, () => reset())

const isPlayable = computed(() => {
  if (operationType.value === "position-value") {
    return insertPosition.value !== null && insertValue.value !== null
  }
  if (operationType.value === "position") {
    return deletePosition.value !== null
  }
  if (operationType.value === "value") {
    return searchValue.value !== null
  }
  return true
})

function play() {
  if (playing.value) return
  playing.value = true
  timer = setInterval(() => {
    if (stepIndex.value < steps.value.length - 1) stepIndex.value++
    else pause()
  }, 800)
}

function pause() {
  playing.value = false
  clearInterval(timer)
}

function next() {
  pause()
  if (stepIndex.value < steps.value.length - 1) stepIndex.value++
}

function prev() {
  pause()
  if (stepIndex.value > 0) stepIndex.value--
}

function reset() {
  pause()
  generateAndUpdateSteps()
  stepIndex.value = 0
}

function generateRandom() {
  const size = Math.floor(Math.random() * 4) + 3
  const arr = []
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 20) + 1)
  }
  baseList.value = arr
}

function applyCustomList() {
  if (!customInput.value) return
  try {
    const values = customInput.value
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v))

    if (values.length > 0) {
      baseList.value = values
      customInput.value = ""
    }
  } catch (e) {
    console.error("Invalid input", e)
  }
}

function goToGenerateCode() {
  const prompt = `Write a program for the ${props.algorithmName || props.title} operation on a linked list. 
Take a random input linked list and demonstrate the operation.`

  router.push({
    path: '/generate-code',
    query: { prompt }
  })
}
</script>

<style scoped>
.linkedlist-op-visualizer {
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
  max-width: 400px;
}

/* OPERATION DETAILS SECTION */
.operation-details {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.operation-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.operation-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.operation-details h2 {
  color: #cbd5f5;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}

.info-btn {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a78bfa;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.info-btn:hover {
  background: rgba(99, 102, 241, 0.35);
  border-color: rgba(167, 139, 250, 0.6);
  transform: scale(1.05);
}

.operation-desc {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

/* COMPLEXITY BADGES */
.complexity-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #cbd5f5;
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
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.input-row label {
  color: #cbd5f5;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.list-input {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: white;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 150px;
}

.list-input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(2, 6, 23, 0.8);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 10px 14px;
  border-radius: 10px;
  transition: all 0.2s ease;
  border: none;
  white-space: nowrap;
}

.random-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
}

.random-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.45);
}

.btn.ghost {
  background: rgba(99, 102, 241, 0.15);
  color: #a78bfa;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.btn.ghost:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(167, 139, 250, 0.5);
}

.param-input {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: white;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 100px;
}

.param-input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(2, 6, 23, 0.8);
}

/* CONTROLS ROW */
.controls-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.control-btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  background: rgba(99, 102, 241, 0.15);
  color: #a78bfa;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.control-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(167, 139, 250, 0.5);
  transform: translateY(-1px);
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-btn.primary {
  background: #6366f1;
  color: white;
  border: none;
}

.control-btn.primary:hover:not(:disabled) {
  background: #4f46e5;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.control-btn.danger {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.control-btn.danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
}

.step-counter {
  margin-left: auto;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

/* VISUALIZATION AREA */
.visualization-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.canvas-section {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.canvas-section h3 {
  color: #cbd5f5;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.list-info {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a78bfa;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.pseudo-code-section {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pseudo-code-section h3 {
  color: #cbd5f5;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* EXPLANATION SECTION */
.explanation-section {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 24px;
}

.explanation-section h3 {
  color: #cbd5f5;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.explanation-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.explanation-content p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .visualization-area {
    grid-template-columns: 1fr;
  }

  .linkedlist-op-visualizer {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .linkedlist-op-visualizer {
    padding: 12px;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .page-header p {
    font-size: 0.9rem;
  }

  .operation-details {
    padding: 16px;
    gap: 12px;
  }

  .input-row,
  .controls-row {
    flex-direction: column;
  }

  .input-row > *,
  .controls-row > * {
    width: 100%;
    min-width: unset;
  }

  .step-counter {
    margin-left: 0;
    text-align: center;
  }

  .visualization-area {
    grid-template-columns: 1fr;
  }

  .canvas-section,
  .pseudo-code-section {
    padding: 16px;
  }

  .explanation-section {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .linkedlist-op-visualizer {
    padding: 8px;
  }

  .page-header h1 {
    font-size: 1.4rem;
  }

  .operation-title-group {
    flex-wrap: wrap;
  }

  .complexity-badges {
    flex-direction: column;
  }

  .badge {
    width: 100%;
    text-align: center;
  }

  .input-row,
  .controls-row {
    gap: 6px;
  }

  .control-btn,
  .list-input,
  .param-input {
    font-size: 0.8rem;
    padding: 8px 10px;
  }
}
</style>
