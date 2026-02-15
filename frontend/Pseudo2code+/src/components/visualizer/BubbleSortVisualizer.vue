<template>
    <AuthNavbar />
    <main class="bs-page">
        <div class="bs-container">
            <!-- BACK BUTTON (original style) -->
            <div class="bs-top-bar">
                <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
                    <img :src="arrowLeft" class="arrow" />
                    Back
                </button>
            </div>

            <!-- TITLE -->
            <h1 class="bs-title">Bubble Sort</h1>

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
                            <span class="bs-icon">⤮</span> Randomize
                        </button>
                    </div>

                    <!-- Settings toggle -->
                    <button class="bs-btn bs-settings-toggle" @click="showSettings = !showSettings">
                        <span class="bs-icon">⚙</span> Settings
                    </button>

                    <div v-if="showSettings" class="bs-settings-body">
                        <div class="bs-setting-row">
                            <label>Size: <strong>{{ arraySize }}</strong></label>
                            <input type="range" min="5" max="30" v-model.number="arraySize" class="bs-slider" />
                        </div>
                        <div class="bs-setting-row">
                            <label>Speed: <strong>{{ speedPercent }}%</strong></label>
                            <input type="range" min="1" max="5" v-model.number="speedLevel" class="bs-slider" />
                        </div>
                    </div>

                    <!-- Custom Array Input -->
                    <div class="bs-custom-input">
                        <label>Custom Array:</label>
                        <div class="bs-input-row">
                            <input v-model="customInput" placeholder="e.g. 5,2,8,1,9" class="bs-text-input"
                                @keydown.enter="applyCustomArray" />
                            <button class="bs-btn bs-apply-btn" @click="applyCustomArray">Go</button>
                        </div>
                    </div>

                    <!-- Generate Code Button -->
                    <button class="bs-btn bs-code-btn" @click="goToGenerateCode">
                        <span class="bs-icon">{ }</span> Generate Code
                    </button>

                    <!-- Quick info -->
                    <div class="bs-info-block">
                        <p><strong>Size:</strong> {{ currentStep.array.length }}</p>
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
                            <span class="bs-dot comparing"></span>
                            <div><strong>Comparing</strong><br /><small>Elements being compared</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot swapping"></span>
                            <div><strong>Swapping</strong><br /><small>Elements being swapped</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot sorted"></span>
                            <div><strong>Sorted</strong><br /><small>Elements in final position</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot unsorted"></span>
                            <div><strong>Unsorted</strong><br /><small>Elements not yet processed</small></div>
                        </div>

                        <div class="bs-legend-note">
                            <h5>How to read the visualization:</h5>
                            <ul>
                                <li>Numbers show element values</li>
                                <li>Bottom numbers show array indices</li>
                                <li>Colors indicate current operation</li>
                                <li>Height represents value magnitude</li>
                            </ul>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: CHART -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <!-- Bar chart -->
                        <div class="bs-bars-container">
                            <div v-for="(value, i) in currentStep.array" :key="i" class="bs-bar-col">
                                <div class="bs-bar" :class="{
                                    comparing: currentStep.active.includes(i) && !currentStep.swap,
                                    swapping: currentStep.swap && currentStep.active.includes(i),
                                    sorted: (currentStep.sorted || []).includes(i),
                                }" :style="{ height: (value / maxValue) * 100 + '%' }">
                                    <span class="bs-bar-label">{{ value }}</span>
                                </div>
                                <span class="bs-bar-index">{{ i }}</span>
                            </div>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>Bubble Sort Chart - {{ currentStep.array.length }} elements</span>
                            <span>Max value: {{ maxValue }}</span>
                        </div>

                        <!-- Scrubber -->
                        <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1"
                            v-model.number="stepIndex" />
                    </div>

                    <!-- Status bar -->
                    <div class="bs-status-bar">{{ currentStep.explanation }}</div>

                    <!-- Complexity badges -->
                    <div class="bs-complexity-row">
                        <span class="bs-complexity-badge">Time Complexity: <strong>O(n²)</strong></span>
                        <span class="bs-complexity-badge">Space Complexity: <strong>O(1)</strong></span>
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
                        <span class="bs-op-dot comparing"></span>
                        {{ currentStep.explanation }}
                    </div>
                    <div v-if="sortedCount > 0" class="bs-op-item">
                        <span class="bs-op-dot sorted"></span>
                        Sorted from index {{ currentStep.array.length - sortedCount }} onwards
                    </div>

                    <!-- Algorithm Metrics -->
                    <h4 class="bs-inspector-label">ALGORITHM METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">Comparisons</span>
                            <span class="bs-metric-value">{{ metrics.comparisons }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Swaps</span>
                            <span class="bs-metric-value">{{ metrics.swaps }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Pass</span>
                            <span class="bs-metric-value">{{ metrics.pass }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Efficiency</span>
                            <span class="bs-metric-value">{{ metrics.efficiency }}%</span>
                        </div>
                    </div>

                    <!-- Current Step -->
                    <h4 class="bs-inspector-label">CURRENT STEP</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>

                    <!-- Array State -->
                    <h4 class="bs-inspector-label">ARRAY STATE</h4>
                    <div class="bs-array-state">
                        [{{ currentStep.array.join(', ') }}]
                    </div>
                    <div class="bs-array-length">Length: {{ currentStep.array.length }} elements</div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ⓘ button ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle">ⓘ</span>
                    How Bubble Sort Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>
                        Bubble Sort is one of the simplest sorting algorithms to understand. It works by repeatedly
                        stepping through the list, comparing adjacent elements and swapping them if they are in the
                        wrong order.
                    </p>

                    <h3>How it works:</h3>
                    <ol>
                        <li>Start at the beginning of the array</li>
                        <li>Compare each pair of adjacent elements</li>
                        <li>If they're in the wrong order, swap them</li>
                        <li>Continue until you reach the end of the array</li>
                        <li>Repeat the process, but ignore the last element (it's now sorted)</li>
                        <li>Continue until no swaps are needed</li>
                    </ol>

                    <h3>Why "Bubble" Sort?</h3>
                    <p>
                        The algorithm gets its name because smaller elements "bubble" to the beginning of the list,
                        just like air bubbles rising to the surface of water.
                    </p>

                    <h3>Complexity Analysis:</h3>
                    <ul>
                        <li><strong>Best Case:</strong> O(n) – when the array is already sorted</li>
                        <li><strong>Average Case:</strong> O(n²) – typical random data</li>
                        <li><strong>Worst Case:</strong> O(n²) – when the array is reverse sorted</li>
                        <li><strong>Space Complexity:</strong> O(1) – only requires constant extra space</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EDGE CASES & EXAMPLES ⓘ button ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showEdgeCases = !showEdgeCases">
                    <span class="bs-info-circle">ⓘ</span>
                    Edge Cases &amp; Examples
                </button>
                <div v-if="showEdgeCases" class="bs-section-body">
                    <h3>Test These Edge Cases:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card" @click="loadEdgeCase([1,2,3,4,5])">
                            <strong>Already Sorted: [1,2,3,4,5]</strong>
                            <small>Best case scenario – only one pass needed</small>
                        </div>
                        <div class="bs-edge-card" @click="loadEdgeCase([5,4,3,2,1])">
                            <strong>Reverse Sorted: [5,4,3,2,1]</strong>
                            <small>Worst case – maximum swaps required</small>
                        </div>
                        <div class="bs-edge-card" @click="loadEdgeCase([3,1,4,1,5,9,2,6,5])">
                            <strong>Duplicates: [3,1,4,1,5,9,2,6,5]</strong>
                            <small>Bubble sort is stable – maintains relative order</small>
                        </div>
                        <div class="bs-edge-card" @click="loadEdgeCase([42])">
                            <strong>Single Element: [42]</strong>
                            <small>Trivial case – already sorted</small>
                        </div>
                    </div>

                    <h3>Performance Tips:</h3>
                    <ul class="bs-tips">
                        <li>Bubble sort is stable – equal elements maintain their relative order</li>
                        <li>It's adaptive – performs better on partially sorted data</li>
                        <li>In-place sorting – requires only O(1) additional memory</li>
                        <li>Early termination – stops when no swaps are made in a pass</li>
                    </ul>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthNavbar from '../Navbar/AuthNavbar.vue'
import arrowLeft from '@/assets/arrow-left.svg'
import { generateBubbleSortSteps } from '@/algorithms/sorting/bubbleSortSteps'

const router = useRouter() 

// ─── State ──────────────────────────────────
const arraySize = ref(10)
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)
const customInput = ref('')

const randomArray = (len = arraySize.value) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 20) + 1)

const baseArray = ref(randomArray())
const steps = ref(generateBubbleSortSteps(baseArray.value))
const stepIndex = ref(0)
const playing = ref(false)

const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() =>
    steps.value[stepIndex.value] || { array: [], active: [], swap: false, sorted: [], explanation: '' }
)
const maxValue = computed(() =>
    currentStep.value.array.length ? Math.max(...currentStep.value.array) : 1
)
const progressPercent = computed(() =>
    totalSteps.value > 1
        ? Math.round((stepIndex.value / (totalSteps.value - 1)) * 100)
        : 100
)
const speedPercent = computed(() => speedLevel.value * 20)
const sortedCount = computed(() => (currentStep.value.sorted || []).length)

