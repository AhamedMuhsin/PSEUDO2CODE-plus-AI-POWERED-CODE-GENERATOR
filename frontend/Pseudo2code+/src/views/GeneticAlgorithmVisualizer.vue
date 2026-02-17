<template>
  <AuthNavbar />
  <main class="bs-page">
    <div class="bs-container">
      <div class="bs-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>

      <h1 class="bs-title">Genetic Algorithm — Binary String Evolution</h1>

      <!-- ═══════ THREE-COLUMN ═══════ -->
      <div class="bs-three-col">
        <!-- LEFT -->
        <aside class="bs-controls-panel">
          <div class="bs-btn-group">
            <button class="bs-btn" :class="{active:playing}" @click="playing?pause():play()"><span class="bs-icon">▶</span>{{ playing?'Pause':'Play' }}</button>
            <button class="bs-btn" @click="next" :disabled="stepIndex===steps.length-1"><span class="bs-icon">⏭</span>Step</button>
          </div>
          <div class="bs-btn-group">
            <button class="bs-btn" @click="reset"><span class="bs-icon">↺</span>Reset</button>
          </div>

          <button class="bs-btn bs-settings-toggle" @click="showSettings=!showSettings"><span class="bs-icon">⚙</span>Settings</button>
          <div v-if="showSettings" class="bs-settings-body">
            <div class="bs-setting-row"><label>Speed: <strong>{{ speedPercent }}%</strong></label><input type="range" min="1" max="5" v-model.number="speedLevel" class="bs-slider"/></div>
          </div>

          <button class="bs-btn bs-code-btn" @click="goToGenerateCode"><span class="bs-icon">{ }</span>Generate Code</button>

          <div class="bs-info-block">
            <p>Target: <strong>11111111</strong></p>
            <p>Pop: <strong>6</strong>, Mut: <strong>10%</strong></p>
          </div>

          <div class="bs-shortcuts">
            <h4>Keyboard Shortcuts:</h4>
            <div class="bs-shortcut-grid">
              <span class="bs-key">Space</span><span>Play / Pause</span>
              <span class="bs-key">→</span><span>Step Forward</span>
              <span class="bs-key">←</span><span>Step Back</span>
              <span class="bs-key">R</span><span>Reset</span>
            </div>
          </div>

          <div class="bs-legend">
            <h4>Legend</h4>
            <div class="bs-legend-item"><span class="bs-dot ga-start"></span><div><strong>Start</strong><br/><small>Initial population</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot ga-evaluating"></span><div><strong>Evaluating</strong><br/><small>Computing fitness</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot ga-selection"></span><div><strong>Selection</strong><br/><small>Tournament selection</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot ga-crossover"></span><div><strong>Crossover</strong><br/><small>Combining parents</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot ga-mutation"></span><div><strong>Mutation</strong><br/><small>Random bit flips</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot ga-newgen"></span><div><strong>New Gen</strong><br/><small>Population replaced</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot ga-success"></span><div><strong>Success</strong><br/><small>Target reached!</small></div></div>
          </div>
        </aside>

        <!-- CENTER -->
        <div class="bs-chart-area">
          <div class="bs-chart-wrapper">
            <div class="ga-viz-container">
              <!-- Generation label -->
              <div class="ga-gen-header">
                <span class="ga-gen-label">Generation</span>
                <span class="ga-gen-num">{{ cs.generation }}</span>
              </div>

              <!-- Population chromosomes -->
              <div class="ga-pop-grid">
                <div v-for="(ind,i) in cs.population" :key="i" class="ga-chromo-row" :class="{'ga-chromo-best':ind.fitness===cs.bestFitness}">
                  <span class="ga-chromo-idx">#{{ i+1 }}</span>
                  <div class="ga-bits">
                    <span v-for="(bit,bi) in ind.chromosome" :key="bi" class="ga-bit" :class="bit==='1'?'ga-bit-1':'ga-bit-0'">{{ bit }}</span>
                  </div>
                  <div class="ga-fit-bar-track">
                    <div class="ga-fit-bar-fill" :style="{width:ind.fitness+'%'}" :class="{'ga-fit-100':ind.fitness>=100}"></div>
                  </div>
                  <span class="ga-fit-val">{{ ind.fitness.toFixed(0) }}%</span>
                </div>
              </div>

              <!-- Target reference -->
              <div class="ga-target-row">
                <span class="ga-target-lbl">Target:</span>
                <div class="ga-bits ga-target-bits">
                  <span v-for="(b,i) in '11111111'.split('')" :key="i" class="ga-bit ga-bit-target">{{ b }}</span>
                </div>
              </div>

              <!-- Fitness summary bar -->
              <div class="ga-fitness-summary">
                <div class="ga-fs-item">
                  <span class="ga-fs-label">Best Fitness</span>
                  <span class="ga-fs-val" :class="{'ga-fs-perfect':cs.bestFitness>=100}">{{ cs.bestFitness?.toFixed(1) }}%</span>
                </div>
                <div class="ga-fs-item">
                  <span class="ga-fs-label">Avg Fitness</span>
                  <span class="ga-fs-val">{{ cs.avgFitness?.toFixed(1) }}%</span>
                </div>
              </div>

              <!-- Status -->
              <div class="ga-status-badge" :class="'ga-sb-'+cs.status">
                <span v-if="cs.status==='start'">🧬 Initial population generated</span>
                <span v-else-if="cs.status==='evaluating'">📊 Evaluating fitness — Gen {{ cs.generation }}</span>
                <span v-else-if="cs.status==='selection'">🏆 Tournament selection of parents</span>
                <span v-else-if="cs.status==='crossover'">🔀 Crossover — combining parent genes</span>
                <span v-else-if="cs.status==='mutation'">⚡ Mutation — random bit flip!</span>
                <span v-else-if="cs.status==='new_generation'">🔄 New generation created</span>
                <span v-else-if="cs.status==='success'">🏆 Target reached! Evolution complete!</span>
              </div>
            </div>
            <div class="bs-chart-footer"><span>Binary String Evolution → 11111111</span><span>Population: 6 | Mutation: 10%</span></div>
            <input type="range" class="bs-scrubber" min="0" :max="steps.length-1" v-model.number="stepIndex"/>
          </div>
          <div class="bs-status-bar">{{ cs.explanation }}</div>
          <div class="bs-complexity-row">
            <span class="bs-complexity-badge">Time: <strong>O(g · n · l)</strong></span>
            <span class="bs-complexity-badge">Space: <strong>O(n · l)</strong></span>
            <span class="bs-complexity-badge">Optimal: <strong>Heuristic</strong></span>
          </div>
        </div>

        <!-- RIGHT -->
        <aside class="bs-inspector">
          <div class="bs-inspector-header"><h3>Inspector</h3><span class="bs-step-badge">Step {{ stepIndex+1 }} / {{ steps.length }}</span></div>
          <div class="bs-inspector-row"><span>Progress</span><span>{{ progressPct }}%</span></div>
          <div class="bs-progress-track"><div class="bs-progress-fill" :style="{width:progressPct+'%'}"></div></div>

          <h4 class="bs-inspector-label">GENERATION INFO</h4>
          <div class="ga-gen-info">
            <div class="ga-gi-item"><span class="ga-gi-lbl">Generation</span><span class="ga-gi-val">{{ cs.generation }}</span></div>
            <div class="ga-gi-item"><span class="ga-gi-lbl">Population</span><span class="ga-gi-val">{{ cs.population?.length || 0 }}</span></div>
          </div>

          <h4 class="bs-inspector-label">FITNESS METRICS</h4>
          <div class="bs-metrics-grid">
            <div class="bs-metric"><span class="bs-metric-label">Best</span><span class="bs-metric-value" :class="{'ga-met-100':cs.bestFitness>=100}">{{ cs.bestFitness?.toFixed(1) }}%</span></div>
            <div class="bs-metric"><span class="bs-metric-label">Average</span><span class="bs-metric-value">{{ cs.avgFitness?.toFixed(1) }}%</span></div>
            <div class="bs-metric"><span class="bs-metric-label">Crossovers</span><span class="bs-metric-value">{{ metrics.crossovers }}</span></div>
            <div class="bs-metric"><span class="bs-metric-label">Mutations</span><span class="bs-metric-value ga-mut-val">{{ metrics.mutations }}</span></div>
          </div>

          <!-- Fitness chart (text-based sparkline) -->
          <h4 class="bs-inspector-label">FITNESS PROGRESS</h4>
          <div class="ga-fitness-chart">
            <div v-for="(f,i) in fitnessHistory" :key="i" class="ga-fc-bar" :style="{height:f+'%'}" :class="{'ga-fc-100':f>=100}"></div>
          </div>
          <div class="ga-fc-labels">
            <span>Gen 0</span>
            <span>Gen {{ cs.generation }}</span>
          </div>

          <!-- Population detail -->
          <h4 class="bs-inspector-label">POPULATION DETAIL</h4>
          <div class="ga-pop-detail">
            <div v-for="(ind,i) in cs.population" :key="i" class="ga-pd-item" :class="{'ga-pd-best':ind.fitness===cs.bestFitness}">
              <span class="ga-pd-idx">#{{ i+1 }}</span>
              <span class="ga-pd-chr">{{ ind.chromosome.join('') }}</span>
              <span class="ga-pd-fit">{{ ind.fitness.toFixed(0) }}%</span>
            </div>
          </div>

          <!-- Evolution log -->
          <h4 class="bs-inspector-label">EVOLUTION LOG</h4>
          <div class="ga-evo-log">
            <div v-for="(e,i) in evoLog" :key="i" class="ga-evo-entry" :class="{'ga-evo-cur':i===evoLog.length-1}">
              <span class="ga-evo-num">#{{ i+1 }}</span>
              <span class="ga-evo-dot" :class="'ga-'+e.status"></span>
              <span class="ga-evo-text">{{ e.text }}</span>
            </div>
            <span v-if="evoLog.length===0" class="ga-no-evo">No events yet</span>
          </div>

          <h4 class="bs-inspector-label">EXPLANATION</h4>
          <div class="bs-step-detail">{{ cs.explanation }}</div>
        </aside>
      </div>

      <!-- HOW IT WORKS -->
      <section class="bs-section">
        <button class="bs-section-toggle" @click="showHow=!showHow"><span class="bs-info-circle">ⓘ</span>How Genetic Algorithms Work</button>
        <div v-if="showHow" class="bs-section-body">
          <h2>Algorithm Overview</h2>
          <p>Genetic Algorithms are inspired by natural selection. A population of candidate solutions evolves over generations through selection, crossover, and mutation — gradually improving fitness toward a target.</p>
          <h3>Steps:</h3>
          <ol>
            <li><strong>Initialize</strong> — create a random population of chromosomes</li>
            <li><strong>Evaluate</strong> — compute fitness of each individual</li>
            <li><strong>Selection</strong> — choose parents using tournament selection (fitter individuals preferred)</li>
            <li><strong>Crossover</strong> — combine two parents at a random point to create offspring</li>
            <li><strong>Mutation</strong> — randomly flip bits with small probability (10%)</li>
            <li><strong>Elitism</strong> — keep the best individual unchanged</li>
            <li><strong>Repeat</strong> — until fitness reaches 100% or max generations</li>
          </ol>
          <h3>Key Concepts:</h3>
          <ul>
            <li><strong>Chromosome</strong> — binary string representing a solution</li>
            <li><strong>Fitness</strong> — percentage of bits matching the target (11111111)</li>
            <li><strong>Crossover</strong> — single-point crossover combines two parents</li>
            <li><strong>Mutation</strong> — introduces diversity, prevents premature convergence</li>
            <li><strong>Elitism</strong> — preserves the best solution across generations</li>
          </ul>
          <h3>Complexity:</h3>
          <ul>
            <li><strong>Time:</strong> O(g × n × l) — g generations, n population, l chromosome length</li>
            <li><strong>Space:</strong> O(n × l) — storing the population</li>
            <li><strong>Guarantee:</strong> Heuristic — no guarantee of global optimum</li>
          </ul>
        </div>
      </section>

      <section class="bs-section">
        <button class="bs-section-toggle" @click="showEx=!showEx"><span class="bs-info-circle">ⓘ</span>GA Applications & Tips</button>
        <div v-if="showEx" class="bs-section-body">
          <div class="bs-edge-grid">
            <div class="bs-edge-card"><strong>🗺️ Traveling Salesman</strong><small>Evolve tour permutations to find shortest routes through cities.</small></div>
            <div class="bs-edge-card"><strong>🤖 Neural Architecture</strong><small>Neuroevolution — evolve neural network weights and topologies.</small></div>
            <div class="bs-edge-card"><strong>📅 Scheduling</strong><small>Evolve timetables that satisfy resource and time constraints.</small></div>
            <div class="bs-edge-card"><strong>🎮 Game AI</strong><small>Evolve strategies or parameters for game-playing agents.</small></div>
          </div>
          <h3>Watch for:</h3>
          <ul class="bs-tips">
            <li>Green bars indicate bits matching the target — watch them grow each generation</li>
            <li>Mutation events (⚡) add random diversity — sometimes they help, sometimes not</li>
            <li>The best individual is preserved (elitism) — fitness never decreases</li>
            <li>Try resetting — different random starts lead to different evolutionary paths!</li>
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
import { geneticAlgorithmSteps } from '@/algorithms/aiProblems/geneticAlgorithmSteps'

