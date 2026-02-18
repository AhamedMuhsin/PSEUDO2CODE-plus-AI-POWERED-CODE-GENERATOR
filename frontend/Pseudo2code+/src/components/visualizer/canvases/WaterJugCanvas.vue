<template>
  <div class="waterjug-canvas-container">
    <canvas
      ref="canvas"
      class="waterjug-canvas"
      :width="700"
      :height="400"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  jug1: Number,
  jug2: Number,
  jug1Capacity: Number,
  jug2Capacity: Number,
  target: Number
})

const canvas = ref(null)

const drawJugs = () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext("2d")
  const width = 700
  const height = 400

  ctx.clearRect(0, 0, width, height)

  // Draw background
  ctx.fillStyle = "rgba(10, 10, 10, 0.5)"
  ctx.fillRect(0, 0, width, height)

  // Draw Jug 1
  drawJug(ctx, 150, 100, 150, 250, props.jug1 || 0, props.jug1Capacity || 4, 'Jug 1')

  // Draw Jug 2
  drawJug(ctx, 450, 100, 150, 250, props.jug2 || 0, props.jug2Capacity || 3, 'Jug 2')

  // Draw target indicator
  ctx.fillStyle = '#fbbf24'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`Target: ${props.target || 0}L`, width / 2, 50)

  // Check if target reached
  if (props.jug1 === props.target || props.jug2 === props.target) {
    ctx.fillStyle = '#22c55e'
    ctx.font = 'bold 24px Arial'
    ctx.fillText('✓ Target Reached!', width / 2, 380)
  }
}

const drawJug = (ctx, x, y, w, h, current, capacity, label) => {
  // Jug outline
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 3
  ctx.strokeRect(x, y, w, h)

  // Water level
  const waterHeight = (current / capacity) * h
  const waterY = y + h - waterHeight

  ctx.fillStyle = '#3b82f6'
  ctx.globalAlpha = 0.6
  ctx.fillRect(x, waterY, w, waterHeight)
  ctx.globalAlpha = 1.0

  // Water level text
  ctx.fillStyle = '#e0e7ff'
  ctx.font = 'bold 32px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`${current}L`, x + w / 2, y + h / 2 + 10)

  // Capacity label
  ctx.font = '16px Arial'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText(`${label} (${capacity}L)`, x + w / 2, y + h + 30)

  // Highlight if equals target
  if (current === (props.target || 0)) {
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 5
    ctx.strokeRect(x - 5, y - 5, w + 10, h + 10)
  }
}

watch(() => [props.jug1, props.jug2, props.target], drawJugs, { deep: true })
onMounted(drawJugs)
</script>

<style scoped>
.waterjug-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: var(--bg-elevated);
  border-radius: 12px;
}

.waterjug-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
