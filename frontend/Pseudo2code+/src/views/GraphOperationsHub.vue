<template>
  <AuthNavbar />
  <main class="bs-page">
    <div class="bs-container">
      <!-- BACK BUTTON -->
      <div class="bs-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>

      <!-- TITLE -->
      <h1 class="bs-title">{{ currentOperation.algorithmName || currentOperation.label }}</h1>

      <!-- Algorithm selector pills -->
      <div class="bs-op-pills">
        <button v-for="(op, key) in graphOperations" :key="key" class="bs-pill"
          :class="{ active: selectedOp === key }" @click="selectOperation(key)">{{ op.label }}</button>
      </div>

      <!-- ═══════ THREE-COLUMN VISUALIZER ═══════ -->
      <div class="bs-three-col">
        <!-- LEFT PANEL: Controls -->
        <aside class="bs-controls-panel">
          <!-- Playback -->
          <div class="bs-btn-group">
            <button class="bs-btn" :class="{ active: playing }" @click="playing ? pause() : play()"
              :disabled="!isPlayable">
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
            <button class="bs-btn" @click="generateRandom">
              <span class="bs-icon"><Shuffle :size="14" /></span> Randomize
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

          <!-- Graph Type -->
          <div class="bs-custom-input">
            <label>Graph Type:</label>
            <div class="bs-type-row">
              <button class="bs-type-btn" :class="{ active: !isDirected }" @click="setDirected(false)">Undirected</button>
              <button class="bs-type-btn" :class="{ active: isDirected }" @click="setDirected(true)">Directed</button>
            </div>
            <label class="bs-check-label"><input type="checkbox" v-model="isWeighted" @change="rebuildGraph" /> Weighted</label>
          </div>

          <!-- Custom Graph -->
          <div class="bs-custom-input">
            <label>Edges (from-to pairs):</label>
            <div class="bs-input-row">
              <input v-model="customEdges" placeholder="A-B,B-C,A-C" class="bs-text-input"
                @keydown.enter="applyCustomGraph" />
              <button class="bs-btn bs-apply-btn" @click="applyCustomGraph">Go</button>
            </div>
          </div>

          <!-- CheckPath params -->
          <div v-if="selectedOp === 'checkPath'" class="bs-custom-input">
            <label>Start &amp; End Nodes:</label>
            <div class="bs-param-row">
              <select v-model="pathStart" class="bs-select">
                <option v-for="n in graphNodes" :key="n" :value="n">{{ n }}</option>
              </select>
              <span class="bs-param-arrow">→</span>
              <select v-model="pathEnd" class="bs-select">
                <option v-for="n in graphNodes" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>

          <!-- A* params -->
          <div v-if="selectedOp === 'astar'" class="bs-custom-input">
            <label>Start &amp; Goal Nodes:</label>
            <div class="bs-param-row">
              <select v-model="astarStart" class="bs-select">
                <option v-for="n in graphNodes" :key="n" :value="n">{{ n }}</option>
              </select>
              <span class="bs-param-arrow">→</span>
              <select v-model="astarGoal" class="bs-select">
                <option v-for="n in graphNodes" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>

          <!-- Generate Code Button -->
          <button class="bs-btn bs-code-btn" @click="goToGenerateCode">
            <span class="bs-icon">{ }</span> Generate Code
          </button>

          <!-- Quick info -->
          <div class="bs-info-block">
            <p><strong>Nodes:</strong> {{ graphNodes.length }}</p>
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
              <span class="bs-dot active"></span>
              <div><strong>Active</strong><br /><small>Currently processing</small></div>
            </div>
            <div class="bs-legend-item">
              <span class="bs-dot visited"></span>
              <div><strong>Visited</strong><br /><small>Already traversed</small></div>
            </div>
            <div class="bs-legend-item">
              <span class="bs-dot edge-hl"></span>
              <div><strong>Edge</strong><br /><small>Currently exploring</small></div>
            </div>
            <div class="bs-legend-item">
              <span class="bs-dot default-node"></span>
              <div><strong>Default</strong><br /><small>Unvisited node</small></div>
            </div>
            <div v-if="selectedOp === 'kruskal' || selectedOp === 'prim'" class="bs-legend-item">
              <span class="bs-dot mst-edge"></span>
              <div><strong>MST Edge</strong><br /><small>In minimum spanning tree</small></div>
            </div>

            <div class="bs-legend-note">
              <h5>How to read the visualization:</h5>
              <ul>
                <li>Circles represent graph nodes/vertices</li>
                <li>Lines represent edges between nodes</li>
                <li>Colors indicate current algorithm state</li>
                <li>Numbers on edges show weights (if weighted)</li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- CENTER: CHART -->
        <div class="bs-chart-area">
          <div class="bs-chart-wrapper">
            <!-- Graph SVG -->
            <div class="bs-graph-container">
              <svg class="bs-graph-svg" :viewBox="svgViewBox" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="arrowMarker" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(100,116,139,0.5)" />
                  </marker>
                  <marker id="arrowMarkerHighlight" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#818cf8" />
                  </marker>
                  <marker id="arrowMarkerMST" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                  </marker>
                </defs>
                <!-- Edges -->
                <g v-for="(edge, i) in renderedEdges" :key="'e'+i">
                  <line :x1="edge.x1" :y1="edge.y1" :x2="edge.x2" :y2="edge.y2"
                    class="bs-edge" :class="{ highlighted: edge.highlighted, mst: edge.mst }"
                    :marker-end="isDirected ? (edge.mst ? 'url(#arrowMarkerMST)' : edge.highlighted ? 'url(#arrowMarkerHighlight)' : 'url(#arrowMarker)') : ''" />
                  <text v-if="isWeighted && edge.weight" :x="(edge.x1+edge.x2)/2" :y="(edge.y1+edge.y2)/2 - 8"
                    text-anchor="middle" class="bs-weight-text">{{ edge.weight }}</text>
                </g>
                <!-- Nodes -->
                <g v-for="nd in renderedNodes" :key="'n'+nd.id">
                  <circle :cx="nd.x" :cy="nd.y" r="24" class="bs-node-circle" :class="graphNodeClass(nd)" />
                  <text :x="nd.x" :y="nd.y + 5" text-anchor="middle" class="bs-node-text" :class="graphNodeClass(nd)">{{ nd.label }}</text>
                </g>
              </svg>
            </div>

            <!-- Chart footer -->
            <div class="bs-chart-footer">
              <span>{{ currentOperation.label }} — {{ graphNodes.length }} nodes, {{ currentEdges.length }} edges</span>
              <span>{{ isDirected ? 'Directed' : 'Undirected' }}{{ isWeighted ? ', Weighted' : '' }}</span>
            </div>

            <!-- Scrubber -->
            <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1" v-model.number="stepIndex" />
          </div>

          <!-- Status bar -->
          <div class="bs-status-bar">{{ currentStep.explanation }}</div>

          <!-- Complexity badges -->
          <div class="bs-complexity-row">
            <span class="bs-complexity-badge">Time Complexity: <strong>{{ currentOperation.info.time }}</strong></span>
            <span class="bs-complexity-badge">Space Complexity: <strong>{{ currentOperation.info.space }}</strong></span>
          </div>
        </div>

        <!-- RIGHT PANEL: Inspector -->
        <aside class="bs-inspector">
          <div class="bs-inspector-header">
            <h3>Inspector</h3>
            <span class="bs-step-badge">Step {{ stepIndex + 1 }} of {{ steps.length }}</span>
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
            <span class="bs-op-dot" :class="currentStep.activeNode ? 'active' : 'default'"></span>
            {{ currentStep.explanation }}
          </div>

          <!-- Algorithm Metrics -->
          <h4 class="bs-inspector-label">ALGORITHM METRICS</h4>
          <div class="bs-metrics-grid">
            <div class="bs-metric">
              <span class="bs-metric-label">Visited</span>
              <span class="bs-metric-value">{{ metrics.visited }}</span>
            </div>
            <div class="bs-metric">
              <span class="bs-metric-label">Edges</span>
              <span class="bs-metric-value">{{ metrics.edgesExplored }}</span>
            </div>
            <div class="bs-metric">
              <span class="bs-metric-label">Step</span>
              <span class="bs-metric-value">{{ stepIndex + 1 }}</span>
            </div>
            <div class="bs-metric">
              <span class="bs-metric-label">Progress</span>
              <span class="bs-metric-value">{{ progressPercent }}%</span>
            </div>
          </div>

          <!-- Current Step -->
          <h4 class="bs-inspector-label">CURRENT STEP</h4>
          <div class="bs-step-detail">{{ currentStep.explanation }}</div>

          <!-- Queue / Stack State -->
          <template v-if="currentStep.queueState && currentStep.queueState.length > 0">
            <h4 class="bs-inspector-label">QUEUE STATE</h4>
            <div class="bs-array-state">[{{ currentStep.queueState.join(', ') }}]</div>
            <div class="bs-array-length">{{ currentStep.queueState.length }} items in queue</div>
          </template>
          <template v-if="currentStep.stackState && currentStep.stackState.length > 0">
            <h4 class="bs-inspector-label">STACK STATE</h4>
            <div class="bs-array-state">[{{ currentStep.stackState.join(', ') }}]</div>
            <div class="bs-array-length">{{ currentStep.stackState.length }} items in stack</div>
          </template>

          <!-- Dijkstra Distance Table -->
          <template v-if="currentStep.distances && !currentStep.gScore">
            <h4 class="bs-inspector-label">DISTANCE TABLE</h4>
            <div class="bs-table-wrap">
              <table class="bs-data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node, 'bs-col-visited': currentStep.visitedNodes?.includes(node) }">{{ node }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="bs-row-label">Dist</td>
                    <td v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node, 'bs-col-visited': currentStep.visitedNodes?.includes(node), 'bs-cell-updated': currentStep.highlightedEdges?.some(e => e.to === node) }">
                      {{ currentStep.distances[node] === Infinity ? '∞' : currentStep.distances[node] }}
                    </td>
                  </tr>
                  <tr>
                    <td class="bs-row-label">Prev</td>
                    <td v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node }">
                      {{ currentStep.previousNodes?.[node] || '—' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <!-- A* Score Table -->
          <template v-if="currentStep.gScore">
            <h4 class="bs-inspector-label">A* SCORE TABLE</h4>
            <div class="bs-table-wrap">
              <table class="bs-data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node }">{{ node }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="bs-row-label">g(n)</td>
                    <td v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node }">
                      {{ currentStep.gScore[node] === Infinity ? '∞' : currentStep.gScore[node] }}
                    </td>
                  </tr>
                  <tr>
                    <td class="bs-row-label">h(n)</td>
                    <td v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node }">
                      {{ currentStep.heuristic?.[node] || 0 }}
                    </td>
                  </tr>
                  <tr>
                    <td class="bs-row-label">f(n)</td>
                    <td v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node }">
                      {{ currentStep.fScore[node] === Infinity ? '∞' : currentStep.fScore[node]?.toFixed?.(1) ?? currentStep.fScore[node] }}
                    </td>
                  </tr>
                  <tr>
                    <td class="bs-row-label">Status</td>
                    <td v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node }">
                      <span v-if="currentStep.closedSet?.includes(node)" class="bs-badge closed">Closed</span>
                      <span v-else-if="currentStep.openSet?.includes(node)" class="bs-badge open">Open</span>
                      <span v-else>—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="currentStep.path" class="bs-path-display">
              <strong><Target :size="14" style="display:inline;vertical-align:middle;margin-right:4px" /> Path:</strong> {{ currentStep.path.join(' → ') }} | Cost: {{ currentStep.gScore[currentStep.path[currentStep.path.length - 1]] }}
            </div>
          </template>

          <!-- Prim's MST Key Table -->
          <template v-if="currentStep.key && !currentStep.gScore">
            <h4 class="bs-inspector-label">MST KEY TABLE</h4>
            <div class="bs-table-wrap">
              <table class="bs-data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node, 'bs-col-visited': currentStep.inMST?.includes(node) }">{{ node }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="bs-row-label">Key</td>
                    <td v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node, 'bs-col-visited': currentStep.inMST?.includes(node) }">
                      {{ currentStep.key[node] === Infinity ? '∞' : currentStep.key[node] }}
                    </td>
                  </tr>
                  <tr>
                    <td class="bs-row-label">Parent</td>
                    <td v-for="node in graphNodes" :key="node" :class="{ 'bs-col-active': currentStep.activeNode === node }">
                      {{ currentStep.parent?.[node] || '—' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="bs-row-label">MST</td>
                    <td v-for="node in graphNodes" :key="node">
                      <span v-if="currentStep.inMST?.includes(node)" class="bs-badge mst-in"><Check :size="12" /></span>
                      <span v-else>—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <!-- Kruskal's Edge Processing Table -->
          <template v-if="currentStep.sortedEdges && !currentStep.key && !currentStep.gScore">
            <h4 class="bs-inspector-label">EDGE PROCESSING</h4>
            <div class="bs-edge-list-wrap">
              <table class="bs-edge-list-table">
                <thead>
                  <tr><th>#</th><th>Edge</th><th>W</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr v-for="(edge, index) in currentStep.sortedEdges" :key="index"
                    :class="{
                      'bs-current-edge': index === currentStep.currentEdgeIndex,
                      'bs-processed-edge': index < currentStep.currentEdgeIndex,
                      'bs-accepted-edge': currentStep.mstEdges?.some(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from))
                    }">
                    <td>{{ index + 1 }}</td>
                    <td>{{ edge.from }}—{{ edge.to }}</td>
                    <td>{{ edge.weight }}</td>
                    <td>
                      <span v-if="index < currentStep.currentEdgeIndex && currentStep.mstEdges?.some(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from))" class="bs-badge accepted"><Check :size="12" /></span>
                      <span v-else-if="index < currentStep.currentEdgeIndex" class="bs-badge skipped"><X :size="12" /></span>
                      <span v-else-if="index === currentStep.currentEdgeIndex" class="bs-badge processing"><Zap :size="12" /></span>
                      <span v-else class="bs-badge pending"><Circle :size="8" /></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <!-- MST Summary (for Prim/Kruskal) -->
          <template v-if="currentStep.mstEdges && currentStep.mstEdges.length > 0">
            <div class="bs-path-display mst">
              <strong><TreePine :size="14" style="display:inline;vertical-align:middle;margin-right:4px" /> MST:</strong> {{ currentStep.mstEdges.map(e => `${e.from}—${e.to}(${e.weight})`).join(', ') }}
              <span class="bs-mst-cost">| Cost: {{ currentStep.mstCost }}</span>
            </div>
          </template>

          <!-- Graph State -->
          <h4 class="bs-inspector-label">GRAPH STATE</h4>
          <div class="bs-array-state">
            Visited: [{{ currentStep.visitedNodes && currentStep.visitedNodes.length > 0 ? currentStep.visitedNodes.join(', ') : '' }}]
          </div>
          <div class="bs-array-length">{{ graphNodes.length }} nodes, {{ currentEdges.length }} edges{{ isDirected ? ', Directed' : '' }}{{ isWeighted ? ', Weighted' : '' }}</div>
        </aside>
      </div>

      <!-- ═══════ HOW IT WORKS ═══════ -->
      <section class="bs-section">
        <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
          <span class="bs-info-circle"><Info :size="16" /></span>
          How {{ currentOperation.label }} Works
        </button>
        <div v-if="showHowItWorks" class="bs-section-body">
          <h2>Algorithm Overview</h2>
          <p>{{ currentOperation.info.description }}</p>

          <h3>How it works:</h3>
          <div class="bs-how-grid">
            <article v-for="card in howItWorksCards" :key="card.key" class="bs-how-card"
              :class="{ active: selectedOp === card.key }">
              <div class="bs-how-card-header">
                <div>
                  <p class="bs-how-card-label">{{ card.label }}</p>
                  <p class="bs-how-card-summary">{{ card.summary }}</p>
                </div>
                <div class="bs-how-card-meta">
                  <span class="bs-how-chip">Time: {{ card.time }}</span>
                  <span class="bs-how-chip subtle">Space: {{ card.space }}</span>
                </div>
              </div>
              <ol class="bs-how-steps">
                <li v-for="(step, idx) in card.steps" :key="idx">{{ step }}</li>
              </ol>
            </article>
          </div>

          <h3>Complexity Analysis:</h3>
          <ul>
            <li><strong>Time:</strong> {{ currentOperation.info.time }}</li>
            <li><strong>Space:</strong> {{ currentOperation.info.space }}</li>
          </ul>
        </div>
      </section>

      <!-- ═══════ EDGE CASES & EXAMPLES ═══════ -->
      <section class="bs-section">
        <button class="bs-section-toggle" @click="showEdgeCases = !showEdgeCases">
          <span class="bs-info-circle"><Info :size="16" /></span>
          Edge Cases &amp; Examples
        </button>
        <div v-if="showEdgeCases" class="bs-section-body">
          <h3>Test These Graph Patterns:</h3>
          <div class="bs-edge-grid">
            <div class="bs-edge-card" @click="loadPreset('triangle')">
              <strong>Triangle: A-B-C</strong>
              <small>Simple 3-node cycle</small>
            </div>
            <div class="bs-edge-card" @click="loadPreset('tree')">
              <strong>Tree: A-B, A-C, B-D, B-E</strong>
              <small>Tree-shaped graph (no cycles)</small>
            </div>
            <div class="bs-edge-card" @click="loadPreset('complex')">
              <strong>Complex: 6 nodes</strong>
              <small>Multiple paths and possible cycles</small>
            </div>
            <div class="bs-edge-card" @click="loadPreset('disconnected')">
              <strong>Disconnected</strong>
              <small>Two separate components</small>
            </div>
          </div>

          <h3>Performance Tips:</h3>
          <ul class="bs-tips">
            <li><strong>BFS</strong> explores neighbors first — good for shortest path in unweighted graphs</li>
            <li><strong>DFS</strong> goes deep first — good for pathfinding and topology</li>
            <li><strong>Dijkstra</strong> needs non-negative weights for correct results</li>
            <li><strong>A*</strong> combines Dijkstra with a heuristic for faster goal-directed search</li>
            <li><strong>Kruskal's</strong> sorts edges globally — great for sparse graphs</li>
            <li><strong>Prim's</strong> grows from a node — great for dense graphs</li>
            <li>Use <strong>custom edges</strong> input: e.g. <code>A-B,B-C,C-A</code> or <code>A-B-5,B-C-3</code> for weighted</li>
          </ul>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import arrowLeft from '@/assets/arrow-left.svg'
