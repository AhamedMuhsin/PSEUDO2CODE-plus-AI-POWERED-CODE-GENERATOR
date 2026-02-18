<template>
    <main class="visualizer-page">
        <div class="container-compact">
            <!-- BACK -->
            <div class="top-section-compact">
                <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
                    <img :src="arrowLeft" class="arrow" />
                    Back
                </button>
            </div>
            
            <!-- HEADER -->
            <header class="page-header-compact">
                <div class="header-content">
                    <div class="operation-title-group-compact">
                        <h1>{{ title }}</h1>
                        <button v-if="meta" class="info-btn-compact" @click="showInfo = true"><Info :size="16" /></button>
                    </div>
                    <p class="operation-desc-compact">{{ description }}</p>
                    <div v-if="meta" class="algo-badges-compact">
                        <span class="badge-compact">Best: {{ meta.best }}</span>
                        <span class="badge-compact">Avg: {{ meta.average }}</span>
                        <span class="badge-compact">Worst: {{ meta.worst }}</span>
                        <span class="badge-compact">Space: {{ meta.space }}</span>
                        <span class="badge-compact" :class="meta.stable ? 'stable' : 'unstable'">
                            {{ meta.stable ? 'Stable' : 'Unstable' }}
                        </span>
                    </div>
                </div>
            </header>

            <!-- TWO COLUMN LAYOUT -->
            <div class="two-column-layout">
                <!-- LEFT COLUMN -->
                <div class="left-column">
                    <!-- ARRAY INPUT -->
                    <section class="array-input-compact">
                        <div class="input-row-compact">
                            <button class="btn-compact ghost" @click="generateRandom">
                                Random
                            </button>
                            <input v-model="customInput" placeholder="5,2,8,1"
                                @keydown.enter="applyCustomArray" class="custom-input-compact" />
                            <button class="btn-compact ghost" @click="goToGenerateCode">
                                Code
                            </button>
                        </div>
                    </section>

                    <!-- CONTROLS -->
                    <section class="controls-compact">
                        <button class="btn-compact ghost" @click="prev" :disabled="stepIndex === 0">Prev</button>
                        <button class="btn-compact primary" @click="playing ? pause() : play()">
                            {{ playing ? 'Pause' : 'Play' }}
                        </button>
                        <button class="btn-compact ghost" @click="next" :disabled="stepIndex === steps.length - 1">Next</button>
                        <button class="btn-compact danger" @click="reset">Reset</button>
                        <div class="step-counter-compact">{{ currentStepNumber }}/{{ totalSteps }}</div>
                        <div class="speed-compact">
                            <label>Speed</label>
                            <input type="range" min="1" max="5" step="1" v-model="speedLevel" class="speed-slider" />
                        </div>
                    </section>
                    
                    <!-- CANVAS -->
                    <section class="canvas-compact">
                        <ArrayCanvas :array="currentStep.array" :active="currentStep.active" :swap="currentStep.swap"
                            :sorted="currentStep.sorted || []" :range="currentStep.range || null"
                            :pivot="currentStep.pivot ?? null" :max="maxValue" />
                        <div class="canvas-legend-compact">
                            <div class="legend-item-compact">
                                <span class="dot normal"></span>
                                <span>Unsorted</span>
                            </div>
                            <div class="legend-item-compact">
                                <span class="dot active"></span>
                                <span>Comparing</span>
                            </div>
                            <div class="legend-item-compact">
                                <span class="dot swap"></span>
                                <span>Swapping</span>
                            </div>
                            <div class="legend-item-compact">
                                <span class="dot sorted"></span>
                                <span>Sorted</span>
                            </div>
                            <div class="legend-item-compact">
                                <span class="dot pivot"></span>
                                <span>Pivot</span>
                            </div>
                        </div>
                    </section>
                </div>
                
                <!-- RIGHT COLUMN -->
                <div class="right-column">
                    <section class="pseudo-section-compact">
                        <h3 class="section-title-compact">Pseudocode</h3>
                        <div class="pseudo-scroll">
                            <PseudoCodePanel :code="pseudoCode" :activeLine="currentStep.codeLine" />
                        </div>
                    </section>

                    <!-- EXPLANATION -->
                    <section class="explanation-compact">
                        <h3 class="section-title-compact">Explanation</h3>
                        <p>{{ currentStep.explanation }}</p>
                    </section>
                </div>
            </div>
        </div>
    </main>
    <AlgorithmInfoModal v-if="showInfo && meta" :info="meta" @close="showInfo = false" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import arrowLeft from "@/assets/arrow-left.svg";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router"
const router = useRouter();
import AlgorithmInfoModal from "@/components/visualizer/AlgorithmInfoModal.vue"
import PseudoCodePanel from './PseudoCodePanel.vue'
import ArrayCanvas from './canvases/ArrayCanvas.vue'
import { Info } from 'lucide-vue-next'

const props = defineProps({
    title: String,
    description: String,
    generateSteps: Function,
    pseudoCode: Array,
    algorithmName: String,
    currentOperation: Object,
})

const randomArray = () =>
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 99) + 1)

const route = useRoute()
const algorithmKey = computed(() => route.params.algorithm)
const baseArray = ref(randomArray())
const meta = computed(() => props.currentOperation || null)
const steps = ref(props.generateSteps(baseArray.value))
const stepIndex = ref(0)
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const playing = ref(false)
const showInfo = ref(false)
const speedLevel = ref(3)
const customInput = ref('')
const currentStep = computed(() =>
    steps.value[stepIndex.value] || { array: [], active: [], swap: false, explanation: '' }
)
const maxValue = computed(() =>
    currentStep.value.array.length
        ? Math.max(...currentStep.value.array)
        : 1
)

