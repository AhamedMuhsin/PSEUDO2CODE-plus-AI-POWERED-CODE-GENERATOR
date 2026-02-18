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
            <h1 class="bs-title">MinMax Algorithm – Tic-Tac-Toe</h1>

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
                        <button class="bs-btn" @click="generateNew">
                            <span class="bs-icon"><Shuffle :size="14" /></span> New Game
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
                        <p><strong>Maximizer:</strong> X</p>
                        <p><strong>Minimizer:</strong> O</p>
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
                            <span class="bs-dot mm-start"></span>
                            <div><strong>Start</strong><br /><small>Initial state</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot mm-maximizing"></span>
                            <div><strong>Maximizing</strong><br /><small>X's turn (max score)</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot mm-minimizing"></span>
                            <div><strong>Minimizing</strong><br /><small>O's turn (min score)</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot mm-terminal"></span>
                            <div><strong>Terminal</strong><br /><small>Leaf node evaluated</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot mm-success"></span>
                            <div><strong>Complete</strong><br /><small>Best move found</small></div>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: GAME BOARD VISUALIZATION -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <!-- Tic-Tac-Toe Board -->
                        <div class="mm-board-container">
                            <div class="mm-board">
                                <div v-for="(row, ri) in currentStep.board" :key="ri" class="mm-row">
                                    <div v-for="(cell, ci) in row" :key="ci" class="mm-cell"
                                        :class="{
                                            'mm-cell-x': cell === 'X',
                                            'mm-cell-o': cell === 'O',
                                            'mm-cell-highlight': currentStep.bestMove && currentStep.bestMove.row === ri && currentStep.bestMove.col === ci,
                                        }">
                                        <span v-if="cell === 'X'" class="mm-mark mm-x">✕</span>
                                        <span v-else-if="cell === 'O'" class="mm-mark mm-o">○</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Move / Score Info -->
                            <div class="mm-info-panel">
                                <div class="mm-info-badge" :class="{
                                    'mm-badge-max': currentStep.player === 'X',
                                    'mm-badge-min': currentStep.player === 'O',
                                    'mm-badge-done': currentStep.status === 'success',
                                }">
                                    <span v-if="currentStep.status === 'maximizing'"><TrendingUp :size="14" class="bs-lucide" /> Maximizer (X) playing</span>
                                    <span v-else-if="currentStep.status === 'minimizing'"><TrendingDown :size="14" class="bs-lucide" /> Minimizer (O) playing</span>
                                    <span v-else-if="currentStep.status === 'terminal'"><BarChart3 :size="14" class="bs-lucide" /> Terminal: Score = {{ currentStep.score }}</span>
                                    <span v-else-if="currentStep.status === 'success'"><CheckCircle2 :size="14" class="bs-lucide" /> Analysis Complete</span>
                                    <span v-else-if="currentStep.status === 'analyzing'"><Search :size="14" class="bs-lucide" /> Analyzing position...</span>
                                    <span v-else><Gamepad2 :size="14" class="bs-lucide" /> Game Start</span>
                                </div>
                                <div class="mm-depth-badge" v-if="currentStep.depth !== undefined">
                                    Depth: {{ currentStep.depth }}
                                </div>
                                <div class="mm-score-badge" v-if="currentStep.score !== null && currentStep.score !== undefined">
                                    Score: <strong>{{ currentStep.score }}</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>MinMax Algorithm — Tic-Tac-Toe</span>
                            <span>Depth-first search of game tree</span>
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
                        <span class="bs-complexity-badge">Space: <strong>O(d)</strong></span>
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
                            'mm-maximizing': currentStep.status === 'maximizing',
                            'mm-minimizing': currentStep.status === 'minimizing',
                            'mm-terminal': currentStep.status === 'terminal',
                            'mm-success': currentStep.status === 'success',
                            'mm-start': currentStep.status === 'start' || currentStep.status === 'analyzing',
                        }"></span>
                        {{ currentStep.explanation }}
                    </div>

                    <!-- Algorithm Metrics -->
                    <h4 class="bs-inspector-label">ALGORITHM METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">Max Evaluations</span>
                            <span class="bs-metric-value">{{ metrics.maxNodes }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Min Evaluations</span>
                            <span class="bs-metric-value">{{ metrics.minNodes }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Terminal Nodes</span>
                            <span class="bs-metric-value">{{ metrics.terminals }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Current Depth</span>
                            <span class="bs-metric-value">{{ currentStep.depth || 0 }}</span>
                        </div>
                    </div>

                    <!-- Current Step -->
                    <h4 class="bs-inspector-label">CURRENT STEP</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>

                    <!-- Board State -->
                    <h4 class="bs-inspector-label">BOARD STATE</h4>
                    <div class="mm-board-mini">
                        <div v-for="(row, ri) in currentStep.board" :key="ri" class="mm-mini-row">
                            <div v-for="(cell, ci) in row" :key="ci" class="mm-mini-cell">
                                {{ cell || '·' }}
                            </div>
                        </div>
                    </div>

                    <!-- Move History -->
                    <h4 class="bs-inspector-label">EVALUATION LOG</h4>
                    <div class="mm-eval-log">
                        <div v-for="(entry, i) in evalLog" :key="i" class="mm-eval-entry"
                            :class="{ 'mm-eval-current': i === evalLog.length - 1 }">
                            <span class="mm-eval-num">#{{ i + 1 }}</span>
                            <span class="mm-eval-dot" :class="{
                                'mm-maximizing': entry.status === 'maximizing',
                                'mm-minimizing': entry.status === 'minimizing',
                                'mm-terminal': entry.status === 'terminal',
                            }"></span>
                            <span class="mm-eval-text">{{ entry.label }}</span>
                        </div>
                        <span v-if="evalLog.length === 0" class="mm-no-eval">No evaluations yet</span>
                    </div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    How MinMax Algorithm Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>
                        The MinMax algorithm is a decision-making algorithm used in two-player zero-sum games like
                        Tic-Tac-Toe, Chess, and Checkers. It explores the entire game tree to find the optimal move
                        by assuming both players play perfectly.
                    </p>

                    <h3>Key Concepts:</h3>
                    <ol>
                        <li><strong>Maximizer (X)</strong> — tries to maximize the score, choosing the move with highest value</li>
                        <li><strong>Minimizer (O)</strong> — tries to minimize the score, choosing the move with lowest value</li>
                        <li><strong>Terminal State</strong> — a game over state (win/loss/draw) that returns a score</li>
                        <li><strong>Recursive Tree</strong> — the algorithm recursively builds a game tree of all possible moves</li>
                    </ol>

                    <h3>Score System:</h3>
                    <ul>
                        <li><strong>+10 (adjusted by depth)</strong> — X wins (maximizer victory)</li>
                        <li><strong>-10 (adjusted by depth)</strong> — O wins (minimizer victory)</li>
                        <li><strong>0</strong> — Draw (no winner)</li>
                        <li>Depth adjustment ensures the algorithm prefers faster wins and slower losses</li>
                    </ul>

                    <h3>Complexity Analysis:</h3>
                    <ul>
                        <li><strong>Time Complexity:</strong> O(b<sup>d</sup>) — b = branching factor, d = depth</li>
                        <li><strong>Space Complexity:</strong> O(d) — depth of the game tree</li>
                        <li><strong>Optimal:</strong> Guaranteed to find the best move if search is complete</li>
                        <li><strong>Alpha-Beta Pruning</strong> can reduce the search space significantly</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EXAMPLES ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showExamples = !showExamples">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    Game Scenarios &amp; Examples
                </button>
                <div v-if="showExamples" class="bs-section-body">
                    <h3>Try Different Starting Positions:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card" @click="loadScenario('early')">
                            <strong>Early Game</strong>
                            <small>X at center, O at corner — deep search tree</small>
                        </div>
                        <div class="bs-edge-card" @click="loadScenario('mid')">
                            <strong>Mid Game</strong>
                            <small>3 moves played — balanced tree exploration</small>
                        </div>
                        <div class="bs-edge-card" @click="loadScenario('late')">
                            <strong>Late Game</strong>
                            <small>5 moves played — fewer branches, faster evaluation</small>
                        </div>
                        <div class="bs-edge-card" @click="loadScenario('fork')">
                            <strong>Fork Position</strong>
                            <small>X threatens two winning lines — see how MinMax finds it</small>
                        </div>
                    </div>

                    <h3>Key Insights:</h3>
                    <ul class="bs-tips">
                        <li>MinMax guarantees optimal play — a perfect player can never lose</li>
                        <li>Tic-Tac-Toe with perfect play from both sides always results in a draw</li>
                        <li>The branching factor decreases as the game progresses (fewer empty cells)</li>
                        <li>Alpha-Beta pruning is an optimization that skips unnecessary branches</li>
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
import { minimaxSteps } from '@/algorithms/aiProblems/minimaxSteps'
import { TrendingUp, TrendingDown, BarChart3, CheckCircle2, Search, Gamepad2, Play, SkipForward, RotateCcw, Shuffle, Settings2, Info, ArrowRight, ArrowLeft, X, Circle } from 'lucide-vue-next'

const router = useRouter()

// ─── State ──────────────────────────────────
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showExamples = ref(false)

const steps = ref(minimaxSteps())
const stepIndex = ref(0)
const playing = ref(false)

// ─── Computed ───────────────────────────────
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() =>
    steps.value[stepIndex.value] || {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        player: 'X',
        bestMove: null,
        score: null,
        depth: 0,
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

// ─── Algorithm Metrics ──────────────────────
const metrics = computed(() => {
    let maxNodes = 0, minNodes = 0, terminals = 0
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'maximizing') maxNodes++
        if (s.status === 'minimizing') minNodes++
        if (s.status === 'terminal') terminals++
    }
    return { maxNodes, minNodes, terminals }
})

// ─── Evaluation Log ─────────────────────────
const evalLog = computed(() => {
    const log = []
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'maximizing' || s.status === 'minimizing' || s.status === 'terminal') {
            let label = ''
            if (s.status === 'maximizing') label = `MAX @ (${s.bestMove?.row},${s.bestMove?.col})`
            else if (s.status === 'minimizing') label = `MIN @ (${s.bestMove?.row},${s.bestMove?.col})`
            else if (s.status === 'terminal') label = `Leaf: ${s.score}`
            log.push({ label, status: s.status })
        }
    }
    return log.slice(-15)
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
    steps.value = minimaxSteps()
    stepIndex.value = 0
}

