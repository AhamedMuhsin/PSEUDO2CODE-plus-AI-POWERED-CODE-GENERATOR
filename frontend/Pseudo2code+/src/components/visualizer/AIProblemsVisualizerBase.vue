<template>
  <div class="ai-problems-visualizer">
    <!-- BACK BUTTON & HEADER -->
    <div class="top-section">
      <button class="back-btn" @click="router.push('/algorithm-hub')">
        <img :src="arrowLeft" class="arrow" />
        Back
      </button>
    </div>

    <!-- PAGE HEADER -->
    <header class="page-header">
      <h1>AI & Search Problems</h1>
      <p>Explore classic AI problems and search algorithms step by step</p>
    </header>

    <!-- PROBLEM SELECTOR -->
    <section class="operation-selector-section">
      <AIProblemSelector v-model="selectedProblem" />
    </section>

    <!-- PROBLEM DETAILS -->
    <section class="operation-details">
      <!-- PROBLEM HEADER -->
      <div class="operation-header">
        <div class="operation-title-group">
          <h2>{{ currentProblem.label }}</h2>
          <button v-if="currentProblem.info" class="info-btn" @click="showInfo = true">ⓘ</button>
        </div>
        <p class="operation-desc">{{ currentProblem.description }}</p>
      </div>

      <!-- COMPLEXITY BADGES -->
      <div v-if="currentProblem.info" class="complexity-badges">
        <span class="badge">⏱️ Time: {{ currentProblem.info.time }}</span>
        <span class="badge">💾 Space: {{ currentProblem.info.space }}</span>
      </div>

      <!-- PARAMETER INPUTS -->
      <div class="input-row">
        <!-- N-Queens -->
        <template v-if="selectedProblem === 'nQueens'">
          <label>Board Size (N):</label>
          <input 
            v-model.number="params.n" 
            type="number" 
            min="4" 
            max="8"
            placeholder="4-8"
            class="param-input"
          />
        </template>

        <!-- Tower of Hanoi -->
        <template v-if="selectedProblem === 'towerOfHanoi'">
          <label>Number of Disks:</label>
          <input 
            v-model.number="params.disks" 
            type="number" 
            min="2" 
            max="6"
            placeholder="2-6"
            class="param-input"
          />
        </template>

        <!-- Water Jug -->
        <template v-if="selectedProblem === 'waterJug'">
          <label>Jug 1 (L):</label>
          <input 
            v-model.number="params.jug1" 
            type="number" 
            min="1" 
            max="10"
            placeholder="4"
            class="param-input small"
          />
          <label>Jug 2 (L):</label>
          <input 
            v-model.number="params.jug2" 
            type="number" 
            min="1" 
            max="10"
            placeholder="3"
            class="param-input small"
          />
          <label>Target (L):</label>
          <input 
            v-model.number="params.target" 
            type="number" 
            min="1" 
            max="10"
            placeholder="2"
            class="param-input small"
          />
        </template>

        <!-- Vacuum Cleaner -->
        <template v-if="selectedProblem === 'vacuumCleaner'">
          <label>Grid Size:</label>
          <input 
            v-model.number="params.gridSize" 
            type="number" 
            min="2" 
            max="5"
            placeholder="2"
            class="param-input small"
          />
        </template>

        <button class="btn primary" @click="executeVisualization">
          ▶ Run Visualization
        </button>

        <button class="btn ghost" @click="generateCode">
          💻 Generate Code
        </button>
      </div>

      <!-- PLAY CONTROLS -->
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

        <span class="step-counter" v-if="steps.length > 0">
          Step {{ stepIndex + 1 }} / {{ steps.length }}
        </span>
      </div>
    </section>

    <!-- MAIN VISUALIZATION AREA -->
    <section class="visualization-area">
      <!-- LEFT: CANVAS -->
      <div class="canvas-section">
        <h3>{{ currentProblem.algorithmName }} Visualization</h3>
        
        <!-- N-Queens Canvas -->
        <NQueensCanvas v-if="selectedProblem === 'nQueens'" 
          :board="currentStep.board"
          :queens="currentStep.queens"
          :attemptRow="currentStep.attemptRow"
          :attemptCol="currentStep.attemptCol"
          :status="currentStep.status"
        />

        <!-- Tower of Hanoi Canvas -->
        <TowerOfHanoiCanvas v-else-if="selectedProblem === 'towerOfHanoi'" 
          :towers="currentStep.towers"
          :moveFrom="currentStep.moveFrom"
          :moveTo="currentStep.moveTo"
          :disk="currentStep.disk"
        />

        <!-- Water Jug Canvas -->
        <WaterJugCanvas v-else-if="selectedProblem === 'waterJug'" 
          :jug1="currentStep.jug1"
          :jug2="currentStep.jug2"
          :jug1Capacity="currentStep.jug1Capacity"
          :jug2Capacity="currentStep.jug2Capacity"
          :target="currentStep.target"
        />

        <!-- MinMax Canvas -->
        <MinMaxCanvas v-else-if="selectedProblem === 'minimax'" 
          :board="currentStep.board"
          :player="currentStep.player"
          :bestMove="currentStep.bestMove"
        />

        <!-- Missionaries & Cannibals Canvas -->
        <MissionariesCannibalsCanvas v-else-if="selectedProblem === 'missionariesCannibals'" 
          :missionariesLeft="currentStep.missionariesLeft"
          :cannibalsLeft="currentStep.cannibalsLeft"
          :missionariesRight="currentStep.missionariesRight"
          :cannibalsRight="currentStep.cannibalsRight"
          :boatSide="currentStep.boatSide"
        />

        <!-- Number Puzzle Canvas -->
        <NumberPuzzleCanvas v-else-if="selectedProblem === 'numberPuzzle'" 
          :board="currentStep.board"
          :goal="currentStep.goal"
          :cost="currentStep.cost"
          :heuristic="currentStep.heuristic"
        />

        <!-- Vacuum Cleaner Canvas -->
        <VacuumCleanerCanvas v-else-if="selectedProblem === 'vacuumCleaner'" 
          :grid="currentStep.grid"
          :agentPos="currentStep.agentPos"
          :action="currentStep.action"
        />

        <!-- Alpha-Beta Canvas -->
        <AlphaBetaCanvas v-else-if="selectedProblem === 'alphaBeta'" 
          :board="currentStep.board"
          :alpha="currentStep.alpha"
          :beta="currentStep.beta"
          :player="currentStep.player"
          :pruned="currentStep.pruned"
        />

        <!-- Hill Climbing Canvas -->
        <HillClimbingCanvas v-else-if="selectedProblem === 'hillClimbing'" 
          :currentState="currentStep.currentState"
          :currentValue="currentStep.currentValue"
          :neighbors="currentStep.neighbors"
          :stateHistory="currentStep.stateHistory"
        />

        <!-- Simulated Annealing Canvas -->
        <SimulatedAnnealingCanvas v-else-if="selectedProblem === 'simulatedAnnealing'" 
          :currentState="currentStep.currentState"
          :currentEnergy="currentStep.currentEnergy"
          :temperature="currentStep.temperature"
          :history="currentStep.history"
          :accepted="currentStep.accepted"
        />

        <!-- Map Coloring Canvas -->
        <MapColoringCanvas v-else-if="selectedProblem === 'mapColoring'" 
          :assignments="currentStep.assignments"
          :currentRegion="currentStep.currentRegion"
          :conflicts="currentStep.conflicts"
          :tryingColor="currentStep.tryingColor"
        />

        <!-- Genetic Algorithm Canvas -->
        <GeneticAlgorithmCanvas v-else-if="selectedProblem === 'geneticAlgorithm'" 
          :population="currentStep.population"
          :generation="currentStep.generation"
          :fitness="currentStep.fitness"
          :bestChromosome="currentStep.bestChromosome"
        />
      </div>

      <!-- RIGHT: PSEUDOCODE -->
      <div class="pseudo-code-section">
        <h3>Algorithm Pseudocode</h3>
        <PseudoCodePanel 
          v-if="currentProblem.pseudocode" 
          :code="currentProblem.pseudocode" 
          :activeLine="currentStep.activePseudoLine" 
        />
      </div>
    </section>

    <!-- EXPLANATION SECTION -->
    <section class="explanation-section">
      <h3>Step Explanation</h3>
      <div class="explanation-content">
        <p>{{ currentStep.explanation }}</p>
        
        <div v-if="currentStep.path && currentStep.path.length > 0" class="path-display">
          <strong>Path:</strong> {{ currentStep.path.join(' → ') }}
        </div>

        <div v-if="currentStep.moveCount !== undefined" class="move-counter">
          <strong>Moves:</strong> {{ currentStep.moveCount }}
        </div>
      </div>
    </section>

    <!-- INFO MODAL -->
    <AlgorithmInfoModal 
      v-if="showInfo && currentProblem.info" 
      :info="currentProblem.info" 
      @close="showInfo = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router"