const speedDelay = computed(() => {
    const map = {
        1: 1200,
        2: 900,
        3: 700,
        4: 400,
        5: 200
    }
    return map[speedLevel.value]
})

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
    }, speedDelay.value)

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

watch(speedLevel, () => {
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
/* COMPACT LAYOUT */
.visualizer-page {
    height: 100vh;
    background: var(--bg-page);
    padding: 12px;
    overflow: hidden;
}

.container-compact {
    max-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.top-section-compact {
    flex-shrink: 0;
}

.back-btn-compact {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    color: var(--accent-lighter);
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
}

.back-btn-compact:hover {
    background: var(--accent-bg-hover);
    transform: translateX(-2px);
}

.arrow {
    width: 16px;
    height: 16px;
}

.page-header-compact {
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 12px;
    padding: 12px 16px;
    flex-shrink: 0;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
}

.operation-title-group-compact {
    display: flex;
    align-items: center;
    gap: 8px;
}

.operation-title-group-compact h1 {
    font-size: 1.4rem;
    background: var(--accent);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.info-btn-compact {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid var(--accent-border);
    color: var(--accent-lighter);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.info-btn-compact:hover {
    background: rgba(99, 102, 241, 0.3);
    transform: scale(1.1);
}

.operation-desc-compact {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin: 0;
}

.algo-badges-compact {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.badge-compact {
    padding: 4px 8px;
    background: var(--border-light);
    border: 1px solid var(--border-medium);
    border-radius: 6px;
    color: var(--text-tertiary);
    font-size: 0.75rem;
    font-weight: 500;
}

.badge-compact.stable {
    background: rgba(34, 197, 94, 0.2);
    border-color: rgba(34, 197, 94, 0.3);
    color: var(--success-text);
}

.badge-compact.unstable {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.3);
    color: var(--error-text);
}

/* TWO COLUMN LAYOUT */
.two-column-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.left-column, .right-column {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
}

/* ARRAY INPUT */
.array-input-compact {
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 10px;
    flex-shrink: 0;
}

.input-row-compact {
    display: flex;
    gap: 6px;
    align-items: center;
}

.custom-input-compact {
    flex: 1;
    background: rgba(18, 18, 18, 0.8);
    border: 1px solid var(--border-strong);
    color: var(--accent-lighter);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
}

.custom-input-compact:focus {
    outline: none;
    border-color: var(--accent);
}

.custom-input-compact::placeholder {
    color: var(--text-dim);
    font-size: 0.75rem;
}

/* BUTTONS */
.btn-compact {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-compact.primary {
    background: var(--accent);
    color: var(--text-primary);
}

.btn-compact.primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-compact.ghost {
    background: var(--border-light);
    border: 1px solid var(--border-medium);
    color: var(--text-tertiary);
}

.btn-compact.ghost:hover:not(:disabled) {
    background: var(--border-medium);
}

.btn-compact.danger {
    background: var(--accent);
    color: var(--text-primary);
}

.btn-compact.danger:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-compact:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* CONTROLS */
.controls-compact {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 8px;
    flex-shrink: 0;
}

.step-counter-compact {
    padding: 5px 10px;
    background: var(--bg-hover);
    border: 1px solid var(--accent-border);
    border-radius: 6px;
    color: var(--accent-lighter);
    font-weight: 600;
    font-size: 0.75rem;
}

.speed-compact {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-lighter);
    font-size: 0.75rem;
}

.speed-slider {
    width: 80px;
    cursor: pointer;
}

/* CANVAS */
.canvas-compact {
    flex: 1;
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: relative;
}

.canvas-legend-compact {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 8px;
    flex-wrap: wrap;
    flex-shrink: 0;
}

.legend-item-compact {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-tertiary);
    font-size: 0.75rem;
}

.dot {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 2px solid #1a1a1a;
}

.dot.normal {
    background-color: var(--accent);
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
}

/* RIGHT COLUMN */
.pseudo-section-compact {
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 10px;
    flex-shrink: 0;
}

.section-title-compact {
    color: var(--accent-lighter);
    margin: 0 0 8px 0;
    font-size: 1rem;
}

.pseudo-scroll {
    max-height: 250px;
    overflow-y: auto;
}

.explanation-compact {
    flex: 1;
    background: rgba(18, 18, 18, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    padding: 10px;
    overflow-y: auto;
    min-height: 0;
}

.explanation-compact h3 {
    color: var(--accent-lighter);
    margin: 0 0 6px 0;
    font-size: 0.9rem;
}

.explanation-compact p {
    color: var(--text-muted);
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0;
}

/* SCROLLBAR STYLING */
.pseudo-scroll::-webkit-scrollbar,
.explanation-compact::-webkit-scrollbar {
    width: 6px;
}

.pseudo-scroll::-webkit-scrollbar-track,
.explanation-compact::-webkit-scrollbar-track {
    background: rgba(18, 18, 18, 0.3);
    border-radius: 3px;
}

.pseudo-scroll::-webkit-scrollbar-thumb,
.explanation-compact::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 3px;
}

.pseudo-scroll::-webkit-scrollbar-thumb:hover,
.explanation-compact::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.5);
}

/* Responsive */
@media (max-width: 1200px) {
    .two-column-layout {
        grid-template-columns: 1fr;
    }
    
    .visualizer-page {
        overflow-y: auto;
        height: auto;
        min-height: 100vh;
    }
}
</style>
