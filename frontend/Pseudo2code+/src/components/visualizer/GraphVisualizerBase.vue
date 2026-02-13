<template>
    <main class="visualizer-page">
        <div class="container">
            <!-- BACK -->
            <div class="top-section">
                <button class="back-btn" @click="router.push('/algorithm-hub')">
                    <img :src="arrowLeft" class="arrow" />
                    Back
                </button>
            </div>
            <!-- HEADER -->
            <section class="operation-details">
                <div class="operation-header">
                    <header class="page-header">
                        <div class="operation-title-group">
                            <h1>{{ title }}</h1>
                            <button v-if="meta" class="info-btn" @click="showInfo = true">ⓘ</button>
                        </div>
                        <p class="operation-desc">{{ description }}</p>
                        <div v-if="meta" class="algo-badges">
                            <span class="badge">Best: {{ meta.best }}</span>
                            <span class="badge">Avg: {{ meta.average }}</span>
                            <span class="badge">Worst: {{ meta.worst }}</span>
                            <span class="badge">Space: {{ meta.space }}</span>
                        </div>
                    </header>

                    <!-- GRAPH INPUT -->
                    <section class="graph-input">
                        <div class="input-row">
                            <button class="btn ghost" @click="generateRandomGraph">
                                Random Graph
                            </button>
                            <button class="btn ghost" @click="showGraphBuilder = !showGraphBuilder">
                                {{ showGraphBuilder ? 'Hide' : 'Build Graph' }}
                            </button>
                            <button class="btn ghost" @click="goToGenerateCode">
                                Generate Code
                            </button>
                        </div>

                        <!-- Graph Builder -->
                        <div v-if="showGraphBuilder" class="graph-builder">
                            <!-- Graph type toggles -->
                            <div class="builder-toggles">
                                <label class="toggle-label">
                                    <input type="checkbox" v-model="isDirected" @change="rebuildGraph" />
                                    Directed
                                </label>
                                <label class="toggle-label">
                                    <input type="checkbox" v-model="isWeighted" @change="rebuildGraph" />
                                    Weighted
                                </label>
                            </div>

                            <!-- Add Node -->
                            <div class="builder-section">
                                <h4>Add Node</h4>
                                <input v-model="newNode" placeholder="Node name (e.g., A)" @keydown.enter="addNode" />
                                <button class="btn-small primary" @click="addNode">Add</button>
                            </div>

                            <!-- Current Nodes -->
                            <div v-if="graph.nodes.length" class="builder-items">
                                <h4>Nodes</h4>
                                <div class="item-chips">
                                    <span v-for="node in graph.nodes" :key="node" class="chip">
                                        {{ node }}
                                        <button class="chip-remove" @click="removeNode(node)">&times;</button>
                                    </span>
                                </div>
                            </div>

                            <!-- Add Edge -->
                            <div class="builder-section">
                                <h4>Add Edge</h4>
                                <select v-model="edgeFrom" class="builder-select">
                                    <option value="" disabled>From</option>
                                    <option v-for="node in graph.nodes" :key="node" :value="node">{{ node }}</option>
                                </select>
                                <select v-model="edgeTo" class="builder-select">
                                    <option value="" disabled>To</option>
                                    <option v-for="node in graph.nodes" :key="node" :value="node">{{ node }}</option>
                                </select>
                                <input v-if="isWeighted" v-model="edgeWeight" placeholder="Weight" type="number" class="weight-input" />
                                <button class="btn-small primary" @click="addEdge" :disabled="!edgeFrom || !edgeTo">Add Edge</button>
                            </div>

                            <!-- Current Edges -->
                            <div v-if="graph.edges.length" class="builder-items">
                                <h4>Edges</h4>
                                <div class="item-chips">
                                    <span v-for="(edge, idx) in graph.edges" :key="idx" class="chip edge-chip">
                                        {{ edge.from }} {{ graph.isDirected ? '→' : '—' }} {{ edge.to }}
                                        <span v-if="graph.isWeighted" class="chip-weight">({{ edge.weight }})</span>
                                        <button class="chip-remove" @click="removeEdge(idx)">&times;</button>
                                    </span>
                                </div>
                            </div>

                            <!-- Validation message -->
                            <p v-if="builderMessage" class="builder-message" :class="builderMessageType">{{ builderMessage }}</p>

                            <div class="builder-section">
                                <button class="btn-small danger" @click="clearGraph">Clear All</button>
                            </div>
                        </div>

                        <!-- Start Node Selection -->
                        <div class="start-node-section">
                            <label>Start Node:</label>
                            <select v-model="startNode" class="node-select">
                                <option v-for="node in graph.nodes" :key="node" :value="node">{{ node }}</option>
                            </select>
                            <label v-if="algorithmName === 'A* Algorithm'">Goal Node:</label>
                            <select v-if="algorithmName === 'A* Algorithm'" v-model="goalNode" class="node-select">
                                <option v-for="node in graph.nodes" :key="node" :value="node">{{ node }}</option>
                            </select>
                        </div>
                    </section>

                    <!-- CONTROLS -->
                    <section class="controls">
                        <button class="btn ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
                        <button class="btn primary" @click="playing ? pause() : play()">
                            {{ playing ? 'Pause' : 'Play' }}
                        </button>
                        <button class="btn ghost" @click="next" :disabled="stepIndex === steps.length - 1">Next</button>
                        <button class="btn danger" @click="reset">Reset</button>

                        <div class="step-counter">
                            Step {{ currentStepNumber }} / {{ totalSteps }}
                        </div>

                        <div class="speed">
                            <label>Speed</label>
                            <input type="range" min="1" max="5" step="1" v-model="speedLevel" />
                            <span>{{ ['Slow', 'Normal', 'Fast', 'Very Fast', 'Ultra'][speedLevel - 1] }}</span>
                        </div>
                    </section>
                </div>
            </section>
            
            <!-- CANVAS -->
            <section class="canvas">
                <GraphCanvas 
                    :nodes="currentStep.graph?.map(n => n.id || n.label || n) || []" 
                    :edges="currentStep.edges || []"
                    :visitedNodes="currentStep.visitedNodes || []" 
                    :activeNode="currentStep.activeNode"
                    :highlightedEdges="currentStep.highlightedEdges || []" 
                    :queueState="currentStep.queueState || []"
                    :stackState="currentStep.stackState || []"
                    :distances="currentStep.distances || null"
                    :isDirected="graph.isDirected" />
                <div class="canvas-legend">
                    <div class="legend-item">
                        <span class="dot normal"></span>
                        <span>Unvisited</span>
                    </div>
                    <div class="legend-item">
                        <span class="dot" :class="usesStack ? 'stack' : 'queue'"></span>
                        <span>{{ usesStack ? 'In Stack' : 'In Queue' }}</span>
                    </div>
                    <div class="legend-item">
                        <span class="dot active"></span>
                        <span>Processing</span>
                    </div>
                    <div class="legend-item">
                        <span class="dot visited"></span>
                        <span>Visited</span>
                    </div>
                </div>
            </section>
            
            <section v-if="showPseudoCode && pseudoCode" class="pseudo-section">
                <PseudoCodePanel :code="pseudoCode" :activeLine="currentStep.activePseudoLine || 0" />
            </section>

            <!-- DISTANCE TABLE (Dijkstra) -->
            <section v-if="currentStep.distances && !currentStep.gScore" class="distance-table-section">
                <h3>Distance Table</h3>
                <div class="distance-table-wrapper">
                    <table class="distance-table">
                        <thead>
                            <tr>
                                <th>Node</th>
                                <th v-for="node in graph.nodes" :key="node" 
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node) }">
                                    {{ node }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="row-label">Distance</td>
                                <td v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node), 'updated-cell': currentStep.isUpdate && currentStep.highlightedEdges?.some(e => e.to === node) }">
                                    {{ currentStep.distances[node] === Infinity ? '∞' : currentStep.distances[node] }}
                                </td>
                            </tr>
                            <tr>
                                <td class="row-label">Previous</td>
                                <td v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node) }">
                                    {{ currentStep.previousNodes?.[node] || '—' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- EXPLANATION (for A*) -->
            <section v-if="currentStep.gScore" class="explanation">
                <h3>Step Explanation</h3>
                <p>{{ currentStep.explanation }}</p>
            </section>

            <!-- A* TABLE (g-score, f-score, heuristic) -->
            <section v-if="currentStep.gScore" class="distance-table-section astar-table-section">
                <h3>A* Score Table</h3>
                <div class="distance-table-wrapper">
                    <table class="distance-table">
                        <thead>
                            <tr>
                                <th>Node</th>
                                <th v-for="node in graph.nodes" :key="node" 
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node) }">
                                    {{ node }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="row-label">g(n) <span class="label-desc">actual cost</span></td>
                                <td v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node), 'updated-cell': currentStep.type === 'update' && currentStep.highlightedEdges?.some(e => e.to === node) }">
                                    {{ currentStep.gScore[node] === Infinity ? '∞' : currentStep.gScore[node] }}
                                </td>
                            </tr>
                            <tr>
                                <td class="row-label">h(n) <span class="label-desc">heuristic</span></td>
                                <td v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node) }">
                                    {{ currentStep.heuristic?.[node] || 0 }}
                                </td>
                            </tr>
                            <tr class="f-score-row">
                                <td class="row-label">f(n) <span class="label-desc">g + h</span></td>
                                <td v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node), 'updated-cell': currentStep.type === 'update' && currentStep.highlightedEdges?.some(e => e.to === node) }">
                                    {{ currentStep.fScore[node] === Infinity ? '∞' : currentStep.fScore[node].toFixed(1) }}
                                </td>
                            </tr>
                            <tr>
                                <td class="row-label">Status</td>
                                <td v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node }">
                                    <span v-if="currentStep.closedSet?.includes(node)" class="status-badge closed">Closed</span>
                                    <span v-else-if="currentStep.openSet?.includes(node)" class="status-badge open">Open</span>
                                    <span v-else class="status-badge">—</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="currentStep.path" class="path-display">
                    <strong>🎯 Optimal Path Found:</strong> {{ currentStep.path.join(' → ') }}
                </div>
            </section>

            <!-- EXPLANATION (for Prim's) -->
            <section v-if="currentStep.key && !currentStep.gScore" class="explanation">
                <h3>Step Explanation</h3>
                <p>{{ currentStep.explanation }}</p>
            </section>

            <!-- PRIM'S MST TABLE -->
            <section v-if="currentStep.key && !currentStep.gScore" class="distance-table-section prim-table-section">
                <h3>MST Key Table</h3>
                <div class="distance-table-wrapper">
                    <table class="distance-table">
                        <thead>
                            <tr>
                                <th>Node</th>
                                <th v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.inMST?.includes(node) }">
                                    {{ node }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="row-label">Key <span class="label-desc">min edge weight</span></td>
                                <td v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.inMST?.includes(node), 'updated-cell': currentStep.type === 'update' && currentStep.highlightedEdges?.some(e => e.to === node) }">
                                    {{ currentStep.key[node] === Infinity ? '∞' : currentStep.key[node] }}
                                </td>
                            </tr>
                            <tr>
                                <td class="row-label">Parent <span class="label-desc">connected via</span></td>
                                <td v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.inMST?.includes(node) }">
                                    {{ currentStep.parent?.[node] || '—' }}
                                </td>
                            </tr>
                            <tr>
                                <td class="row-label">In MST</td>
                                <td v-for="node in graph.nodes" :key="node"
                                    :class="{ 'active-col': currentStep.activeNode === node }">
                                    <span v-if="currentStep.inMST?.includes(node)" class="status-badge mst-in">✓</span>
                                    <span v-else class="status-badge">—</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="currentStep.mstEdges && currentStep.mstEdges.length > 0" class="mst-summary">
                    <strong>🌲 MST Edges:</strong>
                    {{ currentStep.mstEdges.map(e => `${e.from}—${e.to}(${e.weight})`).join(', ') }}
                    <span class="mst-cost">| Total Cost: {{ currentStep.mstCost }}</span>
                </div>
            </section>

            <!-- EXPLANATION (for Kruskal's) -->
            <section v-if="currentStep.sortedEdges && !currentStep.key && !currentStep.gScore" class="explanation">
                <h3>Step Explanation</h3>
                <p>{{ currentStep.explanation }}</p>
            </section>

            <!-- KRUSKAL'S EDGE PROCESSING TABLE -->
            <section v-if="currentStep.sortedEdges && !currentStep.key && !currentStep.gScore" class="distance-table-section kruskal-table-section">
                <h3>Sorted Edges (Processing Order)</h3>
                <div class="edge-list-wrapper">
                    <table class="edge-list-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Edge</th>
                                <th>Weight</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(edge, index) in currentStep.sortedEdges" :key="index"
                                :class="{ 
                                    'current-edge': index === currentStep.currentEdgeIndex,
                                    'processed-edge': index < currentStep.currentEdgeIndex,
                                    'accepted-edge': currentStep.mstEdges.some(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from))
                                }">
                                <td>{{ index + 1 }}</td>
                                <td>{{ edge.from }} — {{ edge.to }}</td>
                                <td>{{ edge.weight }}</td>
                                <td>
                                    <span v-if="index < currentStep.currentEdgeIndex && currentStep.mstEdges.some(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from))" 
                                        class="status-badge accepted">✓ Added</span>
                                    <span v-else-if="index < currentStep.currentEdgeIndex" 
                                        class="status-badge skipped">✗ Skipped</span>
                                    <span v-else-if="index === currentStep.currentEdgeIndex" 
                                        class="status-badge processing">⚡ Processing</span>
                                    <span v-else class="status-badge pending">◯ Pending</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Union-Find Parent/Group Info -->
                <div v-if="currentStep.parent" class="union-find-section">
                    <h4>Union-Find Groups (Which nodes are connected?)</h4>
                    <div class="parent-grid">
                        <div v-for="node in graph.nodes" :key="node" class="parent-item">
                            <span class="node-label">{{ node }}</span>
                            <span class="parent-arrow">→</span>
                            <span class="parent-value">{{ currentStep.parent[node] }}</span>
                        </div>
                    </div>
                    <p class="union-find-hint">💡 Each node points to its "parent" in the Union-Find structure. Nodes with the same root are in the same group/tree.</p>
                </div>

                <div v-if="currentStep.mstEdges && currentStep.mstEdges.length > 0" class="mst-summary">
                    <strong>🌲 MST Edges:</strong>
                    {{ currentStep.mstEdges.map(e => `${e.from}—${e.to}(${e.weight})`).join(', ') }}
                    <span class="mst-cost">| Total Cost: {{ currentStep.mstCost }}</span>
                </div>
            </section>

            <!-- EXPLANATION (for non-A*, non-Prim, non-Kruskal) -->
            <section v-if="!currentStep.gScore && !currentStep.key && !currentStep.sortedEdges" class="explanation">
                <h3>Step Explanation</h3>
                <p>{{ currentStep.explanation }}</p>
            </section>
        </div>
    </main>
    <AlgorithmInfoModal v-if="showInfo && meta" :info="meta" @close="showInfo = false" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import arrowLeft from "@/assets/arrow-left.svg"
