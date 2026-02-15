<template>
  <AuthNavbar />
  <main class="ao-page">
    <div class="ao-container">
      <div class="ao-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>
      <h1 class="ao-title">Array Operations</h1>
      <p class="ao-subtitle">Visualize common array operations step by step</p>

      <!-- Operation selector pills -->
      <div class="ao-op-pills">
        <button v-for="(op, key) in arrayOperations" :key="key" class="ao-pill" :class="{ active: selectedOp === key }"
          @click="selectOperation(key)">{{ op.label }}</button>
      </div>

      <!-- ═══════ THREE-COLUMN LAYOUT ═══════ -->
      <div class="ao-three-col">
        <!-- LEFT: Controls -->
        <aside class="ao-controls-panel">
          <div class="ao-btn-group">
            <button class="ao-btn" :class="{ active: playing }" @click="playing ? pause() : play()"
              :disabled="!isPlayable"><span class="ao-icon">▶</span> {{ playing ? 'Pause' : 'Play' }}</button>
            <button class="ao-btn" @click="next" :disabled="stepIndex === steps.length - 1"><span
                class="ao-icon">⏭</span> Step</button>
          </div>
          <div class="ao-btn-group">
            <button class="ao-btn" @click="reset"><span class="ao-icon">↺</span> Reset</button>
            <button class="ao-btn" @click="generateRandom"><span class="ao-icon">⤮</span> Randomize</button>
          </div>

          <button class="ao-btn ao-settings-toggle" @click="showSettings = !showSettings"><span
              class="ao-icon">⚙</span> Settings</button>
          <div v-if="showSettings" class="ao-settings-body">
            <div class="ao-setting-row"><label>Speed: <strong>{{ speedPercent }}%</strong></label><input type="range"
                min="1" max="5" v-model.number="speedLevel" class="ao-slider" /></div>
          </div>

          <!-- Custom Array -->
          <div class="ao-custom-input"><label>Custom Array:</label>
            <div class="ao-input-row"><input v-model="customInput" placeholder="e.g. 5,2,8,1,9" class="ao-text-input"
                @keydown.enter="applyCustomArray" /><button class="ao-btn ao-apply-btn"
                @click="applyCustomArray">Go</button></div>
          </div>

          <!-- Operation Params -->
          <div v-if="operationType" class="ao-op-params">
            <label class="ao-param-label">{{ paramHint }}</label>
            <input v-if="operationType === 'search'" v-model.number="opParams.target" type="number"
              placeholder="Target value" class="ao-text-input" />
            <template v-if="operationType === 'insert'">
              <input v-model.number="opParams.value" type="number" placeholder="Value to insert" class="ao-text-input" />
              <input v-if="operationMode === 'insertIndex'" v-model.number="opParams.index" type="number"
                placeholder="Index position" class="ao-text-input" />
            </template>
            <template v-if="operationType === 'update'">
              <input v-model.number="opParams.index" type="number" placeholder="Index" class="ao-text-input" />
              <input v-model.number="opParams.value" type="number" placeholder="New value" class="ao-text-input" />
            </template>
            <input v-if="operationMode === 'deleteIndex'" v-model.number="opParams.index" type="number"
              placeholder="Index to delete" class="ao-text-input" />
          </div>

          <button class="ao-btn ao-code-btn" @click="goToGenerateCode"><span class="ao-icon">{ }</span> Generate
            Code</button>

          <div class="ao-shortcuts">
            <h4>Keyboard Shortcuts:</h4>
            <div class="ao-shortcut-grid"><span class="ao-key">Space</span><span>Play/Pause</span><span
                class="ao-key">→</span><span>Step Forward</span><span class="ao-key">←</span><span>Step
                Back</span><span class="ao-key">R</span><span>Reset</span></div>
          </div>
          <div class="ao-legend">
            <h4>Legend</h4>
            <div class="ao-legend-item"><span class="ao-dot active"></span>
              <div><strong>Active</strong><br /><small>Currently visiting</small></div>
            </div>
            <div class="ao-legend-item"><span class="ao-dot found"></span>
              <div><strong>Found</strong><br /><small>Search target found</small></div>
            </div>
            <div class="ao-legend-item"><span class="ao-dot inserted"></span>
              <div><strong>Inserted</strong><br /><small>Newly added element</small></div>
            </div>
            <div class="ao-legend-item"><span class="ao-dot removed"></span>
              <div><strong>Removed</strong><br /><small>Element being removed</small></div>
            </div>
            <div class="ao-legend-item"><span class="ao-dot default"></span>
              <div><strong>Default</strong><br /><small>Unvisited element</small></div>
            </div>
          </div>
        </aside>

        <!-- CENTER: Array Visualization -->
        <div class="ao-chart-area">
          <div class="ao-chart-wrapper">
            <div class="ao-cells-container">
              <div v-for="(value, i) in currentStep.array" :key="i" class="ao-cell-col">
                <div class="ao-cell" :class="cellClass(i)">{{ value }}</div>
                <span class="ao-cell-index">{{ i }}</span>
              </div>
            </div>
            <div class="ao-chart-footer"><span>{{ currentOperation.label }} — {{ currentStep.array.length }}
                elements</span></div>
            <input type="range" class="ao-scrubber" min="0" :max="steps.length - 1" v-model.number="stepIndex" />
          </div>
          <div class="ao-status-bar">{{ currentStep.explanation }}</div>
          <div class="ao-complexity-row">
            <span class="ao-complexity-badge">Time: <strong>{{ currentOperation.info.time }}</strong></span>
            <span class="ao-complexity-badge">Space: <strong>{{ currentOperation.info.space }}</strong></span>
          </div>
        </div>

        <!-- RIGHT: Inspector -->
        <aside class="ao-inspector">
          <div class="ao-inspector-header">
            <h3>Inspector</h3><span class="ao-step-badge">Step {{ stepIndex + 1 }} of {{ steps.length }}</span>
          </div>
          <div class="ao-inspector-row"><span>Progress</span><span>{{ progressPercent }}%</span></div>
          <div class="ao-progress-track">
            <div class="ao-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <h4 class="ao-inspector-label">CURRENT OPERATION</h4>
          <div class="ao-op-item"><span class="ao-op-dot active"></span>{{ currentStep.explanation }}</div>

          <h4 class="ao-inspector-label">OPERATION INFO</h4>
          <div class="ao-metrics-grid">
            <div class="ao-metric"><span class="ao-metric-label">Operation</span><span class="ao-metric-value">{{
              currentOperation.label }}</span></div>
            <div class="ao-metric"><span class="ao-metric-label">Best</span><span class="ao-metric-value">{{
              currentOperation.info.best }}</span></div>
            <div class="ao-metric"><span class="ao-metric-label">Average</span><span class="ao-metric-value">{{
              currentOperation.info.average }}</span></div>
            <div class="ao-metric"><span class="ao-metric-label">Worst</span><span class="ao-metric-value">{{
              currentOperation.info.worst }}</span></div>
          </div>

          <h4 class="ao-inspector-label">CURRENT STEP</h4>
          <div class="ao-step-detail">{{ currentStep.explanation }}</div>

          <h4 class="ao-inspector-label">ARRAY STATE</h4>
          <div class="ao-array-state">[{{ currentStep.array.join(', ') }}]</div>
          <div class="ao-array-length">Length: {{ currentStep.array.length }} elements</div>
        </aside>
      </div>

      <!-- How It Works -->
      <section class="ao-section">
        <button class="ao-section-toggle" @click="showHowItWorks = !showHowItWorks"><span
            class="ao-info-circle">ⓘ</span> How {{ currentOperation.label }} Works</button>
        <div v-if="showHowItWorks" class="ao-section-body">
          <h2>{{ currentOperation.label }}</h2>
          <p>{{ currentOperation.info.description }}</p>
          <h3>Complexity:</h3>
          <ul>
            <li><strong>Best Case:</strong> {{ currentOperation.info.best }}</li>
            <li><strong>Average Case:</strong> {{ currentOperation.info.average }}</li>
            <li><strong>Worst Case:</strong> {{ currentOperation.info.worst }}</li>
            <li><strong>Space:</strong> {{ currentOperation.info.space }}</li>
          </ul>
          <h3>Properties:</h3>
          <ul>
            <li><strong>Stable:</strong> {{ currentOperation.info.stable ? 'Yes' : 'No' }}</li>
            <li><strong>In-Place:</strong> {{ currentOperation.info.inPlace ? 'Yes' : 'No' }}</li>
          </ul>
        </div>
      </section>

      <!-- Edge Cases -->
      <section class="ao-section">
        <button class="ao-section-toggle" @click="showEdgeCases = !showEdgeCases"><span
            class="ao-info-circle">ⓘ</span> Edge Cases &amp; Examples</button>
        <div v-if="showEdgeCases" class="ao-section-body">
          <h3>Try These:</h3>
          <div class="ao-edge-grid">
            <div class="ao-edge-card" @click="loadEdgeCase([1, 2, 3, 4, 5])"><strong>Sorted: [1,2,3,4,5]</strong><small>Test on an already sorted array</small></div>
            <div class="ao-edge-card" @click="loadEdgeCase([5, 4, 3, 2, 1])"><strong>Reverse: [5,4,3,2,1]</strong><small>Test on reverse sorted array</small></div>
            <div class="ao-edge-card" @click="loadEdgeCase([3, 1, 4, 1, 5, 9])"><strong>Duplicates: [3,1,4,1,5,9]</strong><small>Array with duplicate values</small></div>
            <div class="ao-edge-card" @click="loadEdgeCase([42])"><strong>Single: [42]</strong><small>Array with one element</small></div>
          </div>
          <h3>Tips:</h3>
          <ul class="ao-tips">
            <li>Use the <strong>custom array</strong> input to test any data</li>
            <li>Switch operations with the <strong>pills above</strong> to compare behaviors</li>
            <li>Binary Search requires the array to be <strong>sorted first</strong></li>
            <li>Insert/Delete operations change the array — use <strong>Reset</strong> to restore</li>
          </ul>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import arrowLeft from '@/assets/arrow-left.svg'
