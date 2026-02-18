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
            <h1 class="bs-title">Vacuum Cleaner Agent</h1>

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
                            <span class="bs-icon"><Shuffle :size="14" /></span> New Grid
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
                        <div class="bs-setting-row">
                            <label>Grid Size: <strong>{{ gridSize }}×{{ gridSize }}</strong></label>
                            <input type="range" min="2" max="5" v-model.number="gridSize" class="bs-slider" />
                        </div>
                    </div>

                    <!-- Generate Code Button -->
                    <button class="bs-btn bs-code-btn" @click="goToGenerateCode">
                        <span class="bs-icon">{ }</span> Generate Code
                    </button>

                    <!-- Quick info -->
                    <div class="bs-info-block">
                        <p><strong>Agent:</strong> Simple Reflex</p>
                        <p><strong>Grid:</strong> {{ gridSize }}×{{ gridSize }}</p>
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
                            <span class="bs-dot vc-start"></span>
                            <div><strong>Start</strong><br /><small>Initial placement</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot vc-perceiving"></span>
                            <div><strong>Perceiving</strong><br /><small>Sensing environment</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot vc-cleaning"></span>
                            <div><strong>Cleaning</strong><br /><small>Sucking dirt</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot vc-moving"></span>
                            <div><strong>Moving</strong><br /><small>Next cell</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot vc-success"></span>
                            <div><strong>Complete</strong><br /><small>All cells cleaned</small></div>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: GRID VISUALIZATION -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <div class="vc-grid-container">
                            <div class="vc-grid" :style="gridStyle">
                                <div v-for="(row, ri) in currentStep.grid" :key="ri" v-for-nested
                                    style="display:contents">
                                    <div v-for="(cell, ci) in row" :key="ri + '-' + ci" class="vc-cell" :class="{
                                        'vc-cell-dirty': cell === 1,
                                        'vc-cell-clean': cell === 0,
                                        'vc-cell-agent': currentStep.agentPos.row === ri && currentStep.agentPos.col === ci,
                                    }">
                                        <!-- Dirt particles -->
                                        <div v-if="cell === 1" class="vc-dirt">
                                            <span class="vc-dirt-particle"><CircleDot :size="8" /></span>
                                            <span class="vc-dirt-particle"><CircleDot :size="8" /></span>
                                            <span class="vc-dirt-particle"><CircleDot :size="8" /></span>
                                        </div>
                                        <!-- Agent -->
                                        <div v-if="currentStep.agentPos.row === ri && currentStep.agentPos.col === ci"
                                            class="vc-agent" :class="{
                                                'vc-agent-cleaning': currentStep.status === 'cleaning',
                                                'vc-agent-moving': currentStep.status === 'moving',
                                            }">
                                            <span class="vc-agent-icon"><Bot :size="20" /></span>
                                        </div>
                                        <!-- Clean sparkle -->
                                        <div v-if="cell === 0 && !(currentStep.agentPos.row === ri && currentStep.agentPos.col === ci)"
                                            class="vc-sparkle"><Sparkles :size="16" /></div>
                                        <!-- Cell label -->
                                        <span class="vc-cell-label">({{ ri }},{{ ci }})</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Action badge -->
                            <div class="vc-action-panel">
                                <div class="vc-action-badge" :class="{
                                    'vc-ab-start': currentStep.status === 'start',
                                    'vc-ab-perceiving': currentStep.status === 'perceiving',
                                    'vc-ab-cleaning': currentStep.status === 'cleaning',
                                    'vc-ab-checking': currentStep.status === 'checking',
                                    'vc-ab-moving': currentStep.status === 'moving',
                                    'vc-ab-success': currentStep.status === 'success',
                                }">
                                    <span v-if="currentStep.status === 'start'"><Target :size="14" class="bs-lucide" /> Agent Initialized</span>
                                    <span v-else-if="currentStep.status === 'perceiving'"><Eye :size="14" class="bs-lucide" /> Perceiving Cell ({{ currentStep.agentPos.row }}, {{ currentStep.agentPos.col }})</span>
                                    <span v-else-if="currentStep.status === 'cleaning'"><Paintbrush :size="14" class="bs-lucide" /> SUCK — Cleaning!</span>
                                    <span v-else-if="currentStep.status === 'checking'"><CheckCircle2 :size="14" class="bs-lucide" /> Cell already clean</span>
                                    <span v-else-if="currentStep.status === 'moving'"><Footprints :size="14" class="bs-lucide" /> Moving to next cell</span>
                                    <span v-else-if="currentStep.status === 'success'"><Trophy :size="14" class="bs-lucide" /> All cells checked!</span>
                                </div>
                                <div class="vc-stats-row">
                                    <div class="vc-stat">
                                        <span class="vc-stat-label">Moves</span>
                                        <span class="vc-stat-val">{{ currentStep.totalMoves }}</span>
                                    </div>
                                    <div class="vc-stat">
                                        <span class="vc-stat-label">Cleaned</span>
                                        <span class="vc-stat-val">{{ currentStep.totalCleans }}</span>
                                    </div>
                                    <div class="vc-stat">
                                        <span class="vc-stat-label">Position</span>
                                        <span class="vc-stat-val">({{ currentStep.agentPos.row }},{{ currentStep.agentPos.col }})</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>Vacuum Cleaner — Simple Reflex Agent</span>
                            <span>{{ gridSize }}×{{ gridSize }} Grid</span>
                        </div>

                        <!-- Scrubber -->
                        <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1"
                            v-model.number="stepIndex" />
                    </div>

                    <!-- Status bar -->
                    <div class="bs-status-bar">{{ currentStep.explanation }}</div>

                    <!-- Complexity badges -->
                    <div class="bs-complexity-row">
                        <span class="bs-complexity-badge">Time: <strong>O(n²)</strong></span>
                        <span class="bs-complexity-badge">Space: <strong>O(n²)</strong></span>
                        <span class="bs-complexity-badge">Type: <strong>Reflex Agent</strong></span>
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
                    <h4 class="bs-inspector-label">CURRENT ACTION</h4>
                    <div class="bs-op-item">
                        <span class="bs-op-dot" :class="{
                            'vc-perceiving': currentStep.status === 'perceiving',
                            'vc-cleaning': currentStep.status === 'cleaning',
                            'vc-checking': currentStep.status === 'checking',
                            'vc-moving': currentStep.status === 'moving',
                            'vc-success': currentStep.status === 'success',
                            'vc-start': currentStep.status === 'start',
                        }"></span>
                        {{ actionLabel }}
                    </div>

                    <!-- Agent Metrics -->
                    <h4 class="bs-inspector-label">AGENT METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">Total Moves</span>
                            <span class="bs-metric-value">{{ currentStep.totalMoves }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Cells Cleaned</span>
                            <span class="bs-metric-value">{{ currentStep.totalCleans }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Dirty Remaining</span>
                            <span class="bs-metric-value">{{ dirtyRemaining }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Clean %</span>
                            <span class="bs-metric-value">{{ cleanPercent }}%</span>
                        </div>
                    </div>

                    <!-- Agent Position -->
                    <h4 class="bs-inspector-label">AGENT POSITION</h4>
                    <div class="vc-pos-display">
                        <div class="vc-pos-badge">
                            Row: <strong>{{ currentStep.agentPos.row }}</strong>
                        </div>
                        <div class="vc-pos-badge">
                            Col: <strong>{{ currentStep.agentPos.col }}</strong>
                        </div>
                    </div>

                    <!-- Current Step -->
                    <h4 class="bs-inspector-label">CURRENT STEP</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>

                    <!-- Grid State -->
                    <h4 class="bs-inspector-label">GRID STATE</h4>
                    <div class="vc-grid-mini">
                        <div v-for="(row, ri) in currentStep.grid" :key="ri" class="vc-mini-row">
                            <div v-for="(cell, ci) in row" :key="ci" class="vc-mini-cell" :class="{
                                'vc-mini-dirty': cell === 1,
                                'vc-mini-clean': cell === 0,
                                'vc-mini-agent': currentStep.agentPos.row === ri && currentStep.agentPos.col === ci,
                            }">
                                {{ cell === 1 ? 'D' : '·' }}
                            </div>
                        </div>
                    </div>

                    <!-- Action Log -->
                    <h4 class="bs-inspector-label">ACTION LOG</h4>
                    <div class="vc-action-log">
                        <div v-for="(entry, i) in actionLog" :key="i" class="vc-log-entry"
                            :class="{ 'vc-log-current': i === actionLog.length - 1 }">
                            <span class="vc-log-num">#{{ i + 1 }}</span>
                            <span class="vc-log-dot" :class="{
                                'vc-cleaning': entry.status === 'cleaning',
                                'vc-moving': entry.status === 'moving',
                                'vc-perceiving': entry.status === 'perceiving',
                                'vc-checking': entry.status === 'checking',
                            }"></span>
                            <span class="vc-log-text">{{ entry.label }}</span>
                        </div>
                        <span v-if="actionLog.length === 0" class="vc-no-log">No actions yet</span>
                    </div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    How the Vacuum Cleaner Agent Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>
                        The Vacuum Cleaner Agent is a classic AI problem demonstrating a <strong>simple reflex agent</strong>.
                        The agent moves through a grid, perceiving its environment and deciding actions based on the
                        current cell's state — dirty or clean.
                    </p>

                    <h3>Agent Behavior (Reflex Rules):</h3>
                    <ol>
                        <li><strong>Perceive</strong> — Check if the current cell is dirty or clean</li>
                        <li><strong>If Dirty → SUCK</strong> — Clean the cell</li>
                        <li><strong>If Clean → NO ACTION</strong> — Nothing to do</li>
                        <li><strong>Move</strong> — Advance to the next cell in a systematic scan</li>
                    </ol>

                    <h3>Movement Pattern:</h3>
                    <ul>
                        <li>The agent scans left-to-right, top-to-bottom (row-major order)</li>
                        <li>It visits every cell exactly once</li>
                        <li>This is a <strong>model-based reflex agent</strong> that systematically covers the entire grid</li>
                    </ul>

                    <h3>Complexity:</h3>
                    <ul>
                        <li><strong>Time:</strong> O(n²) — visits every cell once</li>
                        <li><strong>Space:</strong> O(n²) — stores the grid state</li>
                        <li><strong>Optimal:</strong> Yes, for the systematic traversal strategy</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EXAMPLES ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showExamples = !showExamples">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    Grid Sizes &amp; Tips
                </button>
                <div v-if="showExamples" class="bs-section-body">
                    <h3>Try Different Grid Sizes:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card" @click="loadGridSize(2)">
                            <strong>2×2 Grid</strong>
                            <small>4 cells — quick demo, great for learning</small>
                        </div>
                        <div class="bs-edge-card" @click="loadGridSize(3)">
                            <strong>3×3 Grid</strong>
                            <small>9 cells — more steps, see the pattern clearly</small>
                        </div>
                        <div class="bs-edge-card" @click="loadGridSize(4)">
                            <strong>4×4 Grid</strong>
                            <small>16 cells — medium complexity</small>
                        </div>
                        <div class="bs-edge-card" @click="loadGridSize(5)">
                            <strong>5×5 Grid</strong>
                            <small>25 cells — large grid, extensive traversal</small>
                        </div>
                    </div>

                    <h3>Key Concepts:</h3>
                    <ul class="bs-tips">
                        <li>A simple reflex agent acts based only on the current percept (dirty/clean)</li>
                        <li>Dirt is randomly placed — each run produces different starting states</li>
                        <li>The performance measure is: clean cells + minimize actions</li>
                        <li>This agent always achieves its goal because it visits every cell</li>
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
import { Bot, Sparkles, Target, Eye, Paintbrush, CheckCircle2, Footprints, Trophy, Play, SkipForward, RotateCcw, Shuffle, Settings2, Info, ArrowRight, ArrowLeft, CircleDot } from 'lucide-vue-next'
import { vacuumCleanerSteps } from '@/algorithms/aiProblems/vacuumCleanerSteps'

const router = useRouter()

// ─── State ──────────────────────────────────
const gridSize = ref(3)
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showExamples = ref(false)

const steps = ref(vacuumCleanerSteps(gridSize.value))
const stepIndex = ref(0)
const playing = ref(false)

// ─── Computed ───────────────────────────────
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() =>
    steps.value[stepIndex.value] || {
        grid: [[0, 0], [0, 0]],
        agentPos: { row: 0, col: 0 },
        action: 'start',
        totalMoves: 0,
        totalCleans: 0,
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

const gridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${gridSize.value}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize.value}, 1fr)`,
}))

const actionLabel = computed(() => {
    const s = currentStep.value
    if (s.status === 'start') return 'Agent initialized'
    if (s.status === 'perceiving') return `Perceiving (${s.agentPos.row},${s.agentPos.col})`
    if (s.status === 'cleaning') return `Cleaning (${s.agentPos.row},${s.agentPos.col})`
    if (s.status === 'checking') return `Cell clean — no action`
    if (s.status === 'moving') return `Moving to next cell`
    if (s.status === 'success') return `All cells checked!`
    return s.action
})

// ─── Grid Metrics ───────────────────────────
const dirtyRemaining = computed(() => {
    let count = 0
    const g = currentStep.value.grid
    for (const row of g) {
        for (const cell of row) {
            if (cell === 1) count++
        }
    }
    return count
})

const cleanPercent = computed(() => {
    const g = currentStep.value.grid
    const total = g.length * g[0].length
    const clean = total - dirtyRemaining.value
    return Math.round((clean / total) * 100)
})

// ─── Action Log ─────────────────────────────
const actionLog = computed(() => {
    const log = []
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'cleaning' || s.status === 'moving' || s.status === 'checking') {
            let label = ''
            if (s.status === 'cleaning') label = `SUCK @ (${s.agentPos.row},${s.agentPos.col})`
            else if (s.status === 'moving') label = `MOVE #${s.totalMoves}`
            else if (s.status === 'checking') label = `CLEAN @ (${s.agentPos.row},${s.agentPos.col})`
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
    steps.value = vacuumCleanerSteps(gridSize.value)
    stepIndex.value = 0
}

