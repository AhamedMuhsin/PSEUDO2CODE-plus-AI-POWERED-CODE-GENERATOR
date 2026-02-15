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
            <h1>{{ currentOperation.label || 'LinkedList Visualizer' }}</h1>
            <button v-if="currentOperation.algorithmName" class="info-btn-compact" @click="showInfo = true"><Info :size="16" /></button>
          </div>
          <div class="type-and-op-row">
            <button v-for="type in linkedListTypes" :key="type.key" @click="selectListType(type.key)"
              :class="['type-btn-compact', { active: selectedListType === type.key }]">
              {{ type.label }}
            </button>
            <select v-model="selectedOp" class="op-dropdown-compact">
              <option v-for="(op, key) in currentOperations" :key="key" :value="key">{{ op.label }}</option>
            </select>
          </div>
        </div>
        <p class="operation-desc-compact">{{ currentOperation.description || 'Step-by-step linked list visualization' }}</p>
        <div v-if="currentOperation.algorithmName" class="algo-badges-compact">
          <span class="badge-compact">Best: {{ currentOperation.best }}</span>
          <span class="badge-compact">Avg: {{ currentOperation.average }}</span>
          <span class="badge-compact">Worst: {{ currentOperation.worst }}</span>
          <span class="badge-compact">Space: {{ currentOperation.space }}</span>
        </div>
      </header>

      <div class="two-column-layout">
        <div class="left-column">
          <section class="input-section-compact">
            <div class="input-row-compact">
              <button class="btn-compact ghost" @click="generateRandomList">Random</button>
              <input v-model="customListInput" placeholder="10,20,30" @keydown.enter="applyCustomList" class="custom-input-compact" />
              <template v-if="currentOperation.hasParams">
                <template v-if="currentOperation.paramType === 'value'">
                  <input v-model.number="inputValue" type="number" placeholder="Value" class="custom-input-compact small" />
                </template>
                <template v-else-if="currentOperation.paramType === 'position'">
                  <input v-model.number="inputPosition" type="number" min="0" :max="baseList.length" placeholder="Pos" class="custom-input-compact small" />
                </template>
                <template v-else-if="currentOperation.paramType === 'position-value'">
                  <input v-model.number="inputPosition" type="number" min="0" :max="baseList.length" placeholder="Pos" class="custom-input-compact small" />
                  <input v-model.number="inputValue" type="number" placeholder="Val" class="custom-input-compact small" />
                </template>
              </template>
              <button class="btn-compact ghost" @click="generateCode">Code</button>
            </div>
          </section>

          <section class="controls-compact">
            <button class="btn-compact ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
            <button class="btn-compact primary" @click="togglePlay" :disabled="steps.length === 0">{{ playing ? 'Pause' : 'Play' }}</button>
            <button class="btn-compact ghost" @click="next" :disabled="stepIndex === steps.length - 1 || steps.length === 0">Next</button>
            <button class="btn-compact danger" @click="reset">Reset</button>
            <div class="step-counter-compact">{{ stepIndex + 1 }}/{{ steps.length }}</div>
          </section>

          <section class="canvas-compact">
            <AdvancedLinkedListCanvas :list="currentStep.list" :listType="selectedListType"
              :activeNodeIndex="currentStep.activeNodeIndex" :targetIndex="currentStep.targetIndex"
              :highlightNodes="currentStep.highlightNodes || []" />
          </section>
        </div>

        <div class="right-column">
          <section class="pseudo-section-compact">
            <h3 class="section-title-compact">Pseudocode</h3>
            <div class="pseudo-scroll">
              <PseudoCodePanel v-if="currentOperation.pseudocode" :code="currentOperation.pseudocode"
                :activeLine="currentStep.activePseudoLine" />
            </div>
          </section>

          <section class="explanation-compact">
            <h3>Explanation</h3>
            <p>{{ currentStep.explanation }}</p>
            <div class="status-row-compact">
              <span>Nodes: <strong>{{ currentStep.list.length }}</strong></span>
              <span>Active: <strong>{{ currentStep.activeNodeIndex >= 0 ? currentStep.activeNodeIndex : '-' }}</strong></span>
              <span v-if="currentOperation.hasParams">Params: <strong>{{ formatParams() }}</strong></span>
            </div>
          </section>
        </div>
      </div>
    </div>
    <AlgorithmInfoModal v-if="showInfo && currentOperation.algorithmName" :info="currentOperation" @close="showInfo = false" />
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import arrowLeft from "@/assets/arrow-left.svg"
import { useRouter } from "vue-router"
import AdvancedLinkedListCanvas from "./canvases/AdvancedLinkedListCanvas.vue"
import PseudoCodePanel from "./PseudoCodePanel.vue"
import AlgorithmInfoModal from "./AlgorithmInfoModal.vue"
import { Info, Check, X } from 'lucide-vue-next'
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
.visualizer-page {
  background: radial-gradient(circle at top, #0f172a, #020617);
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
  gap: 10px;
  flex-wrap: wrap;
}
.operation-title-group-compact { display: flex; align-items: center; gap: 8px; }
.page-header-compact h1 {
  font-size: 1.1rem;
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
.type-and-op-row {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
}
.type-btn-compact {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: .72rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(99,102,241,.25);
  background: rgba(99,102,241,.08);
  color: #94a3b8;
  transition: all .2s;
}
.type-btn-compact.active {
  background: rgba(99,102,241,.25);
  border-color: #6366f1;
  color: #a78bfa;
}
.type-btn-compact:hover { background: rgba(99,102,241,.18); }
.op-dropdown-compact {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: .74rem;
  background: rgba(2,6,23,.55);
  border: 1px solid rgba(99,102,241,.25);
  color: #cbd5f5;
  cursor: pointer;
  max-width: 160px;
}
.operation-desc-compact { color: #94a3b8; font-size: .76rem; margin: 2px 0 0; line-height: 1.3; }
.algo-badges-compact { display: flex; gap: 5px; margin-top: 3px; flex-wrap: wrap; }
.badge-compact {
  background: rgba(99,102,241,.12);
  border: 1px solid rgba(99,102,241,.25);
  color: #cbd5f5;
  padding: 1px 7px;
  border-radius: 12px;
  font-size: .68rem;
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
.input-row-compact { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; }
.custom-input-compact {
  padding: 5px 10px;
  border-radius: 8px;
  background: rgba(2,6,23,.55);
  border: 1px solid rgba(99,102,241,.25);
  color: #fff;
  font-size: .78rem;
  flex: 1;
  min-width: 70px;
  transition: border-color .2s;
}
.custom-input-compact.small { max-width: 65px; min-width: 50px; }
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
  max-height: 110px;
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
.explanation-compact p { color: #94a3b8; font-size: .78rem; line-height: 1.45; margin: 0 0 4px; }
.status-row-compact {
  display: flex;
  gap: 12px;
  font-size: .72rem;
  color: #94a3b8;
  margin-top: 2px;
}
.status-row-compact strong { color: #a78bfa; }
@media (max-width: 900px) {
  .two-column-layout { grid-template-columns: 1fr; }
  .visualizer-page { height: auto; overflow: auto; }
}
</style>
