<template>
  <div class="hanoi-canvas-container">
    <canvas
      ref="canvas"
      class="hanoi-canvas"
      :width="800"
      :height="400"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  towers: Object,
  moveFrom: String,
  moveTo: String,
  disk: Number
})

const canvas = ref(null)

const colors = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

const drawTowers = () => {
  if (!canvas.value || !props.towers) return

  const ctx = canvas.value.getContext("2d")
  const width = 800
  const height = 400
  const rodSpacing = width / 4
  const baseY = height - 50

  ctx.clearRect(0, 0, width, height)

  // Draw background
  ctx.fillStyle = "rgba(10, 10, 10, 0.5)"
  ctx.fillRect(0, 0, width, height)

  // Draw base
  ctx.fillStyle = '#475569'
  ctx.fillRect(0, baseY + 40, width, 10)

  const rods = ['A', 'B', 'C']
  rods.forEach((rod, rodIndex) => {
    const x = rodSpacing * (rodIndex + 1)

    // Draw rod
    ctx.fillStyle = '#64748b'
    ctx.fillRect(x - 5, baseY - 200, 10, 200)

    // Draw rod label
    ctx.fillStyle = '#e0e7ff'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(rod, x, baseY + 30)

    // Highlight if involved in move
    if (props.moveFrom === rod || props.moveTo === rod) {
      ctx.strokeStyle = props.moveFrom === rod ? '#f59e0b' : '#22c55e'
      ctx.lineWidth = 3
      ctx.strokeRect(x - 80, baseY - 210, 160, 250)
    }

    // Draw disks
    const disks = props.towers[rod] || []
    disks.forEach((diskSize, index) => {
      const diskWidth = diskSize * 25 + 30
      const diskHeight = 20
      const diskY = baseY - (index + 1) * (diskHeight + 5)
      const diskX = x - diskWidth / 2

      // Highlight moving disk
      if (props.disk === diskSize && props.moveFrom === rod) {
        ctx.shadowColor = '#fbbf24'
        ctx.shadowBlur = 15
      }

      ctx.fillStyle = colors[(diskSize - 1) % colors.length]
      ctx.fillRect(diskX, diskY, diskWidth, diskHeight)
      
      // Draw disk label
      ctx.shadowBlur = 0
      ctx.fillStyle = 'white'
      ctx.font = 'bold 14px Arial'
      ctx.fillText(diskSize, x, diskY + diskHeight / 2 + 5)
    })
  })
}

watch(() => [props.towers, props.moveFrom, props.moveTo], drawTowers, { deep: true })
onMounted(drawTowers)
</script>

<style scoped>
.hanoi-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: var(--bg-elevated);
  border-radius: 12px;
}

.hanoi-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
