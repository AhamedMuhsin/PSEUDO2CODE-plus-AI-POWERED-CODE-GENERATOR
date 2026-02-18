<template>
  <AuthNavbar />
  <main class="bt-page">
    <div class="bt-container">
      <div class="bt-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>
      <h1 class="bt-title">Binary Tree Operations</h1>
      <p class="bt-subtitle">Visualize binary tree operations step by step</p>

      <!-- Operation selector pills -->
      <div class="bt-op-pills">
        <button v-for="(op, key) in binaryTreeOperations" :key="key" class="bt-pill"
          :class="{ active: selectedOp === key }" @click="selectOperation(key)">{{ op.label }}</button>
      </div>

      <!-- ======= THREE-COLUMN LAYOUT ======= -->
      <div class="bt-three-col">
        <!-- LEFT: Controls -->
        <aside class="bt-controls-panel">
          <div class="bt-btn-group">
            <button class="bt-btn" :class="{ active: playing }" @click="playing ? pause() : play()"
              :disabled="!isPlayable"> {{ playing ? 'Pause' : 'Play' }}</button>
            <button class="bt-btn" @click="next" :disabled="stepIndex === steps.length - 1"><span
                class="bt-icon"></span> Step</button>
          </div>
          <div class="bt-btn-group">
            <button class="bt-btn" @click="reset"> Reset</button>
            <button class="bt-btn" @click="generateRandom"> Randomize</button>
          </div>

          <button class="bt-btn bt-settings-toggle" @click="showSettings = !showSettings"><span
              class="bt-icon"></span> Settings</button>
          <div v-if="showSettings" class="bt-settings-body">
            <div class="bt-setting-row"><label>Speed: <strong>{{ speedPercent }}%</strong></label><input type="range"
                min="1" max="5" v-model.number="speedLevel" class="bt-slider" /></div>
          </div>

          <!-- Custom Tree Values -->
          <div class="bt-custom-input"><label>Custom Tree (comma-sep):</label>
            <div class="bt-input-row"><input v-model="customInput" placeholder="e.g. 10,5,15,3,7" class="bt-text-input"
                @keydown.enter="applyCustomTree" /><button class="bt-btn bt-apply-btn"
                @click="applyCustomTree">Go</button></div>
          </div>

          <!-- Operation-specific params -->
          <div v-if="currentOperation.hasParams" class="bt-op-params">
            <label class="bt-param-label">Value:</label>
            <input v-model.number="opParams.value" type="number" placeholder="Enter value" class="bt-text-input" />
          </div>

          <button class="bt-btn bt-code-btn" @click="goToGenerateCode"> Generate
            Code</button>

          <div class="bt-shortcuts">
            <h4>Keyboard Shortcuts:</h4>
            <div class="bt-shortcut-grid"><span class="bt-key">Space</span><span>Play/Pause</span><span
                class="bt-key">-></span><span>Step Forward</span><span class="bt-key"><-</span><span>Step
                Back</span><span class="bt-key">R</span><span>Reset</span></div>
          </div>
          <div class="bt-legend">
            <h4>Legend</h4>
            <div class="bt-legend-item"><span class="bt-dot active"></span>
              <div><strong>Active</strong><br /><small>Currently processing</small></div>
            </div>
            <div class="bt-legend-item"><span class="bt-dot visited"></span>
              <div><strong>Visited</strong><br /><small>Already traversed</small></div>
            </div>
            <div class="bt-legend-item"><span class="bt-dot default"></span>
              <div><strong>Default</strong><br /><small>Unvisited node</small></div>
            </div>
          </div>
        </aside>

        <!-- CENTER: Tree Visualization -->
        <div class="bt-chart-area">
          <div class="bt-chart-wrapper">
            <div class="bt-tree-container">
              <template v-if="currentTreeArray.length === 0">
                <div class="bt-empty-msg">Tree is empty</div>
              </template>
              <template v-else>
                <svg class="bt-tree-svg" :viewBox="svgViewBox" preserveAspectRatio="xMidYMin meet">
                  <!-- Edges -->
                  <line v-for="(edge, i) in treeEdges" :key="'e'+i"
                    :x1="edge.x1" :y1="edge.y1" :x2="edge.x2" :y2="edge.y2"
                    class="bt-edge" :class="{ highlighted: isEdgeHighlighted(edge) }" />
                  <!-- Nodes -->
                  <g v-for="(nd, i) in treeNodes" :key="'n'+i">
                    <circle :cx="nd.x" :cy="nd.y" r="22" class="bt-node-circle"
                      :class="treeNodeClass(nd)" />
                    <text :x="nd.x" :y="nd.y + 5" text-anchor="middle" class="bt-node-text"
                      :class="treeNodeClass(nd)">{{ nd.value }}</text>
                  </g>
                </svg>
              </template>
            </div>
            <div class="bt-chart-footer"><span>{{ currentOperation.label }}  -  {{ currentTreeArray.length }} node(s)</span></div>
            <input type="range" class="bt-scrubber" min="0" :max="steps.length - 1" v-model.number="stepIndex" />
          </div>
          <div class="bt-status-bar">{{ currentStep.explanation }}</div>
          <div class="bt-complexity-row">
            <span class="bt-complexity-badge">Time: <strong>{{ currentOperation.info.time }}</strong></span>
            <span class="bt-complexity-badge">Space: <strong>{{ currentOperation.info.space }}</strong></span>
          </div>
          <!-- Traversal result display -->
          <div v-if="currentStep.traversalOrder && currentStep.traversalOrder.length > 0" class="bt-traversal-result">
            <strong>Result:</strong> [{{ currentStep.traversalOrder.join(' -> ') }}]
          </div>
          <div v-if="currentStep.result !== undefined && typeof currentStep.result !== 'object' && !Array.isArray(currentStep.result)" class="bt-traversal-result">
            <strong>Result:</strong> {{ currentStep.result }}
          </div>
        </div>

        <!-- RIGHT: Inspector -->
        <aside class="bt-inspector">
          <div class="bt-inspector-header">
            <h3>Inspector</h3><span class="bt-step-badge">Step {{ stepIndex + 1 }} of {{ steps.length }}</span>
          </div>
          <div class="bt-inspector-row"><span>Progress</span><span>{{ progressPercent }}%</span></div>
          <div class="bt-progress-track">
            <div class="bt-progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <h4 class="bt-inspector-label">CURRENT OPERATION</h4>
          <div class="bt-op-item"><span class="bt-op-dot active"></span>{{ currentStep.explanation }}</div>

          <h4 class="bt-inspector-label">OPERATION INFO</h4>
          <div class="bt-metrics-grid">
            <div class="bt-metric"><span class="bt-metric-label">Operation</span><span class="bt-metric-value">{{ currentOperation.label }}</span></div>
            <div class="bt-metric"><span class="bt-metric-label">Best</span><span class="bt-metric-value">{{ currentOperation.info.best }}</span></div>
            <div class="bt-metric"><span class="bt-metric-label">Average</span><span class="bt-metric-value">{{ currentOperation.info.average }}</span></div>
            <div class="bt-metric"><span class="bt-metric-label">Worst</span><span class="bt-metric-value">{{ currentOperation.info.worst }}</span></div>
          </div>

          <h4 class="bt-inspector-label">CURRENT STEP</h4>
          <div class="bt-step-detail">{{ currentStep.explanation }}</div>

          <h4 class="bt-inspector-label">TREE STATE</h4>
          <div class="bt-tree-state">Nodes: [{{ currentTreeArray.map(n => n.value).join(', ') }}]</div>
          <div class="bt-tree-info">{{ currentTreeArray.length }} node(s)</div>
          <div v-if="currentStep.activeNode !== null && currentStep.activeNode !== undefined" class="bt-active-ptr">Active node: index {{ currentStep.activeNode }}</div>
        </aside>
      </div>

      <!-- How It Works -->
      <section class="bt-section">
        <button class="bt-section-toggle" @click="showHowItWorks = !showHowItWorks"><span
            class="bt-info-circle">i</span> How {{ currentOperation.label }} Works</button>
        <div v-if="showHowItWorks" class="bt-section-body">
          <p class="bt-section-intro">Tree algorithms mix traversal patterns with structural edits. These cards summarize the play-by-play for each operation plus the associated complexity.</p>
          <div class="bt-how-grid">
            <article v-for="card in howItWorksCards" :key="card.key" class="bt-how-card" :class="{ active: selectedOp === card.key }">
              <header class="bt-how-header">
                <div>
                  <h3>{{ card.label }}</h3>
                  <p>{{ card.summary }}</p>
                </div>
                <span class="bt-chip" v-if="card.key === selectedOp">Active</span>
              </header>
              <ol class="bt-step-list">
                <li v-for="(step, idx) in card.steps" :key="idx">{{ step }}</li>
              </ol>
              <div class="bt-how-meta">
                <span>Best: <strong>{{ card.best }}</strong></span>
                <span>Avg: <strong>{{ card.average }}</strong></span>
                <span>Worst: <strong>{{ card.worst }}</strong></span>
                <span>Space: <strong>{{ card.space }}</strong></span>
              </div>
            </article>
          </div>
          <h3>Binary Tree Properties:</h3>
          <ul>
            <li>Each node has at most <strong>two children</strong> (left and right)</li>
            <li><strong>Root</strong> is the topmost node of the tree</li>
            <li><strong>Leaf nodes</strong> have no children</li>
            <li><strong>Height</strong> is the longest path from root to any leaf</li>
            <li>Level-order insertion fills the tree <strong>left to right</strong> at each level</li>
          </ul>
        </div>
      </section>

      <!-- Edge Cases -->
      <section class="bt-section">
        <button class="bt-section-toggle" @click="showEdgeCases = !showEdgeCases"><span
            class="bt-info-circle">i</span> Edge Cases &amp; Examples</button>
        <div v-if="showEdgeCases" class="bt-section-body">
          <h3>Try These:</h3>
          <div class="bt-edge-grid">
            <div class="bt-edge-card" @click="loadEdgeCase([10, 5, 15, 3, 7, 12, 20])"><strong>Balanced: 10,5,15,3,7,12,20</strong><small>Complete binary tree</small></div>
            <div class="bt-edge-card" @click="loadEdgeCase([1, 2, 3])"><strong>Small: 1,2,3</strong><small>Three-node tree</small></div>
            <div class="bt-edge-card" @click="loadEdgeCase([42])"><strong>Single: 42</strong><small>Tree with one node</small></div>
            <div class="bt-edge-card" @click="loadEdgeCase([])"><strong>Empty</strong><small>Empty tree  -  test edge cases</small></div>
          </div>
          <h3>Tips:</h3>
          <ul class="bt-tips">
            <li><strong>Inorder</strong> traversal visits Left -> Node -> Right</li>
            <li><strong>Preorder</strong> traversal visits Node -> Left -> Right</li>
            <li><strong>Postorder</strong> traversal visits Left -> Right -> Node</li>
            <li><strong>Level Order</strong> visits nodes level by level (BFS)</li>
            <li>Use <strong>Insert</strong> to add nodes and watch the tree grow</li>
            <li>Use <strong>Search</strong> to trace the BFS path to a value</li>
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
import { binaryTreeOperations } from '@/algorithms/binaryTreeOperations/binaryTreeOperationsMap'
import { BinaryTree } from '@/algorithms/binaryTreeOperations/BinaryTree'

