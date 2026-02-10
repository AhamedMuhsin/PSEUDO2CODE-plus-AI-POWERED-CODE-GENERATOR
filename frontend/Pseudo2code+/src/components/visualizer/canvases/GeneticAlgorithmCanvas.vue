<template>
  <div class="genetic-canvas-container">
    <canvas
      ref="canvas"
      class="genetic-canvas"
      :width="800"
      :height="600"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"

const props = defineProps({
  population: Array,
  generation: Number,
  bestFitness: [Number, String],
  avgFitness: [Number, String]
})

const canvas = ref(null)

const drawVisualization = () => {
  if (!canvas.value) return

  const ctx = canvas.value.getContext("2d")
  const width = 800
  const height = 600

  ctx.clearRect(0, 0, width, height)

  // Background
  ctx.fillStyle = "rgba(15, 23, 42, 0.5)"
  ctx.fillRect(0, 0, width, height)

  // Title
  ctx.fillStyle = '#e0e7ff'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`Generation ${props.generation || 0}`, width / 2, 30)

  // Statistics
  if (props.bestFitness !== undefined && props.avgFitness !== undefined) {
    ctx.font = '16px Arial'
    ctx.fillText(`Best Fitness: ${parseFloat(props.bestFitness).toFixed(2)} | Avg Fitness: ${parseFloat(props.avgFitness).toFixed(2)}`, width / 2, 55)
  }

  // Draw population
  if (props.population && props.population.length > 0) {
    const startY = 100
    const rowHeight = 70
    const cellWidth = 25
    const cellHeight = 25

    props.population.slice(0, 6).forEach((individual, idx) => {
      const y = startY + idx * rowHeight

      // Individual label
      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(`Individual ${idx + 1}`, 30, y + 10)

      // Chromosome
      const chromosomeX = 150
      if (individual.chromosome && Array.isArray(individual.chromosome)) {
        individual.chromosome.forEach((gene, geneIdx) => {
          const x = chromosomeX + geneIdx * (cellWidth + 2)

          // Gene cell
          const geneValue = parseInt(gene)
          const brightness = geneValue ? 100 + (geneValue / 9) * 155 : 50
          ctx.fillStyle = `rgb(${brightness}, ${brightness / 2}, ${255 - brightness})`
          ctx.fillRect(x, y - 5, cellWidth, cellHeight)

          // Gene value
          ctx.strokeStyle = '#1e293b'
          ctx.lineWidth = 1
          ctx.strokeRect(x, y - 5, cellWidth, cellHeight)

          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 12px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(gene, x + cellWidth / 2, y + 13)
        })
      }

      // Fitness
      ctx.fillStyle = '#e0e7ff'
      ctx.font = '14px Arial'
      ctx.textAlign = 'left'
      const fitnessText = individual.fitness !== undefined ? individual.fitness.toFixed(2) : 'N/A'
      ctx.fillText(`Fitness: ${fitnessText}`, chromosomeX + 250, y + 10)

      // Fitness bar
      if (individual.fitness !== undefined) {
        const barWidth = Math.min(150, (individual.fitness / 100) * 150)
        const barX = chromosomeX + 350
        
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)'
        ctx.fillRect(barX, y - 5, 150, cellHeight)
        
        const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0)
        gradient.addColorStop(0, '#22c55e')
        gradient.addColorStop(1, '#3b82f6')
        ctx.fillStyle = gradient
        ctx.fillRect(barX, y - 5, barWidth, cellHeight)
        
        ctx.strokeStyle = '#475569'
        ctx.lineWidth = 1
        ctx.strokeRect(barX, y - 5, 150, cellHeight)
      }
    })
  } else {
    ctx.fillStyle = '#64748b'
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Initializing population...', width / 2, height / 2)
  }

  // Legend
  ctx.fillStyle = '#94a3b8'
  ctx.font = '12px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('🧬 Chromosome (genes 0-9) | 📊 Fitness Score (0-100)', 30, height - 20)
}

watch(() => [props.population, props.generation, props.bestFitness, props.avgFitness], drawVisualization, { deep: true })
onMounted(drawVisualization)
</script>

<style scoped>
.genetic-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
}

.genetic-canvas {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
