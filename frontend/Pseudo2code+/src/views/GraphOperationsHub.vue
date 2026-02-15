<template>
  <AuthNavbar />
  <main class="go-page">
    <div class="go-container">
      <div class="go-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>
      <h1 class="go-title">Graph Operations</h1>
      <p class="go-subtitle">Visualize graph algorithms step by step</p>

      <!-- Operation selector pills -->
      <div class="go-op-pills">
        <button v-for="(op, key) in graphOperations" :key="key" class="go-pill"
          :class="{ active: selectedOp === key }" @click="selectOperation(key)">{{ op.label }}</button>
      </div>

      <!-- ═══════ THREE-COLUMN LAYOUT ═══════ -->
      <div class="go-three-col">
        <!-- LEFT: Controls -->
        <aside class="go-controls-panel">
          <div class="go-btn-group">
            <button class="go-btn" :class="{ active: playing }" @click="playing ? pause() : play()"
              :disabled="!isPlayable"><span class="go-icon">▶</span> {{ playing ? 'Pause' : 'Play' }}</button>
            <button class="go-btn" @click="next" :disabled="stepIndex === steps.length - 1"><span
                class="go-icon">⏭</span> Step</button>
          </div>
          <div class="go-btn-group">
            <button class="go-btn" @click="reset"><span class="go-icon">↺</span> Reset</button>
            <button class="go-btn" @click="generateRandom"><span class="go-icon">⤮</span> Randomize</button>
          </div>

          <button class="go-btn go-settings-toggle" @click="showSettings = !showSettings"><span
              class="go-icon">⚙</span> Settings</button>
          <div v-if="showSettings" class="go-settings-body">
            <div class="go-setting-row"><label>Speed: <strong>{{ speedPercent }}%</strong></label><input type="range"
                min="1" max="5" v-model.number="speedLevel" class="go-slider" /></div>
          </div>

          <!-- Graph Type -->
          <div class="go-graph-type">
            <label class="go-param-label">Graph Type:</label>
            <div class="go-type-row">
              <button class="go-type-btn" :class="{ active: !isDirected }" @click="setDirected(false)">Undirected</button>
              <button class="go-type-btn" :class="{ active: isDirected }" @click="setDirected(true)">Directed</button>
            </div>
            <label class="go-check-label"><input type="checkbox" v-model="isWeighted" @change="rebuildGraph" /> Weighted</label>
          </div>

          <!-- Custom Graph -->
          <div class="go-custom-input"><label>Edges (from-to pairs):</label>
            <div class="go-input-row"><input v-model="customEdges" placeholder="A-B,B-C,A-C" class="go-text-input"
                @keydown.enter="applyCustomGraph" /><button class="go-btn go-apply-btn"
                @click="applyCustomGraph">Go</button></div>
          </div>

          <!-- CheckPath params -->
          <div v-if="selectedOp === 'checkPath'" class="go-op-params">
            <label class="go-param-label">Start &amp; End Nodes:</label>
            <select v-model="pathStart" class="go-select">
              <option v-for="n in graphNodes" :key="n" :value="n">{{ n }}</option>
            </select>
            <select v-model="pathEnd" class="go-select">
              <option v-for="n in graphNodes" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <button class="go-btn go-code-btn" @click="goToGenerateCode"><span class="go-icon">{ }</span> Generate
            Code</button>

          <div class="go-shortcuts">
            <h4>Keyboard Shortcuts:</h4>
            <div class="go-shortcut-grid"><span class="go-key">Space</span><span>Play/Pause</span><span
                class="go-key">→</span><span>Step Forward</span><span class="go-key">←</span><span>Step
                Back</span><span class="go-key">R</span><span>Reset</span></div>
          </div>
          <div class="go-legend">
            <h4>Legend</h4>
            <div class="go-legend-item"><span class="go-dot active"></span>
              <div><strong>Active</strong><br /><small>Currently processing</small></div>
            </div>
            <div class="go-legend-item"><span class="go-dot visited"></span>
              <div><strong>Visited</strong><br /><small>Already traversed</small></div>
            </div>
            <div class="go-legend-item"><span class="go-dot highlight-edge"></span>
              <div><strong>Edge</strong><br /><small>Currently exploring</small></div>
            </div>
            <div class="go-legend-item"><span class="go-dot default"></span>
              <div><strong>Default</strong><br /><small>Unvisited node</small></div>
            </div>
          </div>
        </aside>

        <!-- CENTER: Graph Visualization -->
        <div class="go-chart-area">
          <div class="go-chart-wrapper">
            <div class="go-graph-container">
              <svg class="go-graph-svg" :viewBox="svgViewBox" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arrowMarker" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(100,116,139,0.5)" />
                  </marker>
                  <marker id="arrowMarkerHighlight" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#818cf8" />
                  </marker>
                </defs>
                <!-- Edges -->
                <g v-for="(edge, i) in renderedEdges" :key="'e'+i">
                  <line :x1="edge.x1" :y1="edge.y1" :x2="edge.x2" :y2="edge.y2"
                    class="go-edge" :class="{ highlighted: edge.highlighted }"
                    :marker-end="isDirected ? (edge.highlighted ? 'url(#arrowMarkerHighlight)' : 'url(#arrowMarker)') : ''" />
                  <text v-if="isWeighted && edge.weight" :x="(edge.x1+edge.x2)/2" :y="(edge.y1+edge.y2)/2 - 8"
                    text-anchor="middle" class="go-weight-text">{{ edge.weight }}</text>
                </g>
                <!-- Nodes -->
                <g v-for="nd in renderedNodes" :key="'n'+nd.id">
                  <circle :cx="nd.x" :cy="nd.y" r="24" class="go-node-circle" :class="graphNodeClass(nd)" />
                  <text :x="nd.x" :y="nd.y + 5" text-anchor="middle" class="go-node-text" :class="graphNodeClass(nd)">{{ nd.label }}</text>
                </g>
              </svg>
            </div>
            <div class="go-chart-footer"><span>{{ currentOperation.label }} — {{ graphNodes.length }} nodes, {{ currentEdges.length }} edges</span></div>
            <input type="range" class="go-scrubber" min="0" :max="steps.length - 1" v-model.number="stepIndex" />
          </div>
          <div class="go-status-bar">{{ currentStep.explanation }}</div>
          <div class="go-complexity-row">
            <span class="go-complexity-badge">Time: <strong>{{ currentOperation.info.time }}</strong></span>
            <span class="go-complexity-badge">Space: <strong>{{ currentOperation.info.space }}</strong></span>
          </div>
          <!-- Extra info cards -->
          <div v-if="currentStep.distances" class="go-extra-info">
            <strong>Distances:</strong>
            <span v-for="(dist, node) in currentStep.distances" :key="node" class="go-dist-badge">
              {{ node }}: {{ dist === Infinity ? '∞' : dist }}
            </span>
          </div>
          <div v-if="currentStep.queueState && currentStep.queueState.length > 0" class="go-extra-info">
            <strong>Queue:</strong> [{{ currentStep.queueState.join(', ') }}]
          </div>
          <div v-if="currentStep.stackState && currentStep.stackState.length > 0" class="go-extra-info">
            <strong>Stack:</strong> [{{ currentStep.stackState.join(', ') }}]
          </div>
        </div>

        <!-- RIGHT: Inspector -->
        <aside class="go-inspector">
          <div class="go-inspector-header">
            <h3>Inspector</h3><span class="go-step-badge">Step {{ stepIndex + 1 }} of {{ steps.length }}</span>
          </div>
          <div class="go-inspector-row"><span>Progress</span><span>{{ progressPercent }}%</span></div>
          <div class="go-progress-track">
            <div class="go-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <h4 class="go-inspector-label">CURRENT OPERATION</h4>
          <div class="go-op-item"><span class="go-op-dot active"></span>{{ currentStep.explanation }}</div>

          <h4 class="go-inspector-label">ALGORITHM INFO</h4>
          <div class="go-metrics-grid">
            <div class="go-metric"><span class="go-metric-label">Algorithm</span><span class="go-metric-value">{{ currentOperation.label }}</span></div>
            <div class="go-metric"><span class="go-metric-label">Time</span><span class="go-metric-value">{{ currentOperation.info.time }}</span></div>
            <div class="go-metric"><span class="go-metric-label">Space</span><span class="go-metric-value">{{ currentOperation.info.space }}</span></div>
            <div class="go-metric"><span class="go-metric-label">Type</span><span class="go-metric-value">{{ isDirected ? 'Directed' : 'Undirected' }}</span></div>
          </div>

          <h4 class="go-inspector-label">CURRENT STEP</h4>
          <div class="go-step-detail">{{ currentStep.explanation }}</div>

          <h4 class="go-inspector-label">VISITED NODES</h4>
          <div class="go-visited-list">{{ currentStep.visitedNodes && currentStep.visitedNodes.length > 0 ? currentStep.visitedNodes.join(' → ') : '(none yet)' }}</div>

          <h4 class="go-inspector-label">GRAPH INFO</h4>
          <div class="go-graph-info">
            <div>Nodes: {{ graphNodes.length }}</div>
            <div>Edges: {{ currentEdges.length }}</div>
            <div>{{ isDirected ? 'Directed' : 'Undirected' }}{{ isWeighted ? ', Weighted' : '' }}</div>
          </div>
        </aside>
      </div>

      <!-- How It Works -->
      <section class="go-section">
        <button class="go-section-toggle" @click="showHowItWorks = !showHowItWorks"><span
            class="go-info-circle">ⓘ</span> How {{ currentOperation.label }} Works</button>
        <div v-if="showHowItWorks" class="go-section-body">
          <h2>{{ currentOperation.label }}</h2>
          <p>{{ currentOperation.info.description }}</p>
          <h3>Complexity:</h3>
          <ul>
            <li><strong>Time:</strong> {{ currentOperation.info.time }}</li>
            <li><strong>Space:</strong> {{ currentOperation.info.space }}</li>
          </ul>
          <h3>Graph Concepts:</h3>
          <ul>
            <li><strong>Vertex (Node)</strong>: A point in the graph</li>
            <li><strong>Edge</strong>: A connection between two vertices</li>
            <li><strong>Directed</strong>: Edges have direction (one-way)</li>
            <li><strong>Undirected</strong>: Edges are bidirectional</li>
            <li><strong>Weighted</strong>: Edges have numeric costs/weights</li>
            <li><strong>BFS</strong> uses a <strong>queue</strong> (level-by-level)</li>
            <li><strong>DFS</strong> uses a <strong>stack</strong> (depth-first)</li>
          </ul>
        </div>
      </section>

      <!-- Edge Cases -->
      <section class="go-section">
        <button class="go-section-toggle" @click="showEdgeCases = !showEdgeCases"><span
            class="go-info-circle">ⓘ</span> Edge Cases &amp; Examples</button>
        <div v-if="showEdgeCases" class="go-section-body">
          <h3>Try These:</h3>
          <div class="go-edge-grid">
            <div class="go-edge-card" @click="loadPreset('triangle')"><strong>Triangle: A-B-C</strong><small>Simple 3-node cycle</small></div>
            <div class="go-edge-card" @click="loadPreset('tree')"><strong>Tree: A-B, A-C, B-D, B-E</strong><small>Tree-shaped graph (no cycles)</small></div>
            <div class="go-edge-card" @click="loadPreset('complex')"><strong>Complex: 6 nodes</strong><small>Multiple paths and possible cycles</small></div>
            <div class="go-edge-card" @click="loadPreset('disconnected')"><strong>Disconnected</strong><small>Two separate components</small></div>
          </div>
          <h3>Tips:</h3>
          <ul class="go-tips">
            <li><strong>BFS</strong> explores neighbors first — good for shortest path in unweighted graphs</li>
            <li><strong>DFS</strong> goes deep first — good for pathfinding and topology</li>
            <li><strong>Dijkstra</strong> needs non-negative weights for correct results</li>
            <li>Toggle <strong>Directed/Undirected</strong> to see how algorithms behave differently</li>
            <li>Use <strong>custom edges</strong> input: e.g. <code>A-B,B-C,C-A</code></li>
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
import { graphOperations } from '@/algorithms/graphOperations/graphOperationsMap'
import { Graph } from '@/algorithms/graphOperations/Graph'