const router = useRouter()
const selectedOp = ref('inorder')
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)
const customInput = ref('')
const playing = ref(false)

const baseValues = ref([10, 5, 15, 3, 7, 12, 20])
const opParams = reactive({ value: 8 })

const binaryTreeWriteups = {
  insert: {
    summary: 'Add a new node using level-order placement so the tree stays balanced.',
    steps: [
      'Traverse level by level until a node with an empty child is found.',
      'Create a node containing the requested value.',
      'Attach it as the first available left or right child.',
      'Recompute traversal arrays so the visualization reflects the change.'
    ]
  },
  search: {
    summary: 'Walk the tree breadth-first until the value is located.',
    steps: [
      'Start from the root and place it in a queue.',
      'Dequeue nodes one at a time and compare their value to the goal.',
      'Enqueue children to continue exploring.',
      'Highlight the path once the value is found or report failure after exhaustion.'
    ]
  },
  delete: {
    summary: 'Remove a node by swapping it with the deepest rightmost node.',
    steps: [
      'Locate both the target node and the deepest rightmost node.',
      'Copy the deepest value into the target node.',
      'Delete the deepest node to maintain completeness.',
      'Update parents/children references and traversal arrays.'
    ]
  },
  inorder: {
    summary: 'Visit nodes in Left -> Node -> Right order.',
    steps: [
      'Recursively traverse the left subtree.',
      'Record the current node.',
      'Traverse the right subtree.',
      'Aggregate the visit order for sorted output in BSTs.'
    ]
  },
  preorder: {
    summary: 'Visit Node -> Left -> Right to capture root-first structure.',
    steps: [
      'Process the current node.',
      'Traverse the left subtree.',
      'Traverse the right subtree.',
      'Use the order to rebuild the tree or serialize it.'
    ]
  },
  postorder: {
    summary: 'Visit Left -> Right -> Node for cleanup-style traversals.',
    steps: [
      'Traverse left subtree to completion.',
      'Traverse right subtree.',
      'Process the node after its children.',
      'Great for freeing nodes or evaluating expression trees.'
    ]
  },
  levelorder: {
    summary: 'Breadth-first traversal visiting nodes level by level.',
    steps: [
      'Push the root into a queue.',
      'Pop a node, visit it, then enqueue its children.',
      'Repeat until the queue is empty.',
      'Collect nodes grouped by depth for layered rendering.'
    ]
  },
  height: {
    summary: 'Compute the longest path from root to any leaf.',
    steps: [
      'Recursively compute height of left and right subtrees.',
      'Take the max of the two heights.',
      'Add one for the current node.',
      'Return 0 for NULL to anchor the recursion.'
    ]
  },
  countNodes: {
    summary: 'Count how many nodes are present in total.',
    steps: [
      'Traverse every node (DFS/BFS).',
      'Increment a counter for each visited node.',
      'Propagate counts upward through recursion.',
      'Display the final tally in the inspector.'
    ]
  },
  countLeaves: {
    summary: 'Count nodes with no children.',
    steps: [
      'Traverse the tree and inspect each node.',
      'If both children are null, increment the leaf count.',
      'Aggregate counts from subtrees.',
      'Report how many leaves exist to gauge tree shape.'
    ]
  }
}