function generateNew() { reset() }

function loadScenario(type) {
    pause()
    // The step generator uses a fixed scenario; simply reset
    steps.value = minimaxSteps()
    stepIndex.value = 0
}

function goToGenerateCode() {
    const prompt = `Write a program implementing the MinMax algorithm for Tic-Tac-Toe.\nThe algorithm should evaluate all possible moves recursively and find the optimal move for the current player.\nInclude the evaluation function, minimax recursion, and best move selection.`
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
.bs-page { min-height: 100vh; background: var(--bg-page); color: var(--text-secondary); padding: 16px 24px 40px; font-family: 'Inter', 'Segoe UI', sans-serif; }
.bs-container { max-width: 1440px; margin: 0 auto; }

.bs-top-bar { flex-shrink: 0; }
.back-btn-compact { display: flex; align-items: center; gap: 6px; background: var(--accent-bg); border: 1px solid var(--accent-border); color: var(--accent-lighter); padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
.back-btn-compact:hover { background: var(--accent-bg-hover); transform: translateX(-2px); }
.arrow { width: 16px; height: 16px; }
.bs-title { font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 16px 0 16px; }
.bs-lucide { display: inline-block; vertical-align: -2px; margin-right: 2px; }

/* ════════ THREE-COL ════════ */
.bs-three-col { display: grid; grid-template-columns: 240px 1fr 280px; gap: 16px; margin-bottom: 24px; }

/* ════════ CONTROLS ════════ */
.bs-controls-panel { background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.bs-btn-group { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.bs-btn { display: flex; align-items: center; gap: 6px; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-medium); background: var(--border-light); color: var(--text-tertiary); font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
.bs-btn:hover:not(:disabled) { background: var(--border-default); }
.bs-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.bs-btn.active { background: rgba(99,102,241,0.3); border-color: var(--accent-border); }
.bs-icon { font-size: 0.9rem; }
.bs-settings-toggle { width: 100%; justify-content: center; }
.bs-settings-body { display: flex; flex-direction: column; gap: 8px; padding: 8px; background: var(--bg-elevated); border-radius: 8px; }
.bs-setting-row label { font-size: 0.78rem; color: var(--text-muted); }
.bs-slider { width: 100%; cursor: pointer; accent-color: var(--accent-light); }
.bs-code-btn { width: 100%; justify-content: center; background: var(--accent-bg) !important; border-color: var(--accent-border) !important; color: var(--accent-lighter) !important; }
.bs-code-btn:hover { background: rgba(99,102,241,0.28) !important; }
.bs-info-block { font-size: 0.78rem; color: var(--text-muted); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; }
.bs-shortcuts h4 { font-size: 0.78rem; color: var(--text-muted); margin: 0 0 6px; font-weight: 600; }
.bs-shortcut-grid { display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; font-size: 0.75rem; color: var(--text-muted); }
.bs-key { background: var(--border-default); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: var(--accent-lighter); font-size: 0.72rem; text-align: center; }

/* Legend */
.bs-legend h4 { font-size: 0.82rem; color: var(--text-primary); margin: 0 0 8px; }
.bs-legend-item { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 8px; font-size: 0.78rem; color: var(--text-tertiary); }
.bs-legend-item small { color: var(--text-dim); }
.bs-dot { width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0; margin-top: 2px; }
.bs-dot.mm-start { background: #3b82f6; }
.bs-dot.mm-maximizing { background: #22c55e; }
.bs-dot.mm-minimizing { background: #ef4444; }
.bs-dot.mm-terminal { background: #eab308; }
.bs-dot.mm-success { background: #8b5cf6; }

/* ════════ CHART AREA ════════ */
.bs-chart-area { display: flex; flex-direction: column; gap: 10px; }
.bs-chart-wrapper { background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 12px; padding: 16px 16px 8px; display: flex; flex-direction: column; }
.bs-chart-footer { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-dim); padding: 6px 0 4px; }
.bs-scrubber { width: 100%; accent-color: var(--accent-light); cursor: pointer; margin-top: 4px; }
.bs-status-bar { background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 10px; padding: 12px 20px; text-align: center; font-size: 0.9rem; color: var(--text-secondary); font-weight: 500; }
.bs-complexity-row { display: flex; justify-content: center; gap: 32px; }
.bs-complexity-badge { font-size: 0.82rem; color: var(--text-muted); }
.bs-complexity-badge strong { color: var(--accent-lighter); }

/* ════════ TIC-TAC-TOE BOARD ════════ */
.mm-board-container { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 10px; min-height: 340px; }

.mm-board { display: grid; grid-template-rows: repeat(3, 1fr); gap: 4px; background: var(--border-medium); padding: 4px; border-radius: 12px; }

.mm-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }

.mm-cell { width: 90px; height: 90px; background: var(--bg-code); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; position: relative; }

.mm-cell-highlight { box-shadow: 0 0 16px rgba(99,102,241,0.5); border: 2px solid #818cf8; }

.mm-cell-x { background: rgba(34,197,94,0.08); }
.mm-cell-o { background: rgba(239,68,68,0.08); }

.mm-mark { font-size: 2.4rem; font-weight: 700; line-height: 1; }
.mm-x { color: #22c55e; text-shadow: 0 0 12px rgba(34,197,94,0.4); }
.mm-o { color: #ef4444; text-shadow: 0 0 12px rgba(239,68,68,0.4); }

/* Info Panel */
.mm-info-panel { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; }

.mm-info-badge { padding: 8px 18px; border-radius: 10px; font-size: 0.82rem; font-weight: 600; text-align: center; }
.mm-badge-max { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: var(--success-text); }
.mm-badge-min { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: var(--error-text); }
.mm-badge-done { background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3); color: var(--accent-light); }

.mm-depth-badge { padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; background: var(--accent-bg); border: 1px solid var(--accent-border); color: var(--accent-lighter); }

.mm-score-badge { padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.3); color: #fde68a; }

/* ════════ INSPECTOR ════════ */
.bs-inspector { background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 12px; padding: 14px; overflow-y: auto; max-height: 600px; }
.bs-inspector::-webkit-scrollbar { width: 4px; }
.bs-inspector::-webkit-scrollbar-thumb { background: var(--border-medium); border-radius: 2px; }
.bs-inspector-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.bs-inspector-header h3 { margin: 0; font-size: 1rem; color: var(--text-primary); }
.bs-step-badge { background: rgba(99,102,241,0.2); border: 1px solid var(--accent-border); padding: 3px 10px; border-radius: 12px; font-size: 0.72rem; color: var(--accent-lighter); font-weight: 600; }
.bs-inspector-row { display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 4px; }
.bs-progress-track { width: 100%; height: 6px; background: var(--border-light); border-radius: 3px; margin-bottom: 16px; overflow: hidden; }
.bs-progress-fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.25s; }
.bs-inspector-label { font-size: 0.7rem; letter-spacing: 0.06em; color: var(--text-dim); margin: 14px 0 6px; font-weight: 700; }
.bs-op-item { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: var(--text-tertiary); margin-bottom: 4px; }
.bs-op-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.bs-op-dot.mm-maximizing { background: #22c55e; }
.bs-op-dot.mm-minimizing { background: #ef4444; }
.bs-op-dot.mm-terminal { background: #eab308; }
.bs-op-dot.mm-success { background: #8b5cf6; }
.bs-op-dot.mm-start { background: #3b82f6; }
.bs-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bs-metric { display: flex; flex-direction: column; }
.bs-metric-label { font-size: 0.7rem; color: var(--text-dim); }
.bs-metric-value { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); }
.bs-step-detail { background: var(--bg-elevated); padding: 8px 10px; border-radius: 6px; font-size: 0.78rem; color: var(--text-tertiary); font-family: 'Fira Code', monospace; }

/* Mini Board */
.mm-board-mini { background: var(--bg-elevated); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.mm-mini-row { display: flex; gap: 2px; }
.mm-mini-cell { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; font-family: 'Fira Code', monospace; color: var(--text-muted); background: var(--border-light); border-radius: 4px; }

/* Eval Log */
.mm-eval-log { background: var(--bg-elevated); padding: 8px 10px; border-radius: 6px; max-height: 140px; overflow-y: auto; }
.mm-eval-log::-webkit-scrollbar { width: 3px; }
.mm-eval-log::-webkit-scrollbar-thumb { background: var(--border-medium); border-radius: 2px; }
.mm-eval-entry { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: var(--text-muted); padding: 2px 0; }
.mm-eval-current { color: var(--accent-lighter); font-weight: 600; }
.mm-eval-num { font-weight: 700; color: var(--text-dim); font-family: 'Fira Code', monospace; min-width: 24px; }
.mm-eval-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.mm-eval-dot.mm-maximizing { background: #22c55e; }
.mm-eval-dot.mm-minimizing { background: #ef4444; }
.mm-eval-dot.mm-terminal { background: #eab308; }
.mm-eval-text { flex: 1; }
.mm-no-eval { font-size: 0.72rem; color: var(--text-faint); font-style: italic; }

/* ════════ SECTIONS ════════ */
.bs-section { background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 12px; margin-bottom: 12px; overflow: hidden; }
.bs-section-toggle { width: 100%; display: flex; align-items: center; gap: 10px; padding: 14px 18px; background: none; border: none; color: var(--text-secondary); font-size: 1rem; font-weight: 600; cursor: pointer; text-align: left; transition: background 0.15s; }
.bs-section-toggle:hover { background: rgba(100,116,139,0.1); }
.bs-info-circle { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(99,102,241,0.2); border: 1px solid var(--accent-border); color: var(--accent-lighter); font-size: 0.82rem; font-weight: 700; flex-shrink: 0; }
.bs-section-body { padding: 0 20px 20px; color: var(--text-tertiary); font-size: 0.88rem; line-height: 1.7; }
.bs-section-body h2 { font-size: 1.15rem; color: var(--text-primary); margin: 0 0 8px; }
.bs-section-body h3 { font-size: 0.95rem; color: var(--accent-lighter); margin: 16px 0 6px; }
.bs-section-body ol, .bs-section-body ul { padding-left: 20px; margin: 4px 0; }
.bs-section-body li { margin-bottom: 3px; }
.bs-edge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
.bs-edge-card { background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: 10px; padding: 14px; cursor: pointer; transition: all 0.15s; }
.bs-edge-card:hover { border-color: var(--accent-border); background: var(--bg-hover); }
.bs-edge-card strong { display: block; color: var(--text-primary); font-size: 0.88rem; margin-bottom: 4px; }
.bs-edge-card small { color: var(--text-dim); font-size: 0.78rem; }
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
    .mm-cell { width: 70px; height: 70px; }
    .mm-mark { font-size: 1.8rem; }
}
</style>