const router = useRouter()
const selectedOp = ref('bfs')
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)
const customEdges = ref('')
const playing = ref(false)
const isDirected = ref(false)
const isWeighted = ref(false)
const pathStart = ref('')
const pathEnd = ref('')

// Default graph edges
const edgeDefs = ref([
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'D', weight: 3 },
  { from: 'B', to: 'E', weight: 1 },
  { from: 'C', to: 'E', weight: 5 },
  { from: 'D', to: 'E', weight: 2 }
])

const graphNodes = computed(() => {
  const ns = new Set()
  edgeDefs.value.forEach(e => { ns.add(e.from); ns.add(e.to) })
  return [...ns].sort()
})

const currentEdges = computed(() => edgeDefs.value)

const currentOperation = computed(() => graphOperations[selectedOp.value])

const isPlayable = computed(() => {
  if (selectedOp.value === 'checkPath') return pathStart.value && pathEnd.value
  return true
})

function createGraph() {
  const g = new Graph(isDirected.value, isWeighted.value)
  graphNodes.value.forEach(n => g.addNode(n))
  edgeDefs.value.forEach(e => g.addEdge(e.from, e.to, isWeighted.value ? e.weight : 1))
  return g
}

function buildSteps() {
  const g = createGraph()
  const op = currentOperation.value
  const params = {}
  if (selectedOp.value === 'checkPath') {
    params.startNode = pathStart.value || graphNodes.value[0]
    params.endNode = pathEnd.value || graphNodes.value[graphNodes.value.length - 1]
  }
  return op.generateSteps(g, params)
}

