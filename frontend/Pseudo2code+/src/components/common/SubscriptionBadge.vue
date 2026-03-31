<template>
  <div class="subscription-badge">
    <router-link to="/pricing" class="badge-link">
      <span v-if="userStore.isPremium" class="badge premium">
        <span class="icon">⭐</span>
        <span class="text">Premium</span>
      </span>
      <span v-else class="badge free">
        <span class="icon">🔓</span>
        <span class="text">Free</span>
      </span>
    </router-link>

    <!-- Quota Warning Pill (Free users only) -->
    <div
      v-if="userStore.isFree && userStore.quotas && showQuotaWarning"
      class="quota-warning-pill"
      :class="quotaWarningClass"
    >
      <span class="warning-icon">⚠️</span>
      <span class="warning-text">{{ quotaWarningText }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const remainingCodes = computed(() => userStore.quotas?.code_generations?.remaining ?? null)

const showQuotaWarning = computed(() => {
  return remainingCodes.value !== null && remainingCodes.value <= 5
})

const quotaWarningClass = computed(() => {
  if (!remainingCodes.value) return 'critical'
  if (remainingCodes.value <= 2) return 'critical'
  return 'warning'
})

const quotaWarningText = computed(() => {
  if (remainingCodes.value === 0) return 'No generations left'
  if (remainingCodes.value === 1) return '1 generation left'
  return `${remainingCodes.value} generations left`
})
</script>

<style scoped>
.subscription-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-link {
  text-decoration: none;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
}

.badge.premium {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.badge.premium:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.badge.free {
  background: #667eea;
  color: white;
}

.badge.free:hover {
  background: #5568d3;
  transform: scale(1.05);
}

.icon {
  font-size: 14px;
}

.quota-warning-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.quota-warning-pill.warning {
  background: rgba(255, 193, 7, 0.2);
  color: #ff9800;
  border: 1px solid #ff9800;
}

.quota-warning-pill.critical {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid #f44336;
}

.warning-icon {
  font-size: 12px;
}

.warning-text {
  white-space: nowrap;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 640px) {
  .badge {
    padding: 4px 10px;
    font-size: 11px;
  }

  .icon {
    font-size: 12px;
  }

  .quota-warning-pill {
    display: none;
  }
}
</style>