import { graphOperations } from '@/algorithms/graphOperations/graphOperationsMap'
import { Graph } from '@/algorithms/graphOperations/Graph'
import { Play, SkipForward, RotateCcw, Shuffle, Settings2, Info, ArrowRight, ArrowLeft, Target, TreePine, Zap, Check, X, Circle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// Determine initial algorithm from route param
const algoParamMap = { bfs: 'bfs', dfs: 'dfs', dijkstra: 'dijkstra', astar: 'astar', kruskal: 'kruskal', prim: 'prim', detectCycle: 'detectCycle', checkPath: 'checkPath' }
const initialAlgo = algoParamMap[route.params.algo] || 'bfs'

const selectedOp = ref(initialAlgo)
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)
const customEdges = ref('')
const playing = ref(false)
const isDirected = ref(false)
const isWeighted = ref(graphOperations[initialAlgo]?.requiresWeighted || false)
const pathStart = ref('')
const pathEnd = ref('')
const astarStart = ref('')
const astarGoal = ref('')

const graphOperationWriteups = {
  bfs: {
    summary: 'Breadth-first search explores all neighbors before moving deeper.',
    steps: [
      'Start with a queue containing the source node.',
      'Dequeue the next node and mark it visited.',
      'Enqueue every unvisited neighbor of that node.',
      'Repeat until the queue is empty, producing layer-by-layer traversal.'
    ]
  },
  dfs: {
    summary: 'Depth-first search dives down a path using a stack or recursion.',
    steps: [
      'Push the start node onto a stack.',
      'Pop a node, visit it if unseen, and mark it visited.',
      'Push its unvisited neighbors (reverse order for readability).',
      'Continue until the stack is empty to cover every reachable node.'
    ]
  },
  detectCycle: {
    summary: 'Detect cycles by tracking recursion stack or visited edges.',
    steps: [
      'Perform DFS from each unvisited node.',
      'Keep track of nodes currently in the recursion stack.',
      'If you encounter an active node again, a cycle exists.',
      'Report the cycle and stop, or finish traversal if none are found.'
    ]
  },
  checkPath: {
    summary: 'Determine whether any route connects two chosen nodes.',
    steps: [
      'Run BFS/DFS from the selected start node.',
      'Track visited nodes to avoid infinite loops.',
      'Stop early once the destination node is popped.',
      'If the traversal completes without finding the destination, no path exists.'
    ]
  },
  dijkstra: {
    summary: 'Dijkstra’s algorithm finds shortest paths on graphs with non-negative weights.',
    steps: [
      'Initialize all distances to ∞ except the source (0).',
      'Pick the unvisited node with the smallest distance (priority queue).',
      'Relax its outgoing edges, updating distances when a cheaper path is found.',
      'Mark the node visited and repeat until every node is processed.'
    ]
  },
  astar: {
    summary: 'A* guides Dijkstra with a heuristic to reach a goal faster.',
    steps: [
      'Maintain g(n) (cost so far) and h(n) (heuristic) for each node.',
      'Select the node with the lowest f(n) = g(n) + h(n) from the open set.',
      'Relax neighbors, updating g/f scores and parent pointers.',
      'When the goal is popped, reconstruct the optimal path and cost.'
    ]
  },
  kruskal: {
    summary: 'Kruskal builds an MST by adding the lightest edges that avoid cycles.',
    steps: [
      'Sort all edges by ascending weight.',
      'Initialize each node as its own disjoint-set component.',
      'Iterate through edges, unioning endpoints only if they are in different sets.',
      'Stop after adding V-1 edges; the accepted edges form the MST.'
    ]
  },
  prim: {
    summary: 'Prim grows an MST from one node by attaching the cheapest edge to new vertices.',
    steps: [
      'Pick an arbitrary start node and set its key to 0.',
      'Use a min-priority queue to choose the lowest-key node outside the MST.',
      'Add that node, then update keys for its adjacent vertices.',
      'Repeat until every node is included, recording chosen edges.'
    ]
  }
}

