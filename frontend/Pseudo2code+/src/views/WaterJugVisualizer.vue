<template>
    <AuthNavbar />
    <main class="bs-page">
        <div class="bs-container">
            <!-- BACK BUTTON -->
            <div class="bs-top-bar">
                <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
                    <img :src="arrowLeft" class="arrow" />
                    Back
                </button>
            </div>

            <!-- TITLE -->
            <h1 class="bs-title">Water Jug Problem</h1>

            <!-- ═══════ THREE-COLUMN VISUALIZER ═══════ -->
            <div class="bs-three-col">
                <!-- LEFT PANEL: Controls -->
                <aside class="bs-controls-panel">
                    <!-- Playback -->
                    <div class="bs-btn-group">
                        <button class="bs-btn" :class="{ active: playing }" @click="playing ? pause() : play()">
                            <span class="bs-icon">▶</span> {{ playing ? 'Pause' : 'Play' }}
                        </button>
                        <button class="bs-btn" @click="next" :disabled="stepIndex === steps.length - 1">
                            <span class="bs-icon">⏭</span> Step
                        </button>
                    </div>
                    <div class="bs-btn-group">
                        <button class="bs-btn" @click="reset">
                            <span class="bs-icon">↺</span> Reset
                        </button>
                        <button class="bs-btn" @click="generateNew">
                            <span class="bs-icon">⤮</span> New Puzzle
                        </button>
                    </div>

                    <!-- Settings toggle -->
                    <button class="bs-btn bs-settings-toggle" @click="showSettings = !showSettings">
                        <span class="bs-icon">⚙</span> Settings
                    </button>

                    <div v-if="showSettings" class="bs-settings-body">
                        <!-- 3rd Jug Toggle -->
                        <div class="bs-setting-row wj-toggle-row">
                            <label class="wj-toggle-label">
                                <input type="checkbox" v-model="useThreeJugs" class="wj-toggle-checkbox" />
                                <span class="wj-toggle-switch"></span>
                                Use 3 Jugs
                            </label>
                        </div>
                        <div class="bs-setting-row">
                            <label>Jug 1 Capacity: <strong>{{ jug1Cap }}L</strong></label>
                            <input type="range" min="2" max="10" v-model.number="jug1Cap" class="bs-slider" />
                        </div>
                        <div class="bs-setting-row">
                            <label>Jug 2 Capacity: <strong>{{ jug2Cap }}L</strong></label>
                            <input type="range" min="2" max="10" v-model.number="jug2Cap" class="bs-slider" />
                        </div>
                        <div v-if="useThreeJugs" class="bs-setting-row">
                            <label>Jug 3 Capacity: <strong>{{ jug3Cap }}L</strong></label>
                            <input type="range" min="2" max="10" v-model.number="jug3Cap" class="bs-slider" />
                        </div>
                        <div class="bs-setting-row">
                            <label>Target: <strong>{{ targetAmount }}L</strong></label>
                            <input type="range" min="1" :max="maxCapacity" v-model.number="targetAmount" class="bs-slider" />
                        </div>
                        <div class="bs-setting-row">
                            <label>Speed: <strong>{{ speedPercent }}%</strong></label>
                            <input type="range" min="1" max="5" v-model.number="speedLevel" class="bs-slider" />
                        </div>
                    </div>

                    <!-- Generate Code Button -->
                    <button class="bs-btn bs-code-btn" @click="goToGenerateCode">
                        <span class="bs-icon">{ }</span> Generate Code
                    </button>

                    <!-- Quick info -->
                    <div class="bs-info-block">
                        <p><strong>Jug1:</strong> {{ jug1Cap }}L</p>
                        <p><strong>Jug2:</strong> {{ jug2Cap }}L</p>
                        <p v-if="useThreeJugs"><strong>Jug3:</strong> {{ jug3Cap }}L</p>
                        <p><strong>Target:</strong> {{ targetAmount }}L</p>
                    </div>

                    <!-- Keyboard shortcuts -->
                    <div class="bs-shortcuts">
                        <h4>Keyboard Shortcuts:</h4>
                        <div class="bs-shortcut-grid">
                            <span class="bs-key">Space</span><span>Play/Pause</span>
                            <span class="bs-key">→</span><span>Step Forward</span>
                            <span class="bs-key">←</span><span>Step Back</span>
                            <span class="bs-key">R</span><span>Reset</span>
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="bs-legend">
                        <h4>Legend</h4>
                        <div class="bs-legend-item">
                            <span class="bs-dot wj-exploring"></span>
                            <div><strong>Exploring</strong><br /><small>Checking current state</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot wj-trying"></span>
                            <div><strong>Trying</strong><br /><small>Testing an operation</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot wj-fill"></span>
                            <div><strong>Fill</strong><br /><small>Filling a jug</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot wj-pour"></span>
                            <div><strong>Pour</strong><br /><small>Pouring between jugs</small></div>
                        </div>
                        <div class="bs-legend-item">
                            <span class="bs-dot wj-success"></span>
                            <div><strong>Solution</strong><br /><small>Target reached!</small></div>
                        </div>

                        <div class="bs-legend-note">
                            <h5>How to read the visualization:</h5>
                            <ul>
                                <li>Blue fill shows water level in each jug</li>
                                <li>Numbers show current/max capacity</li>
                                <li>BFS explores states level by level</li>
                                <li>Operations: Fill, Empty, Pour</li>
                            </ul>
                        </div>
                    </div>
                </aside>

                <!-- CENTER: JUG VISUALIZATION -->
                <div class="bs-chart-area">
                    <div class="bs-chart-wrapper">
                        <!-- Jugs Display -->
                        <div class="wj-jugs-container" :class="{ 'wj-three-jugs': useThreeJugs }">
                            <!-- Jug 1 -->
                            <div class="wj-jug-wrapper">
                                <div class="wj-jug-label">Jug 1 ({{ jug1Cap }}L)</div>
                                <div class="wj-jug" :class="{ 'wj-jug-target': currentStep.jug1 === targetAmount }">
                                    <div class="wj-markings">
                                        <div v-for="mark in jug1Cap" :key="mark" class="wj-mark"
                                            :style="{ bottom: (mark / jug1Cap) * 100 + '%' }">
                                            <span class="wj-mark-label">{{ mark }}</span>
                                        </div>
                                    </div>
                                    <div class="wj-water" :style="{
                                        height: jug1Cap > 0 ? (currentStep.jug1 / jug1Cap) * 100 + '%' : '0%',
                                        background: currentStep.jug1 === targetAmount
                                            ? 'linear-gradient(to top, #22c55e, #4ade80)'
                                            : 'linear-gradient(to top, #3b82f6, #60a5fa)',
                                    }">
                                        <span class="wj-water-label" v-if="currentStep.jug1 > 0">{{ currentStep.jug1 }}L</span>
                                    </div>
                                    <div class="wj-jug-bottom"></div>
                                </div>
                                <div class="wj-jug-amount">{{ currentStep.jug1 || 0 }} / {{ jug1Cap }}L</div>
                            </div>

                            <!-- Operation Arrow (between Jug 1 & 2, or center for 3 jugs) -->
                            <div class="wj-operation-display">
                                <div class="wj-target-badge">
                                    <span class="wj-target-icon">🎯</span>
                                    <span>Target: {{ targetAmount }}L</span>
                                </div>
                                <div v-if="currentStep.operation && currentStep.operation !== 'start'"
                                    class="wj-op-badge" :class="{
                                        'wj-op-fill': currentStep.operation.includes('Fill'),
                                        'wj-op-empty': currentStep.operation.includes('Empty'),
                                        'wj-op-pour': currentStep.operation.includes('Pour'),
                                        'wj-op-explore': currentStep.status === 'exploring',
                                        'wj-op-success': currentStep.status === 'success',
                                    }">
                                    {{ getOperationLabel(currentStep) }}
                                </div>
                                <div class="wj-op-arrow" v-if="currentStep.operation && currentStep.operation.includes('Pour')">
                                    <span v-if="currentStep.operation.includes('1→2')">Jug 1 → Jug 2</span>
                                    <span v-else-if="currentStep.operation.includes('2→1')">Jug 2 → Jug 1</span>
                                    <span v-else-if="currentStep.operation.includes('1→3')">Jug 1 → Jug 3</span>
                                    <span v-else-if="currentStep.operation.includes('3→1')">Jug 3 → Jug 1</span>
                                    <span v-else-if="currentStep.operation.includes('2→3')">Jug 2 → Jug 3</span>
                                    <span v-else-if="currentStep.operation.includes('3→2')">Jug 3 → Jug 2</span>
                                </div>
                            </div>

                            <!-- Jug 2 -->
                            <div class="wj-jug-wrapper">
                                <div class="wj-jug-label">Jug 2 ({{ jug2Cap }}L)</div>
                                <div class="wj-jug" :class="{ 'wj-jug-target': currentStep.jug2 === targetAmount }">
                                    <div class="wj-markings">
                                        <div v-for="mark in jug2Cap" :key="mark" class="wj-mark"
                                            :style="{ bottom: (mark / jug2Cap) * 100 + '%' }">
                                            <span class="wj-mark-label">{{ mark }}</span>
                                        </div>
                                    </div>
                                    <div class="wj-water" :style="{
                                        height: jug2Cap > 0 ? (currentStep.jug2 / jug2Cap) * 100 + '%' : '0%',
                                        background: currentStep.jug2 === targetAmount
                                            ? 'linear-gradient(to top, #22c55e, #4ade80)'
                                            : 'linear-gradient(to top, #3b82f6, #60a5fa)',
                                    }">
                                        <span class="wj-water-label" v-if="currentStep.jug2 > 0">{{ currentStep.jug2 }}L</span>
                                    </div>
                                    <div class="wj-jug-bottom"></div>
                                </div>
                                <div class="wj-jug-amount">{{ currentStep.jug2 || 0 }} / {{ jug2Cap }}L</div>
                            </div>

                            <!-- Jug 3 (conditional) -->
                            <div v-if="useThreeJugs" class="wj-jug-wrapper">
                                <div class="wj-jug-label">Jug 3 ({{ jug3Cap }}L)</div>
                                <div class="wj-jug" :class="{ 'wj-jug-target': (currentStep.jug3 || 0) === targetAmount }">
                                    <div class="wj-markings">
                                        <div v-for="mark in jug3Cap" :key="mark" class="wj-mark"
                                            :style="{ bottom: (mark / jug3Cap) * 100 + '%' }">
                                            <span class="wj-mark-label">{{ mark }}</span>
                                        </div>
                                    </div>
                                    <div class="wj-water" :style="{
                                        height: jug3Cap > 0 ? ((currentStep.jug3 || 0) / jug3Cap) * 100 + '%' : '0%',
                                        background: (currentStep.jug3 || 0) === targetAmount
                                            ? 'linear-gradient(to top, #22c55e, #4ade80)'
                                            : 'linear-gradient(to top, #f59e0b, #fbbf24)',
                                    }">
                                        <span class="wj-water-label" v-if="(currentStep.jug3 || 0) > 0">{{ currentStep.jug3 }}L</span>
                                    </div>
                                    <div class="wj-jug-bottom"></div>
                                </div>
                                <div class="wj-jug-amount">{{ currentStep.jug3 || 0 }} / {{ jug3Cap }}L</div>
                            </div>
                        </div>

                        <!-- Chart footer -->
                        <div class="bs-chart-footer">
                            <span>Water Jug Problem – {{ jug1Cap }}L &amp; {{ jug2Cap }}L{{ useThreeJugs ? ' & ' + jug3Cap + 'L' : '' }} jugs</span>
                            <span>Target: {{ targetAmount }}L</span>
                        </div>

                        <!-- Scrubber -->
                        <input type="range" class="bs-scrubber" min="0" :max="steps.length - 1"
                            v-model.number="stepIndex" />
                    </div>

                    <!-- Status bar -->
                    <div class="bs-status-bar">{{ currentStep.explanation }}</div>

                    <!-- Complexity badges -->
                    <div class="bs-complexity-row">
                        <span class="bs-complexity-badge">Time: <strong>{{ useThreeJugs ? 'O(M×N×P)' : 'O(M×N)' }}</strong></span>
                        <span class="bs-complexity-badge">Space: <strong>{{ useThreeJugs ? 'O(M×N×P)' : 'O(M×N)' }}</strong></span>
                        <span class="bs-complexity-badge wj-jug-mode-badge" :class="{ 'wj-three-mode': useThreeJugs }">
                            {{ useThreeJugs ? '3-Jug Mode' : '2-Jug Mode' }}
                        </span>
                    </div>
                </div>

                <!-- RIGHT PANEL: Inspector -->
                <aside class="bs-inspector">
                    <div class="bs-inspector-header">
                        <h3>Inspector</h3>
                        <span class="bs-step-badge">Step {{ currentStepNumber }} of {{ totalSteps }}</span>
                    </div>

                    <!-- Progress -->
                    <div class="bs-inspector-row">
                        <span>Progress</span>
                        <span>{{ progressPercent }}%</span>
                    </div>
                    <div class="bs-progress-track">
                        <div class="bs-progress-fill" :style="{ width: progressPercent + '%' }"></div>
                    </div>

                    <!-- Current Operation -->
                    <h4 class="bs-inspector-label">CURRENT OPERATION</h4>
                    <div class="bs-op-item">
                        <span class="bs-op-dot" :class="{
                            'wj-exploring': currentStep.status === 'exploring',
                            'wj-trying': currentStep.status === 'trying',
                            'wj-success': currentStep.status === 'success',
                            'wj-fill': currentStep.status === 'start',
                            'wj-pour': currentStep.status === 'failed',
                        }"></span>
                        {{ currentStep.explanation }}
                    </div>

                    <!-- Algorithm Metrics -->
                    <h4 class="bs-inspector-label">ALGORITHM METRICS</h4>
                    <div class="bs-metrics-grid">
                        <div class="bs-metric">
                            <span class="bs-metric-label">States Explored</span>
                            <span class="bs-metric-value">{{ metrics.explored }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Operations Tried</span>
                            <span class="bs-metric-value">{{ metrics.tried }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Solution Steps</span>
                            <span class="bs-metric-value">{{ currentStep.path ? currentStep.path.length : 0 }}</span>
                        </div>
                        <div class="bs-metric">
                            <span class="bs-metric-label">Status</span>
                            <span class="bs-metric-value wj-status-text" :class="{
                                'wj-status-searching': currentStep.status !== 'success' && currentStep.status !== 'failed',
                                'wj-status-found': currentStep.status === 'success',
                                'wj-status-none': currentStep.status === 'failed',
                            }">{{ currentStep.status === 'success' ? 'Found' : currentStep.status === 'failed' ? 'None' : 'Searching' }}</span>
                        </div>
                    </div>

                    <!-- Current Step -->
                    <h4 class="bs-inspector-label">CURRENT STEP</h4>
                    <div class="bs-step-detail">{{ currentStep.explanation }}</div>

                    <!-- Jug States -->
                    <h4 class="bs-inspector-label">JUG STATES</h4>
                    <div class="wj-jug-states">
                        <div class="wj-jug-state-row">
                            <span class="wj-state-label">Jug 1:</span>
                            <div class="wj-state-bar-track">
                                <div class="wj-state-bar-fill" :style="{ width: jug1Cap > 0 ? (currentStep.jug1 / jug1Cap) * 100 + '%' : '0%' }"></div>
                            </div>
                            <span class="wj-state-val">{{ currentStep.jug1 || 0 }}/{{ jug1Cap }}L</span>
                        </div>
                        <div class="wj-jug-state-row">
                            <span class="wj-state-label">Jug 2:</span>
                            <div class="wj-state-bar-track">
                                <div class="wj-state-bar-fill" :style="{ width: jug2Cap > 0 ? (currentStep.jug2 / jug2Cap) * 100 + '%' : '0%' }"></div>
                            </div>
                            <span class="wj-state-val">{{ currentStep.jug2 || 0 }}/{{ jug2Cap }}L</span>
                        </div>
                        <div v-if="useThreeJugs" class="wj-jug-state-row">
                            <span class="wj-state-label">Jug 3:</span>
                            <div class="wj-state-bar-track">
                                <div class="wj-state-bar-fill wj-state-bar-jug3" :style="{ width: jug3Cap > 0 ? ((currentStep.jug3 || 0) / jug3Cap) * 100 + '%' : '0%' }"></div>
                            </div>
                            <span class="wj-state-val">{{ currentStep.jug3 || 0 }}/{{ jug3Cap }}L</span>
                        </div>
                    </div>

                    <!-- Solution Path -->
                    <h4 class="bs-inspector-label">SOLUTION PATH</h4>
                    <div class="wj-solution-path">
                        <div v-for="(op, i) in (currentStep.path || [])" :key="i" class="wj-path-entry"
                            :class="{ 'wj-path-current': i === (currentStep.path || []).length - 1 }">
                            <span class="wj-path-num">#{{ i + 1 }}</span>
                            <span>{{ op }}</span>
                        </div>
                        <span v-if="!currentStep.path || currentStep.path.length === 0" class="wj-no-path">No operations yet</span>
                    </div>
                </aside>
            </div>

            <!-- ═══════ HOW IT WORKS ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showHowItWorks = !showHowItWorks">
                    <span class="bs-info-circle">ⓘ</span>
                    How Water Jug Problem Works
                </button>
                <div v-if="showHowItWorks" class="bs-section-body">
                    <h2>Algorithm Overview</h2>
                    <p>
                        The Water Jug Problem is a classic state-space search problem. Given two or three jugs of different
                        capacities, the goal is to measure an exact target amount of water using a series of
                        Fill, Empty, and Pour operations.
                    </p>

                    <h3>Available Operations (2 Jugs):</h3>
                    <ol>
                        <li><strong>Fill Jug 1</strong> — fill jug 1 to its maximum capacity</li>
                        <li><strong>Fill Jug 2</strong> — fill jug 2 to its maximum capacity</li>
                        <li><strong>Empty Jug 1</strong> — empty jug 1 completely</li>
                        <li><strong>Empty Jug 2</strong> — empty jug 2 completely</li>
                        <li><strong>Pour Jug 1 → Jug 2</strong> — pour water from jug 1 into jug 2</li>
                        <li><strong>Pour Jug 2 → Jug 1</strong> — pour water from jug 2 into jug 1</li>
                    </ol>

                    <h3>Additional Operations (3 Jugs):</h3>
                    <ol start="7">
                        <li><strong>Fill Jug 3</strong> — fill jug 3 to its maximum capacity</li>
                        <li><strong>Empty Jug 3</strong> — empty jug 3 completely</li>
                        <li><strong>Pour Jug 1 → Jug 3 / Jug 3 → Jug 1</strong> — pour between jug 1 and 3</li>
                        <li><strong>Pour Jug 2 → Jug 3 / Jug 3 → Jug 2</strong> — pour between jug 2 and 3</li>
                    </ol>

                    <h3>BFS Strategy:</h3>
                    <p>
                        We use Breadth-First Search to explore all possible states.
                        With 2 jugs: each state is (jug1, jug2) generating up to 6 new states.
                        With 3 jugs: each state is (jug1, jug2, jug3) generating up to 12 new states.
                        BFS guarantees finding the shortest solution.
                    </p>

                    <h3>Complexity Analysis:</h3>
                    <ul>
                        <li><strong>2 Jugs — Time/Space:</strong> O(M × N) where M, N are jug capacities</li>
                        <li><strong>3 Jugs — Time/Space:</strong> O(M × N × P) where M, N, P are jug capacities</li>
                        <li><strong>Solution exists (2 jugs)</strong> if target ≤ max(M, N) and divisible by GCD(M, N)</li>
                    </ul>
                </div>
            </section>

            <!-- ═══════ EDGE CASES & EXAMPLES ═══════ -->
            <section class="bs-section">
                <button class="bs-section-toggle" @click="showEdgeCases = !showEdgeCases">
                    <span class="bs-info-circle">ⓘ</span>
                    Configurations &amp; Examples
                </button>
                <div v-if="showEdgeCases" class="bs-section-body">
                    <h3>Try Classic 2-Jug Configurations:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card" @click="loadConfig(4, 3, 2)">
                            <strong>Classic: 4L & 3L → 2L</strong>
                            <small>The most famous water jug problem — Die Hard 3 movie</small>
                        </div>
                        <div class="bs-edge-card" @click="loadConfig(5, 3, 4)">
                            <strong>5L & 3L → 4L</strong>
                            <small>Another classic variant — slightly different approach</small>
                        </div>
                        <div class="bs-edge-card" @click="loadConfig(7, 4, 5)">
                            <strong>7L & 4L → 5L</strong>
                            <small>Larger jugs — more states to explore</small>
                        </div>
                        <div class="bs-edge-card" @click="loadConfig(3, 5, 1)">
                            <strong>3L & 5L → 1L</strong>
                            <small>Small target — requires clever pouring sequence</small>
                        </div>
                    </div>

                    <h3>Try 3-Jug Configurations:</h3>
                    <div class="bs-edge-grid">
                        <div class="bs-edge-card" @click="loadConfig3(8, 5, 3, 4)">
                            <strong>8L, 5L & 3L → 4L</strong>
                            <small>Classic 3-jug puzzle — divide 8 liters equally</small>
                        </div>
                        <div class="bs-edge-card" @click="loadConfig3(10, 7, 3, 5)">
                            <strong>10L, 7L & 3L → 5L</strong>
                            <small>Large capacity — more paths to explore</small>
                        </div>
                        <div class="bs-edge-card" @click="loadConfig3(5, 3, 2, 1)">
                            <strong>5L, 3L & 2L → 1L</strong>
                            <small>Small jugs — interesting with 3 containers</small>
                        </div>
                        <div class="bs-edge-card" @click="loadConfig3(7, 4, 3, 2)">
                            <strong>7L, 4L & 3L → 2L</strong>
                            <small>3-jug variant — compare with 2-jug solution</small>
                        </div>
                    </div>

                    <h3>Important Properties:</h3>
                    <ul class="bs-tips">
                        <li>A solution exists if and only if the target is divisible by GCD of all jug capacities</li>
                        <li>BFS finds the shortest (optimal) solution path</li>
                        <li>With 2 jugs the state space is (M+1) × (N+1); with 3 jugs it is (M+1) × (N+1) × (P+1)</li>
                        <li>Adding a 3rd jug can make previously unsolvable problems solvable</li>
                        <li>Toggle between 2 and 3 jugs to compare solution approaches</li>
                    </ul>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import arrowLeft from '@/assets/arrow-left.svg'
import { waterJugSteps } from '@/algorithms/aiProblems/waterJugSteps'

const router = useRouter()

// ─── State ──────────────────────────────────
const jug1Cap = ref(4)
const jug2Cap = ref(3)
const jug3Cap = ref(5)
const useThreeJugs = ref(false)
const targetAmount = ref(2)
const speedLevel = ref(3)
const showSettings = ref(false)
const showHowItWorks = ref(false)
const showEdgeCases = ref(false)

const steps = ref(waterJugSteps(jug1Cap.value, jug2Cap.value, targetAmount.value, 0))
const stepIndex = ref(0)
const playing = ref(false)

// ─── Computed ───────────────────────────────
const totalSteps = computed(() => steps.value.length)
const currentStepNumber = computed(() => stepIndex.value + 1)
const maxCapacity = computed(() => {
    const caps = [jug1Cap.value, jug2Cap.value]
    if (useThreeJugs.value) caps.push(jug3Cap.value)
    return Math.max(...caps)
})
const currentStep = computed(() =>
    steps.value[stepIndex.value] || {
        jug1: 0,
        jug2: 0,
        jug3: 0,
        jug1Capacity: jug1Cap.value,
        jug2Capacity: jug2Cap.value,
        jug3Capacity: jug3Cap.value,
        target: targetAmount.value,
        useThreeJugs: useThreeJugs.value,
        operation: 'start',
        path: [],
        status: 'start',
        explanation: ''
    }
)
const progressPercent = computed(() =>
    totalSteps.value > 1
        ? Math.round((stepIndex.value / (totalSteps.value - 1)) * 100)
        : 100
)
const speedPercent = computed(() => speedLevel.value * 20)

// ─── Algorithm Metrics ──────────────────────
const metrics = computed(() => {
    let explored = 0, tried = 0
    for (let i = 0; i <= stepIndex.value; i++) {
        const s = steps.value[i]
        if (s.status === 'exploring') explored++
        if (s.status === 'trying') tried++
    }
    return { explored, tried }
})

// ─── Helpers ────────────────────────────────
function getOperationLabel(step) {
    if (step.status === 'exploring') return 'Exploring State'
    if (step.status === 'success') return '✅ Solution Found!'
    if (step.operation && typeof step.operation === 'string') {
        if (step.operation.includes('Fill')) return '💧 ' + step.operation
        if (step.operation.includes('Empty')) return '🪣 ' + step.operation
        if (step.operation.includes('Pour')) return '🔄 ' + step.operation
    }
    return step.operation || ''
}

// ─── Speed ──────────────────────────────────
const speedDelay = computed(() => {
    const map = { 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }
    return map[speedLevel.value]
})

// ─── Playback ───────────────────────────────
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
    const j3 = useThreeJugs.value ? jug3Cap.value : 0
    steps.value = waterJugSteps(jug1Cap.value, jug2Cap.value, targetAmount.value, j3)
    stepIndex.value = 0
}

