<template>
  <AuthNavbar />
  <main class="so-page">
    <div class="so-container">
      <div class="so-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>
      <h1 class="so-title">Stack Operations</h1>
      <p class="so-subtitle">Visualize LIFO (Last-In First-Out) stack operations step by step</p>

      <!-- Operation selector pills -->
      <div class="so-op-pills">
        <button v-for="(op, key) in stackOperations" :key="key" class="so-pill" :class="{ active: selectedOp === key }"
          @click="selectOperation(key)">{{ op.label }}</button>
      </div>

      <!-- ======= THREE-COLUMN LAYOUT ======= -->
      <div class="so-three-col">
        <!-- LEFT: Controls -->
        <aside class="so-controls-panel">
          <div class="so-btn-group">
            <button class="so-btn" :class="{ active: playing }" @click="playing ? pause() : play()"
              :disabled="!isPlayable"> {{ playing ? 'Pause' : 'Play' }}</button>
            <button class="so-btn" @click="next" :disabled="stepIndex === steps.length - 1"><span
                class="so-icon"></span> Step</button>
          </div>
          <div class="so-btn-group">
            <button class="so-btn" @click="reset"> Reset</button>
            <button class="so-btn" @click="generateRandom"> Randomize</button>
          </div>

          <button class="so-btn so-settings-toggle" @click="showSettings = !showSettings"><span
              class="so-icon"></span> Settings</button>
          <div v-if="showSettings" class="so-settings-body">
            <div class="so-setting-row"><label>Speed: <strong>{{ speedPercent }}%</strong></label><input type="range"
                min="1" max="5" v-model.number="speedLevel" class="so-slider" /></div>
          </div>

          <!-- Custom Stack -->
          <div class="so-custom-input"><label>Custom Stack:</label>
            <div class="so-input-row"><input v-model="customInput" placeholder="e.g. 5,2,8,1,9" class="so-text-input"
                @keydown.enter="applyCustomStack" /><button class="so-btn so-apply-btn"
                @click="applyCustomStack">Go</button></div>
          </div>

          <!-- Push value param -->
          <div v-if="selectedOp === 'push'" class="so-op-params">
            <label class="so-param-label">Value to push:</label>
            <input v-model.number="pushValue" type="number" placeholder="Enter value" class="so-text-input" />
          </div>

          <button class="so-btn so-code-btn" @click="goToGenerateCode"> Generate
            Code</button>

          <div class="so-shortcuts">
            <h4>Keyboard Shortcuts:</h4>
            <div class="so-shortcut-grid"><span class="so-key">Space</span><span>Play/Pause</span><span
                class="so-key">-></span><span>Step Forward</span><span class="so-key"><-</span><span>Step
                Back</span><span class="so-key">R</span><span>Reset</span></div>
          </div>
          <div class="so-legend">
            <h4>Legend</h4>
            <div class="so-legend-item"><span class="so-dot highlighted"></span>
              <div><strong>Highlighted</strong><br /><small>Active element</small></div>
            </div>
            <div class="so-legend-item"><span class="so-dot top"></span>
              <div><strong>Top</strong><br /><small>Top of stack</small></div>
            </div>
            <div class="so-legend-item"><span class="so-dot default"></span>
              <div><strong>Default</strong><br /><small>Stack element</small></div>
            </div>
          </div>
        </aside>

        <!-- CENTER: Stack Visualization -->
        <div class="so-chart-area">
          <div class="so-chart-wrapper">
            <div class="so-stack-label-top">TOP</div>
            <div class="so-cells-container">
              <template v-if="currentStep.stack.length === 0">
                <div class="so-empty-msg">Stack is empty</div>
              </template>
              <template v-else>
                <div v-for="i in currentStep.stack.length" :key="i" class="so-cell-row">
                  <span class="so-cell-index">{{ currentStep.stack.length - i }}</span>
                  <div class="so-cell" :class="cellClass(currentStep.stack.length - i)">
                    {{ currentStep.stack[currentStep.stack.length - i] }}
                  </div>
                  <span v-if="currentStep.stack.length - i === currentStep.topIndex" class="so-top-indicator">< TOP</span>
                </div>
              </template>
            </div>
            <div class="so-stack-label-bottom">BASE</div>
            <div class="so-chart-footer"><span>{{ currentOperation.label }}  -  {{ currentStep.stack.length }} elements</span></div>
            <input type="range" class="so-scrubber" min="0" :max="steps.length - 1" v-model.number="stepIndex" />
          </div>
          <div class="so-status-bar">{{ currentStep.explanation }}</div>
          <div class="so-complexity-row">
            <span class="so-complexity-badge">Time: <strong>{{ currentOperation.info.time }}</strong></span>
            <span class="so-complexity-badge">Space: <strong>{{ currentOperation.info.space }}</strong></span>
          </div>
        </div>

        <!-- RIGHT: Inspector -->
        <aside class="so-inspector">
          <div class="so-inspector-header">
            <h3>Inspector</h3><span class="so-step-badge">Step {{ stepIndex + 1 }} of {{ steps.length }}</span>
          </div>
          <div class="so-inspector-row"><span>Progress</span><span>{{ progressPercent }}%</span></div>
          <div class="so-progress-track">
            <div class="so-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <h4 class="so-inspector-label">CURRENT OPERATION</h4>
          <div class="so-op-item"><span class="so-op-dot active"></span>{{ currentStep.explanation }}</div>

          <h4 class="so-inspector-label">OPERATION INFO</h4>
          <div class="so-metrics-grid">
            <div class="so-metric"><span class="so-metric-label">Operation</span><span class="so-metric-value">{{ currentOperation.label }}</span></div>
            <div class="so-metric"><span class="so-metric-label">Best</span><span class="so-metric-value">{{ currentOperation.info.best }}</span></div>
            <div class="so-metric"><span class="so-metric-label">Average</span><span class="so-metric-value">{{ currentOperation.info.average }}</span></div>
            <div class="so-metric"><span class="so-metric-label">Worst</span><span class="so-metric-value">{{ currentOperation.info.worst }}</span></div>
          </div>

          <h4 class="so-inspector-label">CURRENT STEP</h4>
          <div class="so-step-detail">{{ currentStep.explanation }}</div>

          <h4 class="so-inspector-label">STACK STATE</h4>
          <div class="so-stack-state">[{{ currentStep.stack.join(', ') }}]</div>
          <div class="so-stack-length">Size: {{ currentStep.stack.length }} elements | Top Index: {{ currentStep.topIndex }}</div>
        </aside>
      </div>

      <!-- How It Works -->
      <section class="so-section">
        <button class="so-section-toggle" @click="showHowItWorks = !showHowItWorks"><span
            class="so-info-circle">i</span> How {{ currentOperation.label }} Works</button>
        <div v-if="showHowItWorks" class="so-section-body">
          <p class="so-section-intro">Every stack command manipulates the LIFO structure in a different way. Browse the cards below to see the control flow, guard clauses, and complexity for each operation.</p>
          <div class="so-how-grid">
            <article v-for="card in howItWorksCards" :key="card.key" class="so-how-card" :class="{ active: card.key === selectedOp }">
              <header class="so-how-header">
                <div>
                  <h3>{{ card.label }}</h3>
                  <p>{{ card.summary }}</p>
                </div>
                <span class="so-chip" v-if="card.key === selectedOp">Active</span>
              </header>
              <ol class="so-step-list">
                <li v-for="(step, idx) in card.steps" :key="idx">{{ step }}</li>
              </ol>
              <div class="so-how-meta">
                <span>Best: <strong>{{ card.best }}</strong></span>
                <span>Avg: <strong>{{ card.average }}</strong></span>
                <span>Worst: <strong>{{ card.worst }}</strong></span>
                <span>Space: <strong>{{ card.space }}</strong></span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Edge Cases -->
      <section class="so-section">
        <button class="so-section-toggle" @click="showEdgeCases = !showEdgeCases"><span
            class="so-info-circle">i</span> Edge Cases &amp; Examples</button>
        <div v-if="showEdgeCases" class="so-section-body">
          <h3>Try These:</h3>
          <div class="so-edge-grid">
            <div class="so-edge-card" @click="loadEdgeCase([1, 2, 3, 4, 5])"><strong>Ordered: [1,2,3,4,5]</strong><small>Push elements in order</small></div>
            <div class="so-edge-card" @click="loadEdgeCase([10, 20, 30])"><strong>Small: [10,20,30]</strong><small>Three-element stack</small></div>
            <div class="so-edge-card" @click="loadEdgeCase([42])"><strong>Single: [42]</strong><small>Stack with one element</small></div>
            <div class="so-edge-card" @click="loadEdgeCase([])"><strong>Empty: []</strong><small>Empty stack  -  test pop/peek behavior</small></div>
          </div>
          <h3>Tips:</h3>
          <ul class="so-tips">
            <li>A <strong>stack</strong> is a LIFO (Last-In First-Out) data structure</li>
            <li><strong>Push</strong> adds to the top, <strong>Pop</strong> removes from the top</li>
            <li>Try <strong>Pop</strong> on an empty stack to see underflow handling</li>
            <li>Use the <strong>custom stack</strong> input to test any configuration</li>
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
import { stackOperations } from '@/algorithms/stackOperations/stackOperationsMap'

