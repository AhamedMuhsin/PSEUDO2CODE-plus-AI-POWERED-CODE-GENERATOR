<template>
  <main class="visualizer-page">
    <div class="container-compact">
      <header class="page-header-compact">
        <div class="header-top-row">
          <div class="operation-title-group-compact">
            <h1>{{ title }}</h1>
            <button v-if="info" class="info-btn-compact" @click="showInfo = true"><Info :size="16" /></button>
          </div>
        </div>
        <p class="operation-desc-compact">{{ description }}</p>
        <div v-if="info" class="algo-badges-compact">
          <span class="badge-compact">Time: {{ info.time }}</span>
          <span class="badge-compact">Space: {{ info.space }}</span>
        </div>
      </header>

      <div class="two-column-layout">
        <div class="left-column">
          <section class="input-section-compact">
            <div class="input-row-compact">
              <button class="btn-compact ghost" @click="generateRandom">Random</button>
              <input v-model="customInput" placeholder="5,2,8,1" @keydown.enter="applyCustomArray" class="custom-input-compact" />
              <button class="btn-compact ghost" @click="goToGenerateCode">Code</button>
            </div>
            <OperationControls :type="operationType" :mode="operationMode" v-model="operationParams" />
          </section>

          <section class="controls-compact">
            <button class="btn-compact ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
            <button class="btn-compact primary" @click="play" :disabled="!isPlayable">{{ playing ? 'Pause' : 'Play' }}</button>
            <button class="btn-compact ghost" @click="next" :disabled="stepIndex === steps.length - 1">Next</button>
            <button class="btn-compact danger" @click="reset">Reset</button>
            <div class="step-counter-compact">{{ stepIndex + 1 }}/{{ steps.length }}</div>
          </section>

          <section class="canvas-compact">
            <ArrayOperationCanvas :array="currentStep.array" :activeIndex="currentStep.activeIndex"
              :foundIndex="currentStep.foundIndex" :removedIndex="currentStep.removedIndex"
              :insertedIndex="currentStep.insertedIndex" />
          </section>
        </div>

        <div class="right-column">
          <section class="pseudo-section-compact">
            <h3 class="section-title-compact">Pseudocode</h3>
            <div class="pseudo-scroll">
              <PseudoCodePanel v-if="pseudocode" :code="pseudocode" :activeLine="currentStep.activeLine" />
            </div>
          </section>

          <section class="explanation-compact">
            <h3>Explanation</h3>
            <p>{{ currentStep.explanation }}</p>
          </section>
        </div>
      </div>
    </div>
    <AlgorithmInfoModal v-if="showInfo && info" :info="info" @close="showInfo = false" />
  </main>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import OperationControls from "@/components/visualizer/OperationControls.vue"
import ArrayOperationCanvas from "./canvases/ArrayOperationCanvas.vue"
import { useRoute } from "vue-router"
import { useRouter } from "vue-router"
import PseudoCodePanel from "@/components/visualizer/PseudoCodePanel.vue"
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"
import { Info, Check, X } from 'lucide-vue-next'

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
.input-row-compact { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-bottom: 4px; }
.custom-input-compact {
  padding: 5px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0,.55);
  border: 1px solid var(--accent-border);
  color: var(--text-primary);
  font-size: .78rem;
  flex: 1;
  min-width: 80px;
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
  max-height: 90px;
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
.explanation-compact p { color: var(--text-muted); font-size: .78rem; line-height: 1.45; margin: 0; }
@media (max-width: 900px) {
  .two-column-layout { grid-template-columns: 1fr; }
  .visualizer-page { height: auto; overflow: auto; }
}
</style>