// Initialize path params
watch(graphNodes, (ns) => {
  if (ns.length > 0) {
    if (!pathStart.value) pathStart.value = ns[0]
    if (!pathEnd.value) pathEnd.value = ns[ns.length - 1]
  }
}, { immediate: true })

const steps = ref(buildSteps())
const stepIndex = ref(0)
const emptyStep = { graph: [], edges: [], visitedNodes: [], activeNode: null, highlightedEdges: [], activePseudoLine: 0, explanation: 'No steps available' }
const currentStep = computed(() => steps.value[stepIndex.value] || emptyStep)
const progressPercent = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))

// Graph layout — circular positioning
const renderedNodes = computed(() => {
  const nodes = graphNodes.value
  const count = nodes.length
  if (count === 0) return []
  const cx = 200, cy = 200, radius = Math.min(150, 40 + count * 20)
  return nodes.map((n, i) => {
    const angle = (2 * Math.PI * i / count) - Math.PI / 2
    return { id: n, label: n, x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
  })
})

const nodePositions = computed(() => {
  const map = new Map()
  renderedNodes.value.forEach(n => map.set(n.id, { x: n.x, y: n.y }))
  return map
})

const renderedEdges = computed(() => {
  const s = currentStep.value
  return edgeDefs.value.map(e => {
    const p1 = nodePositions.value.get(e.from)
    const p2 = nodePositions.value.get(e.to)
    if (!p1 || !p2) return null
    const hl = s.highlightedEdges && s.highlightedEdges.some(he =>
      (he.from === e.from && he.to === e.to) || (!isDirected.value && he.from === e.to && he.to === e.from)
    )
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, from: e.from, to: e.to, weight: e.weight, highlighted: hl }
  }).filter(Boolean)
})

