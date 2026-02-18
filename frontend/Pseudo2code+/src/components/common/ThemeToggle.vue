<template>
  <div class="theme-toggle" :class="variant">
    <button
      v-for="opt in options"
      :key="opt.value"
      class="theme-option"
      :class="{ active: themeStore.preference === opt.value }"
      @click="themeStore.setPreference(opt.value)"
      :title="opt.label"
      :aria-label="opt.label"
    >
      <component :is="opt.icon" :size="variant === 'mobile' ? 18 : 15" />
      <span v-if="variant === 'mobile'" class="option-label">{{ opt.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { useThemeStore } from '@/stores/themeStore'
import { Moon, Sun, Monitor } from 'lucide-vue-next'

defineProps({
  variant: {
    type: String,
    default: 'desktop', // 'desktop' | 'mobile'
  },
})

const themeStore = useThemeStore()

const options = [
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'system', label: 'System', icon: Monitor },
]
</script>

<style scoped>
/* ════════ DESKTOP: Compact pill toggle ════════ */
.theme-toggle.desktop {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: 10px;
  padding: 3px;
}

.theme-toggle.desktop .theme-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 28px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.25s ease;
}

.theme-toggle.desktop .theme-option:hover {
  color: var(--text-secondary);
  background: var(--bg-hover);
}

.theme-toggle.desktop .theme-option.active {
  background: var(--accent);
  color: var(--text-on-accent);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
}

.theme-toggle.desktop .option-label {
  display: none;
}

/* ════════ MOBILE: Full-width options ════════ */
.theme-toggle.mobile {
  display: flex;
  gap: 6px;
  padding: 8px 12px;
}

.theme-toggle.mobile .theme-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 6px;
  border: 1px solid var(--border-default);
  border-radius: 10px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.theme-toggle.mobile .theme-option:hover {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.theme-toggle.mobile .theme-option.active {
  background: var(--accent-bg);
  border-color: var(--accent-border);
  color: var(--accent-light);
}
</style>