const router = useRouter()
const selectedOp = ref('push')
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)
const customInput = ref('')
const playing = ref(false)
const pushValue = ref(15)

const baseStack = ref([7, 3, 9, 5, 1])

const stackOperationWriteups = {
  push: {
    summary: 'Place a new value on top of the stack after verifying capacity.',
    steps: [
      'Verify the stack is not already full (overflow check).',
      'Advance the top pointer to expose the next slot.',
      'Store the provided value at the top index.',
      'Surface the updated top pointer and highlight the new cell.'
    ]
  },
  pop: {
    summary: 'Remove the element at the top pointer and shrink the stack.',
    steps: [
      'Confirm the stack is non-empty; otherwise report underflow.',
      'Read the value currently at the top pointer.',
      'Decrement the top pointer and clear the slot.',
      'Return the shortened stack with the popped value in the log.'
    ]
  },
  peek: {
    summary: 'Look at the top element without mutating the underlying array.',
    steps: [
      'Ensure there is at least one element to inspect.',
      'Locate the cell referenced by the top pointer.',
      'Highlight the active cell and mirror the value in the inspector.',
      'Leave the stack contents untouched for the next action.'
    ]
  },
  isEmpty: {
    summary: 'Check whether the stack currently stores any data.',
    steps: [
      'Compare the top pointer against -1 (or size equals zero).',
      'Highlight the boolean expression inside the pseudocode.',
      'Return true when no items exist, otherwise false.',
      'Explain what the outcome means for follow-up operations.'
    ]
  },
  size: {
    summary: 'Count how many values live on the stack right now.',
    steps: [
      'Read the stack length / (top index + 1).',
      'Display the computation timeline in the explanation tray.',
      'Output the numeric size to the user interface.',
      'Remind the user how the size relates to overflow conditions.'
    ]
  }
}

