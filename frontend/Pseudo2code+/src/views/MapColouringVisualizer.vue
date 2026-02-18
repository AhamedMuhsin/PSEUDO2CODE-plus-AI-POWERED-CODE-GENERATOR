<template>
  <AuthNavbar />
  <main class="bs-page">
    <div class="bs-container">
      <div class="bs-top-bar">
        <button class="back-btn-compact" @click="router.push('/algorithm-hub')">
          <img :src="arrowLeft" class="arrow" /> Back
        </button>
      </div>

      <h1 class="bs-title">Map Colouring — CSP (Australia)</h1>

      <!-- ═══════ THREE-COLUMN ═══════ -->
      <div class="bs-three-col">
        <!-- LEFT -->
        <aside class="bs-controls-panel">
          <div class="bs-btn-group">
            <button class="bs-btn" :class="{active:playing}" @click="playing?pause():play()"><span class="bs-icon"><Play :size="14" /></span>{{ playing?'Pause':'Play' }}</button>
            <button class="bs-btn" @click="next" :disabled="stepIndex===steps.length-1"><span class="bs-icon"><SkipForward :size="14" /></span>Step</button>
          </div>
          <div class="bs-btn-group">
            <button class="bs-btn" @click="reset"><span class="bs-icon"><RotateCcw :size="14" /></span>Reset</button>
          </div>

          <button class="bs-btn bs-settings-toggle" @click="showSettings=!showSettings"><span class="bs-icon"><Settings2 :size="14" /></span>Settings</button>
          <div v-if="showSettings" class="bs-settings-body">
            <div class="bs-setting-row"><label>Speed: <strong>{{ speedPercent }}%</strong></label><input type="range" min="1" max="5" v-model.number="speedLevel" class="bs-slider"/></div>
          </div>

          <button class="bs-btn bs-code-btn" @click="goToGenerateCode"><span class="bs-icon">{ }</span>Generate Code</button>

          <div class="bs-info-block">
            <p><strong>7 regions</strong>, 3 colours</p>
            <p>Backtracking CSP</p>
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
            <div class="bs-legend-item"><span class="bs-dot mc-start"></span><div><strong>Start</strong><br/><small>Initial blank map</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot mc-selecting"></span><div><strong>Selecting</strong><br/><small>Picking next region</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot mc-trying"></span><div><strong>Trying</strong><br/><small>Testing a colour</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot mc-assigned"></span><div><strong>Assigned</strong><br/><small>Valid colour set</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot mc-conflict"></span><div><strong>Conflict</strong><br/><small>Neighbor clash</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot mc-backtrack"></span><div><strong>Backtrack</strong><br/><small>Undoing assignment</small></div></div>
            <div class="bs-legend-item"><span class="bs-dot mc-success"></span><div><strong>Complete</strong><br/><small>All regions coloured</small></div></div>
          </div>
        </aside>

        <!-- CENTER: Australia Map Graph -->
        <div class="bs-chart-area">
          <div class="bs-chart-wrapper">
            <div class="mc-viz-container">
              <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="mc-svg" preserveAspectRatio="xMidYMid meet">
                <!-- Edges -->
                <line v-for="(e,i) in edges" :key="'e'+i"
                  :x1="nodePos[e[0]].x" :y1="nodePos[e[0]].y"
                  :x2="nodePos[e[1]].x" :y2="nodePos[e[1]].y"
                  :stroke="isConflictEdge(e)?'#ef4444':'var(--border-medium)'"
                  :stroke-width="isConflictEdge(e)?2.5:1.5"
                />
                <!-- Nodes -->
                <g v-for="r in regions" :key="r">
                  <circle :cx="nodePos[r].x" :cy="nodePos[r].y" r="30"
                    :fill="regionFill(r)" :stroke="regionStroke(r)"
                    :stroke-width="r===cs.currentRegion?3:1.5"
                    :class="{'mc-node-pulse':r===cs.currentRegion&&(cs.status==='trying'||cs.status==='selecting')}"
                  />
                  <text :x="nodePos[r].x" :y="nodePos[r].y+5" text-anchor="middle" fill="#f1f5f9" font-size="13" font-weight="700">{{ r }}</text>
                  <!-- Colour label -->
                  <text v-if="cs.assignments[r]" :x="nodePos[r].x" :y="nodePos[r].y+20" text-anchor="middle" :fill="cspColorHex(cs.assignments[r])" font-size="9" font-weight="600">{{ cs.assignments[r] }}</text>
                </g>
                <!-- Conflict X markers -->
                <g v-for="(c,i) in cs.conflicts" :key="'cx'+i">
                  <text :x="nodePos[c].x+22" :y="nodePos[c].y-18" fill="#ef4444" font-size="18" font-weight="900">✕</text>
                </g>
              </svg>

              <!-- Status -->
              <div class="mc-status-badge" :class="'mc-sb-'+cs.status">
                <span v-if="cs.status==='start'"><Globe :size="14" class="bs-lucide" /> Starting Map Colouring CSP</span>
                <span v-else-if="cs.status==='selecting'"><MapPin :size="14" class="bs-lucide" /> Selecting region: {{ cs.currentRegion }}</span>
                <span v-else-if="cs.status==='trying'"><Palette :size="14" class="bs-lucide" /> Trying {{ cs.tryingColor }} for {{ cs.currentRegion }}</span>
                <span v-else-if="cs.status==='assigned'"><CheckCircle2 :size="14" class="bs-lucide" /> {{ cs.tryingColor }} assigned to {{ cs.currentRegion }}</span>
                <span v-else-if="cs.status==='conflict'"><AlertTriangle :size="14" class="bs-lucide" /> Conflict! {{ cs.tryingColor }} clashes with {{ cs.conflicts?.join(', ') }}</span>
                <span v-else-if="cs.status==='backtrack'"><Undo2 :size="14" class="bs-lucide" /> Backtracking from {{ cs.currentRegion }}</span>
                <span v-else-if="cs.status==='success'"><Trophy :size="14" class="bs-lucide" /> All regions coloured — no conflicts!</span>
              </div>

              <!-- Colour palette -->
              <div class="mc-palette">
                <div v-for="c in ['RED','GREEN','BLUE']" :key="c" class="mc-pal-chip"
                  :class="{'mc-pal-active':cs.tryingColor===c}"
                  :style="{background:cspColorHex(c)}">
                  {{ c }}
                </div>
              </div>
            </div>
            <div class="bs-chart-footer"><span>Australia Map — 7 regions, 3 colours</span><span>Backtracking CSP</span></div>
            <input type="range" class="bs-scrubber" min="0" :max="steps.length-1" v-model.number="stepIndex"/>
          </div>
          <div class="bs-status-bar">{{ cs.explanation }}</div>
          <div class="bs-complexity-row">
            <span class="bs-complexity-badge">Time: <strong>O(d · n<sup>d</sup>)</strong></span>
            <span class="bs-complexity-badge">Space: <strong>O(d)</strong></span>
            <span class="bs-complexity-badge">Complete: <strong>Yes</strong></span>
          </div>
        </div>

        <!-- RIGHT -->
        <aside class="bs-inspector">
          <div class="bs-inspector-header"><h3>Inspector</h3><span class="bs-step-badge">Step {{ stepIndex+1 }} / {{ steps.length }}</span></div>
          <div class="bs-inspector-row"><span>Progress</span><span>{{ progressPct }}%</span></div>
          <div class="bs-progress-track"><div class="bs-progress-fill" :style="{width:progressPct+'%'}"></div></div>

          <h4 class="bs-inspector-label">ASSIGNMENTS</h4>
          <div class="mc-assign-grid">
            <div v-for="r in regions" :key="r" class="mc-assign-item">
              <span class="mc-assign-region" :class="{'mc-assign-cur':r===cs.currentRegion}">{{ r }}</span>
              <span class="mc-assign-color" v-if="cs.assignments[r]" :style="{color:cspColorHex(cs.assignments[r])}">{{ cs.assignments[r] }}</span>
              <span class="mc-assign-none" v-else>—</span>
            </div>
          </div>

          <h4 class="bs-inspector-label">METRICS</h4>
          <div class="bs-metrics-grid">
            <div class="bs-metric"><span class="bs-metric-label">Coloured</span><span class="bs-metric-value">{{ assignedCount }}</span></div>
            <div class="bs-metric"><span class="bs-metric-label">Remaining</span><span class="bs-metric-value">{{ 7 - assignedCount }}</span></div>
            <div class="bs-metric"><span class="bs-metric-label">Conflicts</span><span class="bs-metric-value mc-conf-val">{{ metrics.conflicts }}</span></div>
            <div class="bs-metric"><span class="bs-metric-label">Backtracks</span><span class="bs-metric-value mc-bt-val">{{ metrics.backtracks }}</span></div>
          </div>

          <h4 class="bs-inspector-label">ADJACENCY</h4>
          <div class="mc-adj-list">
            <div v-for="r in regions" :key="r" class="mc-adj-item" :class="{'mc-adj-cur':r===cs.currentRegion}">
              <span class="mc-adj-r">{{ r }}</span>
              <span class="mc-adj-n">→ {{ (adjacency[r]||[]).join(', ') || 'none' }}</span>
            </div>
          </div>

          <h4 class="bs-inspector-label">ACTION LOG</h4>
          <div class="mc-action-log">
            <div v-for="(a,i) in actionLog" :key="i" class="mc-act-entry" :class="{'mc-act-cur':i===actionLog.length-1}">
              <span class="mc-act-num">#{{ i+1 }}</span>
              <span class="mc-act-dot" :class="'mc-'+a.status"></span>
              <span class="mc-act-text">{{ a.text }}</span>
            </div>
            <span v-if="actionLog.length===0" class="mc-no-log">No actions yet</span>
          </div>

          <h4 class="bs-inspector-label">EXPLANATION</h4>
          <div class="bs-step-detail">{{ cs.explanation }}</div>
        </aside>
      </div>

      <!-- HOW IT WORKS -->
      <section class="bs-section">
        <button class="bs-section-toggle" @click="showHow=!showHow"><span class="bs-info-circle"><Info :size="14" /></span>How Map Colouring CSP Works</button>
        <div v-if="showHow" class="bs-section-body">
          <h2>Constraint Satisfaction Problem</h2>
          <p>Map Colouring is a classic CSP. The goal is to assign colours to regions such that no two adjacent regions share the same colour. The Australia map with 3 colours is a well-known example.</p>
          <h3>Algorithm (Backtracking):</h3>
          <ol>
            <li><strong>Select</strong> an unassigned region</li>
            <li><strong>Try</strong> each colour from the domain {Red, Green, Blue}</li>
            <li><strong>Check consistency</strong> — does this colour conflict with any assigned neighbor?</li>
            <li><strong>If valid</strong>, assign and recurse to the next region</li>
            <li><strong>If no colour works</strong>, backtrack and try a different colour for the previous region</li>
          </ol>
          <h3>Four Colour Theorem:</h3>
          <p>Any planar map can be coloured with at most 4 colours such that no adjacent regions share the same colour. Australia's map only needs 3.</p>
          <h3>Complexity:</h3>
          <ul>
            <li><strong>Time:</strong> O(d · n<sup>d</sup>) — d colours, n regions (worst case)</li>
            <li><strong>Space:</strong> O(d) — recursion stack depth</li>
            <li><strong>With heuristics:</strong> MRV, LCV, AC-3 dramatically reduce search</li>
          </ul>
        </div>
      </section>

      <section class="bs-section">
        <button class="bs-section-toggle" @click="showEx=!showEx"><span class="bs-info-circle"><Info :size="14" /></span>Applications & Variants</button>
        <div v-if="showEx" class="bs-section-body">
          <div class="bs-edge-grid">
            <div class="bs-edge-card"><strong><Radio :size="14" class="bs-lucide" /> Frequency Assignment</strong><small>Assign radio frequencies to towers — adjacent towers can't share frequencies.</small></div>
            <div class="bs-edge-card"><strong><CalendarDays :size="14" class="bs-lucide" /> Scheduling</strong><small>Exam timetabling — no student has two exams at the same time.</small></div>
            <div class="bs-edge-card"><strong><Puzzle :size="14" class="bs-lucide" /> Sudoku</strong><small>Each row, column, and box is a constraint — classic CSP.</small></div>
            <div class="bs-edge-card"><strong><Globe :size="14" class="bs-lucide" /> Graph Colouring</strong><small>Generalized map colouring — minimum chromatic number problem.</small></div>
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
import { Globe, MapPin, Palette, CheckCircle2, AlertTriangle, Undo2, Trophy, Radio, CalendarDays, Puzzle, Play, SkipForward, RotateCcw, Settings2, Info, ArrowRight, ArrowLeft } from 'lucide-vue-next'
import { mapColoringSteps } from '@/algorithms/aiProblems/mapColoringSteps'

