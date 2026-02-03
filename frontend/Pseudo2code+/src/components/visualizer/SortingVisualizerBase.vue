<template>
    <main class="visualizer-page">
        <div class="container">
            <!-- BACK -->
            <div class="back" @click="router.push('/algorithm-hub')">
                <img :src="arrowLeft" class="arrow" />
                Back
            </div>
            <!-- HEADER -->
            <header class="visualizer-header">
                <h1>{{ title }}</h1>
                <p>{{ description }}</p>
                <div v-if="meta" class="algo-badges">
                    <span class="badge">Time: {{ meta.time }}</span>
                    <span class="badge">Space: {{ meta.space }}</span>
                    <span class="badge" :class="meta.stable ? 'stable' : 'unstable'">
                        {{ meta.stable ? 'Stable' : 'Unstable' }}
                    </span>
                </div>
            </header>

            <!-- ARRAY INPUT -->
            <section class="array-input">
                <button class="btn ghost" @click="generateRandom">
                    Random Array
                </button>

                <input v-model="customInput" placeholder="Custom array (Press Enter) : 5,2,8,1"
                    @keydown.enter="applyCustomArray" />
                <button class="btn ghost" @click="goToGenerateCode">
                    Generate Code
                </button>

            </section>

            <!-- CONTROLS -->
            <section class="controls">
                <button class="btn ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
                <button class="btn primary" @click="playing ? pause() : play()">
                    {{ playing ? 'Pause' : 'Play' }}
                </button>
                <button class="btn ghost" @click="next" :disabled="stepIndex === steps.length - 1">Next</button>
                <button class="btn danger" @click="reset">Reset</button>

                <div class="step-counter">
                    Step {{ currentStepNumber }} / {{ totalSteps }}
                </div>

                <div class="speed">
                    <label>Speed</label>
                    <input type="range" min="200" max="1200" step="200" v-model="speed" />
                </div>
            </section>

            <!-- CANVAS -->
            <section class="canvas">
                <ArrayCanvas :array="currentStep.array" :active="currentStep.active" :swap="currentStep.swap"
                    :sorted="currentStep.sorted || []" :range="currentStep.range || null"
                    :pivot="currentStep.pivot ?? null" :max="maxValue" />
                <div class="canvas-legend">
                    <div class="legend-item">
                        <span class="dot normal"></span>
                        <span>Unsorted</span>
                    </div>
                    <div class="legend-item">
                        <span class="dot active"></span>
                        <span>Comparing</span>
                    </div>
                    <div class="legend-item">
                        <span class="dot swap"></span>
                        <span>Swapping</span>
                    </div>
                    <div class="legend-item">
                        <span class="dot sorted"></span>
                        <span>Sorted</span>
                    </div>
                    <div class="legend-item">
                        <span class="dot pivot"></span>
                        <span>Pivot</span>
                    </div>
                </div>
            </section>
            <section class="pseudo-section">
                <PseudoCodePanel :code="pseudoCode" :activeLine="currentStep.codeLine" />
            </section>

            <!-- EXPLANATION -->
            <section class="explanation">
                <h3>Step Explanation</h3>
                <p>{{ currentStep.explanation }}</p>
            </section>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import arrowLeft from "@/assets/arrow-left.svg";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router"
const router = useRouter();
import PseudoCodePanel from './PseudoCodePanel.vue'
import ArrayCanvas from './canvases/ArrayCanvas.vue'
import { sortingMeta } from "@/algorithms/sorting/sortingMeta"

const props = defineProps({
    title: String,
    description: String,
    generateSteps: Function,
    pseudoCode: Array,
    algorithmName: String,
})

const randomArray = () =>
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 99) + 1)


const route = useRoute()
const algorithmKey = computed(() => route.params.algorithm)
const meta = computed(() => sortingMeta[algorithmKey.value])
const baseArray = ref(randomArray())
const steps = ref(props.generateSteps(baseArray.value))
const stepIndex = ref(0)
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const playing = ref(false)
const speed = ref(800)
const customInput = ref('')
const currentStep = computed(() =>
    steps.value[stepIndex.value] || { array: [], active: [], swap: false, explanation: '' }
)
const maxValue = computed(() =>
    currentStep.value.array.length
        ? Math.max(...currentStep.value.array)
        : 1
)

let timer = null

function play() {
    if (playing.value) return
    playing.value = true
    timer = setInterval(() => {
        if (stepIndex.value < steps.value.length - 1) stepIndex.value++
        else pause()
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
    steps.value = props.generateSteps(baseArray.value)
    stepIndex.value = 0
}

function generateRandom() {
    reset()
    customInput.value = ''
}

function applyCustomArray() {
    const arr = customInput.value
        .split(',')
        .map(n => Number(n.trim()))
        .filter(n => !isNaN(n))

    if (arr.length < 2) return

    pause()
    baseArray.value = arr
    steps.value = props.generateSteps(arr)
    stepIndex.value = 0
}

watch(speed, () => {
    if (playing.value) {
        pause()
        play()
    }
})

function goToGenerateCode() {
  const prompt = `Write a program for the ${props.algorithmName} algorithm. 
Take a random input array.`

  router.push({
    path: '/generate-code',
    query: { prompt }
  })
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
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 32px;
    max-width: 720px;
}

.canvas {
    position: relative;
}

/* Legend container */
.canvas-legend {
    position: absolute;
    top: 15px;
    right: 10px;
    display: flex;
    gap: 14px;
    padding: 8px 12px;
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    font-size: 0.75rem;
    color: #e5e7eb;
}

/* Legend item */
.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* Dots */
.dot {
    width: 10px;
    height: 10px;
    border-radius: 3px;
}

.dot.normal {
    background: #6366f1;
}

.dot.active {
    background: #22c55e;
}

.dot.swap {
    background: #ef4444;
}

.dot.sorted {
    background: rgba(255, 255, 255, 0.5);
}

.dot.pivot {
    background: #a855f7;
    /* purple */
}


/* .back {
    background: transparent;
    border: none;
    color: #c7d2fe;
    cursor: pointer;
    font-size: 0.9rem;
} */
.pseudo-section {
    margin-top: 24px;
    margin-bottom: 24px;
}

.visualizer-header h1 {
    font-size: 2rem;
    margin-bottom: 6px;
}

.array-input {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    max-width: 820px;
}

.array-input input {
    flex: 1;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
}

.visualizer-header p {
    color: #94a3b8;
    font-size: 0.95rem;
    line-height: 1.5;
}

/* CONTROLS */
.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-bottom: 28px;
    padding-top: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
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

.btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn.danger {
    background: #ef4444;
    color: white;
}

.step-counter {
    margin-left: 16px;
    font-size: 0.85rem;
    color: #cbd5f5;
    opacity: 0.85;
    white-space: nowrap;
}

.speed {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
}

.algo-badges {
    display: flex;
    gap: 10px;
    margin-top: 8px;
    flex-wrap: wrap;
}

.badge {
    font-size: 0.75rem;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: #e5e7eb;
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.badge.stable {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    border-color: rgba(34, 197, 94, 0.3);
}

.badge.unstable {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
}

/* CANVAS */
.canvas {
    background: rgba(15, 23, 42, 0.85);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    margin-bottom: 28px;
}

.bars {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    height: 240px;
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
    top: 92px;
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
