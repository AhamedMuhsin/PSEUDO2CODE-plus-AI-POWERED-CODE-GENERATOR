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
            <h1 class="bs-title">N-Queens Problem</h1>

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
                        <button class="bs-btn" @click="generateRandom">
                            <span class="bs-icon"><Shuffle :size="14" /></span> New Board
                        </button>
                    </div>

                    <!-- Settings toggle -->
                    <button class="bs-btn bs-settings-toggle" @click="showSettings = !showSettings">
                        <span class="bs-icon"><Settings2 :size="14" /></span> Settings
                    </button>

                    <div v-if="showSettings" class="bs-settings-body">
                        <div class="bs-setting-row">
                            <label>Board Size (N): <strong>{{ boardSize }}</strong></label>
                            <input type="range" min="4" max="10" v-model.number="boardSize" class="bs-slider" />
                        </div>
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
                        <p><strong>Board:</strong> {{ boardSize }}×{{ boardSize }}</p>
                        <p><strong>Speed:</strong> {{ speedPercent }}%</p>
                    </div>

                    <!-- Keyboard shortcuts -->
                    <div class="bs-shortcuts">
                        <h4>Keyboard Shortcuts:</h4>
                        <div class="bs-shortcut-grid">
                            <span class="bs-key">Space</span><span>Play/Pause</span>
                            <span class="bs-key"><ArrowRight :size="14" /></span><span>Step Forward</span>
                            <span class="bs-key"><ArrowLeft :size="14" /></span><span>Step Back</span>
                            <span class="bs-key">R</span><span>Reset</span>
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="bs-legend">
                        <h4>Legend</h4>
                        <div class="bs-legend-item">
                            <span class="bs-dot nq-checking"></span>
                            <div><strong>Checking</strong><br /><small>Trying to place queen</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot nq-placed"></span>
                            <div><strong>Placed</strong><br /><small>Queen safely placed</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot nq-conflict"></span>
                            <div><strong>Conflict</strong><br /><small>Position not safe</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot nq-backtrack"></span>
                            <div><strong>Backtrack</strong><br /><small>Removing queen</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot nq-success"></span>
                            <div><strong>Solution</strong><br /><small>All queens placed!</small></div>
                        </div>

                        <div class="bs-legend-note">
                            <h5>How to read the visualization:</h5>
                            <ul>
                                <li>Crown icons represent queens</li>
                                <li>Highlighted cell shows current attempt</li>
                                <li>Colors indicate action being taken</li>
                                <li>Watch backtracking in real-time</li>
                            </ul>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: CHESSBOARD -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <!-- Chessboard Grid -->
                        <div class="nq-board" :style="{ '--n': boardSize }">
                            <template v-for="row in boardSize" :key="'r' + row">
                                <div v-for="col in boardSize" :key="'c' + row + '-' + col"
                                    class="nq-cell"
                                    :class="{
                                        'nq-cell-light': (row + col) % 2 === 0,
                                        'nq-cell-dark': (row + col) % 2 !== 0,
                                        'nq-cell-checking': currentStep.attemptRow === (row - 1) && currentStep.attemptCol === (col - 1) && currentStep.status === 'checking',
                                        'nq-cell-placed': currentStep.attemptRow === (row - 1) && currentStep.attemptCol === (col - 1) && currentStep.status === 'placed',
                                        'nq-cell-conflict': currentStep.attemptRow === (row - 1) && currentStep.attemptCol === (col - 1) && currentStep.status === 'conflict',
                                        'nq-cell-backtrack': currentStep.attemptRow === (row - 1) && currentStep.attemptCol === (col - 1) && currentStep.status === 'backtrack',
                                        'nq-cell-success': currentStep.status === 'success' && hasQueen(row - 1, col - 1),
                                        'nq-cell-attack': isAttacked(row - 1, col - 1) && currentStep.attemptRow === (row - 1) && currentStep.status === 'conflict',
                                    }">
                                    <span v-if="hasQueen(row - 1, col - 1)" class="nq-queen"
                                        :class="{ 'nq-queen-success': currentStep.status === 'success' }"><Crown :size="18" /></span>
                                    <span v-else-if="currentStep.attemptRow === (row - 1) && currentStep.attemptCol === (col - 1) && (currentStep.status === 'checking' || currentStep.status === 'conflict')"
                                        class="nq-queen nq-queen-attempt"><Crown :size="18" /></span>
                                    <span v-else class="nq-coord">{{ row - 1 }},{{ col - 1 }}</span>
                                </div>
                            </template>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>N-Queens Board – {{ boardSize }}×{{ boardSize }}</span>
                            <span>Queens placed: {{ currentStep.queens ? currentStep.queens.length : 0 }}/{{ boardSize }}</span>
                        </div>

                        <!-- Scrubber -->
                        <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1"
                            v-model.number="stepIndex" />
                    </div>

                    <!-- Status bar -->
                    <div class="bs-status-bar">{{ currentStep.explanation }}</div>

                    <!-- Complexity badges -->
                    <div class="bs-complexity-row">
                        <span class="bs-complexity-badge">Time Complexity: <strong>O(N!)</strong></span>
                        <span class="bs-complexity-badge">Space Complexity: <strong>O(N²)</strong></span>
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
                    <h4 class="bs-inspector-label">CURRENT OPERATION</h4>
                    <div class="bs-op-item">
                        <span class="bs-op-dot" :class="{
                            'nq-checking': currentStep.status === 'checking',
                            'nq-placed': currentStep.status === 'placed',
                            'nq-conflict': currentStep.status === 'conflict',
                            'nq-backtrack': currentStep.status === 'backtrack',
                            'nq-success': currentStep.status === 'success',
                        }"></span>
                        {{ currentStep.explanation }}
                    </div>

                    <!-- Algorithm Metrics -->
                    <h4 class="bs-inspector-label">ALGORITHM METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">Queens Placed</span>
                            <span class="bs-metric-value">{{ currentStep.queens ? currentStep.queens.length : 0 }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Backtracks</span>
                            <span class="bs-metric-value">{{ metrics.backtracks }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Checks</span>
                            <span class="bs-metric-value">{{ metrics.checks }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Conflicts</span>
                            <span class="bs-metric-value">{{ metrics.conflicts }}</span>
                        </div>
                    </div>

                    <!-- Current Step -->
                    <h4 class="bs-inspector-label">CURRENT STEP</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>

                    <!-- Queens Positions -->
                    <h4 class="bs-inspector-label">QUEENS POSITIONS</h4>
                    <div class="bs-array-state">
                        <template v-if="currentStep.queens && currentStep.queens.length > 0">
                            <span v-for="(q, i) in currentStep.queens" :key="i" class="nq-queen-pos">
                                ({{ q.row }}, {{ q.col }})<span v-if="i < currentStep.queens.length - 1">, </span>
                            </span>
                        </template>
                        <span v-else class="nq-no-queens">No queens placed yet</span>
                    </div>
                    <div class="bs-array-length">{{ currentStep.queens ? currentStep.queens.length : 0 }} of {{ boardSize }} queens placed</div>

                    <!-- Board State -->
                    <h4 class="bs-inspector-label">BOARD STATE</h4>
                    <div class="nq-board-state">
                        <div v-for="(row, ri) in (currentStep.board || [])" :key="ri" class="nq-board-row">
                            <span v-for="(cell, ci) in row" :key="ci" class="nq-board-cell"
                                :class="{ 'nq-board-queen': cell === 1 }">
                                <template v-if="cell === 1"><Crown :size="12" /></template>
                                <template v-else>·</template>
                            </span>
                        </div>
                    </div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle"><Info :size="16" /></span>
                    How N-Queens Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>
                        The N-Queens problem is a classic backtracking puzzle. The goal is to place N queens on an
                        N×N chessboard such that no two queens threaten each other — meaning no two queens share the
                        same row, column, or diagonal.
                    </p>

                    <h3>How the Backtracking Algorithm Works:</h3>
                    <ol>
                        <li>Start with the first column</li>
                        <li>Try placing a queen in each row of the current column</li>
                        <li>Check if the position is safe (no conflicts with existing queens)</li>
                        <li>If safe, place the queen and move to the next column</li>
                        <li>If no safe position exists, backtrack to the previous column</li>
                        <li>Continue until all N queens are placed or all possibilities are exhausted</li>
                    </ol>

                    <h3>Safety Check:</h3>
                    <p>
                        A position is safe if no other queen exists in the same row, same column,
                        or along any diagonal. Since we place one queen per column, we only need to
                        check the row and both diagonals against previously placed queens.
                    </p>

                    <h3>Complexity Analysis:</h3>
                    <ul>
                        <li><strong>Time Complexity:</strong> O(N!) — each column has fewer safe rows available</li>
                        <li><strong>Space Complexity:</strong> O(N²) — for the board representation</li>
                        <li><strong>Solutions:</strong> For N=4 there are 2 solutions, for N=8 there are 92</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EDGE CASES & EXAMPLES ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showEdgeCases = !showEdgeCases">
                    <span class="bs-info-circle"><Info :size="16" /></span>
                    Board Sizes &amp; Facts
                </button>
                <div v-if="showEdgeCases" class="bs-section-body">
                    <h3>Try Different Board Sizes:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card" @click="loadBoardSize(4)">
                            <strong>4×4 Board</strong>
                            <small>Smallest solvable — 2 solutions, great for learning</small>
                        </div>
                        <div class="bs-edge-card" @click="loadBoardSize(5)">
                            <strong>5×5 Board</strong>
                            <small>10 solutions — more backtracking to observe</small>
                        </div>
                        <div class="bs-edge-card" @click="loadBoardSize(6)">
                            <strong>6×6 Board</strong>
                            <small>4 solutions — interesting constraint patterns</small>
                        </div>
                        <div class="bs-edge-card" @click="loadBoardSize(8)">
                            <strong>8×8 Board (Classic)</strong>
                            <small>92 solutions — the original chess problem</small>
                        </div>
                    </div>

                    <h3>Interesting Facts:</h3>
                    <ul class="bs-tips">
                        <li>There is no solution for N=2 and N=3</li>
                        <li>The 8-Queens problem was first posed in 1848</li>
                        <li>N-Queens is a classic example of constraint satisfaction problems</li>
                        <li>Backtracking prunes the search space dramatically compared to brute force</li>
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
import { Crown, Play, SkipForward, RotateCcw, Shuffle, Settings2, Info, ArrowRight, ArrowLeft } from 'lucide-vue-next'
import { nQueensSteps } from '@/algorithms/aiProblems/nQueensSteps'

const router = useRouter()

// ─── State ──────────────────────────────────
const boardSize = ref(4)
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)

const steps = ref(nQueensSteps(boardSize.value))
const stepIndex = ref(0)
const playing = ref(false)

// ─── Computed ───────────────────────────────
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() =>
    steps.value[stepIndex.value] || {
        board: [],
        queens: [],
        attemptRow: null,
        attemptCol: null,
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
    let checks = 0, conflicts = 0, backtracks = 0
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'checking') checks++
        if (s.status === 'conflict') conflicts++
        if (s.status === 'backtrack') backtracks++
    }
    return { checks, conflicts, backtracks }
})

