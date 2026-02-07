<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  stack: Array,
  highlight: Array,
  topIndex: Number
})

const canvas = ref(null)

function drawStack() {
  if (!canvas.value) return

  const ctx = canvas.value.getContext("2d")
  const width = canvas.value.width
  const height = canvas.value.height

  ctx.fillStyle = "rgba(15, 23, 42, 0.85)"
  ctx.fillRect(0, 0, width, height)

  if (!props.stack || props.stack.length === 0) {
    ctx.fillStyle = "#94a3b8"
    ctx.font = "16px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Stack is empty", width / 2, height / 2)
    return
  }

  const boxWidth = 80
  const boxHeight = 60
  const gap = 10
  const startX = (width - boxWidth) / 2
  const startY = height - 100

  // Draw stack elements from bottom to top
  for (let i = 0; i < props.stack.length; i++) {
    const y = startY - i * (boxHeight + gap)
    const isHighlighted = props.highlight?.includes(i)
    const isTop = i === props.topIndex

    // Draw box
    if (isHighlighted) {
      ctx.fillStyle = "#22c55e"
    } else if (isTop) {
      ctx.fillStyle = "#6366f1"
    } else {
      ctx.fillStyle = "#1e293b"
    }

    ctx.fillRect(startX, y, boxWidth, boxHeight)

    // Draw border
    ctx.strokeStyle = isTop ? "#a78bfa" : "#475569"
    ctx.lineWidth = 2
    ctx.strokeRect(startX, y, boxWidth, boxHeight)

    // Draw value
    ctx.fillStyle = "white"
    ctx.font = "bold 18px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(props.stack[i], startX + boxWidth / 2, y + boxHeight / 2)

    // Draw index label
    ctx.fillStyle = "#94a3b8"
    ctx.font = "12px Arial"
    ctx.fillText(`[${i}]`, startX + boxWidth / 2, y + boxHeight + 15)

    // Draw "TOP" label on top element
    if (isTop) {
      ctx.fillStyle = "#a78bfa"
      ctx.font = "bold 12px Arial"
      ctx.fillText("← TOP", startX - 50, y + boxHeight / 2)
    }
  }
}

watch(() => props.stack, drawStack, { deep: true })
watch(() => props.highlight, drawStack, { deep: true })
watch(() => props.topIndex, drawStack, { deep: true })

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = canvas.value.offsetWidth
    canvas.value.height = canvas.value.offsetHeight
    drawStack()
  }
})
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  display: block;
}
</style>
