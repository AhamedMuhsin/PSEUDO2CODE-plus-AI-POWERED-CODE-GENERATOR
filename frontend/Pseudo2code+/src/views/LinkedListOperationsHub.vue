<template>
  <AuthNavbar />
  <main class="ll-page">
    <div class="ll-container">
      <div class="ll-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>
      <h1 class="ll-title">Linked List Operations</h1>
      <p class="ll-subtitle">Visualize linked list operations step by step</p>

      <!-- Linked List type selector -->
      <div class="ll-type-bar">
        <button v-for="t in LINKED_LIST_TYPES" :key="t.key" class="ll-type-btn"
          :class="{ active: selectedType === t.key }" @click="switchType(t.key)">
           {{ t.label }}
        </button>
      </div>

      <!-- Operation selector pills -->
      <div class="ll-op-pills">
        <button v-for="(op, key) in currentOps" :key="key" class="ll-pill"
          :class="{ active: selectedOp === key }" @click="selectOperation(key)">{{ op.label }}</button>
      </div>

      <!-- ======= THREE-COLUMN LAYOUT ======= -->
      <div class="ll-three-col">
        <!-- LEFT: Controls -->
        <aside class="ll-controls-panel">
          <div class="ll-btn-group">
            <button class="ll-btn" :class="{ active: playing }" @click="playing ? pause() : play()"
              :disabled="!isPlayable"> {{ playing ? 'Pause' : 'Play' }}</button>
            <button class="ll-btn" @click="next" :disabled="stepIndex === steps.length - 1"><span
                class="ll-icon"></span> Step</button>
          </div>
          <div class="ll-btn-group">
            <button class="ll-btn" @click="reset"> Reset</button>
            <button class="ll-btn" @click="generateRandom"> Randomize</button>
          </div>

          <button class="ll-btn ll-settings-toggle" @click="showSettings = !showSettings"><span
              class="ll-icon"></span> Settings</button>
          <div v-if="showSettings" class="ll-settings-body">
            <div class="ll-setting-row"><label>Speed: <strong>{{ speedPercent }}%</strong></label><input type="range"
                min="1" max="5" v-model.number="speedLevel" class="ll-slider" /></div>
          </div>

          <!-- Custom List -->
          <div class="ll-custom-input"><label>Custom List:</label>
            <div class="ll-input-row"><input v-model="customInput" placeholder="e.g. 5,2,8,1,9" class="ll-text-input"
                @keydown.enter="applyCustomList" /><button class="ll-btn ll-apply-btn"
                @click="applyCustomList">Go</button></div>
          </div>

          <!-- Operation-specific params -->
          <div v-if="currentOperation.paramType === 'value'" class="ll-op-params">
            <label class="ll-param-label">Value:</label>
            <input v-model.number="opParams.value" type="number" placeholder="Enter value" class="ll-text-input" />
          </div>
          <div v-if="currentOperation.paramType === 'position'" class="ll-op-params">
            <label class="ll-param-label">Position (index):</label>
            <input v-model.number="opParams.position" type="number" placeholder="Index" class="ll-text-input"
              :min="0" />
          </div>
          <div v-if="currentOperation.paramType === 'position-value'" class="ll-op-params">
            <label class="ll-param-label">Value &amp; Position:</label>
            <input v-model.number="opParams.value" type="number" placeholder="Value to insert" class="ll-text-input" />
            <input v-model.number="opParams.position" type="number" placeholder="Position (index)" class="ll-text-input"
              :min="0" :max="baseList.length" />
          </div>

          <button class="ll-btn ll-code-btn" @click="goToGenerateCode"> Generate
            Code</button>

          <div class="ll-shortcuts">
            <h4>Keyboard Shortcuts:</h4>
            <div class="ll-shortcut-grid"><span class="ll-key">Space</span><span>Play/Pause</span><span
                class="ll-key">-></span><span>Step Forward</span><span class="ll-key"><-</span><span>Step
                Back</span><span class="ll-key">R</span><span>Reset</span></div>
          </div>
          <div class="ll-legend">
            <h4>Legend</h4>
            <div class="ll-legend-item"><span class="ll-dot current"></span>
              <div><strong>Active</strong><br /><small>Currently visiting</small></div>
            </div>
            <div class="ll-legend-item"><span class="ll-dot target"></span>
              <div><strong>Target</strong><br /><small>Target / found node</small></div>
            </div>
            <div class="ll-legend-item"><span class="ll-dot default"></span>
              <div><strong>Default</strong><br /><small>Unvisited node</small></div>
            </div>
          </div>
        </aside>

        <!-- CENTER: Linked List Visualization -->
        <div class="ll-chart-area">
          <div class="ll-chart-wrapper">
            <div class="ll-head-label">HEAD</div>
            <div class="ll-nodes-container">
              <template v-if="currentStep.list.length === 0">
                <div class="ll-empty-msg">List is empty (NULL)</div>
              </template>
              <template v-else>
                <template v-for="(value, i) in currentStep.list" :key="i">
                  <div class="ll-node-group">
                    <div class="ll-node" :class="nodeClass(i)">
                      <div v-if="selectedType === 'doubly'" class="ll-node-prev">{{ i > 0 ? '<-' : 'NULL' }}</div>
                      <div class="ll-node-data">{{ value }}</div>
                      <div class="ll-node-next">{{ selectedType === 'circular' ? '->' : (i < currentStep.list.length - 1 ? '->' : 'NULL') }}</div>
                    </div>
                    <span class="ll-node-index">{{ i }}</span>
                  </div>
                  <div v-if="i < currentStep.list.length - 1" class="ll-arrow">
                    {{ selectedType === 'doubly' ? '<->' : '->' }}
                  </div>
                </template>
                <div v-if="selectedType === 'circular'" class="ll-circular-arrow">-> HEAD</div>
                <div v-else class="ll-null-label">NULL</div>
              </template>
            </div>
            <div class="ll-chart-footer">
              <span>{{ typeLabel }}  -  {{ currentOperation.label }}  -  {{ currentStep.list.length }} node(s)</span>
            </div>
            <input type="range" class="ll-scrubber" min="0" :max="steps.length - 1" v-model.number="stepIndex" />
          </div>
          <div class="ll-status-bar">{{ currentStep.explanation }}</div>
          <div class="ll-complexity-row">
            <span class="ll-complexity-badge">Best: <strong>{{ currentOperation.best }}</strong></span>
            <span class="ll-complexity-badge">Worst: <strong>{{ currentOperation.worst }}</strong></span>
            <span class="ll-complexity-badge">Space: <strong>{{ currentOperation.space }}</strong></span>
          </div>
        </div>

        <!-- RIGHT: Inspector -->
        <aside class="ll-inspector">
          <div class="ll-inspector-header">
            <h3>Inspector</h3><span class="ll-step-badge">Step {{ stepIndex + 1 }} of {{ steps.length }}</span>
          </div>
          <div class="ll-inspector-row"><span>Progress</span><span>{{ progressPercent }}%</span></div>
          <div class="ll-progress-track">
            <div class="ll-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <h4 class="ll-inspector-label">CURRENT OPERATION</h4>
          <div class="ll-op-item"><span class="ll-op-dot active"></span>{{ currentStep.explanation }}</div>

          <h4 class="ll-inspector-label">OPERATION INFO</h4>
          <div class="ll-metrics-grid">
            <div class="ll-metric"><span class="ll-metric-label">Operation</span><span class="ll-metric-value">{{ currentOperation.label }}</span></div>
            <div class="ll-metric"><span class="ll-metric-label">Best</span><span class="ll-metric-value">{{ currentOperation.best }}</span></div>
            <div class="ll-metric"><span class="ll-metric-label">Average</span><span class="ll-metric-value">{{ currentOperation.average }}</span></div>
            <div class="ll-metric"><span class="ll-metric-label">Worst</span><span class="ll-metric-value">{{ currentOperation.worst }}</span></div>
          </div>

          <h4 class="ll-inspector-label">CURRENT STEP</h4>
          <div class="ll-step-detail">{{ currentStep.explanation }}</div>

          <h4 class="ll-inspector-label">LIST STATE</h4>
          <div class="ll-list-state">{{ listStateDisplay }}</div>
          <div class="ll-list-length">Length: {{ currentStep.list.length }} node(s)</div>
          <div class="ll-list-type-label">Type: {{ typeLabel }}</div>
          <div v-if="currentStep.activeNodeIndex >= 0" class="ll-current-ptr">Current pointer: index {{ currentStep.activeNodeIndex }}</div>
        </aside>
      </div>

      <!-- How It Works -->
      <section class="ll-section">
        <button class="ll-section-toggle" @click="showHowItWorks = !showHowItWorks"><span
            class="ll-info-circle">i</span> How {{ currentOperation.label }} Works</button>
        <div v-if="showHowItWorks" class="ll-section-body">
          <p class="ll-section-intro">Linked lists rely on pointer surgery. The cards below explain the control flow and complexity for each {{ typeLabel.toLowerCase() }} operation so mobile learners can skim quickly.</p>
          <div class="ll-how-grid">
            <article v-for="card in howItWorksCards" :key="card.key" class="ll-how-card" :class="{ active: card.key === selectedOp }">
              <header class="ll-how-header">
                <div>
                  <h3>{{ card.label }}</h3>
                  <p>{{ card.summary }}</p>
                </div>
                <span class="ll-chip" v-if="card.key === selectedOp">Active</span>
              </header>
              <ol class="ll-step-list">
                <li v-for="(step, idx) in card.steps" :key="idx">{{ step }}</li>
              </ol>
              <div class="ll-how-meta">
                <span>Best: <strong>{{ card.best }}</strong></span>
                <span>Avg: <strong>{{ card.average }}</strong></span>
                <span>Worst: <strong>{{ card.worst }}</strong></span>
                <span>Space: <strong>{{ card.space }}</strong></span>
              </div>
            </article>
          </div>
          <h3>{{ typeLabel }} Properties:</h3>
          <ul v-if="selectedType === 'singly'">
            <li>Each <strong>node</strong> contains data and a <strong>next</strong> pointer</li>
            <li>The <strong>head</strong> pointer points to the first node</li>
            <li>The last node's next points to <strong>NULL</strong></li>
            <li>Traversal is <strong>one-directional</strong> (head -> tail)</li>
          </ul>
          <ul v-else-if="selectedType === 'doubly'">
            <li>Each <strong>node</strong> has <strong>prev</strong>, data, and <strong>next</strong> pointers</li>
            <li>Can traverse <strong>both directions</strong> (head <-> tail)</li>
            <li>Delete at tail is <strong>O(1)</strong>  -  no need to find predecessor</li>
            <li>Costs extra memory for the <strong>prev</strong> pointer per node</li>
          </ul>
          <ul v-else>
            <li>Last node's next points back to the <strong>head</strong> (circular loop)</li>
            <li>There is <strong>no NULL</strong> terminator</li>
            <li>Traversal must detect the <strong>head revisit</strong> to stop</li>
            <li>Useful for <strong>round-robin</strong> scheduling and circular buffers</li>
          </ul>
        </div>
      </section>

      <!-- Edge Cases -->
      <section class="ll-section">
        <button class="ll-section-toggle" @click="showEdgeCases = !showEdgeCases"><span
            class="ll-info-circle">i</span> Edge Cases &amp; Examples</button>
        <div v-if="showEdgeCases" class="ll-section-body">
          <h3>Try These:</h3>
          <div class="ll-edge-grid">
            <div class="ll-edge-card" @click="loadEdgeCase([1, 2, 3, 4, 5])"><strong>Sequential: 1->2->3->4->5</strong><small>Ordered linked list</small></div>
            <div class="ll-edge-card" @click="loadEdgeCase([10, 20, 30])"><strong>Small: 10->20->30</strong><small>Three-node list</small></div>
            <div class="ll-edge-card" @click="loadEdgeCase([42])"><strong>Single: 42</strong><small>List with one node</small></div>
            <div class="ll-edge-card" @click="loadEdgeCase([])"><strong>Empty: NULL</strong><small>Empty list  -  test edge cases</small></div>
          </div>
          <h3>Tips:</h3>
          <ul class="ll-tips">
            <li>Switch between <strong>Singly</strong>, <strong>Doubly</strong>, and <strong>Circular</strong> to compare</li>
            <li><strong>Doubly</strong> lists show <- prev pointers and <-> bidirectional arrows</li>
            <li><strong>Circular</strong> lists show the loop back to HEAD at the end</li>
            <li>Try <strong>Insert at Head</strong> vs <strong>Insert at Tail</strong> to compare complexity</li>
            <li>Use the <strong>custom list</strong> input to test any configuration</li>
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
import { linkedListOperationsMap, LINKED_LIST_TYPES } from '@/algorithms/linkedListOperations/operationsRegistry'