const howItWorksCards = computed(() => Object.entries(graphOperations).map(([key, op]) => {
  const writeup = graphOperationWriteups[key] || { summary: op.description, steps: [] }
  return {
    key,
    label: op.label,
    summary: writeup.summary,
    steps: writeup.steps,
    time: op.info.time,
    space: op.info.space
  }
}))

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
  if (selectedOp.value === 'astar') return astarStart.value && astarGoal.value
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
  } else if (selectedOp.value === 'astar') {
    params.startNode = astarStart.value || graphNodes.value[0]
    params.goalNode = astarGoal.value || graphNodes.value[graphNodes.value.length - 1]
  }
  return op.generateSteps(g, params)
}

// Initialize path params
watch(graphNodes, (ns) => {
  if (ns.length > 0) {
    if (!pathStart.value) pathStart.value = ns[0]
    if (!pathEnd.value) pathEnd.value = ns[ns.length - 1]
    if (!astarStart.value) astarStart.value = ns[0]
    if (!astarGoal.value) astarGoal.value = ns[ns.length - 1]
  }
}, { immediate: true })

const steps = ref(buildSteps())
const stepIndex = ref(0)
const emptyStep = { graph: [], edges: [], visitedNodes: [], activeNode: null, highlightedEdges: [], activePseudoLine: 0, explanation: 'No steps available' }
const currentStep = computed(() => steps.value[stepIndex.value] || emptyStep)
const progressPercent = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))

