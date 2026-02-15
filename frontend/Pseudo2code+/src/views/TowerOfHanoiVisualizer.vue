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
            <h1 class="bs-title">Tower of Hanoi</h1>

            <!-- ═══════ THREE-COLUMN VISUALIZER ═══════ -->
            <div class="bs-three-col">
                <!-- LEFT PANEL: Controls -->
                <aside class="bs-controls-panel">
                    <!-- Playback -->
                    <div class="bs-btn-group">
                        <button class="bs-btn" :class="{ active: playing }" @click="playing ? pause() : play()">
                            <span class="bs-icon">▶</span> {{ playing ? 'Pause' : 'Play' }}
                        </button>
                        <button class="bs-btn" @click="next" :disabled="stepIndex === steps.length - 1">
                            <span class="bs-icon">⏭</span> Step
                        </button>
                    </div>
                    <div class="bs-btn-group">
                        <button class="bs-btn" @click="reset">
                            <span class="bs-icon">↺</span> Reset
                        </button>
                        <button class="bs-btn" @click="generateRandom">
                            <span class="bs-icon">⤮</span> New Puzzle
                        </button>
                    </div>

                    <!-- Settings toggle -->
                    <button class="bs-btn bs-settings-toggle" @click="showSettings = !showSettings">
                        <span class="bs-icon">⚙</span> Settings
                    </button>

                    <div v-if="showSettings" class="bs-settings-body">
                        <div class="bs-setting-row">
                            <label>Number of Disks: <strong>{{ numDisks }}</strong></label>
                            <input type="range" min="2" max="8" v-model.number="numDisks" class="bs-slider" />
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
                        <p><strong>Disks:</strong> {{ numDisks }}</p>
                        <p><strong>Speed:</strong> {{ speedPercent }}%</p>
                    </div>

                    <!-- Keyboard shortcuts -->
                    <div class="bs-shortcuts">
                        <h4>Keyboard Shortcuts:</h4>
                        <div class="bs-shortcut-grid">
                            <span class="bs-key">Space</span><span>Play/Pause</span>
                            <span class="bs-key">→</span><span>Step Forward</span>
                            <span class="bs-key">←</span><span>Step Back</span>
                            <span class="bs-key">R</span><span>Reset</span>
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="bs-legend">
                        <h4>Legend</h4>
                        <div class="bs-legend-item">
                            <span class="bs-dot th-moving"></span>
                            <div><strong>Moving</strong><br /><small>Disk being transferred</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot th-source"></span>
                            <div><strong>Source Rod</strong><br /><small>Where disk comes from</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot th-dest"></span>
                            <div><strong>Destination Rod</strong><br /><small>Where disk goes to</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot th-recursive"></span>
                            <div><strong>Recursive Call</strong><br /><small>Breaking down sub-problem</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot th-success"></span>
                            <div><strong>Complete</strong><br /><small>Puzzle solved!</small></div>
                        </div>

                        <div class="bs-legend-note">
                            <h5>How to read the visualization:</h5>
                            <ul>
                                <li>Wider disks are heavier (larger number)</li>
                                <li>Disks can only be placed on larger disks</li>
                                <li>Watch the recursive decomposition</li>
                                <li>Minimum moves = 2ⁿ - 1</li>
                            </ul>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: TOWER VISUALIZATION -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <!-- Tower Display -->
                        <div class="th-towers-container">
                            <div v-for="rod in ['A', 'B', 'C']" :key="rod" class="th-rod-wrapper"
                                :class="{
                                    'th-rod-source': currentStep.moveFrom === rod && currentStep.status === 'moving',
                                    'th-rod-dest': currentStep.moveTo === rod && currentStep.status === 'moving',
                                }">
                                <div class="th-rod-label">{{ rodLabels[rod] }}</div>
                                <div class="th-peg-area">
                                    <!-- The peg/pole -->
                                    <div class="th-peg"></div>
                                    <!-- Base platform -->
                                    <div class="th-base"></div>
                                    <!-- Disks -->
                                    <div class="th-disks-stack">
                                        <div v-for="(disk, di) in (currentStep.towers ? currentStep.towers[rod] : [])"
                                            :key="di"
                                            class="th-disk"
                                            :class="{
                                                'th-disk-moving': currentStep.status === 'moving' && currentStep.disk === disk && currentStep.moveTo === rod,
                                                'th-disk-source': currentStep.status === 'moving' && currentStep.moveFrom === rod && di === (currentStep.towers[rod].length - 1) && currentStep.disk !== disk,
                                            }"
                                            :style="{
                                                width: diskWidth(disk) + '%',
                                                backgroundColor: diskColor(disk),
                                            }">
                                            <span class="th-disk-label">{{ disk }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="th-rod-name">Rod {{ rod }}</div>
                            </div>
                        </div>

                        <!-- Move indicator -->
                        <div v-if="currentStep.status === 'moving'" class="th-move-indicator">
                            <span class="th-move-arrow">{{ currentStep.moveFrom }}</span>
                            <span class="th-move-arrow-icon">→</span>
                            <span class="th-move-arrow">{{ currentStep.moveTo }}</span>
                            <span class="th-move-disk-badge">Disk {{ currentStep.disk }}</span>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>Tower of Hanoi – {{ numDisks }} disks</span>
                            <span>Moves: {{ currentStep.moveCount || 0 }}/{{ minMoves }}</span>
                        </div>

                        <!-- Scrubber -->
                        <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1"
                            v-model.number="stepIndex" />
                    </div>

                    <!-- Status bar -->
                    <div class="bs-status-bar">{{ currentStep.explanation }}</div>

                    <!-- Complexity badges -->
                    <div class="bs-complexity-row">
                        <span class="bs-complexity-badge">Time Complexity: <strong>O(2ⁿ)</strong></span>
                        <span class="bs-complexity-badge">Space Complexity: <strong>O(N)</strong></span>
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
                            'th-moving': currentStep.status === 'moving',
                            'th-recursive': currentStep.status === 'recursive',
                            'th-success': currentStep.status === 'success',
                            'th-source': currentStep.status === 'base_case',
                            'th-dest': currentStep.status === 'start',
                        }"></span>
                        {{ currentStep.explanation }}
                    </div>

                    <!-- Algorithm Metrics -->
                    <h4 class="bs-inspector-label">ALGORITHM METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">Moves Made</span>
                            <span class="bs-metric-value">{{ currentStep.moveCount || 0 }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Min Moves</span>
                            <span class="bs-metric-value">{{ minMoves }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Recursive Calls</span>
                            <span class="bs-metric-value">{{ metrics.recursiveCalls }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Efficiency</span>
                            <span class="bs-metric-value">{{ metrics.efficiency }}%</span>
                        </div>
                    </div>

                    <!-- Current Step -->
                    <h4 class="bs-inspector-label">CURRENT STEP</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>

                    <!-- Rod States -->
                    <h4 class="bs-inspector-label">ROD STATES</h4>
                    <div class="th-rod-states">
                        <div v-for="rod in ['A', 'B', 'C']" :key="rod" class="th-rod-state-row">
                            <span class="th-rod-state-label">{{ rodLabels[rod] }}:</span>
                            <span class="th-rod-state-disks">
                                <template v-if="currentStep.towers && currentStep.towers[rod].length > 0">
                                    [{{ currentStep.towers[rod].join(', ') }}]
                                </template>
                                <template v-else>
                                    [ empty ]
                                </template>
                            </span>
                        </div>
                    </div>

                    <!-- Move History -->
                    <h4 class="bs-inspector-label">MOVE HISTORY</h4>
                    <div class="th-move-history">
                        <div v-for="(move, i) in moveHistory" :key="i" class="th-move-entry"
                            :class="{ 'th-move-current': i === moveHistory.length - 1 }">
                            <span class="th-move-num">#{{ i + 1 }}</span>
                            <span>Disk {{ move.disk }}: {{ move.from }} → {{ move.to }}</span>
                        </div>
                        <span v-if="moveHistory.length === 0" class="th-no-moves">No moves yet</span>
                    </div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle">ⓘ</span>
                    How Tower of Hanoi Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>
                        The Tower of Hanoi is a classic recursive puzzle. You have three rods and N disks of
                        different sizes. The goal is to move all disks from the source rod (A) to the destination
                        rod (C), following simple rules.
                    </p>

                    <h3>Rules:</h3>
                    <ol>
                        <li>Only one disk can be moved at a time</li>
                        <li>Only the topmost disk on a rod can be moved</li>
                        <li>A larger disk cannot be placed on top of a smaller disk</li>
                    </ol>

                    <h3>Recursive Strategy:</h3>
                    <ol>
                        <li>Move the top N-1 disks from source to auxiliary rod</li>
                        <li>Move the largest disk from source to destination</li>
                        <li>Move the N-1 disks from auxiliary to destination rod</li>
                    </ol>

                    <h3>Complexity Analysis:</h3>
                    <ul>
                        <li><strong>Time Complexity:</strong> O(2ⁿ) — each disk doubles the number of moves</li>
                        <li><strong>Space Complexity:</strong> O(N) — recursion stack depth</li>
                        <li><strong>Minimum Moves:</strong> 2ⁿ - 1 — this is optimal and provably minimum</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EDGE CASES & EXAMPLES ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showEdgeCases = !showEdgeCases">
                    <span class="bs-info-circle">ⓘ</span>
                    Disk Configurations &amp; Facts
                </button>
                <div v-if="showEdgeCases" class="bs-section-body">
                    <h3>Try Different Disk Counts:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card" @click="loadDiskCount(2)">
                            <strong>2 Disks</strong>
                            <small>3 moves — the simplest case to understand recursion</small>
                        </div>
                        <div class="bs-edge-card" @click="loadDiskCount(3)">
                            <strong>3 Disks (Classic)</strong>
                            <small>7 moves — the most commonly used example</small>
                        </div>
                        <div class="bs-edge-card" @click="loadDiskCount(4)">
                            <strong>4 Disks</strong>
                            <small>15 moves — watch the pattern emerge</small>
                        </div>
                        <div class="bs-edge-card" @click="loadDiskCount(6)">
                            <strong>6 Disks</strong>
                            <small>63 moves — more complex recursion tree</small>
                        </div>
                    </div>

                    <h3>Interesting Facts:</h3>
                    <ul class="bs-tips">
                        <li>The puzzle was invented by French mathematician Édouard Lucas in 1883</li>
                        <li>Legend says monks in a temple are solving a 64-disk version — it would take 2⁶⁴ - 1 moves!</li>
                        <li>At 1 move per second, 64 disks would take ~585 billion years</li>
                        <li>The sequence of moves follows a binary counting pattern</li>
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
import { towerOfHanoiSteps } from '@/algorithms/aiProblems/towerOfHanoiSteps'

const router = useRouter()

// ─── State ──────────────────────────────────
const numDisks = ref(3)
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)

const steps = ref(towerOfHanoiSteps(numDisks.value))
const stepIndex = ref(0)
const playing = ref(false)

const rodLabels = { A: 'Source (A)', B: 'Auxiliary (B)', C: 'Destination (C)' }

// ─── Computed ───────────────────────────────
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() =>
    steps.value[stepIndex.value] || {
        towers: { A: [], B: [], C: [] },
        moveFrom: null,
        moveTo: null,
        disk: null,
        moveCount: 0,
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
const minMoves = computed(() => Math.pow(2, numDisks.value) - 1)

// ─── Algorithm Metrics ──────────────────────
const metrics = computed(() => {
    let recursiveCalls = 0, moves = 0
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'recursive' || s.status === 'base_case') recursiveCalls++
        if (s.status === 'moving') moves++
    }
    const efficiency = minMoves.value > 0
        ? Math.round((moves / minMoves.value) * 100)
        : 0
    return { recursiveCalls, moves, efficiency }
})

// ─── Move History ───────────────────────────
const moveHistory = computed(() => {
    const history = []
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'moving' && s.disk != null) {
            history.push({ disk: s.disk, from: s.moveFrom, to: s.moveTo })
        }
    }
    return history
})

