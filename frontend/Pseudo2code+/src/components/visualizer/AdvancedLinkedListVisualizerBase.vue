<template>
  <div class="linkedlist-visualizer">
    <!-- BACK BUTTON -->
    <div class="top-section">
      <button class="back-btn" @click="router.push('/algorithm-hub')">
        <img :src="arrowLeft" class="arrow" />
        Back
      </button>
    </div>

    <!-- PAGE HEADER -->
    <header class="page-header">
      <h1>LinkedList Visualizer</h1>
      <p>Master different types of linked lists with step-by-step visualization</p>
    </header>

    <!-- TYPE SELECTOR (3 buttons) -->
    <section>
      <div class="type-buttons">
        <label class="section-label">List Type:</label>
        <button v-for="type in linkedListTypes" :key="type.key" @click="selectListType(type.key)"
          :class="['type-btn', { active: selectedListType === type.key }]">
          {{ type.label }}
        </button>
      </div>
    </section>

    <!-- OPERATION SELECTOR -->
    <section>
      <label class="section-label">Select Operation : </label>
      <select v-model="selectedOp" class="operation-dropdown">
        <option v-for="(op, key) in currentOperations" :key="key" :value="key">
          {{ op.label }}
        </option>
      </select>
    </section>

    <!-- OPERATION DETAILS - ALL IN ONE SECTION -->
    <section class="operation-details">
      <!-- OPERATION HEADER -->
      <div class="operation-header">
        <div class="operation-title-group">
          <h2>{{ currentOperation.label }}</h2>
          <button v-if="currentOperation.algorithmName" class="info-btn" @click="showInfo = true">ⓘ</button>
        </div>
        <p class="operation-desc">{{ currentOperation.description }}</p>
      </div>

      <div v-if="currentOperation.algorithmName" class="complexity-badges">
        <span class="badge">Best: {{ currentOperation.best }}</span>
        <span class="badge">Avg: {{ currentOperation.average }}</span>
        <span class="badge">Worst: {{ currentOperation.worst }}</span>
        <span class="badge">Space: {{ currentOperation.space }}</span>
        <span class="badge" :class="currentOperation.stable ? 'stable' : 'unstable'">
          {{ currentOperation.stable ? '✓ Stable' : '✗ Unstable' }}
        </span>
      </div>

      <!-- CONTROLS ROW 1: List Management -->
      <div class="input-row">
        <button class="btn random-btn" @click="generateRandomList">
          🎲 Random List
        </button>

        <input v-model="customListInput" placeholder="e.g., 10,20,30,40,50" @keydown.enter="applyCustomList"
          class="list-input" />

        <button v-if="customListInput" class="btn ghost" @click="applyCustomList">
          ✓ Apply
        </button>

        <button class="btn ghost" @click="generateCode">
          💻 Generate Code
        </button>
      </div>

      <!-- CONTROLS ROW 2: Operation Parameters (if needed) -->
      <div v-if="currentOperation.hasParams" class="input-row">
        <!-- Value Parameter -->
        <div v-if="currentOperation.paramType === 'value'" class="param-input-group">
          <label>Value to insert : </label>
          <input v-model.number="inputValue" type="number" placeholder="Enter value" class="param-input" />
        </div>

        <!-- Position Parameter -->
        <div v-else-if="currentOperation.paramType === 'position'" class="param-input-group">
          <label>Position to insert at : </label>
          <input v-model.number="inputPosition" type="number" min="0" :max="baseList.length" placeholder="0"
            class="param-input" />
        </div>

        <!-- Position + Value Parameters -->
        <div v-else-if="currentOperation.paramType === 'position-value'" class="param-input-group">
          <label>Position:</label>
          <input v-model.number="inputPosition" type="number" min="0" :max="baseList.length" placeholder="0"
            class="param-input" />
          <label>Value:</label>
          <input v-model.number="inputValue" type="number" placeholder="Enter value" class="param-input" />
        </div>
      </div>

      <!-- CONTROLS ROW 3: Play Controls -->
      <div class="controls-row">
        <button @click="prev" :disabled="stepIndex === 0" class="control-btn">
          ⬅ Prev
        </button>
        <button @click="togglePlay" :disabled="steps.length === 0" class="control-btn primary">
          {{ playing ? '⏸ Pause' : '▶ Play' }}
        </button>
        <button @click="next" :disabled="stepIndex === steps.length - 1 || steps.length === 0" class="control-btn">
          Next ➡
        </button>
        <button class="control-btn danger" @click="reset">
          🔄 Reset
        </button>
        <span class="step-counter">Step {{ stepIndex + 1 }} / {{ steps.length }}</span>
      </div>
    </section>

    <!-- CANVAS SECTION -->
    <section class="canvas-section">
      <div class="section-header">
        <h3>Visualization</h3>
        <span class="info-badge">{{ currentStep.list.length }} Node(s)</span>
      </div>
      <div class="canvas-wrapper">
        <AdvancedLinkedListCanvas :list="currentStep.list" :listType="selectedListType"
          :activeNodeIndex="currentStep.activeNodeIndex" :targetIndex="currentStep.targetIndex"
          :highlightNodes="currentStep.highlightNodes || []" />
      </div>
    </section>

    <!-- PSEUDOCODE SECTION -->
    <section class="pseudocode-section">
      <div class="section-header">
        <h3>Algorithm Pseudocode</h3>
      </div>
      <PseudoCodePanel v-if="currentOperation.pseudocode" :code="currentOperation.pseudocode"
        :activeLine="currentStep.activePseudoLine" />
    </section>

    <!-- EXPLANATION SECTION -->
    <section class="explanation-section">
      <div class="section-header">
        <h3>Step Explanation</h3>
      </div>
      <div class="explanation-content">
        <p>{{ currentStep.explanation }}</p>
        <div class="status-info">
          <div class="status-item">
            <span>List Size:</span>
            <strong>{{ currentStep.list.length }}</strong>
          </div>
          <div class="status-item">
            <span>Active Node:</span>
            <strong>{{ currentStep.activeNodeIndex >= 0 ? currentStep.activeNodeIndex : 'None' }}</strong>
          </div>
          <div v-if="currentOperation.hasParams" class="status-item">
            <span>Parameters:</span>
            <strong>{{ formatParams() }}</strong>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- INFO MODAL -->
  <AlgorithmInfoModal v-if="showInfo && currentOperation.algorithmName" :info="currentOperation"
    @close="showInfo = false" />
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import arrowLeft from "@/assets/arrow-left.svg"
import { useRouter } from "vue-router"
import AdvancedLinkedListCanvas from "./canvases/AdvancedLinkedListCanvas.vue"
import PseudoCodePanel from "./PseudoCodePanel.vue"
import AlgorithmInfoModal from "./AlgorithmInfoModal.vue"
import { linkedListOperationsMap, LINKED_LIST_TYPES } from "@/algorithms/linkedListOperations/operationsRegistry"