// ─── Algorithm Metrics (like BubbleSort's metrics) ─────
const metrics = computed(() => {
  const s = currentStep.value
  const visited = s.visitedNodes ? s.visitedNodes.length : 0
  const edgesExplored = s.highlightedEdges ? s.highlightedEdges.length : 0
  return { visited, edgesExplored }
})

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
    const isMST = s.mstEdges && s.mstEdges.some(me =>
      (me.from === e.from && me.to === e.to) || (me.from === e.to && me.to === e.from)
    )
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, from: e.from, to: e.to, weight: e.weight, highlighted: hl, mst: isMST }
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
  if (s.inMST && s.inMST.includes(nd.id)) return 'visited'
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
  for (let i = 0; i < count - 1; i++) {
    newEdges.push({ from: nodes[i], to: nodes[i + 1], weight: Math.floor(Math.random() * 9) + 1 })
  }
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

function selectOperation(key) {
  selectedOp.value = key
  const op = graphOperations[key]
  if (op.requiresWeighted && !isWeighted.value) {
    isWeighted.value = true
  }
  rebuildSteps()
}

watch(speedLevel, () => { if (playing.value) { pause(); play() } })
watch(() => pathStart.value + pathEnd.value, () => { if (selectedOp.value === 'checkPath') rebuildSteps() })
watch(() => astarStart.value + astarGoal.value, () => { if (selectedOp.value === 'astar') rebuildSteps() })

