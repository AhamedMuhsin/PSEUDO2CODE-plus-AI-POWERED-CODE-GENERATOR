<template>
  <div class="stack-canvas-container">
    <canvas ref="canvasRef" width="350" height="550"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  stack: Array,
  highlight: Array,
  topIndex: Number
})

const canvasRef = ref(null)

const drawStack = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!props.stack || props.stack.length === 0) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.textAlign = "center"
    ctx.fillText("Stack is empty", canvas.width / 2, canvas.height / 2)
    return
  }

  const boxWidth = 120
  const boxHeight = 80
  const gap = 12
  const startX = (canvas.width - boxWidth) / 2
  const startY = 80

  // Draw "TOP OF STACK" label
  ctx.font = "bold 14px Arial"
  ctx.fillStyle = "#6366f1"
  ctx.textAlign = "right"
  ctx.fillText("TOP OF STACK", canvas.width - 30, 35)

  // Draw stack elements from top to bottom (last element first = top of stack)
  for (let i = props.stack.length - 1; i >= 0; i--) {
    const displayIndex = props.stack.length - 1 - i  // Position in visual stack (0 is top)
    const y = startY + displayIndex * (boxHeight + gap)
    const isHighlighted = props.highlight && props.highlight.includes(i)
    const isTop = i === props.topIndex

    // Draw index label on left (showing actual array index)
    ctx.font = "14px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"
    ctx.fillText(i.toString(), startX - 30, y + boxHeight / 2)

    // Draw box with border
    ctx.strokeStyle = isTop ? "#818cf8" : isHighlighted ? "#22c55e" : "#64748b"
    ctx.lineWidth = isTop ? 3 : 2
    
    if (isHighlighted) {
      ctx.fillStyle = "rgba(34, 197, 94, 0.2)"
    } else if (isTop) {
      ctx.fillStyle = "rgba(99, 102, 241, 0.15)"
    } else {
      ctx.fillStyle = "rgba(18, 18, 18, 0.9)"
    }
    
    // Draw rounded rectangle
    ctx.beginPath()
    ctx.roundRect(startX, y, boxWidth, boxHeight, 8)
    ctx.fill()
    ctx.stroke()

    // Draw value
    ctx.font = "bold 28px Arial"
    ctx.fillStyle = "#cbd5f5"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(props.stack[i], startX + boxWidth / 2, y + boxHeight / 2)
  }

  // Draw "STACK BASE" label
  ctx.font = "bold 14px Arial"
  ctx.fillStyle = "#94a3b8"
  ctx.textAlign = "center"
  const baseY = startY + props.stack.length * (boxHeight + gap) + 30
  ctx.fillText("STACK BASE", canvas.width / 2, baseY)
}

watch([() => props.stack, () => props.highlight, () => props.topIndex], drawStack, {
  deep: true
})

onMounted(() => {
  setTimeout(() => drawStack(), 0)
})
</script>

<style scoped>
.stack-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid var(--accent-border);
  min-height: 400px;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
