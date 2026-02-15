<template>
    <AuthNavbar />
    <main class="sv-page">
        <div class="sv-container">
            <div class="sv-top-bar">
                <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
                    <img :src="arrowLeft" class="arrow" /> Back
                </button>
            </div>
            <h1 class="sv-title">Heap Sort</h1>

            <div class="sv-three-col">
                <aside class="sv-controls-panel">
                    <div class="sv-btn-group">
                        <button class="sv-btn" :class="{ active: playing }" @click="playing ? pause() : play()"><span class="sv-icon">▶</span> {{ playing ? 'Pause' : 'Play' }}</button>
                        <button class="sv-btn" @click="next" :disabled="stepIndex === steps.length - 1"><span class="sv-icon">⏭</span> Step</button>
                    </div>
                    <div class="sv-btn-group">
                        <button class="sv-btn" @click="reset"><span class="sv-icon">↺</span> Reset</button>
                        <button class="sv-btn" @click="generateRandom"><span class="sv-icon">⤮</span> Randomize</button>
                    </div>
                    <button class="sv-btn sv-settings-toggle" @click="showSettings = !showSettings"><span class="sv-icon">⚙</span> Settings</button>
                    <div v-if="showSettings" class="sv-settings-body">
                        <div class="sv-setting-row"><label>Size: <strong>{{ arraySize }}</strong></label><input type="range" min="5" max="30" v-model.number="arraySize" class="sv-slider" /></div>
                        <div class="sv-setting-row"><label>Speed: <strong>{{ speedPercent }}%</strong></label><input type="range" min="1" max="5" v-model.number="speedLevel" class="sv-slider" /></div>
                    </div>
                    <div class="sv-custom-input"><label>Custom Array:</label>
                        <div class="sv-input-row"><input v-model="customInput" placeholder="e.g. 5,2,8,1,9" class="sv-text-input" @keydown.enter="applyCustomArray" /><button class="sv-btn sv-apply-btn" @click="applyCustomArray">Go</button></div>
                    </div>
                    <button class="sv-btn sv-code-btn" @click="goToGenerateCode"><span class="sv-icon">{ }</span> Generate Code</button>
                    <div class="sv-info-block"><p><strong>Size:</strong> {{ currentStep.array.length }}</p><p><strong>Speed:</strong> {{ speedPercent }}%</p></div>
                    <div class="sv-shortcuts"><h4>Keyboard Shortcuts:</h4><div class="sv-shortcut-grid"><span class="sv-key">Space</span><span>Play/Pause</span><span class="sv-key">→</span><span>Step Forward</span><span class="sv-key">←</span><span>Step Back</span><span class="sv-key">R</span><span>Reset</span></div></div>
                    <div class="sv-legend"><h4>Legend</h4>
                        <div class="sv-legend-item"><span class="sv-dot comparing"></span><div><strong>Comparing</strong><br/><small>Elements being compared</small></div></div>
                        <div class="sv-legend-item"><span class="sv-dot swapping"></span><div><strong>Swapping</strong><br/><small>Elements being swapped</small></div></div>
                        <div class="sv-legend-item"><span class="sv-dot pivot"></span><div><strong>Heap Root</strong><br/><small>Current root / heapify target</small></div></div>
                        <div class="sv-legend-item"><span class="sv-dot range"></span><div><strong>Heap Range</strong><br/><small>Active heap bounds</small></div></div>
                        <div class="sv-legend-item"><span class="sv-dot sorted"></span><div><strong>Sorted</strong><br/><small>Elements in final position</small></div></div>
                        <div class="sv-legend-item"><span class="sv-dot unsorted"></span><div><strong>Unsorted</strong><br/><small>Elements not yet processed</small></div></div>
                        <div class="sv-legend-note"><h5>How to read the visualization:</h5><ul><li>Numbers show element values</li><li>Bottom numbers show array indices</li><li>Colors indicate current operation</li><li>Height represents value magnitude</li></ul></div>
                    </div>
                </aside>

                <div class="sv-chart-area">
                    <div class="sv-chart-wrapper">
                        <div class="sv-bars-container">
                            <div v-for="(value, i) in currentStep.array" :key="i" class="sv-bar-col">
                                <div class="sv-bar" :class="barClass(i)" :style="{ height: (value / maxValue) * 100 + '%' }">
                                    <span class="sv-bar-label">{{ value }}</span>
                                </div><span class="sv-bar-index">{{ i }}</span>
                            </div>
                        </div>
                        <div class="sv-chart-footer"><span>Heap Sort Chart - {{ currentStep.array.length }} elements</span><span>Max value: {{ maxValue }}</span></div>
                        <input type="range" class="sv-scrubber" min="0" :max="steps.length - 1" v-model.number="stepIndex" />
                    </div>
                    <div class="sv-status-bar">{{ currentStep.explanation }}</div>
                    <div class="sv-complexity-row"><span class="sv-complexity-badge">Time Complexity: <strong>O(n log n)</strong></span><span class="sv-complexity-badge">Space Complexity: <strong>O(1)</strong></span></div>
                </div>

                <aside class="sv-inspector">
                    <div class="sv-inspector-header"><h3>Inspector</h3><span class="sv-step-badge">Step {{ currentStepNumber }} of {{ totalSteps }}</span></div>
                    <div class="sv-inspector-row"><span>Progress</span><span>{{ progressPercent }}%</span></div>
                    <div class="sv-progress-track"><div class="sv-progress-fill" :style="{ width: progressPercent + '%' }"></div></div>
                    <h4 class="sv-inspector-label">CURRENT OPERATION</h4>
                    <div class="sv-op-item"><span class="sv-op-dot comparing"></span>{{ currentStep.explanation }}</div>
                    <div v-if="currentStep.pivot != null" class="sv-op-item"><span class="sv-op-dot pivot"></span>Heapify at index: {{ currentStep.pivot }}</div>
                    <div v-if="sortedCount > 0" class="sv-op-item"><span class="sv-op-dot sorted"></span>Sorted: {{ sortedCount }} elements</div>
                    <h4 class="sv-inspector-label">ALGORITHM METRICS</h4>
                    <div class="sv-metrics-grid">
                        <div class="sv-metric"><span class="sv-metric-label">Comparisons</span><span class="sv-metric-value">{{ metrics.comparisons }}</span></div>
                        <div class="sv-metric"><span class="sv-metric-label">Swaps</span><span class="sv-metric-value">{{ metrics.swaps }}</span></div>
                        <div class="sv-metric"><span class="sv-metric-label">Heapify Ops</span><span class="sv-metric-value">{{ metrics.heapOps }}</span></div>
                        <div class="sv-metric"><span class="sv-metric-label">Efficiency</span><span class="sv-metric-value">{{ metrics.efficiency }}%</span></div>
                    </div>
                    <h4 class="sv-inspector-label">CURRENT STEP</h4>
                    <div class="sv-step-detail">{{ currentStep.explanation }}</div>
                    <h4 class="sv-inspector-label">ARRAY STATE</h4>
                    <div class="sv-array-state">[{{ currentStep.array.join(', ') }}]</div>
                    <div class="sv-array-length">Length: {{ currentStep.array.length }} elements</div>
                </aside>
            </div>

            <section class="sv-section">
                <button class="sv-section-toggle" @click="showHowItWorks = !showHowItWorks"><span class="sv-info-circle">ⓘ</span> How Heap Sort Works</button>
                <div v-if="showHowItWorks" class="sv-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>Heap Sort uses a binary heap data structure to sort elements. It first builds a max-heap from the array, then repeatedly extracts the maximum element and places it at the end of the sorted portion.</p>
                    <h3>How it works:</h3>
                    <ol><li>Build a max-heap from the input array (heapify)</li><li>Swap the root (maximum) with the last unsorted element</li><li>Reduce the heap size by one</li><li>Restore the heap property by sifting down</li><li>Repeat until the heap is empty</li></ol>
                    <h3>Why "Heap" Sort?</h3>
                    <p>The algorithm leverages the <strong>max-heap</strong> data structure, where the largest element is always at the root, making extraction efficient.</p>
                    <h3>Complexity Analysis:</h3>
                    <ul><li><strong>Best Case:</strong> O(n log n)</li><li><strong>Average Case:</strong> O(n log n)</li><li><strong>Worst Case:</strong> O(n log n) – guaranteed performance</li><li><strong>Space Complexity:</strong> O(1) – in-place sorting</li></ul>
                </div>
            </section>

            <section class="sv-section">
                <button class="sv-section-toggle" @click="showEdgeCases = !showEdgeCases"><span class="sv-info-circle">ⓘ</span> Edge Cases &amp; Examples</button>
                <div v-if="showEdgeCases" class="sv-section-body">
                    <h3>Test These Edge Cases:</h3>
                    <div class="sv-edge-grid">
                        <div class="sv-edge-card" @click="loadEdgeCase([1,2,3,4,5])"><strong>Already Sorted: [1,2,3,4,5]</strong><small>Still builds heap – consistent O(n log n)</small></div>
                        <div class="sv-edge-card" @click="loadEdgeCase([5,4,3,2,1])"><strong>Reverse Sorted (Max-Heap): [5,4,3,2,1]</strong><small>Already a max-heap – minimal build work</small></div>
                        <div class="sv-edge-card" @click="loadEdgeCase([3,1,4,1,5,9,2,6,5])"><strong>Duplicates: [3,1,4,1,5,9,2,6,5]</strong><small>Heap sort is NOT stable – duplicates may reorder</small></div>
                        <div class="sv-edge-card" @click="loadEdgeCase([42])"><strong>Single Element: [42]</strong><small>Trivial case – already sorted</small></div>
                    </div>
                    <h3>Performance Tips:</h3>
                    <ul class="sv-tips"><li>Heap sort is <strong>NOT stable</strong> – equal elements may change relative order</li><li>In-place – requires only O(1) extra memory</li><li>Guaranteed O(n log n) – no worst-case degradation</li><li>Often used as a fallback in hybrid sorts like Introsort</li></ul>
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
import { generateHeapSortSteps } from '@/algorithms/sorting/heapSortSteps'