// ─── Disk Appearance ────────────────────────
const diskColors = [
    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#f97316', '#eab308'
]

function diskWidth(disk) {
    return 30 + (disk / numDisks.value) * 60
}

function diskColor(disk) {
    return diskColors[(disk - 1) % diskColors.length]
}

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
    steps.value = towerOfHanoiSteps(numDisks.value)
    stepIndex.value = 0
}

function generateRandom() { reset() }

function loadDiskCount(n) {
    pause()
    numDisks.value = n
    steps.value = towerOfHanoiSteps(n)
    stepIndex.value = 0
}

function goToGenerateCode() {
    const prompt = `Write a program for the Tower of Hanoi problem using recursion.\nSolve for ${numDisks.value} disks, moving from source to destination using an auxiliary rod.`
    router.push({ path: '/generate-code', query: { prompt } })
}

// ─── Watchers ───────────────────────────────
watch(speedLevel, () => {
    if (playing.value) { pause(); play() }
})

watch(numDisks, (newVal) => {
    pause()
    steps.value = towerOfHanoiSteps(newVal)
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
    background: radial-gradient(ellipse at top, #0f172a 0%, #020617 70%);
    color: #e2e8f0;
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
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #e0e7ff;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
}

.back-btn-compact:hover {
    background: rgba(99, 102, 241, 0.25);
    transform: translateX(-2px);
}

.arrow {
    width: 16px;
    height: 16px;
}

.bs-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 16px;
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
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
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
    border: 1px solid rgba(100, 116, 139, 0.3);
    background: rgba(100, 116, 139, 0.12);
    color: #cbd5e1;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
}

.bs-btn:hover:not(:disabled) {
    background: rgba(100, 116, 139, 0.25);
}

.bs-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.bs-btn.active {
    background: rgba(99, 102, 241, 0.3);
    border-color: rgba(99, 102, 241, 0.5);
}

.bs-icon {
    font-size: 0.9rem;
}

.bs-settings-toggle {
    width: 100%;
    justify-content: center;
}

.bs-settings-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    background: rgba(15, 23, 42, 0.5);
    border-radius: 8px;
}

