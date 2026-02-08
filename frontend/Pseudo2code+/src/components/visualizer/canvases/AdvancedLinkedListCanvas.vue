<template>
  <div class="linkedlist-canvas-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  list: { type: Array, default: () => [] },
  listType: { type: String, default: "singly" },
  activeNodeIndex: { type: Number, default: -1 },
  targetIndex: { type: Number, default: -1 },
  highlightNodes: { type: Array, default: () => [] }
})

const canvasRef = ref(null)

const drawLinkedList = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  
  const nodeRadius = 35
  const nodeWidth = 80
  const nodeHeight = 50
  const horizontalGap = 80
  const startX = 60
  const startY = 120

  let canvasHeight = 300
  if (props.listType === "circular") canvasHeight = 400
  else if (props.listType === "doubly") canvasHeight = 320

  canvas.width = Math.max(950, props.list.length * (nodeWidth + horizontalGap) + 100)
  canvas.height = canvasHeight

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!props.list || props.list.length === 0) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.textAlign = "center"
    ctx.fillText("Empty " + props.listType + " linked list", canvas.width / 2, canvas.height / 2)
    return
  }

  ctx.font = "bold 13px Arial"
  ctx.fillStyle = "#60a5fa"
  ctx.textAlign = "center"
  ctx.fillText("HEAD", startX + nodeWidth / 2, startY - 30)

  if (props.listType === "doubly") {
    const tailX = startX + (props.list.length - 1) * (nodeWidth + horizontalGap) + nodeWidth / 2
    ctx.fillStyle = "#8b5cf6"
    ctx.fillText("TAIL", tailX, startY - 30)
  }

  let currentX = startX

  for (let i = 0; i < props.list.length; i++) {
    if (props.listType === "singly") {
      drawRectangularNode(i, currentX, startY, nodeWidth, nodeHeight)
      if (i < props.list.length - 1) {
        drawArrow(currentX + nodeWidth, startY + nodeHeight / 2, currentX + nodeWidth + horizontalGap - nodeWidth, startY + nodeHeight / 2)
      } else {
        drawNullPointer(currentX + nodeWidth + 20, startY + nodeHeight / 2)
      }
      currentX += nodeWidth + horizontalGap
    } else if (props.listType === "doubly") {
      drawRectangularNode(i, currentX, startY, nodeWidth, nodeHeight)
      if (i < props.list.length - 1) {
        drawBidirectionalArrows(currentX + nodeWidth, startY + nodeHeight / 2, currentX + nodeWidth + horizontalGap - nodeWidth, startY + nodeHeight / 2)
      } else {
        drawNullPointer(currentX + nodeWidth + 20, startY + nodeHeight / 2)
      }
      currentX += nodeWidth + horizontalGap
    } else if (props.listType === "circular") {
      drawCircularNode(i, currentX, startY, nodeRadius)
      if (i < props.list.length - 1) {
        drawArrow(currentX + nodeRadius, startY, currentX + nodeRadius + horizontalGap, startY)
      } else {
        drawCircularBackPointer(currentX, startY, startX, startY, nodeRadius)
      }
      currentX += nodeRadius * 2 + horizontalGap
    }
  }

  function getNodeColor(index) {
    if (index === props.activeNodeIndex) return { fill: "rgba(99, 102, 241, 0.2)", border: "#6366f1", text: "#fff" }
    if (index === props.targetIndex) return { fill: "rgba(239, 68, 68, 0.2)", border: "#ef4444", text: "#fff" }
    if (props.highlightNodes.includes(index)) return { fill: "rgba(34, 197, 94, 0.2)", border: "#22c55e", text: "#fff" }
    return { fill: "rgba(30, 41, 59, 0.8)", border: "#64748b", text: "#e2e8f0" }
  }

  function drawRectangularNode(index, x, y, width, height) {
    const color = getNodeColor(index)
    const lineWidth = index === props.activeNodeIndex || index === props.targetIndex ? 3 : 2

    ctx.fillStyle = color.fill
    ctx.strokeStyle = color.border
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, 6)
    ctx.fill()
    ctx.stroke()

    ctx.font = "bold 20px Arial"
    ctx.fillStyle = color.text
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(props.list[index], x + width / 2, y + height / 2)

    ctx.font = "11px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.textAlign = "center"
    ctx.fillText(`[${index}]`, x + width / 2, y + height + 18)
  }

  function drawCircularNode(index, x, y, radius) {
    const color = getNodeColor(index)
    const lineWidth = index === props.activeNodeIndex || index === props.targetIndex ? 3 : 2

    ctx.fillStyle = color.fill
    ctx.strokeStyle = color.border
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    ctx.font = "bold 18px Arial"
    ctx.fillStyle = "#e2e8f0"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(props.list[index], x, y - 5)

    ctx.font = "10px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.textAlign = "center"
    ctx.fillText(`[${index}]`, x, y + radius + 18)
  }

  function drawArrow(fromX, fromY, toX, toY) {
    const headlen = 12
    const angle = Math.atan2(toY - fromY, toX - fromX)

    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.stroke()

    ctx.fillStyle = "#64748b"
    ctx.beginPath()
    ctx.moveTo(toX, toY)
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fill()

    ctx.font = "12px Arial"
    ctx.fillStyle = "#60a5fa"
    ctx.textAlign = "center"
    ctx.fillText("→", (fromX + toX) / 2, fromY - 15)
  }

  function drawBidirectionalArrows(fromX, fromY, toX, toY) {
    const midX = (fromX + toX) / 2
    const midY = fromY - 20

    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(fromX, fromY - 12)
    ctx.lineTo(toX, toY - 12)
    ctx.stroke()

    ctx.fillStyle = "#64748b"
    ctx.beginPath()
    ctx.moveTo(toX, toY - 12)
    ctx.lineTo(toX - 8, toY - 15)
    ctx.lineTo(toX - 8, toY - 9)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(toX, fromY + 12)
    ctx.lineTo(fromX, toY + 12)
    ctx.stroke()

    ctx.fillStyle = "#8b5cf6"
    ctx.beginPath()
    ctx.moveTo(fromX, toY + 12)
    ctx.lineTo(fromX + 8, toY + 15)
    ctx.lineTo(fromX + 8, toY + 9)
    ctx.closePath()
    ctx.fill()

    ctx.font = "11px Arial"
    ctx.fillStyle = "#60a5fa"
    ctx.textAlign = "center"
    ctx.fillText("next", midX, midY - 10)
    ctx.fillStyle = "#8b5cf6"
    ctx.fillText("prev", midX, midY + 20)
  }

  function drawCircularBackPointer(fromX, fromY, toX, toY, radius) {
    const curveHeight = 80
    const startX = fromX + radius
    const endX = toX + radius

    ctx.strokeStyle = "#ec4899"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(startX, fromY)
    ctx.bezierCurveTo(startX + 40, fromY + curveHeight, endX - 40, fromY + curveHeight, endX, fromY)
    ctx.stroke()

    const angle = -Math.PI / 2
    const headlen = 12
    ctx.fillStyle = "#ec4899"
    ctx.beginPath()
    ctx.moveTo(endX, fromY)
    ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), fromY - headlen * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), fromY - headlen * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fill()

    ctx.font = "12px Arial"
    ctx.fillStyle = "#ec4899"
    ctx.textAlign = "center"
    ctx.fillText("⭕", (startX + endX) / 2, fromY - 50)
  }

  function drawNullPointer(x, y) {
    ctx.font = "14px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.textAlign = "left"
    ctx.fillText("null", x, y + 5)
  }
}

onMounted(() => drawLinkedList())
watch([() => props.list, () => props.listType, () => props.activeNodeIndex, () => props.targetIndex], () => {
  drawLinkedList()
}, { deep: true })
</script>

<style scoped>
.linkedlist-canvas-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(2, 6, 23, 0.3);
  border-radius: 10px;
  padding: 12px;
  min-height: 280px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  overflow-x: auto;
}

canvas {
  display: block;
  background: transparent;
}
</style>
