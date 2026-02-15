<template>
  <AuthNavbar />
  <main class="qo-page">
    <div class="qo-container">
      <div class="qo-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>
      <h1 class="qo-title">Queue Operations</h1>
      <p class="qo-subtitle">Visualize FIFO (First-In First-Out) queue operations step by step</p>

      <!-- Operation selector pills -->
      <div class="qo-op-pills">
        <button v-for="(op, key) in queueOperations" :key="key" class="qo-pill" :class="{ active: selectedOp === key }"
          @click="selectOperation(key)">{{ op.label }}</button>
      </div>

      <!-- ═══════ THREE-COLUMN LAYOUT ═══════ -->
      <div class="qo-three-col">
        <!-- LEFT: Controls -->
        <aside class="qo-controls-panel">
          <div class="qo-btn-group">
            <button class="qo-btn" :class="{ active: playing }" @click="playing ? pause() : play()"
              :disabled="!isPlayable"><span class="qo-icon">▶</span> {{ playing ? 'Pause' : 'Play' }}</button>
            <button class="qo-btn" @click="next" :disabled="stepIndex === steps.length - 1"><span
                class="qo-icon">⏭</span> Step</button>
          </div>
          <div class="qo-btn-group">
            <button class="qo-btn" @click="reset"><span class="qo-icon">↺</span> Reset</button>
            <button class="qo-btn" @click="generateRandom"><span class="qo-icon">⤮</span> Randomize</button>
          </div>

          <button class="qo-btn qo-settings-toggle" @click="showSettings = !showSettings"><span
              class="qo-icon">⚙</span> Settings</button>
          <div v-if="showSettings" class="qo-settings-body">
            <div class="qo-setting-row"><label>Speed: <strong>{{ speedPercent }}%</strong></label><input type="range"
                min="1" max="5" v-model.number="speedLevel" class="qo-slider" /></div>
          </div>

          <!-- Custom Queue -->
          <div class="qo-custom-input"><label>Custom Queue:</label>
            <div class="qo-input-row"><input v-model="customInput" placeholder="e.g. 5,2,8,1,9" class="qo-text-input"
                @keydown.enter="applyCustomQueue" /><button class="qo-btn qo-apply-btn"
                @click="applyCustomQueue">Go</button></div>
          </div>

          <!-- Enqueue value param -->
          <div v-if="selectedOp === 'enqueue'" class="qo-op-params">
            <label class="qo-param-label">Value to enqueue:</label>
            <input v-model.number="enqueueValue" type="number" placeholder="Enter value" class="qo-text-input" />
          </div>

          <button class="qo-btn qo-code-btn" @click="goToGenerateCode"><span class="qo-icon">{ }</span> Generate
            Code</button>

          <div class="qo-shortcuts">
            <h4>Keyboard Shortcuts:</h4>
            <div class="qo-shortcut-grid"><span class="qo-key">Space</span><span>Play/Pause</span><span
                class="qo-key">→</span><span>Step Forward</span><span class="qo-key">←</span><span>Step
                Back</span><span class="qo-key">R</span><span>Reset</span></div>
          </div>
          <div class="qo-legend">
            <h4>Legend</h4>
            <div class="qo-legend-item"><span class="qo-dot highlighted"></span>
              <div><strong>Highlighted</strong><br /><small>Active element</small></div>
            </div>
            <div class="qo-legend-item"><span class="qo-dot front"></span>
              <div><strong>Front</strong><br /><small>Front of queue</small></div>
            </div>
            <div class="qo-legend-item"><span class="qo-dot back"></span>
              <div><strong>Back</strong><br /><small>Back of queue</small></div>
            </div>
            <div class="qo-legend-item"><span class="qo-dot default"></span>
              <div><strong>Default</strong><br /><small>Queue element</small></div>
            </div>
          </div>
        </aside>

        <!-- CENTER: Queue Visualization -->
        <div class="qo-chart-area">
          <div class="qo-chart-wrapper">
            <div class="qo-queue-labels">
              <span class="qo-label-front">FRONT (Dequeue)</span>
              <span class="qo-label-back">BACK (Enqueue)</span>
            </div>
            <div class="qo-cells-container">
              <template v-if="currentStep.queue.length === 0">
                <div class="qo-empty-msg">Queue is empty</div>
              </template>
              <template v-else>
                <div v-for="(value, i) in currentStep.queue" :key="i" class="qo-cell-col">
                  <div class="qo-pointer-row">
                    <span v-if="i === currentStep.frontIndex && i === currentStep.backIndex" class="qo-pointer both">F/B</span>
                    <span v-else-if="i === currentStep.frontIndex" class="qo-pointer front">F</span>
                    <span v-else-if="i === currentStep.backIndex" class="qo-pointer back">B</span>
                    <span v-else class="qo-pointer-spacer"></span>
                  </div>
                  <div class="qo-cell" :class="cellClass(i)">{{ value }}</div>
                  <span class="qo-cell-index">{{ i }}</span>
                </div>
              </template>
            </div>
            <div class="qo-flow-arrow" v-if="currentStep.queue.length > 0">
              <span>→ → → flow direction → → →</span>
            </div>
            <div class="qo-chart-footer"><span>{{ currentOperation.label }} — {{ currentStep.queue.length }} elements</span></div>
            <input type="range" class="qo-scrubber" min="0" :max="steps.length - 1" v-model.number="stepIndex" />
          </div>
          <div class="qo-status-bar">{{ currentStep.explanation }}</div>
          <div class="qo-complexity-row">
            <span class="qo-complexity-badge">Time: <strong>{{ currentOperation.info.best }}</strong></span>
            <span class="qo-complexity-badge">Space: <strong>{{ currentOperation.info.space }}</strong></span>
          </div>
        </div>

        <!-- RIGHT: Inspector -->
        <aside class="qo-inspector">
          <div class="qo-inspector-header">
            <h3>Inspector</h3><span class="qo-step-badge">Step {{ stepIndex + 1 }} of {{ steps.length }}</span>
          </div>
          <div class="qo-inspector-row"><span>Progress</span><span>{{ progressPercent }}%</span></div>
          <div class="qo-progress-track">
            <div class="qo-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <h4 class="qo-inspector-label">CURRENT OPERATION</h4>
          <div class="qo-op-item"><span class="qo-op-dot active"></span>{{ currentStep.explanation }}</div>

          <h4 class="qo-inspector-label">OPERATION INFO</h4>
          <div class="qo-metrics-grid">
            <div class="qo-metric"><span class="qo-metric-label">Operation</span><span class="qo-metric-value">{{ currentOperation.label }}</span></div>
            <div class="qo-metric"><span class="qo-metric-label">Best</span><span class="qo-metric-value">{{ currentOperation.info.best }}</span></div>
            <div class="qo-metric"><span class="qo-metric-label">Average</span><span class="qo-metric-value">{{ currentOperation.info.average }}</span></div>
            <div class="qo-metric"><span class="qo-metric-label">Worst</span><span class="qo-metric-value">{{ currentOperation.info.worst }}</span></div>
          </div>

          <h4 class="qo-inspector-label">CURRENT STEP</h4>
          <div class="qo-step-detail">{{ currentStep.explanation }}</div>

          <h4 class="qo-inspector-label">QUEUE STATE</h4>
          <div class="qo-queue-state">[{{ currentStep.queue.join(', ') }}]</div>
          <div class="qo-queue-length">Size: {{ currentStep.queue.length }} elements</div>
          <div class="qo-queue-pointers">Front: {{ currentStep.frontIndex >= 0 ? currentStep.frontIndex : '—' }} | Back: {{ currentStep.backIndex >= 0 ? currentStep.backIndex : '—' }}</div>
        </aside>
      </div>

      <!-- How It Works -->
      <section class="qo-section">
        <button class="qo-section-toggle" @click="showHowItWorks = !showHowItWorks"><span
            class="qo-info-circle">ⓘ</span> How {{ currentOperation.label }} Works</button>
        <div v-if="showHowItWorks" class="qo-section-body">
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
      <section class="qo-section">
        <button class="qo-section-toggle" @click="showEdgeCases = !showEdgeCases"><span
            class="qo-info-circle">ⓘ</span> Edge Cases &amp; Examples</button>
        <div v-if="showEdgeCases" class="qo-section-body">
          <h3>Try These:</h3>
          <div class="qo-edge-grid">
            <div class="qo-edge-card" @click="loadEdgeCase([1, 2, 3, 4, 5])"><strong>Ordered: [1,2,3,4,5]</strong><small>Sequential queue</small></div>
            <div class="qo-edge-card" @click="loadEdgeCase([10, 20, 30])"><strong>Small: [10,20,30]</strong><small>Three-element queue</small></div>
            <div class="qo-edge-card" @click="loadEdgeCase([42])"><strong>Single: [42]</strong><small>Queue with one element</small></div>
            <div class="qo-edge-card" @click="loadEdgeCase([])"><strong>Empty: []</strong><small>Empty queue — test dequeue/peek behavior</small></div>
          </div>
          <h3>Tips:</h3>
          <ul class="qo-tips">
            <li>A <strong>queue</strong> is a FIFO (First-In First-Out) data structure</li>
            <li><strong>Enqueue</strong> adds to the back, <strong>Dequeue</strong> removes from the front</li>
            <li>Try <strong>Dequeue</strong> on an empty queue to see underflow handling</li>
            <li>Use the <strong>custom queue</strong> input to test any configuration</li>
            <li>Switch operations with the <strong>pills above</strong> to compare behaviors</li>
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
import { queueOperations } from '@/algorithms/queueOperations/queueOperationsMap'