import { useRouter } from "vue-router"
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"
import PseudoCodePanel from './PseudoCodePanel.vue'
import GraphCanvas from './canvases/GraphCanvas.vue'
import { Graph } from '@/algorithms/graphOperations/Graph'

const props = defineProps({
    title: String,
    description: String,
    generateSteps: Function,
    pseudoCode: { type: Array, default: null },
    algorithmName: String,
    currentOperation: Object,
    showPseudoCode: { type: Boolean, default: true },
    defaultWeighted: { type: Boolean, default: false },
})

const router = useRouter()

// Create default graph
const createDefaultGraph = () => {
    if (props.defaultWeighted) {
        const g = new Graph(false, true)
        const nodes = ['A', 'B', 'C', 'D', 'E']
        nodes.forEach(n => g.addNode(n))
        g.addEdge('A', 'B', 4)
        g.addEdge('A', 'C', 2)
        g.addEdge('B', 'D', 3)
        g.addEdge('B', 'E', 1)
        g.addEdge('C', 'B', 1)
        g.addEdge('C', 'D', 5)
        g.addEdge('D', 'E', 2)
        return g
    }
    const g = new Graph()
    const nodes = ['A', 'B', 'C', 'D', 'E']
    nodes.forEach(n => g.addNode(n))
    g.addEdge('A', 'B')
    g.addEdge('A', 'C')
    g.addEdge('B', 'D')
    g.addEdge('C', 'D')
    g.addEdge('C', 'E')
    g.addEdge('D', 'E')
    return g
}

