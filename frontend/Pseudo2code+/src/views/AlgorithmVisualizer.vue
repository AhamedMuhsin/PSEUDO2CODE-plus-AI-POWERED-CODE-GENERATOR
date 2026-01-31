<template>
  <div class="visualizer-page">
    <h2>Bubble Sort</h2>

    <ArrayCanvas :state="currentStep" />

    <div class="controls">
      <button @click="prev">Prev</button>
      <button @click="toggle">
        {{ playing ? 'Pause' : 'Play' }}
      </button>
      <button @click="next">Next</button>
      <button @click="reset">Reset</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue"
import { bubbleSortSteps } from "@/algorithms/sorting/bubbleSort"
import ArrayCanvas from "@/components/visualizer/canvases/ArrayCanvas.vue"

const steps = bubbleSortSteps([5, 3, 8, 4, 2])
const index = ref(0)
const playing = ref(false)
let timer = null

const currentStep = computed(() => steps[index.value])

function next() {
  if (index.value < steps.length - 1) index.value++
}

function prev() {
  if (index.value > 0) index.value--
}

function reset() {
  index.value = 0
  playing.value = false
  clearInterval(timer)
}

function toggle() {
  playing.value = !playing.value

  if (playing.value) {
    timer = setInterval(() => {
      if (index.value < steps.length - 1) {
        index.value++
      } else {
        playing.value = false
        clearInterval(timer)
      }
    }, 600)
  } else {
    clearInterval(timer)
  }
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.visualizer-page {
  padding: 32px;
}

.controls {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
</style>