function generateNew() { reset() }

function loadConfig(j1, j2, t) {
    pause()
    useThreeJugs.value = false
    jug1Cap.value = j1
    jug2Cap.value = j2
    targetAmount.value = t
    steps.value = waterJugSteps(j1, j2, t, 0)
    stepIndex.value = 0
}

function loadConfig3(j1, j2, j3, t) {
    pause()
    useThreeJugs.value = true
    jug1Cap.value = j1
    jug2Cap.value = j2
    jug3Cap.value = j3
    targetAmount.value = t
    steps.value = waterJugSteps(j1, j2, t, j3)
    stepIndex.value = 0
}

function goToGenerateCode() {
    const jugInfo = useThreeJugs.value
        ? `Jug 1 capacity: ${jug1Cap.value}L, Jug 2 capacity: ${jug2Cap.value}L, Jug 3 capacity: ${jug3Cap.value}L`
        : `Jug 1 capacity: ${jug1Cap.value}L, Jug 2 capacity: ${jug2Cap.value}L`
    const jugCount = useThreeJugs.value ? 'three' : 'two'
    const prompt = `Write a program for the Water Jug Problem using BFS with ${jugCount} jugs.\n${jugInfo}, Target: ${targetAmount.value}L.\nFind the sequence of fill, empty, and pour operations to measure exactly ${targetAmount.value}L.`
    router.push({ path: '/generate-code', query: { prompt } })
}