function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
/* ════════ PAGE ════════ */
.bs-page {
    min-height: 100vh;
    background: var(--bg-page);
    color: var(--text-secondary);
    padding: 16px 24px 40px;
    font-family: 'Inter', 'Segoe UI', sans-serif;
}
.bs-container {
    max-width: 1440px;
    margin: 0 auto;
}

/* ════════ BACK ════════ */
.bs-top-bar { flex-shrink: 0; }
.back-btn-compact {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent-lighter);
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
}
.back-btn-compact:hover {
    background: var(--accent-bg-hover);
    transform: translateX(-2px);
}
.arrow { width: 16px; height: 16px; }

.bs-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 16px;
}

/* ════════ ALGORITHM PILLS ════════ */
.bs-op-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
}
.bs-pill {
    padding: 7px 16px;
    border-radius: 20px;
    border: 1px solid var(--border-medium);
    background: rgba(100, 116, 139, 0.1);
    color: var(--text-tertiary);
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}
.bs-pill:hover {
    background: var(--accent-bg);
    border-color: var(--accent-border);
}
.bs-pill.active {
    background: rgba(99, 102, 241, 0.3);
    border-color: var(--accent-border);
    color: var(--accent-lighter);
    font-weight: 600;
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
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
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
    border: 1px solid var(--border-medium);
    background: var(--border-light);
    color: var(--text-tertiary);
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
}
.bs-btn:hover:not(:disabled) { background: var(--border-default); }
.bs-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.bs-btn.active { background: rgba(99, 102, 241, 0.3); border-color: var(--accent-border); }
.bs-icon { font-size: 0.9rem; }
.bs-settings-toggle { width: 100%; justify-content: center; }