const howItWorksCards = computed(() => Object.entries(stackOperations).map(([key, op]) => {
  const writeup = stackOperationWriteups[key] || { summary: op.description, steps: [] }
  return {
    key,
    label: op.label,
    summary: writeup.summary,
    steps: writeup.steps,
    best: op.info.best,
    average: op.info.average,
    worst: op.info.worst,
    space: op.info.space
  }
}))

const currentOperation = computed(() => stackOperations[selectedOp.value])

const isPlayable = computed(() => {
  if (selectedOp.value === 'push') return pushValue.value !== null && pushValue.value !== ''
  return true
})

function buildSteps() {
  const op = currentOperation.value
  if (selectedOp.value === 'push') {
    return op.generator([...baseStack.value], { value: Number(pushValue.value) || 0 })
  }
  return op.generator([...baseStack.value])
}

const steps = ref(buildSteps())
const stepIndex = ref(0)
const emptyStep = { stack: [], highlight: [], topIndex: -1, activeLine: 0, explanation: '' }
const currentStep = computed(() => steps.value[stepIndex.value] || emptyStep)
const progressPercent = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))

function cellClass(i) {
  const s = currentStep.value
  if (s.highlight && s.highlight.includes(i)) return 'highlighted'
  if (i === s.topIndex) return 'top'
  return ''
}