// ─── Watchers ───────────────────────────────
watch(speedLevel, () => {
    if (playing.value) { pause(); play() }
})

watch([jug1Cap, jug2Cap, jug3Cap, targetAmount, useThreeJugs], () => {
    pause()
    if (targetAmount.value > maxCapacity.value) {
        targetAmount.value = maxCapacity.value
    }
    const j3 = useThreeJugs.value ? jug3Cap.value : 0
    steps.value = waterJugSteps(jug1Cap.value, jug2Cap.value, targetAmount.value, j3)
    stepIndex.value = 0
})

// ─── Keyboard Shortcuts ─────────────────────
function handleKey(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
    switch (e.code) {
        case 'Space':
            e.preventDefault()
            playing.value ? pause() : play()
            break
        case 'ArrowRight':
            next()
            break
        case 'ArrowLeft':
            prev()
            break
        case 'KeyR':
            reset()
            break
    }
}

onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => {
    window.removeEventListener('keydown', handleKey)
    clearInterval(timer)
})
</script>

<style scoped>
/* ════════ PAGE ════════ */
.bs-page {
    min-height: 100vh;
    background: radial-gradient(ellipse at top, #0f172a 0%, #020617 70%);
    color: #e2e8f0;
    padding: 16px 24px 40px;
    font-family: 'Inter', 'Segoe UI', sans-serif;
}

.bs-container {
    max-width: 1440px;
    margin: 0 auto;
}

/* ════════ BACK ════════ */
.bs-top-bar {
    flex-shrink: 0;
}

.back-btn-compact {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #e0e7ff;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
}

.back-btn-compact:hover {
    background: rgba(99, 102, 241, 0.25);
    transform: translateX(-2px);
}

.arrow {
    width: 16px;
    height: 16px;
}

.bs-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 16px;
}