.bs-settings-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    background: var(--bg-elevated);
    border-radius: 8px;
}
.bs-setting-row label { font-size: 0.78rem; color: var(--text-muted); }
.bs-slider { width: 100%; cursor: pointer; accent-color: var(--accent-light); }

/* Graph type toggle */
.bs-type-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
}
.bs-type-btn {
    padding: 6px 8px;
    border-radius: 8px;
    border: 1px solid var(--border-medium);
    background: rgba(100, 116, 139, 0.1);
    color: var(--text-tertiary);
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
}
.bs-type-btn.active {
    background: rgba(99, 102, 241, 0.3);
    border-color: var(--accent-border);
    color: var(--accent-lighter);
    font-weight: 600;
}
.bs-check-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    color: var(--text-muted);
    cursor: pointer;
}
.bs-check-label input { accent-color: var(--accent-light); }

/* Custom input */
.bs-custom-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.bs-custom-input label {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
}
.bs-input-row { display: flex; gap: 4px; }
.bs-text-input {
    flex: 1;
    background: var(--bg-input);
    border: 1px solid var(--border-medium);
    color: var(--accent-lighter);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    outline: none;
}
.bs-text-input:focus { border-color: var(--accent); }
.bs-text-input::placeholder { color: var(--text-faint); font-size: 0.72rem; }
.bs-apply-btn {
    padding: 6px 12px !important;
    background: var(--accent) !important;
    border: none !important;
    color: var(--text-primary) !important;
    font-weight: 600 !important;
}

/* Param row for A* / checkPath selects */
.bs-param-row {
    display: flex;
    align-items: center;
    gap: 6px;
}
.bs-param-arrow { color: var(--accent-light); font-weight: 700; font-size: 1rem; }
.bs-select {
    background: var(--bg-input);
    border: 1px solid var(--border-medium);
    color: var(--accent-lighter);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    outline: none;
    cursor: pointer;
    flex: 1;
}
.bs-select:focus { border-color: var(--accent); }

.bs-code-btn {
    width: 100%;
    justify-content: center;
    background: var(--accent-bg) !important;
    border-color: var(--accent-border) !important;
    color: var(--accent-lighter) !important;
}
.bs-code-btn:hover { background: rgba(99, 102, 241, 0.28) !important; }

/* Quick info */
.bs-info-block {
    font-size: 0.78rem;
    color: var(--text-muted);
    display: flex;
    justify-content: space-between;
}

/* Shortcuts */
.bs-shortcuts h4 {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin: 0 0 6px;
    font-weight: 600;
}
.bs-shortcut-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 8px;
    font-size: 0.75rem;
    color: var(--text-muted);
}
.bs-key {
    background: var(--border-default);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    color: var(--accent-lighter);
    font-size: 0.72rem;
    text-align: center;
}