import { arrayOperations } from '@/algorithms/arrayOperations/arrayOperationsMap'

const router = useRouter()
const selectedOp = ref('traverse')
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)
const customInput = ref('')
const playing = ref(false)

const baseArray = ref([5, 2, 8, 1, 9, 3])
const opParams = reactive({ target: null, index: null, value: null })

const currentOperation = computed(() => arrayOperations[selectedOp.value])

const operationType = computed(() => {
  const t = currentOperation.value.label.toLowerCase()
  if (t.includes('search')) return 'search'
  if (t.includes('insert')) return 'insert'
  if (t.includes('delete')) return 'delete'
  if (t.includes('update')) return 'update'
  return null
})

const operationMode = computed(() => {
  const t = currentOperation.value.label.toLowerCase()
  if (t.includes('insert at end') || t === 'insert at end') return 'insertEnd'
  if (t.includes('insert at index') || t === 'insert at index') return 'insertIndex'
  if (t.includes('delete at end') || t === 'delete at end') return 'deleteEnd'
  if (t.includes('delete at index') || t === 'delete at index') return 'deleteIndex'
  return null
})

const paramHint = computed(() => {
  if (operationType.value === 'search') return 'Enter search target:'
  if (operationMode.value === 'insertEnd') return 'Value to insert:'
  if (operationMode.value === 'insertIndex') return 'Value & index:'
  if (operationMode.value === 'deleteEnd') return 'Last element will be removed'
  if (operationMode.value === 'deleteIndex') return 'Index to delete:'
  if (operationType.value === 'update') return 'Index & new value:'
  return ''
})