/* ════════ THREE-COL ════════ */
.bs-three-col {
    display: grid;
    grid-template-columns: 240px 1fr 280px;
    gap: 16px;
    margin-bottom: 24px;
}

/* ════════ CONTROLS PANEL ════════ */
.bs-controls-panel {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.bs-btn-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
}

.bs-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid rgba(100, 116, 139, 0.3);
    background: rgba(100, 116, 139, 0.12);
    color: #cbd5e1;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
}

.bs-btn:hover:not(:disabled) {
    background: rgba(100, 116, 139, 0.25);
}

.bs-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.bs-btn.active {
    background: rgba(99, 102, 241, 0.3);
    border-color: rgba(99, 102, 241, 0.5);
}

.bs-icon {
    font-size: 0.9rem;
}

.bs-settings-toggle {
    width: 100%;
    justify-content: center;
}

.bs-settings-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    background: rgba(15, 23, 42, 0.5);
    border-radius: 8px;
}

.bs-setting-row label {
    font-size: 0.78rem;
    color: #94a3b8;
}

.bs-slider {
    width: 100%;
    cursor: pointer;
    accent-color: #818cf8;
}

.bs-code-btn {
    width: 100%;
    justify-content: center;
    background: rgba(99, 102, 241, 0.15) !important;
    border-color: rgba(99, 102, 241, 0.35) !important;
    color: #a5b4fc !important;
}