// ─── Algorithm Metrics (accumulated up to current step) ─────
const metrics = computed(() => {
    let comparisons = 0
    let swaps = 0
    let pass = 0
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.explanation.startsWith('Compare')) comparisons++
        if (s.swap) swaps++
        if (s.explanation.startsWith('Start pass')) pass++
    }
    const maxComparisons = currentStep.value.array.length * (currentStep.value.array.length - 1) / 2
    const efficiency = maxComparisons > 0 ? Math.round((1 - swaps / maxComparisons) * 100) : 100
    return { comparisons, swaps, pass, efficiency }
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
    baseArray.value = randomArray()
    steps.value = generateBubbleSortSteps(baseArray.value)
    stepIndex.value = 0
}

function generateRandom() { reset() }

function applyCustomArray() {
    const arr = customInput.value
        .split(',')
        .map(n => Number(n.trim()))
        .filter(n => !isNaN(n) && n > 0)
    if (arr.length < 2) return
    pause()
    baseArray.value = arr
    steps.value = generateBubbleSortSteps(arr)
    stepIndex.value = 0
}

function goToGenerateCode() {
    const prompt = `Write a program for the Bubble Sort algorithm.\nTake a random input array.`
    router.push({ path: '/generate-code', query: { prompt } })
}

function loadEdgeCase(arr) {
    pause()
    baseArray.value = [...arr]
    steps.value = generateBubbleSortSteps(baseArray.value)
    stepIndex.value = 0
}

