<template>
  <AuthNavbar />
  <main class="bs-page">
    <div class="bs-container">
      <!-- BACK BUTTON -->
      <div class="bs-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>

      <!-- TITLE -->
      <h1 class="bs-title">Simulated Annealing</h1>

      <!-- ═══════ THREE-COLUMN VISUALIZER ═══════ -->
      <div class="bs-three-col">
        <!-- LEFT PANEL -->
        <aside class="bs-controls-panel">
          <div class="bs-btn-group">
            <button class="bs-btn" :class="{ active: playing }" @click="playing ? pause() : play()">
              <span class="bs-icon"><Play :size="14" /></span> {{ playing ? 'Pause' : 'Play' }}
            </button>
            <button class="bs-btn" @click="next" :disabled="stepIndex === steps.length - 1">
              <span class="bs-icon"><SkipForward :size="14" /></span> Step
            </button>
          </div>
          <div class="bs-btn-group">
            <button class="bs-btn" @click="reset"><span class="bs-icon"><RotateCcw :size="14" /></span> Reset</button>
          </div>

          <button class="bs-btn bs-settings-toggle" @click="showSettings = !showSettings">
            <span class="bs-icon"><Settings2 :size="14" /></span> Settings
          </button>
          <div v-if="showSettings" class="bs-settings-body">
            <div class="bs-setting-row">
              <label>Speed: <strong>{{ speedPercent }}%</strong></label>
              <input type="range" min="1" max="5" v-model.number="speedLevel" class="bs-slider" />
            </div>
          </div>

          <button class="bs-btn bs-code-btn" @click="goToGenerateCode">
            <span class="bs-icon">{ }</span> Generate Code
          </button>

          <div class="bs-info-block">
            <p><strong>f(x)</strong> = (x − 5)²</p>
            <p>Min at <strong>x = 5</strong>, f = <strong>0</strong></p>
          </div>

          <div class="bs-shortcuts">
            <h4>Keyboard Shortcuts:</h4>
            <div class="bs-shortcut-grid">
              <span class="bs-key">Space</span><span>Play / Pause</span>
              <span class="bs-key"><ArrowRight :size="12" /></span><span>Step Forward</span>
              <span class="bs-key"><ArrowLeft :size="12" /></span><span>Step Back</span>
              <span class="bs-key">R</span><span>Reset</span>
            </div>
          </div>

          <div class="bs-legend">
            <h4>Legend</h4>
            <div class="bs-legend-item"><span class="bs-dot sa-start"></span><div><strong>Start</strong><br /><small>Initial state</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot sa-exploring"></span><div><strong>Exploring</strong><br /><small>Evaluating neighbor</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot sa-accepted-better"></span><div><strong>Accepted ↓</strong><br /><small>Better energy</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot sa-accepted-worse"></span><div><strong>Accepted ↑</strong><br /><small>Worse — probabilistic</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot sa-rejected"></span><div><strong>Rejected</strong><br /><small>Worse — not accepted</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot sa-cooling"></span><div><strong>Cooling</strong><br /><small>Temperature drops</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot sa-success"></span><div><strong>Done</strong><br /><small>Annealing complete</small></div></div>
          </div>
        </aside>

        <!-- CENTER -->
        <div class="bs-chart-area">
          <div class="bs-chart-wrapper">
            <div class="sa-viz-container">
              <!-- SVG Curve -->
              <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="sa-svg" preserveAspectRatio="xMidYMid meet">
                <!-- Grid -->
                <line v-for="i in 11" :key="'gx'+i" :x1="sx(i-1)" :y1="marginT" :x2="sx(i-1)" :y2="marginT+plotH" stroke="rgba(100,116,139,0.12)" stroke-width="1"/>
                <line v-for="j in 6" :key="'gy'+j" :x1="marginL" :y1="marginT+((j-1)/5)*plotH" :x2="marginL+plotW" :y2="marginT+((j-1)/5)*plotH" stroke="rgba(100,116,139,0.12)" stroke-width="1"/>
                <!-- Axes -->
                <line :x1="marginL" :y1="marginT+plotH" :x2="marginL+plotW" :y2="marginT+plotH" stroke="#475569" stroke-width="1.5"/>
                <line :x1="marginL" :y1="marginT" :x2="marginL" :y2="marginT+plotH" stroke="#475569" stroke-width="1.5"/>
                <!-- X labels -->
                <text v-for="i in 11" :key="'xl'+i" :x="sx(i-1)" :y="marginT+plotH+16" text-anchor="middle" fill="#64748b" font-size="10">{{ i-1 }}</text>
                <!-- Y labels -->
                <text v-for="j in 6" :key="'yl'+j" :x="marginL-8" :y="marginT+plotH-((j-1)/5)*plotH+4" text-anchor="end" fill="#64748b" font-size="10">{{ Math.round(((j-1)/5)*yMax) }}</text>
                <!-- Axis titles -->
                <text :x="marginL+plotW/2" :y="marginT+plotH+32" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600">x (state)</text>
                <text :x="marginL-34" :y="marginT+plotH/2" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600" :transform="`rotate(-90,${marginL-34},${marginT+plotH/2})`">f(x) = (x−5)²</text>
                <!-- Curve -->
                <path :d="curvePath" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round"/>
                <path :d="curveArea" fill="rgba(129,140,248,0.06)"/>
                <!-- History trail -->
                <template v-if="trailPts.length>1">
                  <line v-for="(s,i) in trailSegs" :key="'ts'+i" :x1="s.x1" :y1="s.y1" :x2="s.x2" :y2="s.y2" stroke="rgba(245,158,11,0.45)" stroke-width="1.5" stroke-dasharray="4,3"/>
                  <circle v-for="(p,i) in trailPts.slice(0,-1)" :key="'tp'+i" :cx="p.x" :cy="p.y" r="3.5" fill="rgba(245,158,11,0.5)"/>
                </template>
                <!-- Neighbor indicator -->
                <circle v-if="cs.neighborState!=null" :cx="sx(cs.neighborState)" :cy="ey(fOfX(cs.neighborState))" r="7" fill="none" :stroke="cs.accepted?'#22c55e':'#ef4444'" stroke-width="2" stroke-dasharray="3,2"/>
                <text v-if="cs.neighborState!=null" :x="sx(cs.neighborState)" :y="ey(fOfX(cs.neighborState))-14" text-anchor="middle" :fill="cs.accepted?'#86efac':'#fca5a5'" font-size="10">{{ cs.neighborEnergy }}</text>
                <!-- Current pos -->
                <circle v-if="curPos" :cx="curPos.x" :cy="curPos.y" r="8" :fill="markerColor" stroke="#fff" stroke-width="2" class="sa-marker"/>
                <text v-if="curPos" :x="curPos.x" :y="curPos.y-16" text-anchor="middle" fill="#f1f5f9" font-size="11" font-weight="700">({{ cs.currentState }}, {{ cs.currentEnergy }})</text>
                <!-- Minimum marker -->
                <circle :cx="sx(5)" :cy="ey(0)" r="5" fill="none" stroke="rgba(139,92,246,0.5)" stroke-width="1.5" stroke-dasharray="3,2"/>
                <text :x="sx(5)" :y="ey(0)-10" text-anchor="middle" fill="rgba(139,92,246,0.6)" font-size="10">min</text>
              </svg>

              <!-- Temperature gauge -->
              <div class="sa-temp-row">
                <div class="sa-temp-gauge">
                  <div class="sa-temp-fill" :style="{ width: tempPercent + '%', background: tempColor }"></div>
                </div>
                <span class="sa-temp-label"><Thermometer :size="14" class="bs-lucide" /> T = {{ cs.temperature }}</span>
              </div>

              <!-- Status badge -->
              <div class="sa-status-badge" :class="'sa-sb-' + cs.status">
                <span v-if="cs.status==='start'"><Flame :size="14" class="bs-lucide" /> Starting Simulated Annealing</span>
                <span v-else-if="cs.status==='exploring'"><Search :size="14" class="bs-lucide" /> Evaluating neighbor x={{ cs.neighborState }}</span>
                <span v-else-if="cs.status==='accepted_better'"><CheckCircle2 :size="14" class="bs-lucide" /> Accepted — better energy!</span>
                <span v-else-if="cs.status==='accepted_worse'"><Zap :size="14" class="bs-lucide" /> Accepted worse — P={{ cs.probability }}</span>
                <span v-else-if="cs.status==='rejected'"><XCircle :size="14" class="bs-lucide" /> Rejected — P={{ cs.probability }} too low</span>
                <span v-else-if="cs.status==='cooling'"><Snowflake :size="14" class="bs-lucide" /> Cooling… T → {{ cs.temperature }}</span>
                <span v-else-if="cs.status==='success'"><Trophy :size="14" class="bs-lucide" /> Annealing Complete!</span>
              </div>

              <!-- Acceptance probability bar (when exploring/accepting/rejecting) -->
              <div v-if="cs.probability != null" class="sa-prob-row">
                <span class="sa-prob-label">Acceptance P:</span>
                <div class="sa-prob-bar-track">
                  <div class="sa-prob-bar-fill" :style="{ width: Math.min(parseFloat(cs.probability)*100,100)+'%' }"></div>
                </div>
                <span class="sa-prob-val">{{ cs.probability }}</span>
              </div>
            </div>
            <div class="bs-chart-footer">
              <span>f(x) = (x − 5)² — minimize energy</span>
              <span>Cooling rate: 0.95</span>
            </div>
            <input type="range" class="bs-scrubber" min="0" :max="steps.length-1" v-model.number="stepIndex"/>
          </div>
          <div class="bs-status-bar">{{ cs.explanation }}</div>
          <div class="bs-complexity-row">
            <span class="bs-complexity-badge">Time: <strong>O(k · n)</strong></span>
            <span class="bs-complexity-badge">Space: <strong>O(1)</strong></span>
            <span class="bs-complexity-badge">Optimal: <strong>Probabilistic</strong></span>
          </div>
        </div>

        <!-- RIGHT PANEL -->
        <aside class="bs-inspector">
          <div class="bs-inspector-header">
            <h3>Inspector</h3>
            <span class="bs-step-badge">Step {{ stepIndex+1 }} / {{ steps.length }}</span>
          </div>
          <div class="bs-inspector-row"><span>Progress</span><span>{{ progressPct }}%</span></div>
          <div class="bs-progress-track"><div class="bs-progress-fill" :style="{width:progressPct+'%'}"></div></div>

          <h4 class="bs-inspector-label">CURRENT STATE</h4>
          <div class="sa-state-grid">
            <div class="sa-state-box"><span class="sa-st-lbl">State (x)</span><span class="sa-st-val">{{ cs.currentState }}</span></div>
            <div class="sa-state-box"><span class="sa-st-lbl">Energy</span><span class="sa-st-val">{{ cs.currentEnergy }}</span></div>
            <div class="sa-state-box"><span class="sa-st-lbl">Temperature</span><span class="sa-st-val sa-temp-col">{{ cs.temperature }}</span></div>
            <div class="sa-state-box"><span class="sa-st-lbl">ΔE</span><span class="sa-st-val" :class="{'sa-de-neg':parseFloat(cs.deltaE)<0,'sa-de-pos':parseFloat(cs.deltaE)>0}">{{ cs.deltaE ?? '—' }}</span></div>
          </div>

          <h4 class="bs-inspector-label">DECISION</h4>
          <div class="sa-decision-box" :class="'sa-dec-'+cs.status">
            <span v-if="cs.accepted===true"><Check :size="14" class="bs-lucide" /> Accepted</span>
            <span v-else-if="cs.accepted===false"><X :size="14" class="bs-lucide" /> Rejected</span>
            <span v-else>—</span>
          </div>

          <h4 class="bs-inspector-label">METRICS</h4>
          <div class="bs-metrics-grid">
            <div class="bs-metric"><span class="bs-metric-label">Accepted ↓</span><span class="bs-metric-value">{{ metrics.betterAccepted }}</span></div>
            <div class="bs-metric"><span class="bs-metric-label">Accepted ↑</span><span class="bs-metric-value sa-worse-val">{{ metrics.worseAccepted }}</span></div>
            <div class="bs-metric"><span class="bs-metric-label">Rejected</span><span class="bs-metric-value">{{ metrics.rejected }}</span></div>
            <div class="bs-metric"><span class="bs-metric-label">Coolings</span><span class="bs-metric-value">{{ metrics.coolings }}</span></div>
          </div>

          <h4 class="bs-inspector-label">ENERGY HISTORY</h4>
          <div class="sa-history-log">
            <div v-for="(h,i) in historySlice" :key="i" class="sa-hist-item" :class="{'sa-hist-cur':i===historySlice.length-1}">
              <span class="sa-hist-n">#{{ i+1 }}</span>
              <span>x={{ h.state }}</span>
              <span class="sa-hist-e">E={{ typeof h.energy==='number'?h.energy.toFixed(2):h.energy }}</span>
              <span class="sa-hist-a" :class="h.accepted?'sa-ha-yes':'sa-ha-no'">{{ h.accepted?'Y':'N' }}</span>
            </div>
            <span v-if="historySlice.length===0" class="sa-no-hist">No history yet</span>
          </div>

          <h4 class="bs-inspector-label">EXPLANATION</h4>
          <div class="bs-step-detail">{{ cs.explanation }}</div>
        </aside>
      </div>

      <!-- HOW IT WORKS -->
      <section class="bs-section">
        <button class="bs-section-toggle" @click="showHow=!showHow"><span class="bs-info-circle"><Info :size="14" /></span> How Simulated Annealing Works</button>
        <div v-if="showHow" class="bs-section-body">
          <h2>Algorithm Overview</h2>
          <p>Simulated Annealing is inspired by the metallurgical process of annealing — heating and slowly cooling a material to reduce defects. It's a probabilistic optimization technique that can escape local optima.</p>
          <h3>Steps:</h3>
          <ol>
            <li><strong>Initialize</strong> — start at a random state with high temperature</li>
            <li><strong>Generate Neighbor</strong> — randomly perturb the current state</li>
            <li><strong>Evaluate</strong> — compute energy difference ΔE</li>
            <li><strong>Accept / Reject</strong> — always accept improvements; accept worse solutions with probability e<sup>-ΔE/T</sup></li>
            <li><strong>Cool Down</strong> — reduce temperature by cooling rate</li>
            <li><strong>Repeat</strong> — until temperature is near zero or max iterations</li>
          </ol>
          <h3>Key Insight:</h3>
          <p>At high temperature, worse solutions are accepted frequently — enabling exploration. As temperature drops, the algorithm becomes greedier, converging to a solution.</p>
          <h3>Complexity:</h3>
          <ul>
            <li><strong>Time:</strong> O(k · n) — k iterations, n neighbors evaluated</li>
            <li><strong>Space:</strong> O(1) — only tracks current state</li>
            <li><strong>Guarantee:</strong> Probabilistically converges to global optimum given enough time</li>
          </ul>
        </div>
      </section>

      <!-- EXAMPLES -->
      <section class="bs-section">
        <button class="bs-section-toggle" @click="showEx=!showEx"><span class="bs-info-circle"><Info :size="14" /></span> SA vs Hill Climbing</button>
        <div v-if="showEx" class="bs-section-body">
          <div class="bs-edge-grid">
            <div class="bs-edge-card"><strong><Mountain :size="14" class="bs-lucide" /> Hill Climbing</strong><small>Greedy — only accepts improvements. Gets stuck at local optima easily.</small></div>
            <div class="bs-edge-card"><strong><Flame :size="14" class="bs-lucide" /> Simulated Annealing</strong><small>Accepts worse solutions early. Can escape local optima. Converges to global optimum.</small></div>
            <div class="bs-edge-card"><strong><Thermometer :size="14" class="bs-lucide" /> Temperature</strong><small>Controls randomness. High T = explore, Low T = exploit. Cooling schedule matters.</small></div>
            <div class="bs-edge-card"><strong><Target :size="14" class="bs-lucide" /> Applications</strong><small>TSP routing, VLSI design, scheduling, protein folding, machine learning.</small></div>
          </div>
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
import { Thermometer, Flame, Search, CheckCircle2, Zap, XCircle, Snowflake, Trophy, Mountain, Target, Check, X, Play, SkipForward, RotateCcw, Settings2, Info, ArrowRight, ArrowLeft } from 'lucide-vue-next'
import { simulatedAnnealingSteps } from '@/algorithms/aiProblems/simulatedAnnealingSteps'