const router = useRouter()
const selectedType = ref('singly')
const selectedOp = ref('traverse')
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)
const customInput = ref('')
const playing = ref(false)

const baseList = ref([5, 12, 7, 3, 9])
const opParams = reactive({ value: 10, position: 2 })

const linkedListWriteups = {
  traverse: {
    summary: 'Walk through each node starting at HEAD to understand ordering.',
    steps: [
      'Initialize a pointer at HEAD and mark it as current.',
      'Visit the node, emit its value, then advance to next (and prev for doubly).',
      'Repeat until NULL (or the head again for circular lists).',
      'Collect the visit order so users can verify traversal correctness.'
    ]
  },
  insertHead: {
    summary: 'Push a new node before the current head pointer.',
    steps: [
      'Allocate a node with the requested value.',
      'Point its next pointer to the current head (and prev to NULL/dummy).',
      'Update the old head prev pointer when working with doubly lists.',
      'Move HEAD to the new node and refresh the visualization links.'
    ]
  },
  insertTail: {
    summary: 'Attach a node at the tail so it becomes the last element.',
    steps: [
      'Traverse until the pointer reaches the final node.',
      'Create the new node and connect it after the tail.',
      'For doubly lists, wire both next and prev pointers.',
      'Update TAIL (or reconnect to HEAD for circular lists).'
    ]
  },
  insertAtIndex: {
    summary: 'Splice a node into a given position inside the chain.',
    steps: [
      'Iterate until you reach the predecessor of the target index.',
      'Create a node with the incoming value.',
      'Redirect pointers so predecessor.next points to the new node.',
      'Link the new node to the successor and maintain prev pointers if needed.'
    ]
  },
  deleteHead: {
    summary: 'Drop the current head node and promote the next node.',
    steps: [
      'Ensure the list is not empty.',
      'Store a reference to head.next (or NULL).',
      'Detach the head node and adjust prev pointers.',
      'Move HEAD to the stored reference and tidy circular links.'
    ]
  },
  deleteTail: {
    summary: 'Remove the terminal node and update the tail pointer.',
    steps: [
      'Walk until the pointer sits on the last node.',
      'Capture the predecessor to keep the chain intact.',
      'Detach the tail node, clearing references for GC.',
      'Set TAIL to the predecessor (or NULL if list becomes empty).'
    ]
  },
  deleteAtIndex: {
    summary: 'Remove the node residing at a specific index.',
    steps: [
      'Traverse until you reach the target node.',
      'Hook its predecessor next to its successor.',
      'Update prev pointers when in doubly mode.',
      'If removing HEAD or TAIL, update those labels accordingly.'
    ]
  },
  search: {
    summary: 'Scan sequentially until the target value is found.',
    steps: [
      'Start at HEAD and compare each node value to the query.',
      'Stop once a match is encountered or NULL is reached.',
      'Highlight the found node and expose its index.',
      'If not found, explain that traversal exhausted the structure.'
    ]
  }
}