const isPlayable = computed(() => {
  if (operationType.value === 'search') return opParams.target !== null
  if (operationType.value === 'insert') return opParams.value !== null && (operationMode.value === 'insertEnd' || opParams.index !== null)
  if (operationType.value === 'update') return opParams.value !== null && opParams.index !== null
  if (operationMode.value === 'deleteIndex') return opParams.index !== null
  return true
})

const steps = ref(currentOperation.value.generator(baseArray.value, opParams))
const stepIndex = ref(0)
const currentStep = computed(() => steps.value[stepIndex.value] || { array: [], activeIndex: null, foundIndex: null, removedIndex: null, insertedIndex: null, activeLine: 0, explanation: '' })
const progressPercent = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))

function cellClass(i) {
  const s = currentStep.value
  if (s.foundIndex != null && i === s.foundIndex) return 'found'
  if (s.insertedIndex != null && i === s.insertedIndex) return 'inserted'
  if (s.removedIndex != null && i === s.removedIndex) return 'removed'
  if (s.activeIndex != null && i === s.activeIndex) return 'active'
  if (s.range && (i < s.range[0] || i > s.range[1])) return 'out'
  return ''
}

let timer = null
function play() { if (playing.value) { pause(); return } playing.value = true; timer = setInterval(() => { if (stepIndex.value < steps.value.length - 1) stepIndex.value++; else pause() }, speedDelay.value) }
function pause() { playing.value = false; clearInterval(timer) }
function next() { pause(); if (stepIndex.value < steps.value.length - 1) stepIndex.value++ }
function prev() { pause(); if (stepIndex.value > 0) stepIndex.value-- }
function rebuildSteps() { pause(); steps.value = currentOperation.value.generator(baseArray.value, opParams); stepIndex.value = 0 }
function reset() { rebuildSteps() }
function generateRandom() { baseArray.value = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1); rebuildSteps() }
function applyCustomArray() { const arr = customInput.value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n) && n > 0); if (arr.length < 1) return; baseArray.value = arr; rebuildSteps() }
function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: `Write a program for the ${currentOperation.value.algorithmName} operation.\nTake a random input array.` } }) }
function loadEdgeCase(arr) { baseArray.value = [...arr]; rebuildSteps() }
function selectOperation(key) { selectedOp.value = key; opParams.target = null; opParams.index = null; opParams.value = null; rebuildSteps() }

