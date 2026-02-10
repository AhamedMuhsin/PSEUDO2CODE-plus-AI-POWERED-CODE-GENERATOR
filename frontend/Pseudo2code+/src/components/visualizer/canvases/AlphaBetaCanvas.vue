<template>
  <div class="alphabeta-canvas-container">
    <div class="canvas-wrapper">
      <canvas
        ref="canvas"
        class="alphabeta-canvas"
        :width="500"
        :height="600"
      />
      <div class="alpha-beta-values">
        <div class="value-box">
          <span class="label">α (Alpha):</span>
          <span class="value">{{ alpha }}</span>
        </div>
        <div class="value-box">
          <span class="label">β (Beta):</span>
          <span class="value">{{ beta }}</span>
        </div>
        <div v-if="pruned" class="pruned-indicator">
          ✂️ Branch Pruned!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  board: Array,
  alpha: Number,
  beta: Number,
  player: String,
  pruned: Boolean
})

const canvas = ref(null)

const drawBoard = () => {
  if (!canvas.value || !props.board) return

  const ctx = canvas.value.getContext("2d")
  const size = 500
  const treeY = 450
  const cellSize = size / 3
  const padding = 50

  ctx.clearRect(0, 0, 500, 600)

  // Draw background
  ctx.fillStyle = "rgba(15, 23, 42, 0.5)"
  ctx.fillRect(0, 0, 500, 600)

  // Draw Tic-Tac-Toe board
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 3

  for (let i = 1; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(padding + i * cellSize, padding)
    ctx.lineTo(padding + i * cellSize, padding + size - 2 * padding)
    ctx.stroke()

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
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 8
        ctx.lineCap = 'round'

        ctx.beginPath()
        ctx.moveTo(x - 40, y - 40)
        ctx.lineTo(x + 40, y + 40)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x + 40, y - 40)
        ctx.lineTo(x - 40, y + 40)
        ctx.stroke()
      } else if (symbol === 'O') {
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.arc(x, y, 40, 0, 2 * Math.PI)
        ctx.stroke()
      }
    }
  }

  // Draw pruning indicator
  if (props.pruned) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'
    ctx.fillRect(0, treeY, 500, 150)

    ctx.fillStyle = '#ef4444'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('✂️ Pruned Branch', 250, treeY + 75)
  }
}

watch(() => [props.board, props.alpha, props.beta, props.pruned], drawBoard, { deep: true })
onMounted(drawBoard)
</script>

<style scoped>
.alphabeta-canvas-container {
  padding: 20px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
}

.canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.alphabeta-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.alpha-beta-values {
  display: flex;
  gap: 20px;
  align-items: center;
}

.value-box {
  padding: 12px 24px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.value-box .label {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.value-box .value {
  color: #e0e7ff;
  font-size: 1.5rem;
  font-weight: bold;
}

.pruned-indicator {
  padding: 12px 24px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  color: #fca5a5;
  font-weight: bold;
  font-size: 1.1rem;
}
</style>