const router = useRouter()
const speedLevel = ref(3)
const showSettings = ref(false)
const showHow = ref(false)
const showEx = ref(false)
const steps = ref(geneticAlgorithmSteps())
const stepIndex = ref(0)
const playing = ref(false)

const cs = computed(() => steps.value[stepIndex.value] || { population: [], generation: 0, bestFitness: 0, avgFitness: 0, status: 'start', explanation: '' })
const progressPct = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)

// Metrics
const metrics = computed(() => {
  let crossovers = 0, mutations = 0
  for (let i = 0; i <= stepIndex.value; i++) {
    if (steps.value[i].status === 'crossover') crossovers++
    if (steps.value[i].status === 'mutation') mutations++
  }
  return { crossovers, mutations }
})

// Fitness history (best fitness per generation change)
const fitnessHistory = computed(() => {
  const hist = []
  let lastGen = -1
  for (let i = 0; i <= stepIndex.value; i++) {
    const s = steps.value[i]
    if (s.generation !== lastGen) {
      hist.push(s.bestFitness)
      lastGen = s.generation
    }
  }
  // Pad to min 2
  while (hist.length < 2) hist.push(hist[hist.length - 1] || 0)
  return hist.slice(-15)
})

// Evolution log
const evoLog = computed(() => {
  const log = []
  for (let i = 0; i <= stepIndex.value; i++) {
    const s = steps.value[i]
    if (s.status === 'evaluating') log.push({ text: `Gen ${s.generation}: best=${s.bestFitness.toFixed(0)}%`, status: s.status })
    else if (s.status === 'crossover') log.push({ text: `Crossover`, status: s.status })
    else if (s.status === 'mutation') log.push({ text: `Mutation!`, status: s.status })
    else if (s.status === 'success') log.push({ text: `Target reached!`, status: s.status })
  }
  return log.slice(-15)
})

