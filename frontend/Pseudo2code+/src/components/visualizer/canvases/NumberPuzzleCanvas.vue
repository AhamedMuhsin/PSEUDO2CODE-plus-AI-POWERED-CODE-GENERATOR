<template>
  <div class="puzzle-canvas-container">
    <div class="puzzle-boards">
      <div class="puzzle-board">
        <h4>Current State</h4>
        <canvas
          ref="currentCanvas"
          class="puzzle-canvas"
          :width="350"
          :height="350"
        />
        <div class="puzzle-stats" v-if="cost !== undefined">
          <span>Cost (g): {{ cost }}</span>
          <span>Heuristic (h): {{ heuristic }}</span>
          <span>Total (f): {{ cost + heuristic }}</span>
        </div>
      </div>
      <div class="puzzle-board">
        <h4>Goal State</h4>
        <canvas
          ref="goalCanvas"
          class="puzzle-canvas"
          :width="350"
          :height="350"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  board: Array,
  goal: Array,
  cost: Number,
  heuristic: Number
})

const currentCanvas = ref(null)
const goalCanvas = ref(null)

const drawPuzzle = (canvas, board, highlightEmpty = true) => {
  if (!canvas || !board) return

  const ctx = canvas.getContext("2d")
  const size = 350
  const cellSize = size / 3
  const padding = 5

  ctx.clearRect(0, 0, size, size)

  // Draw background
  ctx.fillStyle = "rgba(10, 10, 10, 0.8)"
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const value = board[i][j]
      const x = j * cellSize
      const y = i * cellSize

      if (value === 0) {
        // Empty tile
        if (highlightEmpty) {
          ctx.fillStyle = 'rgba(99, 102, 241, 0.3)'
          ctx.fillRect(x + padding, y + padding, cellSize - 2 * padding, cellSize - 2 * padding)
        }
      } else {
        // Number tile
        ctx.fillStyle = '#6366f1'
        ctx.fillRect(x + padding, y + padding, cellSize - 2 * padding, cellSize - 2 * padding)

        // Number
        ctx.fillStyle = 'white'
        ctx.font = 'bold 48px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(value, x + cellSize / 2, y + cellSize / 2)
      }

      // Border
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 2
      ctx.strokeRect(x + padding, y + padding, cellSize - 2 * padding, cellSize - 2 * padding)
    }
  }
}

const redraw = () => {
  if (currentCanvas.value && props.board) {
    drawPuzzle(currentCanvas.value, props.board, true)
  }
  if (goalCanvas.value && props.goal) {
    drawPuzzle(goalCanvas.value, props.goal, false)
  }
}

watch(() => [props.board, props.goal], redraw, { deep: true })
onMounted(redraw)
</script>

<style scoped>
.puzzle-canvas-container {
  padding: 20px;
  background: var(--bg-elevated);
  border-radius: 12px;
}

.puzzle-boards {
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: flex-start;
}

.puzzle-board {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.puzzle-board h4 {
  color: var(--accent-lighter);
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.puzzle-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.puzzle-stats {
  display: flex;
  gap: 15px;
  margin-top: 12px;
  padding: 10px;
  background: var(--bg-hover);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--accent-lighter);
}

.puzzle-stats span {
  font-weight: 500;
}

@media (max-width: 768px) {
  .puzzle-boards {
    flex-direction: column;
  }
}
</style>