const currentOps = computed(() => linkedListOperationsMap[selectedType.value])
const currentOperation = computed(() => currentOps.value[selectedOp.value])
const typeLabel = computed(() => LINKED_LIST_TYPES.find(t => t.key === selectedType.value)?.label || '')

const howItWorksCards = computed(() => Object.entries(currentOps.value).map(([key, op]) => {
  const writeup = linkedListWriteups[key] || { summary: op.description, steps: [] }
  return {
    key,
    label: op.label,
    summary: writeup.summary,
    steps: writeup.steps,
    best: op.best,
    average: op.average,
    worst: op.worst,
    space: op.space
  }
}))

const isPlayable = computed(() => {
  const pt = currentOperation.value.paramType
  if (pt === 'value') return opParams.value !== null && opParams.value !== ''
  if (pt === 'position') return opParams.position !== null && opParams.position !== ''
  if (pt === 'position-value') return opParams.value !== null && opParams.value !== '' && opParams.position !== null && opParams.position !== ''
  return true
})

function buildSteps() {
  const op = currentOperation.value
  const list = [...baseList.value]
  const pt = op.paramType
  if (pt === 'value') return op.generator(list, Number(opParams.value) || 0)
  if (pt === 'position') return op.generator(list, Number(opParams.position) || 0)
  if (pt === 'position-value') return op.generator(list, Number(opParams.position) || 0, Number(opParams.value) || 0)
  return op.generator(list)
}

