<template>
  <div class="nqueens-canvas-container">
    <canvas
      ref="canvas"
      class="nqueens-canvas"
      :width="canvasSize"
      :height="canvasSize"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  board: Array,
  queens: Array,
  attemptRow: Number,
  attemptCol: Number,
  status: String
})

const canvas = ref(null)
const canvasSize = 600
const cellSize = computed(() => canvasSize / (props.board?.length || 4))

const drawBoard = () => {
  if (!canvas.value || !props.board) return

  const ctx = canvas.value.getContext("2d")
  const n = props.board.length
  const cellSize = canvasSize / n

  ctx.clearRect(0, 0, canvasSize, canvasSize)

  // Draw chessboard
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const isLight = (row + col) % 2 === 0
      ctx.fillStyle = isLight ? '#cbd5e1' : '#64748b'
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)

      // Highlight attempt position
      if (row === props.attemptRow && col === props.attemptCol) {
        if (props.status === 'conflict') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'
        } else if (props.status === 'placed') {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.4)'
        } else if (props.status === 'checking') {
          ctx.fillStyle = 'rgba(234, 179, 8, 0.4)'
        }
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
      }
    }
  }

  // Draw queens
  if (props.queens) {
    ctx.font = `${cellSize * 0.6}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (const queen of props.queens) {
      const x = queen.col * cellSize + cellSize / 2
      const y = queen.row * cellSize + cellSize / 2

      // Draw queen symbol
      ctx.fillStyle = '#6366f1'
      ctx.font = `bold ${cellSize * 0.7}px Arial`
      ctx.fillText('♛', x, y)
    }
  }

  // Draw grid lines
  ctx.strokeStyle = '#1a1a1a'
  ctx.lineWidth = 1
  for (let i = 0; i <= n; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cellSize, 0)
    ctx.lineTo(i * cellSize, canvasSize)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, i * cellSize)
    ctx.lineTo(canvasSize, i * cellSize)
    ctx.stroke()
  }
}

watch(() => [props.board, props.queens, props.attemptRow, props.status], drawBoard, { deep: true })
onMounted(drawBoard)
</script>

<script>
import { computed } from "vue"
export default {
  name: 'NQueensCanvas'
}
</script>

<style scoped>
.nqueens-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: var(--bg-elevated);
  border-radius: 12px;
}

.nqueens-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
