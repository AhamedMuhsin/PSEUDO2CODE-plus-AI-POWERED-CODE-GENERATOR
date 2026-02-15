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
            <h1>{{ currentProblem.label || 'AI & Search Problems' }}</h1>
            <button v-if="currentProblem.info" class="info-btn-compact" @click="showInfo = true"><Info :size="16" /></button>
          </div>
          <AIProblemSelector v-model="selectedProblem" class="selector-inline" />
        </div>
        <p class="operation-desc-compact">{{ currentProblem.description || 'Explore AI problems step by step' }}</p>
        <div v-if="currentProblem.info" class="algo-badges-compact">
          <span class="badge-compact">Time: {{ currentProblem.info.time }}</span>
          <span class="badge-compact">Space: {{ currentProblem.info.space }}</span>
        </div>
      </header>

      <div class="two-column-layout">
        <div class="left-column">
          <section class="input-section-compact">
            <div class="input-row-compact">
              <template v-if="selectedProblem === 'nQueens'">
                <label class="label-compact">N:</label>
                <input v-model.number="params.n" type="number" min="4" max="8" placeholder="4-8" class="custom-input-compact small" />
              </template>
              <template v-if="selectedProblem === 'towerOfHanoi'">
                <label class="label-compact">Disks:</label>
                <input v-model.number="params.disks" type="number" min="2" max="6" placeholder="2-6" class="custom-input-compact small" />
              </template>
              <template v-if="selectedProblem === 'waterJug'">
                <label class="label-compact">J1:</label>
                <input v-model.number="params.jug1" type="number" min="1" max="10" placeholder="4" class="custom-input-compact small" />
                <label class="label-compact">J2:</label>
                <input v-model.number="params.jug2" type="number" min="1" max="10" placeholder="3" class="custom-input-compact small" />
                <label class="label-compact">Target:</label>
                <input v-model.number="params.target" type="number" min="1" max="10" placeholder="2" class="custom-input-compact small" />
              </template>
              <template v-if="selectedProblem === 'vacuumCleaner'">
                <label class="label-compact">Grid:</label>
                <input v-model.number="params.gridSize" type="number" min="2" max="5" placeholder="2" class="custom-input-compact small" />
              </template>
              <button class="btn-compact primary" @click="executeVisualization">Run</button>
              <button class="btn-compact ghost" @click="generateCode">Code</button>
            </div>
          </section>

          <section class="controls-compact">
            <button class="btn-compact ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
            <button class="btn-compact primary" @click="togglePlay" :disabled="steps.length === 0">{{ playing ? 'Pause' : 'Play' }}</button>
            <button class="btn-compact ghost" @click="next" :disabled="stepIndex === steps.length - 1 || steps.length === 0">Next</button>
            <button class="btn-compact danger" @click="reset">Reset</button>
            <div class="step-counter-compact" v-if="steps.length > 0">{{ stepIndex + 1 }}/{{ steps.length }}</div>
          </section>

          <section class="canvas-compact">
            <NQueensCanvas v-if="selectedProblem === 'nQueens'" :board="currentStep.board" :queens="currentStep.queens" :attemptRow="currentStep.attemptRow" :attemptCol="currentStep.attemptCol" :status="currentStep.status" />
            <TowerOfHanoiCanvas v-else-if="selectedProblem === 'towerOfHanoi'" :towers="currentStep.towers" :moveFrom="currentStep.moveFrom" :moveTo="currentStep.moveTo" :disk="currentStep.disk" />
            <WaterJugCanvas v-else-if="selectedProblem === 'waterJug'" :jug1="currentStep.jug1" :jug2="currentStep.jug2" :jug1Capacity="currentStep.jug1Capacity" :jug2Capacity="currentStep.jug2Capacity" :target="currentStep.target" />
            <MinMaxCanvas v-else-if="selectedProblem === 'minimax'" :board="currentStep.board" :player="currentStep.player" :bestMove="currentStep.bestMove" />
            <MissionariesCannibalsCanvas v-else-if="selectedProblem === 'missionariesCannibals'" :missionariesLeft="currentStep.missionariesLeft" :cannibalsLeft="currentStep.cannibalsLeft" :missionariesRight="currentStep.missionariesRight" :cannibalsRight="currentStep.cannibalsRight" :boatSide="currentStep.boatSide" />
            <NumberPuzzleCanvas v-else-if="selectedProblem === 'numberPuzzle'" :board="currentStep.board" :goal="currentStep.goal" :cost="currentStep.cost" :heuristic="currentStep.heuristic" />
            <VacuumCleanerCanvas v-else-if="selectedProblem === 'vacuumCleaner'" :grid="currentStep.grid" :agentPos="currentStep.agentPos" :action="currentStep.action" />
            <AlphaBetaCanvas v-else-if="selectedProblem === 'alphaBeta'" :board="currentStep.board" :alpha="currentStep.alpha" :beta="currentStep.beta" :player="currentStep.player" :pruned="currentStep.pruned" />
            <HillClimbingCanvas v-else-if="selectedProblem === 'hillClimbing'" :currentState="currentStep.currentState" :currentValue="currentStep.currentValue" :neighbors="currentStep.neighbors" :stateHistory="currentStep.stateHistory" />
            <SimulatedAnnealingCanvas v-else-if="selectedProblem === 'simulatedAnnealing'" :currentState="currentStep.currentState" :currentEnergy="currentStep.currentEnergy" :temperature="currentStep.temperature" :history="currentStep.history" :accepted="currentStep.accepted" />
            <MapColoringCanvas v-else-if="selectedProblem === 'mapColoring'" :assignments="currentStep.assignments" :adjacency="currentStep.adjacency" :currentRegion="currentStep.currentRegion" :conflicts="currentStep.conflicts" />
            <GeneticAlgorithmCanvas v-else-if="selectedProblem === 'geneticAlgorithm'" :population="currentStep.population" :generation="currentStep.generation" :bestFitness="currentStep.bestFitness" :avgFitness="currentStep.avgFitness" />
          </section>
        </div>

        <div class="right-column">
          <section class="pseudo-section-compact">
            <h3 class="section-title-compact">Pseudocode</h3>
            <div class="pseudo-scroll">
              <PseudoCodePanel v-if="currentProblem.pseudocode" :code="currentProblem.pseudocode" :activeLine="currentStep.activePseudoLine" />
            </div>
          </section>

          <section class="explanation-compact">
            <h3>Explanation</h3>
            <p>{{ currentStep.explanation }}</p>
            <div v-if="currentStep.path && currentStep.path.length > 0" class="data-row-compact">
              <strong>Path:</strong> {{ currentStep.path.join(' → ') }}
            </div>
            <div v-if="currentStep.moveCount !== undefined" class="data-row-compact">
              <strong>Moves:</strong> {{ currentStep.moveCount }}
            </div>
          </section>
        </div>
      </div>
    </div>
    <AlgorithmInfoModal v-if="showInfo && currentProblem.info" :info="currentProblem.info" @close="showInfo = false" />
  </main>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import arrowLeft from "@/assets/arrow-left.svg"
