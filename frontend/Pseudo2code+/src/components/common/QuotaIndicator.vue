<template>
  <div v-if="!userStore.isPremium" class="quota-card">
    <div class="quota-title">Free Plan Usage</div>

    <!-- Code Generations -->
    <div v-if="showCodeGenerations" class="q-row">
      <div class="q-meta">
        <span class="q-emoji">💻</span>
        <span class="q-label">Code Generations</span>
        <span class="q-count" :class="quotaClass(remaining.code)">{{ remaining.code }}/{{ limits.code }}</span>
      </div>
      <div class="q-bar"><div class="q-fill" :style="{ width: barWidth(remaining.code, limits.code) }"></div></div>
    </div>

    <!-- Visualizations -->
    <div v-if="showVisualizations" class="q-row">
      <div class="q-meta">
        <span class="q-emoji">📊</span>
        <span class="q-label">Visualizations</span>
        <span class="q-count" :class="quotaClass(remaining.viz)">{{ remaining.viz }}/{{ limits.viz }}</span>
      </div>
      <div class="q-bar"><div class="q-fill" :style="{ width: barWidth(remaining.viz, limits.viz) }"></div></div>
    </div>

    <!-- Downloads -->
    <div v-if="showDownloads" class="q-row">
      <div class="q-meta">
        <span class="q-emoji">⬇️</span>
        <span class="q-label">Downloads</span>
        <span class="q-count" :class="quotaClass(remaining.downloads)">{{ remaining.downloads }}/{{ limits.downloads }}</span>
      </div>
      <div class="q-bar"><div class="q-fill" :style="{ width: barWidth(remaining.downloads, limits.downloads) }"></div></div>
    </div>

    <!-- Upgrade CTA -->
    <button v-if="showUpgradeCTA" class="q-upgrade" @click="$emit('upgrade')">
      🔓 Upgrade to <strong>Premium</strong>
    </button>
  </div>

  <!-- Premium badge (compact) -->
  <div v-else class="quota-card premium-card">
    <span class="premium-line">⭐ Premium Member — Unlimited features</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const props = defineProps({
  showCodeGenerations: {
    type: Boolean,
    default: true,
  },
  showVisualizations: {
    type: Boolean,
    default: true,
  },
  showDownloads: {
    type: Boolean,
    default: false,
  },
  showUpgradeCTA: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['upgrade'])

const userStore = useUserStore()

const remaining = computed(() => ({
  code: userStore.quotas?.code_generations?.remaining ?? 20,
  viz: userStore.quotas?.visualizations?.remaining ?? 10,
  downloads: userStore.quotas?.downloads?.remaining ?? 5,
}))

const limits = computed(() => ({
  code: userStore.quotas?.code_generations?.limit ?? 20,
  viz: userStore.quotas?.visualizations?.limit ?? 10,
  downloads: userStore.quotas?.downloads?.limit ?? 5,
}))

function barWidth(remaining, total) {
  if (!total) return '0%'
  return Math.max(0, Math.min(100, (remaining / total) * 100)) + '%'
}

function quotaClass(remaining) {
  if (remaining === 0) return 'quota-empty'
  if (remaining <= 3) return 'quota-warning'
  if (remaining <= 10) return 'quota-caution'
  return 'quota-ok'
}
</script>

<style scoped>
/* ---- Card shell — matches ProfileCard / QuickActions ---- */
.quota-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 14px 16px;
  margin-top: 10px;
  box-shadow: var(--shadow-md);
}

.quota-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: 10px;
}

/* ---- Quota row ---- */
.q-row { margin-bottom: 10px; }
.q-row:last-of-type { margin-bottom: 0; }

.q-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}

.q-emoji { font-size: 0.82rem; }

.q-label {
  flex: 1;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.q-count {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
  line-height: 1;
}
.q-count.quota-ok      { background: rgba(34,197,94,0.15); color: #22c55e; }
.q-count.quota-caution  { background: rgba(234,179,8,0.15); color: #eab308; }
.q-count.quota-warning  { background: rgba(249,115,22,0.15); color: #f97316; }
.q-count.quota-empty    { background: rgba(239,68,68,0.15); color: #ef4444; }

/* ---- Progress bar ---- */
.q-bar {
  height: 5px;
  border-radius: 3px;
  background: var(--border-default);
  overflow: hidden;
}

.q-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--accent);
  transition: width 0.35s ease;
}

/* ---- Upgrade button ---- */
.q-upgrade {
  display: block;
  width: 100%;
  margin-top: 12px;
  padding: 8px 0;
  border: 1px solid var(--accent-border, var(--accent));
  background: var(--accent-bg, rgba(99,102,241,0.08));
  color: var(--accent);
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s, transform 0.15s;
}
.q-upgrade:hover {
  background: var(--accent);
  color: #fff;
  transform: translateY(-1px);
}

/* ---- Premium state ---- */
.premium-card {
  text-align: center;
}
.premium-line {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* ---- Mobile tweak ---- */
@media (max-width: 640px) {
  .quota-card { padding: 12px 14px; }
}
</style>
