<template>
  <div class="graph-canvas-container">
    <canvas
      ref="canvas"
      class="graph-canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @click="handleCanvasClick"
    />
    <div v-if="nodesInfo.length === 0" class="empty-state">
      <p>No graph to display. Create a graph first.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"

const props = defineProps({
  nodes: Array,
  edges: Array,
  visitedNodes: Array,
  activeNode: [String, Number],
  highlightedEdges: Array
})

const canvas = ref(null)
const canvasWidth = 800
const canvasHeight = 500
const nodeRadius = 35
const padding = 60

// Calculate node positions using force-directed layout
const nodesInfo = computed(() => {
  if (!props.nodes || props.nodes.length === 0) return []

  return props.nodes.map((node, index) => {
    const angle = (index / props.nodes.length) * 2 * Math.PI
    const radius = Math.min(canvasWidth, canvasHeight) / 2 - 80
    const x = canvasWidth / 2 + radius * Math.cos(angle)
    const y = canvasHeight / 2 + radius * Math.sin(angle)

    return {
      id: node.id,
      label: node.label,
      x,
      y,
      isVisited: props.visitedNodes?.includes(node.id),
      isActive: props.activeNode === node.id
    }
  })
})

const getNodeInfo = (nodeId) => {
  return nodesInfo.value.find(n => n.id === nodeId)
}

const getEdgeIsHighlighted = (edge) => {
  return props.highlightedEdges?.some(
    e => (e.from === edge.from && e.to === edge.to) ||
         (e.from === edge.to && e.to === edge.from)
  )
}

const drawGraph = () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext("2d")
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // Draw background
  ctx.fillStyle = "rgba(10, 10, 10, 0.5)"
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Draw edges first (so they appear behind nodes)
  if (props.edges && props.edges.length > 0) {
    for (const edge of props.edges) {
      const fromNode = getNodeInfo(edge.from)
      const toNode = getNodeInfo(edge.to)

      if (!fromNode || !toNode) continue

      const isHighlighted = getEdgeIsHighlighted(edge)

      // Draw arrow line
      drawArrow(
        ctx,
        fromNode.x,
        fromNode.y,
        toNode.x,
        toNode.y,
        isHighlighted
      )

      // Draw weight if present
      if (edge.weight && edge.weight !== 1) {
        const midX = (fromNode.x + toNode.x) / 2
        const midY = (fromNode.y + toNode.y) / 2

        ctx.fillStyle = isHighlighted ? "#fbbf24" : "#cbd5e1"
        ctx.font = "bold 12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(edge.weight, midX, midY - 15)
      }
    }
  }

  // Draw nodes
  if (nodesInfo.value.length > 0) {
    for (const node of nodesInfo.value) {
      drawNode(ctx, node)
    }
  }
}

const drawArrow = (ctx, fromX, fromY, toX, toY, highlighted) => {
  const headlen = 15
  const angle = Math.atan2(toY - fromY, toX - fromX)

  // Adjust start and end points to account for node radius
  const startX = fromX + nodeRadius * Math.cos(angle)
  const startY = fromY + nodeRadius * Math.sin(angle)
  const endX = toX - nodeRadius * Math.cos(angle)
  const endY = toY - nodeRadius * Math.sin(angle)

  // Draw line
  ctx.strokeStyle = highlighted ? "#fbbf24" : "rgba(148, 163, 184, 0.4)"
  ctx.lineWidth = highlighted ? 3 : 2
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.stroke()

  // Draw arrowhead
  ctx.fillStyle = highlighted ? "#fbbf24" : "rgba(148, 163, 184, 0.4)"
  ctx.beginPath()
  ctx.moveTo(endX, endY)
  ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}

const drawNode = (ctx, node) => {
  const { x, y, label, isActive, isVisited } = node

  // Draw glow for active node
  if (isActive) {
    ctx.fillStyle = "rgba(168, 85, 247, 0.3)"
    ctx.beginPath()
    ctx.arc(x, y, nodeRadius + 15, 0, 2 * Math.PI)
    ctx.fill()
  }

  // Draw node circle
  if (isActive) {
    ctx.fillStyle = "#a855f7"
  } else if (isVisited) {
    ctx.fillStyle = "#06b6d4"
  } else {
    ctx.fillStyle = "#6366f1"
  }

  ctx.beginPath()
  ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI)
  ctx.fill()

  // Draw border
  ctx.strokeStyle = isActive ? "#d8b4fe" : "#e0e7ff"
  ctx.lineWidth = isActive ? 3 : 2
  ctx.beginPath()
  ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI)
  ctx.stroke()

  // Draw label
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 16px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(label, x, y)
}

const handleCanvasClick = (e) => {
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  for (const node of nodesInfo.value) {
    const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
    if (distance <= nodeRadius) {
      console.log("Clicked node:", node.id)
      break
    }
  }
}

onMounted(() => {
  drawGraph()
})

watch(
  [() => props.visitedNodes, () => props.activeNode, () => props.highlightedEdges],
  () => {
    drawGraph()
  },
  { deep: true }
)
</script>

<style scoped>
.graph-canvas-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  background: var(--accent), rgba(0, 0, 0, 0.4));
  border-radius: 12px;
  border: 1px solid var(--accent-border);
  position: relative;
  overflow: hidden;
}

.graph-canvas {
  display: block;
  cursor: crosshair;
}

.empty-state {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--text-dim);
  font-size: 1.1rem;
  pointer-events: none;
}
</style>