const graph = ref(createDefaultGraph())
const meta = computed(() => props.currentOperation || null)
const startNode = ref('A')
const goalNode = ref('E')
const steps = ref([])
const stepIndex = ref(0)
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const playing = ref(false)
const showInfo = ref(false)
const speedLevel = ref(3)
const showGraphBuilder = ref(false)
const newNode = ref('')
const edgeFrom = ref('')
const edgeTo = ref('')
const edgeWeight = ref('')
const isDirected = ref(false)
const isWeighted = ref(props.defaultWeighted)
const builderMessage = ref('')
const builderMessageType = ref('info')

const currentStep = computed(() =>
    steps.value[stepIndex.value] || { 
        graph: [], 
        edges: [],
        visitedNodes: [],
        activeNode: null,
        highlightedEdges: [],
        queueState: [],
        stackState: [],
        explanation: 'Click Play to start visualization',
        activePseudoLine: 0
    }
)

const usesStack = computed(() => {
    // Check if any step has stackState to determine which DS label to show
    return steps.value.some(s => s.stackState && s.stackState.length > 0)
})

const speedDelay = computed(() => {
    const map = {
        1: 1500,
        2: 1200,
        3: 900,
        4: 600,
        5: 300
    }
    return map[speedLevel.value]
})

let timer = null

