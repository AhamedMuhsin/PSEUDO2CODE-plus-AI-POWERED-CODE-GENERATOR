<template>
  <div class="missionaries-canvas-container">
    <canvas
      ref="canvas"
      class="missionaries-canvas"
      :width="800"
      :height="400"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  missionariesLeft: Number,
  cannibalsLeft: Number,
  missionariesRight: Number,
  cannibalsRight: Number,
  boatSide: String
})

const canvas = ref(null)

const drawScene = () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext("2d")
  const width = 800
  const height = 400

  ctx.clearRect(0, 0, width, height)

  // Draw background
  ctx.fillStyle = "rgba(10, 10, 10, 0.5)"
  ctx.fillRect(0, 0, width, height)

  // Draw river
  ctx.fillStyle = '#3b82f6'
  ctx.globalAlpha = 0.3
  ctx.fillRect(width * 0.35, 0, width * 0.3, height)
  ctx.globalAlpha = 1.0

  // Draw banks
  ctx.fillStyle = '#22c55e'
  ctx.globalAlpha = 0.2
  ctx.fillRect(0, height - 60, width * 0.35, 60)
  ctx.fillRect(width * 0.65, height - 60, width * 0.35, 60)
  ctx.globalAlpha = 1.0

  // Draw left bank label
  ctx.fillStyle = '#e0e7ff'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Left Bank', width * 0.175, 30)

  // Draw right bank label
  ctx.fillText('Right Bank', width * 0.825, 30)

  // Draw people on left bank
  drawPeople(ctx, 50, 150, props.missionariesLeft || 0, props.cannibalsLeft || 0, 'left')

  // Draw people on right bank
  drawPeople(ctx, 550, 150, props.missionariesRight || 0, props.cannibalsRight || 0, 'right')

  // Draw boat
  const boatX = props.boatSide === 'left' ? width * 0.3 : width * 0.6
  drawBoat(ctx, boatX, height / 2)

  // Draw status
  const leftValid = checkValid(props.missionariesLeft, props.cannibalsLeft)
  const rightValid = checkValid(props.missionariesRight, props.cannibalsRight)

  ctx.font = '16px Arial'
  ctx.fillStyle = leftValid ? '#22c55e' : '#ef4444'
  ctx.fillText(leftValid ? '✓ Safe' : '✗ Unsafe', width * 0.175, 350)

  ctx.fillStyle =rightValid ? '#22c55e' : '#ef4444'
  ctx.fillText(rightValid ? '✓ Safe' : '✗ Unsafe', width * 0.825, 350)
}

const checkValid = (m, c) => {
  if (m === 0 || c === 0) return true
  return m >= c
}

const drawPeople = (ctx, startX, startY, missionaries, cannibals, side) => {
  const spacing = 40
  
  // Draw missionaries (blue)
  for (let i = 0; i < missionaries; i++) {
    const x = startX + (i % 3) * spacing
    const y = startY + Math.floor(i / 3) * spacing
    drawPerson(ctx, x, y, '#3b82f6', 'M')
  }

  // Draw cannibals (red)
  for (let i = 0; i < cannibals; i++) {
    const x = startX + (i % 3) * spacing
    const y = startY + 80 + Math.floor(i / 3) * spacing
    drawPerson(ctx, x, y, '#ef4444', 'C')
  }
}

const drawPerson = (ctx, x, y, color, label) => {
  // Head
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, 12, 0, 2 * Math.PI)
  ctx.fill()

  // Body
  ctx.fillRect(x - 8, y + 12, 16, 20)

  // Label
  ctx.fillStyle = 'white'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(label, x, y + 5)
}

const drawBoat = (ctx, x, y) => {
  ctx.fillStyle = '#a16207'
  ctx.beginPath()
  ctx.ellipse(x, y, 50, 25, 0, 0, 2 * Math.PI)
  ctx.fill()

  ctx.strokeStyle = '#713f12'
  ctx.lineWidth = 2
  ctx.stroke()

  // Boat label
  ctx.fillStyle = '#fef3c7'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('🚣', x, y + 5)
}

watch(() => [props.missionariesLeft, props.cannibalsLeft, props.boatSide], drawScene, { deep: true })
onMounted(drawScene)
</script>

<style scoped>
.missionaries-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: var(--bg-elevated);
  border-radius: 12px;
}

.missionaries-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