const steps = ref(buildSteps())
const stepIndex = ref(0)
const emptyStep = { list: [], activeNodeIndex: -1, targetIndex: -1, activePseudoLine: 0, explanation: '' }
const currentStep = computed(() => steps.value[stepIndex.value] || emptyStep)
const progressPercent = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))

const listStateDisplay = computed(() => {
  const s = currentStep.value
  if (s.list.length === 0) return 'NULL (empty)'
  const chain = s.list.join(' -> ')
  if (selectedType.value === 'circular') return chain + ' -> (HEAD)'
  return chain + ' -> NULL'
})

function nodeClass(i) {
  const s = currentStep.value
  if (i === s.activeNodeIndex) return 'current'
  if (i === s.targetIndex) return 'target'
  return ''
}

let timer = null
function play() { if (playing.value) { pause(); return } playing.value = true; timer = setInterval(() => { if (stepIndex.value < steps.value.length - 1) stepIndex.value++; else pause() }, speedDelay.value) }
function pause() { playing.value = false; clearInterval(timer) }
function next() { pause(); if (stepIndex.value < steps.value.length - 1) stepIndex.value++ }
function prev() { pause(); if (stepIndex.value > 0) stepIndex.value-- }
function rebuildSteps() { pause(); steps.value = buildSteps(); stepIndex.value = 0 }
function reset() { rebuildSteps() }
function generateRandom() { baseList.value = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 1); rebuildSteps() }
function applyCustomList() { const arr = customInput.value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n)); if (arr.length < 0) return; baseList.value = arr; rebuildSteps() }
function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: `Write a program for the ${typeLabel.value} ${currentOperation.value.label} operation.\nTake a random input linked list.` } }) }
function loadEdgeCase(arr) { baseList.value = [...arr]; rebuildSteps() }
function selectOperation(key) { selectedOp.value = key; rebuildSteps() }
function switchType(type) {
  selectedType.value = type
  // Reset to traverse if current op doesn't exist in the new type (but all types have the same ops)
  if (!linkedListOperationsMap[type][selectedOp.value]) {
    selectedOp.value = 'traverse'
  }
  rebuildSteps()
}

