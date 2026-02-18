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
            <h1 class="bs-title">8-Puzzle Problem — A* Algorithm</h1>

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

                    <!-- Info -->
                    <div class="bs-info-block">
                        <p><strong>Heuristic:</strong> Manhattan</p>
                        <p><strong>f(n):</strong> g(n) + h(n)</p>
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
                            <span class="bs-dot pz-start"></span>
                            <div><strong>Start</strong><br /><small>Initial puzzle state</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot pz-exploring"></span>
                            <div><strong>Exploring</strong><br /><small>Processing current node</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot pz-generated"></span>
                            <div><strong>Generated</strong><br /><small>Neighbor state created</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot pz-success"></span>
                            <div><strong>Solved</strong><br /><small>Goal state reached</small></div>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: PUZZLE BOARD -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <div class="pz-container">
                            <!-- Current State -->
                            <div class="pz-board-wrapper">
                                <h3 class="pz-board-title">Current State</h3>
                                <div class="pz-board">
                                    <div v-for="(row, ri) in currentStep.board" :key="ri" class="pz-row">
                                        <div v-for="(cell, ci) in row" :key="ci" class="pz-cell"
                                            :class="{
                                                'pz-cell-empty': cell === 0,
                                                'pz-cell-correct': cell !== 0 && isCorrectPosition(cell, ri, ci),
                                                'pz-cell-wrong': cell !== 0 && !isCorrectPosition(cell, ri, ci),
                                            }">
                                            <span v-if="cell !== 0" class="pz-num">{{ cell }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Arrow between boards -->
                            <div class="pz-arrow"><ArrowRight :size="24" /></div>

                            <!-- Goal State -->
                            <div class="pz-board-wrapper">
                                <h3 class="pz-board-title">Goal State</h3>
                                <div class="pz-board pz-board-goal">
                                    <div v-for="(row, ri) in currentStep.goal" :key="ri" class="pz-row">
                                        <div v-for="(cell, ci) in row" :key="ci" class="pz-cell pz-cell-goal"
                                            :class="{ 'pz-cell-empty': cell === 0 }">
                                            <span v-if="cell !== 0" class="pz-num">{{ cell }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Move / Cost Info -->
                        <div class="pz-info-panel">
                            <div class="pz-info-badge" :class="{
                                'pz-badge-exploring': currentStep.status === 'exploring' || currentStep.status === 'generated',
                                'pz-badge-solved': currentStep.status === 'success' || currentStep.status === 'finished',
                            }">
                                <span v-if="currentStep.status === 'start'"><Target :size="14" class="bs-lucide" /> Initial Puzzle State</span>
                                <span v-else-if="currentStep.status === 'exploring'"><Search :size="14" class="bs-lucide" /> Exploring node...</span>
                                <span v-else-if="currentStep.status === 'generated'"><FileText :size="14" class="bs-lucide" /> Generated neighbor ({{ currentStep.move }})</span>
                                <span v-else-if="currentStep.status === 'success' || currentStep.status === 'finished'"><CheckCircle2 :size="14" class="bs-lucide" /> Puzzle Solved!</span>
                                <span v-else>Processing...</span>
                            </div>
                            <div class="pz-cost-badges">
                                <div class="pz-cost-badge pz-cost-g">g(n): <strong>{{ currentStep.cost }}</strong></div>
                                <div class="pz-cost-badge pz-cost-h">h(n): <strong>{{ currentStep.heuristic }}</strong></div>
                                <div class="pz-cost-badge pz-cost-f">f(n): <strong>{{ currentStep.cost + currentStep.heuristic }}</strong></div>
                            </div>
                            <div v-if="currentStep.move" class="pz-move-badge">
                                Move: <strong>{{ currentStep.move }}</strong>
                            </div>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>8-Puzzle — A* Search</span>
                            <span>Manhattan Distance Heuristic</span>
                        </div>

                        <!-- Scrubber -->
                        <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1"
                            v-model.number="stepIndex" />
                    </div>

                    <!-- Status bar -->
                    <div class="bs-status-bar">{{ currentStep.explanation }}</div>

                    <!-- Complexity badges -->
                    <div class="bs-complexity-row">
                        <span class="bs-complexity-badge">Time: <strong>O(b<sup>d</sup>)</strong></span>
                        <span class="bs-complexity-badge">Space: <strong>O(b<sup>d</sup>)</strong></span>
                        <span class="bs-complexity-badge">Optimal: <strong>Yes</strong></span>
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
                    <h4 class="bs-inspector-label">CURRENT STATUS</h4>
                    <div class="bs-op-item">
                        <span class="bs-op-dot" :class="{
                            'pz-exploring': currentStep.status === 'exploring',
                            'pz-generated': currentStep.status === 'generated',
                            'pz-success': currentStep.status === 'success' || currentStep.status === 'finished',
                            'pz-start': currentStep.status === 'start',
                        }"></span>
                        {{ currentStep.explanation }}
                    </div>

                    <!-- Cost Metrics -->
                    <h4 class="bs-inspector-label">A* METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">g(n) — Cost</span>
                            <span class="bs-metric-value">{{ currentStep.cost }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">h(n) — Heuristic</span>
                            <span class="bs-metric-value">{{ currentStep.heuristic }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">f(n) — Total</span>
                            <span class="bs-metric-value">{{ currentStep.cost + currentStep.heuristic }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Tiles Misplaced</span>
                            <span class="bs-metric-value">{{ misplacedCount }}</span>
                        </div>
                    </div>

                    <!-- Current Step -->
                    <h4 class="bs-inspector-label">CURRENT STEP</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>

                    <!-- Move -->
                    <h4 class="bs-inspector-label">MOVE DIRECTION</h4>
                    <div class="pz-move-display">
                        <span v-if="currentStep.move" class="pz-move-dir" :class="'pz-dir-' + (currentStep.move || '').toLowerCase()">
                            {{ moveArrow }} {{ currentStep.move }}
                        </span>
                        <span v-else class="pz-no-move">—</span>
                    </div>

                    <!-- Algorithm Stats -->
                    <h4 class="bs-inspector-label">ALGORITHM STATS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">Nodes Explored</span>
                            <span class="bs-metric-value">{{ algorithmStats.explored }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Nodes Generated</span>
                            <span class="bs-metric-value">{{ algorithmStats.generated }}</span>
                        </div>
                    </div>

                    <!-- Solution Path -->
                    <h4 class="bs-inspector-label">SOLUTION PATH</h4>
                    <div class="pz-path-log">
                        <div v-for="(entry, i) in solutionPath" :key="i" class="pz-path-entry"
                            :class="{ 'pz-path-current': i === solutionPath.length - 1 }">
                            <span class="pz-path-num">#{{ i + 1 }}</span>
                            <span class="pz-path-text">{{ entry }}</span>
                        </div>
                        <span v-if="solutionPath.length === 0" class="pz-no-path">No moves yet</span>
                    </div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    How the 8-Puzzle A* Algorithm Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>
                        The 8-Puzzle is a classic sliding tile puzzle. A* search finds the optimal solution by using a
                        heuristic function to guide the search toward the goal state efficiently.
                    </p>

                    <h3>A* Search Formula:</h3>
                    <p><strong>f(n) = g(n) + h(n)</strong></p>
                    <ul>
                        <li><strong>g(n)</strong> — the cost to reach node n from the start (number of moves made)</li>
                        <li><strong>h(n)</strong> — the heuristic estimate of cost from n to goal (Manhattan distance)</li>
                        <li><strong>f(n)</strong> — the total estimated cost through node n</li>
                    </ul>

                    <h3>Manhattan Distance Heuristic:</h3>
                    <p>
                        For each tile, calculate the sum of horizontal and vertical distances from its current position
                        to its goal position. This is <strong>admissible</strong> (never overestimates) and
                        <strong>consistent</strong>, guaranteeing an optimal solution.
                    </p>

                    <h3>How A* Works:</h3>
                    <ol>
                        <li>Start with initial state in the open set (priority queue)</li>
                        <li>Pick the node with lowest f(n) from open set</li>
                        <li>If it's the goal, we're done! Reconstruct the path</li>
                        <li>Otherwise, generate all valid neighbors (slide blank UP/DOWN/LEFT/RIGHT)</li>
                        <li>For each neighbor, calculate g, h, and f values</li>
                        <li>Add unvisited neighbors to the open set</li>
                        <li>Repeat until goal is found or open set is empty</li>
                    </ol>

                    <h3>Complexity:</h3>
                    <ul>
                        <li><strong>Time:</strong> O(b<sup>d</sup>) worst case, but heuristic greatly reduces this</li>
                        <li><strong>Space:</strong> O(b<sup>d</sup>) — stores all generated nodes</li>
                        <li><strong>Optimal:</strong> Yes, when using an admissible heuristic</li>
                        <li><strong>Complete:</strong> Yes, will always find a solution if one exists</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EXAMPLES ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showExamples = !showExamples">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    Puzzle Facts &amp; Tips
                </button>
                <div v-if="showExamples" class="bs-section-body">
                    <h3>Key Concepts:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card">
                            <strong><Ruler :size="14" class="bs-lucide" /> Manhattan Distance</strong>
                            <small>Sum of |x₁-x₂| + |y₁-y₂| for each tile to its goal position</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><Target :size="14" class="bs-lucide" /> Admissible Heuristic</strong>
                            <small>Never overestimates the true cost — guarantees optimal solution</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><BarChart3 :size="14" class="bs-lucide" /> Priority Queue</strong>
                            <small>Always expands the most promising node (lowest f value) first</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><RefreshCw :size="14" class="bs-lucide" /> State Space</strong>
                            <small>9!/2 = 181,440 reachable states for the 8-Puzzle</small>
                        </div>
                    </div>

                    <h3>Interesting Facts:</h3>
                    <ul class="bs-tips">
                        <li>The 8-Puzzle was invented by Noyes Palmer Chapman in the 1870s</li>
                        <li>Any solvable configuration can be solved in at most 31 moves</li>
                        <li>Exactly half of all possible configurations are solvable</li>
                        <li>A* with Manhattan distance is one of the most efficient solvers for this puzzle</li>
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
import { numberPuzzleSteps } from '@/algorithms/aiProblems/numberPuzzleSteps'
import { Target, Search, FileText, CheckCircle2, Ruler, BarChart3, RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, SkipForward, RotateCcw, Settings2, Info } from 'lucide-vue-next'

const router = useRouter()

// ─── State ──────────────────────────────────
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showExamples = ref(false)

const steps = ref(numberPuzzleSteps())
const stepIndex = ref(0)
const playing = ref(false)

// ─── Computed ───────────────────────────────
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() =>
    steps.value[stepIndex.value] || {
        board: steps.value[0]?.board || [[1, 2, 3], [4, 5, 6], [7, 8, 0]],
        goal: [[1, 2, 3], [4, 5, 6], [7, 8, 0]],
        move: null,
        cost: 0,
        heuristic: 0,
        path: [],
        status: 'start',
        explanation: ''
    }
)
const progressPercent = computed(() =>
    totalSteps.value > 1
        ? Math.round((stepIndex.value / (totalSteps.value - 1)) * 100)
        : 100
)
const speedPercent = computed(() => speedLevel.value * 20)

// ─── Helper: Check if tile is in correct position ────
function isCorrectPosition(val, row, col) {
    const goal = currentStep.value.goal
    return goal[row][col] === val
}

// ─── Misplaced count ─────────────────────────
const misplacedCount = computed(() => {
    const board = currentStep.value.board
    const goal = currentStep.value.goal
    let count = 0
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] !== 0 && board[r][c] !== goal[r][c]) count++
        }
    }
    return count
})