const router = useRouter()
const speedLevel = ref(3)
const showSettings = ref(false)
const showHow = ref(false)
const showEx = ref(false)
const steps = ref(mapColoringSteps())
const stepIndex = ref(0)
const playing = ref(false)

const regions = ['WA','NT','SA','QLD','NSW','VIC','TAS']
const adjacency = { WA:['NT','SA'], NT:['WA','SA','QLD'], SA:['WA','NT','QLD','NSW','VIC'], QLD:['NT','SA','NSW'], NSW:['QLD','SA','VIC'], VIC:['SA','NSW'], TAS:[] }

// SVG layout — approximate Australia map positions
const svgW = 520, svgH = 380
const nodePos = {
  WA:  { x: 110, y: 190 },
  NT:  { x: 220, y: 90  },
  SA:  { x: 260, y: 220 },
  QLD: { x: 390, y: 100 },
  NSW: { x: 400, y: 220 },
  VIC: { x: 370, y: 300 },
  TAS: { x: 400, y: 360 },
}

// Edges (unique pairs)
const edges = [['WA','NT'],['WA','SA'],['NT','SA'],['NT','QLD'],['SA','QLD'],['SA','NSW'],['SA','VIC'],['QLD','NSW'],['NSW','VIC']]

function cspColorHex(c) {
  if (c === 'RED') return '#ef4444'
  if (c === 'GREEN') return '#22c55e'
  if (c === 'BLUE') return '#3b82f6'
  return '#475569'
}

