<template>
  <div class="stack-op-visualizer-compact">
    <!-- BACK BUTTON & HEADER -->
    <div class="top-section-compact">
      <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
        <img :src="arrowLeft" class="arrow" />
        Back
      </button>
    </div>

    <!-- COMPACT HEADER WITH OPERATION SELECTOR -->
    <div class="header-compact">
      <div class="header-left">
        <h1 class="title-compact">Stack Operations</h1>
        <p class="desc-compact">LIFO data structure operations</p>
      </div>
      <StackOperationSelector
        v-model="selectedOp"
        :operations="stackOperations"
        class="operation-selector-compact"
      />
    </div>

    <!-- OPERATION DETAILS BAR -->
    <section class="operation-bar-compact">
      <div class="operation-info">
        <h2 class="operation-name">{{ currentOperation.label }}</h2>
        <button v-if="currentOperation.info" class="info-btn-compact" @click="showInfo = true"><Info :size="16" /></button>
      </div>
      <div v-if="currentOperation.info" class="complexity-badges-compact">
        <span class="badge-tiny">{{ currentOperation.info.time }}</span>
        <span class="badge-tiny">{{ currentOperation.info.space }}</span>
      </div>
    </section>

    <!-- CONTROLS COMPACT -->
    <section class="controls-bar-compact">
      <div class="input-group-compact">
        <button class="btn-tiny ghost" @click="generateRandom">Random</button>
        <input 
          v-model="customInput" 
          placeholder="5,2,8,1"
          @keydown.enter="applyCustomStack" 
          class="input-tiny" 
        />
        <input 
          v-if="operationType === 'value'"
          v-model.number="pushValue" 
          type="number" 
          placeholder="Push value"
          class="input-tiny"
          @keydown.enter="applyPushValue"
        />
        <button class="btn-tiny ghost" @click="goToGenerateCode">Code</button>
      </div>
      
      <div class="playback-compact">
        <button @click="prev" :disabled="stepIndex === 0" class="btn-tiny">◄</button>
        <button @click="play" :disabled="!isPlayable" class="btn-tiny primary">
          {{ playing ? '⏸' : '▶' }}
        </button>
        <button @click="next" :disabled="stepIndex === steps.length - 1" class="btn-tiny">►</button>
        <button class="btn-tiny danger" @click="reset">↻</button>
        <span class="step-display-compact">{{ stepIndex + 1 }}/{{ steps.length }}</span>
      </div>
    </section>

    <!-- MAIN TWO-COLUMN AREA -->
    <div class="main-grid-compact">
      <!-- LEFT: CANVAS -->
      <div class="canvas-area-compact">
        <div class="canvas-header-compact">
          <h3>Visualization</h3>
          <span class="stack-size">{{ currentStep.stack.length }}/{{ stackCapacity }}</span>
        </div>
        <StackOperationCanvas 
          :stack="currentStep.stack" 
          :highlight="currentStep.highlight"
          :topIndex="currentStep.topIndex" 
        />
      </div>

      <!-- RIGHT: PSEUDO & EXPLANATION -->
      <div class="info-area-compact">
        <div class="pseudo-compact">
          <h3 class="section-title-mini">Pseudocode</h3>
          <div class="pseudo-scroll-mini">
            <PseudoCodePanel 
              v-if="currentOperation.pseudocode" 
              :code="currentOperation.pseudocode" 
              :activeLine="currentStep.activeLine" 
            />
          </div>
        </div>
        
        <div class="explanation-compact">
          <h3 class="section-title-mini">Explanation</h3>
          <p>{{ currentStep.explanation }}</p>
        </div>
      </div>
    </div>

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
import arrowLeft from "@/assets/arrow-left.svg";
import StackOperationCanvas from "./canvases/StackOperationCanvas.vue"
import { useRouter } from "vue-router"
import PseudoCodePanel from "@/components/visualizer/PseudoCodePanel.vue"
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"
import StackOperationSelector from "@/components/visualizer/StackOperationSelector.vue"
import { stackOperations } from "@/algorithms/stackOperations/stackOperationsMap"
import { Info } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  description: String,
  generateSteps: Function,
  pseudocode: Array,
  algorithmName: String,
  info: Object
})

const selectedOp = ref("push")

const operationMode = computed(() => {
  const t = props.title.toLowerCase()
  if (t.includes("push")) return "push"
  return null
})

const pushValue = ref(15)  // Value for push operation

const operationType = computed(() => {
  if (selectedOp.value === "push") return "value"
  return null
})

const router = useRouter()
// Initialize with a dummy stack of maximum size 5
const baseStack = ref([7, 3, 9, 5, 1])
const stackCapacity = ref(5)
const customInput = ref("")
const stepIndex = ref(0)
const playing = ref(false)
const showInfo = ref(false)

const currentOperation = computed(() =>
  stackOperations[selectedOp.value]
)

const generateAndUpdateSteps = () => {
  const op = stackOperations[selectedOp.value]
  if (op?.generator) {
    const params = selectedOp.value === "push" ? { value: pushValue.value } : {}
    steps.value = op.generator(baseStack.value, params)
  }
}

const steps = ref([])

const currentStep = computed(() =>
  steps.value[stepIndex.value] || {
    stack: baseStack.value,
    highlight: [],
    topIndex: baseStack.value.length - 1,
    activeLine: 0,
    explanation: "Ready to perform stack operation on the initial stack."
  }
)