// ─── Move arrow ──────────────────────────────
const moveArrow = computed(() => {
    const m = currentStep.value.move
    if (m === 'UP') return 'UP'
    if (m === 'DOWN') return 'DN'
    if (m === 'LEFT') return 'LT'
    if (m === 'RIGHT') return 'RT'
    return ''
})

// ─── Algorithm Stats ─────────────────────────
const algorithmStats = computed(() => {
    let explored = 0, generated = 0
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'exploring') explored++
        if (s.status === 'generated') generated++
    }
    return { explored, generated }
})

// ─── Solution Path ───────────────────────────
const solutionPath = computed(() => {
    const p = currentStep.value.path || []
    return p.slice(-12)
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
    steps.value = numberPuzzleSteps()
    stepIndex.value = 0
}

function goToGenerateCode() {
    const prompt = `Write a program to solve the 8-Puzzle problem using A* Algorithm with Manhattan Distance heuristic.\nImplement the priority queue, state representation, neighbor generation (UP/DOWN/LEFT/RIGHT moves), and path reconstruction.\nf(n) = g(n) + h(n) where g is cost so far and h is Manhattan distance.`
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
.bs-dot.pz-start { background: #3b82f6; }
.bs-dot.pz-exploring { background: #22c55e; }
.bs-dot.pz-generated { background: #f59e0b; }
.bs-dot.pz-success { background: #8b5cf6; }

/* ════════ CHART AREA ════════ */
.bs-chart-area { display: flex; flex-direction: column; gap: 10px; }
.bs-chart-wrapper { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 12px; padding: 16px 16px 8px; display: flex; flex-direction: column; }
.bs-chart-footer { display: flex; justify-content: space-between; font-size: 0.72rem; color: #64748b; padding: 6px 0 4px; }
.bs-scrubber { width: 100%; accent-color: #818cf8; cursor: pointer; margin-top: 4px; }
.bs-status-bar { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 10px; padding: 12px 20px; text-align: center; font-size: 0.9rem; color: #e2e8f0; font-weight: 500; }
.bs-complexity-row { display: flex; justify-content: center; gap: 32px; }
.bs-complexity-badge { font-size: 0.82rem; color: #94a3b8; }
.bs-complexity-badge strong { color: #e0e7ff; }

/* ════════ PUZZLE BOARD ════════ */
.pz-container { display: flex; align-items: center; justify-content: center; gap: 24px; padding: 24px 10px; min-height: 340px; flex-wrap: wrap; }

.pz-board-wrapper { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.pz-board-title { font-size: 0.85rem; font-weight: 600; color: #94a3b8; margin: 0; }

.pz-board { display: grid; grid-template-rows: repeat(3, 1fr); gap: 4px; background: rgba(100,116,139,0.2); padding: 6px; border-radius: 12px; }
.pz-board-goal { opacity: 0.7; }

.pz-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }

.pz-cell { width: 80px; height: 80px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.35s ease; font-weight: 700; }

.pz-cell-empty { background: rgba(15,23,42,0.4); border: 2px dashed rgba(100,116,139,0.25); }

.pz-cell-correct { background: rgba(34,197,94,0.15); border: 2px solid rgba(34,197,94,0.4); box-shadow: 0 0 8px rgba(34,197,94,0.15); }
.pz-cell-wrong { background: rgba(239,68,68,0.08); border: 2px solid rgba(239,68,68,0.25); }

.pz-cell-goal { background: rgba(99,102,241,0.1); border: 2px solid rgba(99,102,241,0.25); }

.pz-num { font-size: 1.6rem; font-weight: 700; color: #f1f5f9; text-shadow: 0 0 8px rgba(255,255,255,0.08); }

.pz-arrow { font-size: 2rem; color: #475569; font-weight: 300; }

/* Info Panel */
.pz-info-panel { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 16px; }

.pz-info-badge { padding: 8px 18px; border-radius: 10px; font-size: 0.82rem; font-weight: 600; text-align: center; background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.25); color: #cbd5e1; }
.pz-badge-exploring { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); color: #86efac; }
.pz-badge-solved { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); color: #c4b5fd; }

.pz-cost-badges { display: flex; gap: 8px; }
.pz-cost-badge { padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; }
.pz-cost-g { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); color: #93c5fd; }
.pz-cost-h { background: rgba(234,179,8,0.08); border: 1px solid rgba(234,179,8,0.25); color: #fde68a; }
.pz-cost-f { background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); color: #c4b5fd; }

.pz-move-badge { padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc; }

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
.bs-op-item { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: #cbd5e1; margin-bottom: 4px; }
.bs-op-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.bs-op-dot.pz-exploring { background: #22c55e; }
.bs-op-dot.pz-generated { background: #f59e0b; }
.bs-op-dot.pz-success { background: #8b5cf6; }
.bs-op-dot.pz-start { background: #3b82f6; }
.bs-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bs-metric { display: flex; flex-direction: column; }
.bs-metric-label { font-size: 0.7rem; color: #64748b; }
.bs-metric-value { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; }
.bs-step-detail { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; font-size: 0.78rem; color: #cbd5e1; font-family: 'Fira Code', monospace; }

/* Move Display */
.pz-move-display { background: rgba(15,23,42,0.5); padding: 10px; border-radius: 6px; text-align: center; }
.pz-move-dir { font-size: 1.1rem; font-weight: 700; color: #e0e7ff; }
.pz-dir-up { color: #86efac; }
.pz-dir-down { color: #fca5a5; }
.pz-dir-left { color: #93c5fd; }
.pz-dir-right { color: #fde68a; }
.pz-no-move { color: #475569; font-size: 0.82rem; }

/* Path Log */
.pz-path-log { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; max-height: 120px; overflow-y: auto; }
.pz-path-log::-webkit-scrollbar { width: 3px; }
.pz-path-log::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.3); border-radius: 2px; }
.pz-path-entry { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: #94a3b8; padding: 2px 0; }
.pz-path-current { color: #e0e7ff; font-weight: 600; }
.pz-path-num { font-weight: 700; color: #64748b; font-family: 'Fira Code', monospace; min-width: 24px; }
.pz-path-text { flex: 1; }
.pz-no-path { font-size: 0.72rem; color: #475569; font-style: italic; }

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
.bs-edge-card { background: rgba(15,23,42,0.5); border: 1px solid rgba(100,116,139,0.3); border-radius: 10px; padding: 14px; cursor: default; }
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
    .pz-cell { width: 60px; height: 60px; }
    .pz-num { font-size: 1.2rem; }
    .pz-container { gap: 12px; }
}
</style>