const router = useRouter()
const selectedOp = ref('enqueue')
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)
const customInput = ref('')
const playing = ref(false)
const enqueueValue = ref(10)

const baseQueue = ref([4, 8, 2, 6, 1])

const currentOperation = computed(() => queueOperations[selectedOp.value])

const isPlayable = computed(() => {
  if (selectedOp.value === 'enqueue') return enqueueValue.value !== null && enqueueValue.value !== ''
  return true
})

function buildSteps() {
  const op = currentOperation.value
  if (selectedOp.value === 'enqueue') {
    return op.generateSteps([...baseQueue.value], { value: Number(enqueueValue.value) || 0 })
  }
  return op.generateSteps([...baseQueue.value])
}

const steps = ref(buildSteps())
const stepIndex = ref(0)
const emptyStep = { queue: [], highlight: [], frontIndex: -1, backIndex: -1, activeLine: 0, explanation: '' }
const currentStep = computed(() => steps.value[stepIndex.value] || emptyStep)
const progressPercent = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))

function cellClass(i) {
  const s = currentStep.value
  if (s.highlight && s.highlight.includes(i)) return 'highlighted'
  if (i === s.frontIndex && i === s.backIndex) return 'front-back'
  if (i === s.frontIndex) return 'front'
  if (i === s.backIndex) return 'back'
  return ''
}