.bs-code-btn:hover {
    background: rgba(99, 102, 241, 0.28) !important;
}

.bs-info-block {
    font-size: 0.78rem;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 4px;
}

/* Shortcuts */
.bs-shortcuts h4 {
    font-size: 0.78rem;
    color: #94a3b8;
    margin: 0 0 6px;
    font-weight: 600;
}

.bs-shortcut-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 8px;
    font-size: 0.75rem;
    color: #94a3b8;
}

.bs-key {
    background: rgba(100, 116, 139, 0.25);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    color: #e0e7ff;
    font-size: 0.72rem;
    text-align: center;
}

/* Legend */
.bs-legend h4 {
    font-size: 0.82rem;
    color: #f1f5f9;
    margin: 0 0 8px;
}

.bs-legend-item {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin-bottom: 8px;
    font-size: 0.78rem;
    color: #cbd5e1;
}

.bs-legend-item small {
    color: #64748b;
}

.bs-dot {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    flex-shrink: 0;
    margin-top: 2px;
}

.bs-dot.wj-exploring {
    background: #eab308;
}

.bs-dot.wj-trying {
    background: #f97316;
}

.bs-dot.wj-fill {
    background: #3b82f6;
}

.bs-dot.wj-pour {
    background: #8b5cf6;
}