// Generate steps when graph or start node changes
watch([graph, startNode, goalNode], () => {
    if (graph.value.nodes.length > 0) {
        const params = { startNode: startNode.value }
        if (props.algorithmName === 'A* Algorithm') {
            params.goalNode = goalNode.value
        }
        steps.value = props.generateSteps(graph.value, params)
        stepIndex.value = 0
    }
}, { deep: true, immediate: true })

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
    const params = { startNode: startNode.value }
    if (props.algorithmName === 'A* Algorithm') {
        params.goalNode = goalNode.value
    }
    steps.value = props.generateSteps(graph.value, params)
    stepIndex.value = 0
}

function generateRandomGraph() {
    const g = new Graph()
    const nodeCount = Math.floor(Math.random() * 3) + 4 // 4-6 nodes
    const nodeNames = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, nodeCount)
    
    nodeNames.forEach(n => g.addNode(n))
    
    // Add random edges
    const edgeCount = Math.floor(Math.random() * nodeCount) + nodeCount
    for (let i = 0; i < edgeCount; i++) {
        const from = nodeNames[Math.floor(Math.random() * nodeCount)]
        const to = nodeNames[Math.floor(Math.random() * nodeCount)]
        if (from !== to) {
            g.addEdge(from, to)
        }
    }
    
    graph.value = g
    startNode.value = nodeNames[0]
    showGraphBuilder.value = false
}

