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
        <div class="header-content">
          <div class="header-top-row">
            <div class="operation-title-group-compact">
              <h1>{{ currentOperation.label || 'Queue Operations' }}</h1>
              <button v-if="currentOperation.info" class="info-btn-compact" @click="showInfo = true"><Info :size="16" /></button>
            </div>
            <QueueOperationSelector v-model="selectedOp" :operations="queueOperations" class="selector-inline" />
          </div>
          <p class="operation-desc-compact">{{ currentOperation.description || 'FIFO data structure operations' }}</p>
          <div v-if="currentOperation.info" class="algo-badges-compact">
            <span class="badge-compact">Time: {{ currentOperation.info.time }}</span>
            <span class="badge-compact">Space: {{ currentOperation.info.space }}</span>
          </div>
        </div>
      </header>

      <!-- TWO COLUMN LAYOUT -->
      <div class="two-column-layout">
        <!-- LEFT COLUMN -->
        <div class="left-column">
          <!-- INPUT -->
          <section class="input-section-compact">
            <div class="input-row-compact">
              <button class="btn-compact ghost" @click="generateRandom">Random</button>
              <input v-model="customInput" placeholder="5,2,8,1" @keydown.enter="applyCustomQueue" class="custom-input-compact" />
              <input v-if="operationType === 'value'" v-model.number="operationParams.value" type="number" placeholder="Enqueue val" class="custom-input-compact" @keydown.enter="applyEnqueue" />
              <button class="btn-compact ghost" @click="goToGenerateCode">Code</button>
            </div>
          </section>

          <!-- CONTROLS -->
          <section class="controls-compact">
            <button class="btn-compact ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
            <button class="btn-compact primary" @click="play" :disabled="!isPlayable">{{ playing ? 'Pause' : 'Play' }}</button>
            <button class="btn-compact ghost" @click="next" :disabled="stepIndex === steps.length - 1">Next</button>
            <button class="btn-compact danger" @click="reset">Reset</button>
            <div class="step-counter-compact">{{ stepIndex + 1 }}/{{ steps.length }}</div>
          </section>

          <!-- CANVAS -->
          <section class="canvas-compact">
            <QueueOperationCanvas :queue="currentStep.queue" :highlight="currentStep.highlight" :frontIndex="currentStep.frontIndex" />
          </section>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="right-column">
          <section class="pseudo-section-compact">
            <h3 class="section-title-compact">Pseudocode</h3>
            <div class="pseudo-scroll">
              <PseudoCodePanel v-if="currentOperation.pseudocode" :code="currentOperation.pseudocode" :activeLine="currentStep.activeLine" />
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
import { ref, computed, watch, onMounted } from "vue"
import arrowLeft from "@/assets/arrow-left.svg"
import QueueOperationCanvas from "./canvases/QueueOperationCanvas.vue"
import { useRouter } from "vue-router"
import PseudoCodePanel from "@/components/visualizer/PseudoCodePanel.vue"
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"
import QueueOperationSelector from "@/components/visualizer/QueueOperationSelector.vue"
import { queueOperations } from "@/algorithms/queueOperations/queueOperationsMap"
import { Info, Check, X } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  description: String,
  generateSteps: Function,
  pseudocode: Array,
  algorithmName: String,
  info: Object
})

const selectedOp = ref("enqueue")

const operationMode = computed(() => {
  const t = props.title?.toLowerCase() || ""
  if (t.includes("enqueue")) return "enqueue"
  return null
})

const operationParams = ref({
  value: null
})

const operationType = computed(() => {
  if (selectedOp.value === "enqueue") return "value"
  return null
})

const router = useRouter()
const baseQueue = ref([7, 3, 9, 5, 1])
const customInput = ref("")
const stepIndex = ref(0)
const playing = ref(false)
const showInfo = ref(false)

const currentOperation = computed(() =>
  queueOperations[selectedOp.value]
)

const steps = ref([])

const initializeSteps = () => {
  const op = queueOperations[selectedOp.value]
  if (op?.generateSteps) {
    steps.value = op.generateSteps(baseQueue.value, operationParams.value)
    stepIndex.value = 0
  }
}

// Initialize steps on mount
onMounted(() => {
  initializeSteps()
})

const currentStep = computed(() =>
  steps.value[stepIndex.value] || {
    queue: [],
    highlight: [],
    frontIndex: 0,
    activeLine: 0,
    explanation: ""
  }
)

const isPlayable = computed(() => {
  if (operationType.value === "value") {
    return operationParams.value.value !== null && operationParams.value.value !== ""
  }
  return true
})

let timer = null

