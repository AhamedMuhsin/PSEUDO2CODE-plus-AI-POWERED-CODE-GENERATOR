<template>
  <div class="hillclimbing-canvas-container">
    <canvas
      ref="canvas"
      class="hillclimbing-canvas"
      :width="700"
      :height="500"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  currentState: Number,
  currentValue: [Number, String],
  neighbors: Array,
  stateHistory: Array
})

const canvas = ref(null)

const objectiveFunction = (x) => {
  return -((x - 5) ** 2) + 25
}

const drawVisualization = () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext("2d")
  const width = 700
  const height = 500
  const padding = 60

  ctx.clearRect(0, 0, width, height)

  // Background
  ctx.fillStyle = "rgba(15, 23, 42, 0.5)"
  ctx.fillRect(0, 0, width, height)

  // Draw axes
  ctx.strokeStyle = '#64748b'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.stroke()

  // Draw function curve
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 3
  ctx.beginPath()
  
  for (let x = 0; x <= 10; x += 0.1) {
    const y = objectiveFunction(x)
    const canvasX = padding + (x / 10) * (width - 2 * padding)
    const canvasY = height - padding - (y / 25) * (height - 2 * padding)
    
    if (x === 0) {
      ctx.moveTo(canvasX, canvasY)
    } else {
      ctx.lineTo(canvasX, canvasY)
    }
  }
  ctx.stroke()

  // Draw history path
  if (props.stateHistory && props.stateHistory.length > 0) {
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()

    props.stateHistory.forEach((h, index) => {
      const x = padding + (h.state / 10) * (width - 2 * padding)
      const y = height - padding - (h.value / 25) * (height - 2 * padding)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
    ctx.stroke()
    ctx.setLineDash([])
  }

  // Draw current state
  if (props.currentState !== null && props.currentState !== undefined) {
    const x = padding + (props.currentState / 10) * (width - 2 * padding)
    const value = parseFloat(props.currentValue) || objectiveFunction(props.currentState)
    const y = height - padding - (value / 25) * (height - 2 * padding)

    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, 12, 0, 2 * Math.PI)
    ctx.stroke()

    // Label
    ctx.fillStyle = '#e0e7ff'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(`State: ${props.currentState}`, x - 30, y - 20)
    ctx.fillText(`Value: ${value.toFixed(2)}`, x - 30, y - 5)
  }

  // Draw neighbors
  if (props.neighbors && props.neighbors.length > 0) {
    props.neighbors.forEach(neighbor => {
      const x = padding + (neighbor.state / 10) * (width - 2 * padding)
      const value = parseFloat(neighbor.value) || objectiveFunction(neighbor.state)
      const y = height - padding - (value / 25) * (height - 2 * padding)

      ctx.fillStyle = '#818cf8'
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  // Labels
  ctx.fillStyle = '#e0e7ff'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('State', width / 2, height - 20)
  
  ctx.save()
  ctx.translate(20, height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('Value', 0, 0)
  ctx.restore()
}

watch(() => [props.currentState, props.currentValue, props.neighbors, props.stateHistory], drawVisualization, { deep: true })
onMounted(drawVisualization)
</script>

<style scoped>
.hillclimbing-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
}

.hillclimbing-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