function showMessage(msg, type = 'info') {
    builderMessage.value = msg
    builderMessageType.value = type
    setTimeout(() => { builderMessage.value = '' }, 3000)
}

function addNode() {
    const name = newNode.value.trim().toUpperCase()
    if (!name) return showMessage('Enter a node name', 'error')
    if (graph.value.nodes.includes(name)) return showMessage(`Node "${name}" already exists`, 'error')
    graph.value.addNode(name)
    graph.value = new Graph(graph.value)
    if (!startNode.value) startNode.value = name
    newNode.value = ''
    showMessage(`Node "${name}" added`, 'success')
}

function removeNode(nodeName) {
    const g = new Graph(isDirected.value, isWeighted.value)
    graph.value.nodes.filter(n => n !== nodeName).forEach(n => g.addNode(n))
    graph.value.edges.filter(e => e.from !== nodeName && e.to !== nodeName).forEach(e => g.addEdge(e.from, e.to, e.weight))
    graph.value = g
    if (startNode.value === nodeName) startNode.value = g.nodes[0] || ''
    showMessage(`Node "${nodeName}" removed`, 'success')
}

function addEdge() {
    const from = edgeFrom.value
    const to = edgeTo.value
    if (!from || !to) return showMessage('Select both From and To nodes', 'error')
    const duplicate = graph.value.edges.some(e => e.from === from && e.to === to)
    if (duplicate) return showMessage(`Edge ${from} → ${to} already exists`, 'error')
    const weight = isWeighted.value && edgeWeight.value ? Number(edgeWeight.value) : 1
    graph.value.addEdge(from, to, weight)
    graph.value = new Graph(graph.value)
    edgeFrom.value = ''
    edgeTo.value = ''
    edgeWeight.value = ''
    showMessage(`Edge ${from} → ${to} added`, 'success')
}