const router = useRouter()

// ============ STATE ============
const selectedListType = ref("singly")
const selectedOp = ref("traverse")
const baseList = ref([10, 20, 30, 40, 50])
const customListInput = ref("")
const stepIndex = ref(0)
const playing = ref(false)
const inputValue = ref(null)
const inputPosition = ref(null)
const steps = ref([])
const showInfo = ref(false)

const linkedListTypes = LINKED_LIST_TYPES

// ============ COMPUTED ============
const currentOperations = computed(() => {
  const ops = linkedListOperationsMap[selectedListType.value]
  return ops || {}
})

const currentOperation = computed(() => {
  return currentOperations.value[selectedOp.value] || {}
})

const currentStep = computed(() => {
  if (!steps.value || steps.value.length === 0) {
    return {
      list: [...baseList.value],
      activeNodeIndex: -1,
      targetIndex: -1,
      highlightNodes: [],
      activePseudoLine: 0,
      explanation: "Ready to start. Select an operation to begin visualization."
    }
  }
  return steps.value[stepIndex.value] || steps.value[0]
})

const isPlayable = computed(() => {
  const op = currentOperation.value
  if (!op || !op.hasParams) return steps.value.length > 0

  if (op.paramType === "value") {
    return inputValue.value !== null && inputValue.value !== "" && steps.value.length > 0
  } else if (op.paramType === "position") {
    return inputPosition.value !== null && inputPosition.value >= 0 && inputPosition.value <= baseList.value.length && steps.value.length > 0
  } else if (op.paramType === "position-value") {
    return (
      inputValue.value !== null &&
      inputValue.value !== "" &&
      inputPosition.value !== null &&
      inputPosition.value >= 0 &&
      inputPosition.value <= baseList.value.length &&
      steps.value.length > 0
    )
  }
  return true
})