const cs = computed(() => steps.value[stepIndex.value] || { assignments: {}, currentRegion: null, conflicts: [], status: 'start', explanation: '', tryingColor: null })
const progressPct = computed(() => steps.value.length > 1 ? Math.round((stepIndex.value / (steps.value.length - 1)) * 100) : 100)
const speedPercent = computed(() => speedLevel.value * 20)
const assignedCount = computed(() => Object.keys(cs.value.assignments || {}).length)

function regionFill(r) {
  const a = cs.value.assignments
  if (a[r]) return cspColorHex(a[r]) + '30' // semi-transparent
  if (r === cs.value.currentRegion) return 'rgba(245,158,11,0.15)'
  return 'rgba(18, 18, 18,0.8)'
}
function regionStroke(r) {
  const a = cs.value.assignments
  if (cs.value.conflicts?.includes(r)) return '#ef4444'
  if (r === cs.value.currentRegion) return '#f59e0b'
  if (a[r]) return cspColorHex(a[r])
  return 'var(--border-strong)'
}
function isConflictEdge(e) {
  const confs = cs.value.conflicts || []
  const cur = cs.value.currentRegion
  return (confs.includes(e[0]) && e[1] === cur) || (confs.includes(e[1]) && e[0] === cur)
}

// Metrics
const metrics = computed(() => {
  let conflicts = 0, backtracks = 0
  for (let i = 0; i <= stepIndex.value; i++) {
    if (steps.value[i].status === 'conflict') conflicts++
    if (steps.value[i].status === 'backtrack') backtracks++
  }
  return { conflicts, backtracks }
})