const svgViewBox = computed(() => {
  if (renderedNodes.value.length === 0) return '0 0 400 400'
  const xs = renderedNodes.value.map(n => n.x)
  const ys = renderedNodes.value.map(n => n.y)
  const minX = Math.min(...xs) - 50
  const maxX = Math.max(...xs) + 50
  const minY = Math.min(...ys) - 50
  const maxY = Math.max(...ys) + 50
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
})

function graphNodeClass(nd) {
  const s = currentStep.value
  if (nd.id === s.activeNode) return 'active'
  if (s.visitedNodes && s.visitedNodes.includes(nd.id)) return 'visited'
  return ''
}

let timer = null
function play() { if (playing.value) { pause(); return } playing.value = true; timer = setInterval(() => { if (stepIndex.value < steps.value.length - 1) stepIndex.value++; else pause() }, speedDelay.value) }
function pause() { playing.value = false; clearInterval(timer) }
function next() { pause(); if (stepIndex.value < steps.value.length - 1) stepIndex.value++ }
function prev() { pause(); if (stepIndex.value > 0) stepIndex.value-- }
function rebuildSteps() { pause(); steps.value = buildSteps(); stepIndex.value = 0 }
function rebuildGraph() { rebuildSteps() }
function reset() { rebuildSteps() }
function setDirected(val) { isDirected.value = val; rebuildSteps() }

