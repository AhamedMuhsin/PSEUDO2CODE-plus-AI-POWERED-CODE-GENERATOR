<template>
  <div class="mapcoloring-canvas-container">
    <canvas
      ref="canvas"
      class="mapcoloring-canvas"
      :width="700"
      :height="600"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  regions: Object,
  adjacency: Object,
  currentRegion: String,
  conflicts: Array
})

const canvas = ref(null)

const regionPositions = {
  WA: { x: 150, y: 180, label: 'WA' },
  NT: { x: 300, y: 160, label: 'NT' },
  SA: { x: 300, y: 300, label: 'SA' },
  QLD: { x: 450, y: 200, label: 'QLD' },
  NSW: { x: 480, y: 350, label: 'NSW' },
  VIC: { x: 380, y: 420, label: 'VIC' },
  TAS: { x: 420, y: 530, label: 'TAS' }
}

const colorMap = {
  RED: '#ef4444',
  GREEN: '#22c55e',
  BLUE: '#3b82f6',
  YELLOW: '#fbbf24'
}

const drawVisualization = () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext("2d")
  const width = 700
  const height = 600

  ctx.clearRect(0, 0, width, height)

  // Background
  ctx.fillStyle = "rgba(15, 23, 42, 0.5)"
  ctx.fillRect(0, 0, width, height)

  // Title
  ctx.fillStyle = '#e0e7ff'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Australia Map Coloring', width / 2, 30)

  // Draw edges (adjacency)
  if (props.adjacency) {
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 3
    
    const drawn = new Set()
    Object.entries(props.adjacency).forEach(([region, neighbors]) => {
      neighbors.forEach(neighbor => {
        const key = [region, neighbor].sort().join('-')
        if (!drawn.has(key)) {
          drawn.add(key)
          const pos1 = regionPositions[region]
          const pos2 = regionPositions[neighbor]
          
          if (pos1 && pos2) {
            ctx.beginPath()
            ctx.moveTo(pos1.x, pos1.y)
            ctx.lineTo(pos2.x, pos2.y)
            ctx.stroke()
          }
        }
      })
    })
  }

  // Draw regions
  Object.entries(regionPositions).forEach(([region, pos]) => {
    const color = props.regions && props.regions[region] ? colorMap[props.regions[region]] : '#64748b'
    const isConflict = props.conflicts && props.conflicts.includes(region)
    const isCurrent = props.currentRegion === region

    // Region circle
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 35, 0, 2 * Math.PI)
    ctx.fill()

    // Border
    if (isCurrent) {
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 5
    } else if (isConflict) {
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 4
    } else {
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
    }
    ctx.stroke()

    // Highlight if current
    if (isCurrent) {
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 45, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Label
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(pos.label, pos.x, pos.y + 5)
  })

  // Legend
  const legendY = height - 80
  ctx.font = '14px Arial'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#e0e7ff'
  ctx.fillText('Colors:', 20, legendY)

  let legendX = 20
  Object.entries(colorMap).forEach(([name, color]) => {
    legendX += 80
    ctx.fillStyle = color
    ctx.fillRect(legendX, legendY - 12, 20, 20)
    ctx.fillStyle = '#e0e7ff'
    ctx.fillText(name, legendX + 25, legendY + 3)
  })
}

watch(() => [props.regions, props.currentRegion, props.conflicts], drawVisualization, { deep: true })
onMounted(drawVisualization)
</script>

<style scoped>
.mapcoloring-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
}

.mapcoloring-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