const router = useRouter()
const speedLevel = ref(3)
const showSettings = ref(false)
const showHow = ref(false)
const showEx = ref(false)
const steps = ref(simulatedAnnealingSteps())
const stepIndex = ref(0)
const playing = ref(false)

// SVG
const svgW = 560, svgH = 330, marginL = 50, marginT = 28, marginR = 20, marginB = 40
const plotW = svgW - marginL - marginR
const plotH = svgH - marginT - marginB
const yMax = 25 // max of (x-5)^2 on 0..10

function fOfX(x) { return (x - 5) ** 2 }
function sx(x) { return marginL + (x / 10) * plotW }
function ey(e) { return marginT + plotH - (e / yMax) * plotH }

const cs = computed(() => steps.value[stepIndex.value] || { currentState: 0, currentEnergy: '0', temperature: '100', status: 'start', explanation: '', history: [], accepted: null, probability: null })

const progressPct = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)

const curvePath = computed(() => {
  let d = ''
  for (let i = 0; i <= 100; i++) { const x = i / 10; d += (i === 0 ? 'M' : 'L') + `${sx(x)},${ey(fOfX(x))} ` }
  return d
})
const curveArea = computed(() => {
  let d = `M${sx(0)},${ey(0)} `
  for (let i = 0; i <= 100; i++) { const x = i / 10; d += `L${sx(x)},${ey(fOfX(x))} ` }
  d += `L${sx(10)},${ey(0)} Z`; return d
})

