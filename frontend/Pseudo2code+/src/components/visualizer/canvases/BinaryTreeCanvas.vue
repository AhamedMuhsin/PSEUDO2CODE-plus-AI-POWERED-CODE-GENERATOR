<template>
  <div class="binarytree-canvas-container">
    <canvas ref="canvasRef"></canvas>
    <div v-if="traversalOrder.length > 0" class="traversal-sequence">
      <span class="label">Traversal Order:</span>
      <div class="sequence-display">
        <span v-for="(val, idx) in traversalOrder" :key="idx" :class="['sequence-item', { active: idx === currentTraversalIndex }]">
          {{ val }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue"

const props = defineProps({
  treeArray: { type: Array, default: () => [] },
  activeNodeIndex: { type: Number, default: -1 },
  targetIndex: { type: Number, default: -1 },
  highlightNodes: { type: Array, default: () => [] },
  traversalOrder: { type: Array, default: () => [] },
  leafNodes: { type: Array, default: () => [] }
})

const canvasRef = ref(null)
const currentTraversalIndex = ref(0)

watch(
  () => props.traversalOrder,
  (newOrder) => {
    if (newOrder.length > 0) {
      currentTraversalIndex.value = -1
    }
  }
)

watch(
  () => props.highlightNodes,
  (newHighlight) => {
    if (props.traversalOrder.length > 0) {
      currentTraversalIndex.value = newHighlight.length > 0 ? newHighlight.length - 1 : 0
    }
  }
)

const drawBinaryTree = () => {
  const canvas = canvasRef.value
  if (!canvas || !props.treeArray || props.treeArray.length === 0) {
    if (canvas) {
      const ctx = canvas.getContext("2d")
      canvas.width = 800
      canvas.height = 400

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = "16px Arial"
      ctx.fillStyle = "#94a3b8"
      ctx.textAlign = "center"
      ctx.fillText("Empty tree", canvas.width / 2, canvas.height / 2)
    }
    return
  }

  const ctx = canvas.getContext("2d")
  const padding = 60
  const nodeRadius = 35
  const minHorizontalGap = 80

  // Calculate tree depth
  const getDepth = (index, treeArray) => {
    let depth = 0
    let current = index
    while (current > 0) {
      current = Math.floor((current - 1) / 2)
      depth++
    }
    return depth
  }

  const maxDepth = Math.max(...props.treeArray.map((_, i) => getDepth(i, props.treeArray)))
  const treeHeight = (maxDepth + 1) * 120 + 100

  // Calculate canvas width based on max nodes at any level
  const nodesPerLevel = {}
  props.treeArray.forEach((node, index) => {
    const depth = getDepth(index, props.treeArray)
    nodesPerLevel[depth] = (nodesPerLevel[depth] || 0) + 1
  })

  const maxNodesAtLevel = Math.max(...Object.values(nodesPerLevel))
  const minCanvasWidth = maxNodesAtLevel * (nodeRadius * 2 + minHorizontalGap) + 2 * padding

  canvas.width = Math.max(1000, minCanvasWidth)
  canvas.height = Math.max(600, treeHeight)

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw title
  ctx.font = "14px Arial"
  ctx.fillStyle = "#60a5fa"
  ctx.textAlign = "center"
  ctx.fillText("Binary Tree Visualization", canvas.width / 2, 20)

  // Calculate positions for each node
  const nodePositions = {}

  const calculatePositions = (index, x, y, offset) => {
    nodePositions[index] = { x, y }

    const leftChildIndex = 2 * index + 1
    const rightChildIndex = 2 * index + 2

    if (leftChildIndex < props.treeArray.length) {
      calculatePositions(leftChildIndex, x - offset, y + 100, offset / 2)
    }

    if (rightChildIndex < props.treeArray.length) {
      calculatePositions(rightChildIndex, x + offset, y + 100, offset / 2)
    }
  }

  const initialOffset = Math.max(150, (canvas.width - 2 * padding) / Math.pow(2, maxDepth + 1))
  calculatePositions(0, canvas.width / 2, 80, initialOffset)

  // Draw edges first (so they appear behind nodes)
  ctx.strokeStyle = "#475569"
  ctx.lineWidth = 2

  props.treeArray.forEach((node, index) => {
    const leftChildIndex = 2 * index + 1
    const rightChildIndex = 2 * index + 2

    if (leftChildIndex < props.treeArray.length && nodePositions[leftChildIndex]) {
      const fromPos = nodePositions[index]
      const toPos = nodePositions[leftChildIndex]

      // Highlight active edges
      if (props.activeNodeIndex === leftChildIndex || props.activeNodeIndex === index) {
        ctx.strokeStyle = "#a78bfa"
        ctx.lineWidth = 3
      } else if (props.highlightNodes.includes(leftChildIndex) || props.highlightNodes.includes(index)) {
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 2.5
      } else {
        ctx.strokeStyle = "#475569"
        ctx.lineWidth = 2
      }

      ctx.beginPath()
      ctx.moveTo(fromPos.x, fromPos.y + nodeRadius)
      ctx.lineTo(toPos.x, toPos.y - nodeRadius)
      ctx.stroke()
    }

    if (rightChildIndex < props.treeArray.length && nodePositions[rightChildIndex]) {
      const fromPos = nodePositions[index]
      const toPos = nodePositions[rightChildIndex]

      if (props.activeNodeIndex === rightChildIndex || props.activeNodeIndex === index) {
        ctx.strokeStyle = "#a78bfa"
        ctx.lineWidth = 3
      } else if (props.highlightNodes.includes(rightChildIndex) || props.highlightNodes.includes(index)) {
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 2.5
      } else {
        ctx.strokeStyle = "#475569"
        ctx.lineWidth = 2
      }

      ctx.beginPath()
      ctx.moveTo(fromPos.x, fromPos.y + nodeRadius)
      ctx.lineTo(toPos.x, toPos.y - nodeRadius)
      ctx.stroke()
    }
  })

  // Draw nodes
  props.treeArray.forEach((node, index) => {
    const pos = nodePositions[index]
    if (!pos) return

    const isActive = index === props.activeNodeIndex
    const isTarget = index === props.targetIndex
    const isHighlighted = props.highlightNodes.includes(index)
    const isLeaf = props.leafNodes.includes(node.value)

    // Determine node color based on state
    let fillColor, borderColor, textColor, borderWidth

    if (isActive) {
      fillColor = "rgba(167, 139, 250, 0.3)" // Purple with transparency
      borderColor = "#a78bfa"
      textColor = "#ffffff"
      borderWidth = 3
    } else if (isTarget) {
      fillColor = "rgba(239, 68, 68, 0.3)" // Red
      borderColor = "#ef4444"
      textColor = "#ffffff"
      borderWidth = 3
    } else if (isHighlighted) {
      fillColor = "rgba(6, 182, 212, 0.3)" // Cyan
      borderColor = "#06b6d4"
      textColor = "#ffffff"
      borderWidth = 2.5
    } else {
      fillColor = "rgba(18, 18, 18, 0.8)"
      borderColor = "#64748b"
      textColor = "#e2e8f0"
      borderWidth = 2
    }

    // Draw circle
    ctx.fillStyle = fillColor
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    // Draw value text
    ctx.font = "bold 18px Arial"
    ctx.fillStyle = textColor
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(node.value, pos.x, pos.y)

    // Draw node index label (small, below node)
    ctx.font = "11px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(`[${index}]`, pos.x, pos.y + nodeRadius + 10)

    // Draw leaf indicator if applicable
    if (isLeaf) {
      ctx.font = "12px Arial"
      ctx.fillStyle = "#22c55e"
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"
      ctx.fillText("●", pos.x, pos.y - nodeRadius - 12)
    }
  })
}

onMounted(() => {
  drawBinaryTree()
})

watch(() => props.treeArray, () => {
  drawBinaryTree()
}, { deep: true })

watch(() => [props.activeNodeIndex, props.targetIndex, props.highlightNodes], () => {
  drawBinaryTree()
}, { deep: true })
</script>

<style scoped>
.binarytree-canvas-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--accent), rgba(0, 0, 0, 0.8));
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 16px;
  min-height: 450px;
  overflow-x: auto;
  overflow-y: hidden;
}

canvas {
  background: var(--bg-page);
  border-radius: 6px;
  display: block;
  margin: 0 auto;
  max-width: 100%;
  border: 1px solid #334155;
}

.traversal-sequence {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid #334155;
}

.label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sequence-display {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.sequence-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  background: rgba(18, 18, 18, 0.8);
  border: 1px solid #475569;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.sequence-item.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--text-primary);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.5);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .binarytree-canvas-container {
    padding: 12px;
    min-height: 350px;
  }

  canvas {
    max-height: 300px;
    width: 100%;
  }
}
</style>