const howItWorksCards = computed(() => Object.entries(binaryTreeOperations).map(([key, op]) => {
  const writeup = binaryTreeWriteups[key] || { summary: op.description, steps: [] }
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

const currentOperation = computed(() => binaryTreeOperations[selectedOp.value])

const isPlayable = computed(() => {
  if (currentOperation.value.hasParams) return opParams.value !== null && opParams.value !== ''
  return true
})

function createTree(values) {
  const tree = new BinaryTree()
  values.forEach(v => tree.insert(v))
  return tree
}

function buildSteps() {
  const tree = createTree(baseValues.value)
  const op = currentOperation.value
  if (op.hasParams) {
    const res = op.generator(tree, { value: Number(opParams.value) || 0 })
    return res.steps || res
  }
  const res = op.generator(tree)
  return res.steps || res
}

const steps = ref(buildSteps())
const stepIndex = ref(0)
const emptyStep = { treeArray: [], activeNode: null, highlightNodes: [], activePseudoLine: 0, explanation: 'No steps available' }
const currentStep = computed(() => steps.value[stepIndex.value] || emptyStep)
const currentTreeArray = computed(() => currentStep.value.treeArray || [])
const progressPercent = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))

// Tree layout computation for SVG rendering
const NODE_RADIUS = 22
const H_SPACING = 50
const V_SPACING = 70

const treeNodes = computed(() => {
  const arr = currentTreeArray.value
  if (arr.length === 0) return []

  // Build adjacency from treeArray
  const nodes = []
  const positions = new Map()

  // Compute positions using a recursive layout
  function computeLayout(index, depth, left, right) {
    if (index >= arr.length || !arr[index]) return
    const node = arr.find(n => n.index === index)
    if (!node) return

    const x = (left + right) / 2
    const y = depth * V_SPACING + 40
    positions.set(index, { x, y })
    nodes.push({ x, y, value: node.value, index: node.index })

    // Find children
    const leftChild = arr.find(n => n.parentIndex === index && n.isLeft === true)
    const rightChild = arr.find(n => n.parentIndex === index && n.isLeft === false)

    if (leftChild) computeLayout(leftChild.index, depth + 1, left, x - 10)
    if (rightChild) computeLayout(rightChild.index, depth + 1, x + 10, right)
  }

  const rootNode = arr.find(n => n.parentIndex === -1)
  if (rootNode) {
    const width = Math.max(arr.length * H_SPACING, 300)
    computeLayout(rootNode.index, 0, 0, width)
  }

  return nodes
})

const treeEdges = computed(() => {
  const arr = currentTreeArray.value
  if (arr.length === 0) return []

  const edges = []
  const posMap = new Map()
  treeNodes.value.forEach(n => posMap.set(n.index, { x: n.x, y: n.y }))

  arr.forEach(node => {
    if (node.parentIndex >= 0) {
      const parent = posMap.get(node.parentIndex)
      const child = posMap.get(node.index)
      if (parent && child) {
        edges.push({ x1: parent.x, y1: parent.y, x2: child.x, y2: child.y, parentIdx: node.parentIndex, childIdx: node.index })
      }
    }
  })

  return edges
})

const svgViewBox = computed(() => {
  if (treeNodes.value.length === 0) return '0 0 300 200'
  const xs = treeNodes.value.map(n => n.x)
  const ys = treeNodes.value.map(n => n.y)
  const minX = Math.min(...xs) - 40
  const maxX = Math.max(...xs) + 40
  const minY = Math.min(...ys) - 30
  const maxY = Math.max(...ys) + 40
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`
})

function treeNodeClass(nd) {
  const s = currentStep.value
  if (nd.index === s.activeNode) return 'active'
  if (s.highlightNodes && s.highlightNodes.includes(nd.index)) return 'visited'
  // For value-based highlights (traversal orders store values)
  if (s.highlightNodes && s.highlightNodes.includes(nd.value)) return 'visited'
  return ''
}

function isEdgeHighlighted(edge) {
  const s = currentStep.value
  if (!s.highlightNodes) return false
  const parentHighlighted = s.highlightNodes.includes(edge.parentIdx) || s.highlightNodes.includes(treeNodes.value.find(n => n.index === edge.parentIdx)?.value)
  const childHighlighted = s.highlightNodes.includes(edge.childIdx) || s.highlightNodes.includes(treeNodes.value.find(n => n.index === edge.childIdx)?.value)
  return parentHighlighted && childHighlighted
}

let timer = null
function play() { if (playing.value) { pause(); return } playing.value = true; timer = setInterval(() => { if (stepIndex.value < steps.value.length - 1) stepIndex.value++; else pause() }, speedDelay.value) }
function pause() { playing.value = false; clearInterval(timer) }
function next() { pause(); if (stepIndex.value < steps.value.length - 1) stepIndex.value++ }
function prev() { pause(); if (stepIndex.value > 0) stepIndex.value-- }
function rebuildSteps() { pause(); steps.value = buildSteps(); stepIndex.value = 0 }
function reset() { rebuildSteps() }
function generateRandom() {
  const count = Math.floor(Math.random() * 5) + 4
  const vals = Array.from({ length: count }, () => Math.floor(Math.random() * 30) + 1)
  // Deduplicate
  baseValues.value = [...new Set(vals)]
  rebuildSteps()
}
function applyCustomTree() { const arr = customInput.value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n)); baseValues.value = arr; rebuildSteps() }
function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: `Write a program for the Binary Tree ${currentOperation.value.algorithmName} operation.\nBuild a binary tree from values: [${baseValues.value.join(', ')}].` } }) }
function loadEdgeCase(arr) { baseValues.value = [...arr]; rebuildSteps() }
function selectOperation(key) { selectedOp.value = key; rebuildSteps() }

watch(() => ({ ...opParams }), () => rebuildSteps(), { deep: true })
watch(speedLevel, () => { if (playing.value) { pause(); play() } })

function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.bt-page{min-height:100vh;background:radial-gradient(ellipse at top,#0f172a 0%,#020617 70%);color:#e2e8f0;padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}
.bt-container{max-width:1440px;margin:0 auto}
.bt-top-bar{flex-shrink:0}
.back-btn-compact{display:flex;align-items:center;gap:6px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#e0e7ff;padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}
.back-btn-compact:hover{background:rgba(99,102,241,.25);transform:translateX(-2px)}
.arrow{width:16px;height:16px}
.bt-title{font-size:1.6rem;font-weight:700;color:#f1f5f9;margin:0 0 4px}
.bt-subtitle{color:#94a3b8;font-size:.9rem;margin:0 0 16px}

/* Operation pills */
.bt-op-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.bt-pill{padding:7px 16px;border-radius:20px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.1);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.bt-pill:hover{background:rgba(99,102,241,.15);border-color:rgba(99,102,241,.35)}
.bt-pill.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.6);color:#e0e7ff;font-weight:600}

/* Three-column grid */
.bt-three-col{display:grid;grid-template-columns:260px 1fr 280px;gap:16px;margin-bottom:24px}
.bt-controls-panel{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.bt-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.bt-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.12);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}
.bt-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}
.bt-btn:disabled{opacity:.4;cursor:not-allowed}
.bt-btn.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.5)}
.bt-icon{font-size:.9rem}
.bt-settings-toggle{width:100%;justify-content:center}
.bt-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:rgba(15,23,42,.5);border-radius:8px}
.bt-setting-row label{font-size:.78rem;color:#94a3b8}
.bt-slider{width:100%;cursor:pointer;accent-color:#818cf8}
.bt-custom-input{display:flex;flex-direction:column;gap:4px}
.bt-custom-input label{font-size:.75rem;color:#94a3b8;font-weight:600}
.bt-input-row{display:flex;gap:4px}
.bt-text-input{flex:1;background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.35);color:#e0e7ff;padding:6px 10px;border-radius:6px;font-size:.8rem;outline:none;width:100%}
.bt-text-input:focus{border-color:#6366f1}
.bt-text-input::placeholder{color:#475569;font-size:.72rem}
.bt-apply-btn{padding:6px 12px!important;background:linear-gradient(135deg,#6366f1,#8b5cf6)!important;border:none!important;color:#fff!important;font-weight:600!important}
.bt-op-params{display:flex;flex-direction:column;gap:6px}
.bt-param-label{font-size:.75rem;color:#94a3b8;font-weight:600}
.bt-code-btn{width:100%;justify-content:center;background:rgba(99,102,241,.15)!important;border-color:rgba(99,102,241,.35)!important;color:#a5b4fc!important}
.bt-code-btn:hover{background:rgba(99,102,241,.28)!important}
.bt-shortcuts h4{font-size:.78rem;color:#94a3b8;margin:0 0 6px;font-weight:600}
.bt-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:#94a3b8}
.bt-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:#e0e7ff;font-size:.72rem;text-align:center}
.bt-legend h4{font-size:.82rem;color:#f1f5f9;margin:0 0 8px}
.bt-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:#cbd5e1}
.bt-legend-item small{color:#64748b}
.bt-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}
.bt-dot.active{background:#22c55e}
.bt-dot.visited{background:#38bdf8}
.bt-dot.default{background:#6366f1}

/* Center chart area */
.bt-chart-area{display:flex;flex-direction:column;gap:10px}
.bt-chart-wrapper{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:24px 16px 8px;display:flex;flex-direction:column;align-items:center;min-height:280px}
.bt-tree-container{width:100%;flex:1;display:flex;align-items:center;justify-content:center;min-height:220px;overflow-x:auto}
.bt-empty-msg{color:#64748b;font-size:.9rem;padding:40px 0;font-style:italic}
.bt-tree-svg{width:100%;max-height:400px}
.bt-edge{stroke:rgba(100,116,139,.4);stroke-width:2}
.bt-edge.highlighted{stroke:#818cf8;stroke-width:2.5}
.bt-node-circle{fill:#6366f1;stroke:rgba(99,102,241,.6);stroke-width:2;transition:all .3s ease}
.bt-node-circle.active{fill:#22c55e;stroke:#4ade80;filter:drop-shadow(0 0 8px rgba(34,197,94,.5))}
.bt-node-circle.visited{fill:#38bdf8;stroke:#7dd3fc}
.bt-node-text{fill:#fff;font-size:13px;font-weight:700;font-family:'Inter','Segoe UI',sans-serif}
.bt-node-text.active{fill:#fff}
.bt-node-text.visited{fill:#fff}
.bt-chart-footer{font-size:.72rem;color:#64748b;padding:6px 0 4px;text-align:center;width:100%}
.bt-scrubber{width:100%;accent-color:#818cf8;cursor:pointer;margin-top:4px}
.bt-status-bar{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:#e2e8f0;font-weight:500}
.bt-complexity-row{display:flex;justify-content:center;gap:32px}
.bt-complexity-badge{font-size:.82rem;color:#94a3b8}
.bt-complexity-badge strong{color:#e0e7ff}
.bt-traversal-result{background:rgba(30,41,59,.65);border:1px solid rgba(99,102,241,.3);border-radius:10px;padding:10px 20px;text-align:center;font-size:.85rem;color:#a5b4fc;font-family:'Fira Code',monospace}

/* Inspector */
.bt-inspector{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px}
.bt-inspector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.bt-inspector-header h3{margin:0;font-size:1rem;color:#f1f5f9}
.bt-step-badge{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);padding:3px 10px;border-radius:12px;font-size:.72rem;color:#a5b4fc;font-weight:600}
.bt-inspector-row{display:flex;justify-content:space-between;font-size:.78rem;color:#94a3b8;margin-bottom:4px}
.bt-progress-track{width:100%;height:6px;background:rgba(100,116,139,.2);border-radius:3px;margin-bottom:16px;overflow:hidden}
.bt-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#818cf8);border-radius:3px;transition:width .25s}
.bt-inspector-label{font-size:.7rem;letter-spacing:.06em;color:#64748b;margin:14px 0 6px;font-weight:700}
.bt-op-item{display:flex;align-items:center;gap:8px;font-size:.78rem;color:#cbd5e1;margin-bottom:4px}
.bt-op-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.bt-op-dot.active{background:#22c55e}
.bt-metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.bt-metric{display:flex;flex-direction:column}
.bt-metric-label{font-size:.7rem;color:#64748b}
.bt-metric-value{font-size:1rem;font-weight:700;color:#f1f5f9}
.bt-step-detail{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.78rem;color:#cbd5e1;font-family:'Fira Code',monospace}
.bt-tree-state{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.72rem;color:#cbd5e1;font-family:'Fira Code',monospace;word-break:break-all;line-height:1.5}
.bt-tree-info{font-size:.7rem;color:#64748b;margin-top:4px}
.bt-active-ptr{font-size:.7rem;color:#22c55e;margin-top:2px}

/* Sections */
.bt-section{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;margin-bottom:12px;overflow:hidden}
.bt-section-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:14px 18px;background:none;border:none;color:#e2e8f0;font-size:1rem;font-weight:600;cursor:pointer;text-align:left;transition:background .15s}
.bt-section-toggle:hover{background:rgba(100,116,139,.1)}
.bt-info-circle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);color:#a5b4fc;font-size:.82rem;font-weight:700;flex-shrink:0}
.bt-section-body{padding:0 20px 20px;color:#cbd5e1;font-size:.88rem;line-height:1.7}
.bt-section-body h2{font-size:1.15rem;color:#f1f5f9;margin:0 0 8px}
.bt-section-body h3{font-size:.95rem;color:#e0e7ff;margin:16px 0 6px}
.bt-section-body ol,.bt-section-body ul{padding-left:20px;margin:4px 0}
.bt-section-body li{margin-bottom:3px}
.bt-section-intro{color:#94a3b8;margin:0 0 16px;font-size:.9rem}
.bt-how-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:12px}
.bt-how-card{background:rgba(15,23,42,.6);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px;min-height:220px;transition:border .2s,transform .2s}
.bt-how-card.active{border-color:rgba(99,102,241,.6);transform:translateY(-4px);box-shadow:0 8px 24px rgba(99,102,241,.2)}
.bt-how-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.bt-how-header h3{margin:0;color:#f8fafc;font-size:1rem}
.bt-how-header p{margin:4px 0 0;color:#cbd5e1;font-size:.85rem}
.bt-chip{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.5);border-radius:999px;padding:3px 10px;font-size:.7rem;color:#c7d2fe;font-weight:600}
.bt-step-list{margin:0;padding-left:18px;color:#cbd5e1;font-size:.84rem;line-height:1.5}
.bt-how-meta{display:flex;flex-wrap:wrap;gap:8px;font-size:.75rem;color:#94a3b8}
.bt-how-meta strong{color:#f1f5f9}
.bt-edge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.bt-edge-card{background:rgba(15,23,42,.5);border:1px solid rgba(100,116,139,.3);border-radius:10px;padding:14px;cursor:pointer;transition:all .15s}
.bt-edge-card:hover{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.08)}
.bt-edge-card strong{display:block;color:#f1f5f9;font-size:.88rem;margin-bottom:4px}
.bt-edge-card small{color:#64748b;font-size:.78rem}
.bt-tips{padding-left:20px}
.bt-tips li{margin-bottom:4px}

@media(max-width:1100px){.bt-three-col{grid-template-columns:1fr;gap:16px}.bt-chart-area{order:-1}.bt-controls-panel{order:1}.bt-inspector{order:2;max-height:none}}
@media(max-width:768px){.bt-shortcuts{display:none}.bt-legend{display:none}.bt-controls-panel{padding:10px}}
@media(max-width:640px){.bt-edge-grid{grid-template-columns:1fr}.bt-page{padding:10px 12px 24px}.bt-op-pills{gap:4px}.bt-pill{padding:5px 10px;font-size:.75rem}.bt-how-card{min-height:auto}}
</style>