.bs-dot.wj-success {
    background: #22c55e;
}

.bs-legend-note {
    margin-top: 8px;
    font-size: 0.72rem;
    color: #64748b;
}

.bs-legend-note h5 {
    margin: 0 0 4px;
    font-weight: 600;
    color: #94a3b8;
    font-size: 0.72rem;
}

.bs-legend-note ul {
    margin: 0;
    padding-left: 14px;
}

.bs-legend-note li {
    margin-bottom: 2px;
}

/* ════════ CHART AREA ════════ */
.bs-chart-area {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.bs-chart-wrapper {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
    border-radius: 12px;
    padding: 16px 16px 8px;
    display: flex;
    flex-direction: column;
}

/* ════════ JUG VISUALIZATION ════════ */
.wj-jugs-container {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 16px;
    align-items: end;
    min-height: 320px;
    padding: 20px 10px 10px;
    transition: all 0.3s ease;
}

.wj-jugs-container.wj-three-jugs {
    grid-template-columns: 1fr auto 1fr 1fr;
}

.wj-jug-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.wj-jug-label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #e0e7ff;
    margin-bottom: 4px;
}

.wj-jug {
    position: relative;
    width: 120px;
    height: 220px;
    border: 3px solid #64748b;
    border-top: none;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    background: rgba(15, 23, 42, 0.6);
    transition: border-color 0.3s;
}