// ============ METHODS ============
const formatParams = () => {
  const op = currentOperation.value
  if (!op.hasParams) return "-"
  if (op.paramType === "value") return `Value: ${inputValue.value}`
  if (op.paramType === "position") return `Position: ${inputPosition.value}`
  if (op.paramType === "position-value") return `Position: ${inputPosition.value}, Value: ${inputValue.value}`
  return "-"
}

const selectListType = (type) => {
  selectedListType.value = type
  selectedOp.value = "traverse"
  inputValue.value = null
  inputPosition.value = null
  steps.value = []
  reset()
}

const generateAndUpdateSteps = () => {
  const op = currentOperation.value
  try {
    if (!op || !op.generator) {
      steps.value = [{
        list: [...baseList.value],
        activeNodeIndex: -1,
        targetIndex: -1,
        highlightNodes: [],
        activePseudoLine: 0,
        explanation: "Operation not available."
      }]
      return
    }

    let generatedSteps = []

    // Call generator with correct parameters
    if (!op.hasParams) {
      generatedSteps = op.generator([...baseList.value])
    } else if (op.paramType === "value") {
      generatedSteps = op.generator([...baseList.value], inputValue.value)
    } else if (op.paramType === "position") {
      generatedSteps = op.generator([...baseList.value], inputPosition.value)
    } else if (op.paramType === "position-value") {
      generatedSteps = op.generator([...baseList.value], inputPosition.value, inputValue.value)
    }

    if (!Array.isArray(generatedSteps) || generatedSteps.length === 0) {
      steps.value = [{
        list: [...baseList.value],
        activeNodeIndex: -1,
        targetIndex: -1,
        highlightNodes: [],
        activePseudoLine: 0,
        explanation: "Operation completed."
      }]
    } else {
      steps.value = generatedSteps
    }
  } catch (err) {
    console.error("Error generating steps:", err)
    steps.value = [{
      list: [...baseList.value],
      activeNodeIndex: -1,
      targetIndex: -1,
      highlightNodes: [],
      activePseudoLine: 0,
      explanation: `Error: ${err.message}`
    }]
  }
}

const applyOperation = () => {
  if (!isPlayable.value) {
    alert("Please enter valid parameters")
    return
  }
  generateAndUpdateSteps()
  pause()
  stepIndex.value = 0
}

const generateRandomList = () => {
  const size = 5
  const arr = []
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 100) + 1)
  }
  baseList.value = arr
}

const applyCustomList = () => {
  if (!customListInput.value.trim()) return
  try {
    const values = customListInput.value
      .split(",")
      .map((v) => {
        const parsed = parseInt(v.trim())
        return isNaN(parsed) ? null : parsed
      })
      .filter((v) => v !== null)

    if (values.length === 0) {
      alert("Please enter valid numbers separated by commas")
      return
    }
    baseList.value = values
    customListInput.value = ""
  } catch (err) {
    alert("Please enter valid numbers separated by commas")
  }
}

let playTimer = null

const togglePlay = () => {
  if (playing.value) {
    pause()
  } else {
    play()
  }
}

const play = () => {
  if (steps.value.length === 0) return
  playing.value = true
  playTimer = setInterval(() => {
    if (stepIndex.value < steps.value.length - 1) {
      stepIndex.value++
    } else {
      pause()
    }
  }, 1000)
}

const pause = () => {
  playing.value = false
  if (playTimer) clearInterval(playTimer)
}

const next = () => {
  pause()
  if (stepIndex.value < steps.value.length - 1) {
    stepIndex.value++
  }
}

const prev = () => {
  pause()
  if (stepIndex.value > 0) {
    stepIndex.value--
  }
}

const reset = () => {
  pause()
  stepIndex.value = 0
}