// ─── Speed ──────────────────────────────────
const speedDelay = computed(() => {
    const map = { 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }
    return map[speedLevel.value]
})

// ─── Helpers ────────────────────────────────
function hasQueen(row, col) {
    const queens = currentStep.value.queens
    if (!queens) return false
    return queens.some(q => q.row === row && q.col === col)
}

function isAttacked(row, col) {
    const queens = currentStep.value.queens
    if (!queens) return false
    return queens.some(q =>
        q.row === row || q.col === col ||
        Math.abs(q.row - row) === Math.abs(q.col - col)
    )
}

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
    steps.value = nQueensSteps(boardSize.value)
    stepIndex.value = 0
}

function generateRandom() { reset() }

function loadBoardSize(n) {
    pause()
    boardSize.value = n
    steps.value = nQueensSteps(n)
    stepIndex.value = 0
}

function goToGenerateCode() {
    const prompt = `Write a program for the N-Queens Problem using backtracking.\nPlace ${boardSize.value} queens on a ${boardSize.value}×${boardSize.value} chessboard so no two queens attack each other.`
    router.push({ path: '/generate-code', query: { prompt } })
}

// ─── Watchers ───────────────────────────────
watch(speedLevel, () => {
    if (playing.value) { pause(); play() }
})

watch(boardSize, (newSize) => {
    pause()
    steps.value = nQueensSteps(newSize)
    stepIndex.value = 0
})

