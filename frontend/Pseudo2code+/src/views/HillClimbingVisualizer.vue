<template>
    <AuthNavbar />
    <main class="bs-page">
        <div class="bs-container">
            <!-- BACK BUTTON -->
            <div class="bs-top-bar">
                <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
                    <img :src="arrowLeft" class="arrow" />
                    Back
                </button>
            </div>

            <!-- TITLE -->
            <h1 class="bs-title">Hill Climbing Algorithm</h1>

            <!-- ═══════ THREE-COLUMN VISUALIZER ═══════ -->
            <div class="bs-three-col">
                <!-- LEFT PANEL: Controls -->
                <aside class="bs-controls-panel">
                    <!-- Playback -->
                    <div class="bs-btn-group">
                        <button class="bs-btn" :class="{ active: playing }" @click="playing ? pause() : play()">
                            <span class="bs-icon"><Play :size="14" /></span> {{ playing ? 'Pause' : 'Play' }}
                        </button>
                        <button class="bs-btn" @click="next" :disabled="stepIndex === steps.length - 1">
                            <span class="bs-icon"><SkipForward :size="14" /></span> Step
                        </button>
                    </div>
                    <div class="bs-btn-group">
                        <button class="bs-btn" @click="reset">
                            <span class="bs-icon"><RotateCcw :size="14" /></span> Reset
                        </button>
                    </div>

                    <!-- Settings toggle -->
                    <button class="bs-btn bs-settings-toggle" @click="showSettings = !showSettings">
                        <span class="bs-icon"><Settings2 :size="14" /></span> Settings
                    </button>
                    <div v-if="showSettings" class="bs-settings-body">
                        <div class="bs-setting-row">
                            <label>Speed: <strong>{{ speedPercent }}%</strong></label>
                            <input type="range" min="1" max="5" v-model.number="speedLevel" class="bs-slider" />
                        </div>
                    </div>

                    <!-- Generate Code Button -->
                    <button class="bs-btn bs-code-btn" @click="goToGenerateCode">
                        <span class="bs-icon">{ }</span> Generate Code
                    </button>

                    <!-- Quick info -->
                    <div class="bs-info-block">
                        <p><strong>f(x)</strong> = -(x-5)² + 25</p>
                        <p>Peak at <strong>x = 5</strong>, f = <strong>25</strong></p>
                    </div>

                    <!-- Keyboard shortcuts -->
                    <div class="bs-shortcuts">
                        <h4>Keyboard Shortcuts:</h4>
                        <div class="bs-shortcut-grid">
                            <span class="bs-key">Space</span><span>Play/Pause</span>
                            <span class="bs-key"><ArrowRight :size="12" /></span><span>Step Forward</span>
                            <span class="bs-key"><ArrowLeft :size="12" /></span><span>Step Back</span>
                            <span class="bs-key">R</span><span>Reset</span>
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="bs-legend">
                        <h4>Legend</h4>
                        <div class="bs-legend-item">
                            <span class="bs-dot hc-start"></span>
                            <div><strong>Start</strong><br /><small>Initial random state</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot hc-exploring"></span>
                            <div><strong>Exploring</strong><br /><small>Evaluating neighbors</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot hc-climbing"></span>
                            <div><strong>Climbing</strong><br /><small>Moving to better state</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot hc-localmax"></span>
                            <div><strong>Local Max</strong><br /><small>No better neighbor</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot hc-success"></span>
                            <div><strong>Global Optimum</strong><br /><small>Best solution found!</small></div>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: FUNCTION CURVE VISUALIZATION -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <div class="hc-viz-container">
                            <!-- SVG Function Curve -->
                            <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="hc-svg" preserveAspectRatio="xMidYMid meet">
                                <!-- Grid lines -->
                                <line v-for="i in 10" :key="'gx' + i"
                                    :x1="marginL + ((i - 1) / 9) * plotW" :y1="marginT"
                                    :x1.camel="marginL + ((i - 1) / 9) * plotW"
                                    :x2="marginL + ((i - 1) / 9) * plotW" :y2="marginT + plotH"
                                    stroke="rgba(100,116,139,0.15)" stroke-width="1" />
                                <line v-for="j in 6" :key="'gy' + j"
                                    :x1="marginL" :y1="marginT + ((j - 1) / 5) * plotH"
                                    :x2="marginL + plotW" :y2="marginT + ((j - 1) / 5) * plotH"
                                    stroke="rgba(100,116,139,0.15)" stroke-width="1" />

                                <!-- Axes -->
                                <line :x1="marginL" :y1="marginT + plotH" :x2="marginL + plotW"
                                    :y2="marginT + plotH" stroke="#475569" stroke-width="1.5" />
                                <line :x1="marginL" :y1="marginT" :x2="marginL" :y2="marginT + plotH"
                                    stroke="#475569" stroke-width="1.5" />

                                <!-- X axis labels -->
                                <text v-for="i in 10" :key="'xl' + i"
                                    :x="marginL + ((i - 1) / 9) * plotW"
                                    :y="marginT + plotH + 18"
                                    text-anchor="middle" fill="#64748b" font-size="11">
                                    {{ i - 1 }}
                                </text>
                                <!-- Y axis labels -->
                                <text v-for="j in 6" :key="'yl' + j"
                                    :x="marginL - 8"
                                    :y="marginT + plotH - ((j - 1) / 5) * plotH + 4"
                                    text-anchor="end" fill="#64748b" font-size="11">
                                    {{ Math.round(((j - 1) / 5) * 30 - 5) }}
                                </text>

                                <!-- Axis titles -->
                                <text :x="marginL + plotW / 2" :y="marginT + plotH + 36" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="600">x (state)</text>
                                <text :x="marginL - 36" :y="marginT + plotH / 2" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="600" transform-origin="center" :transform="`rotate(-90, ${marginL - 36}, ${marginT + plotH / 2})`">f(x)</text>

                                <!-- Function curve -->
                                <path :d="curvePath" fill="none" stroke="#818cf8" stroke-width="2.5"
                                    stroke-linecap="round" />
                                <!-- Filled area under curve (above axis) -->
                                <path :d="curveAreaPath" fill="rgba(129,140,248,0.06)" />

                                <!-- History trail -->
                                <template v-if="currentStep.stateHistory && currentStep.stateHistory.length > 1">
                                    <line v-for="(seg, si) in historySegments" :key="'seg' + si"
                                        :x1="seg.x1" :y1="seg.y1" :x2="seg.x2" :y2="seg.y2"
                                        stroke="rgba(245,158,11,0.5)" stroke-width="2"
                                        stroke-dasharray="4,3" />
                                    <circle v-for="(pt, pi) in historyPoints" :key="'hp' + pi"
                                        :cx="pt.x" :cy="pt.y" r="4"
                                        fill="rgba(245,158,11,0.6)" />
                                </template>

                                <!-- Neighbor indicators -->
                                <template v-if="currentStep.neighbors && currentStep.neighbors.length > 0">
                                    <circle v-for="(n, ni) in neighborPlots" :key="'nb' + ni"
                                        :cx="n.x" :cy="n.y" r="6"
                                        fill="none" :stroke="n.isBest ? '#22c55e' : '#64748b'"
                                        stroke-width="2" stroke-dasharray="3,2" />
                                    <text v-for="(n, ni) in neighborPlots" :key="'nbt' + ni"
                                        :x="n.x" :y="n.y - 12"
                                        text-anchor="middle" :fill="n.isBest ? '#86efac' : '#94a3b8'" font-size="10">
                                        {{ n.val }}
                                    </text>
                                </template>

                                <!-- Current position marker -->
                                <circle v-if="currentPos"
                                    :cx="currentPos.x" :cy="currentPos.y" r="8"
                                    :fill="currentStep.status === 'success' ? '#22c55e' : currentStep.status === 'stuck' || currentStep.status === 'local_max' ? '#ef4444' : '#f59e0b'"
                                    stroke="#fff" stroke-width="2"
                                    class="hc-marker" />
                                <text v-if="currentPos"
                                    :x="currentPos.x" :y="currentPos.y - 16"
                                    text-anchor="middle" fill="#f1f5f9" font-size="12" font-weight="700">
                                    ({{ currentStep.currentState }}, {{ currentStep.currentValue }})
                                </text>

                                <!-- Peak indicator -->
                                <circle :cx="stateToX(5)" :cy="valToY(25)" r="5"
                                    fill="none" stroke="rgba(139,92,246,0.5)" stroke-width="1.5"
                                    stroke-dasharray="3,2" />
                                <text :x="stateToX(5)" :y="valToY(25) - 10"
                                    text-anchor="middle" fill="rgba(139,92,246,0.6)" font-size="10">peak</text>
                            </svg>

                            <!-- Status Badge -->
                            <div class="hc-status-badge" :class="{
                                'hc-sb-explore': currentStep.status === 'exploring',
                                'hc-sb-climb': currentStep.status === 'climbing',
                                'hc-sb-stuck': currentStep.status === 'stuck' || currentStep.status === 'local_max',
                                'hc-sb-done': currentStep.status === 'success',
                            }">
                                <span v-if="currentStep.status === 'start'"><Mountain :size="14" class="bs-lucide" /> Starting Hill Climbing</span>
                                <span v-else-if="currentStep.status === 'exploring'"><Search :size="14" class="bs-lucide" /> Exploring neighbors at x={{ currentStep.currentState }}</span>
                                <span v-else-if="currentStep.status === 'climbing'"><TrendingUp :size="14" class="bs-lucide" /> Climbing! Moving to x={{ currentStep.bestNeighbor?.state }}</span>
                                <span v-else-if="currentStep.status === 'local_max'"><Flag :size="14" class="bs-lucide" /> Local Maximum — no better neighbors</span>
                                <span v-else-if="currentStep.status === 'success'"><Trophy :size="14" class="bs-lucide" /> Global Optimum Found! f({{ currentStep.currentState }}) = {{ currentStep.currentValue }}</span>
                                <span v-else-if="currentStep.status === 'stuck'"><XCircle :size="14" class="bs-lucide" /> Stuck at local optimum</span>
                            </div>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>f(x) = -(x-5)² + 25</span>
                            <span>Global max at x=5</span>
                        </div>

                        <!-- Scrubber -->
                        <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1"
                            v-model.number="stepIndex" />
                    </div>

                    <!-- Status bar -->
                    <div class="bs-status-bar">{{ currentStep.explanation }}</div>

                    <!-- Complexity badges -->
                    <div class="bs-complexity-row">
                        <span class="bs-complexity-badge">Time: <strong>O(n · m)</strong></span>
                        <span class="bs-complexity-badge">Space: <strong>O(1)</strong></span>
                        <span class="bs-complexity-badge">Completeness: <strong>No</strong></span>
                    </div>
                </div>

                <!-- RIGHT PANEL: Inspector -->
                <aside class="bs-inspector">
                    <div class="bs-inspector-header">
                        <h3>Inspector</h3>
                        <span class="bs-step-badge">Step {{ currentStepNumber }} of {{ totalSteps }}</span>
                    </div>

                    <!-- Progress -->
                    <div class="bs-inspector-row">
                        <span>Progress</span>
                        <span>{{ progressPercent }}%</span>
                    </div>
                    <div class="bs-progress-track">
                        <div class="bs-progress-fill" :style="{ width: progressPercent + '%' }"></div>
                    </div>

                    <!-- Current Operation -->
                    <h4 class="bs-inspector-label">CURRENT STATE</h4>
                    <div class="hc-state-display">
                        <div class="hc-state-box">
                            <span class="hc-st-label">State (x)</span>
                            <span class="hc-st-value">{{ currentStep.currentState }}</span>
                        </div>
                        <div class="hc-state-box">
                            <span class="hc-st-label">Value f(x)</span>
                            <span class="hc-st-value">{{ currentStep.currentValue }}</span>
                        </div>
                    </div>

                    <!-- Neighbors -->
                    <h4 class="bs-inspector-label">NEIGHBORS</h4>
                    <div class="hc-neighbors-list">
                        <div v-for="(n, i) in currentStep.neighbors" :key="i"
                            class="hc-neighbor-item" :class="{
                                'hc-nb-best': currentStep.bestNeighbor && n.state === currentStep.bestNeighbor.state
                            }">
                            <span class="hc-nb-state">x={{ n.state }}</span>
                            <span class="hc-nb-val">f={{ n.value }}</span>
                            <span v-if="currentStep.bestNeighbor && n.state === currentStep.bestNeighbor.state" class="hc-nb-badge">best</span>
                        </div>
                        <span v-if="!currentStep.neighbors || currentStep.neighbors.length === 0" class="hc-no-nb">No neighbors</span>
                    </div>

                    <!-- Best Neighbor -->
                    <h4 v-if="currentStep.bestNeighbor" class="bs-inspector-label">BEST NEIGHBOR</h4>
                    <div v-if="currentStep.bestNeighbor" class="hc-best-display">
                        <span>x = {{ currentStep.bestNeighbor.state }}</span>
                        <span>f(x) = {{ currentStep.bestNeighbor.value }}</span>
                    </div>

                    <!-- Metrics -->
                    <h4 class="bs-inspector-label">METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">Steps Taken</span>
                            <span class="bs-metric-value">{{ historyLen }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Peak Value</span>
                            <span class="bs-metric-value">25.00</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Current Val</span>
                            <span class="bs-metric-value">{{ currentStep.currentValue }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Gap to Peak</span>
                            <span class="bs-metric-value" :class="{ 'hc-gap-zero': gapToPeak === '0.00' }">{{ gapToPeak }}</span>
                        </div>
                    </div>

                    <!-- State History -->
                    <h4 class="bs-inspector-label">STATE HISTORY</h4>
                    <div class="hc-history-log">
                        <div v-for="(h, i) in (currentStep.stateHistory || [])" :key="i"
                            class="hc-history-item" :class="{
                                'hc-hist-current': i === (currentStep.stateHistory?.length || 0) - 1,
                            }">
                            <span class="hc-hist-num">#{{ i + 1 }}</span>
                            <span>x={{ h.state }}</span>
                            <span class="hc-hist-val">f={{ h.value }}</span>
                        </div>
                        <span v-if="!currentStep.stateHistory || currentStep.stateHistory.length === 0" class="hc-no-nb">No history yet</span>
                    </div>

                    <!-- Current Step -->
                    <h4 class="bs-inspector-label">EXPLANATION</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    How Hill Climbing Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>
                        Hill Climbing is a local search algorithm that continuously moves toward increasing value
                        (uphill). It terminates when it reaches a state where no neighbor has a higher value —
                        either a local maximum or the global optimum.
                    </p>

                    <h3>Steps:</h3>
                    <ol>
                        <li><strong>Initialize</strong> — start at a random state x</li>
                        <li><strong>Evaluate Neighbors</strong> — compute f(x-1) and f(x+1)</li>
                        <li><strong>Compare</strong> — if a neighbor is better, move there</li>
                        <li><strong>Repeat</strong> — continue until no neighbor is better</li>
                        <li><strong>Terminate</strong> — return current state as solution</li>
                    </ol>

                    <h3>Limitations:</h3>
                    <ul>
                        <li><strong>Local Maxima</strong> — may get stuck at a peak that isn't the best overall</li>
                        <li><strong>Plateaus</strong> — flat areas where all neighbors have equal value</li>
                        <li><strong>Ridges</strong> — slopes that don't point directly toward the goal</li>
                        <li><strong>No Backtracking</strong> — never revisits previous states</li>
                    </ul>

                    <h3>Variants:</h3>
                    <ul>
                        <li><strong>Steepest-Ascent</strong> — always pick the best neighbor (used here)</li>
                        <li><strong>Stochastic Hill Climbing</strong> — randomly pick among uphill moves</li>
                        <li><strong>Random-Restart</strong> — restart from random positions to avoid local maxima</li>
                        <li><strong>Simulated Annealing</strong> — allows downhill moves with decreasing probability</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EXAMPLES ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showExamples = !showExamples">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    Hill Climbing Applications
                </button>
                <div v-if="showExamples" class="bs-section-body">
                    <h3>Real-World Uses:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card">
                            <strong><Puzzle :size="14" class="bs-lucide" /> N-Queens</strong>
                            <small>Place N queens on an N×N board with no conflicts using hill climbing heuristics.</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><Map :size="14" class="bs-lucide" /> Traveling Salesman</strong>
                            <small>Find short routes by swapping cities and climbing toward shorter total distance.</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><Bot :size="14" class="bs-lucide" /> Neural Networks</strong>
                            <small>Gradient descent is essentially "hill climbing" downhill on the loss surface.</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><Package :size="14" class="bs-lucide" /> VLSI Layout</strong>
                            <small>Optimize chip component placement to minimize wire length.</small>
                        </div>
                    </div>

                    <h3>Tips for This Visualizer:</h3>
                    <ul class="bs-tips">
                        <li>The orange dot shows your current position on the curve</li>
                        <li>Dashed circles show neighbor states being evaluated</li>
                        <li>The dotted trail shows your climbing path</li>
                        <li>Try resetting multiple times — different random starts give different paths!</li>
                    </ul>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import arrowLeft from '@/assets/arrow-left.svg'
import { hillClimbingSteps } from '@/algorithms/aiProblems/hillClimbingSteps'
import { Mountain, Search, TrendingUp, Flag, Trophy, XCircle, Puzzle, Map, Bot, Package, Play, SkipForward, RotateCcw, Settings2, Info, ArrowRight, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

// ─── State ──────────────────────────────────
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showExamples = ref(false)

const steps = ref(hillClimbingSteps())
const stepIndex = ref(0)
const playing = ref(false)

// ─── SVG dimensions ────────────────────────
const svgW = 560
const svgH = 360
const marginL = 50
const marginT = 30
const marginR = 20
const marginB = 45
const plotW = svgW - marginL - marginR
const plotH = svgH - marginT - marginB

// x range: 0-9, y range: -5 to 25
const xMin = 0, xMax = 9
const yMin = -5, yMax = 25

function stateToX(x) {
    return marginL + ((x - xMin) / (xMax - xMin)) * plotW
}
function valToY(val) {
    return marginT + plotH - ((val - yMin) / (yMax - yMin)) * plotH
}

// Function: f(x) = -(x-5)^2 + 25
function fOfX(x) { return -(x - 5) * (x - 5) + 25 }

// ─── Computed ───────────────────────────────
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() =>
    steps.value[stepIndex.value] || {
        currentState: 0,
        currentValue: '0.00',
        neighbors: [],
        stateHistory: [],
        status: 'start',
        explanation: '',
        bestNeighbor: null
    }
)
const progressPercent = computed(() =>
    totalSteps.value > 1
        ? Math.round((stepIndex.value / (totalSteps.value - 1)) * 100)
        : 100
)
const speedPercent = computed(() => speedLevel.value * 20)

const historyLen = computed(() => currentStep.value.stateHistory?.length || 0)
const gapToPeak = computed(() => {
    const val = parseFloat(currentStep.value.currentValue) || 0
    return (25 - val).toFixed(2)
})

// ─── Curve path ─────────────────────────────
const curvePath = computed(() => {
    let d = ''
    for (let i = 0; i <= 90; i++) {
        const x = xMin + (i / 90) * (xMax - xMin)
        const y = fOfX(x)
        const px = stateToX(x)
        const py = valToY(y)
        d += (i === 0 ? 'M' : 'L') + `${px},${py} `
    }
    return d
})

const curveAreaPath = computed(() => {
    let d = `M${stateToX(xMin)},${valToY(yMin)} `
    for (let i = 0; i <= 90; i++) {
        const x = xMin + (i / 90) * (xMax - xMin)
        const y = fOfX(x)
        d += `L${stateToX(x)},${valToY(y)} `
    }
    d += `L${stateToX(xMax)},${valToY(yMin)} Z`
    return d
})

// ─── Current position ──────────────────────
const currentPos = computed(() => {
    const s = currentStep.value
    if (s.currentState == null) return null
    const x = Number(s.currentState)
    const y = parseFloat(s.currentValue)
    return { x: stateToX(x), y: valToY(y) }
})

// ─── History trail ──────────────────────────
const historySegments = computed(() => {
    const hist = currentStep.value.stateHistory || []
    if (hist.length < 2) return []
    const segs = []
    for (let i = 0; i < hist.length - 1; i++) {
        segs.push({
            x1: stateToX(hist[i].state),
            y1: valToY(parseFloat(hist[i].value)),
            x2: stateToX(hist[i + 1].state),
            y2: valToY(parseFloat(hist[i + 1].value)),
        })
    }
    return segs
})

const historyPoints = computed(() => {
    const hist = currentStep.value.stateHistory || []
    return hist.slice(0, -1).map(h => ({
        x: stateToX(h.state),
        y: valToY(parseFloat(h.value)),
    }))
})

// ─── Neighbor plots ─────────────────────────
const neighborPlots = computed(() => {
    const neighbors = currentStep.value.neighbors || []
    const best = currentStep.value.bestNeighbor
    return neighbors.map(n => ({
        x: stateToX(n.state),
        y: valToY(parseFloat(n.value)),
        val: parseFloat(n.value).toFixed(1),
        isBest: best && n.state === best.state,
    }))
})

// ─── Speed ──────────────────────────────────
const speedDelay = computed(() => {
    const map = { 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }
    return map[speedLevel.value]
})

// ─── Playback ───────────────────────────────
let timer = null

function play() {
    if (playing.value) return
    playing.value = true
    timer = setInterval(() => {
        if (stepIndex.value < steps.value.length - 1) {
            stepIndex.value++
        } else {
            pause()
        }
    }, speedDelay.value)
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
    steps.value = hillClimbingSteps()
    stepIndex.value = 0
}

function goToGenerateCode() {
    const prompt = `Write a program implementing the Hill Climbing algorithm.\nUse the objective function f(x) = -(x-5)^2 + 25, which has a global maximum of 25 at x=5.\nStart from a random state and iteratively move to the best neighboring state.\nInclude neighbor evaluation, steepest ascent selection, and termination at local/global maximum.`
    router.push({ path: '/generate-code', query: { prompt } })
}

// ─── Watchers ───────────────────────────────
watch(speedLevel, () => {
    if (playing.value) { pause(); play() }
})

// ─── Keyboard Shortcuts ─────────────────────
function handleKey(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
    switch (e.code) {
        case 'Space':
            e.preventDefault()
            playing.value ? pause() : play()
            break
        case 'ArrowRight': next(); break
        case 'ArrowLeft': prev(); break
        case 'KeyR': reset(); break
    }
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => {
    window.removeEventListener('keydown', handleKey)
    clearInterval(timer)
})
</script>

<style scoped>
/* ════════ PAGE ════════ */
.bs-page { min-height: 100vh; background: radial-gradient(ellipse at top, #0f172a 0%, #020617 70%); color: #e2e8f0; padding: 16px 24px 40px; font-family: 'Inter', 'Segoe UI', sans-serif; }
.bs-container { max-width: 1440px; margin: 0 auto; }
.bs-top-bar { flex-shrink: 0; }
.back-btn-compact { display: flex; align-items: center; gap: 6px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #e0e7ff; padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
.back-btn-compact:hover { background: rgba(99,102,241,0.25); transform: translateX(-2px); }
.arrow { width: 16px; height: 16px; }
.bs-title { font-size: 1.6rem; font-weight: 700; color: #f1f5f9; margin: 16px 0 16px; }
.bs-lucide { display: inline-block; vertical-align: -2px; margin-right: 2px; }

/* ════════ THREE-COL ════════ */
.bs-three-col { display: grid; grid-template-columns: 240px 1fr 280px; gap: 16px; margin-bottom: 24px; }

/* ════════ CONTROLS ════════ */
.bs-controls-panel { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.bs-btn-group { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.bs-btn { display: flex; align-items: center; gap: 6px; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(100,116,139,0.3); background: rgba(100,116,139,0.12); color: #cbd5e1; font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
.bs-btn:hover:not(:disabled) { background: rgba(100,116,139,0.25); }
.bs-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.bs-btn.active { background: rgba(99,102,241,0.3); border-color: rgba(99,102,241,0.5); }
.bs-icon { font-size: 0.9rem; }
.bs-settings-toggle { width: 100%; justify-content: center; }
.bs-settings-body { display: flex; flex-direction: column; gap: 8px; padding: 8px; background: rgba(15,23,42,0.5); border-radius: 8px; }
.bs-setting-row label { font-size: 0.78rem; color: #94a3b8; }
.bs-slider { width: 100%; cursor: pointer; accent-color: #818cf8; }
.bs-code-btn { width: 100%; justify-content: center; background: rgba(99,102,241,0.15) !important; border-color: rgba(99,102,241,0.35) !important; color: #a5b4fc !important; }
.bs-code-btn:hover { background: rgba(99,102,241,0.28) !important; }
.bs-info-block { font-size: 0.78rem; color: #94a3b8; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; }
.bs-shortcuts h4 { font-size: 0.78rem; color: #94a3b8; margin: 0 0 6px; font-weight: 600; }
.bs-shortcut-grid { display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; font-size: 0.75rem; color: #94a3b8; }
.bs-key { background: rgba(100,116,139,0.25); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #e0e7ff; font-size: 0.72rem; text-align: center; }

/* Legend */
.bs-legend h4 { font-size: 0.82rem; color: #f1f5f9; margin: 0 0 8px; }
.bs-legend-item { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 8px; font-size: 0.78rem; color: #cbd5e1; }
.bs-legend-item small { color: #64748b; }
.bs-dot { width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0; margin-top: 2px; }
.bs-dot.hc-start { background: #3b82f6; }
.bs-dot.hc-exploring { background: #f59e0b; }
.bs-dot.hc-climbing { background: #22c55e; }
.bs-dot.hc-localmax { background: #ef4444; }
.bs-dot.hc-success { background: #8b5cf6; }

/* ════════ CHART AREA ════════ */
.bs-chart-area { display: flex; flex-direction: column; gap: 10px; }
.bs-chart-wrapper { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 12px; padding: 16px 16px 8px; display: flex; flex-direction: column; }
.bs-chart-footer { display: flex; justify-content: space-between; font-size: 0.72rem; color: #64748b; padding: 6px 0 4px; }
.bs-scrubber { width: 100%; accent-color: #818cf8; cursor: pointer; margin-top: 4px; }
.bs-status-bar { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 10px; padding: 12px 20px; text-align: center; font-size: 0.9rem; color: #e2e8f0; font-weight: 500; }
.bs-complexity-row { display: flex; justify-content: center; gap: 32px; }
.bs-complexity-badge { font-size: 0.82rem; color: #94a3b8; }
.bs-complexity-badge strong { color: #e0e7ff; }

/* ════════ HILL CLIMBING VIZ ════════ */
.hc-viz-container { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 12px 0; }
.hc-svg { width: 100%; max-width: 560px; height: auto; }
.hc-marker { filter: drop-shadow(0 0 6px rgba(245,158,11,0.5)); transition: cx 0.3s ease, cy 0.3s ease; }

/* Status badge */
.hc-status-badge { padding: 8px 18px; border-radius: 10px; font-size: 0.82rem; font-weight: 600; text-align: center; background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.25); color: #cbd5e1; }
.hc-sb-explore { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.25); color: #fbbf24; }
.hc-sb-climb { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); color: #86efac; }
.hc-sb-stuck { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.25); color: #fca5a5; }
.hc-sb-done { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); color: #c4b5fd; }

/* ════════ INSPECTOR ════════ */
.bs-inspector { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 12px; padding: 14px; overflow-y: auto; max-height: 600px; }
.bs-inspector::-webkit-scrollbar { width: 4px; }
.bs-inspector::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.3); border-radius: 2px; }
.bs-inspector-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.bs-inspector-header h3 { margin: 0; font-size: 1rem; color: #f1f5f9; }
.bs-step-badge { background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4); padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; color: #a5b4fc; font-weight: 600; }
.bs-inspector-row { display: flex; justify-content: space-between; font-size: 0.78rem; color: #94a3b8; margin-bottom: 4px; }
.bs-progress-track { width: 100%; height: 6px; background: rgba(100,116,139,0.2); border-radius: 3px; margin-bottom: 16px; overflow: hidden; }
.bs-progress-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #818cf8); border-radius: 3px; transition: width 0.25s; }
.bs-inspector-label { font-size: 0.7rem; letter-spacing: 0.06em; color: #64748b; margin: 14px 0 6px; font-weight: 700; }
.bs-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bs-metric { display: flex; flex-direction: column; }
.bs-metric-label { font-size: 0.7rem; color: #64748b; }
.bs-metric-value { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; }
.bs-step-detail { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; font-size: 0.78rem; color: #cbd5e1; font-family: 'Fira Code', monospace; }

/* State display */
.hc-state-display { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.hc-state-box { background: rgba(15,23,42,0.5); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; align-items: center; }
.hc-st-label { font-size: 0.68rem; color: #64748b; font-weight: 600; letter-spacing: 0.02em; }
.hc-st-value { font-size: 1.3rem; font-weight: 800; color: #f1f5f9; font-family: 'Fira Code', monospace; }
.hc-gap-zero { color: #22c55e !important; }

/* Neighbors */
.hc-neighbors-list { background: rgba(15,23,42,0.5); border-radius: 6px; padding: 6px 8px; }
.hc-neighbor-item { display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: #94a3b8; padding: 3px 4px; border-radius: 4px; }
.hc-neighbor-item.hc-nb-best { background: rgba(34,197,94,0.08); color: #86efac; }
.hc-nb-state { font-weight: 600; font-family: 'Fira Code', monospace; }
.hc-nb-val { font-family: 'Fira Code', monospace; }
.hc-nb-badge { background: rgba(34,197,94,0.2); color: #22c55e; padding: 1px 6px; border-radius: 8px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.03em; }
.hc-no-nb { font-size: 0.72rem; color: #475569; font-style: italic; }

/* Best Neighbor */
.hc-best-display { background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.2); border-radius: 6px; padding: 8px 10px; display: flex; justify-content: space-around; font-size: 0.82rem; font-weight: 600; color: #86efac; font-family: 'Fira Code', monospace; }

/* State History */
.hc-history-log { background: rgba(15,23,42,0.5); padding: 6px 8px; border-radius: 6px; max-height: 120px; overflow-y: auto; }
.hc-history-log::-webkit-scrollbar { width: 3px; }
.hc-history-log::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.3); border-radius: 2px; }
.hc-history-item { display: flex; gap: 10px; font-size: 0.72rem; color: #94a3b8; padding: 2px 0; }
.hc-hist-current { color: #e0e7ff; font-weight: 600; }
.hc-hist-num { color: #64748b; font-weight: 700; font-family: 'Fira Code', monospace; min-width: 24px; }
.hc-hist-val { color: #818cf8; font-family: 'Fira Code', monospace; }

/* ════════ SECTIONS ════════ */
.bs-section { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 12px; margin-bottom: 12px; overflow: hidden; }
.bs-section-toggle { width: 100%; display: flex; align-items: center; gap: 10px; padding: 14px 18px; background: none; border: none; color: #e2e8f0; font-size: 1rem; font-weight: 600; cursor: pointer; text-align: left; transition: background 0.15s; }
.bs-section-toggle:hover { background: rgba(100,116,139,0.1); }
.bs-info-circle { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4); color: #a5b4fc; font-size: 0.82rem; font-weight: 700; flex-shrink: 0; }
.bs-section-body { padding: 0 20px 20px; color: #cbd5e1; font-size: 0.88rem; line-height: 1.7; }
.bs-section-body h2 { font-size: 1.15rem; color: #f1f5f9; margin: 0 0 8px; }
.bs-section-body h3 { font-size: 0.95rem; color: #e0e7ff; margin: 16px 0 6px; }
.bs-section-body ol, .bs-section-body ul { padding-left: 20px; margin: 4px 0; }
.bs-section-body li { margin-bottom: 3px; }
.bs-edge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
.bs-edge-card { background: rgba(15,23,42,0.5); border: 1px solid rgba(100,116,139,0.3); border-radius: 10px; padding: 14px; cursor: default; transition: all 0.15s; }
.bs-edge-card:hover { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.08); }
.bs-edge-card strong { display: block; color: #f1f5f9; font-size: 0.88rem; margin-bottom: 4px; }
.bs-edge-card small { color: #64748b; font-size: 0.78rem; }
.bs-tips { padding-left: 20px; }
.bs-tips li { margin-bottom: 4px; }

/* ════════ RESPONSIVE ════════ */
@media (max-width: 1100px) {
    .bs-three-col { grid-template-columns: 1fr; gap: 16px; }
    .bs-chart-area { order: -1; }
    .bs-controls-panel { order: 1; }
    .bs-inspector { order: 2; max-height: none; }
}
@media (max-width: 768px) {
    .bs-shortcuts { display: none; }
    .bs-legend { display: none; }
    .bs-controls-panel { padding: 10px; }
}
@media (max-width: 640px) {
    .bs-edge-grid { grid-template-columns: 1fr; }
    .bs-page { padding: 10px 12px 24px; }
    .hc-state-display { grid-template-columns: 1fr; }
}
</style>
