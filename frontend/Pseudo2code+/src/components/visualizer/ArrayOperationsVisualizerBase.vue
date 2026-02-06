<template>
  <div class="array-op-visualizer">
    <div class="back" @click="router.push('/algorithm-hub')">
      <img :src="arrowLeft" class="arrow" />
      Back
    </div>
    <!-- HEADER -->
    <header class="header">
      <div class="header-top">
        <h1>{{ title }}</h1>
        <button v-if="info" class="info-btn" @click="showInfo = true">ⓘ</button>
      </div>
      <p>{{ description }}</p>
      <div v-if="info" class="algo-badges">
        <span class="badge">Time: {{ info.time }}</span>
        <span class="badge">Space: {{ info.space }}</span>
        <span class="badge" :class="info.stable ? 'stable' : 'unstable'">
          {{ info.stable ? 'Stable' : 'Unstable' }}
        </span>
      </div>
    </header>

    <!-- ARRAY INPUT -->
    <section class="array-input">
      <button class="btn random-btn" @click="generateRandom">
        Random Array
      </button>

      <input v-model="customInput" placeholder="Custom array (Press Enter): 5,2,8,1"
        @keydown.enter="applyCustomArray" />
      
      <button class="btn ghost" @click="goToGenerateCode">
        Generate Code
      </button>
    </section>

    <OperationControls :type="operationType" :mode="operationMode" v-model="operationParams" />

    <!-- CONTROLS -->
    <section class="controls">
      <button @click="prev" :disabled="stepIndex === 0">Prev</button>
      <button @click="play" :disabled="!isPlayable">
        {{ playing ? "Pause" : "Play" }}
      </button>

      <button @click="next" :disabled="stepIndex === steps.length - 1">
        Next
      </button>
      <button class="danger" @click="reset">Reset</button>

      <span class="step">
        Step {{ stepIndex + 1 }} / {{ steps.length }}
      </span>
    </section>

    <!-- CANVAS -->
    <section class="canvas">
      <ArrayOperationCanvas :array="currentStep.array" :activeIndex="currentStep.activeIndex"
        :foundIndex="currentStep.foundIndex" :removedIndex="currentStep.removedIndex"
        :insertedIndex="currentStep.insertedIndex" />

    </section>

    <section class="pseudo-code">
      <PseudoCodePanel v-if="pseudocode" :code="pseudocode" :activeLine="currentStep.activeLine" />
    </section>
    <!-- EXPLANATION -->
    <section class="explanation">
      <h3>Step Explanation</h3>
      <p>{{ currentStep.explanation }}</p>
    </section>

    <!-- INFO MODAL -->
    <AlgorithmInfoModal v-if="showInfo && info" :info="info" @close="showInfo = false" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import OperationControls from "@/components/visualizer/OperationControls.vue"
import arrowLeft from "@/assets/arrow-left.svg";
import ArrayOperationCanvas from "./canvases/ArrayOperationCanvas.vue"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"
import PseudoCodePanel from "@/components/visualizer/PseudoCodePanel.vue"
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"

const props = defineProps({
  title: String,
  description: String,
  generateSteps: Function,
  pseudocode: Array,
  algorithmName: String,
  info: Object
})


const operationMode = computed(() => {
  const t = props.title.toLowerCase()

  if (t.includes("insert at end")) return "insertEnd"
  if (t.includes("insert at index")) return "insertIndex"
  if (t.includes("delete at end")) return "deleteEnd"
  if (t.includes("delete at index")) return "deleteIndex"

  return null
})

const operationParams = ref({
  target: null,
  index: null,
  value: null
})

const operationType = computed(() => {
  if (props.title.includes("Search")) return "search"
  if (props.title.includes("Insert")) return "insert"
  if (props.title.includes("Delete")) return "delete"
  if (props.title.includes("Update")) return "update"
  return null
})

const router = useRouter()
const route = useRoute()
const baseArray = ref([5, 2, 8, 1, 9, 3])
const customInput = ref("")
const steps = ref(
  props.generateSteps(baseArray.value, operationParams.value)
)
const stepIndex = ref(0)
const playing = ref(false)
const showInfo = ref(false)
const currentStep = computed(() =>
  steps.value[stepIndex.value] || {
    array: [],
    activeIndex: null,
    foundIndex: null,
    removedIndex: null,
    insertedIndex: null,
    activeLine: 0,
    explanation: ""
  }
)

let timer = null

watch(
  () => ({ ...operationParams.value }),
  () => {
    reset()
  },
  { deep: true }
)

watch(baseArray, () => reset())
const isPlayable = computed(() => {
  if (operationType.value === "search")
    return operationParams.value.target !== null

  if (operationType.value === "insert")
    return operationParams.value.value !== null &&
      operationParams.value.index !== null

  if (operationType.value === "update")
    return operationParams.value.value !== null &&
      operationParams.value.index !== null

  if (operationType.value === "delete")
    return operationParams.value.index !== null

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
  steps.value = props.generateSteps(baseArray.value, operationParams.value)
  stepIndex.value = 0
}

function generateRandom() {
  baseArray.value = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 20) + 1
  )
  reset()
}

function applyCustomArray() {
  const arr = customInput.value
    .split(",")
    .map(n => Number(n.trim()))
    .filter(n => !isNaN(n))

  if (arr.length < 2) return

  baseArray.value = arr
  reset()
}

function goToGenerateCode() {
  const prompt = `Write a program for the ${props.algorithmName || props.title} operation. 
Take a random input array and demonstrate the operation.`

  router.push({
    path: '/generate-code',
    query: { prompt }
  })
}
</script>

<style scoped>
.array-op-visualizer {
  margin-top: 40px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.back {
  position: absolute;
  top: 92px;
  left: 32px;
  display: flex;
  gap: 8px;
  cursor: pointer;
  opacity: 0.8;
}

.arrow {
  width: 18px;
}

.header {
  margin-bottom: 24px;
}

.header p {
  color: #94a3b8;
}

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

.controls button {
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  background: #6366f1;
  color: white;
  cursor: pointer;
}

.controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.controls .danger {
  background: #ef4444;
}

.pseudo-code {
  margin-bottom: 24px;
  background: rgba(15, 23, 42, 0.85);
  padding: 20px;
  border-radius: 16px;
}

.step {
  margin-left: auto;
  color: #cbd5f5;
}

.canvas {
  background: rgba(15, 23, 42, 0.85);
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.explanation {
  background: rgba(15, 23, 42, 0.85);
  padding: 20px;
  border-radius: 16px;
}

.explanation p {
  color: #94a3b8;
}

.array-input {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
}

.array-input input {
  flex: 1;
  max-width: 420px;
  padding: 9px 14px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 0.9rem;
}

.random-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.btn.ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

.random-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.45);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-top h1 {
  margin: 0;
  font-size: 2rem;
  background: linear-gradient(135deg, #a78bfa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-btn {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a78bfa;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.info-btn:hover {
  background: rgba(99, 102, 241, 0.35);
  border-color: rgba(167, 139, 250, 0.6);
  transform: scale(1.05);
}

.algo-badges {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
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
</style>
