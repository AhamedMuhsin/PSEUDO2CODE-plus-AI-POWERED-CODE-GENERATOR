<template>
    <main class="visualizer-page">
        <div class="container-compact">
            <!-- BACK -->
            <div class="top-section-compact">
                <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
                    <img :src="arrowLeft" class="arrow" />
                    Back
                </button>
            </div>
            
            <!-- HEADER - Compact -->
            <header class="page-header-compact">
                <div class="header-content">
                    <div class="operation-title-group-compact">
                        <h1>{{ title }}</h1>
                        <button v-if="meta" class="info-btn-compact" @click="showInfo = true"><Info :size="16" /></button>
                    </div>
                    <p class="operation-desc-compact">{{ description }}</p>
                    <div v-if="meta" class="algo-badges-compact">
                        <span class="badge-compact">Best: {{ meta.best }}</span>
                        <span class="badge-compact">Avg: {{ meta.average }}</span>
                        <span class="badge-compact">Worst: {{ meta.worst }}</span>
                        <span class="badge-compact">Space: {{ meta.space }}</span>
                    </div>
                </div>
            </header>

            <!-- TWO COLUMN LAYOUT -->
            <div class="two-column-layout">
                <!-- LEFT COLUMN: Controls & Canvas -->
                <div class="left-column">
                    <!-- GRAPH INPUT -->
                    <section class="graph-input-compact">

                        <div class="input-row-compact">
                            <button class="btn-compact ghost" @click="generateRandomGraph">
                                Random Graph
                            </button>
                            <button class="btn-compact ghost" @click="showGraphBuilder = !showGraphBuilder">
                                {{ showGraphBuilder ? 'Hide' : 'Build' }}
                            </button>
                            <button class="btn-compact ghost" @click="goToGenerateCode">
                                Code
                            </button>
                        </div>

                        <!-- Graph Builder -->
                        <div v-if="showGraphBuilder" class="graph-builder-compact">
                            <!-- Graph builder content with scrollable area -->
                            <div class="builder-content-scroll">
                                <div class="builder-toggles-compact">
                                    <label class="toggle-label-compact">
                                        <input type="checkbox" v-model="isDirected" @change="rebuildGraph" />
                                        Directed
                                    </label>
                                    <label class="toggle-label-compact">
                                        <input type="checkbox" v-model="isWeighted" @change="rebuildGraph" />
                                        Weighted
                                    </label>
                                </div>

                                <div class="builder-section-compact">
                                    <input v-model="newNode" placeholder="Node (A)" @keydown.enter="addNode" class="builder-input-compact" />
                                    <button class="btn-tiny primary" @click="addNode">+</button>
                                </div>

                                <div v-if="graph.nodes.length" class="item-chips-compact">
                                    <span v-for="node in graph.nodes" :key="node" class="chip-compact">
                                        {{ node }}
                                        <button class="chip-remove-compact" @click="removeNode(node)">&times;</button>
                                    </span>
                                </div>

                                <div class="builder-section-compact">
                                    <select v-model="edgeFrom" class="builder-select-compact">
                                        <option value="" disabled>From</option>
                                        <option v-for="node in graph.nodes" :key="node" :value="node">{{ node }}</option>
                                    </select>
                                    <select v-model="edgeTo" class="builder-select-compact">
                                        <option value="" disabled>To</option>
                                        <option v-for="node in graph.nodes" :key="node" :value="node">{{ node }}</option>
                                    </select>
                                    <input v-if="isWeighted" v-model="edgeWeight" placeholder="W" type="number" class="weight-input-compact" />
                                    <button class="btn-tiny primary" @click="addEdge" :disabled="!edgeFrom || !edgeTo">+</button>
                                </div>

                                <div v-if="graph.edges.length" class="item-chips-compact">
                                    <span v-for="(edge, idx) in graph.edges" :key="idx" class="chip-compact edge-chip">
                                        {{ edge.from }}{{ graph.isDirected ? '→' : '—' }}{{ edge.to }}
                                        <span v-if="graph.isWeighted" class="chip-weight-compact">({{ edge.weight }})</span>
                                        <button class="chip-remove-compact" @click="removeEdge(idx)">&times;</button>
                                    </span>
                                </div>

                                <p v-if="builderMessage" class="builder-message-compact" :class="builderMessageType">{{ builderMessage }}</p>

                                <button class="btn-tiny danger" @click="clearGraph">Clear</button>
                            </div>
                        </div>

                        <!-- Start Node Selection -->
                        <div class="start-node-section-compact">
                            <label>Start:</label>
                            <select v-model="startNode" class="node-select-compact">
                                <option v-for="node in graph.nodes" :key="node" :value="node">{{ node }}</option>
                            </select>
                            <label v-if="algorithmName === 'A* Algorithm'">Goal:</label>
                            <select v-if="algorithmName === 'A* Algorithm'" v-model="goalNode" class="node-select-compact">
                                <option v-for="node in graph.nodes" :key="node" :value="node">{{ node }}</option>
                            </select>
                        </div>
                    </section>

                    <!-- CONTROLS -->
                    <section class="controls-compact">
                        <button class="btn-compact ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
                        <button class="btn-compact primary" @click="playing ? pause() : play()">
                            {{ playing ? 'Pause' : 'Play' }}
                        </button>
                        <button class="btn-compact ghost" @click="next" :disabled="stepIndex === steps.length - 1">Next</button>
                        <button class="btn-compact danger" @click="reset">Reset</button>

                        <div class="step-counter-compact">
                            {{ currentStepNumber }}/{{ totalSteps }}
                        </div>

                        <div class="speed-compact">
                            <label>Speed</label>
                            <input type="range" min="1" max="5" step="1" v-model="speedLevel" class="speed-slider" />
                        </div>
                    </section>
            
                    <!-- CANVAS -->
                    <section class="canvas-compact">
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
                        <div class="canvas-legend-compact">
                            <div class="legend-item-compact">
                                <span class="dot normal"></span>
                                <span>Unvisited</span>
                            </div>
                            <div class="legend-item-compact">
                                <span class="dot" :class="usesStack ? 'stack' : 'queue'"></span>
                                <span>{{ usesStack ? 'Stack' : 'Queue' }}</span>
                            </div>
                            <div class="legend-item-compact">
                                <span class="dot active"></span>
                                <span>Processing</span>
                            </div>
                            <div class="legend-item-compact">
                                <span class="dot visited"></span>
                                <span>Visited</span>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- RIGHT COLUMN: Pseudo Code & Explanation -->
                <div class="right-column">
                    <section v-if="showPseudoCode && pseudoCode" class="pseudo-section-compact">
                        <h3 class="section-title-compact">Pseudocode</h3>
                        <div class="pseudo-scroll">
                            <PseudoCodePanel :code="pseudoCode" :activeLine="currentStep.activePseudoLine || 0" />
                        </div>
                    </section>

                    <!-- EXPLANATION -->
                    <section class="explanation-compact">
                        <h3 class="section-title-compact">Explanation</h3>
                        <p>{{ currentStep.explanation }}</p>
                    </section>

                    <!-- DATA TABLES - Scrollable -->
                    <div class="data-tables-scroll">

                        <!-- DISTANCE TABLE (Dijkstra) -->
                        <section v-if="currentStep.distances && !currentStep.gScore" class="distance-table-section-compact">
                            <h4 class="table-title-compact">Distance Table</h4>
                            <div class="distance-table-wrapper-compact">
                                <table class="distance-table-compact">
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
                                            <td class="row-label">Dist</td>
                                            <td v-for="node in graph.nodes" :key="node"
                                                :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node), 'updated-cell': currentStep.isUpdate && currentStep.highlightedEdges?.some(e => e.to === node) }">
                                                {{ currentStep.distances[node] === Infinity ? '∞' : currentStep.distances[node] }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="row-label">Prev</td>
                                            <td v-for="node in graph.nodes" :key="node"
                                                :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node) }">
                                                {{ currentStep.previousNodes?.[node] || '—' }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <!-- A* TABLE -->
                        <section v-if="currentStep.gScore" class="distance-table-section-compact">
                            <h4 class="table-title-compact">A* Score Table</h4>
                            <div class="distance-table-wrapper-compact">
                                <table class="distance-table-compact">
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
                                            <td class="row-label">g(n)</td>
                                            <td v-for="node in graph.nodes" :key="node"
                                                :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node), 'updated-cell': currentStep.type === 'update' && currentStep.highlightedEdges?.some(e => e.to === node) }">
                                                {{ currentStep.gScore[node] === Infinity ? '∞' : currentStep.gScore[node] }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="row-label">h(n)</td>
                                            <td v-for="node in graph.nodes" :key="node"
                                                :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node) }">
                                                {{ currentStep.heuristic?.[node] || 0 }}
                                            </td>
                                        </tr>
                                        <tr class="f-score-row">
                                            <td class="row-label">f(n)</td>
                                            <td v-for="node in graph.nodes" :key="node"
                                                :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.visitedNodes?.includes(node), 'updated-cell': currentStep.type === 'update' && currentStep.highlightedEdges?.some(e => e.to === node) }">
                                                {{ currentStep.fScore[node] === Infinity ? '∞' : currentStep.fScore[node].toFixed(1) }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="row-label">Status</td>
                                            <td v-for="node in graph.nodes" :key="node"
                                                :class="{ 'active-col': currentStep.activeNode === node }">
                                                <span v-if="currentStep.closedSet?.includes(node)" class="status-badge-compact closed">Closed</span>
                                                <span v-else-if="currentStep.openSet?.includes(node)" class="status-badge-compact open">Open</span>
                                                <span v-else class="status-badge-compact">—</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="currentStep.path" class="path-display-compact">
                                <strong><Target :size="16" class="inline-icon" /></strong> {{ currentStep.path.join(' → ') }}
                            </div>
                        </section>

                        <!-- PRIM'S MST TABLE -->
                        <section v-if="currentStep.key && !currentStep.gScore" class="distance-table-section-compact">
                            <h4 class="table-title-compact">MST Key Table</h4>
                            <div class="distance-table-wrapper-compact">
                                <table class="distance-table-compact">
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
                                            <td class="row-label">Key</td>
                                            <td v-for="node in graph.nodes" :key="node"
                                                :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.inMST?.includes(node), 'updated-cell': currentStep.type === 'update' && currentStep.highlightedEdges?.some(e => e.to === node) }">
                                                {{ currentStep.key[node] === Infinity ? '∞' : currentStep.key[node] }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="row-label">Parent</td>
                                            <td v-for="node in graph.nodes" :key="node"
                                                :class="{ 'active-col': currentStep.activeNode === node, 'visited-col': currentStep.inMST?.includes(node) }">
                                                {{ currentStep.parent?.[node] || '—' }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="row-label">MST</td>
                                            <td v-for="node in graph.nodes" :key="node"
                                                :class="{ 'active-col': currentStep.activeNode === node }">
                                                <span v-if="currentStep.inMST?.includes(node)" class="status-badge-compact mst-in"><Check :size="14" /></span>
                                                <span v-else class="status-badge-compact">—</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-if="currentStep.mstEdges && currentStep.mstEdges.length > 0" class="mst-summary-compact">
                                <strong><TreePine :size="16" class="inline-icon" /></strong> {{ currentStep.mstEdges.map(e => `${e.from}—${e.to}(${e.weight})`).join(', ') }}
                                <span class="mst-cost">| Cost: {{ currentStep.mstCost }}</span>
                            </div>
                        </section>

                        <!-- KRUSKAL'S TABLE -->
                        <section v-if="currentStep.sortedEdges && !currentStep.key && !currentStep.gScore" class="distance-table-section-compact kruskal-section">
                            <h4 class="table-title-compact">Edge Processing</h4>
                            <div class="edge-list-wrapper-compact">
                                <table class="edge-list-table-compact">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Edge</th>
                                            <th>W</th>
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
                                            <td>{{ edge.from }}—{{ edge.to }}</td>
                                            <td>{{ edge.weight }}</td>
                                            <td>
                                                <span v-if="index < currentStep.currentEdgeIndex && currentStep.mstEdges.some(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from))" 
                                                    class="status-badge-compact accepted"><Check :size="14" /></span>
                                                <span v-else-if="index < currentStep.currentEdgeIndex" 
                                                    class="status-badge-compact skipped"><X :size="14" /></span>
                                                <span v-else-if="index === currentStep.currentEdgeIndex" 
                                                    class="status-badge-compact processing"><Zap :size="14" /></span>
                                                <span v-else class="status-badge-compact pending"><Circle :size="14" /></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div v-if="currentStep.mstEdges && currentStep.mstEdges.length > 0" class="mst-summary-compact">
                                <strong><TreePine :size="16" class="inline-icon" /></strong> {{ currentStep.mstEdges.map(e => `${e.from}—${e.to}(${e.weight})`).join(', ') }}
                                <span class="mst-cost">| Cost: {{ currentStep.mstCost }}</span>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
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
import { Info, Target, TreePine, Zap, Circle, Check, X } from 'lucide-vue-next'

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
/* COMPACT LAYOUT - Everything fits on one screen */
.visualizer-page {
    height: 100vh;
    background: var(--bg-page);
    padding: 12px;
    overflow: hidden;
}

.container-compact {
    max-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.top-section-compact {
    flex-shrink: 0;
}

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

.arrow {
    width: 16px;
    height: 16px;
}

/* COMPACT HEADER */
.page-header-compact {
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 12px;
    padding: 12px 16px;
    flex-shrink: 0;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
}

.operation-title-group-compact {
    display: flex;
    align-items: center;
    gap: 8px;
}

.operation-title-group-compact h1 {
    font-size: 1.4rem;
    background: var(--accent);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.info-btn-compact {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid var(--accent-border);
    color: var(--accent-lighter);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.info-btn-compact:hover {
    background: rgba(99, 102, 241, 0.3);
    transform: scale(1.1);
}

.operation-desc-compact {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin: 0;
}

.algo-badges-compact {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.badge-compact {
    padding: 4px 8px;
    background: var(--border-light);
    border: 1px solid var(--border-medium);
    border-radius: 6px;
    color: var(--text-tertiary);
    font-size: 0.75rem;
    font-weight: 500;
}

/* TWO COLUMN LAYOUT */
.two-column-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.left-column, .right-column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
    overflow: hidden;
}

/* LEFT COLUMN - Inputs & Canvas */
.graph-input-compact {
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 10px;
    flex-shrink: 0;
}

.input-row-compact {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.btn-compact {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-compact.primary {
    background: var(--accent);
    color: var(--text-primary);
}

.btn-compact.primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-compact.ghost {
    background: var(--border-light);
    border: 1px solid var(--border-medium);
    color: var(--text-tertiary);
}

.btn-compact.ghost:hover:not(:disabled) {
    background: var(--border-medium);
}

.btn-compact.danger {
    background: var(--accent);
    color: var(--text-primary);
}

.btn-compact.danger:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-compact:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-tiny {
    padding: 4px 8px;
    border-radius: 4px;
    border: none;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-tiny.primary {
    background: var(--accent);
    color: var(--text-primary);
}

.btn-tiny.danger {
    background: var(--accent);
    color: var(--text-primary);
}

/* GRAPH BUILDER */
.graph-builder-compact {
    background: var(--bg-elevated);
    border: 1px solid var(--border-medium);
    border-radius: 8px;
    padding: 8px;
    margin-top: 6px;
}

.builder-content-scroll {
    max-height: 150px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.builder-toggles-compact {
    display: flex;
    gap: 12px;
}

.toggle-label-compact {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-tertiary);
    font-size: 0.8rem;
    cursor: pointer;
}

.toggle-label-compact input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: #6366f1;
    cursor: pointer;
}

.builder-section-compact {
    display: flex;
    gap: 4px;
    align-items: center;
}

.builder-input-compact,
.builder-select-compact,
.weight-input-compact {
    background: rgba(18, 18, 18, 0.8);
    border: 1px solid var(--border-strong);
    color: var(--accent-lighter);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    flex: 1;
    min-width: 60px;
}

.weight-input-compact {
    max-width: 50px;
}

.builder-input-compact:focus,
.builder-select-compact:focus {
    outline: none;
    border-color: var(--accent);
}

.item-chips-compact {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.chip-compact {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    border-radius: 12px;
    color: var(--accent-lighter);
    font-size: 0.75rem;
    font-weight: 500;
}

.chip-compact.edge-chip {
    background: rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.3);
}

.chip-weight-compact {
    color: var(--text-muted);
    font-size: 0.7rem;
}

.chip-remove-compact {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0;
    line-height: 1;
    opacity: 0.7;
}

.chip-remove-compact:hover {
    opacity: 1;
}

.builder-message-compact {
    margin: 0;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
}

.builder-message-compact.success {
    background: rgba(34, 197, 94, 0.15);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: var(--success-text);
}

.builder-message-compact.error {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: var(--error-text);
}

.start-node-section-compact {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
}

.start-node-section-compact label {
    color: var(--accent-lighter);
    font-weight: 600;
    font-size: 0.8rem;
}

.node-select-compact {
    background: rgba(18, 18, 18, 0.8);
    border: 1px solid var(--border-strong);
    color: var(--accent-lighter);
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
}

.node-select-compact:focus {
    outline: none;
    border-color: var(--accent);
}

/* CONTROLS */
.controls-compact {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 8px;
    flex-shrink: 0;
}

.step-counter-compact {
    padding: 5px 10px;
    background: var(--bg-hover);
    border: 1px solid var(--accent-border);
    border-radius: 6px;
    color: var(--accent-lighter);
    font-weight: 600;
    font-size: 0.75rem;
}

.speed-compact {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-lighter);
    font-size: 0.75rem;
}

.speed-slider {
    width: 80px;
    cursor: pointer;
}

/* CANVAS */
.canvas-compact {
    flex: 1;
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.canvas-legend-compact {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 8px;
    flex-wrap: wrap;
    flex-shrink: 0;
}

.legend-item-compact {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-tertiary);
    font-size: 0.75rem;
}

.dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #1a1a1a;
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
    background-color: var(--accent);
}

/* RIGHT COLUMN - Pseudo & Explanation */
.pseudo-section-compact {
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 10px;
    flex-shrink: 0;
}

.section-title-compact {
    color: var(--accent-lighter);
    margin: 0 0 8px 0;
    font-size: 1rem;
}

.pseudo-scroll {
    max-height: 200px;
    overflow-y: auto;
}

.explanation-compact {
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 10px;
    flex-shrink: 0;
}

.explanation-compact h3 {
    color: var(--accent-lighter);
    margin: 0 0 6px 0;
    font-size: 0.9rem;
}

.explanation-compact p {
    color: var(--text-muted);
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0;
}

/* DATA TABLES */
.data-tables-scroll {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
}

.distance-table-section-compact {
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 10px;
    flex-shrink: 0;
}

.table-title-compact {
    color: var(--accent-lighter);
    margin: 0 0 8px 0;
    font-size: 0.9rem;
}

.distance-table-wrapper-compact {
    overflow-x: auto;
}

.distance-table-compact {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
}

.distance-table-compact th,
.distance-table-compact td {
    padding: 6px 10px;
    border: 1px solid var(--border-medium);
    color: var(--text-tertiary);
    font-size: 0.75rem;
    min-width: 40px;
}

.distance-table-compact th {
    background: var(--accent-bg);
    color: var(--accent-lighter);
    font-weight: 600;
}

.distance-table-compact .row-label {
    background: var(--bg-hover);
    color: var(--accent-lighter);
    font-weight: 600;
    text-align: left;
}

.distance-table-compact .active-col {
    background: rgba(34, 197, 94, 0.15);
    color: var(--success-text);
}

.distance-table-compact .visited-col {
    background: var(--bg-hover);
}

.distance-table-compact .updated-cell {
    background: rgba(251, 191, 36, 0.2);
    color: #fde68a;
    font-weight: 700;
}

.status-badge-compact {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 8px;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-badge-compact.open {
    background: rgba(34, 197, 94, 0.2);
    color: var(--success-text);
    border: 1px solid rgba(34, 197, 94, 0.4);
}

.status-badge-compact.closed {
    background: rgba(239, 68, 68, 0.2);
    color: var(--error-text);
    border: 1px solid rgba(239, 68, 68, 0.4);
}

.status-badge-compact.mst-in {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
}

.status-badge-compact.accepted {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
}

.status-badge-compact.skipped {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
}

.status-badge-compact.processing {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    animation: pulse 2s ease-in-out infinite;
}

.status-badge-compact.pending {
    background: var(--border-light);
    color: var(--text-dim);
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

.path-display-compact,
.mst-summary-compact {
    margin-top: 8px;
    padding: 8px;
    background: rgba(34, 197, 94, 0.1);
    border: 2px solid rgba(34, 197, 94, 0.3);
    border-radius: 8px;
    text-align: center;
    font-size: 0.8rem;
    color: var(--success-text);
    font-weight: 600;
}

.mst-cost {
    margin-left: 8px;
    color: #fbbf24;
    font-weight: 700;
}

/* Kruskal Edge List */
.edge-list-wrapper-compact {
    overflow-x: auto;
    max-height: 200px;
    overflow-y: auto;
}

.edge-list-table-compact {
    width: 100%;
    border-collapse: collapse;
    background: rgba(18, 18, 18, 0.4);
    border-radius: 8px;
    overflow: hidden;
}

.edge-list-table-compact thead {
    background: rgba(51, 65, 85, 0.6);
}

.edge-list-table-compact th,
.edge-list-table-compact td {
    padding: 6px 10px;
    text-align: center;
    border-bottom: 1px solid rgba(71, 85, 105, 0.3);
    font-size: 0.75rem;
}

.edge-list-table-compact th {
    color: var(--text-muted);
    font-weight: 600;
}

.edge-list-table-compact td {
    color: var(--text-tertiary);
}

.edge-list-table-compact tr.current-edge {
    background: rgba(59, 130, 246, 0.15);
    border-left: 3px solid #3b82f6;
}

.edge-list-table-compact tr.accepted-edge {
    background: rgba(34, 197, 94, 0.1);
}

.edge-list-table-compact tr.processed-edge {
    opacity: 0.6;
}

/* SCROLLBAR STYLING */
.builder-content-scroll::-webkit-scrollbar,
.pseudo-scroll::-webkit-scrollbar,
.data-tables-scroll::-webkit-scrollbar,
.edge-list-wrapper-compact::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

.builder-content-scroll::-webkit-scrollbar-track,
.pseudo-scroll::-webkit-scrollbar-track,
.data-tables-scroll::-webkit-scrollbar-track,
.edge-list-wrapper-compact::-webkit-scrollbar-track {
    background: transparent;
}

.builder-content-scroll::-webkit-scrollbar-thumb,
.pseudo-scroll::-webkit-scrollbar-thumb,
.data-tables-scroll::-webkit-scrollbar-thumb,
.edge-list-wrapper-compact::-webkit-scrollbar-thumb {
    background: var(--accent-bg-hover);
    border-radius: 4px;
}

.builder-content-scroll::-webkit-scrollbar-thumb:hover,
.pseudo-scroll::-webkit-scrollbar-thumb:hover,
.data-tables-scroll::-webkit-scrollbar-thumb:hover,
.edge-list-wrapper-compact::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.4);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
    .two-column-layout {
        grid-template-columns: 1fr;
    }
    
    .visualizer-page {
        overflow-y: auto;
        height: auto;
        min-height: 100vh;
    }
}

.inline-icon {
    vertical-align: middle;
    display: inline-block;
    margin-right: 4px;
}
</style>