watch(selectedOp, () => {
  operationParams.value.value = null
  initializeSteps()
})

watch(
  () => operationParams.value.value,
  () => {
    if (operationType.value === "value") {
      initializeSteps()
    }
  }
)

watch(baseQueue, () => {
  initializeSteps()
}, { deep: true })

function play() {
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

function applyEnqueue() {
  if (operationParams.value.value !== null && operationParams.value.value !== "") {
    initializeSteps()
    play()
  }
}

function next() {
  if (stepIndex.value < steps.value.length - 1) {
    stepIndex.value++
  }
}

function prev() {
  if (stepIndex.value > 0) {
    stepIndex.value--
  }
}

function reset() {
  playing.value = false
  clearInterval(timer)
  stepIndex.value = 0
}

function generateRandom() {
  const randomQueue = Array.from({ length: Math.floor(Math.random() * 4) + 2 }, () =>
    Math.floor(Math.random() * 100)
  )
  baseQueue.value = randomQueue
  const op = queueOperations[selectedOp.value]
  if (op?.generateSteps) {
    steps.value = op.generateSteps(baseQueue.value, operationParams.value)
  }
  reset()
}

function applyCustomQueue() {
  try {
    const values = customInput.value
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v))

    if (values.length > 0) {
      baseQueue.value = values
      customInput.value = ""
      const op = queueOperations[selectedOp.value]
      if (op?.generateSteps) {
        steps.value = op.generateSteps(baseQueue.value, operationParams.value)
      }
      reset()
    }
  } catch (e) {
    console.error("Invalid input", e)
  }
}

function goToGenerateCode() {
  const prompt = `Generate code to perform ${currentOperation.value.algorithmName} operation on a queue data structure. Include implementation details and example usage.`
  router.push({
    name: "GenerateCode",
    query: { prompt }
  })
}
</script>

<style scoped>
/* ── PAGE SHELL ── */
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

/* ── BACK ── */
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

/* ── HEADER ── */
.page-header-compact { margin-bottom: 6px; }
.header-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.operation-title-group-compact {
  display: flex;
  align-items: center;
  gap: 8px;
}
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
.operation-desc-compact {
  color: #94a3b8;
  font-size: .78rem;
  margin: 2px 0 0;
  line-height: 1.3;
}
.algo-badges-compact {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}
.badge-compact {
  background: rgba(99,102,241,.12);
  border: 1px solid rgba(99,102,241,.25);
  color: #cbd5f5;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: .72rem;
  font-weight: 500;
}

/* ── TWO-COLUMN LAYOUT ── */
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

/* ── INPUT ── */
.input-section-compact { flex-shrink: 0; }
.input-row-compact {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}
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
.custom-input-compact:focus {
  outline: none;
  border-color: #6366f1;
}

/* ── CONTROLS ── */
.controls-compact {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.step-counter-compact {
  margin-left: auto;
  color: #94a3b8;
  font-size: .75rem;
  font-weight: 500;
}

/* ── BUTTONS ── */
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
.btn-compact.ghost {
  background: rgba(99,102,241,.12);
  border: 1px solid rgba(99,102,241,.25);
  color: #a78bfa;
}
.btn-compact.ghost:hover { background: rgba(99,102,241,.22); }
.btn-compact.primary {
  background: #6366f1;
  color: #fff;
}
.btn-compact.primary:hover:not(:disabled) {
  background: #4f46e5;
  box-shadow: 0 3px 10px rgba(99,102,241,.35);
}
.btn-compact.danger {
  background: rgba(239,68,68,.12);
  border: 1px solid rgba(239,68,68,.25);
  color: #fca5a5;
}
.btn-compact.danger:hover:not(:disabled) { background: rgba(239,68,68,.22); }
.btn-compact:disabled { opacity: .4; cursor: not-allowed; }

/* ── CANVAS ── */
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

/* ── PSEUDO ── */
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
.pseudo-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
.pseudo-scroll::-webkit-scrollbar { width: 4px; }
.pseudo-scroll::-webkit-scrollbar-track { background: transparent; }
.pseudo-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,.25); border-radius: 4px; }

/* ── EXPLANATION ── */
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
.explanation-compact h3 {
  color: #cbd5f5;
  font-size: .75rem;
  font-weight: 600;
  margin: 0 0 3px;
  text-transform: uppercase;
  letter-spacing: .5px;
}
.explanation-compact p {
  color: #94a3b8;
  font-size: .78rem;
  line-height: 1.45;
  margin: 0;
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .two-column-layout { grid-template-columns: 1fr; }
  .visualizer-page { height: auto; overflow: auto; }
}
</style>