const curPos = computed(() => { const s = cs.value; if (s.currentState == null) return null; return { x: sx(s.currentState), y: ey(parseFloat(s.currentEnergy)) } })
const markerColor = computed(() => {
  const st = cs.value.status
  if (st === 'accepted_better') return '#22c55e'
  if (st === 'accepted_worse') return '#f59e0b'
  if (st === 'rejected') return '#ef4444'
  if (st === 'success') return '#8b5cf6'
  return '#f59e0b'
})

const tempPercent = computed(() => Math.min(parseFloat(cs.value.temperature || 0) / 100 * 100, 100))
const tempColor = computed(() => {
  const t = parseFloat(cs.value.temperature || 0)
  if (t > 60) return '#ef4444'
  if (t > 30) return '#f59e0b'
  return '#3b82f6'
})

// Trail
const trailPts = computed(() => (cs.value.history || []).map(h => ({ x: sx(h.state), y: ey(h.energy) })))
const trailSegs = computed(() => { const pts = trailPts.value; const s = []; for (let i = 0; i < pts.length - 1; i++) s.push({ x1: pts[i].x, y1: pts[i].y, x2: pts[i + 1].x, y2: pts[i + 1].y }); return s })

// Metrics
const metrics = computed(() => {
  let betterAccepted = 0, worseAccepted = 0, rejected = 0, coolings = 0
  for (let i = 0; i <= stepIndex.value; i++) {
    const s = steps.value[i]
    if (s.status === 'accepted_better') betterAccepted++
    if (s.status === 'accepted_worse') worseAccepted++
    if (s.status === 'rejected') rejected++
    if (s.status === 'cooling') coolings++
  }
  return { betterAccepted, worseAccepted, rejected, coolings }
})