const router = useRouter()
const arraySize = ref(10)
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)
const customInput = ref('')
const randomArray = (len = arraySize.value) => Array.from({ length: len }, () => Math.floor(Math.random() * 20) + 1)
const baseArray = ref(randomArray())
const steps = ref(generateHeapSortSteps(baseArray.value))
const stepIndex = ref(0)
const playing = ref(false)
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const currentStep = computed(() => steps.value[stepIndex.value] || { array: [], active: [], swap: false, sorted: [], explanation: '', pivot: null, range: null })
const maxValue = computed(() => currentStep.value.array.length ? Math.max(...currentStep.value.array) : 1)
const progressPercent = computed(() => totalSteps.value > 1 ? Math.round((stepIndex.value / (totalSteps.value - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)
const sortedCount = computed(() => (currentStep.value.sorted || []).length)

function barClass(i) {
    const s = currentStep.value
    if ((s.sorted || []).includes(i)) return 'sorted'
    if (s.pivot != null && i === s.pivot) return 'pivot'
    if (s.active.includes(i) && s.swap) return 'swapping'
    if (s.active.includes(i)) return 'comparing'
    if (s.range && i >= s.range[0] && i <= s.range[1]) return 'range'
    return ''
}

const metrics = computed(() => {
    let comparisons = 0, swaps = 0, heapOps = 0
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.explanation.includes('Compare') || s.explanation.includes('compare')) comparisons++
        if (s.swap) swaps++
        if (s.explanation.includes('Heapify') || s.explanation.includes('heapify') || s.explanation.includes('Sift') || s.explanation.includes('sift') || s.explanation.includes('Build')) heapOps++
    }
    const n = currentStep.value.array.length
    const maxC = n * Math.ceil(Math.log2(n || 1))
    const efficiency = maxC > 0 ? Math.round((1 - comparisons / maxC) * 100) : 100
    return { comparisons, swaps, heapOps, efficiency }
})
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))
let timer = null
function play() { if (playing.value) return; playing.value = true; timer = setInterval(() => { if (stepIndex.value < steps.value.length - 1) stepIndex.value++; else pause() }, speedDelay.value) }
function pause() { playing.value = false; clearInterval(timer) }
function next() { pause(); if (stepIndex.value < steps.value.length - 1) stepIndex.value++ }
function prev() { pause(); if (stepIndex.value > 0) stepIndex.value-- }
function reset() { pause(); baseArray.value = randomArray(); steps.value = generateHeapSortSteps(baseArray.value); stepIndex.value = 0 }
function generateRandom() { reset() }
function applyCustomArray() { const arr = customInput.value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n) && n > 0); if (arr.length < 2) return; pause(); baseArray.value = arr; steps.value = generateHeapSortSteps(arr); stepIndex.value = 0 }
function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: 'Write a program for the Heap Sort algorithm.\nTake a random input array.' } }) }
function loadEdgeCase(arr) { pause(); baseArray.value = [...arr]; steps.value = generateHeapSortSteps(baseArray.value); stepIndex.value = 0 }
watch(speedLevel, () => { if (playing.value) { pause(); play() } })
watch(arraySize, (n) => { pause(); baseArray.value = randomArray(n); steps.value = generateHeapSortSteps(baseArray.value); stepIndex.value = 0 })
function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.sv-page{min-height:100vh;background:radial-gradient(ellipse at top,#0f172a 0%,#020617 70%);color:#e2e8f0;padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}.sv-container{max-width:1440px;margin:0 auto}.sv-top-bar{flex-shrink:0}.back-btn-compact{display:flex;align-items:center;gap:6px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#e0e7ff;padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}.back-btn-compact:hover{background:rgba(99,102,241,.25);transform:translateX(-2px)}.arrow{width:16px;height:16px}.sv-title{font-size:1.6rem;font-weight:700;color:#f1f5f9;margin:0 0 16px}.sv-three-col{display:grid;grid-template-columns:240px 1fr 280px;gap:16px;margin-bottom:24px}.sv-controls-panel{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}.sv-custom-input{display:flex;flex-direction:column;gap:4px}.sv-custom-input label{font-size:.75rem;color:#94a3b8;font-weight:600}.sv-input-row{display:flex;gap:4px}.sv-text-input{flex:1;background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.35);color:#e0e7ff;padding:6px 10px;border-radius:6px;font-size:.8rem;outline:none}.sv-text-input:focus{border-color:#6366f1}.sv-text-input::placeholder{color:#475569;font-size:.72rem}.sv-apply-btn{padding:6px 12px!important;background:linear-gradient(135deg,#6366f1,#8b5cf6)!important;border:none!important;color:#fff!important;font-weight:600!important}.sv-code-btn{width:100%;justify-content:center;background:rgba(99,102,241,.15)!important;border-color:rgba(99,102,241,.35)!important;color:#a5b4fc!important}.sv-code-btn:hover{background:rgba(99,102,241,.28)!important}.sv-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}.sv-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.12);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}.sv-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}.sv-btn:disabled{opacity:.4;cursor:not-allowed}.sv-btn.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.5)}.sv-icon{font-size:.9rem}.sv-settings-toggle{width:100%;justify-content:center}.sv-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:rgba(15,23,42,.5);border-radius:8px}.sv-setting-row label{font-size:.78rem;color:#94a3b8}.sv-slider{width:100%;cursor:pointer;accent-color:#818cf8}.sv-info-block{font-size:.78rem;color:#94a3b8;display:flex;justify-content:space-between}.sv-shortcuts h4{font-size:.78rem;color:#94a3b8;margin:0 0 6px;font-weight:600}.sv-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:#94a3b8}.sv-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:#e0e7ff;font-size:.72rem;text-align:center}.sv-legend h4{font-size:.82rem;color:#f1f5f9;margin:0 0 8px}.sv-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:#cbd5e1}.sv-legend-item small{color:#64748b}.sv-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}.sv-dot.comparing{background:#eab308}.sv-dot.swapping{background:#ef4444}.sv-dot.pivot{background:#a855f7}.sv-dot.range{background:#6366f1;outline:2px dashed rgba(99,102,241,.6);outline-offset:-2px}.sv-dot.sorted{background:#22c55e}.sv-dot.unsorted{background:#475569}.sv-legend-note{margin-top:8px;font-size:.72rem;color:#64748b}.sv-legend-note h5{margin:0 0 4px;font-weight:600;color:#94a3b8;font-size:.72rem}.sv-legend-note ul{margin:0;padding-left:14px}.sv-legend-note li{margin-bottom:2px}.sv-chart-area{display:flex;flex-direction:column;gap:10px}.sv-chart-wrapper{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:16px 16px 8px;display:flex;flex-direction:column}.sv-bars-container{display:flex;align-items:flex-end;gap:4px;height:280px;padding-bottom:4px}.sv-bar-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end}.sv-bar{width:100%;border-radius:4px 4px 0 0;background:#475569;transition:all .25s ease;display:flex;align-items:flex-start;justify-content:center;position:relative;min-height:18px}.sv-bar-label{font-size:.65rem;font-weight:600;color:#f1f5f9;padding-top:2px}.sv-bar-index{font-size:.6rem;color:#64748b;margin-top:2px}.sv-bar.comparing{background:#eab308}.sv-bar.swapping{background:#ef4444}.sv-bar.pivot{background:#a855f7}.sv-bar.range{background:#6366f1;outline:2px dashed rgba(99,102,241,.6);outline-offset:-2px}.sv-bar.sorted{background:#22c55e}.sv-chart-footer{display:flex;justify-content:space-between;font-size:.72rem;color:#64748b;padding:6px 0 4px}.sv-scrubber{width:100%;accent-color:#818cf8;cursor:pointer;margin-top:4px}.sv-status-bar{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:#e2e8f0;font-weight:500}.sv-complexity-row{display:flex;justify-content:center;gap:32px}.sv-complexity-badge{font-size:.82rem;color:#94a3b8}.sv-complexity-badge strong{color:#e0e7ff}.sv-inspector{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px}.sv-inspector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.sv-inspector-header h3{margin:0;font-size:1rem;color:#f1f5f9}.sv-step-badge{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);padding:3px 10px;border-radius:12px;font-size:.72rem;color:#a5b4fc;font-weight:600}.sv-inspector-row{display:flex;justify-content:space-between;font-size:.78rem;color:#94a3b8;margin-bottom:4px}.sv-progress-track{width:100%;height:6px;background:rgba(100,116,139,.2);border-radius:3px;margin-bottom:16px;overflow:hidden}.sv-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#818cf8);border-radius:3px;transition:width .25s}.sv-inspector-label{font-size:.7rem;letter-spacing:.06em;color:#64748b;margin:14px 0 6px;font-weight:700}.sv-op-item{display:flex;align-items:center;gap:8px;font-size:.78rem;color:#cbd5e1;margin-bottom:4px}.sv-op-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}.sv-op-dot.comparing{background:#eab308}.sv-op-dot.pivot{background:#a855f7}.sv-op-dot.sorted{background:#22c55e}.sv-metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.sv-metric{display:flex;flex-direction:column}.sv-metric-label{font-size:.7rem;color:#64748b}.sv-metric-value{font-size:1.15rem;font-weight:700;color:#f1f5f9}.sv-step-detail{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.78rem;color:#cbd5e1;font-family:'Fira Code',monospace}.sv-array-state{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.72rem;color:#cbd5e1;font-family:'Fira Code',monospace;word-break:break-all;line-height:1.5}.sv-array-length{font-size:.7rem;color:#64748b;margin-top:4px}.sv-section{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;margin-bottom:12px;overflow:hidden}.sv-section-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:14px 18px;background:none;border:none;color:#e2e8f0;font-size:1rem;font-weight:600;cursor:pointer;text-align:left;transition:background .15s}.sv-section-toggle:hover{background:rgba(100,116,139,.1)}.sv-info-circle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);color:#a5b4fc;font-size:.82rem;font-weight:700;flex-shrink:0}.sv-section-body{padding:0 20px 20px;color:#cbd5e1;font-size:.88rem;line-height:1.7}.sv-section-body h2{font-size:1.15rem;color:#f1f5f9;margin:0 0 8px}.sv-section-body h3{font-size:.95rem;color:#e0e7ff;margin:16px 0 6px}.sv-section-body ol,.sv-section-body ul{padding-left:20px;margin:4px 0}.sv-section-body li{margin-bottom:3px}.sv-edge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}.sv-edge-card{background:rgba(15,23,42,.5);border:1px solid rgba(100,116,139,.3);border-radius:10px;padding:14px;cursor:pointer;transition:all .15s}.sv-edge-card:hover{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.08)}.sv-edge-card strong{display:block;color:#f1f5f9;font-size:.88rem;margin-bottom:4px}.sv-edge-card small{color:#64748b;font-size:.78rem}.sv-tips{padding-left:20px}.sv-tips li{margin-bottom:4px}
@media(max-width:1100px){.sv-three-col{grid-template-columns:1fr}}
@media(max-width:640px){.sv-edge-grid{grid-template-columns:1fr}.sv-page{padding:12px}}
</style>