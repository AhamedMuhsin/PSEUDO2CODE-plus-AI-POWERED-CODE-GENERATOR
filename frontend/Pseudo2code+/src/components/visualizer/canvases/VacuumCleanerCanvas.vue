<template>
  <div class="vacuum-canvas-container">
    <canvas
      ref="canvas"
      class="vacuum-canvas"
      :width="canvasSize"
      :height="canvasSize"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"

const props = defineProps({
  grid: Array,
  agentPos: Object,
  action: String
})

const canvas = ref(null)
const canvasSize = 500
const cellSize = computed(() => props.grid ? canvasSize / props.grid.length : 100)

const drawGrid = () => {
  if (!canvas.value || !props.grid) return

  const ctx = canvas.value.getContext("2d")
  const n = props.grid.length
  const cellSize = canvasSize / n

  ctx.clearRect(0, 0, canvasSize, canvasSize)

  // Draw background
  ctx.fillStyle = "rgba(10, 10, 10, 0.5)"
  ctx.fillRect(0, 0, canvasSize, canvasSize)

  // Draw grid cells
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const isDirty = props.grid[i][j] === 1
      const isAgentHere = props.agentPos && props.agentPos.row === i && props.agentPos.col === j

      // Cell background
      if (isAgentHere) {
        ctx.fillStyle = isDirty ? 'rgba(234, 179, 8, 0.3)' : 'rgba(34, 197, 94, 0.3)'
      } else {
        ctx.fillStyle = isDirty ? '#78350f' : '#f0fdf4'
      }
      ctx.fillRect(j * cellSize + 2, i * cellSize + 2, cellSize - 4, cellSize - 4)

      // Dirt particles
      if (isDirty) {
        ctx.fillStyle = '#92400e'
        for (let p = 0; p < 5; p++) {
          const px = j * cellSize + Math.random() * cellSize
          const py = i * cellSize + Math.random() * cellSize
          ctx.beginPath()
          ctx.arc(px, py, 3, 0, 2 * Math.PI)
          ctx.fill()
        }
      }

      // Grid lines
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 2
      ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize)
    }
  }

  // Draw vacuum agent
  if (props.agentPos) {
    const x = props.agentPos.col * cellSize + cellSize / 2
    const y = props.agentPos.row * cellSize + cellSize / 2

    // Agent body
    ctx.fillStyle = '#6366f1'
    ctx.beginPath()
    ctx.arc(x, y, cellSize * 0.3, 0, 2 * Math.PI)
    ctx.fill()

    // Agent icon
    ctx.fillStyle = 'white'
    ctx.font = `bold ${cellSize * 0.4}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🤖', x, y)

    // Action indicator
    if (props.action === 'suck') {
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(x, y, cellSize * 0.4, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.fillStyle = '#fbbf24'
      ctx.font = `bold ${cellSize * 0.2}px Arial`
      ctx.fillText('SUCK', x, y + cellSize * 0.55)
    }
  }
}

watch(() => [props.grid, props.agentPos, props.action], drawGrid, { deep: true })
onMounted(drawGrid)
</script>

<style scoped>
.vacuum-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: var(--bg-elevated);
  border-radius: 12px;
}

.vacuum-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