.wj-jug-target {
    border-color: #22c55e;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

.wj-markings {
    position: absolute;
    left: 4px;
    top: 0;
    bottom: 0;
    width: 20px;
    z-index: 2;
}

.wj-mark {
    position: absolute;
    left: 0;
    width: 100%;
    border-top: 1px solid rgba(100, 116, 139, 0.4);
}

.wj-mark-label {
    font-size: 0.55rem;
    color: #64748b;
    position: absolute;
    top: -8px;
    left: 2px;
}

.wj-water {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.wj-water::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 0 0 4px 4px;
}

.wj-water-label {
    font-size: 1.2rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    z-index: 2;
}

.wj-jug-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #475569;
}

.wj-jug-amount {
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 600;
}

/* Operation Display */
.wj-operation-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-width: 140px;
}

.wj-target-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.35);
    padding: 6px 14px;
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #a5b4fc;
}

.wj-target-icon {
    font-size: 1rem;
}

.wj-op-badge {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    text-align: center;
    max-width: 160px;
}

.wj-op-fill {
    background: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.35);
    color: #93c5fd;
}

.wj-op-empty {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
}

.wj-op-pour {
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.35);
    color: #c4b5fd;
}

.wj-op-explore {
    background: rgba(234, 179, 8, 0.1);
    border: 1px solid rgba(234, 179, 8, 0.3);
    color: #fde68a;
}

.wj-op-success {
    background: rgba(34, 197, 94, 0.15);
    border: 1px solid rgba(34, 197, 94, 0.35);
    color: #86efac;
}

.wj-op-arrow {
    font-size: 0.75rem;
    color: #8b5cf6;
    font-weight: 600;
}

.bs-chart-footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    color: #64748b;
    padding: 6px 0 4px;
}

.bs-scrubber {
    width: 100%;
    accent-color: #818cf8;
    cursor: pointer;
    margin-top: 4px;
}

/* Status bar */
.bs-status-bar {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
    border-radius: 10px;
    padding: 12px 20px;
    text-align: center;
    font-size: 0.9rem;
    color: #e2e8f0;
    font-weight: 500;
}

.bs-complexity-row {
    display: flex;
    justify-content: center;
    gap: 32px;
}

.bs-complexity-badge {
    font-size: 0.82rem;
    color: #94a3b8;
}

.bs-complexity-badge strong {
    color: #e0e7ff;
}

/* ════════ INSPECTOR ════════ */
.bs-inspector {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
    border-radius: 12px;
    padding: 14px;
    overflow-y: auto;
    max-height: 600px;
}

.bs-inspector::-webkit-scrollbar {
    width: 4px;
}

.bs-inspector::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.3);
    border-radius: 2px;
}

.bs-inspector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.bs-inspector-header h3 {
    margin: 0;
    font-size: 1rem;
    color: #f1f5f9;
}

.bs-step-badge {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.4);
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.72rem;
    color: #a5b4fc;
    font-weight: 600;
}

.bs-inspector-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: #94a3b8;
    margin-bottom: 4px;
}

.bs-progress-track {
    width: 100%;
    height: 6px;
    background: rgba(100, 116, 139, 0.2);
    border-radius: 3px;
    margin-bottom: 16px;
    overflow: hidden;
}

.bs-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #818cf8);
    border-radius: 3px;
    transition: width 0.25s;
}

.bs-inspector-label {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: #64748b;
    margin: 14px 0 6px;
    font-weight: 700;
}

.bs-op-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.78rem;
    color: #cbd5e1;
    margin-bottom: 4px;
}

.bs-op-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.bs-op-dot.wj-exploring {
    background: #eab308;
}

.bs-op-dot.wj-trying {
    background: #f97316;
}

.bs-op-dot.wj-success {
    background: #22c55e;
}

.bs-op-dot.wj-fill {
    background: #3b82f6;
}

.bs-op-dot.wj-pour {
    background: #8b5cf6;
}

.bs-metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.bs-metric {
    display: flex;
    flex-direction: column;
}

.bs-metric-label {
    font-size: 0.7rem;
    color: #64748b;
}

.bs-metric-value {
    font-size: 1.15rem;
    font-weight: 700;
    color: #f1f5f9;
}

.wj-status-text {
    font-size: 0.9rem !important;
}

.wj-status-searching {
    color: #eab308 !important;
}

