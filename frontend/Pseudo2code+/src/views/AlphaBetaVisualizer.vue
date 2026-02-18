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
            <h1 class="bs-title">Alpha-Beta Pruning — Tic-Tac-Toe</h1>

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
                        <p><strong>α:</strong> Best for MAX</p>
                        <p><strong>β:</strong> Best for MIN</p>
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
                            <span class="bs-dot ab-start"></span>
                            <div><strong>Start</strong><br /><small>Initial state</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot ab-maximizing"></span>
                            <div><strong>Maximizing</strong><br /><small>X's turn (max α)</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot ab-minimizing"></span>
                            <div><strong>Minimizing</strong><br /><small>O's turn (min β)</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot ab-pruned"></span>
                            <div><strong>Pruned</strong><br /><small>Branch cut off</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot ab-success"></span>
                            <div><strong>Complete</strong><br /><small>Search finished</small></div>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: GAME BOARD VISUALIZATION -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <div class="ab-board-container">
                            <!-- Tic-Tac-Toe Board -->
                            <div class="ab-board">
                                <div v-for="(row, ri) in currentStep.board" :key="ri" class="ab-row">
                                    <div v-for="(cell, ci) in row" :key="ci" class="ab-cell" :class="{
                                        'ab-cell-x': cell === 'X',
                                        'ab-cell-o': cell === 'O',
                                        'ab-cell-highlight': currentStep.currentMove && currentStep.currentMove.row === ri && currentStep.currentMove.col === ci,
                                        'ab-cell-pruned': currentStep.pruned,
                                    }">
                                        <span v-if="cell === 'X'" class="ab-mark ab-x"><X :size="20" /></span>
                                        <span v-else-if="cell === 'O'" class="ab-mark ab-o"><Circle :size="20" /></span>
                                    </div>
                                </div>
                            </div>

                            <!-- Alpha-Beta Values Display -->
                            <div class="ab-values-panel">
                                <div class="ab-value-box ab-alpha-box">
                                    <span class="ab-val-label">α (Alpha)</span>
                                    <span class="ab-val-num">{{ formatAB(currentStep.alpha) }}</span>
                                    <span class="ab-val-desc">Best for MAX</span>
                                </div>
                                <div class="ab-value-box ab-beta-box">
                                    <span class="ab-val-label">β (Beta)</span>
                                    <span class="ab-val-num">{{ formatAB(currentStep.beta) }}</span>
                                    <span class="ab-val-desc">Best for MIN</span>
                                </div>
                            </div>

                            <!-- Status / Pruning indicator -->
                            <div class="ab-status-badge" :class="{
                                'ab-sb-max': currentStep.status === 'maximizing',
                                'ab-sb-min': currentStep.status === 'minimizing',
                                'ab-sb-pruned': currentStep.status === 'pruned',
                                'ab-sb-done': currentStep.status === 'success',
                            }">
                                <span v-if="currentStep.status === 'start'"><Gamepad2 :size="14" class="bs-lucide" /> Starting Alpha-Beta Pruning</span>
                                <span v-else-if="currentStep.status === 'maximizing'"><TrendingUp :size="14" class="bs-lucide" /> Maximizer (X) — depth {{ currentStep.depth }}</span>
                                <span v-else-if="currentStep.status === 'minimizing'"><TrendingDown :size="14" class="bs-lucide" /> Minimizer (O) — depth {{ currentStep.depth }}</span>
                                <span v-else-if="currentStep.status === 'pruned'"><Scissors :size="14" class="bs-lucide" /> PRUNED! β ≤ α — skipping branch</span>
                                <span v-else-if="currentStep.status === 'success'"><CheckCircle2 :size="14" class="bs-lucide" /> Alpha-Beta Complete</span>
                            </div>

                            <!-- Pruning flash overlay -->
                            <div v-if="currentStep.pruned" class="ab-prune-flash">
                                <span class="ab-prune-icon"><Scissors :size="18" /></span>
                                <span class="ab-prune-text">β({{ formatAB(currentStep.beta) }}) ≤ α({{ formatAB(currentStep.alpha) }})</span>
                            </div>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>Alpha-Beta Pruning — MinMax Optimization</span>
                            <span>Prunes unnecessary branches</span>
                        </div>

                        <!-- Scrubber -->
                        <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1"
                            v-model.number="stepIndex" />
                    </div>

                    <!-- Status bar -->
                    <div class="bs-status-bar">{{ currentStep.explanation }}</div>

                    <!-- Complexity badges -->
                    <div class="bs-complexity-row">
                        <span class="bs-complexity-badge">Best: <strong>O(b<sup>d/2</sup>)</strong></span>
                        <span class="bs-complexity-badge">Worst: <strong>O(b<sup>d</sup>)</strong></span>
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
                            'ab-maximizing': currentStep.status === 'maximizing',
                            'ab-minimizing': currentStep.status === 'minimizing',
                            'ab-pruned': currentStep.status === 'pruned',
                            'ab-success': currentStep.status === 'success',
                            'ab-start': currentStep.status === 'start',
                        }"></span>
                        {{ currentStep.explanation }}
                    </div>

                    <!-- Alpha-Beta Metrics -->
                    <h4 class="bs-inspector-label">ALGORITHM METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">Max Nodes</span>
                            <span class="bs-metric-value">{{ metrics.maxNodes }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Min Nodes</span>
                            <span class="bs-metric-value">{{ metrics.minNodes }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Pruned</span>
                            <span class="bs-metric-value ab-pruned-val">{{ metrics.pruned }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Current Depth</span>
                            <span class="bs-metric-value">{{ currentStep.depth }}</span>
                        </div>
                    </div>

                    <!-- Alpha-Beta Values -->
                    <h4 class="bs-inspector-label">α / β VALUES</h4>
                    <div class="ab-inspector-vals">
                        <div class="ab-insp-val">
                            <span class="ab-insp-label">Alpha (α):</span>
                            <span class="ab-insp-num ab-insp-alpha">{{ formatAB(currentStep.alpha) }}</span>
                        </div>
                        <div class="ab-insp-val">
                            <span class="ab-insp-label">Beta (β):</span>
                            <span class="ab-insp-num ab-insp-beta">{{ formatAB(currentStep.beta) }}</span>
                        </div>
                        <div class="ab-insp-val" v-if="currentStep.pruned">
                            <span class="ab-insp-label">Condition:</span>
                            <span class="ab-insp-num ab-insp-pruned">β ≤ α → PRUNE</span>
                        </div>
                    </div>

                    <!-- Current Step -->
                    <h4 class="bs-inspector-label">CURRENT STEP</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>

                    <!-- Board State -->
                    <h4 class="bs-inspector-label">BOARD STATE</h4>
                    <div class="ab-board-mini">
                        <div v-for="(row, ri) in currentStep.board" :key="ri" class="ab-mini-row">
                            <div v-for="(cell, ci) in row" :key="ci" class="ab-mini-cell">
                                {{ cell || '·' }}
                            </div>
                        </div>
                    </div>

                    <!-- Evaluation Log -->
                    <h4 class="bs-inspector-label">EVALUATION LOG</h4>
                    <div class="ab-eval-log">
                        <div v-for="(entry, i) in evalLog" :key="i" class="ab-eval-entry"
                            :class="{ 'ab-eval-current': i === evalLog.length - 1 }">
                            <span class="ab-eval-num">#{{ i + 1 }}</span>
                            <span class="ab-eval-dot" :class="{
                                'ab-maximizing': entry.status === 'maximizing',
                                'ab-minimizing': entry.status === 'minimizing',
                                'ab-pruned': entry.status === 'pruned',
                            }"></span>
                            <span class="ab-eval-text">{{ entry.label }}</span>
                        </div>
                        <span v-if="evalLog.length === 0" class="ab-no-eval">No evaluations yet</span>
                    </div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    How Alpha-Beta Pruning Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>
                        Alpha-Beta Pruning is an optimization of the MinMax algorithm. It eliminates branches of the
                        game tree that cannot possibly influence the final decision, dramatically reducing the number
                        of nodes evaluated.
                    </p>

                    <h3>Key Concepts:</h3>
                    <ol>
                        <li><strong>Alpha (α)</strong> — the best value that the Maximizer can guarantee at that level or above</li>
                        <li><strong>Beta (β)</strong> — the best value that the Minimizer can guarantee at that level or above</li>
                        <li><strong>Pruning Condition</strong> — if β ≤ α, the remaining branches are pruned (skipped)</li>
                        <li><strong>Same Result</strong> — always produces the same result as MinMax, just faster</li>
                    </ol>

                    <h3>How Pruning Saves Work:</h3>
                    <ul>
                        <li>If Maximizer already has a move scoring 5, and a branch shows Minimizer can force ≤ 3, skip that branch</li>
                        <li>The Maximizer would never choose that branch since a better option exists</li>
                        <li>In the best case, this reduces search from O(b<sup>d</sup>) to O(b<sup>d/2</sup>)</li>
                        <li>This means it can search twice as deep in the same time!</li>
                    </ul>

                    <h3>Complexity:</h3>
                    <ul>
                        <li><strong>Best Case:</strong> O(b<sup>d/2</sup>) — with perfect move ordering</li>
                        <li><strong>Worst Case:</strong> O(b<sup>d</sup>) — same as MinMax (no pruning)</li>
                        <li><strong>Space:</strong> O(d) — depth of the search tree</li>
                        <li><strong>Improvement:</strong> On average, prunes ~50% of the game tree</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EXAMPLES ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showExamples = !showExamples">
                    <span class="bs-info-circle"><Info :size="14" /></span>
                    Alpha-Beta vs MinMax
                </button>
                <div v-if="showExamples" class="bs-section-body">
                    <h3>Key Differences:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card">
                            <strong><Calculator :size="14" class="bs-lucide" /> MinMax</strong>
                            <small>Explores ALL branches. Complete but slower. O(b<sup>d</sup>) nodes.</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><Scissors :size="14" class="bs-lucide" /> Alpha-Beta</strong>
                            <small>Same result, fewer nodes. Prunes safe-to-ignore branches. Up to O(b<sup>d/2</sup>).</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><Zap :size="14" class="bs-lucide" /> Move Ordering</strong>
                            <small>Better ordering = more pruning. Check best moves first for maximum efficiency.</small>
                        </div>
                        <div class="bs-edge-card">
                            <strong><Target :size="14" class="bs-lucide" /> Same Optimality</strong>
                            <small>Alpha-Beta never changes the result — only the speed. Guaranteed optimal.</small>
                        </div>
                    </div>

                    <h3>Interesting Facts:</h3>
                    <ul class="bs-tips">
                        <li>Alpha-Beta was independently discovered by multiple researchers in the 1950s-60s</li>
                        <li>Deep Blue (chess computer) used Alpha-Beta with advanced move ordering</li>
                        <li>With perfect ordering, it effectively doubles the search depth</li>
                        <li>Watch for the prune events — those are saved computations!</li>
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
import { alphaBetaSteps } from '@/algorithms/aiProblems/alphaBetaSteps'
import { Gamepad2, TrendingUp, TrendingDown, Scissors, CheckCircle2, Calculator, Zap, Target, Play, SkipForward, RotateCcw, Settings2, Info, ArrowRight, ArrowLeft, X, Circle } from 'lucide-vue-next'

const router = useRouter()

// ─── State ──────────────────────────────────
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showExamples = ref(false)

const steps = ref(alphaBetaSteps())
const stepIndex = ref(0)
const playing = ref(false)

// ─── Computed ───────────────────────────────
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() =>
    steps.value[stepIndex.value] || {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        player: 'X',
        alpha: -Infinity,
        beta: Infinity,
        depth: 0,
        currentMove: null,
        pruned: false,
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

function formatAB(val) {
    if (val === -Infinity || val === -1/0) return '-∞'
    if (val === Infinity || val === 1/0) return '+∞'
    return Number(val).toFixed(1)
}

// ─── Algorithm Metrics ──────────────────────
const metrics = computed(() => {
    let maxNodes = 0, minNodes = 0, pruned = 0
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'maximizing') maxNodes++
        if (s.status === 'minimizing') minNodes++
        if (s.status === 'pruned') pruned++
    }
    return { maxNodes, minNodes, pruned }
})

// ─── Evaluation Log ─────────────────────────
const evalLog = computed(() => {
    const log = []
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'maximizing' || s.status === 'minimizing' || s.status === 'pruned') {
            let label = ''
            if (s.status === 'maximizing') label = `MAX d${s.depth} α=${formatAB(s.alpha)}`
            else if (s.status === 'minimizing') label = `MIN d${s.depth} β=${formatAB(s.beta)}`
            else if (s.status === 'pruned') label = `PRUNE β≤α`
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
    steps.value = alphaBetaSteps()
    stepIndex.value = 0
}

function goToGenerateCode() {
    const prompt = `Write a program implementing Alpha-Beta Pruning for Tic-Tac-Toe.\nThe algorithm is an optimization of MinMax that prunes branches where β ≤ α.\nInclude alpha and beta tracking, pruning logic, and the evaluation function.\nShow how pruned branches save computation compared to plain MinMax.`
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
.bs-dot.ab-start { background: #3b82f6; }
.bs-dot.ab-maximizing { background: #22c55e; }
.bs-dot.ab-minimizing { background: #ef4444; }
.bs-dot.ab-pruned { background: #f59e0b; }
.bs-dot.ab-success { background: #8b5cf6; }

/* ════════ CHART AREA ════════ */
.bs-chart-area { display: flex; flex-direction: column; gap: 10px; }
.bs-chart-wrapper { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 12px; padding: 16px 16px 8px; display: flex; flex-direction: column; }
.bs-chart-footer { display: flex; justify-content: space-between; font-size: 0.72rem; color: #64748b; padding: 6px 0 4px; }
.bs-scrubber { width: 100%; accent-color: #818cf8; cursor: pointer; margin-top: 4px; }
.bs-status-bar { background: rgba(30,41,59,0.65); border: 1px solid rgba(100,116,139,0.25); border-radius: 10px; padding: 12px 20px; text-align: center; font-size: 0.9rem; color: #e2e8f0; font-weight: 500; }
.bs-complexity-row { display: flex; justify-content: center; gap: 32px; }
.bs-complexity-badge { font-size: 0.82rem; color: #94a3b8; }
.bs-complexity-badge strong { color: #e0e7ff; }

/* ════════ TIC-TAC-TOE BOARD ════════ */
.ab-board-container { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 10px; min-height: 340px; position: relative; }

.ab-board { display: grid; grid-template-rows: repeat(3, 1fr); gap: 4px; background: rgba(100,116,139,0.3); padding: 4px; border-radius: 12px; }
.ab-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.ab-cell { width: 90px; height: 90px; background: rgba(15,23,42,0.8); border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; position: relative; }
.ab-cell-highlight { box-shadow: 0 0 16px rgba(245,158,11,0.5); border: 2px solid #f59e0b; }
.ab-cell-pruned { opacity: 0.5; }
.ab-cell-x { background: rgba(34,197,94,0.08); }
.ab-cell-o { background: rgba(239,68,68,0.08); }
.ab-mark { font-size: 2.4rem; font-weight: 700; line-height: 1; }
.ab-x { color: #22c55e; text-shadow: 0 0 12px rgba(34,197,94,0.4); }
.ab-o { color: #ef4444; text-shadow: 0 0 12px rgba(239,68,68,0.4); }

/* Alpha-Beta Values */
.ab-values-panel { display: flex; gap: 20px; justify-content: center; }
.ab-value-box { display: flex; flex-direction: column; align-items: center; padding: 12px 24px; border-radius: 12px; min-width: 120px; }
.ab-alpha-box { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.3); }
.ab-beta-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); }
.ab-val-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; color: #94a3b8; }
.ab-val-num { font-size: 1.6rem; font-weight: 800; color: #f1f5f9; font-family: 'Fira Code', monospace; margin: 4px 0 2px; }
.ab-val-desc { font-size: 0.68rem; color: #64748b; }

/* Status badge */
.ab-status-badge { padding: 8px 18px; border-radius: 10px; font-size: 0.82rem; font-weight: 600; text-align: center; background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.25); color: #cbd5e1; }
.ab-sb-max { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); color: #86efac; }
.ab-sb-min { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.25); color: #fca5a5; }
.ab-sb-pruned { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.35); color: #fbbf24; animation: pruneFlash 0.6s ease; }
.ab-sb-done { background: rgba(139,92,246,0.1); border-color: rgba(139,92,246,0.3); color: #c4b5fd; }

@keyframes pruneFlash {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(245,158,11,0.3); }
}

/* Prune flash overlay */
.ab-prune-flash { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(245,158,11,0.08); border: 1px dashed rgba(245,158,11,0.4); border-radius: 8px; animation: pruneFlash 0.6s ease; }
.ab-prune-icon { font-size: 1.3rem; }
.ab-prune-text { font-size: 0.78rem; font-weight: 600; color: #fbbf24; font-family: 'Fira Code', monospace; }

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
.bs-op-dot.ab-maximizing { background: #22c55e; }
.bs-op-dot.ab-minimizing { background: #ef4444; }
.bs-op-dot.ab-pruned { background: #f59e0b; }
.bs-op-dot.ab-success { background: #8b5cf6; }
.bs-op-dot.ab-start { background: #3b82f6; }
.bs-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bs-metric { display: flex; flex-direction: column; }
.bs-metric-label { font-size: 0.7rem; color: #64748b; }
.bs-metric-value { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; }
.ab-pruned-val { color: #fbbf24 !important; }
.bs-step-detail { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; font-size: 0.78rem; color: #cbd5e1; font-family: 'Fira Code', monospace; }

/* Alpha-Beta Inspector */
.ab-inspector-vals { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; }
.ab-insp-val { display: flex; justify-content: space-between; font-size: 0.78rem; padding: 3px 0; }
.ab-insp-label { color: #64748b; }
.ab-insp-num { font-weight: 700; font-family: 'Fira Code', monospace; }
.ab-insp-alpha { color: #86efac; }
.ab-insp-beta { color: #fca5a5; }
.ab-insp-pruned { color: #fbbf24; }

/* Mini Board */
.ab-board-mini { background: rgba(15,23,42,0.5); padding: 8px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.ab-mini-row { display: flex; gap: 2px; }
.ab-mini-cell { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; font-family: 'Fira Code', monospace; color: #94a3b8; background: rgba(100,116,139,0.15); border-radius: 4px; }

/* Eval Log */
.ab-eval-log { background: rgba(15,23,42,0.5); padding: 8px 10px; border-radius: 6px; max-height: 140px; overflow-y: auto; }
.ab-eval-log::-webkit-scrollbar { width: 3px; }
.ab-eval-log::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.3); border-radius: 2px; }
.ab-eval-entry { display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: #94a3b8; padding: 2px 0; }
.ab-eval-current { color: #e0e7ff; font-weight: 600; }
.ab-eval-num { font-weight: 700; color: #64748b; font-family: 'Fira Code', monospace; min-width: 24px; }
.ab-eval-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ab-eval-dot.ab-maximizing { background: #22c55e; }
.ab-eval-dot.ab-minimizing { background: #ef4444; }
.ab-eval-dot.ab-pruned { background: #f59e0b; }
.ab-eval-text { flex: 1; }
.ab-no-eval { font-size: 0.72rem; color: #475569; font-style: italic; }

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
    .ab-cell { width: 70px; height: 70px; }
    .ab-mark { font-size: 1.8rem; }
    .ab-values-panel { flex-direction: column; gap: 8px; }
}
</style>
