<template>
  <div class="quick-actions spacing">
    <h3 class="card-title">Quick Actions</h3>

    <ul class="actions-list">
      <li class="action-item" @click="goTo('/generate-code')">
        <span class="icon code"><Sparkles size="20" /></span>
        <span class="action-text">Generate Code</span>
        <span class="action-arrow">→</span>
      </li>

      <li class="action-item" @click="goTo('/visualize-playground')">
        <span class="icon visual"><Eye size="20" /></span>
        <span class="action-text">Visualize Code</span>
        <span class="action-arrow">→</span>
      </li>

      <li class="action-item" @click="goTo('/history')">
        <span class="icon history"><Clock size="20" /></span>
        <span class="action-text">View History</span>
        <span class="action-arrow">→</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Sparkles, Eye, Clock } from "lucide-vue-next";

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
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.card-title {
  margin-bottom: 24px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f1f5f9;
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
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-item:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.4);
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
  color: #60a5fa;
}

.icon.visual {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
}

.icon.history {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.action-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e5e7eb;
  flex: 1;
}

.action-arrow {
  color: #6366f1;
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.action-item:hover .action-arrow {
  opacity: 1;
}
</style>