.wj-status-found {
    color: #22c55e !important;
}

.wj-status-none {
    color: #ef4444 !important;
}

.bs-step-detail {
    background: rgba(15, 23, 42, 0.5);
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    color: #cbd5e1;
    font-family: 'Fira Code', monospace;
}

/* ════════ JUG STATES ════════ */
.wj-jug-states {
    background: rgba(15, 23, 42, 0.5);
    padding: 8px 10px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.wj-jug-state-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.wj-state-label {
    font-size: 0.72rem;
    color: #94a3b8;
    font-weight: 600;
    min-width: 42px;
}

.wj-state-bar-track {
    flex: 1;
    height: 10px;
    background: rgba(100, 116, 139, 0.2);
    border-radius: 5px;
    overflow: hidden;
}

.wj-state-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    border-radius: 5px;
    transition: width 0.4s ease;
}

.wj-state-bar-jug3 {
    background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.wj-state-val {
    font-size: 0.72rem;
    color: #e0e7ff;
    font-family: 'Fira Code', monospace;
    min-width: 42px;
    text-align: right;
}

/* ════════ SOLUTION PATH ════════ */
.wj-solution-path {
    background: rgba(15, 23, 42, 0.5);
    padding: 8px 10px;
    border-radius: 6px;
    max-height: 140px;
    overflow-y: auto;
}

.wj-solution-path::-webkit-scrollbar {
    width: 3px;
}

.wj-solution-path::-webkit-scrollbar-thumb {
    background: rgba(100, 116, 139, 0.3);
    border-radius: 2px;
}

.wj-path-entry {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    color: #94a3b8;
    padding: 2px 0;
}

.wj-path-current {
    color: #3b82f6;
    font-weight: 600;
}

.wj-path-num {
    font-weight: 700;
    color: #64748b;
    font-family: 'Fira Code', monospace;
    min-width: 24px;
}

.wj-no-path {
    font-size: 0.72rem;
    color: #475569;
    font-style: italic;
}

/* ════════ COLLAPSIBLE SECTIONS ════════ */
.bs-section {
    background: rgba(30, 41, 59, 0.65);
    border: 1px solid rgba(100, 116, 139, 0.25);
    border-radius: 12px;
    margin-bottom: 12px;
    overflow: hidden;
}

.bs-section-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: none;
    border: none;
    color: #e2e8f0;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s;
}

.bs-section-toggle:hover {
    background: rgba(100, 116, 139, 0.1);
}

.bs-info-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.4);
    color: #a5b4fc;
    font-size: 0.82rem;
    font-weight: 700;
    flex-shrink: 0;
}

.bs-section-body {
    padding: 0 20px 20px;
    color: #cbd5e1;
    font-size: 0.88rem;
    line-height: 1.7;
}

.bs-section-body h2 {
    font-size: 1.15rem;
    color: #f1f5f9;
    margin: 0 0 8px;
}

.bs-section-body h3 {
    font-size: 0.95rem;
    color: #e0e7ff;
    margin: 16px 0 6px;
}

.bs-section-body ol,
.bs-section-body ul {
    padding-left: 20px;
    margin: 4px 0;
}

.bs-section-body li {
    margin-bottom: 3px;
}

/* Edge case cards */
.bs-edge-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 8px;
}

.bs-edge-card {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.15s;
}

.bs-edge-card:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.08);
}

.bs-edge-card strong {
    display: block;
    color: #f1f5f9;
    font-size: 0.88rem;
    margin-bottom: 4px;
}

.bs-edge-card small {
    color: #64748b;
    font-size: 0.78rem;
}

.bs-tips {
    padding-left: 20px;
}

.bs-tips li {
    margin-bottom: 4px;
}

/* ════════ 3-JUG TOGGLE ════════ */
.wj-toggle-row {
    display: flex;
    align-items: center;
}

.wj-toggle-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.82rem;
    color: #e0e7ff;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
}

.wj-toggle-checkbox {
    display: none;
}

.wj-toggle-switch {
    position: relative;
    width: 40px;
    height: 22px;
    background: rgba(100, 116, 139, 0.3);
    border-radius: 11px;
    transition: background 0.3s;
    flex-shrink: 0;
}

.wj-toggle-switch::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    background: #94a3b8;
    border-radius: 50%;
    transition: all 0.3s;
}

.wj-toggle-checkbox:checked + .wj-toggle-switch {
    background: rgba(99, 102, 241, 0.5);
}

.wj-toggle-checkbox:checked + .wj-toggle-switch::after {
    left: 21px;
    background: #818cf8;
}

.wj-jug-mode-badge {
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.72rem;
    font-weight: 600;
    background: rgba(100, 116, 139, 0.15);
    border: 1px solid rgba(100, 116, 139, 0.3);
    color: #94a3b8;
}

.wj-jug-mode-badge.wj-three-mode {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.4);
    color: #a5b4fc;
}

/* ════════ RESPONSIVE ════════ */
@media (max-width: 1100px) {
    .bs-three-col {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .bs-edge-grid {
        grid-template-columns: 1fr;
    }

    .bs-page {
        padding: 12px;
    }

    .wj-jugs-container {
        gap: 8px;
    }

    .wj-jugs-container.wj-three-jugs {
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    .wj-jug {
        width: 90px;
        height: 160px;
    }

    .wj-operation-display {
        min-width: 100px;
    }
}
</style>
