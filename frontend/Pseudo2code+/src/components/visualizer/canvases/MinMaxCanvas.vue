<template>
  <div class="minimax-canvas-container">
    <canvas
      ref="canvas"
      class="minimax-canvas"
      :width="500"
      :height="500"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  board: Array,
  player: String,
  bestMove: Object
})

const canvas = ref(null)

const drawBoard = () => {
  if (!canvas.value || !props.board) return

  const ctx = canvas.value.getContext("2d")
  const size = 500
  const cellSize = size / 3
  const padding = 50

  ctx.clearRect(0, 0, size, size)

  // Draw background
  ctx.fillStyle = "rgba(15, 23, 42, 0.5)"
  ctx.fillRect(0, 0, size, size)

  // Draw grid
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 3

  for (let i = 1; i < 3; i++) {
    // Vertical lines
    ctx.beginPath()
    ctx.moveTo(padding + i * cellSize, padding)
    ctx.lineTo(padding + i * cellSize, padding + size - 2 * padding)
    ctx.stroke()

    // Horizontal lines
    ctx.beginPath()
    ctx.moveTo(padding, padding + i * cellSize)
    ctx.lineTo(padding + size - 2 * padding, padding + i * cellSize)
    ctx.stroke()
  }

  // Draw X's and O's
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = padding + j * cellSize + cellSize / 2
      const y = padding + i * cellSize + cellSize / 2
      const symbol = props.board[i][j]

      if (symbol === 'X') {
        drawX(ctx, x, y, cellSize * 0.3)
      } else if (symbol === 'O') {
        drawO(ctx, x, y, cellSize * 0.3)
      }

      // Highlight best move
      if (props.bestMove && props.bestMove.row === i && props.bestMove.col === j) {
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 4
        ctx.strokeRect(
          padding + j * cellSize + 10,
          padding + i * cellSize + 10,
          cellSize - 20,
          cellSize - 20
        )
      }
    }
  }

  // Draw current player
  ctx.fillStyle = '#e0e7ff'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`Current: ${props.player || 'X'}`, size / 2, 30)
}

const drawX = (ctx, x, y, size) => {
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.moveTo(x - size, y - size)
  ctx.lineTo(x + size, y + size)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x + size, y - size)
  ctx.lineTo(x - size, y + size)
  ctx.stroke()
}

const drawO = (ctx, x, y, size) => {
  ctx.strokeStyle = '#3b82f6'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'

  ctx.beginPath()
  ctx.arc(x, y, size, 0, 2 * Math.PI)
  ctx.stroke()
}

watch(() => [props.board, props.player, props.bestMove], drawBoard, { deep: true })
onMounted(drawBoard)
</script>

<style scoped>
.minimax-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
}

.minimax-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
