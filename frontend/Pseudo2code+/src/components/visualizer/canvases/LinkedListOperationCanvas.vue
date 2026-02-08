<template>
  <div class="linkedlist-canvas-container">
    <canvas ref="canvasRef" width="900" height="400"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  list: Array,
  highlight: Array,
  currentIndex: Number
})

const canvasRef = ref(null)

const drawLinkedList = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!props.list || props.list.length === 0) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.textAlign = "center"
    ctx.fillText("LinkedList is empty", canvas.width / 2, canvas.height / 2)
    return
  }

  const nodeWidth = 60
  const nodeHeight = 60
  const arrowLength = 40
  const verticalGap = 20
  const startY = 100
  const startX = 40

  // Draw title
  ctx.font = "bold 14px Arial"
  ctx.fillStyle = "#6366f1"
  ctx.textAlign = "left"
  ctx.fillText("HEAD", 10, startY - 20)

  let currentX = startX

  // Draw nodes
  for (let i = 0; i < props.list.length; i++) {
    const isHighlighted = props.highlight && props.highlight.includes(i)
    const isCurrent = i === props.currentIndex

    // Draw node box
    ctx.strokeStyle = isCurrent ? "#818cf8" : isHighlighted ? "#22c55e" : "#64748b"
    ctx.lineWidth = isCurrent ? 3 : 2

    if (isHighlighted) {
      ctx.fillStyle = "rgba(34, 197, 94, 0.2)"
    } else if (isCurrent) {
      ctx.fillStyle = "rgba(99, 102, 241, 0.15)"
    } else {
      ctx.fillStyle = "rgba(30, 41, 59, 0.9)"
    }

    ctx.beginPath()
    ctx.roundRect(currentX, startY, nodeWidth, nodeHeight, 6)
    ctx.fill()
    ctx.stroke()

    // Draw node value
    ctx.font = "bold 20px Arial"
    ctx.fillStyle = "#cbd5f5"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(props.list[i], currentX + nodeWidth / 2, startY + nodeHeight / 2)

    // Draw index below node
    ctx.font = "12px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.textAlign = "center"
    ctx.fillText(`[${i}]`, currentX + nodeWidth / 2, startY + nodeHeight + 16)

    // Draw arrow to next node
    if (i < props.list.length - 1) {
      const arrowStartX = currentX + nodeWidth
      const arrowEndX = arrowStartX + arrowLength

      // Arrow line
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(arrowStartX, startY + nodeHeight / 2)
      ctx.lineTo(arrowEndX, startY + nodeHeight / 2)
      ctx.stroke()

      // Arrow head
      const headSize = 8
      ctx.fillStyle = "#64748b"
      ctx.beginPath()
      ctx.moveTo(arrowEndX, startY + nodeHeight / 2)
      ctx.lineTo(arrowEndX - headSize, startY + nodeHeight / 2 - headSize / 2)
      ctx.lineTo(arrowEndX - headSize, startY + nodeHeight / 2 + headSize / 2)
      ctx.closePath()
      ctx.fill()

      currentX = arrowEndX + 10
    }
  }

  // Draw NULL pointer
  const nullX = currentX + 10
  ctx.strokeStyle = "#94a3b8"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(nullX - 10, startY + nodeHeight / 2)
  ctx.lineTo(nullX + 20, startY + nodeHeight / 2)
  ctx.stroke()

  ctx.font = "bold 12px Arial"
  ctx.fillStyle = "#94a3b8"
  ctx.textAlign = "center"
  ctx.fillText("NULL", nullX + 10, startY + nodeHeight / 2 - 20)
}

watch([() => props.list, () => props.highlight, () => props.currentIndex], drawLinkedList, {
  deep: true
})

onMounted(() => {
  setTimeout(() => drawLinkedList(), 0)
})
</script>

<style scoped>
.linkedlist-canvas-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  background: rgba(2, 6, 23, 0.4);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  min-height: 500px;
  overflow-x: auto;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