.bs-setting-row label {
    font-size: 0.78rem;
    color: #94a3b8;
}

.bs-slider {
    width: 100%;
    cursor: pointer;
    accent-color: #818cf8;
}

.bs-code-btn {
    width: 100%;
    justify-content: center;
    background: rgba(99, 102, 241, 0.15) !important;
    border-color: rgba(99, 102, 241, 0.35) !important;
    color: #a5b4fc !important;
}

.bs-code-btn:hover {
    background: rgba(99, 102, 241, 0.28) !important;
}

.bs-info-block {
    font-size: 0.78rem;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
}

/* Shortcuts */
.bs-shortcuts h4 {
    font-size: 0.78rem;
    color: #94a3b8;
    margin: 0 0 6px;
    font-weight: 600;
}

.bs-shortcut-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 8px;
    font-size: 0.75rem;
    color: #94a3b8;
}

.bs-key {
    background: rgba(100, 116, 139, 0.25);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    color: #e0e7ff;
    font-size: 0.72rem;
    text-align: center;
}

/* Legend */
.bs-legend h4 {
    font-size: 0.82rem;
    color: #f1f5f9;
    margin: 0 0 8px;
}

.bs-legend-item {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 8px;
    font-size: 0.78rem;
    color: #cbd5e1;
}