onMounted(() => {
  // Generate initial steps for the selected operation
  generateAndUpdateSteps()
})

let timer = null

watch(selectedOp, () => {
  generateAndUpdateSteps()
  reset()
})

watch(pushValue, () => {
  if (selectedOp.value === "push") {
    generateAndUpdateSteps()
    reset()
  }
})

watch(
  baseStack,
  () => {
    generateAndUpdateSteps()
    reset()
  },
  { deep: true }
)

function applyPushValue() {
  if (pushValue.value !== null && pushValue.value !== "") {
    generateAndUpdateSteps()
    reset()
  }
}

watch(baseStack, () => reset())

const isPlayable = computed(() => {
  if (operationType.value === "value") {
    return pushValue.value !== null && pushValue.value !== ""
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
  const size = Math.floor(Math.random() * 5) + 2
  const arr = []
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 10) + 1)
  }
  baseStack.value = arr
}

function applyCustomStack() {
  if (!customInput.value) return
  try {
    const values = customInput.value
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v))
      .slice(0, stackCapacity.value)  // Limit to max capacity

    if (values.length > 0) {
      baseStack.value = values
      customInput.value = ""
    }
  } catch (e) {
    console.error("Invalid input", e)
  }
}

function goToGenerateCode() {
  const prompt = `Write a program for the  ${props.algorithmName || props.title} operation. 
Take a random input stack and demonstrate the operation.`

  router.push({
    path: '/generate-code',
    query: { prompt }
  })
}
</script>

<style scoped>
/* ULTRA COMPACT STACK VISUALIZER */
.stack-op-visualizer-compact {
  height: 100vh;
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}

.top-section-compact {
  flex-shrink: 0;
}

.back-btn-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #e0e7ff;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.back-btn-compact:hover {
  background: rgba(99, 102, 241, 0.25);
}

.arrow {
  width: 14px;
  height: 14px;
}

.header-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 10px;
  padding: 10px 14px;
  flex-shrink: 0;
}

.header-left {
  flex: 1;
}

.title-compact {
  font-size: 1.3rem;
  background: linear-gradient(135deg, #818cf8, #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 4px 0;
}

.desc-compact {
  color: #94a3b8;
  font-size: 0.75rem;
  margin: 0;
}

.operation-selector-compact {
  flex-shrink: 0;
}

.operation-bar-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  flex-shrink: 0;
}

.operation-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.operation-name {
  color: #e0e7ff;
  font-size: 1rem;
  margin: 0;
}

.info-btn-compact {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.complexity-badges-compact {
  display: flex;
  gap: 6px;
}

.badge-tiny {
  padding: 3px 8px;
  background: rgba(100, 116, 139, 0.2);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 4px;
  color: #cbd5e1;
  font-size: 0.7rem;
}

.controls-bar-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  gap: 12px;
  flex-shrink: 0;
}

.input-group-compact,
.playback-compact {
  display: flex;
  gap: 6px;
  align-items: center;
}

.btn-tiny {
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(100, 116, 139, 0.2);
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: #cbd5e1;
}

.btn-tiny:hover:not(:disabled) {
  background: rgba(100, 116, 139, 0.3);
}

.btn-tiny.primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.btn-tiny.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.btn-tiny:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-tiny {
  padding: 5px 8px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.4);
  color: #e0e7ff;
  border-radius: 5px;
  font-size: 0.75rem;
  min-width: 100px;
}

.input-tiny:focus {
  outline: none;
  border-color: #6366f1;
}

.input-tiny::placeholder {
  color: #64748b;
  font-size: 0.7rem;
}

.step-display-compact {
  padding: 4px 8px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 4px;
  color: #e0e7ff;
  font-size: 0.7rem;
  font-weight: 600;
}

.main-grid-compact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.canvas-area-compact,
.info-area-compact {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.canvas-header-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.canvas-header-compact h3 {
  color: #e0e7ff;
  font-size: 0.9rem;
  margin: 0;
}

.stack-size {
  color: #94a3b8;
  font-size: 0.75rem;
  padding: 3px 8px;
  background: rgba(100, 116, 139, 0.2);
  border-radius: 4px;
}

.info-area-compact {
  gap: 8px;
}

.pseudo-compact {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.explanation-compact {
  flex-shrink: 0;
  padding: 10px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
}

.section-title-mini {
  color: #e0e7ff;
  font-size: 0.85rem;
  margin: 0 0 6px 0;
}

.pseudo-scroll-mini {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.explanation-compact p {
  color: #94a3b8;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
}

/* SCROLLBAR */
.pseudo-scroll-mini::-webkit-scrollbar,
.explanation-compact::-webkit-scrollbar {
  width: 4px;
}

.pseudo-scroll-mini::-webkit-scrollbar-track,
.explanation-compact::-webkit-scrollbar-track {
  background: transparent;
}

.pseudo-scroll-mini::-webkit-scrollbar-thumb,
.explanation-compact::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.25);
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 1200px) {
  .main-grid-compact {
    grid-template-columns: 1fr;
  }
  
  .stack-op-visualizer-compact {
    overflow-y: auto;
    height: auto;
    min-height: 100vh;
  }
}
</style>