import arrowLeft from "@/assets/arrow-left.svg"
import AIProblemSelector from "./AIProblemSelector.vue"
import PseudoCodePanel from "./PseudoCodePanel.vue"
import AlgorithmInfoModal from "./AlgorithmInfoModal.vue"
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
.ai-problems-visualizer {
  background: radial-gradient(circle at top, #0f172a, #020617);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.top-section {
  margin-bottom: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #e0e7ff;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.back-btn:hover {
  background: rgba(99, 102, 241, 0.25);
  transform: translateX(-3px);
}

.arrow {
  width: 18px;
  height: 18px;
  filter: invert(1);
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-header p {
  color: #94a3b8;
  font-size: 1rem;
}

.operation-selector-section {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.operation-details {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(99, 102, 241, 0.2);
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

.operation-title-group h2 {
  font-size: 1.5rem;
  margin: 0;
}

.info-btn {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #818cf8;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.info-btn:hover {
  background: rgba(99, 102, 241, 0.25);
  transform: scale(1.1);
}

.operation-desc {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
}

.complexity-badges {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #c7d2fe;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.input-row label {
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 500;
}

.param-input {
  padding: 8px 12px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #e0e7ff;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 120px;
}

.param-input.small {
  width: 80px;
}

.param-input:focus {
  outline: none;
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn.ghost {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #c7d2fe;
}

.btn.ghost:hover {
  background: rgba(99, 102, 241, 0.2);
}

.controls-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.control-btn {
  padding: 8px 16px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #e0e7ff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.2);
  border-color: #818cf8;
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.control-btn.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
}

.control-btn.danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.4);
  color: #fca5a5;
}

.control-btn.danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2);
}

.step-counter {
  margin-left: auto;
  color: #94a3b8;
  font-size: 0.9rem;
}

.visualization-area {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.canvas-section,
.pseudo-code-section {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.canvas-section h3,
.pseudo-code-section h3 {
  font-size: 1.1rem;
  margin-bottom: 16px;
  color: #e0e7ff;
}

.explanation-section {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.explanation-section h3 {
  font-size: 1.1rem;
  margin-bottom: 12px;
  color: #e0e7ff;
}

.explanation-content p {
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 12px;
}

.path-display,
.move-counter {
  padding: 10px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 8px;
  margin-top: 12px;
  color: #c7d2fe;
  font-size: 0.9rem;
}

.path-display strong,
.move-counter strong {
  color: #818cf8;
}

@media (max-width: 1024px) {
  .visualization-area {
    grid-template-columns: 1fr;
  }
}
</style>