/* Legend */
.bs-legend h4 { font-size: 0.82rem; color: var(--text-primary); margin: 0 0 8px; }
.bs-legend-item {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 8px;
    font-size: 0.78rem;
    color: var(--text-tertiary);
}
.bs-legend-item small { color: var(--text-dim); }
.bs-dot {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    flex-shrink: 0;
    margin-top: 2px;
}
.bs-dot.active { background: #22c55e; }
.bs-dot.visited { background: #38bdf8; }
.bs-dot.edge-hl { background: #818cf8; }
.bs-dot.default-node { background-color: var(--accent); }
.bs-dot.mst-edge { background: #22c55e; }

.bs-legend-note {
    margin-top: 8px;
    font-size: 0.72rem;
    color: var(--text-dim);
}
.bs-legend-note h5 {
    margin: 0 0 4px;
    font-weight: 600;
    color: var(--text-muted);
    font-size: 0.72rem;
}
.bs-legend-note ul { margin: 0; padding-left: 14px; }
.bs-legend-note li { margin-bottom: 2px; }

/* ════════ CHART AREA ════════ */
.bs-chart-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.bs-chart-wrapper {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 16px 16px 8px;
    display: flex;
    flex-direction: column;
}

/* Graph SVG */
.bs-graph-container {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 280px;
}
.bs-graph-svg { width: 100%; max-height: 450px; }
.bs-edge { stroke: var(--border-strong); stroke-width: 2; transition: all 0.3s; }
.bs-edge.highlighted { stroke: #818cf8; stroke-width: 3; }
.bs-edge.mst { stroke: #22c55e; stroke-width: 3; }
.bs-weight-text { fill: var(--text-muted); font-size: 11px; font-weight: 600; }
.bs-node-circle {
    fill: #6366f1;
    stroke: rgba(99, 102, 241, 0.6);
    stroke-width: 2;
    transition: all 0.3s ease;
}
.bs-node-circle.active {
    fill: #22c55e;
    stroke: #4ade80;
    filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.5));
}
.bs-node-circle.visited { fill: #38bdf8; stroke: #7dd3fc; }
.bs-node-text {
    fill: #fff;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Inter', 'Segoe UI', sans-serif;
}
.bs-node-text.active { fill: #fff; }
.bs-node-text.visited { fill: #fff; }

.bs-chart-footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    color: var(--text-dim);
    padding: 6px 0 4px;
}
.bs-scrubber {
    width: 100%;
    accent-color: var(--accent-light);
    cursor: pointer;
    margin-top: 4px;
}

/* Status bar */
.bs-status-bar {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 10px;
    padding: 12px 20px;
    text-align: center;
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.bs-complexity-row {
    display: flex;
    justify-content: center;
    gap: 32px;
}
.bs-complexity-badge { font-size: 0.82rem; color: var(--text-muted); }
.bs-complexity-badge strong { color: var(--accent-lighter); }

/* ════════ INSPECTOR ════════ */
.bs-inspector {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: 12px;
    padding: 14px;
    overflow-y: auto;
    max-height: calc(100vh - 180px);
}

.bs-inspector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}
.bs-inspector-header h3 { margin: 0; font-size: 1rem; color: var(--text-primary); }
.bs-step-badge {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid var(--accent-border);
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.72rem;
    color: var(--accent-lighter);
    font-weight: 600;
}
.bs-inspector-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-bottom: 4px;
}
.bs-progress-track {
    width: 100%;
    height: 6px;
    background: var(--border-light);
    border-radius: 3px;
    margin-bottom: 16px;
    overflow: hidden;
}
.bs-progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 3px;
    transition: width 0.25s;
}

.bs-inspector-label {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: var(--text-dim);
    margin: 14px 0 6px;
    font-weight: 700;
}

.bs-op-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    color: var(--text-tertiary);
    margin-bottom: 4px;
}
.bs-op-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}
.bs-op-dot.active { background: #22c55e; }
.bs-op-dot.default { background-color: var(--accent); }

.bs-metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}
.bs-metric { display: flex; flex-direction: column; }
.bs-metric-label { font-size: 0.7rem; color: var(--text-dim); }
.bs-metric-value {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-primary);
}

.bs-step-detail {
    background: var(--bg-elevated);
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    color: var(--text-tertiary);
    font-family: 'Fira Code', monospace;
}

.bs-array-state {
    background: var(--bg-elevated);
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 0.72rem;
    color: var(--text-tertiary);
    font-family: 'Fira Code', monospace;
    word-break: break-all;
    line-height: 1.5;
}
.bs-array-length {
    font-size: 0.7rem;
    color: var(--text-dim);
    margin-top: 4px;
}

/* ════════ DATA TABLES (Dijkstra, A*, Prim, Kruskal) ════════ */
.bs-table-wrap {
    overflow-x: auto;
    margin-bottom: 6px;
}
.bs-data-table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
}
.bs-data-table th,
.bs-data-table td {
    padding: 5px 8px;
    border: 1px solid var(--border-medium);
    color: var(--text-tertiary);
    font-size: 0.72rem;
    min-width: 36px;
}
.bs-data-table th {
    background: var(--accent-bg);
    color: var(--accent-lighter);
    font-weight: 600;
}
.bs-row-label {
    background: var(--bg-hover);
    color: var(--accent-lighter);
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
}
.bs-col-active { background: rgba(34, 197, 94, 0.15); color: var(--success-text); }
.bs-col-visited { background: var(--bg-hover); }
.bs-cell-updated { background: rgba(251, 191, 36, 0.2); color: #fde68a; font-weight: 700; }

/* Status badges */
.bs-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 8px;
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
}
.bs-badge.open { background: rgba(34, 197, 94, 0.2); color: var(--success-text); border: 1px solid rgba(34, 197, 94, 0.4); }
.bs-badge.closed { background: rgba(239, 68, 68, 0.2); color: var(--error-text); border: 1px solid rgba(239, 68, 68, 0.4); }
.bs-badge.mst-in { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.bs-badge.accepted { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.bs-badge.skipped { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.bs-badge.processing { background: rgba(59, 130, 246, 0.15); color: #3b82f6; animation: bs-pulse 2s ease-in-out infinite; }
.bs-badge.pending { background: var(--border-light); color: var(--text-dim); }
@keyframes bs-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

/* Path & MST display */
.bs-path-display {
    margin-top: 8px;
    padding: 8px;
    background: rgba(34, 197, 94, 0.1);
    border: 2px solid rgba(34, 197, 94, 0.3);
    border-radius: 8px;
    text-align: center;
    font-size: 0.78rem;
    color: var(--success-text);
    font-weight: 600;
}
.bs-path-display.mst { margin-top: 12px; }
.bs-mst-cost { margin-left: 8px; color: #fbbf24; font-weight: 700; }

/* Kruskal Edge List */
.bs-edge-list-wrap {
    overflow-x: auto;
    max-height: 180px;
    overflow-y: auto;
}
.bs-edge-list-table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(18, 18, 18, 0.4);
    border-radius: 8px;
    overflow: hidden;
}
.bs-edge-list-table thead { background: rgba(51, 65, 85, 0.6); }
.bs-edge-list-table th,
.bs-edge-list-table td {
    padding: 5px 8px;
    text-align: center;
    border-bottom: 1px solid rgba(71, 85, 105, 0.3);
    font-size: 0.72rem;
}
.bs-edge-list-table th { color: var(--text-muted); font-weight: 600; }
.bs-edge-list-table td { color: var(--text-tertiary); }
.bs-current-edge { background: rgba(59, 130, 246, 0.15); border-left: 3px solid #3b82f6; }
.bs-accepted-edge { background: rgba(34, 197, 94, 0.1); }
.bs-processed-edge { opacity: 0.6; }

/* Scrollbar styling */
.bs-inspector::-webkit-scrollbar,
.bs-edge-list-wrap::-webkit-scrollbar,
.bs-table-wrap::-webkit-scrollbar { width: 4px; height: 4px; }
.bs-inspector::-webkit-scrollbar-track,
.bs-edge-list-wrap::-webkit-scrollbar-track,
.bs-table-wrap::-webkit-scrollbar-track { background: transparent; }
.bs-inspector::-webkit-scrollbar-thumb,
.bs-edge-list-wrap::-webkit-scrollbar-thumb,
.bs-table-wrap::-webkit-scrollbar-thumb { background: var(--accent-bg-hover); border-radius: 4px; }
.bs-inspector::-webkit-scrollbar-thumb:hover,
.bs-edge-list-wrap::-webkit-scrollbar-thumb:hover,
.bs-table-wrap::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }

/* ════════ COLLAPSIBLE SECTIONS ════════ */
.bs-section {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
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
    color: var(--text-secondary);
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
    border: 1px solid var(--accent-border);
    color: var(--accent-lighter);
    font-size: 0.82rem;
    font-weight: 700;
    flex-shrink: 0;
}

.bs-section-body {
    padding: 0 20px 20px;
    color: var(--text-tertiary);
    font-size: 0.88rem;
    line-height: 1.7;
}
.bs-section-body h2 { font-size: 1.15rem; color: var(--text-primary); margin: 0 0 8px; }
.bs-section-body h3 { font-size: 0.95rem; color: var(--accent-lighter); margin: 16px 0 6px; }
.bs-section-body ol,
.bs-section-body ul { padding-left: 20px; margin: 4px 0; }
.bs-section-body li { margin-bottom: 3px; }
.bs-section-body code {
    background: var(--accent-bg);
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 0.82rem;
    color: var(--accent-lighter);
}

/* How it works cards */
.bs-how-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 12px;
}
.bs-how-card {
  background: rgba(10, 10, 10, 0.55);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 220px;
  transition: border 0.2s, transform 0.2s;
}
.bs-how-card.active {
  border-color: var(--accent-border);
  box-shadow: 0 10px 25px rgba(10, 10, 10, 0.6);
  transform: translateY(-4px);
}
.bs-how-card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.bs-how-card-label {
  margin: 0;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
}
.bs-how-card-summary {
  margin: 4px 0 0;
  color: var(--text-tertiary);
  font-size: 0.85rem;
}
.bs-how-card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}
.bs-how-chip {
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 0.7rem;
  color: var(--accent-lighter);
  font-weight: 600;
  text-transform: uppercase;
}
.bs-how-chip.subtle {
  background: rgba(148, 163, 184, 0.15);
  border-color: rgba(148, 163, 184, 0.4);
  color: var(--text-secondary);
}
.bs-how-steps {
  margin: 0;
  padding-left: 18px;
  color: var(--text-tertiary);
  font-size: 0.84rem;
  line-height: 1.5;
}
.bs-how-steps li { margin-bottom: 4px; }

/* Edge case cards */
.bs-edge-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 8px;
}
.bs-edge-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.15s;
}
.bs-edge-card:hover {
    border-color: var(--accent-border);
    background: var(--bg-hover);
}
.bs-edge-card strong {
    display: block;
    color: var(--text-primary);
    font-size: 0.88rem;
    margin-bottom: 4px;
}
.bs-edge-card small { color: var(--text-dim); font-size: 0.78rem; }
.bs-tips { padding-left: 20px; }
.bs-tips li { margin-bottom: 4px; }

/* ════════ RESPONSIVE ════════ */
@media (max-width: 1100px) {
    .bs-three-col { grid-template-columns: 1fr; gap: 16px; }
    .bs-chart-area { order: -1; }
    .bs-controls-panel { order: 1; max-height: none; }
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
    .bs-op-pills { gap: 4px; }
    .bs-pill { padding: 5px 10px; font-size: 0.75rem; }
  .bs-how-card { min-height: auto; }
  .bs-how-card-meta { align-items: flex-start; }
}
</style>
