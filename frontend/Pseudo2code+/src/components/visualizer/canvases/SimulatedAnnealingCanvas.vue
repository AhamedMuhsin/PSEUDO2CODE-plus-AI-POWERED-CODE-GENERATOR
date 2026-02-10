<template>
  <div class="annealing-canvas-container">
    <canvas
      ref="canvas"
      class="annealing-canvas"
      :width="700"
      :height="500"
    />
    <div class="temp-display" v-if="temperature">
      <span class="label">🌡️ Temperature:</span>
      <span class="value">{{ parseFloat(temperature).toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  currentState: Number,
  currentEnergy: [Number, String],
  temperature: [Number, String],
  history: Array,
  accepted: Boolean
})

const canvas = ref(null)

const objectiveFunction = (x) => {
  return (x - 5) ** 2
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
  
  const maxEnergy = 25
  for (let x = 0; x <= 10; x += 0.1) {
    const y = objectiveFunction(x)
    const canvasX = padding + (x / 10) * (width - 2 * padding)
    const canvasY = height - padding - ((maxEnergy - y) / maxEnergy) * (height - 2 * padding)
    
    if (x === 0) {
      ctx.moveTo(canvasX, canvasY)
    } else {
      ctx.lineTo(canvasX, canvasY)
    }
  }
  ctx.stroke()

  // Draw history
  if (props.history && props.history.length > 0) {
    props.history.forEach((h, index) => {
      const x = padding + (h.state / 10) * (width - 2 * padding)
      const energy = h.energy
      const y = height - padding - ((maxEnergy - energy) / maxEnergy) * (height - 2 * padding)

      // Point
      ctx.fillStyle = h.accepted ? '#22c55e' : '#ef4444'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Connect with line
      if (index > 0) {
        const prevH = props.history[index - 1]
        const prevX = padding + (prevH.state / 10) * (width - 2 * padding)
        const prevY = height - padding - ((maxEnergy - prevH.energy) / maxEnergy) * (height - 2 * padding)

        ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    })
  }

  // Draw current state
  if (props.currentState !== null && props.currentState !== undefined) {
    const x = padding + (props.currentState / 10) * (width - 2 * padding)
    const energy = parseFloat(props.currentEnergy) || objectiveFunction(props.currentState)
    const y = height - padding - ((maxEnergy - energy) / maxEnergy) * (height - 2 * padding)

    ctx.fillStyle = '#fbbf24'
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.shadowBlur = 0

    // Label
    ctx.fillStyle = '#e0e7ff'
    ctx.font = 'bold 14px Arial'
    ctx.fillText(`State: ${props.currentState}`, x - 30, y - 20)
    ctx.fillText(`Energy: ${energy.toFixed(2)}`, x - 35, y - 5)
  }

  // Labels
  ctx.fillStyle = '#e0e7ff'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('State', width / 2, height - 20)
  
  ctx.save()
  ctx.translate(20, height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('Energy (minimize)', 0, 0)
  ctx.restore()
}

watch(() => [props.currentState, props.currentEnergy, props.history], drawVisualization, { deep: true })
onMounted(drawVisualization)
</script>

<style scoped>
.annealing-canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  gap: 15px;
}

.annealing-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.temp-display {
  padding: 12px 24px;
  background: rgba(251, 113, 133, 0.1);
  border: 1px solid rgba(251, 113, 133, 0.3);
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.temp-display .label {
  color: #fb7185;
  font-weight: 600;
}

.temp-display .value {
  color: #fda4af;
  font-size: 1.3rem;
  font-weight: bold;
}
</style>