.bs-legend-item small {
    color: #64748b;
}

.bs-dot {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    flex-shrink: 0;
    margin-top: 2px;
}

.bs-dot.th-moving {
    background: #eab308;
}

.bs-dot.th-source {
    background: #f97316;
}

.bs-dot.th-dest {
    background: #22c55e;
}

.bs-dot.th-recursive {
    background: #8b5cf6;
}

.bs-dot.th-success {
    background: #06b6d4;
}

.bs-legend-note {
    margin-top: 8px;
    font-size: 0.72rem;
    color: #64748b;
}

.bs-legend-note h5 {
    margin: 0 0 4px;
    font-weight: 600;
    color: #94a3b8;
    font-size: 0.72rem;
}

.bs-legend-note ul {
    margin: 0;
    padding-left: 14px;
}

.bs-legend-note li {
    margin-bottom: 2px;
}

/* ════════ CHART AREA ════════ */
.bs-chart-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.bs-chart-wrapper {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
    border-radius: 12px;
    padding: 16px 16px 8px;
    display: flex;
    flex-direction: column;
}

/* ════════ TOWER VISUALIZATION ════════ */
.th-towers-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    min-height: 300px;
    padding: 10px 0;
}

.th-rod-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    padding: 8px 4px;
    transition: all 0.3s ease;
}