watch(() => ({ ...opParams }), () => rebuildSteps(), { deep: true })
watch(speedLevel, () => { if (playing.value) { pause(); play() } })

function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.ll-page{min-height:100vh;background:radial-gradient(ellipse at top,#0f172a 0%,#020617 70%);color:#e2e8f0;padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}
.ll-container{max-width:1440px;margin:0 auto}
.ll-top-bar{flex-shrink:0}
.back-btn-compact{display:flex;align-items:center;gap:6px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#e0e7ff;padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}
.back-btn-compact:hover{background:rgba(99,102,241,.25);transform:translateX(-2px)}
.arrow{width:16px;height:16px}
.ll-title{font-size:1.6rem;font-weight:700;color:#f1f5f9;margin:0 0 4px}
.ll-subtitle{color:#94a3b8;font-size:.9rem;margin:0 0 12px}

/* Type selector bar */
.ll-type-bar{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.ll-type-btn{display:flex;align-items:center;gap:6px;padding:8px 18px;border-radius:10px;border:1px solid rgba(100,116,139,.3);background:rgba(30,41,59,.6);color:#cbd5e1;font-size:.85rem;font-weight:500;cursor:pointer;transition:all .2s}
.ll-type-btn:hover{background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.35)}
.ll-type-btn.active{background:linear-gradient(135deg,rgba(99,102,241,.25),rgba(139,92,246,.2));border-color:rgba(99,102,241,.6);color:#e0e7ff;font-weight:600;box-shadow:0 0 12px rgba(99,102,241,.15)}
.ll-type-icon{font-size:1rem}

/* Operation pills */
.ll-op-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.ll-pill{padding:7px 16px;border-radius:20px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.1);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.ll-pill:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.35)}
.ll-pill.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.6);color:#e0e7ff;font-weight:600}

/* Three-column grid */
.ll-three-col{display:grid;grid-template-columns:260px 1fr 280px;gap:16px;margin-bottom:24px}
.ll-controls-panel{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.ll-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.ll-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.12);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}
.ll-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}
.ll-btn:disabled{opacity:.4;cursor:not-allowed}
.ll-btn.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.5)}
.ll-icon{font-size:.9rem}
.ll-settings-toggle{width:100%;justify-content:center}
.ll-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:rgba(15,23,42,.5);border-radius:8px}
.ll-setting-row label{font-size:.78rem;color:#94a3b8}
.ll-slider{width:100%;cursor:pointer;accent-color:#818cf8}
.ll-custom-input{display:flex;flex-direction:column;gap:4px}
.ll-custom-input label{font-size:.75rem;color:#94a3b8;font-weight:600}
.ll-input-row{display:flex;gap:4px}
.ll-text-input{flex:1;background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.35);color:#e0e7ff;padding:6px 10px;border-radius:6px;font-size:.8rem;outline:none;width:100%}
.ll-text-input:focus{border-color:#6366f1}
.ll-text-input::placeholder{color:#475569;font-size:.72rem}
.ll-apply-btn{padding:6px 12px!important;background:linear-gradient(135deg,#6366f1,#8b5cf6)!important;border:none!important;color:#fff!important;font-weight:600!important}
.ll-op-params{display:flex;flex-direction:column;gap:6px}
.ll-param-label{font-size:.75rem;color:#94a3b8;font-weight:600}
.ll-code-btn{width:100%;justify-content:center;background:rgba(99,102,241,.15)!important;border-color:rgba(99,102,241,.35)!important;color:#a5b4fc!important}
.ll-code-btn:hover{background:rgba(99,102,241,.28)!important}
.ll-shortcuts h4{font-size:.78rem;color:#94a3b8;margin:0 0 6px;font-weight:600}
.ll-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:#94a3b8}
.ll-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:#e0e7ff;font-size:.72rem;text-align:center}
.ll-legend h4{font-size:.82rem;color:#f1f5f9;margin:0 0 8px}
.ll-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:#cbd5e1}
.ll-legend-item small{color:#64748b}
.ll-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}
.ll-dot.current{background:#22c55e}
.ll-dot.target{background:#f59e0b}
.ll-dot.default{background:#6366f1}

/* Center chart area */
.ll-chart-area{display:flex;flex-direction:column;gap:10px}
.ll-chart-wrapper{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:24px 16px 8px;display:flex;flex-direction:column;align-items:center;min-height:220px}
.ll-head-label{font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#818cf8;margin-bottom:8px;align-self:flex-start;padding-left:8px}
.ll-nodes-container{display:flex;gap:0;align-items:center;flex:1;flex-wrap:wrap;padding:12px 0;justify-content:center;row-gap:20px}
.ll-empty-msg{color:#64748b;font-size:.9rem;padding:40px 0;font-style:italic}
.ll-node-group{display:flex;flex-direction:column;align-items:center;gap:4px}
.ll-node{display:flex;border-radius:10px;overflow:hidden;transition:all .3s ease;box-shadow:0 2px 8px rgba(99,102,241,.2)}
.ll-node-data{padding:12px 16px;background:#6366f1;color:#fff;font-weight:700;font-size:1rem;min-width:40px;text-align:center}
.ll-node-next{padding:12px 10px;background:rgba(99,102,241,.3);color:#a5b4fc;font-size:.85rem;display:flex;align-items:center}
.ll-node-prev{padding:12px 10px;background:rgba(99,102,241,.3);color:#a5b4fc;font-size:.85rem;display:flex;align-items:center}
.ll-node.current .ll-node-data{background:#22c55e}
.ll-node.current .ll-node-next,.ll-node.current .ll-node-prev{background:rgba(34,197,94,.3)}
.ll-node.current{box-shadow:0 0 16px rgba(34,197,94,.4);transform:scale(1.06)}
.ll-node.target .ll-node-data{background:#f59e0b}
.ll-node.target .ll-node-next,.ll-node.target .ll-node-prev{background:rgba(245,158,11,.3)}
.ll-node.target{box-shadow:0 0 14px rgba(245,158,11,.35);transform:scale(1.06)}
.ll-node-index{font-size:.6rem;color:#64748b}
.ll-arrow{color:#818cf8;font-size:1.2rem;font-weight:700;margin:0 2px;flex-shrink:0}
.ll-null-label{color:#64748b;font-size:.75rem;font-weight:700;letter-spacing:.06em;margin-left:4px;padding:8px 12px;border:1px dashed rgba(100,116,139,.4);border-radius:8px}
.ll-circular-arrow{color:#a855f7;font-size:.75rem;font-weight:700;letter-spacing:.06em;margin-left:4px;padding:8px 12px;border:1px solid rgba(168,85,247,.4);border-radius:8px;background:rgba(168,85,247,.08)}
.ll-chart-footer{font-size:.72rem;color:#64748b;padding:6px 0 4px;text-align:center;width:100%}
.ll-scrubber{width:100%;accent-color:#818cf8;cursor:pointer;margin-top:4px}
.ll-status-bar{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:#e2e8f0;font-weight:500}
.ll-complexity-row{display:flex;justify-content:center;gap:32px}
.ll-complexity-badge{font-size:.82rem;color:#94a3b8}
.ll-complexity-badge strong{color:#e0e7ff}

/* Inspector */
.ll-inspector{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px}
.ll-inspector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.ll-inspector-header h3{margin:0;font-size:1rem;color:#f1f5f9}
.ll-step-badge{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);padding:3px 10px;border-radius:12px;font-size:.72rem;color:#a5b4fc;font-weight:600}
.ll-inspector-row{display:flex;justify-content:space-between;font-size:.78rem;color:#94a3b8;margin-bottom:4px}
.ll-progress-track{width:100%;height:6px;background:rgba(100,116,139,.2);border-radius:3px;margin-bottom:16px;overflow:hidden}
.ll-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#818cf8);border-radius:3px;transition:width .25s}
.ll-inspector-label{font-size:.7rem;letter-spacing:.06em;color:#64748b;margin:14px 0 6px;font-weight:700}
.ll-op-item{display:flex;align-items:center;gap:8px;font-size:.78rem;color:#cbd5e1;margin-bottom:4px}
.ll-op-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.ll-op-dot.active{background:#22c55e}
.ll-metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ll-metric{display:flex;flex-direction:column}
.ll-metric-label{font-size:.7rem;color:#64748b}
.ll-metric-value{font-size:1rem;font-weight:700;color:#f1f5f9}
.ll-step-detail{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.78rem;color:#cbd5e1;font-family:'Fira Code',monospace}
.ll-list-state{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.72rem;color:#cbd5e1;font-family:'Fira Code',monospace;word-break:break-all;line-height:1.5}
.ll-list-length{font-size:.7rem;color:#64748b;margin-top:4px}
.ll-list-type-label{font-size:.7rem;color:#818cf8;margin-top:2px}
.ll-current-ptr{font-size:.7rem;color:#22c55e;margin-top:2px}

/* Sections */
.ll-section{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;margin-bottom:12px;overflow:hidden}
.ll-section-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:14px 18px;background:none;border:none;color:#e2e8f0;font-size:1rem;font-weight:600;cursor:pointer;text-align:left;transition:background .15s}
.ll-section-toggle:hover{background:rgba(100,116,139,.1)}
.ll-info-circle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);color:#a5b4fc;font-size:.82rem;font-weight:700;flex-shrink:0}
.ll-section-body{padding:0 20px 20px;color:#cbd5e1;font-size:.88rem;line-height:1.7}
.ll-section-body h2{font-size:1.15rem;color:#f1f5f9;margin:0 0 8px}
.ll-section-body h3{font-size:.95rem;color:#e0e7ff;margin:16px 0 6px}
.ll-section-body ol,.ll-section-body ul{padding-left:20px;margin:4px 0}
.ll-section-body li{margin-bottom:3px}
.ll-section-intro{color:#94a3b8;margin:0 0 16px;font-size:.9rem}
.ll-how-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:12px}
.ll-how-card{background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px;min-height:220px;transition:border .2s,transform .2s}
.ll-how-card.active{border-color:rgba(99,102,241,.6);transform:translateY(-4px);box-shadow:0 8px 24px rgba(99,102,241,.2)}
.ll-how-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.ll-how-header h3{margin:0;color:#f8fafc;font-size:1rem}
.ll-how-header p{margin:4px 0 0;color:#cbd5e1;font-size:.85rem}
.ll-chip{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.5);border-radius:999px;padding:3px 10px;font-size:.7rem;color:#c7d2fe;font-weight:600}
.ll-step-list{margin:0;padding-left:18px;color:#cbd5e1;font-size:.84rem;line-height:1.5}
.ll-how-meta{display:flex;flex-wrap:wrap;gap:8px;font-size:.75rem;color:#94a3b8}
.ll-how-meta strong{color:#f1f5f9}
.ll-edge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.ll-edge-card{background:rgba(15,23,42,.5);border:1px solid rgba(100,116,139,.3);border-radius:10px;padding:14px;cursor:pointer;transition:all .15s}
.ll-edge-card:hover{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.08)}
.ll-edge-card strong{display:block;color:#f1f5f9;font-size:.88rem;margin-bottom:4px}
.ll-edge-card small{color:#64748b;font-size:.78rem}
.ll-tips{padding-left:20px}
.ll-tips li{margin-bottom:4px}

@media(max-width:1100px){.ll-three-col{grid-template-columns:1fr;gap:16px}.ll-chart-area{order:-1}.ll-controls-panel{order:1}.ll-inspector{order:2;max-height:none}}
@media(max-width:768px){.ll-shortcuts{display:none}.ll-legend{display:none}.ll-controls-panel{padding:10px}}
@media(max-width:640px){.ll-edge-grid{grid-template-columns:1fr}.ll-page{padding:10px 12px 24px}.ll-op-pills{gap:4px}.ll-pill{padding:5px 10px;font-size:.75rem}.ll-type-bar{gap:4px}.ll-type-btn{padding:6px 12px;font-size:.78rem}.ll-how-card{min-height:auto}}
</style>