// ─── Keyboard Shortcuts ─────────────────────
function handleKey(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
    switch (e.code) {
        case 'Space':
            e.preventDefault()
            playing.value ? pause() : play()
            break
        case 'ArrowRight':
            next()
            break
        case 'ArrowLeft':
            prev()
            break
        case 'KeyR':
            reset()
            break
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
.bs-page {
    min-height: 100vh;
    background: var(--bg-page);
    color: var(--text-secondary);
    padding: 16px 24px 40px;
    font-family: 'Inter', 'Segoe UI', sans-serif;
}

.bs-container {
    max-width: 1440px;
    margin: 0 auto;
}

/* ════════ BACK ════════ */
.bs-top-bar {
    flex-shrink: 0;
}

.back-btn-compact {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent-lighter);
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
}
.back-btn-compact:hover {
    background: var(--accent-bg-hover);
    transform: translateX(-2px);
}
.arrow {
    width: 16px;
    height: 16px;
}

.bs-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 16px 0 16px;
}

.bs-lucide {
    display: inline-block;
    vertical-align: -2px;
    margin-right: 2px;
}

/* ════════ THREE-COL ════════ */
.bs-three-col {
    display: grid;
    grid-template-columns: 240px 1fr 280px;
    gap: 16px;
    margin-bottom: 24px;
}