let timer = null
function play() { if (playing.value) { pause(); return } playing.value = true; timer = setInterval(() => { if (stepIndex.value < steps.value.length - 1) stepIndex.value++; else pause() }, speedDelay.value) }
function pause() { playing.value = false; clearInterval(timer) }
function next() { pause(); if (stepIndex.value < steps.value.length - 1) stepIndex.value++ }
function prev() { pause(); if (stepIndex.value > 0) stepIndex.value-- }
function rebuildSteps() { pause(); steps.value = buildSteps(); stepIndex.value = 0 }
function reset() { rebuildSteps() }
function generateRandom() { baseStack.value = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1); rebuildSteps() }
function applyCustomStack() { const arr = customInput.value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n)); if (arr.length < 0) return; baseStack.value = arr; rebuildSteps() }
function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: `Write a program for the Stack ${currentOperation.value.algorithmName} operation.\nTake a random input stack.` } }) }
function loadEdgeCase(arr) { baseStack.value = [...arr]; rebuildSteps() }
function selectOperation(key) { selectedOp.value = key; rebuildSteps() }

watch(pushValue, () => { if (selectedOp.value === 'push') rebuildSteps() })
watch(speedLevel, () => { if (playing.value) { pause(); play() } })

function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.so-page{min-height:100vh;background:var(--bg-page);color:var(--text-secondary);padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}
.so-container{max-width:1440px;margin:0 auto}
.so-top-bar{flex-shrink:0}
.back-btn-compact{display:flex;align-items:center;gap:6px;background:var(--accent-bg);border: 1px solid var(--accent-border);color:var(--accent-lighter);padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}
.back-btn-compact:hover{background:var(--accent-bg);transform:translateX(-2px)}
.arrow{width:16px;height:16px}
.so-title{font-size:1.6rem;font-weight:700;color:var(--text-primary);margin:0 0 4px}
.so-subtitle{color:var(--text-muted);font-size:.9rem;margin:0 0 16px}

