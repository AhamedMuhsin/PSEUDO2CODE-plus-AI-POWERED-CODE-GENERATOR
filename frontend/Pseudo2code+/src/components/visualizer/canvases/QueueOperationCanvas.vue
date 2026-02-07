<template>
  <div class="queue-canvas-container">
    <canvas ref="canvasRef" width="600" height="150"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  queue: Array,
  highlight: Array,
  frontIndex: Number
})

const canvasRef = ref(null)

const drawQueue = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!props.queue || props.queue.length === 0) {
    ctx.font = "14px Arial"
    ctx.fillStyle = "#94a3b8"
    ctx.fillText("Empty Queue", canvas.width / 2 - 50, 75)
    return
  }

  const itemWidth = 50
  const itemHeight = 50
  const spacing = 10
  const startX = 50
  const startY = (canvas.height - itemHeight) / 2

  // Draw items
  props.queue.forEach((item, index) => {
    const x = startX + index * (itemWidth + spacing)
    const isHighlighted = props.highlight && props.highlight.includes(index)
    const isFront = index === props.frontIndex

    // Box
    ctx.fillStyle = isHighlighted
      ? "rgba(99, 102, 241, 0.6)"
      : "rgba(99, 102, 241, 0.3)"
    ctx.strokeStyle = isFront ? "#6366f1" : "rgba(99, 102, 241, 0.5)"
    ctx.lineWidth = isFront ? 3 : 1
    ctx.fillRect(x, startY, itemWidth, itemHeight)
    ctx.strokeRect(x, startY, itemWidth, itemHeight)

    // Value text
    ctx.font = "bold 16px Arial"
    ctx.fillStyle = "#cbd5f5"
    const textWidth = ctx.measureText(item).width
    ctx.fillText(item, x + (itemWidth - textWidth) / 2, startY + 32)

    // Index label
    ctx.font = "12px Arial"
    ctx.fillStyle = "#94a3b8"
    const indexText = `[${index}]`
    const indexWidth = ctx.measureText(indexText).width
    ctx.fillText(indexText, x + (itemWidth - indexWidth) / 2, startY + itemHeight + 16)

    // Front/Back labels
    if (isFront) {
      ctx.font = "12px Arial"
      ctx.fillStyle = "#6366f1"
      ctx.fillText("FRONT", x - 5, startY - 10)
    }

    if (index === props.queue.length - 1) {
      ctx.font = "12px Arial"
      ctx.fillStyle = "#6366f1"
      ctx.fillText("BACK", x + itemWidth - 20, startY - 10)
    }
  })
}

watch([() => props.queue, () => props.highlight, () => props.frontIndex], drawQueue, {
  deep: true
})

onMounted(() => {
  setTimeout(() => drawQueue(), 0)
})
</script>

<style scoped>
.queue-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: rgba(2, 6, 23, 0.4);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>