function generateRandom() {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
  const count = Math.floor(Math.random() * 3) + 4
  const nodes = labels.slice(0, count)
  const newEdges = []
  // Ensure connected: chain
  for (let i = 0; i < count - 1; i++) {
    newEdges.push({ from: nodes[i], to: nodes[i + 1], weight: Math.floor(Math.random() * 9) + 1 })
  }
  // Add random extra edges
  const extra = Math.floor(Math.random() * 3) + 1
  for (let k = 0; k < extra; k++) {
    const a = nodes[Math.floor(Math.random() * count)]
    const b = nodes[Math.floor(Math.random() * count)]
    if (a !== b && !newEdges.some(e => e.from === a && e.to === b)) {
      newEdges.push({ from: a, to: b, weight: Math.floor(Math.random() * 9) + 1 })
    }
  }
  edgeDefs.value = newEdges
  rebuildSteps()
}

function applyCustomGraph() {
  const parts = customEdges.value.split(',').map(s => s.trim()).filter(Boolean)
  const newEdges = []
  parts.forEach(p => {
    const [a, b, w] = p.split('-')
    if (a && b) newEdges.push({ from: a.trim().toUpperCase(), to: b.trim().toUpperCase(), weight: Number(w) || 1 })
  })
  if (newEdges.length > 0) { edgeDefs.value = newEdges; rebuildSteps() }
}

function loadPreset(name) {
  const presets = {
    triangle: [{ from: 'A', to: 'B', weight: 1 }, { from: 'B', to: 'C', weight: 1 }, { from: 'C', to: 'A', weight: 1 }],
    tree: [{ from: 'A', to: 'B', weight: 2 }, { from: 'A', to: 'C', weight: 3 }, { from: 'B', to: 'D', weight: 1 }, { from: 'B', to: 'E', weight: 4 }],
    complex: [{ from: 'A', to: 'B', weight: 4 }, { from: 'A', to: 'C', weight: 2 }, { from: 'B', to: 'D', weight: 3 }, { from: 'B', to: 'E', weight: 1 }, { from: 'C', to: 'E', weight: 5 }, { from: 'D', to: 'F', weight: 2 }, { from: 'E', to: 'F', weight: 3 }],
    disconnected: [{ from: 'A', to: 'B', weight: 1 }, { from: 'B', to: 'C', weight: 2 }, { from: 'D', to: 'E', weight: 3 }]
  }
  edgeDefs.value = presets[name] || presets.complex
  rebuildSteps()
}

function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: `Write a program for Graph ${currentOperation.value.algorithmName}.\nUse an adjacency list representation.` } }) }
function selectOperation(key) { selectedOp.value = key; rebuildSteps() }

watch(speedLevel, () => { if (playing.value) { pause(); play() } })
watch(() => pathStart.value + pathEnd.value, () => { if (selectedOp.value === 'checkPath') rebuildSteps() })