const historySlice = computed(() => (cs.value.history || []).slice(-12))

// Speed
const speedDelay = computed(() => ({ 1: 1200, 2: 900, 3: 700, 4: 400, 5: 200 }[speedLevel.value]))
let timer = null
function play() { if (playing.value) return; playing.value = true; timer = setInterval(() => { if (stepIndex.value < steps.value.length - 1) stepIndex.value++; else pause() }, speedDelay.value) }
function pause() { playing.value = false; clearInterval(timer) }
function next() { pause(); if (stepIndex.value < steps.value.length - 1) stepIndex.value++ }
function prev() { pause(); if (stepIndex.value > 0) stepIndex.value-- }
function reset() { pause(); steps.value = simulatedAnnealingSteps(); stepIndex.value = 0 }
function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: 'Write a Simulated Annealing algorithm that minimizes f(x) = (x-5)^2.\nStart from a random state, generate neighbors, accept improvements always, accept worse solutions with probability e^(-deltaE/T).\nInclude temperature cooling schedule, iteration tracking, and convergence detection.' } }) }
watch(speedLevel, () => { if (playing.value) { pause(); play() } })
function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.bs-page{min-height:100vh;background:radial-gradient(ellipse at top,#0f172a 0%,#020617 70%);color:#e2e8f0;padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}
.bs-container{max-width:1440px;margin:0 auto}
.bs-top-bar{flex-shrink:0}
.back-btn-compact{display:flex;align-items:center;gap:6px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#e0e7ff;padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}
.back-btn-compact:hover{background:rgba(99,102,241,.25);transform:translateX(-2px)}
.arrow{width:16px;height:16px}
.bs-title{font-size:1.6rem;font-weight:700;color:#f1f5f9;margin:16px 0 16px}
.bs-lucide{display:inline-block;vertical-align:-2px;margin-right:2px}
.bs-three-col{display:grid;grid-template-columns:240px 1fr 280px;gap:16px;margin-bottom:24px}
.bs-controls-panel{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.bs-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.bs-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border:1px solid rgba(100,116,139,.3);background:rgba(100,116,139,.12);color:#cbd5e1;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}
.bs-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}.bs-btn:disabled{opacity:.4;cursor:not-allowed}
.bs-btn.active{background:rgba(99,102,241,.3);border-color:rgba(99,102,241,.5)}
.bs-icon{font-size:.9rem}
.bs-settings-toggle{width:100%;justify-content:center}
.bs-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:rgba(15,23,42,.5);border-radius:8px}
.bs-setting-row label{font-size:.78rem;color:#94a3b8}
.bs-slider{width:100%;cursor:pointer;accent-color:#818cf8}
.bs-code-btn{width:100%;justify-content:center;background:rgba(99,102,241,.15)!important;border-color:rgba(99,102,241,.35)!important;color:#a5b4fc!important}
.bs-code-btn:hover{background:rgba(99,102,241,.28)!important}
.bs-info-block{font-size:.78rem;color:#94a3b8;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px}
.bs-shortcuts h4{font-size:.78rem;color:#94a3b8;margin:0 0 6px;font-weight:600}
.bs-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:#94a3b8}
.bs-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:#e0e7ff;font-size:.72rem;text-align:center}
.bs-legend h4{font-size:.82rem;color:#f1f5f9;margin:0 0 8px}
.bs-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:#cbd5e1}
.bs-legend-item small{color:#64748b}
.bs-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}
.bs-dot.sa-start{background:#3b82f6}.bs-dot.sa-exploring{background:#f59e0b}.bs-dot.sa-accepted-better{background:#22c55e}.bs-dot.sa-accepted-worse{background:#eab308}.bs-dot.sa-rejected{background:#ef4444}.bs-dot.sa-cooling{background:#06b6d4}.bs-dot.sa-success{background:#8b5cf6}
.bs-chart-area{display:flex;flex-direction:column;gap:10px}
.bs-chart-wrapper{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:12px;padding:16px 16px 8px;display:flex;flex-direction:column}
.bs-chart-footer{display:flex;justify-content:space-between;font-size:.72rem;color:#64748b;padding:6px 0 4px}
.bs-scrubber{width:100%;accent-color:#818cf8;cursor:pointer;margin-top:4px}
.bs-status-bar{background:rgba(30,41,59,.65);border:1px solid rgba(100,116,139,.25);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:#e2e8f0;font-weight:500}
.bs-complexity-row{display:flex;justify-content:center;gap:32px}
.bs-complexity-badge{font-size:.82rem;color:#94a3b8}.bs-complexity-badge strong{color:#e0e7ff}
/* SVG */
.sa-viz-container{display:flex;flex-direction:column;align-items:center;gap:10px;padding:8px 0}
.sa-svg{width:100%;max-width:560px;height:auto}
.sa-marker{filter:drop-shadow(0 0 6px rgba(245,158,11,.5));transition:cx .3s,cy .3s}
/* Temp gauge */
.sa-temp-row{display:flex;align-items:center;gap:10px;width:100%;max-width:420px}
.sa-temp-gauge{flex:1;height:10px;background:rgba(100,116,139,.2);border-radius:5px;overflow:hidden}
.sa-temp-fill{height:100%;border-radius:5px;transition:width .3s,background .3s}
.sa-temp-label{font-size:.78rem;color:#94a3b8;white-space:nowrap;min-width:90px;text-align:right}
/* Status */
.sa-status-badge{padding:8px 18px;border-radius:10px;font-size:.82rem;font-weight:600;text-align:center;background:rgba(100,116,139,.1);border:1px solid rgba(100,116,139,.25);color:#cbd5e1}
.sa-sb-start{background:rgba(59,130,246,.08);border-color:rgba(59,130,246,.25);color:#93c5fd}
.sa-sb-exploring{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.25);color:#fbbf24}
.sa-sb-accepted_better{background:rgba(34,197,94,.08);border-color:rgba(34,197,94,.25);color:#86efac}
.sa-sb-accepted_worse{background:rgba(234,179,8,.08);border-color:rgba(234,179,8,.25);color:#facc15}
.sa-sb-rejected{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.25);color:#fca5a5}
.sa-sb-cooling{background:rgba(6,182,212,.08);border-color:rgba(6,182,212,.25);color:#67e8f9}
.sa-sb-success{background:rgba(139,92,246,.1);border-color:rgba(139,92,246,.3);color:#c4b5fd}
/* Prob bar */
.sa-prob-row{display:flex;align-items:center;gap:8px;width:100%;max-width:420px}
.sa-prob-label{font-size:.72rem;color:#94a3b8;white-space:nowrap}
.sa-prob-bar-track{flex:1;height:8px;background:rgba(100,116,139,.2);border-radius:4px;overflow:hidden}
.sa-prob-bar-fill{height:100%;background:linear-gradient(90deg,#ef4444,#f59e0b,#22c55e);border-radius:4px;transition:width .3s}
.sa-prob-val{font-size:.78rem;font-weight:700;color:#e0e7ff;font-family:'Fira Code',monospace;min-width:44px;text-align:right}
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
.bs-step-detail{background:rgba(15,23,42,.5);padding:8px 10px;border-radius:6px;font-size:.78rem;color:#cbd5e1;font-family:'Fira Code',monospace}
/* State grid */
.sa-state-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.sa-state-box{background:rgba(15,23,42,.5);border-radius:8px;padding:8px 10px;display:flex;flex-direction:column;align-items:center}
.sa-st-lbl{font-size:.68rem;color:#64748b;font-weight:600}.sa-st-val{font-size:1.1rem;font-weight:800;color:#f1f5f9;font-family:'Fira Code',monospace}
.sa-temp-col{color:#f59e0b!important}
.sa-de-neg{color:#22c55e!important}.sa-de-pos{color:#ef4444!important}
.sa-worse-val{color:#eab308!important}
/* Decision box */
.sa-decision-box{padding:8px 12px;border-radius:8px;text-align:center;font-weight:700;font-size:.85rem;background:rgba(100,116,139,.1);color:#94a3b8;border:1px solid rgba(100,116,139,.2)}
.sa-dec-accepted_better{background:rgba(34,197,94,.08);color:#86efac;border-color:rgba(34,197,94,.25)}
.sa-dec-accepted_worse{background:rgba(234,179,8,.08);color:#facc15;border-color:rgba(234,179,8,.25)}
.sa-dec-rejected{background:rgba(239,68,68,.08);color:#fca5a5;border-color:rgba(239,68,68,.25)}
/* History log */
.sa-history-log{background:rgba(15,23,42,.5);padding:6px 8px;border-radius:6px;max-height:130px;overflow-y:auto}
.sa-history-log::-webkit-scrollbar{width:3px}.sa-history-log::-webkit-scrollbar-thumb{background:rgba(100,116,139,.3);border-radius:2px}
.sa-hist-item{display:flex;gap:8px;align-items:center;font-size:.72rem;color:#94a3b8;padding:2px 0}
.sa-hist-cur{color:#e0e7ff;font-weight:600}
.sa-hist-n{font-weight:700;color:#64748b;font-family:'Fira Code',monospace;min-width:24px}
.sa-hist-e{color:#818cf8;font-family:'Fira Code',monospace}
.sa-hist-a{font-weight:700}.sa-ha-yes{color:#22c55e}.sa-ha-no{color:#ef4444}
.sa-no-hist{font-size:.72rem;color:#475569;font-style:italic}
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
@media(max-width:1100px){.bs-three-col{grid-template-columns:1fr;gap:16px}.bs-chart-area{order:-1}.bs-controls-panel{order:1}.bs-inspector{order:2;max-height:none}}
@media(max-width:768px){.bs-shortcuts{display:none}.bs-legend{display:none}.bs-controls-panel{padding:10px}}
@media(max-width:640px){.bs-edge-grid{grid-template-columns:1fr}.bs-page{padding:10px 12px 24px}.sa-state-grid{grid-template-columns:1fr}}
</style>