let timer = null
function play() { if (playing.value) { pause(); return } playing.value = true; timer = setInterval(() => { if (stepIndex.value < steps.value.length - 1) stepIndex.value++; else pause() }, speedDelay.value) }
function pause() { playing.value = false; clearInterval(timer) }
function next() { pause(); if (stepIndex.value < steps.value.length - 1) stepIndex.value++ }
function prev() { pause(); if (stepIndex.value > 0) stepIndex.value-- }
function rebuildSteps() { pause(); steps.value = buildSteps(); stepIndex.value = 0 }
function reset() { rebuildSteps() }
function generateRandom() { baseQueue.value = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1); rebuildSteps() }
function applyCustomQueue() { const arr = customInput.value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n)); if (arr.length < 0) return; baseQueue.value = arr; rebuildSteps() }
function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: `Write a program for the Queue ${currentOperation.value.info.algorithmName || currentOperation.value.label} operation.\nTake a random input queue.` } }) }
function loadEdgeCase(arr) { baseQueue.value = [...arr]; rebuildSteps() }
function selectOperation(key) { selectedOp.value = key; rebuildSteps() }

watch(enqueueValue, () => { if (selectedOp.value === 'enqueue') rebuildSteps() })
watch(speedLevel, () => { if (playing.value) { pause(); play() } })

