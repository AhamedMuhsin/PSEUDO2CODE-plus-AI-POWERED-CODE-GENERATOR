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
            <h1 class="bs-title">Missionaries &amp; Cannibals Problem</h1>

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
                            <span class="bs-dot mc-start"></span>
                            <div><strong>Start</strong><br /><small>Initial state</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot mc-exploring"></span>
                            <div><strong>Exploring</strong><br /><small>Trying a move</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot mc-trying"></span>
                            <div><strong>Trying</strong><br /><small>Evaluating state</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot mc-failed"></span>
                            <div><strong>Failed</strong><br /><small>Invalid / visited</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot mc-success"></span>
                            <div><strong>Success</strong><br /><small>Goal reached</small></div>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: RIVER VISUALIZATION -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <div class="mc-scene">
                            <!-- Left Bank -->
                            <div class="mc-bank mc-bank-left">
                                <h3 class="mc-bank-label">Left Bank</h3>
                                <div class="mc-people-row">
                                    <div v-for="i in currentStep.missionariesLeft" :key="'ml'+i" class="mc-person mc-missionary" title="Missionary">
                                        <span class="mc-person-icon"><User :size="18" /></span>
                                    </div>
                                </div>
                                <div class="mc-people-row">
                                    <div v-for="i in currentStep.cannibalsLeft" :key="'cl'+i" class="mc-person mc-cannibal" title="Cannibal">
                                        <span class="mc-person-icon"><Skull :size="18" /></span>
                                    </div>
                                </div>
                                <div class="mc-bank-count">
                                    <span>M: {{ currentStep.missionariesLeft }}</span>
                                    <span>C: {{ currentStep.cannibalsLeft }}</span>
                                </div>
                            </div>

                            <!-- River + Boat -->
                            <div class="mc-river">
                                <div class="mc-waves">
                                    <span v-for="n in 6" :key="n" class="mc-wave"><Waves :size="16" /></span>
                                </div>
                                <div class="mc-boat" :class="{ 'mc-boat-right': currentStep.boatSide === 'right' }">
                                    <span class="mc-boat-icon"><Ship :size="20" /></span>
                                </div>
                                <div v-if="currentStep.move" class="mc-move-badge">
                                    {{ currentStep.move }}
                                </div>
                            </div>

                            <!-- Right Bank -->
                            <div class="mc-bank mc-bank-right">
                                <h3 class="mc-bank-label">Right Bank</h3>
                                <div class="mc-people-row">
                                    <div v-for="i in currentStep.missionariesRight" :key="'mr'+i" class="mc-person mc-missionary" title="Missionary">
                                        <span class="mc-person-icon"><User :size="18" /></span>
                                    </div>
                                </div>
                                <div class="mc-people-row">
                                    <div v-for="i in currentStep.cannibalsRight" :key="'cr'+i" class="mc-person mc-cannibal" title="Cannibal">
                                        <span class="mc-person-icon"><Skull :size="18" /></span>
                                    </div>
                                </div>
                                <div class="mc-bank-count">
                                    <span>M: {{ currentStep.missionariesRight }}</span>
                                    <span>C: {{ currentStep.cannibalsRight }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Status indicator -->
                        <div class="mc-status-indicator" :class="{
                            'mc-si-exploring': currentStep.status === 'exploring' || currentStep.status === 'trying',
                            'mc-si-success': currentStep.status === 'success',
                            'mc-si-failed': currentStep.status === 'failed',
                        }">
                            <span v-if="currentStep.status === 'start'"><Target :size="14" class="bs-lucide" /> Initial State: All on right bank</span>
                            <span v-else-if="currentStep.status === 'exploring'"><Search :size="14" class="bs-lucide" /> Exploring new state...</span>
                            <span v-else-if="currentStep.status === 'trying'"><Navigation :size="14" class="bs-lucide" /> Trying move: {{ currentStep.move }}</span>
                            <span v-else-if="currentStep.status === 'failed'"><XCircle :size="14" class="bs-lucide" /> Invalid state / already visited</span>
                            <span v-else-if="currentStep.status === 'success'"><CheckCircle2 :size="14" class="bs-lucide" /> All safely across the river!</span>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>Missionaries &amp; Cannibals — BFS</span>
                            <span>3 missionaries, 3 cannibals, 1 boat (cap 2)</span>
                        </div>

                        <!-- Scrubber -->
                        <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1"
                            v-model.number="stepIndex" />
                    </div>

                    <!-- Status bar -->
                    <div class="bs-status-bar">{{ currentStep.explanation }}</div>

                    <!-- Complexity badges -->
                    <div class="bs-complexity-row">
                        <span class="bs-complexity-badge">Time: <strong>O(V + E)</strong></span>
                        <span class="bs-complexity-badge">Space: <strong>O(V)</strong></span>
                        <span class="bs-complexity-badge">Method: <strong>BFS</strong></span>
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
                            'mc-exploring': currentStep.status === 'exploring' || currentStep.status === 'trying',
                            'mc-failed': currentStep.status === 'failed',
                            'mc-success': currentStep.status === 'success',
                            'mc-start': currentStep.status === 'start',
                        }"></span>
                        {{ currentStep.explanation }}
                    </div>

                    <!-- State Details -->
                    <h4 class="bs-inspector-label">STATE DETAILS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">Missionaries (L)</span>
                            <span class="bs-metric-value">{{ currentStep.missionariesLeft }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Cannibals (L)</span>
                            <span class="bs-metric-value">{{ currentStep.cannibalsLeft }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Missionaries (R)</span>
                            <span class="bs-metric-value">{{ currentStep.missionariesRight }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Cannibals (R)</span>
                            <span class="bs-metric-value">{{ currentStep.cannibalsRight }}</span>
                        </div>
                    </div>

                    <!-- Boat & Move -->
                    <h4 class="bs-inspector-label">BOAT &amp; MOVE</h4>
                    <div class="mc-boat-info">
                        <div class="mc-info-row">
                            <span class="mc-info-label">Boat Side:</span>
                            <span class="mc-info-val" :class="{ 'mc-val-left': currentStep.boatSide === 'left', 'mc-val-right': currentStep.boatSide === 'right' }">
                                {{ currentStep.boatSide === 'left' ? '← Left' : 'Right →' }}
                            </span>
                        </div>
                        <div class="mc-info-row" v-if="currentStep.move">
                            <span class="mc-info-label">Move:</span>
                            <span class="mc-info-val">{{ currentStep.move }}</span>
                        </div>
                    </div>

                    <!-- Step Details -->
                    <h4 class="bs-inspector-label">CURRENT STEP</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>

                    <!-- Solution Path -->
                    <h4 class="bs-inspector-label">SOLUTION PATH</h4>
                    <div class="mc-path-log">
                        <div v-for="(entry, i) in pathLog" :key="i" class="mc-path-entry"
                            :class="{ 'mc-path-current': i === pathLog.length - 1 }">
                            <span class="mc-path-num">#{{ i + 1 }}</span>
                            <span class="mc-path-text">{{ entry }}</span>
                        </div>
                        <span v-if="pathLog.length === 0" class="mc-no-path">No path yet</span>
                    </div>

                    <!-- Metrics -->
                    <h4 class="bs-inspector-label">ALGORITHM METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">States Explored</span>
                            <span class="bs-metric-value">{{ metrics.explored }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Failed States</span>
                            <span class="bs-metric-value">{{ metrics.failed }}</span>
                        </div>
                    </div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    How Missionaries &amp; Cannibals Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Problem Overview</h2>
                    <p>
                        Three missionaries and three cannibals must cross a river using a boat that can carry at most
                        two people. If cannibals ever outnumber missionaries on either bank, the missionaries are eaten.
                    </p>

                    <h3>Constraints:</h3>
                    <ol>
                        <li><strong>Boat capacity:</strong> maximum 2 people</li>
                        <li><strong>At least 1 person</strong> must be in the boat to row</li>
                        <li><strong>Safety rule:</strong> Missionaries must never be outnumbered by cannibals on either bank (unless there are 0 missionaries)</li>
                        <li><strong>Goal:</strong> Move everyone from right bank to left bank</li>
                    </ol>

                    <h3>Algorithm — Breadth-First Search (BFS):</h3>
                    <ul>
                        <li>State: (missionaries_left, cannibals_left, boat_side)</li>
                        <li>BFS explores all valid moves level by level</li>
                        <li>Guarantees finding the shortest solution path</li>
                        <li>Tracks visited states to avoid cycles</li>
                    </ul>

                    <h3>Complexity:</h3>
                    <ul>
                        <li><strong>States:</strong> Finite (≤ 32 unique states)</li>
                        <li><strong>Time:</strong> O(V + E) where V = states, E = transitions</li>
                        <li><strong>Space:</strong> O(V) for visited set and queue</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EXAMPLES ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showExamples = !showExamples">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    Rules &amp; Tips
                </button>
                <div v-if="showExamples" class="bs-section-body">
                    <h3>Key Rules:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card">
                            <strong><Navigation :size="14" class="bs-lucide" /> Boat Rule</strong>
                            <small>1 or 2 people per crossing, boat can't cross empty</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><AlertTriangle :size="14" class="bs-lucide" /> Safety Rule</strong>
                            <small>Cannibals can never outnumber missionaries on either bank</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><Target :size="14" class="bs-lucide" /> Goal</strong>
                            <small>Move all 3 missionaries and 3 cannibals to the left bank</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><RefreshCw :size="14" class="bs-lucide" /> Boat Return</strong>
                            <small>Someone must ride the boat back — this is the tricky part!</small>
                        </div>
                    </div>

                    <h3>Interesting Facts:</h3>
                    <ul class="bs-tips">
                        <li>The minimum solution requires 11 crossings</li>
                        <li>This problem dates back to at least 1612 (Claude Gaspar Bachet)</li>
                        <li>It's a classic example of state-space search in AI</li>
                        <li>BFS guarantees the shortest (optimal) solution</li>
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
import { User, Skull, Ship, Target, Search, Navigation, XCircle, CheckCircle2, AlertTriangle, RefreshCw, Play, SkipForward, RotateCcw, Settings2, Info, ArrowRight, ArrowLeft, Waves } from 'lucide-vue-next'
import { missionariesCannibalsSteps } from '@/algorithms/aiProblems/missionariesCannibalsSteps'

const router = useRouter()

// ─── State ──────────────────────────────────
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showExamples = ref(false)

const steps = ref(missionariesCannibalsSteps())
const stepIndex = ref(0)
const playing = ref(false)

// ─── Computed ───────────────────────────────
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() =>
    steps.value[stepIndex.value] || {
        missionariesLeft: 3,
        cannibalsLeft: 3,
        missionariesRight: 0,
        cannibalsRight: 0,
        boatSide: 'left',
        move: null,
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

// ─── Algorithm Metrics ──────────────────────
const metrics = computed(() => {
    let explored = 0, failed = 0
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'exploring' || s.status === 'trying') explored++
        if (s.status === 'failed') failed++
    }
    return { explored, failed }
})

// ─── Path Log ────────────────────────────
const pathLog = computed(() => {
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
    steps.value = missionariesCannibalsSteps()
    stepIndex.value = 0
}

function goToGenerateCode() {
    const prompt = `Write a program to solve the Missionaries and Cannibals problem using BFS.\n3 missionaries and 3 cannibals must cross a river. The boat carries max 2 people.\nCannibals can never outnumber missionaries on either bank.\nFind the shortest solution path.`
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

/* ════════ CONTROLS PANEL ════════ */
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
.bs-shortcuts h4 { font-size: 0.78rem; color: #94a3b8; margin: 0 0 6px; font-weight: 600; }
.bs-shortcut-grid { display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; font-size: 0.75rem; color: #94a3b8; }
.bs-key { background: rgba(100,116,139,0.25); padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #e0e7ff; font-size: 0.72rem; text-align: center; }

/* Legend */
.bs-legend h4 { font-size: 0.82rem; color: #f1f5f9; margin: 0 0 8px; }
.bs-legend-item { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 8px; font-size: 0.78rem; color: #cbd5e1; }
.bs-legend-item small { color: #64748b; }
.bs-dot { width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0; margin-top: 2px; }
.bs-dot.mc-start { background: #3b82f6; }
.bs-dot.mc-exploring { background: #22c55e; }
.bs-dot.mc-trying { background: #f59e0b; }
.bs-dot.mc-failed { background: #ef4444; }
.bs-dot.mc-success { background: #8b5cf6; }

/* ════════ CHART AREA ════════ */
.bs-chart-area { display: flex; flex-direction: column; gap: 10px; }
.bs-chart-wrapper { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 12px; padding: 16px 16px 8px; display: flex; flex-direction: column; }
.bs-chart-footer { display: flex; justify-content: space-between; font-size: 0.72rem; color: #64748b; padding: 6px 0 4px; }
.bs-scrubber { width: 100%; accent-color: #818cf8; cursor: pointer; margin-top: 4px; }
.bs-status-bar { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 10px; padding: 12px 20px; text-align: center; font-size: 0.9rem; color: #e2e8f0; font-weight: 500; }
.bs-complexity-row { display: flex; justify-content: center; gap: 32px; }
.bs-complexity-badge { font-size: 0.82rem; color: #94a3b8; }
.bs-complexity-badge strong { color: #e0e7ff; }

/* ════════ RIVER SCENE ════════ */
.mc-scene { display: grid; grid-template-columns: 1fr 120px 1fr; gap: 0; min-height: 320px; align-items: stretch; }

.mc-bank { display: flex; flex-direction: column; align-items: center; padding: 20px 12px; border-radius: 10px; }
.mc-bank-left { background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.15); }
.mc-bank-right { background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.15); }
.mc-bank-label { font-size: 0.85rem; font-weight: 700; color: #f1f5f9; margin: 0 0 16px; }
.mc-people-row { display: flex; gap: 6px; justify-content: center; min-height: 40px; margin-bottom: 8px; flex-wrap: wrap; }
.mc-person { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
.mc-missionary { background: rgba(59,130,246,0.15); border: 2px solid rgba(59,130,246,0.4); }
.mc-cannibal { background: rgba(239,68,68,0.12); border: 2px solid rgba(239,68,68,0.35); }
.mc-person-icon { font-size: 1.2rem; }
.mc-bank-count { display: flex; gap: 14px; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-top: auto; padding-top: 12px; }

/* River */
.mc-river { display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; background: rgba(56,189,248,0.05); border-left: 2px dashed rgba(56,189,248,0.2); border-right: 2px dashed rgba(56,189,248,0.2); }
.mc-waves { display: flex; flex-direction: column; align-items: center; gap: 16px; color: rgba(56,189,248,0.35); font-size: 1.2rem; }
.mc-wave { animation: waveMove 2.5s ease-in-out infinite; }
.mc-wave:nth-child(2n) { animation-delay: -0.4s; }
@keyframes waveMove { 0%, 100% { transform: translateX(-4px); } 50% { transform: translateX(4px); } }
.mc-boat { position: absolute; font-size: 2rem; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); left: 8px; }
.mc-boat-right { left: auto; right: 8px; }
.mc-boat-icon { display: block; }
.mc-move-badge { position: absolute; bottom: 14px; background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4); padding: 3px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 600; color: #a5b4fc; white-space: nowrap; }

/* Status indicator */
.mc-status-indicator { text-align: center; font-size: 0.82rem; font-weight: 600; padding: 8px 14px; border-radius: 8px; margin-top: 12px; background: rgba(100,116,139,0.1); color: #cbd5e1; }
.mc-si-exploring { background: rgba(34,197,94,0.08); color: #86efac; }
.mc-si-success { background: rgba(139,92,246,0.1); color: #c4b5fd; }
.mc-si-failed { background: rgba(239,68,68,0.08); color: #fca5a5; }

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
.bs-op-dot.mc-exploring { background: #22c55e; }
.bs-op-dot.mc-failed { background: #ef4444; }
.bs-op-dot.mc-success { background: #8b5cf6; }
.bs-op-dot.mc-start { background: #3b82f6; }
.bs-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bs-metric { display: flex; flex-direction: column; }
.bs-metric-label { font-size: 0.7rem; color: #64748b; }
.bs-metric-value { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; }
.bs-step-detail { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; font-size: 0.78rem; color: #cbd5e1; font-family: 'Fira Code', monospace; }

/* Boat Info */
.mc-boat-info { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; }
.mc-info-row { display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 4px; }
.mc-info-label { color: #64748b; }
.mc-info-val { color: #e0e7ff; font-weight: 600; }
.mc-val-left { color: #86efac; }
.mc-val-right { color: #a5b4fc; }

/* Path Log */
.mc-path-log { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; max-height: 120px; overflow-y: auto; }
.mc-path-log::-webkit-scrollbar { width: 3px; }
.mc-path-log::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.3); border-radius: 2px; }
.mc-path-entry { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: #94a3b8; padding: 2px 0; }
.mc-path-current { color: #e0e7ff; font-weight: 600; }
.mc-path-num { font-weight: 700; color: #64748b; font-family: 'Fira Code', monospace; min-width: 24px; }
.mc-path-text { flex: 1; }
.mc-no-path { font-size: 0.72rem; color: #475569; font-style: italic; }

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
    .mc-scene { grid-template-columns: 1fr 80px 1fr; }
    .mc-person { width: 30px; height: 30px; }
    .mc-person-icon { font-size: 0.95rem; }
}
</style>
