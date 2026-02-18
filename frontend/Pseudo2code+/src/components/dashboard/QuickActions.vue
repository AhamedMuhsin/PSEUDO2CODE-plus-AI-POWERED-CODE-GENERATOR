<template>
  <div class="quick-actions spacing">
    <h3 class="card-title">Quick Actions</h3>

    <ul class="actions-list">
      <li class="action-item" @click="goTo('/generate-code')">
        <span class="icon code">
          <Sparkles size="20" />
        </span>
        <span class="action-text">Generate Code</span>
        <span class="action-arrow">→</span>
      </li>

      <li class="action-item" @click="goTo('/visualize-playground')">
        <span class="icon visual">
          <Eye size="20" />
        </span>
        <span class="action-text">Visualize Code</span>
        <span class="action-arrow">→</span>
      </li>

      <li class="action-item" @click="goTo('/algorithm-hub')">
        <span class="icon algo">
          <Brain size="20" />
        </span>
        <span class="action-text">Algorithm Visualizer</span>
        <span class="action-arrow">→</span>
      </li>

      <li class="action-item" @click="goTo('/history')">
        <span class="icon history">
          <Clock size="20" />
        </span>
        <span class="action-text">Activity History</span>
        <span class="action-arrow">→</span>
      </li>

      <li class="action-item" @click="goTo('/badges')">
        <span class="icon badge">
          <Trophy size="20" />
        </span>
        <span class="action-text">Badges</span>
        <span class="action-arrow">→</span>
      </li>

      <li class="action-item" @click="goTo('/leaderboard')">
        <span class="icon leaderboard">
          <BarChart3 size="20" />
        </span>
        <span class="action-text">Leaderboard</span>
        <span class="action-arrow">→</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Sparkles, Eye, Clock, Trophy, BarChart3,Brain } from "lucide-vue-next";

const router = useRouter();

const goTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.spacing {
  margin-bottom: 30px;
  margin-top: 30px;
}

.quick-actions {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.quick-actions:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-title {
  margin-bottom: 24px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 24px 0;
}

.actions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-item:hover {
  background: var(--bg-hover);
  border-color: var(--accent-border);
  transform: translateX(4px);
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon.code {
  background: rgba(59, 130, 246, 0.15);
  color: var(--accent-light);
}

.icon.visual {
  background: rgba(168, 85, 247, 0.15);
  color: var(--accent-lighter);
}

.icon.algo {
  background: rgba(247, 85, 236, 0.15);
  color: #fc84f2;
}

.icon.history {
  background: rgba(34, 197, 94, 0.15);
  color: var(--success);
}

.icon.badge {
  background: rgba(189, 197, 34, 0.15);
  color: #d9de4a;
}

.icon.leaderboard {
  background: rgba(197, 34, 34, 0.15);
  color: #d91212;
}

.action-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  flex: 1;
}

.action-arrow {
  color: var(--accent);
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.action-item:hover .action-arrow {
  opacity: 1;
}
</style>