function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.qo-page{min-height:100vh;background:radial-gradient(ellipse at top,#0f172a 0%,#020617 70%);color:#e2e8f0;padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}
.qo-container{max-width:1440px;margin:0 auto}
.qo-top-bar{flex-shrink:0}
.back-btn-compact{display:flex;align-items:center;gap:6px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#e0e7ff;padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}
.back-btn-compact:hover{background:rgba(99,102,241,.25);transform:translateX(-2px)}
.arrow{width:16px;height:16px}
.qo-title{font-size:1.6rem;font-weight:700;color:#f1f5f9;margin:0 0 4px}
.qo-subtitle{color:#94a3b8;font-size:.9rem;margin:0 0 16px}

/* Operation pills */
.qo-op-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.qo-pill{padding:7px 16px;border-radius:20px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.1);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.qo-pill:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.35)}
.qo-pill.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.6);color:#e0e7ff;font-weight:600}

/* Three-column grid */
.qo-three-col{display:grid;grid-template-columns:260px 1fr 280px;gap:16px;margin-bottom:24px}
.qo-controls-panel{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.qo-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.qo-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.12);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}
.qo-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}
.qo-btn:disabled{opacity:.4;cursor:not-allowed}
.qo-btn.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.5)}
.qo-icon{font-size:.9rem}
.qo-settings-toggle{width:100%;justify-content:center}
.qo-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:rgba(15,23,42,.5);border-radius:8px}
.qo-setting-row label{font-size:.78rem;color:#94a3b8}
.qo-slider{width:100%;cursor:pointer;accent-color:#818cf8}
.qo-custom-input{display:flex;flex-direction:column;gap:4px}
.qo-custom-input label{font-size:.75rem;color:#94a3b8;font-weight:600}
.qo-input-row{display:flex;gap:4px}
.qo-text-input{flex:1;background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.35);color:#e0e7ff;padding:6px 10px;border-radius:6px;font-size:.8rem;outline:none;width:100%}
.qo-text-input:focus{border-color:#6366f1}
.qo-text-input::placeholder{color:#475569;font-size:.72rem}
.qo-apply-btn{padding:6px 12px!important;background:linear-gradient(135deg,#6366f1,#8b5cf6)!important;border:none!important;color:#fff!important;font-weight:600!important}
.qo-op-params{display:flex;flex-direction:column;gap:6px}
.qo-param-label{font-size:.75rem;color:#94a3b8;font-weight:600}
.qo-code-btn{width:100%;justify-content:center;background:rgba(99,102,241,.15)!important;border-color:rgba(99,102,241,.35)!important;color:#a5b4fc!important}
.qo-code-btn:hover{background:rgba(99,102,241,.28)!important}
.qo-shortcuts h4{font-size:.78rem;color:#94a3b8;margin:0 0 6px;font-weight:600}
.qo-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:#94a3b8}
.qo-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:#e0e7ff;font-size:.72rem;text-align:center}
.qo-legend h4{font-size:.82rem;color:#f1f5f9;margin:0 0 8px}
.qo-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:#cbd5e1}
.qo-legend-item small{color:#64748b}
.qo-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}
.qo-dot.highlighted{background:#22c55e}
.qo-dot.front{background:#38bdf8}
.qo-dot.back{background:#f59e0b}
.qo-dot.default{background:#6366f1}

/* Center chart area */
.qo-chart-area{display:flex;flex-direction:column;gap:10px}
.qo-chart-wrapper{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:24px 16px 8px;display:flex;flex-direction:column;align-items:center;min-height:220px}
.qo-queue-labels{display:flex;justify-content:space-between;width:100%;padding:0 16px;margin-bottom:4px}
.qo-label-front{font-size:.7rem;font-weight:700;letter-spacing:.06em;color:#38bdf8}
.qo-label-back{font-size:.7rem;font-weight:700;letter-spacing:.06em;color:#f59e0b}
.qo-cells-container{display:flex;gap:10px;justify-content:center;align-items:center;flex:1;flex-wrap:wrap;padding:12px 0;width:100%}
.qo-empty-msg{color:#64748b;font-size:.9rem;padding:40px 0;font-style:italic}
.qo-cell-col{display:flex;flex-direction:column;align-items:center;gap:4px}
.qo-pointer-row{height:22px;display:flex;align-items:center;justify-content:center}
.qo-pointer{font-size:.6rem;font-weight:800;padding:2px 6px;border-radius:4px;letter-spacing:.04em}
.qo-pointer.front{background:rgba(56,189,248,.2);color:#38bdf8;border:1px solid rgba(56,189,248,.4)}
.qo-pointer.back{background:rgba(245,158,11,.2);color:#f59e0b;border:1px solid rgba(245,158,11,.4)}
.qo-pointer.both{background:rgba(168,85,247,.2);color:#c084fc;border:1px solid rgba(168,85,247,.4)}
.qo-pointer-spacer{display:block;height:22px}
.qo-cell{min-width:52px;padding:14px 8px;border-radius:10px;background:#6366f1;color:#fff;font-weight:700;font-size:1rem;text-align:center;transition:all .3s ease;box-shadow:0 2px 8px rgba(99,102,241,.25)}
.qo-cell.highlighted{background:#22c55e;transform:scale(1.08);box-shadow:0 0 16px rgba(34,197,94,.4)}
.qo-cell.front{background:#38bdf8;box-shadow:0 0 12px rgba(56,189,248,.35)}
.qo-cell.back{background:#f59e0b;box-shadow:0 0 12px rgba(245,158,11,.35)}
.qo-cell.front-back{background:linear-gradient(135deg,#38bdf8,#f59e0b);box-shadow:0 0 14px rgba(168,85,247,.3)}
.qo-cell-index{font-size:.6rem;color:#64748b}
.qo-flow-arrow{font-size:.65rem;color:#475569;letter-spacing:.12em;margin-top:2px}
.qo-chart-footer{font-size:.72rem;color:#64748b;padding:6px 0 4px;text-align:center;width:100%}
.qo-scrubber{width:100%;accent-color:#818cf8;cursor:pointer;margin-top:4px}
.qo-status-bar{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:#e2e8f0;font-weight:500}
.qo-complexity-row{display:flex;justify-content:center;gap:32px}
.qo-complexity-badge{font-size:.82rem;color:#94a3b8}
.qo-complexity-badge strong{color:#e0e7ff}

/* Inspector */
.qo-inspector{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px}
.qo-inspector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.qo-inspector-header h3{margin:0;font-size:1rem;color:#f1f5f9}
.qo-step-badge{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);padding:3px 10px;border-radius:12px;font-size:.72rem;color:#a5b4fc;font-weight:600}
.qo-inspector-row{display:flex;justify-content:space-between;font-size:.78rem;color:#94a3b8;margin-bottom:4px}
.qo-progress-track{width:100%;height:6px;background:rgba(100,116,139,.2);border-radius:3px;margin-bottom:16px;overflow:hidden}
.qo-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#818cf8);border-radius:3px;transition:width .25s}
.qo-inspector-label{font-size:.7rem;letter-spacing:.06em;color:#64748b;margin:14px 0 6px;font-weight:700}
.qo-op-item{display:flex;align-items:center;gap:8px;font-size:.78rem;color:#cbd5e1;margin-bottom:4px}
.qo-op-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.qo-op-dot.active{background:#22c55e}
.qo-metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.qo-metric{display:flex;flex-direction:column}
.qo-metric-label{font-size:.7rem;color:#64748b}
.qo-metric-value{font-size:1rem;font-weight:700;color:#f1f5f9}
.qo-step-detail{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.78rem;color:#cbd5e1;font-family:'Fira Code',monospace}
.qo-queue-state{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.72rem;color:#cbd5e1;font-family:'Fira Code',monospace;word-break:break-all;line-height:1.5}
.qo-queue-length{font-size:.7rem;color:#64748b;margin-top:4px}
.qo-queue-pointers{font-size:.7rem;color:#64748b;margin-top:2px}

/* Sections */
.qo-section{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;margin-bottom:12px;overflow:hidden}
.qo-section-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:14px 18px;background:none;border:none;color:#e2e8f0;font-size:1rem;font-weight:600;cursor:pointer;text-align:left;transition:background .15s}
.qo-section-toggle:hover{background:rgba(100,116,139,.1)}
.qo-info-circle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);color:#a5b4fc;font-size:.82rem;font-weight:700;flex-shrink:0}
.qo-section-body{padding:0 20px 20px;color:#cbd5e1;font-size:.88rem;line-height:1.7}
.qo-section-body h2{font-size:1.15rem;color:#f1f5f9;margin:0 0 8px}
.qo-section-body h3{font-size:.95rem;color:#e0e7ff;margin:16px 0 6px}
.qo-section-body ol,.qo-section-body ul{padding-left:20px;margin:4px 0}
.qo-section-body li{margin-bottom:3px}
.qo-edge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.qo-edge-card{background:rgba(15,23,42,.5);border:1px solid rgba(100,116,139,.3);border-radius:10px;padding:14px;cursor:pointer;transition:all .15s}
.qo-edge-card:hover{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.08)}
.qo-edge-card strong{display:block;color:#f1f5f9;font-size:.88rem;margin-bottom:4px}
.qo-edge-card small{color:#64748b;font-size:.78rem}
.qo-tips{padding-left:20px}
.qo-tips li{margin-bottom:4px}

@media(max-width:1100px){.qo-three-col{grid-template-columns:1fr}}
@media(max-width:640px){.qo-edge-grid{grid-template-columns:1fr}.qo-page{padding:12px}.qo-op-pills{gap:4px}.qo-pill{padding:5px 10px;font-size:.75rem}}
</style>
