<template>
  <nav class="bottom-nav">
    <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-item"
      :class="{ active: isActive(item.to) }">
      <component :is="item.icon" :size="22" class="nav-icon" />
      <span class="nav-label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Code, Eye, Brain, Clock, Trophy, BarChart3 } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { to: '/generate-code', label: 'Generate', icon: Code },
  { to: '/visualize-playground', label: 'Visualize', icon: Eye },
  { to: '/algorithm-hub', label: 'Algo Hub', icon: Brain },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/badges', label: 'Badges', icon: Trophy },
]

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.bottom-nav {
  display: none;
}

@media (max-width: 1024px) {
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 900;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 64px;
    background: var(--bg-navbar);
    border-top: 1px solid var(--accent-border);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding: 0 4px;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    flex: 1;
    padding: 8px 2px;
    text-decoration: none;
    color: var(--text-dim);
    transition: color 0.2s ease;
    position: relative;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 32px;
    height: 2px;
    background: var(--accent);
    border-radius: 0 0 2px 2px;
    transition: transform 0.25s ease;
  }

  .nav-item.active {
    color: var(--accent-light);
  }

  .nav-item.active::before {
    transform: translateX(-50%) scaleX(1);
  }

  .nav-item:active {
    color: var(--accent-lighter);
  }

  .nav-icon {
    flex-shrink: 0;
  }

  .nav-label {
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60px;
    text-align: center;
  }
}
</style>