const generateCode = () => {
  const op = currentOperation.value
  if (!op) {
    alert("No operation selected")
    return
  }

  const prompt = `Generate code to perform ${op.info?.algorithmName || op.label} operation on a ${selectedListType.value} linked list. Include implementation details and example usage.`
  router.push({
    name: "GenerateCode",
    query: { prompt }
  })
}

// ============ WATCHERS ============
watch([selectedOp, selectedListType], () => {
  inputValue.value = null
  inputPosition.value = null
  steps.value = []
  stepIndex.value = 0
  pause()
  generateAndUpdateSteps()
})

watch(baseList, () => {
  steps.value = []
  stepIndex.value = 0
  pause()
  generateAndUpdateSteps()
}, { deep: true })

watch([inputValue, inputPosition], () => {
  generateAndUpdateSteps()
})

onMounted(() => {
  generateAndUpdateSteps()
})
</script>

<style scoped>
.linkedlist-visualizer {
  background: radial-gradient(circle at top, #0f172a, #020617);
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #cbd5f5;
}

/* TOP SECTION - BACK BUTTON */
.top-section {
  margin-bottom: 8px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #cbd5f5;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
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

/* SECTION LABEL */
.section-label {
  color: #cbd5f5;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 10px;
}

/* TYPE SELECTOR SECTION */
.type-selector-section {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.type-btn {
  padding: 10px 18px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #a78bfa;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.type-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.4);
}

.type-btn.active {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

/* OPERATION SELECTOR SECTION */
.operation-selector-section {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.operation-dropdown {
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #cbd5f5;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.operation-dropdown:hover,
.operation-dropdown:focus {
  border-color: rgba(99, 102, 241, 0.5);
  background: rgba(2, 6, 23, 0.8);
  outline: none;
}

/* OPERATION DETAILS */
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

/* CONTROLS SECTION - Now part of operation-details */
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

.list-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #cbd5f5;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.list-input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(2, 6, 23, 0.8);
}

/* PARAMETER INPUTS */
.param-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.param-input-group label {
  color: #cbd5f5;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
}

.param-input-group.multi-param {
  display: flex;
  gap: 12px;
}

.multi-param>div {
  display: flex;
  align-items: center;
  gap: 6px;
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
  min-width: 150px;
}

.param-input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(2, 6, 23, 0.8);
}

.controls-row {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

/* PLAYBACK CONTROLS - Now part of operation-details */
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

/* CANVAS SECTION */
.canvas-section {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.section-header h3 {
  color: #e2e8f0;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-badge {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a78bfa;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.canvas-wrapper {
  flex: 1;
  min-height: 280px;
  background: rgba(2, 6, 23, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
  overflow-y: hidden;
}

/* PSEUDOCODE SECTION */
.pseudocode-section {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pseudocode-section .section-header h3 {
  font-size: 0.85rem;
}

/* EXPLANATION SECTION */
.explanation-section {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.explanation-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.explanation-content p {
  color: #cbd5f5;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.status-info {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.status-item span {
  color: #94a3b8;
}

.status-item strong {
  color: #a78bfa;
  font-weight: 600;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .type-buttons {
    gap: 8px;
  }

  .controls-row {
    gap: 8px;
  }

  .list-input,
  .param-input {
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .linkedlist-visualizer {
    padding: 16px;
    gap: 16px;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .type-selector-section,
  .operation-selector-section {
    padding: 12px 16px;
  }

  .type-buttons {
    flex-direction: column;
    width: 100%;
  }

  .type-btn {
    flex: 1;
    width: 100%;
  }

  .operation-dropdown {
    width: 100%;
  }

  .controls-row {
    flex-direction: column;
  }

  .controls-row>* {
    width: 100%;
  }

  .list-input {
    min-width: unset;
  }

  .param-input-group.multi-param {
    flex-direction: column;
  }

  .control-btn {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }

  .step-counter {
    margin-left: 0;
    margin-top: 8px;
    display: block;
  }
}

@media (max-width: 480px) {
  .linkedlist-visualizer {
    padding: 12px;
    gap: 12px;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .btn,
  .list-input,
  .param-input {
    font-size: 0.8rem;
    padding: 8px 10px;
  }

  .control-btn {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

.operation-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