/* Operation pills */
.so-op-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.so-pill{padding:7px 16px;border-radius:20px;border: 1px solid var(--border-default);background:rgba(100,116,139,.1);color:var(--text-tertiary);font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.so-pill:hover{background:var(--accent-bg);border-color: var(--accent-border)}
.so-pill.active{background:var(--accent-bg);border-color: var(--accent-border);color:var(--accent-lighter);font-weight:600}

/* Three-column grid */
.so-three-col{display:grid;grid-template-columns:260px 1fr 280px;gap:16px;margin-bottom:24px}
.so-controls-panel{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.so-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.so-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border: 1px solid var(--border-default);background:rgba(100,116,139,.12);color:var(--text-tertiary);font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}
.so-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}
.so-btn:disabled{opacity:.4;cursor:not-allowed}
.so-btn.active{background:var(--accent-bg);border-color: var(--accent-border)}
.so-icon{font-size:.9rem}
.so-settings-toggle{width:100%;justify-content:center}
.so-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:var(--bg-elevated);border-radius:8px}
.so-setting-row label{font-size:.78rem;color:var(--text-muted)}
.so-slider{width:100%;cursor:pointer;accent-color: var(--accent-light)}
.so-custom-input{display:flex;flex-direction:column;gap:4px}
.so-custom-input label{font-size:.75rem;color:var(--text-muted);font-weight:600}
.so-input-row{display:flex;gap:4px}
.so-text-input{flex:1;background:var(--bg-input);border: 1px solid var(--border-default);color:var(--accent-lighter);padding:6px 10px;border-radius:6px;font-size:.8rem;outline:none;width:100%}
.so-text-input:focus{border-color: var(--accent)}
.so-text-input::placeholder{color:var(--text-faint);font-size:.72rem}
.so-apply-btn{padding:6px 12px!important;background: var(--accent)!important;border:none!important;color: var(--text-primary)!important;font-weight:600!important}
.so-op-params{display:flex;flex-direction:column;gap:6px}
.so-param-label{font-size:.75rem;color:var(--text-muted);font-weight:600}
.so-code-btn{width:100%;justify-content:center;background:var(--accent-bg)!important;border-color: var(--accent-border)!important;color:var(--accent-lighter)!important}
.so-code-btn:hover{background:var(--accent-bg)!important}
.so-shortcuts h4{font-size:.78rem;color:var(--text-muted);margin:0 0 6px;font-weight:600}
.so-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:var(--text-muted)}
.so-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:var(--accent-lighter);font-size:.72rem;text-align:center}
.so-legend h4{font-size:.82rem;color:var(--text-primary);margin:0 0 8px}
.so-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:var(--text-tertiary)}
.so-legend-item small{color:var(--text-dim)}
.so-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}
.so-dot.highlighted{background:#22c55e}
.so-dot.top{background:#818cf8}
.so-dot.default{background-color: var(--accent)}

/* Center chart area */
.so-chart-area{display:flex;flex-direction:column;gap:10px}
.so-chart-wrapper{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:12px;padding:24px 16px 8px;display:flex;flex-direction:column;align-items:center;min-height:280px}
.so-stack-label-top{font-size:.7rem;font-weight:700;letter-spacing:.08em;color:var(--accent-light);margin-bottom:6px}
.so-stack-label-bottom{font-size:.7rem;font-weight:700;letter-spacing:.08em;color:var(--text-dim);margin-top:6px}
.so-cells-container{display:flex;flex-direction:column;gap:6px;align-items:center;flex:1;padding:8px 0;width:100%}
.so-empty-msg{color:var(--text-dim);font-size:.9rem;padding:40px 0;font-style:italic}
.so-cell-row{display:flex;align-items:center;gap:10px;justify-content:center;width:100%}
.so-cell-index{font-size:.65rem;color:var(--text-dim);width:20px;text-align:right;font-family:'Fira Code',monospace}
.so-cell{min-width:100px;padding:14px 20px;border-radius:10px;background-color: var(--accent);color: var(--text-primary);font-weight:700;font-size:1.1rem;text-align:center;transition:all .3s ease;box-shadow:0 2px 8px rgba(99,102,241,.25)}
.so-cell.highlighted{background:#22c55e;transform:scale(1.06);box-shadow:0 0 16px rgba(34,197,94,.4)}
.so-cell.top{background:#818cf8;box-shadow:0 0 12px rgba(129,140,248,.35)}
.so-top-indicator{font-size:.68rem;color:var(--accent-light);font-weight:700;letter-spacing:.04em;animation:so-blink 1.2s ease-in-out infinite}
@keyframes so-blink{0%,100%{opacity:1}50%{opacity:.4}}
.so-chart-footer{font-size:.72rem;color:var(--text-dim);padding:6px 0 4px;text-align:center;width:100%}
.so-scrubber{width:100%;accent-color: var(--accent-light);cursor:pointer;margin-top:4px}
.so-status-bar{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:var(--text-secondary);font-weight:500}
.so-complexity-row{display:flex;justify-content:center;gap:32px}
.so-complexity-badge{font-size:.82rem;color:var(--text-muted)}
.so-complexity-badge strong{color:var(--accent-lighter)}

/* Inspector */
.so-inspector{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:12px;padding:14px}
.so-inspector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.so-inspector-header h3{margin:0;font-size:1rem;color:var(--text-primary)}
.so-step-badge{background:var(--accent-bg);border: 1px solid var(--accent-border);padding:3px 10px;border-radius:12px;font-size:.72rem;color:var(--accent-lighter);font-weight:600}
.so-inspector-row{display:flex;justify-content:space-between;font-size:.78rem;color:var(--text-muted);margin-bottom:4px}
.so-progress-track{width:100%;height:6px;background:rgba(100,116,139,.2);border-radius:3px;margin-bottom:16px;overflow:hidden}
.so-progress-fill{height:100%;background: var(--accent);border-radius:3px;transition:width .25s}
.so-inspector-label{font-size:.7rem;letter-spacing:.06em;color:var(--text-dim);margin:14px 0 6px;font-weight:700}
.so-op-item{display:flex;align-items:center;gap:8px;font-size:.78rem;color:var(--text-tertiary);margin-bottom:4px}
.so-op-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.so-op-dot.active{background:#22c55e}
.so-metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.so-metric{display:flex;flex-direction:column}
.so-metric-label{font-size:.7rem;color:var(--text-dim)}
.so-metric-value{font-size:1rem;font-weight:700;color:var(--text-primary)}
.so-step-detail{background:var(--bg-elevated);padding:8px 10px;border-radius:6px;font-size:.78rem;color:var(--text-tertiary);font-family:'Fira Code',monospace}
.so-stack-state{background:var(--bg-elevated);padding:8px 10px;border-radius:6px;font-size:.72rem;color:var(--text-tertiary);font-family:'Fira Code',monospace;word-break:break-all;line-height:1.5}
.so-stack-length{font-size:.7rem;color:var(--text-dim);margin-top:4px}

/* Sections */
.so-section{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:12px;margin-bottom:12px;overflow:hidden}
.so-section-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:14px 18px;background:none;border:none;color:var(--text-secondary);font-size:1rem;font-weight:600;cursor:pointer;text-align:left;transition:background .15s}
.so-section-toggle:hover{background:rgba(100,116,139,.1)}
.so-info-circle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:var(--accent-bg);border: 1px solid var(--accent-border);color:var(--accent-lighter);font-size:.82rem;font-weight:700;flex-shrink:0}
.so-section-body{padding:0 20px 20px;color:var(--text-tertiary);font-size:.88rem;line-height:1.7}
.so-section-body h2{font-size:1.15rem;color:var(--text-primary);margin:0 0 8px}
.so-section-body h3{font-size:.95rem;color:var(--accent-lighter);margin:16px 0 6px}
.so-section-body ol,.so-section-body ul{padding-left:20px;margin:4px 0}
.so-section-body li{margin-bottom:3px}
.so-section-intro{color:var(--text-muted);margin:0 0 16px;font-size:.9rem}
.so-how-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.so-how-card{background:var(--bg-input);border: 1px solid var(--border-default);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px;min-height:220px;transition:border .2s,transform .2s}
.so-how-card.active{border-color: var(--accent-border);transform:translateY(-4px);box-shadow:0 8px 24px rgba(99,102,241,.2)}
.so-how-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.so-how-header h3{margin:0;color:var(--text-primary);font-size:1rem}
.so-how-header p{margin:4px 0 0;color:var(--text-tertiary);font-size:.85rem}
.so-chip{background:var(--accent-bg);border: 1px solid var(--accent-border);border-radius:999px;padding:3px 10px;font-size:.7rem;color:var(--accent-lighter);font-weight:600}
.so-step-list{margin:0;padding-left:18px;color:var(--text-tertiary);font-size:.84rem;line-height:1.5}
.so-how-meta{display:flex;flex-wrap:wrap;gap:8px;font-size:.75rem;color:var(--text-muted)}
.so-how-meta strong{color:var(--text-primary)}
.so-edge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.so-edge-card{background:var(--bg-elevated);border: 1px solid var(--border-default);border-radius:10px;padding:14px;cursor:pointer;transition:all .15s}
.so-edge-card:hover{border-color: var(--accent-border);background:var(--accent-bg)}
.so-edge-card strong{display:block;color:var(--text-primary);font-size:.88rem;margin-bottom:4px}
.so-edge-card small{color:var(--text-dim);font-size:.78rem}
.so-tips{padding-left:20px}
.so-tips li{margin-bottom:4px}

@media(max-width:1100px){.so-three-col{grid-template-columns:1fr;gap:16px}.so-chart-area{order:-1}.so-controls-panel{order:1}.so-inspector{order:2;max-height:none}}
@media(max-width:768px){.so-shortcuts{display:none}.so-legend{display:none}.so-controls-panel{padding:10px}}
@media(max-width:640px){.so-edge-grid{grid-template-columns:1fr}.so-page{padding:10px 12px 24px}.so-op-pills{gap:4px}.so-pill{padding:5px 10px;font-size:.75rem}.so-how-card{min-height:auto}}
</style>