.th-rod-wrapper.th-rod-source {
    background: rgba(249, 115, 22, 0.1);
    border: 1px solid rgba(249, 115, 22, 0.3);
}

.th-rod-wrapper.th-rod-dest {
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.3);
}

.th-rod-label {
    font-size: 0.72rem;
    color: #94a3b8;
    margin-bottom: 6px;
    font-weight: 600;
    text-align: center;
}

.th-peg-area {
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    min-height: 200px;
}

.th-peg {
    position: absolute;
    width: 6px;
    height: 80%;
    background: linear-gradient(to bottom, #64748b, #475569);
    border-radius: 3px 3px 0 0;
    bottom: 12px;
    z-index: 1;
}

.th-base {
    position: absolute;
    width: 85%;
    height: 8px;
    background: linear-gradient(to right, #475569, #64748b, #475569);
    border-radius: 4px;
    bottom: 6px;
    z-index: 2;
}

.th-disks-stack {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    position: relative;
    z-index: 3;
    width: 100%;
    padding-bottom: 14px;
}

.th-disk {
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2px;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    position: relative;
}

.th-disk-moving {
    animation: diskBounce 0.5s ease;
    box-shadow: 0 0 16px rgba(234, 179, 8, 0.5);
}

.th-disk-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@keyframes diskBounce {
    0% { transform: translateY(-20px); opacity: 0.6; }
    50% { transform: translateY(4px); }
    100% { transform: translateY(0); opacity: 1; }
}

.th-rod-name {
    font-size: 0.75rem;
    color: #64748b;
    margin-top: 6px;
    font-weight: 500;
}

/* Move indicator */
.th-move-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8px;
    margin-top: 6px;
    background: rgba(234, 179, 8, 0.08);
    border: 1px solid rgba(234, 179, 8, 0.25);
    border-radius: 8px;
}

.th-move-arrow {
    font-weight: 700;
    font-size: 0.9rem;
    color: #eab308;
    background: rgba(234, 179, 8, 0.15);
    padding: 2px 10px;
    border-radius: 6px;
}

.th-move-arrow-icon {
    font-size: 1.1rem;
    color: #eab308;
}

.th-move-disk-badge {
    font-size: 0.75rem;
    font-weight: 600;
    color: #f1f5f9;
    background: rgba(99, 102, 241, 0.25);
    padding: 2px 8px;
    border-radius: 6px;
    border: 1px solid rgba(99, 102, 241, 0.4);
}

.bs-chart-footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    color: #64748b;
    padding: 6px 0 4px;
}

.bs-scrubber {
    width: 100%;
    accent-color: #818cf8;
    cursor: pointer;
    margin-top: 4px;
}

/* Status bar */
.bs-status-bar {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
    border-radius: 10px;
    padding: 12px 20px;
    text-align: center;
    font-size: 0.9rem;
    color: #e2e8f0;
    font-weight: 500;
}

.bs-complexity-row {
    display: flex;
    justify-content: center;
    gap: 32px;
}

.bs-complexity-badge {
    font-size: 0.82rem;
    color: #94a3b8;
}

.bs-complexity-badge strong {
    color: #e0e7ff;
}

/* ════════ INSPECTOR ════════ */
.bs-inspector {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
    border-radius: 12px;
    padding: 14px;
    overflow-y: auto;
    max-height: 600px;
}

.bs-inspector::-webkit-scrollbar {
    width: 4px;
}

.bs-inspector::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.3);
    border-radius: 2px;
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
    color: #f1f5f9;
}

.bs-step-badge {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.4);
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.72rem;
    color: #a5b4fc;
    font-weight: 600;
}