watch(speedLevel, () => {
    if (playing.value) { pause(); play() }
})

watch(arraySize, (newSize) => {
    pause()
    baseArray.value = randomArray(newSize)
    steps.value = generateBubbleSortSteps(baseArray.value)
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

/* ════════ BACK (original style) ════════ */
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

/* Custom input */
.bs-custom-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.bs-custom-input label {
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 600;
}
.bs-input-row {
    display: flex;
    gap: 4px;
}
.bs-text-input {
    flex: 1;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(100, 116, 139, 0.35);
    color: #e0e7ff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    outline: none;
}
.bs-text-input:focus {
    border-color: #6366f1;
}
.bs-text-input::placeholder {
    color: #475569;
    font-size: 0.72rem;
}
.bs-apply-btn {
    padding: 6px 12px !important;
    background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
    border: none !important;
    color: white !important;
    font-weight: 600 !important;
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
.bs-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.bs-btn.active { background: rgba(99, 102, 241, 0.3); border-color: rgba(99,102,241,0.5); }
.bs-icon { font-size: 0.9rem; }

.bs-settings-toggle { width: 100%; justify-content: center; }

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
.bs-legend-item small { color: #64748b; }
.bs-dot {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    flex-shrink: 0;
    margin-top: 2px;
}
.bs-dot.comparing { background: #eab308; }
.bs-dot.swapping  { background: #ef4444; }
.bs-dot.sorted    { background: #22c55e; }
.bs-dot.unsorted  { background: #475569; }

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
.bs-legend-note li { margin-bottom: 2px; }

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

.bs-bars-container {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 280px;
    padding-bottom: 4px;
}

.bs-bar-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
}

.bs-bar {
    width: 100%;
    border-radius: 4px 4px 0 0;
    background: #475569;
    transition: all 0.25s ease;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    position: relative;
    min-height: 18px;
}

.bs-bar-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: #f1f5f9;
    padding-top: 2px;
}

.bs-bar-index {
    font-size: 0.6rem;
    color: #64748b;
    margin-top: 2px;
}

.bs-bar.comparing { background: #eab308; }
.bs-bar.swapping  { background: #ef4444; }
.bs-bar.sorted    { background: #22c55e; }

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
.bs-complexity-badge strong { color: #e0e7ff; }

/* ════════ INSPECTOR ════════ */
.bs-inspector {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
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
.bs-op-dot.comparing { background: #eab308; }
.bs-op-dot.sorted    { background: #22c55e; }

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

.bs-array-state {
    background: rgba(15, 23, 42, 0.5);
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 0.72rem;
    color: #cbd5e1;
    font-family: 'Fira Code', monospace;
    word-break: break-all;
    line-height: 1.5;
}
.bs-array-length {
    font-size: 0.7rem;
    color: #64748b;
    margin-top: 4px;
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
.bs-section-toggle:hover { background: rgba(100, 116, 139, 0.1); }
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
.bs-section-body li { margin-bottom: 3px; }

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
    .bs-controls-panel {
        max-height: none;
    }
    .bs-inspector {
        max-height: none;
    }
}

@media (max-width: 640px) {
    .bs-edge-grid {
        grid-template-columns: 1fr;
    }
    .bs-page {
        padding: 12px;
    }
}
</style>
