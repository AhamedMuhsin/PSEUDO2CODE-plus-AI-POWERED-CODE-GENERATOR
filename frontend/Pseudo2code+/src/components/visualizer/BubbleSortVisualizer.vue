<template>
    <AuthNavbar />
    <main class="visualizer-page">
        <div class="container">

            <!-- HEADER -->
            <div class="back" @click="router.push('/algorithm-hub')">
                <img :src="arrowLeft" class="arrow" />
                Back
            </div>
            <!-- <button class="back" @click="$router.push('/algorithm-hub')">
                ← Back
            </button> -->
            <header class="visualizer-header">
                <div>
                    <h1>Bubble Sort</h1>
                    <p>
                        Repeatedly compares adjacent elements and swaps them if they
                        are in the wrong order.
                    </p>
                </div>
            </header>
            <!-- ARRAY INPUT CONTROLS -->
            <section class="array-input">
                <button class="btn ghost" @click="generateRandom">
                    Random Array
                </button>

                <input type="text" v-model="customInput" placeholder="Custom array (press enter): 5,2,8,1 "
                    @keydown.enter="applyCustomArray" />
            </section>

            <!-- CONTROLS -->
            <section class="controls">
                <button class="btn ghost" @click="prev">Prev</button>
                <button class="btn primary" @click="playing ? pause() : play()">
                    {{ playing ? 'Pause' : 'Play' }}
                </button>
                <button class="btn ghost" @click="next">Next</button>
                <button class="btn danger" @click="reset">Reset</button>


                <div class="speed">
                    <label>Speed</label>
                    <input type="range" min="200" max="1500" step="100" v-model="speed" />
                </div>
            </section>

            <!-- VISUALIZATION CANVAS -->
            <section class="canvas">
                <ArrayCanvas v-if="currentStep" :array="currentStep.array" :active="currentStep.active"
                    :swap="currentStep.swap" :max="maxValue"/>
            </section>


            <!-- STEP EXPLANATION -->
            <section class="explanation">
                <h3>Step Explanation</h3>
                <p>
                    {{ currentStep?.explanation }}
                </p>
            </section>
        </div>
    </main>
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue';
import arrowLeft from "@/assets/arrow-left.svg";
import { useRouter } from "vue-router";
import { ref, watch, computed } from 'vue'
import ArrayCanvas from './canvases/ArrayCanvas.vue'
import { generateBubbleSortSteps } from '@/algorithms/sorting/bubbleSortSteps'
const router = useRouter();
const steps = ref([])
const stepIndex = ref(0)
const playing = ref(false)
const customInput = ref('')
const speed = ref(800)

const randomArray = () =>
    Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1)

const baseArray = ref(randomArray())
steps.value = generateBubbleSortSteps(baseArray.value)

const currentStep = computed(() => steps.value[stepIndex.value])

const maxValue = computed(() =>
  Math.max(...currentStep.value.array)
)

let timer = null

function play() {
    if (playing.value) return
    playing.value = true

    timer = setInterval(() => {
        if (stepIndex.value < steps.value.length - 1) {
            stepIndex.value++
        } else {
            pause()
        }
    }, speed.value)
}

function pause() {
    playing.value = false
    clearInterval(timer)
}

function next() {
    pause()
    if (stepIndex.value < steps.value.length - 1) stepIndex.value++
}

function prev() {
    pause()
    if (stepIndex.value > 0) stepIndex.value--
}

function reset() {
    pause()
    baseArray.value = randomArray()
    steps.value = generateBubbleSortSteps(baseArray.value)
    stepIndex.value = 0
}

watch(speed, () => {
    if (playing.value) {
        pause()
        play()
    }
})

function generateRandom() {
    pause()
    baseArray.value = randomArray()
    steps.value = generateBubbleSortSteps(baseArray.value)
    stepIndex.value = 0
}

function applyCustomArray() {
  const arr = customInput.value
    .split(',')
    .map(n => Number(n.trim()))
    .filter(n => !isNaN(n))

  if (arr.length < 2) {
    alert('Please enter at least 2 numbers')
    return
  }

  pause()
  baseArray.value = arr
  steps.value = generateBubbleSortSteps(arr)
  stepIndex.value = 0
}
</script>

<style scoped>
.visualizer-page {
    min-height: 100vh;
    background: radial-gradient(circle at top, #0f172a, #020617);
    padding: 40px 24px;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
}

/* HEADER */
.visualizer-header {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 32px;
}

/* .back {
    background: transparent;
    border: none;
    color: #c7d2fe;
    cursor: pointer;
    font-size: 0.9rem;
} */

.visualizer-header h1 {
    font-size: 2rem;
    margin-bottom: 6px;
}

.array-input {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
}

.array-input input {
    flex: 1;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
}

.visualizer-header p {
    color: #94a3b8;
}

/* CONTROLS */
.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-bottom: 28px;
}

.btn {
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
}

.btn.primary {
    background: #6366f1;
    color: white;
}

.btn.ghost {
    background: rgba(255, 255, 255, 0.08);
    color: white;
}

.btn.danger {
    background: #ef4444;
    color: white;
}

.speed {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #cbd5f5;
}

/* CANVAS */
.canvas {
    background: rgba(15, 23, 42, 0.85);
    border-radius: 16px;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    margin-bottom: 28px;
}

.bars {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    height: 260px;
}

.bar {
    flex: 1;
    background: #6366f1;
    border-radius: 8px 8px 0 0;
    color: white;
    font-size: 0.75rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 6px;
}

/* EXPLANATION */
.explanation {
    background: rgba(15, 23, 42, 0.85);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
}

.explanation h3 {
    margin-bottom: 6px;
}

.explanation p {
    color: #94a3b8;
}

.back {
    position: absolute;
    top: 105px;
    left: 32px;
    display: flex;
    gap: 8px;
    cursor: pointer;
    opacity: 0.8;
}

.arrow {
    width: 18px;
}

/* RESPONSIVE */
@media (max-width: 640px) {
    .visualizer-header {
        flex-direction: column;
    }

    .speed {
        margin-left: 0;
    }
}
</style>