function removeEdge(index) {
    const removedEdge = graph.value.edges[index]
    const g = new Graph(isDirected.value, isWeighted.value)
    graph.value.nodes.forEach(n => g.addNode(n))
    graph.value.edges.filter((_, i) => i !== index).forEach(e => g.addEdge(e.from, e.to, e.weight))
    graph.value = g
    showMessage(`Edge ${removedEdge.from} → ${removedEdge.to} removed`, 'success')
}

function clearGraph() {
    graph.value = new Graph(isDirected.value, isWeighted.value)
    startNode.value = ''
    showMessage('Graph cleared', 'info')
}

function rebuildGraph() {
    const g = new Graph(isDirected.value, isWeighted.value)
    graph.value.nodes.forEach(n => g.addNode(n))
    graph.value.edges.forEach(e => g.addEdge(e.from, e.to, e.weight))
    graph.value = g
}

watch(speedLevel, () => {
    if (playing.value) {
        pause()
        play()
    }
})

function goToGenerateCode() {
    const prompt = `Write a program for the ${props.algorithmName} algorithm for graph traversal. 
Include graph creation and traversal implementation.`

    router.push({
        path: '/generate-code',
        query: { prompt }
    })
}
</script>

<style scoped>
.visualizer-page {
    min-height: 100vh;
    background: radial-gradient(circle at top, #0f172a, #020617);
    padding: 40px 24px;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
}

.top-section {
    margin-bottom: 24px;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #e0e7ff;
    padding: 10px 18px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
}

.back-btn:hover {
    background: rgba(99, 102, 241, 0.25);
    transform: translateX(-3px);
}

.arrow {
    width: 20px;
    height: 20px;
}

.operation-details {
    background: rgba(30, 41, 59, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
}

.operation-header {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.page-header {
    text-align: center;
}

.operation-title-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.operation-title-group h1 {
    font-size: 2.2rem;
    background: linear-gradient(135deg, #818cf8, #c084fc);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.info-btn {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.4);
    color: #a5b4fc;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.info-btn:hover {
    background: rgba(99, 102, 241, 0.3);
    transform: scale(1.1);
}

.operation-desc {
    color: #94a3b8;
    font-size: 1.1rem;
    margin: 12px 0 20px;
}

.algo-badges {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

.badge {
    padding: 6px 14px;
    background: rgba(100, 116, 139, 0.2);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 8px;
    color: #cbd5e1;
    font-size: 0.9rem;
    font-weight: 500;
}

.graph-input {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.input-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
}

.graph-builder {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.builder-section {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

.builder-section h4 {
    color: #e0e7ff;
    margin: 0;
    min-width: 100px;
}

.builder-section input {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(100, 116, 139, 0.4);
    color: #e0e7ff;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.95rem;
    flex: 1;
    min-width: 80px;
}

.builder-section input:focus {
    outline: none;
    border-color: #6366f1;
}

.btn-small {
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s;
}

.btn-small.primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
}

.btn-small.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-small.danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
}

.btn-small.danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.builder-toggles {
    display: flex;
    gap: 20px;
    align-items: center;
}

.toggle-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #cbd5e1;
    font-size: 0.95rem;
    cursor: pointer;
    user-select: none;
}

.toggle-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #6366f1;
    cursor: pointer;
}

.builder-select {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(100, 116, 139, 0.4);
    color: #e0e7ff;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.95rem;
    flex: 1;
    min-width: 80px;
    cursor: pointer;
}

.builder-select:focus {
    outline: none;
    border-color: #6366f1;
}

.weight-input {
    max-width: 90px;
}

.builder-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.builder-items h4 {
    color: #e0e7ff;
    margin: 0;
    font-size: 0.9rem;
}

.item-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 20px;
    color: #c7d2fe;
    font-size: 0.85rem;
    font-weight: 500;
}

.edge-chip {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
}

.chip-weight {
    color: #94a3b8;
    font-size: 0.8rem;
}

.chip-remove {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    font-size: 1rem;
    padding: 0 2px;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.chip-remove:hover {
    opacity: 1;
}

.builder-message {
    margin: 0;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
}

.builder-message.success {
    background: rgba(34, 197, 94, 0.15);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #86efac;
}

.builder-message.error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
}

.builder-message.info {
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #c7d2fe;
}

.start-node-section {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
}

.start-node-section label {
    color: #e0e7ff;
    font-weight: 600;
}

.node-select {
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(100, 116, 139, 0.4);
    color: #e0e7ff;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
}

.node-select:focus {
    outline: none;
    border-color: #6366f1;
}

.controls {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
}

.btn {
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn.primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
}

.btn.primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn.ghost {
    background: rgba(100, 116, 139, 0.2);
    border: 1px solid rgba(100, 116, 139, 0.3);
    color: #cbd5e1;
}

.btn.ghost:hover:not(:disabled) {
    background: rgba(100, 116, 139, 0.3);
}

.btn.danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
}

.btn.danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.step-counter {
    padding: 10px 20px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 10px;
    color: #e0e7ff;
    font-weight: 600;
}

.speed {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #e0e7ff;
}

.speed input[type="range"] {
    width: 120px;
    cursor: pointer;
}

.canvas {
    margin-bottom: 24px;
}

.canvas-legend {
    display: flex;
    gap: 24px;
    justify-content: center;
    margin-top: 16px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #cbd5e1;
    font-size: 0.95rem;
}

.dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #1e293b;
}