/* ════════ CONTROLS PANEL ════════ */
.bs-controls-panel {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.bs-btn-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
}

.bs-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--border-medium);
    background: var(--border-light);
    color: var(--text-tertiary);
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
}
.bs-btn:hover:not(:disabled) {
    background: var(--border-default);
}
.bs-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.bs-btn.active { background: rgba(99, 102, 241, 0.3); border-color: var(--accent-border); }
.bs-icon { font-size: 0.9rem; }

.bs-settings-toggle { width: 100%; justify-content: center; }

.bs-settings-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    background: var(--bg-elevated);
    border-radius: 8px;
}

.bs-setting-row label {
    font-size: 0.78rem;
    color: var(--text-muted);
}

.bs-slider {
    width: 100%;
    cursor: pointer;
    accent-color: var(--accent-light);
}

.bs-code-btn {
    width: 100%;
    justify-content: center;
    background: var(--accent-bg) !important;
    border-color: var(--accent-border) !important;
    color: var(--accent-lighter) !important;
}
.bs-code-btn:hover {
    background: rgba(99, 102, 241, 0.28) !important;
}

.bs-info-block {
    font-size: 0.78rem;
    color: var(--text-muted);
    display: flex;
    justify-content: space-between;
}

/* Shortcuts */
.bs-shortcuts h4 {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin: 0 0 6px;
    font-weight: 600;
}
.bs-shortcut-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 8px;
    font-size: 0.75rem;
    color: var(--text-muted);
}
.bs-key {
    background: var(--border-default);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    color: var(--accent-lighter);
    font-size: 0.72rem;
    text-align: center;
}