// Action log
const actionLog = computed(() => {
  const log = []
  for (let i = 0; i <= stepIndex.value; i++) {
    const s = steps.value[i]
    if (s.status === 'assigned') log.push({ text: `${s.currentRegion} = ${s.tryingColor}`, status: s.status })
    else if (s.status === 'conflict') log.push({ text: `${s.tryingColor} ✕ ${s.currentRegion}`, status: s.status })
    else if (s.status === 'backtrack') log.push({ text: `↩ ${s.currentRegion}`, status: s.status })
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
function reset() { pause(); steps.value = mapColoringSteps(); stepIndex.value = 0 }
function goToGenerateCode() { router.push({ path: '/generate-code', query: { prompt: 'Write a Map Colouring CSP solver using backtracking.\nUse the Australia map with 7 regions (WA, NT, SA, QLD, NSW, VIC, TAS) and 3 colours.\nImplement consistency checking — no adjacent regions can share the same colour.\nInclude backtracking when no valid colour exists for a region.' } }) }
watch(speedLevel, () => { if (playing.value) { pause(); play() } })
function handleKey(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; switch (e.code) { case 'Space': e.preventDefault(); playing.value ? pause() : play(); break; case 'ArrowRight': next(); break; case 'ArrowLeft': prev(); break; case 'KeyR': reset(); break } }
onMounted(() => window.addEventListener('keydown', handleKey))
onUnmounted(() => { window.removeEventListener('keydown', handleKey); clearInterval(timer) })
</script>

<style scoped>
.bs-page{min-height:100vh;background:var(--bg-page);color:var(--text-secondary);padding:16px 24px 40px;font-family:'Inter','Segoe UI',sans-serif}
.bs-container{max-width:1440px;margin:0 auto}.bs-top-bar{flex-shrink:0}
.back-btn-compact{display:flex;align-items:center;gap:6px;background:var(--accent-bg);border: 1px solid var(--accent-border);color:var(--accent-lighter);padding:6px 12px;border-radius:8px;cursor:pointer;transition:all .2s;font-size:.85rem}
.back-btn-compact:hover{background:var(--accent-bg);transform:translateX(-2px)}.arrow{width:16px;height:16px}
.bs-title{font-size:1.6rem;font-weight:700;color:var(--text-primary);margin:16px 0 16px}
.bs-lucide{display:inline-block;vertical-align:-2px;margin-right:2px}
.bs-three-col{display:grid;grid-template-columns:240px 1fr 280px;gap:16px;margin-bottom:24px}
.bs-controls-panel{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.bs-btn-group{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.bs-btn{display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:8px;border: 1px solid var(--border-default);background:rgba(100,116,139,.12);color:var(--text-tertiary);font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}
.bs-btn:hover:not(:disabled){background:rgba(100,116,139,.25)}.bs-btn:disabled{opacity:.4;cursor:not-allowed}
.bs-btn.active{background:var(--accent-bg);border-color: var(--accent-border)}.bs-icon{font-size:.9rem}
.bs-settings-toggle{width:100%;justify-content:center}
.bs-settings-body{display:flex;flex-direction:column;gap:8px;padding:8px;background:var(--bg-elevated);border-radius:8px}
.bs-setting-row label{font-size:.78rem;color:var(--text-muted)}.bs-slider{width:100%;cursor:pointer;accent-color: var(--accent-light)}
.bs-code-btn{width:100%;justify-content:center;background:var(--accent-bg)!important;border-color: var(--accent-border)!important;color:var(--accent-lighter)!important}
.bs-code-btn:hover{background:var(--accent-bg)!important}
.bs-info-block{font-size:.78rem;color:var(--text-muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px}
.bs-shortcuts h4{font-size:.78rem;color:var(--text-muted);margin:0 0 6px;font-weight:600}
.bs-shortcut-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 8px;font-size:.75rem;color:var(--text-muted)}
.bs-key{background:rgba(100,116,139,.25);padding:2px 6px;border-radius:4px;font-family:monospace;color:var(--accent-lighter);font-size:.72rem;text-align:center}
.bs-legend h4{font-size:.82rem;color:var(--text-primary);margin:0 0 8px}
.bs-legend-item{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:.78rem;color:var(--text-tertiary)}.bs-legend-item small{color:var(--text-dim)}
.bs-dot{width:14px;height:14px;border-radius:3px;flex-shrink:0;margin-top:2px}
.bs-dot.mc-start{background:#3b82f6}.bs-dot.mc-selecting{background:#f59e0b}.bs-dot.mc-trying{background:#a78bfa}.bs-dot.mc-assigned{background:#22c55e}.bs-dot.mc-conflict{background:#ef4444}.bs-dot.mc-backtrack{background:#f97316}.bs-dot.mc-success{background:#8b5cf6}
.bs-chart-area{display:flex;flex-direction:column;gap:10px}
.bs-chart-wrapper{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:12px;padding:16px 16px 8px;display:flex;flex-direction:column}
.bs-chart-footer{display:flex;justify-content:space-between;font-size:.72rem;color:var(--text-dim);padding:6px 0 4px}
.bs-scrubber{width:100%;accent-color: var(--accent-light);cursor:pointer;margin-top:4px}
.bs-status-bar{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:10px;padding:12px 20px;text-align:center;font-size:.9rem;color:var(--text-secondary);font-weight:500}
.bs-complexity-row{display:flex;justify-content:center;gap:32px}
.bs-complexity-badge{font-size:.82rem;color:var(--text-muted)}.bs-complexity-badge strong{color:var(--accent-lighter)}
/* Map SVG */
.mc-viz-container{display:flex;flex-direction:column;align-items:center;gap:12px;padding:8px 0}
.mc-svg{width:100%;max-width:520px;height:auto}
.mc-node-pulse{animation:mcPulse .8s ease infinite}
@keyframes mcPulse{0%,100%{filter:drop-shadow(0 0 4px rgba(245,158,11,.3))}50%{filter:drop-shadow(0 0 14px rgba(245,158,11,.6))}}
/* Status */
.mc-status-badge{padding:8px 18px;border-radius:10px;font-size:.82rem;font-weight:600;text-align:center;background:rgba(100,116,139,.1);border: 1px solid var(--border-default);color:var(--text-tertiary)}
.mc-sb-start{background:rgba(59,130,246,.08);border-color:rgba(59,130,246,.25);color:#93c5fd}
.mc-sb-selecting{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.25);color:#fbbf24}
.mc-sb-trying{background:rgba(167,139,250,.08);border-color:rgba(167,139,250,.25);color: var(--accent-light)}
.mc-sb-assigned{background:rgba(34,197,94,.08);border-color:rgba(34,197,94,.25);color: var(--success-text)}
.mc-sb-conflict{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.25);color: var(--error-text)}
.mc-sb-backtrack{background:rgba(249,115,22,.08);border-color:rgba(249,115,22,.25);color:#fdba74}
.mc-sb-success{background:rgba(139,92,246,.1);border-color:rgba(139,92,246,.3);color: var(--accent-light)}
/* Palette */
.mc-palette{display:flex;gap:10px;justify-content:center}
.mc-pal-chip{padding:4px 14px;border-radius:8px;font-size:.72rem;font-weight:700;color: var(--text-primary);opacity:.5;transition:all .2s;letter-spacing:.04em}
.mc-pal-active{opacity:1;transform:scale(1.1);box-shadow:0 0 12px rgba(255,255,255,.15)}
/* Inspector */
.bs-inspector{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:12px;padding:14px;overflow-y:auto;max-height:620px}
.bs-inspector::-webkit-scrollbar{width:4px}.bs-inspector::-webkit-scrollbar-thumb{background:rgba(100,116,139,.3);border-radius:2px}
.bs-inspector-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.bs-inspector-header h3{margin:0;font-size:1rem;color:var(--text-primary)}
.bs-step-badge{background:var(--accent-bg);border: 1px solid var(--accent-border);padding:3px 10px;border-radius:12px;font-size:.72rem;color:var(--accent-lighter);font-weight:600}
.bs-inspector-row{display:flex;justify-content:space-between;font-size:.78rem;color:var(--text-muted);margin-bottom:4px}
.bs-progress-track{width:100%;height:6px;background:rgba(100,116,139,.2);border-radius:3px;margin-bottom:16px;overflow:hidden}
.bs-progress-fill{height:100%;background: var(--accent);border-radius:3px;transition:width .25s}
.bs-inspector-label{font-size:.7rem;letter-spacing:.06em;color:var(--text-dim);margin:14px 0 6px;font-weight:700}
.bs-metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.bs-metric{display:flex;flex-direction:column}.bs-metric-label{font-size:.7rem;color:var(--text-dim)}.bs-metric-value{font-size:1.15rem;font-weight:700;color:var(--text-primary)}
.mc-conf-val{color:#ef4444!important}.mc-bt-val{color:#f97316!important}
.bs-step-detail{background:var(--bg-elevated);padding:8px 10px;border-radius:6px;font-size:.78rem;color:var(--text-tertiary);font-family:'Fira Code',monospace}
/* Assignments */
.mc-assign-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.mc-assign-item{display:flex;justify-content:space-between;align-items:center;padding:4px 8px;background:rgba(10, 10, 10,.4);border-radius:6px;font-size:.78rem}
.mc-assign-region{font-weight:700;color:var(--text-tertiary)}.mc-assign-cur{color:#fbbf24!important}
.mc-assign-color{font-weight:700;font-family:'Fira Code',monospace}.mc-assign-none{color:var(--text-faint)}
/* Adjacency */
.mc-adj-list{background:var(--bg-elevated);padding:6px 8px;border-radius:6px;max-height:120px;overflow-y:auto;font-size:.72rem}
.mc-adj-list::-webkit-scrollbar{width:3px}.mc-adj-list::-webkit-scrollbar-thumb{background:rgba(100,116,139,.3);border-radius:2px}
.mc-adj-item{display:flex;gap:6px;padding:2px 0;color:var(--text-muted)}.mc-adj-cur{color:#fbbf24;font-weight:600}
.mc-adj-r{font-weight:700;min-width:28px}.mc-adj-n{color:var(--text-dim)}
/* Action log */
.mc-action-log{background:var(--bg-elevated);padding:6px 8px;border-radius:6px;max-height:130px;overflow-y:auto}
.mc-action-log::-webkit-scrollbar{width:3px}.mc-action-log::-webkit-scrollbar-thumb{background:rgba(100,116,139,.3);border-radius:2px}
.mc-act-entry{display:flex;align-items:center;gap:6px;font-size:.72rem;color:var(--text-muted);padding:2px 0}
.mc-act-cur{color:var(--accent-lighter);font-weight:600}
.mc-act-num{font-weight:700;color:var(--text-dim);font-family:'Fira Code',monospace;min-width:24px}
.mc-act-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.mc-act-dot.mc-assigned{background:#22c55e}.mc-act-dot.mc-conflict{background:#ef4444}.mc-act-dot.mc-backtrack{background:#f97316}
.mc-act-text{flex:1}.mc-no-log{font-size:.72rem;color:var(--text-faint);font-style:italic}
/* Sections */
.bs-section{background:var(--bg-card);border: 1px solid var(--border-default);border-radius:12px;margin-bottom:12px;overflow:hidden}
.bs-section-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:14px 18px;background:none;border:none;color:var(--text-secondary);font-size:1rem;font-weight:600;cursor:pointer;text-align:left;transition:background .15s}
.bs-section-toggle:hover{background:rgba(100,116,139,.1)}
.bs-info-circle{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:var(--accent-bg);border: 1px solid var(--accent-border);color:var(--accent-lighter);font-size:.82rem;font-weight:700;flex-shrink:0}
.bs-section-body{padding:0 20px 20px;color:var(--text-tertiary);font-size:.88rem;line-height:1.7}
.bs-section-body h2{font-size:1.15rem;color:var(--text-primary);margin:0 0 8px}
.bs-section-body h3{font-size:.95rem;color:var(--accent-lighter);margin:16px 0 6px}
.bs-section-body ol,.bs-section-body ul{padding-left:20px;margin:4px 0}
.bs-section-body li{margin-bottom:3px}
.bs-edge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
.bs-edge-card{background:var(--bg-elevated);border: 1px solid var(--border-default);border-radius:10px;padding:14px;cursor:default;transition:all .15s}
.bs-edge-card:hover{border-color: var(--accent-border);background:var(--accent-bg)}
.bs-edge-card strong{display:block;color:var(--text-primary);font-size:.88rem;margin-bottom:4px}
.bs-edge-card small{color:var(--text-dim);font-size:.78rem}
@media(max-width:1100px){.bs-three-col{grid-template-columns:1fr;gap:16px}.bs-chart-area{order:-1}.bs-controls-panel{order:1}.bs-inspector{order:2;max-height:none}}
@media(max-width:768px){.bs-shortcuts{display:none}.bs-legend{display:none}.bs-controls-panel{padding:10px}}
@media(max-width:640px){.bs-edge-grid{grid-template-columns:1fr}.bs-page{padding:10px 12px 24px}.mc-assign-grid{grid-template-columns:1fr}}
</style>