.dot.normal {
    background: #64748b;
}

.dot.queue {
    background: #fbbf24;
}

.dot.stack {
    background: #a78bfa;
}

.dot.active {
    background: #22c55e;
}

.dot.visited {
    background: #6366f1;
}

.pseudo-section {
    margin-bottom: 24px;
}

.explanation {
    background: rgba(30, 41, 59, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
}

.explanation h3 {
    color: #e0e7ff;
    margin: 0 0 12px 0;
    font-size: 1.3rem;
}

.explanation p {
    color: #94a3b8;
    font-size: 1.05rem;
    line-height: 1.6;
    margin: 0;
}

/* Distance Table (Dijkstra) */
.distance-table-section {
    background: rgba(30, 41, 59, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
}

.distance-table-section h3 {
    color: #e0e7ff;
    margin: 0 0 16px 0;
    font-size: 1.3rem;
}

.distance-table-wrapper {
    overflow-x: auto;
}

.distance-table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
}

.distance-table th,
.distance-table td {
    padding: 10px 16px;
    border: 1px solid rgba(100, 116, 139, 0.3);
    color: #cbd5e1;
    font-size: 0.95rem;
    min-width: 60px;
}

.distance-table th {
    background: rgba(99, 102, 241, 0.15);
    color: #e0e7ff;
    font-weight: 600;
}

.distance-table .row-label {
    background: rgba(99, 102, 241, 0.1);
    color: #a5b4fc;
    font-weight: 600;
    text-align: left;
}

.distance-table .active-col {
    background: rgba(34, 197, 94, 0.15);
    color: #86efac;
}

.distance-table .visited-col {
    background: rgba(99, 102, 241, 0.1);
}

.distance-table .updated-cell {
    background: rgba(251, 191, 36, 0.2);
    color: #fde68a;
    font-weight: 700;
}

/* A* Specific Styles */
.astar-table-section .label-desc {
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 400;
    display: block;
    margin-top: 2px;
}

.astar-table-section .f-score-row {
    background: rgba(99, 102, 241, 0.05);
}

.astar-table-section .f-score-row td {
    font-weight: 600;
    color: #c7d2fe;
}

.status-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-badge.open {
    background: rgba(34, 197, 94, 0.2);
    color: #86efac;
    border: 1px solid rgba(34, 197, 94, 0.4);
}

.status-badge.closed {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.4);
}