/* Legend */
.bs-legend h4 {
    font-size: 0.82rem;
    color: var(--text-primary);
    margin: 0 0 8px;
}
.bs-legend-item {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 8px;
    font-size: 0.78rem;
    color: var(--text-tertiary);
}
.bs-legend-item small { color: var(--text-dim); }
.bs-dot {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    flex-shrink: 0;
    margin-top: 2px;
}
.bs-dot.nq-checking  { background: #eab308; }
.bs-dot.nq-placed    { background: #22c55e; }
.bs-dot.nq-conflict  { background: #ef4444; }
.bs-dot.nq-backtrack { background: #f97316; }
.bs-dot.nq-success   { background-color: var(--accent); }

.bs-legend-note {
    margin-top: 8px;
    font-size: 0.72rem;
    color: var(--text-dim);
}
.bs-legend-note h5 {
    margin: 0 0 4px;
    font-weight: 600;
    color: var(--text-muted);
    font-size: 0.72rem;
}
.bs-legend-note ul {
    margin: 0;
    padding-left: 14px;
}
.bs-legend-note li { margin-bottom: 2px; }

/* ════════ CHART AREA ════════ */
.bs-chart-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.bs-chart-wrapper {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 16px 16px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* ═══ CHESSBOARD ═══ */
.nq-board {
    display: grid;
    grid-template-columns: repeat(var(--n), 1fr);
    grid-template-rows: repeat(var(--n), 1fr);
    width: min(100%, 440px);
    aspect-ratio: 1;
    border: 2px solid var(--border-strong);
    border-radius: 6px;
    overflow: hidden;
}

.nq-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: background 0.2s;
}

.nq-cell-light { background: #cbd5e1; }
.nq-cell-dark  { background: #64748b; }

/* Highlight states */
.nq-cell-checking {
    background: rgba(234, 179, 8, 0.5) !important;
    box-shadow: inset 0 0 12px rgba(234, 179, 8, 0.4);
}
.nq-cell-placed {
    background: rgba(34, 197, 94, 0.45) !important;
    box-shadow: inset 0 0 12px rgba(34, 197, 94, 0.4);
}
.nq-cell-conflict {
    background: rgba(239, 68, 68, 0.5) !important;
    box-shadow: inset 0 0 12px rgba(239, 68, 68, 0.4);
}
.nq-cell-backtrack {
    background: rgba(249, 115, 22, 0.45) !important;
    box-shadow: inset 0 0 12px rgba(249, 115, 22, 0.4);
}
.nq-cell-success {
    background: rgba(99, 102, 241, 0.4) !important;
    box-shadow: inset 0 0 14px rgba(99, 102, 241, 0.4);
}

.nq-queen {
    font-size: clamp(16px, calc(280px / var(--n)), 40px);
    color: var(--text-primary);
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    z-index: 1;
    line-height: 1;
}
.nq-queen-success {
    color: var(--accent-lighter);
    text-shadow: 0 0 8px rgba(99, 102, 241, 0.6);
}
.nq-queen-attempt {
    opacity: 0.5;
    animation: nq-pulse 0.6s ease-in-out infinite;
}
@keyframes nq-pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.9); }
    50%      { opacity: 0.7; transform: scale(1.05); }
}

.nq-coord {
    font-size: clamp(7px, calc(140px / var(--n)), 11px);
    color: rgba(18, 18, 18, 0.35);
    font-family: 'Fira Code', monospace;
}

.bs-chart-footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    color: var(--text-dim);
    padding: 6px 0 4px;
    width: 100%;
}

.bs-scrubber {
    width: 100%;
    accent-color: var(--accent-light);
    cursor: pointer;
    margin-top: 4px;
}

/* Status bar */
.bs-status-bar {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 12px 20px;
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.bs-complexity-row {
    display: flex;
    justify-content: center;
    gap: 32px;
}
.bs-complexity-badge {
    font-size: 0.82rem;
    color: var(--text-muted);
}
.bs-complexity-badge strong { color: var(--accent-lighter); }

/* ════════ INSPECTOR ════════ */
.bs-inspector {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 14px;
}

.bs-inspector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}
.bs-inspector-header h3 {
    margin: 0;
    font-size: 1rem;
    color: var(--text-primary);
}
.bs-step-badge {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid var(--accent-border);
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.72rem;
    color: var(--accent-lighter);
    font-weight: 600;
}

.bs-inspector-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-bottom: 4px;
}

.bs-progress-track {
    width: 100%;
    height: 6px;
    background: var(--border-light);
    border-radius: 3px;
    margin-bottom: 16px;
    overflow: hidden;
}
.bs-progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 3px;
    transition: width 0.25s;
}