import AIProblemSelector from "./AIProblemSelector.vue"
import PseudoCodePanel from "./PseudoCodePanel.vue"
import AlgorithmInfoModal from "./AlgorithmInfoModal.vue"
import { Info, Check, X } from 'lucide-vue-next'
import NQueensCanvas from "./canvases/NQueensCanvas.vue"
import TowerOfHanoiCanvas from "./canvases/TowerOfHanoiCanvas.vue"
import WaterJugCanvas from "./canvases/WaterJugCanvas.vue"
import MinMaxCanvas from "./canvases/MinMaxCanvas.vue"
import MissionariesCannibalsCanvas from "./canvases/MissionariesCannibalsCanvas.vue"
import NumberPuzzleCanvas from "./canvases/NumberPuzzleCanvas.vue"
import VacuumCleanerCanvas from "./canvases/VacuumCleanerCanvas.vue"
import AlphaBetaCanvas from "./canvases/AlphaBetaCanvas.vue"
import HillClimbingCanvas from "./canvases/HillClimbingCanvas.vue"
import SimulatedAnnealingCanvas from "./canvases/SimulatedAnnealingCanvas.vue"
import MapColoringCanvas from "./canvases/MapColoringCanvas.vue"
import GeneticAlgorithmCanvas from "./canvases/GeneticAlgorithmCanvas.vue"
import { aiProblems } from "@/algorithms/aiProblems/aiProblemsMap"

const props = defineProps({
  initialProblem: {
    type: String,
    default: 'nQueens'
  }
})

const router = useRouter()
const selectedProblem = ref(props.initialProblem)
const stepIndex = ref(0)
const playing = ref(false)
const showInfo = ref(false)
const steps = ref([])
const params = ref({
  n: 4,
  disks: 3,
  jug1: 4,
  jug2: 3,
  target: 2,
  gridSize: 2
})

const currentProblem = computed(() => aiProblems[selectedProblem.value])

const currentStep = computed(() =>
  steps.value[stepIndex.value] || {
    board: [],
    queens: [],
    towers: {},
    explanation: "Click 'Run Visualization' to start",
    activePseudoLine: 0,
    status: 'idle'
  }
)

let timer = null

watch(selectedProblem, () => {
  reset()
})

const executeVisualization = () => {
  const problem = aiProblems[selectedProblem.value]
  if (problem?.generateSteps) {
    if (selectedProblem.value === 'nQueens') {
      steps.value = problem.generateSteps(params.value.n)
    } else if (selectedProblem.value === 'towerOfHanoi') {
      steps.value = problem.generateSteps(params.value.disks)
    } else if (selectedProblem.value === 'waterJug') {
      steps.value = problem.generateSteps(params.value.jug1, params.value.jug2, params.value.target)
    } else if (selectedProblem.value === 'vacuumCleaner') {
      steps.value = problem.generateSteps(params.value.gridSize)
    } else {
      steps.value = problem.generateSteps()
    }
    stepIndex.value = 0
  }
}

const togglePlay = () => {
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
    }, 1000)
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
  steps.value = []
}

const generateCode = () => {
  const prompt = `Generate code to solve ${currentProblem.value.algorithmName} problem. Include implementation details and example usage.`
  router.push({
    name: "GenerateCode",
    query: { prompt }
  })
}
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
  grid-template-columns: 1.2fr 1fr;
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
.label-compact { color: #94a3b8; font-size: .74rem; font-weight: 500; }
.custom-input-compact {
  padding: 5px 10px;
  border-radius: 8px;
  background: rgba(2,6,23,.55);
  border: 1px solid rgba(99,102,241,.25);
  color: #fff;
  font-size: .78rem;
  flex: 1;
  min-width: 60px;
  transition: border-color .2s;
}
.custom-input-compact.small { max-width: 65px; min-width: 45px; }
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
  max-height: 100px;
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
.data-row-compact {
  font-size: .72rem;
  color: #a78bfa;
  margin-top: 3px;
  padding: 2px 6px;
  background: rgba(99,102,241,.08);
  border-radius: 4px;
}
.data-row-compact strong { color: #cbd5f5; }
@media (max-width: 900px) {
  .two-column-layout { grid-template-columns: 1fr; }
  .visualizer-page { height: auto; overflow: auto; }
}
</style>