.path-display {
    margin-top: 20px;
    padding: 16px;
    background: rgba(34, 197, 94, 0.1);
    border: 2px solid rgba(34, 197, 94, 0.3);
    border-radius: 12px;
    text-align: center;
    font-size: 1.1rem;
    color: #86efac;
    font-weight: 600;
}

.path-display strong {
    color: #22c55e;
}

/* Prim's MST Table */
.prim-table-section {
    margin-top: 24px;
}

.status-badge.mst-in {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    padding: 2px 10px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
}

.mst-summary {
    margin-top: 20px;
    padding: 16px;
    background: rgba(34, 197, 94, 0.1);
    border: 2px solid rgba(34, 197, 94, 0.3);
    border-radius: 12px;
    text-align: center;
    font-size: 1rem;
    color: #86efac;
    font-weight: 600;
}

.mst-summary strong {
    color: #22c55e;
}

.mst-cost {
    margin-left: 12px;
    color: #fbbf24;
    font-weight: 700;
}

/* Kruskal's Edge List Table */
.kruskal-table-section {
    margin-top: 24px;
}

.edge-list-wrapper {
    overflow-x: auto;
    margin: 16px 0;
}

.edge-list-table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(30, 41, 59, 0.4);
    border-radius: 12px;
    overflow: hidden;
}

.edge-list-table thead {
    background: rgba(51, 65, 85, 0.6);
}

.edge-list-table th,
.edge-list-table td {
    padding: 12px 16px;
    text-align: center;
    border-bottom: 1px solid rgba(71, 85, 105, 0.3);
}

.edge-list-table th {
    color: #94a3b8;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.edge-list-table td {
    color: #cbd5e1;
    font-size: 1rem;
}

.edge-list-table tr.current-edge {
    background: rgba(59, 130, 246, 0.15);
    border-left: 3px solid #3b82f6;
}

.edge-list-table tr.accepted-edge {
    background: rgba(34, 197, 94, 0.1);
}

.edge-list-table tr.processed-edge {
    opacity: 0.6;
}

.status-badge.accepted {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
}

.status-badge.skipped {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
}

.status-badge.processing {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    animation: pulse 2s ease-in-out infinite;
}

.status-badge.pending {
    background: rgba(100, 116, 139, 0.15);
    color: #64748b;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

/* Union-Find Section */
.union-find-section {
    margin-top: 24px;
    padding: 20px;
    background: rgba(30, 41, 59, 0.4);
    border-radius: 12px;
    border: 1px solid rgba(71, 85, 105, 0.3);
}

.union-find-section h4 {
    color: #94a3b8;
    font-size: 1rem;
    margin-bottom: 16px;
    font-weight: 600;
}

.parent-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
}

.parent-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    background: rgba(51, 65, 85, 0.4);
    border-radius: 8px;
    font-size: 0.95rem;
}

.node-label {
    color: #60a5fa;
    font-weight: 700;
}

.parent-arrow {
    color: #64748b;
}

.parent-value {
    color: #22c55e;
    font-weight: 700;
}

.union-find-hint {
    color: #94a3b8;
    font-size: 0.9rem;
    margin: 0;
    font-style: italic;
}
</style>