.bs-inspector-label {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: var(--text-dim);
    margin: 14px 0 6px;
    font-weight: 700;
}

.bs-op-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    color: var(--text-tertiary);
    margin-bottom: 4px;
}
.bs-op-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}
.bs-op-dot.nq-checking  { background: #eab308; }
.bs-op-dot.nq-placed    { background: #22c55e; }
.bs-op-dot.nq-conflict  { background: #ef4444; }
.bs-op-dot.nq-backtrack { background: #f97316; }
.bs-op-dot.nq-success   { background-color: var(--accent); }

.bs-metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}
.bs-metric {
    display: flex;
    flex-direction: column;
}
.bs-metric-label {
    font-size: 0.7rem;
    color: var(--text-dim);
}
.bs-metric-value {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-primary);
}

.bs-step-detail {
    background: var(--bg-elevated);
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    color: var(--text-tertiary);
    font-family: 'Fira Code', monospace;
}

.bs-array-state {
    background: var(--bg-elevated);
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 0.72rem;
    color: var(--text-tertiary);
    font-family: 'Fira Code', monospace;
    word-break: break-all;
    line-height: 1.5;
}
.bs-array-length {
    font-size: 0.7rem;
    color: var(--text-dim);
    margin-top: 4px;
}

.nq-queen-pos {
    color: var(--accent-lighter);
}
.nq-no-queens {
    color: var(--text-dim);
    font-style: italic;
}

/* Board state mini-display */
.nq-board-state {
    background: var(--bg-elevated);
    padding: 8px 10px;
    border-radius: 6px;
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
    line-height: 1.6;
}
.nq-board-row {
    display: flex;
    gap: 6px;
    justify-content: center;
}
.nq-board-cell {
    width: 16px;
    text-align: center;
    color: var(--text-dim);
}
.nq-board-queen {
    color: var(--accent-lighter);
    font-weight: 700;
}

/* ════════ COLLAPSIBLE SECTIONS ════════ */
.bs-section {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    margin-bottom: 12px;
    overflow: hidden;
}

.bs-section-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s;
}
.bs-section-toggle:hover { background: rgba(100, 116, 139, 0.1); }
.bs-info-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid var(--accent-border);
    color: var(--accent-lighter);
    font-size: 0.82rem;
    font-weight: 700;
    flex-shrink: 0;
}

.bs-section-body {
    padding: 0 20px 20px;
    color: var(--text-tertiary);
    font-size: 0.88rem;
    line-height: 1.7;
}
.bs-section-body h2 {
    font-size: 1.15rem;
    color: var(--text-primary);
    margin: 0 0 8px;
}
.bs-section-body h3 {
    font-size: 0.95rem;
    color: var(--accent-lighter);
    margin: 16px 0 6px;
}
.bs-section-body ol,
.bs-section-body ul {
    padding-left: 20px;
    margin: 4px 0;
}
.bs-section-body li { margin-bottom: 3px; }

/* Edge case cards */
.bs-edge-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 8px;
}
.bs-edge-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.15s;
}
.bs-edge-card:hover {
    border-color: var(--accent-border);
    background: var(--bg-hover);
}
.bs-edge-card strong {
    display: block;
    color: var(--text-primary);
    font-size: 0.88rem;
    margin-bottom: 4px;
}
.bs-edge-card small {
    color: var(--text-dim);
    font-size: 0.78rem;
}

.bs-tips {
    padding-left: 20px;
}
.bs-tips li {
    margin-bottom: 4px;
}

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
}
</style>