function generateNew() { reset() }

function loadGridSize(size) {
    pause()
    gridSize.value = size
    steps.value = vacuumCleanerSteps(size)
    stepIndex.value = 0
}

function goToGenerateCode() {
    const prompt = `Write a program implementing a Vacuum Cleaner Agent (Simple Reflex Agent).\nThe agent operates on an n×n grid. Each cell is either dirty or clean.\nThe agent perceives the current cell and acts: SUCK if dirty, else move to the next cell.\nInclude the grid initialization, agent loop, perceive-act cycle, and performance measurement.`
    router.push({ path: '/generate-code', query: { prompt } })
}

// ─── Watchers ───────────────────────────────
watch(speedLevel, () => {
    if (playing.value) { pause(); play() }
})

watch(gridSize, () => {
    pause()
    steps.value = vacuumCleanerSteps(gridSize.value)
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
.bs-dot.vc-start { background: #3b82f6; }
.bs-dot.vc-perceiving { background: #f59e0b; }
.bs-dot.vc-cleaning { background: #ef4444; }
.bs-dot.vc-moving { background: #22c55e; }
.bs-dot.vc-success { background: #8b5cf6; }

/* ════════ CHART AREA ════════ */
.bs-chart-area { display: flex; flex-direction: column; gap: 10px; }
.bs-chart-wrapper { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 12px; padding: 16px 16px 8px; display: flex; flex-direction: column; }
.bs-chart-footer { display: flex; justify-content: space-between; font-size: 0.72rem; color: #64748b; padding: 6px 0 4px; }
.bs-scrubber { width: 100%; accent-color: #818cf8; cursor: pointer; margin-top: 4px; }
.bs-status-bar { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 10px; padding: 12px 20px; text-align: center; font-size: 0.9rem; color: #e2e8f0; font-weight: 500; }
.bs-complexity-row { display: flex; justify-content: center; gap: 32px; }
.bs-complexity-badge { font-size: 0.82rem; color: #94a3b8; }
.bs-complexity-badge strong { color: #e0e7ff; }

/* ════════ VACUUM GRID ════════ */
.vc-grid-container { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px 10px; min-height: 340px; }

.vc-grid { display: grid; gap: 6px; width: 100%; max-width: 420px; aspect-ratio: 1; }

.vc-cell { position: relative; background: rgba(15,23,42,0.7); border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.35s ease; min-height: 60px; }

.vc-cell-dirty { background: rgba(180,83,9,0.15); border: 2px solid rgba(217,119,6,0.35); }
.vc-cell-clean { background: rgba(34,197,94,0.06); border: 2px solid rgba(34,197,94,0.15); }
.vc-cell-agent { box-shadow: 0 0 20px rgba(99,102,241,0.4); border: 2px solid rgba(99,102,241,0.6) !important; z-index: 2; }

.vc-dirt { display: flex; gap: 3px; position: absolute; top: 8px; right: 8px; }
.vc-dirt-particle { font-size: 0.5rem; color: rgba(180,83,9,0.6); }

.vc-agent { position: absolute; display: flex; align-items: center; justify-content: center; }
.vc-agent-icon { font-size: 1.8rem; transition: transform 0.3s ease; }
.vc-agent-cleaning .vc-agent-icon { animation: vacuumShake 0.3s ease-in-out infinite; }
.vc-agent-moving .vc-agent-icon { animation: vacuumBounce 0.4s ease; }

@keyframes vacuumShake {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
}
@keyframes vacuumBounce {
    0% { transform: scale(0.9); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.vc-sparkle { font-size: 0.9rem; opacity: 0.4; }

.vc-cell-label { position: absolute; bottom: 4px; left: 6px; font-size: 0.6rem; color: #475569; font-family: 'Fira Code', monospace; }

/* Action Panel */
.vc-action-panel { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; max-width: 420px; }

.vc-action-badge { padding: 8px 18px; border-radius: 10px; font-size: 0.82rem; font-weight: 600; text-align: center; background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.25); color: #cbd5e1; }
.vc-ab-start { background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3); color: #93c5fd; }
.vc-ab-perceiving { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.3); color: #fcd34d; }
.vc-ab-cleaning { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.3); color: #fca5a5; }
.vc-ab-checking { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); color: #86efac; }
.vc-ab-moving { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.3); color: #86efac; }
.vc-ab-success { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); color: #c4b5fd; }

.vc-stats-row { display: flex; gap: 16px; }
.vc-stat { display: flex; flex-direction: column; align-items: center; }
.vc-stat-label { font-size: 0.68rem; color: #64748b; }
.vc-stat-val { font-size: 1rem; font-weight: 700; color: #f1f5f9; }

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
.bs-op-dot.vc-perceiving { background: #f59e0b; }
.bs-op-dot.vc-cleaning { background: #ef4444; }
.bs-op-dot.vc-checking { background: #22c55e; }
.bs-op-dot.vc-moving { background: #22c55e; }
.bs-op-dot.vc-success { background: #8b5cf6; }
.bs-op-dot.vc-start { background: #3b82f6; }
.bs-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bs-metric { display: flex; flex-direction: column; }
.bs-metric-label { font-size: 0.7rem; color: #64748b; }
.bs-metric-value { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; }
.bs-step-detail { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; font-size: 0.78rem; color: #cbd5e1; font-family: 'Fira Code', monospace; }

/* Position Display */
.vc-pos-display { display: flex; gap: 8px; }
.vc-pos-badge { flex: 1; background: rgba(15,23,42,0.5); padding: 6px 10px; border-radius: 6px; font-size: 0.78rem; color: #94a3b8; text-align: center; }
.vc-pos-badge strong { color: #e0e7ff; }

/* Grid Mini */
.vc-grid-mini { background: rgba(15,23,42,0.5); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.vc-mini-row { display: flex; gap: 2px; }
.vc-mini-cell { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; font-family: 'Fira Code', monospace; border-radius: 4px; }
.vc-mini-dirty { background: rgba(180,83,9,0.2); color: #fbbf24; }
.vc-mini-clean { background: rgba(34,197,94,0.1); color: #64748b; }
.vc-mini-agent { border: 2px solid rgba(99,102,241,0.5); }

/* Action Log */
.vc-action-log { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; max-height: 140px; overflow-y: auto; }
.vc-action-log::-webkit-scrollbar { width: 3px; }
.vc-action-log::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.3); border-radius: 2px; }
.vc-log-entry { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: #94a3b8; padding: 2px 0; }
.vc-log-current { color: #e0e7ff; font-weight: 600; }
.vc-log-num { font-weight: 700; color: #64748b; font-family: 'Fira Code', monospace; min-width: 24px; }
.vc-log-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.vc-log-dot.vc-cleaning { background: #ef4444; }
.vc-log-dot.vc-moving { background: #22c55e; }
.vc-log-dot.vc-perceiving { background: #f59e0b; }
.vc-log-dot.vc-checking { background: #22c55e; }
.vc-log-text { flex: 1; }
.vc-no-log { font-size: 0.72rem; color: #475569; font-style: italic; }

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
.bs-edge-card { background: rgba(15,23,42,0.5); border: 1px solid rgba(100,116,139,0.3); border-radius: 10px; padding: 14px; cursor: pointer; transition: all 0.15s; }
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
    .vc-grid { max-width: 300px; }
    .vc-agent-icon { font-size: 1.3rem; }
}
</style>