function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.go-page{min-height:100vh;background:radial-gradient(ellipse at top,#0f172a 0%,#020617 70%);color:#e2e8f0;padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}
.go-container{max-width:1440px;margin:0 auto}
.go-top-bar{flex-shrink:0}
.back-btn-compact{display:flex;align-items:center;gap:6px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#e0e7ff;padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}
.back-btn-compact:hover{background:rgba(99,102,241,.25);transform:translateX(-2px)}
.arrow{width:16px;height:16px}
.go-title{font-size:1.6rem;font-weight:700;color:#f1f5f9;margin:0 0 4px}
.go-subtitle{color:#94a3b8;font-size:.9rem;margin:0 0 16px}

/* Operation pills */
.go-op-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.go-pill{padding:7px 16px;border-radius:20px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.1);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.go-pill:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.35)}
.go-pill.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.6);color:#e0e7ff;font-weight:600}

/* Three-column grid */
.go-three-col{display:grid;grid-template-columns:260px 1fr 280px;gap:16px;margin-bottom:24px}
.go-controls-panel{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.go-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.go-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.12);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}
.go-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}
.go-btn:disabled{opacity:.4;cursor:not-allowed}
.go-btn.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.5)}
.go-icon{font-size:.9rem}
.go-settings-toggle{width:100%;justify-content:center}
.go-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:rgba(15,23,42,.5);border-radius:8px}
.go-setting-row label{font-size:.78rem;color:#94a3b8}
.go-slider{width:100%;cursor:pointer;accent-color:#818cf8}
.go-graph-type{display:flex;flex-direction:column;gap:6px}
.go-type-row{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.go-type-btn{padding:6px 8px;border-radius:8px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.1);color:#cbd5e1;font-size:.78rem;cursor:pointer;transition:all .15s;text-align:center}
.go-type-btn.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.5);color:#e0e7ff;font-weight:600}
.go-check-label{display:flex;align-items:center;gap:6px;font-size:.78rem;color:#94a3b8;cursor:pointer}
.go-check-label input{accent-color:#818cf8}
.go-custom-input{display:flex;flex-direction:column;gap:4px}
.go-custom-input label{font-size:.75rem;color:#94a3b8;font-weight:600}
.go-input-row{display:flex;gap:4px}
.go-text-input{flex:1;background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.35);color:#e0e7ff;padding:6px 10px;border-radius:6px;font-size:.8rem;outline:none;width:100%}
.go-text-input:focus{border-color:#6366f1}
.go-text-input::placeholder{color:#475569;font-size:.72rem}
.go-apply-btn{padding:6px 12px!important;background:linear-gradient(135deg,#6366f1,#8b5cf6)!important;border:none!important;color:#fff!important;font-weight:600!important}
.go-op-params{display:flex;flex-direction:column;gap:6px}
.go-param-label{font-size:.75rem;color:#94a3b8;font-weight:600}
.go-select{background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.35);color:#e0e7ff;padding:6px 10px;border-radius:6px;font-size:.8rem;outline:none;cursor:pointer}
.go-select:focus{border-color:#6366f1}
.go-code-btn{width:100%;justify-content:center;background:rgba(99,102,241,.15)!important;border-color:rgba(99,102,241,.35)!important;color:#a5b4fc!important}
.go-code-btn:hover{background:rgba(99,102,241,.28)!important}
.go-shortcuts h4{font-size:.78rem;color:#94a3b8;margin:0 0 6px;font-weight:600}
.go-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:#94a3b8}
.go-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:#e0e7ff;font-size:.72rem;text-align:center}
.go-legend h4{font-size:.82rem;color:#f1f5f9;margin:0 0 8px}
.go-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:#cbd5e1}
.go-legend-item small{color:#64748b}
.go-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}
.go-dot.active{background:#22c55e}
.go-dot.visited{background:#38bdf8}
.go-dot.highlight-edge{background:#818cf8}
.go-dot.default{background:#6366f1}

/* Center chart area */
.go-chart-area{display:flex;flex-direction:column;gap:10px}
.go-chart-wrapper{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:24px 16px 8px;display:flex;flex-direction:column;align-items:center;min-height:320px}
.go-graph-container{width:100%;flex:1;display:flex;align-items:center;justify-content:center;min-height:280px}
.go-graph-svg{width:100%;max-height:450px}
.go-edge{stroke:rgba(100,116,139,.4);stroke-width:2;transition:all .3s}
.go-edge.highlighted{stroke:#818cf8;stroke-width:3}
.go-weight-text{fill:#94a3b8;font-size:11px;font-weight:600}
.go-node-circle{fill:#6366f1;stroke:rgba(99,102,241,.6);stroke-width:2;transition:all .3s ease}
.go-node-circle.active{fill:#22c55e;stroke:#4ade80;filter:drop-shadow(0 0 10px rgba(34,197,94,.5))}
.go-node-circle.visited{fill:#38bdf8;stroke:#7dd3fc}
.go-node-text{fill:#fff;font-size:14px;font-weight:700;font-family:'Inter','Segoe UI',sans-serif}
.go-node-text.active{fill:#fff}
.go-node-text.visited{fill:#fff}
.go-chart-footer{font-size:.72rem;color:#64748b;padding:6px 0 4px;text-align:center;width:100%}
.go-scrubber{width:100%;accent-color:#818cf8;cursor:pointer;margin-top:4px}
.go-status-bar{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:#e2e8f0;font-weight:500}
.go-complexity-row{display:flex;justify-content:center;gap:32px}
.go-complexity-badge{font-size:.82rem;color:#94a3b8}
.go-complexity-badge strong{color:#e0e7ff}
.go-extra-info{background:rgba(30,41,59,.65);border:1px solid rgba(99,102,241,.25);border-radius:10px;padding:10px 20px;font-size:.82rem;color:#a5b4fc;font-family:'Fira Code',monospace;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.go-dist-badge{background:rgba(99,102,241,.15);padding:2px 8px;border-radius:6px;font-size:.78rem}

/* Inspector */
.go-inspector{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px}
.go-inspector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.go-inspector-header h3{margin:0;font-size:1rem;color:#f1f5f9}
.go-step-badge{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);padding:3px 10px;border-radius:12px;font-size:.72rem;color:#a5b4fc;font-weight:600}
.go-inspector-row{display:flex;justify-content:space-between;font-size:.78rem;color:#94a3b8;margin-bottom:4px}
.go-progress-track{width:100%;height:6px;background:rgba(100,116,139,.2);border-radius:3px;margin-bottom:16px;overflow:hidden}
.go-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#818cf8);border-radius:3px;transition:width .25s}
.go-inspector-label{font-size:.7rem;letter-spacing:.06em;color:#64748b;margin:14px 0 6px;font-weight:700}
.go-op-item{display:flex;align-items:center;gap:8px;font-size:.78rem;color:#cbd5e1;margin-bottom:4px}
.go-op-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.go-op-dot.active{background:#22c55e}
.go-metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.go-metric{display:flex;flex-direction:column}
.go-metric-label{font-size:.7rem;color:#64748b}
.go-metric-value{font-size:.9rem;font-weight:700;color:#f1f5f9}
.go-step-detail{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.78rem;color:#cbd5e1;font-family:'Fira Code',monospace}
.go-visited-list{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.72rem;color:#cbd5e1;font-family:'Fira Code',monospace;word-break:break-all}
.go-graph-info{font-size:.72rem;color:#64748b;line-height:1.6}

/* Sections */
.go-section{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;margin-bottom:12px;overflow:hidden}
.go-section-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:14px 18px;background:none;border:none;color:#e2e8f0;font-size:1rem;font-weight:600;cursor:pointer;text-align:left;transition:background .15s}
.go-section-toggle:hover{background:rgba(100,116,139,.1)}
.go-info-circle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);color:#a5b4fc;font-size:.82rem;font-weight:700;flex-shrink:0}
.go-section-body{padding:0 20px 20px;color:#cbd5e1;font-size:.88rem;line-height:1.7}
.go-section-body h2{font-size:1.15rem;color:#f1f5f9;margin:0 0 8px}
.go-section-body h3{font-size:.95rem;color:#e0e7ff;margin:16px 0 6px}
.go-section-body ol,.go-section-body ul{padding-left:20px;margin:4px 0}
.go-section-body li{margin-bottom:3px}
.go-section-body code{background:rgba(99,102,241,.15);padding:1px 6px;border-radius:4px;font-size:.82rem;color:#a5b4fc}
.go-edge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.go-edge-card{background:rgba(15,23,42,.5);border:1px solid rgba(100,116,139,.3);border-radius:10px;padding:14px;cursor:pointer;transition:all .15s}
.go-edge-card:hover{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.08)}
.go-edge-card strong{display:block;color:#f1f5f9;font-size:.88rem;margin-bottom:4px}
.go-edge-card small{color:#64748b;font-size:.78rem}
.go-tips{padding-left:20px}
.go-tips li{margin-bottom:4px}

@media(max-width:1100px){.go-three-col{grid-template-columns:1fr}}
@media(max-width:640px){.go-edge-grid{grid-template-columns:1fr}.go-page{padding:12px}.go-op-pills{gap:4px}.go-pill{padding:5px 10px;font-size:.75rem}}
</style>
