<template>
  <div class="graph-canvas-container">
    <canvas
      ref="canvas"
      class="graph-canvas"
      :width="800"
      :height="500"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  nodes: Array,
  edges: Array,
  visitedNodes: Array,
  activeNode: String,
  highlightedEdges: Array,
  queueState: Array,
  stackState: Array,
  distances: { type: Object, default: null },
  isDirected: { type: Boolean, default: false }
})

const canvas = ref(null)

// Node positions in a circular layout
const getNodePositions = (nodes) => {
  const positions = {}
  const centerX = 400
  const centerY = 250
  const radius = 180
  const count = nodes.length

  nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / count - Math.PI / 2
    positions[node] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    }
  })

  return positions
}

const drawVisualization = () => {
  if (!canvas.value || !props.nodes) return

  const ctx = canvas.value.getContext("2d")
  const width = 800
  const height = 500

  ctx.clearRect(0, 0, width, height)

  // Background
  ctx.fillStyle = "rgba(10, 10, 10, 0.5)"
  ctx.fillRect(0, 0, width, height)

  const nodePositions = getNodePositions(props.nodes)

  const NODE_RADIUS = 30

  // Draw edges
  props.edges?.forEach(edge => {
    const from = nodePositions[edge.from]
    const to = nodePositions[edge.to]

    if (!from || !to) return

    const isHighlighted = props.highlightedEdges?.some(
      e => (e.from === edge.from && e.to === edge.to) || 
           (e.from === edge.to && e.to === edge.from)
    )

    ctx.strokeStyle = isHighlighted ? '#fbbf24' : '#475569'
    ctx.lineWidth = isHighlighted ? 4 : 2

    const isSelfLoop = edge.from === edge.to

    if (isSelfLoop) {
      // Draw self-loop as a small circle above/outside the node
      const loopRadius = 22
      const loopCenterX = from.x
      const loopCenterY = from.y - NODE_RADIUS - loopRadius + 4

      ctx.beginPath()
      ctx.arc(loopCenterX, loopCenterY, loopRadius, 0, 2 * Math.PI)
      ctx.stroke()

      // Arrow on self-loop (at bottom-right of the loop circle)
      if (props.isDirected) {
        const arrowAngle = Math.PI / 4
        const ax = loopCenterX + loopRadius * Math.cos(arrowAngle)
        const ay = loopCenterY + loopRadius * Math.sin(arrowAngle)
        const tangentAngle = arrowAngle + Math.PI / 2
        const arrowLen = 10
        ctx.fillStyle = ctx.strokeStyle
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(
          ax - arrowLen * Math.cos(tangentAngle - Math.PI / 5),
          ay - arrowLen * Math.sin(tangentAngle - Math.PI / 5)
        )
        ctx.lineTo(
          ax - arrowLen * Math.cos(tangentAngle + Math.PI / 5),
          ay - arrowLen * Math.sin(tangentAngle + Math.PI / 5)
        )
        ctx.closePath()
        ctx.fill()
      }

      // Weight label for self-loop
      if (edge.weight !== undefined && edge.weight !== 1) {
        const labelX = loopCenterX
        const labelY = loopCenterY - loopRadius - 6
        ctx.fillStyle = '#1a1a1a'
        ctx.beginPath()
        ctx.arc(labelX, labelY, 12, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = '#e0e7ff'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(edge.weight, labelX, labelY)
      }
    } else {
      // Normal edge
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()

      // Draw arrowhead for directed graphs
      if (props.isDirected) {
        const angle = Math.atan2(to.y - from.y, to.x - from.x)
        const arrowLen = 14
        // Position arrowhead at the edge of the target node
        const tipX = to.x - (NODE_RADIUS + 2) * Math.cos(angle)
        const tipY = to.y - (NODE_RADIUS + 2) * Math.sin(angle)

        ctx.fillStyle = isHighlighted ? '#fbbf24' : '#475569'
        ctx.beginPath()
        ctx.moveTo(tipX, tipY)
        ctx.lineTo(
          tipX - arrowLen * Math.cos(angle - Math.PI / 6),
          tipY - arrowLen * Math.sin(angle - Math.PI / 6)
        )
        ctx.lineTo(
          tipX - arrowLen * Math.cos(angle + Math.PI / 6),
          tipY - arrowLen * Math.sin(angle + Math.PI / 6)
        )
        ctx.closePath()
        ctx.fill()
      }

      // Edge weight/label
      if (edge.weight !== undefined && edge.weight !== 1) {
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2

        ctx.fillStyle = '#1a1a1a'
        ctx.beginPath()
        ctx.arc(midX, midY, 12, 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = '#e0e7ff'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(edge.weight, midX, midY)
      }
    }
  })

  // Draw nodes
  props.nodes.forEach(node => {
    const pos = nodePositions[node]
    if (!pos) return

    const isVisited = props.visitedNodes?.includes(node)
    const isActive = props.activeNode === node
    const isInQueue = props.queueState?.includes(node)
    const isInStack = props.stackState?.includes(node)

    // Node circle
    if (isActive) {
      ctx.fillStyle = '#22c55e'
      ctx.shadowColor = '#22c55e'
      ctx.shadowBlur = 20
    } else if (isVisited) {
      ctx.fillStyle = '#6366f1'
    } else if (isInQueue) {
      ctx.fillStyle = '#fbbf24'
    } else if (isInStack) {
      ctx.fillStyle = '#a78bfa'
    } else {
      ctx.fillStyle = '#64748b'
    }

    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 30, 0, 2 * Math.PI)
    ctx.fill()
    ctx.shadowBlur = 0

    // Node border
    ctx.strokeStyle = isActive ? '#dcfce7' : '#1a1a1a'
    ctx.lineWidth = isActive ? 3 : 2
    ctx.stroke()

    // Node label
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node, pos.x, pos.y)

    // Distance label (for Dijkstra)
    if (props.distances && props.distances[node] !== undefined) {
      const distVal = props.distances[node]
      const distText = distVal === Infinity ? '∞' : String(distVal)
      
      // Draw distance badge below node
      const badgeY = pos.y + NODE_RADIUS + 14
      ctx.fillStyle = 'var(--bg-card)'
      const badgeW = Math.max(ctx.measureText(`d=${distText}`).width + 12, 32)
      const badgeH = 20
      const badgeX = pos.x - badgeW / 2
      ctx.beginPath()
      ctx.roundRect(badgeX, badgeY - badgeH / 2, badgeW, badgeH, 4)
      ctx.fill()
      ctx.strokeStyle = isActive ? '#22c55e' : isVisited ? '#6366f1' : '#475569'
      ctx.lineWidth = 1
      ctx.stroke()
      
      ctx.fillStyle = distVal === Infinity ? '#94a3b8' : '#fde68a'
      ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`d=${distText}`, pos.x, badgeY)
    }
  })

  // Data structure visualization (Queue or Stack)
  const dsState = (props.queueState && props.queueState.length > 0) ? props.queueState
    : (props.stackState && props.stackState.length > 0) ? props.stackState
    : null
  const dsLabel = (props.queueState && props.queueState.length > 0) ? 'Queue'
    : (props.stackState && props.stackState.length > 0) ? 'Stack'
    : null

  if (dsState && dsLabel) {
    const dsY = height - 60
    ctx.fillStyle = '#e0e7ff'
    ctx.font = '14px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`${dsLabel}:`, 20, dsY)

    const dsColor = dsLabel === 'Stack' ? '#a78bfa' : '#fbbf24'

    dsState.forEach((node, idx) => {
      const x = 80 + idx * 50
      
      ctx.fillStyle = dsColor
      ctx.fillRect(x, dsY - 15, 40, 30)
      
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 2
      ctx.strokeRect(x, dsY - 15, 40, 30)

      ctx.fillStyle = '#000000'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(node, x + 20, dsY)
    })

    // Label for first element
    ctx.fillStyle = '#e0e7ff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    if (dsLabel === 'Queue') {
      ctx.fillText('Front', 100, dsY - 25)
    } else {
      ctx.fillText('Top', 100, dsY - 25)
    }
  }
}

watch(() => [props.nodes, props.edges, props.visitedNodes, props.activeNode, props.highlightedEdges, props.queueState, props.stackState, props.distances, props.isDirected], 
  drawVisualization, 
  { deep: true }
)
onMounted(drawVisualization)
</script>

<style scoped>
.graph-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: var(--bg-elevated);
  border-radius: 12px;
}

.graph-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