// Playback
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))
let timer = null
function play() { if (playing.value) return; playing.value = true; timer = setInterval(() => { if (stepIndex.value < steps.value.length - 1) stepIndex.value++; else pause() }, speedDelay.value) }
function pause() { playing.value = false; clearInterval(timer) }
function next() { pause(); if (stepIndex.value < steps.value.length - 1) stepIndex.value++ }
function prev() { pause(); if (stepIndex.value > 0) stepIndex.value-- }
function reset() { pause(); steps.value = geneticAlgorithmSteps(); stepIndex.value = 0 }
function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: 'Write a Genetic Algorithm that evolves a population of 8-bit binary strings toward the target "11111111".\nInclude fitness evaluation (percentage of matching bits), tournament selection, single-point crossover, bit-flip mutation at 10% rate, and elitism.\nShow generational evolution with best and average fitness tracking.' } }) }
watch(speedLevel, () => { if (playing.value) { pause(); play() } })
function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.bs-page{min-height:100vh;background:radial-gradient(ellipse at top,#0f172a 0%,#020617 70%);color:#e2e8f0;padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}
.bs-container{max-width:1440px;margin:0 auto}.bs-top-bar{flex-shrink:0}
.back-btn-compact{display:flex;align-items:center;gap:6px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#e0e7ff;padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}
.back-btn-compact:hover{background:rgba(99,102,241,.25);transform:translateX(-2px)}.arrow{width:16px;height:16px}
.bs-title{font-size:1.6rem;font-weight:700;color:#f1f5f9;margin:0 0 16px}
.bs-three-col{display:grid;grid-template-columns:240px 1fr 280px;gap:16px;margin-bottom:24px}
.bs-controls-panel{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.bs-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.bs-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.12);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}
.bs-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}.bs-btn:disabled{opacity:.4;cursor:not-allowed}
.bs-btn.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.5)}.bs-icon{font-size:.9rem}
.bs-settings-toggle{width:100%;justify-content:center}
.bs-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:rgba(15,23,42,.5);border-radius:8px}
.bs-setting-row label{font-size:.78rem;color:#94a3b8}.bs-slider{width:100%;cursor:pointer;accent-color:#818cf8}
.bs-code-btn{width:100%;justify-content:center;background:rgba(99,102,241,.15)!important;border-color:rgba(99,102,241,.35)!important;color:#a5b4fc!important}
.bs-code-btn:hover{background:rgba(99,102,241,.28)!important}
.bs-info-block{font-size:.78rem;color:#94a3b8;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px}
.bs-shortcuts h4{font-size:.78rem;color:#94a3b8;margin:0 0 6px;font-weight:600}
.bs-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:#94a3b8}
.bs-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:#e0e7ff;font-size:.72rem;text-align:center}
.bs-legend h4{font-size:.82rem;color:#f1f5f9;margin:0 0 8px}
.bs-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:#cbd5e1}.bs-legend-item small{color:#64748b}
.bs-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}
.bs-dot.ga-start{background:#3b82f6}.bs-dot.ga-evaluating{background:#f59e0b}.bs-dot.ga-selection{background:#a78bfa}.bs-dot.ga-crossover{background:#06b6d4}.bs-dot.ga-mutation{background:#ef4444}.bs-dot.ga-newgen{background:#22c55e}.bs-dot.ga-success{background:#8b5cf6}
.bs-chart-area{display:flex;flex-direction:column;gap:10px}
.bs-chart-wrapper{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:16px 16px 8px;display:flex;flex-direction:column}
.bs-chart-footer{display:flex;justify-content:space-between;font-size:.72rem;color:#64748b;padding:6px 0 4px}
.bs-scrubber{width:100%;accent-color:#818cf8;cursor:pointer;margin-top:4px}
.bs-status-bar{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:#e2e8f0;font-weight:500}
.bs-complexity-row{display:flex;justify-content:center;gap:32px}
.bs-complexity-badge{font-size:.82rem;color:#94a3b8}.bs-complexity-badge strong{color:#e0e7ff}
/* GA Viz */
.ga-viz-container{display:flex;flex-direction:column;align-items:center;gap:14px;padding:16px 8px}
.ga-gen-header{display:flex;align-items:baseline;gap:10px}
.ga-gen-label{font-size:.82rem;color:#94a3b8;font-weight:600;letter-spacing:.04em}
.ga-gen-num{font-size:2rem;font-weight:900;color:#818cf8;font-family:'Fira Code',monospace}
/* Population grid */
.ga-pop-grid{width:100%;max-width:480px;display:flex;flex-direction:column;gap:6px}
.ga-chromo-row{display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(15,23,42,.5);border-radius:8px;border:1px solid rgba(100,116,139,.15);transition:all .2s}
.ga-chromo-best{border-color:rgba(34,197,94,.35);background:rgba(34,197,94,.04)}
.ga-chromo-idx{font-size:.72rem;color:#64748b;font-weight:700;min-width:22px}
.ga-bits{display:flex;gap:2px}
.ga-bit{width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:.82rem;font-weight:800;font-family:'Fira Code',monospace;transition:all .2s}
.ga-bit-1{background:rgba(34,197,94,.15);color:#86efac;border:1px solid rgba(34,197,94,.3)}
.ga-bit-0{background:rgba(239,68,68,.08);color:#fca5a5;border:1px solid rgba(239,68,68,.15)}
.ga-bit-target{background:rgba(139,92,246,.12);color:#c4b5fd;border:1px solid rgba(139,92,246,.25)}
.ga-fit-bar-track{flex:1;height:8px;background:rgba(100,116,139,.15);border-radius:4px;overflow:hidden;min-width:60px}
.ga-fit-bar-fill{height:100%;background:linear-gradient(90deg,#818cf8,#22c55e);border-radius:4px;transition:width .3s}
.ga-fit-100{background:linear-gradient(90deg,#22c55e,#86efac)!important}
.ga-fit-val{font-size:.78rem;font-weight:700;color:#e0e7ff;font-family:'Fira Code',monospace;min-width:34px;text-align:right}
/* Target row */
.ga-target-row{display:flex;align-items:center;gap:10px}
.ga-target-lbl{font-size:.78rem;color:#94a3b8;font-weight:600}
.ga-target-bits .ga-bit{width:24px;height:24px;font-size:.75rem}
/* Fitness summary */
.ga-fitness-summary{display:flex;gap:24px;justify-content:center}
.ga-fs-item{display:flex;flex-direction:column;align-items:center}
.ga-fs-label{font-size:.68rem;color:#64748b;font-weight:600;letter-spacing:.04em}
.ga-fs-val{font-size:1.5rem;font-weight:900;color:#f1f5f9;font-family:'Fira Code',monospace}
.ga-fs-perfect{color:#22c55e!important;text-shadow:0 0 12px rgba(34,197,94,.4)}
/* Status */
.ga-status-badge{padding:8px 18px;border-radius:10px;font-size:.82rem;font-weight:600;text-align:center;background:rgba(100,116,139,.1);border:1px solid rgba(100,116,139,.25);color:#cbd5e1;width:100%;max-width:480px}
.ga-sb-start{background:rgba(59,130,246,.08);border-color:rgba(59,130,246,.25);color:#93c5fd}
.ga-sb-evaluating{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.25);color:#fbbf24}
.ga-sb-selection{background:rgba(167,139,250,.08);border-color:rgba(167,139,250,.25);color:#c4b5fd}
.ga-sb-crossover{background:rgba(6,182,212,.08);border-color:rgba(6,182,212,.25);color:#67e8f9}
.ga-sb-mutation{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.25);color:#fca5a5}
.ga-sb-new_generation{background:rgba(34,197,94,.08);border-color:rgba(34,197,94,.25);color:#86efac}
.ga-sb-success{background:rgba(139,92,246,.1);border-color:rgba(139,92,246,.3);color:#c4b5fd}
/* Inspector */
.bs-inspector{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px;overflow-y:auto;max-height:620px}
.bs-inspector::-webkit-scrollbar{width:4px}.bs-inspector::-webkit-scrollbar-thumb{background:rgba(100,116,139,.3);border-radius:2px}
.bs-inspector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.bs-inspector-header h3{margin:0;font-size:1rem;color:#f1f5f9}
.bs-step-badge{background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);padding:3px 10px;border-radius:12px;font-size:.72rem;color:#a5b4fc;font-weight:600}
.bs-inspector-row{display:flex;justify-content:space-between;font-size:.78rem;color:#94a3b8;margin-bottom:4px}
.bs-progress-track{width:100%;height:6px;background:rgba(100,116,139,.2);border-radius:3px;margin-bottom:16px;overflow:hidden}
.bs-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#818cf8);border-radius:3px;transition:width .25s}
.bs-inspector-label{font-size:.7rem;letter-spacing:.06em;color:#64748b;margin:14px 0 6px;font-weight:700}
.bs-metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.bs-metric{display:flex;flex-direction:column}.bs-metric-label{font-size:.7rem;color:#64748b}.bs-metric-value{font-size:1.15rem;font-weight:700;color:#f1f5f9}
.ga-met-100{color:#22c55e!important}.ga-mut-val{color:#ef4444!important}
.bs-step-detail{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.78rem;color:#cbd5e1;font-family:'Fira Code',monospace}
/* Gen info */
.ga-gen-info{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.ga-gi-item{background:rgba(15,23,42,.5);border-radius:8px;padding:8px 10px;display:flex;flex-direction:column;align-items:center}
.ga-gi-lbl{font-size:.68rem;color:#64748b;font-weight:600}.ga-gi-val{font-size:1.2rem;font-weight:800;color:#f1f5f9;font-family:'Fira Code',monospace}
/* Fitness chart */
.ga-fitness-chart{display:flex;align-items:flex-end;gap:3px;height:60px;background:rgba(15,23,42,.5);border-radius:6px;padding:6px 8px}
.ga-fc-bar{flex:1;background:linear-gradient(180deg,#818cf8,#6366f1);border-radius:2px 2px 0 0;min-width:4px;transition:height .3s}
.ga-fc-100{background:linear-gradient(180deg,#22c55e,#16a34a)!important}
.ga-fc-labels{display:flex;justify-content:space-between;font-size:.65rem;color:#475569;margin-top:2px}
/* Pop detail */
.ga-pop-detail{background:rgba(15,23,42,.5);padding:6px 8px;border-radius:6px;max-height:110px;overflow-y:auto}
.ga-pop-detail::-webkit-scrollbar{width:3px}.ga-pop-detail::-webkit-scrollbar-thumb{background:rgba(100,116,139,.3);border-radius:2px}
.ga-pd-item{display:flex;align-items:center;gap:6px;font-size:.72rem;color:#94a3b8;padding:2px 0}
.ga-pd-best{color:#86efac;font-weight:600}
.ga-pd-idx{font-weight:700;color:#64748b;font-family:'Fira Code',monospace;min-width:22px}
.ga-pd-chr{font-family:'Fira Code',monospace;letter-spacing:.08em}.ga-pd-fit{font-weight:700;font-family:'Fira Code',monospace;margin-left:auto}
/* Evo log */
.ga-evo-log{background:rgba(15,23,42,.5);padding:6px 8px;border-radius:6px;max-height:120px;overflow-y:auto}
.ga-evo-log::-webkit-scrollbar{width:3px}.ga-evo-log::-webkit-scrollbar-thumb{background:rgba(100,116,139,.3);border-radius:2px}
.ga-evo-entry{display:flex;align-items:center;gap:6px;font-size:.72rem;color:#94a3b8;padding:2px 0}
.ga-evo-cur{color:#e0e7ff;font-weight:600}
.ga-evo-num{font-weight:700;color:#64748b;font-family:'Fira Code',monospace;min-width:24px}
.ga-evo-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.ga-evo-dot.ga-evaluating{background:#f59e0b}.ga-evo-dot.ga-crossover{background:#06b6d4}.ga-evo-dot.ga-mutation{background:#ef4444}.ga-evo-dot.ga-success{background:#8b5cf6}
.ga-evo-text{flex:1}.ga-no-evo{font-size:.72rem;color:#475569;font-style:italic}
/* Sections */
.bs-section{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;margin-bottom:12px;overflow:hidden}
.bs-section-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:14px 18px;background:none;border:none;color:#e2e8f0;font-size:1rem;font-weight:600;cursor:pointer;text-align:left;transition:background .15s}
.bs-section-toggle:hover{background:rgba(100,116,139,.1)}
.bs-info-circle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(99,102,241,.2);border:1px solid rgba(99,102,241,.4);color:#a5b4fc;font-size:.82rem;font-weight:700;flex-shrink:0}
.bs-section-body{padding:0 20px 20px;color:#cbd5e1;font-size:.88rem;line-height:1.7}
.bs-section-body h2{font-size:1.15rem;color:#f1f5f9;margin:0 0 8px}
.bs-section-body h3{font-size:.95rem;color:#e0e7ff;margin:16px 0 6px}
.bs-section-body ol,.bs-section-body ul{padding-left:20px;margin:4px 0}
.bs-section-body li{margin-bottom:3px}
.bs-edge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.bs-edge-card{background:rgba(15,23,42,.5);border:1px solid rgba(100,116,139,.3);border-radius:10px;padding:14px;cursor:default;transition:all .15s}
.bs-edge-card:hover{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.08)}
.bs-edge-card strong{display:block;color:#f1f5f9;font-size:.88rem;margin-bottom:4px}
.bs-edge-card small{color:#64748b;font-size:.78rem}
.bs-tips{padding-left:20px}.bs-tips li{margin-bottom:4px}
@media(max-width:1100px){.bs-three-col{grid-template-columns:1fr}}
@media(max-width:640px){.bs-edge-grid{grid-template-columns:1fr}.bs-page{padding:12px}.ga-bit{width:22px;height:22px;font-size:.72rem}}
</style>