.bs-inspector-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: #94a3b8;
    margin-bottom: 4px;
}

.bs-progress-track {
    width: 100%;
    height: 6px;
    background: rgba(100, 116, 139, 0.2);
    border-radius: 3px;
    margin-bottom: 16px;
    overflow: hidden;
}

.bs-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #818cf8);
    border-radius: 3px;
    transition: width 0.25s;
}

.bs-inspector-label {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: #64748b;
    margin: 14px 0 6px;
    font-weight: 700;
}

.bs-op-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    color: #cbd5e1;
    margin-bottom: 4px;
}

.bs-op-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.bs-op-dot.th-moving {
    background: #eab308;
}

.bs-op-dot.th-recursive {
    background: #8b5cf6;
}

.bs-op-dot.th-success {
    background: #06b6d4;
}

.bs-op-dot.th-source {
    background: #f97316;
}

.bs-op-dot.th-dest {
    background: #22c55e;
}

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
    color: #64748b;
}

.bs-metric-value {
    font-size: 1.15rem;
    font-weight: 700;
    color: #f1f5f9;
}

.bs-step-detail {
    background: rgba(15, 23, 42, 0.5);
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    color: #cbd5e1;
    font-family: 'Fira Code', monospace;
}

/* ════════ ROD STATES ════════ */
.th-rod-states {
    background: rgba(15, 23, 42, 0.5);
    padding: 8px 10px;
    border-radius: 6px;
}

.th-rod-state-row {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 3px 0;
    font-size: 0.78rem;
}

.th-rod-state-label {
    color: #94a3b8;
    font-weight: 600;
    min-width: 105px;
    font-size: 0.72rem;
}

.th-rod-state-disks {
    color: #e0e7ff;
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
}

/* ════════ MOVE HISTORY ════════ */
.th-move-history {
    background: rgba(15, 23, 42, 0.5);
    padding: 8px 10px;
    border-radius: 6px;
    max-height: 140px;
    overflow-y: auto;
}

.th-move-history::-webkit-scrollbar {
    width: 3px;
}

.th-move-history::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.3);
    border-radius: 2px;
}

.th-move-entry {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    color: #94a3b8;
    padding: 2px 0;
}

.th-move-current {
    color: #eab308;
    font-weight: 600;
}

.th-move-num {
    font-weight: 700;
    color: #64748b;
    font-family: 'Fira Code', monospace;
    min-width: 24px;
}

.th-no-moves {
    font-size: 0.72rem;
    color: #475569;
    font-style: italic;
}

/* ════════ COLLAPSIBLE SECTIONS ════════ */
.bs-section {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
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
    color: #e2e8f0;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s;
}

.bs-section-toggle:hover {
    background: rgba(100, 116, 139, 0.1);
}

.bs-info-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.4);
    color: #a5b4fc;
    font-size: 0.82rem;
    font-weight: 700;
    flex-shrink: 0;
}

.bs-section-body {
    padding: 0 20px 20px;
    color: #cbd5e1;
    font-size: 0.88rem;
    line-height: 1.7;
}

.bs-section-body h2 {
    font-size: 1.15rem;
    color: #f1f5f9;
    margin: 0 0 8px;
}

.bs-section-body h3 {
    font-size: 0.95rem;
    color: #e0e7ff;
    margin: 16px 0 6px;
}

.bs-section-body ol,
.bs-section-body ul {
    padding-left: 20px;
    margin: 4px 0;
}

.bs-section-body li {
    margin-bottom: 3px;
}

/* Edge case cards */
.bs-edge-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 8px;
}

.bs-edge-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.15s;
}

.bs-edge-card:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.08);
}

.bs-edge-card strong {
    display: block;
    color: #f1f5f9;
    font-size: 0.88rem;
    margin-bottom: 4px;
}

.bs-edge-card small {
    color: #64748b;
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
    .bs-three-col {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .bs-edge-grid {
        grid-template-columns: 1fr;
    }

    .bs-page {
        padding: 12px;
    }

    .th-towers-container {
        gap: 6px;
    }

    .th-disk {
        height: 22px;
    }
}
</style>