watch(() => ({ ...opParams }), () => rebuildSteps(), { deep: true })
watch(speedLevel, () => { if (playing.value) { pause(); play() } })

function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.ao-page{min-height:100vh;background:radial-gradient(ellipse at top,#0f172a 0%,#020617 70%);color:#e2e8f0;padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}
.ao-container{max-width:1440px;margin:0 auto}
.ao-top-bar{flex-shrink:0}
.back-btn-compact{display:flex;align-items:center;gap:6px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#e0e7ff;padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}
.back-btn-compact:hover{background:rgba(99,102,241,.25);transform:translateX(-2px)}
.arrow{width:16px;height:16px}
.ao-title{font-size:1.6rem;font-weight:700;color:#f1f5f9;margin:0 0 4px}
.ao-subtitle{color:#94a3b8;font-size:.9rem;margin:0 0 16px}

/* Operation pills */
.ao-op-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.ao-pill{padding:7px 16px;border-radius:20px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.1);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.ao-pill:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.35)}
.ao-pill.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.6);color:#e0e7ff;font-weight:600}

/* Three-column grid */
.ao-three-col{display:grid;grid-template-columns:260px 1fr 280px;gap:16px;margin-bottom:24px}
.ao-controls-panel{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.ao-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.ao-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.12);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}
.ao-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}
.ao-btn:disabled{opacity:.4;cursor:not-allowed}
.ao-btn.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.5)}
.ao-icon{font-size:.9rem}
.ao-settings-toggle{width:100%;justify-content:center}
.ao-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:rgba(15,23,42,.5);border-radius:8px}
.ao-setting-row label{font-size:.78rem;color:#94a3b8}
.ao-slider{width:100%;cursor:pointer;accent-color:#818cf8}
.ao-custom-input{display:flex;flex-direction:column;gap:4px}
.ao-custom-input label{font-size:.75rem;color:#94a3b8;font-weight:600}
.ao-input-row{display:flex;gap:4px}
.ao-text-input{flex:1;background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.35);color:#e0e7ff;padding:6px 10px;border-radius:6px;font-size:.8rem;outline:none;width:100%}
.ao-text-input:focus{border-color:#6366f1}
.ao-text-input::placeholder{color:#475569;font-size:.72rem}
.ao-apply-btn{padding:6px 12px!important;background:linear-gradient(135deg,#6366f1,#8b5cf6)!important;border:none!important;color:#fff!important;font-weight:600!important}
.ao-op-params{display:flex;flex-direction:column;gap:6px}
.ao-param-label{font-size:.75rem;color:#94a3b8;font-weight:600}
.ao-code-btn{width:100%;justify-content:center;background:rgba(99,102,241,.15)!important;border-color:rgba(99,102,241,.35)!important;color:#a5b4fc!important}
.ao-code-btn:hover{background:rgba(99,102,241,.28)!important}
.ao-shortcuts h4{font-size:.78rem;color:#94a3b8;margin:0 0 6px;font-weight:600}
.ao-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:#94a3b8}
.ao-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:#e0e7ff;font-size:.72rem;text-align:center}
.ao-legend h4{font-size:.82rem;color:#f1f5f9;margin:0 0 8px}
.ao-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:#cbd5e1}
.ao-legend-item small{color:#64748b}
.ao-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}
.ao-dot.active{background:#22c55e}
.ao-dot.found{background:#10b981}
.ao-dot.inserted{background:#38bdf8}
.ao-dot.removed{background:#ef4444}
.ao-dot.default{background:#6366f1}

/* Center chart area */
.ao-chart-area{display:flex;flex-direction:column;gap:10px}
.ao-chart-wrapper{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:24px 16px 8px;display:flex;flex-direction:column;min-height:220px}
.ao-cells-container{display:flex;gap:10px;justify-content:center;align-items:center;flex:1;flex-wrap:wrap;padding:16px 0}
.ao-cell-col{display:flex;flex-direction:column;align-items:center;gap:4px}
.ao-cell{min-width:52px;padding:14px 8px;border-radius:10px;background:#6366f1;color:#fff;font-weight:700;font-size:1rem;text-align:center;transition:all .3s ease;box-shadow:0 2px 8px rgba(99,102,241,.25)}
.ao-cell.active{background:#22c55e;transform:scale(1.08);box-shadow:0 0 16px rgba(34,197,94,.4)}
.ao-cell.found{background:#10b981;transform:scale(1.08);box-shadow:0 0 16px rgba(16,185,129,.4)}
.ao-cell.inserted{background:#38bdf8;animation:ao-pop .4s ease;box-shadow:0 0 16px rgba(56,189,248,.4)}
.ao-cell.removed{background:#ef4444;opacity:.6;box-shadow:0 0 16px rgba(239,68,68,.3)}
.ao-cell.out{opacity:.3}
@keyframes ao-pop{0%{transform:scale(.7)}100%{transform:scale(1)}}
.ao-cell-index{font-size:.6rem;color:#64748b}
.ao-chart-footer{font-size:.72rem;color:#64748b;padding:6px 0 4px;text-align:center}
.ao-scrubber{width:100%;accent-color:#818cf8;cursor:pointer;margin-top:4px}
.ao-status-bar{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:#e2e8f0;font-weight:500}
.ao-complexity-row{display:flex;justify-content:center;gap:32px}
.ao-complexity-badge{font-size:.82rem;color:#94a3b8}
.ao-complexity-badge strong{color:#e0e7ff}

/* Inspector */
.ao-inspector{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px}
.ao-inspector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.ao-inspector-header h3{margin:0;font-size:1rem;color:#f1f5f9}
.ao-step-badge{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);padding:3px 10px;border-radius:12px;font-size:.72rem;color:#a5b4fc;font-weight:600}
.ao-inspector-row{display:flex;justify-content:space-between;font-size:.78rem;color:#94a3b8;margin-bottom:4px}
.ao-progress-track{width:100%;height:6px;background:rgba(100,116,139,.2);border-radius:3px;margin-bottom:16px;overflow:hidden}
.ao-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#818cf8);border-radius:3px;transition:width .25s}
.ao-inspector-label{font-size:.7rem;letter-spacing:.06em;color:#64748b;margin:14px 0 6px;font-weight:700}
.ao-op-item{display:flex;align-items:center;gap:8px;font-size:.78rem;color:#cbd5e1;margin-bottom:4px}
.ao-op-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.ao-op-dot.active{background:#22c55e}
.ao-metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ao-metric{display:flex;flex-direction:column}
.ao-metric-label{font-size:.7rem;color:#64748b}
.ao-metric-value{font-size:1rem;font-weight:700;color:#f1f5f9}
.ao-step-detail{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.78rem;color:#cbd5e1;font-family:'Fira Code',monospace}
.ao-array-state{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.72rem;color:#cbd5e1;font-family:'Fira Code',monospace;word-break:break-all;line-height:1.5}
.ao-array-length{font-size:.7rem;color:#64748b;margin-top:4px}

/* Sections */
.ao-section{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;margin-bottom:12px;overflow:hidden}
.ao-section-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:14px 18px;background:none;border:none;color:#e2e8f0;font-size:1rem;font-weight:600;cursor:pointer;text-align:left;transition:background .15s}
.ao-section-toggle:hover{background:rgba(100,116,139,.1)}
.ao-info-circle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);color:#a5b4fc;font-size:.82rem;font-weight:700;flex-shrink:0}
.ao-section-body{padding:0 20px 20px;color:#cbd5e1;font-size:.88rem;line-height:1.7}
.ao-section-body h2{font-size:1.15rem;color:#f1f5f9;margin:0 0 8px}
.ao-section-body h3{font-size:.95rem;color:#e0e7ff;margin:16px 0 6px}
.ao-section-body ol,.ao-section-body ul{padding-left:20px;margin:4px 0}
.ao-section-body li{margin-bottom:3px}
.ao-edge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.ao-edge-card{background:rgba(15,23,42,.5);border:1px solid rgba(100,116,139,.3);border-radius:10px;padding:14px;cursor:pointer;transition:all .15s}
.ao-edge-card:hover{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.08)}
.ao-edge-card strong{display:block;color:#f1f5f9;font-size:.88rem;margin-bottom:4px}
.ao-edge-card small{color:#64748b;font-size:.78rem}
.ao-tips{padding-left:20px}
.ao-tips li{margin-bottom:4px}

@media(max-width:1100px){.ao-three-col{grid-template-columns:1fr}}
@media(max-width:640px){.ao-edge-grid{grid-template-columns:1fr}.ao-page{padding:12px}.ao-op-pills{gap:4px}.ao-pill{padding:5px 10px;font-size:.75rem}}
</style>
