<template>
  <div class="leaderboard-table">
    <!-- Header -->
    <div class="table-header">
      <span>Rank</span>
      <span>User</span>
      <span class="metric">{{ metricLabel }}</span>
      <span>Badges</span>
    </div>

    <!-- Rows -->
    <div v-for="user in items" :key="user.uid" class="table-row" :class="[
      rankClass(user.rank),
      { me: user.uid === currentUid }
    ]">

      <!-- Rank -->
      <div class="rank">
        <span class="rank-badge">{{ user.rank }}</span>
      </div>

      <!-- User -->
      <div class="user">
        <div class="avatar" :style="{ backgroundImage: user.avatar ? `url(${user.avatar})` : '' }">
          {{ !user.avatar ? initials(user.name) : '' }}
        </div>
        <div class="name">
          {{ user.name }}
          <span v-if="user.uid === currentUid" class="you">(You)</span>
        </div>
      </div>

      <!-- Metric -->
      <div class="metric-value">
        {{ formatMetric(user) }}
      </div>

      <!-- Badges -->
      <div class="badges">
        <span v-if="!user.badges || user.badges.length === 0" class="badge muted">
          —
        </span>

        <span v-for="(badge, idx) in user.badges" :key="idx" class="badge">
          {{ badge }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue"

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  metric: {
    type: String,
    required: true
  },
  currentUid: {
    type: [String, null],
    default: null,
    required: true
  }
})

const metricLabel = computed(() => {
  switch (props.metric) {
    case "level": return "Level"
    case "codes": return "Codes"
    case "visualizations": return "Visualizations"
    default: return "Total XP"
  }
})

const formatMetric = (user) => {
  switch (props.metric) {
    case "level":
      return `Level ${user.level}`
    case "codes":
      return user.codes_generated
    case "visualizations":
      return user.visualizations
    default:
      return `${user.xp.toLocaleString()} XP`
  }
}
const rankClass = (rank) => {
  if (rank === 1) return "rank-gold"
  if (rank === 2) return "rank-silver"
  if (rank === 3) return "rank-bronze"
  return ""
}

const initials = (name = "") =>
  name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
</script>
<style scoped>
.leaderboard-table {
  margin-top: 26px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 80px 1.5fr 1fr 1fr;
  align-items: center;
  padding: 16px 22px;
}

.badge.muted {
  color: var(--text-dim);
  font-size: 0.85rem;
}

.table-header {
  color: var(--text-muted);
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border-default);
}

.badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-page);
  display: grid;
  place-items: center;
  font-size: 1rem;
  border: 1px solid var(--border-default);
}

/* 🥇 Gold */
.rank-gold {
  background: rgba(234, 179, 8, 0.05);
}

.rank-gold .rank-badge {
  background: #eab308;
  color: #000;
  box-shadow: 0 0 18px rgba(234, 179, 8, 0.6);
}

/* 🥈 Silver */
.rank-silver {
  background: rgba(148, 163, 184, 0.05);
}

.rank-silver .rank-badge {
  background: #94a3b8;
  color: #000;
  box-shadow: 0 0 14px rgba(148, 163, 184, 0.5);
}

/* 🥉 Bronze */
.rank-bronze {
  background: rgba(180, 83, 9, 0.06);
}

.rank-bronze .rank-badge {
  background: #b45309;
  color: #fff;
  box-shadow: 0 0 14px rgba(180, 83, 9, 0.6);
}

.table-row {
  border-bottom: 1px solid var(--border-light);
  transition: background 0.2s ease;
}

.table-row:hover {
  background: var(--bg-hover);
}

.table-row.me {
  background: var(--accent-bg);
}

.table-row.me {
  background: var(--accent-bg);
}

.rank-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--bg-page);
  display: grid;
  place-items: center;
  font-weight: 700;
  color: var(--text-secondary);
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--accent);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
}

.name {
  font-weight: 600;
  color: var(--text-primary);
}

.you {
  margin-left: 6px;
  font-size: 0.75rem;
  color: var(--accent-light);
}

.metric-value {
  font-weight: 700;
  color: var(--text-primary);
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-page);
  display: grid;
  place-items: center;
  font-size: 0.9rem;
}

/* ===== Mobile Responsive ===== */
@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 50px 1.2fr 0.8fr 0.8fr;
    padding: 12px 14px;
    gap: 6px;
  }

  .rank-badge {
    width: 30px;
    height: 30px;
    font-size: 0.85rem;
    border-radius: 8px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }

  .user {
    gap: 8px;
  }

  .name {
    font-size: 0.85rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100px;
  }

  .metric-value {
    font-size: 0.82rem;
  }

  .table-header {
    font-size: 0.78rem;
  }

  .badge {
    width: 26px;
    height: 26px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .table-header,
  .table-row {
    grid-template-columns: 42px 1.3fr 0.7fr;
    padding: 10px 10px;
  }

  /* Hide badges column on very small screens */
  .table-header span:nth-child(4),
  .table-row .badges {
    display: none;
  }

  .rank-badge {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }

  .avatar {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }

  .user {
    gap: 6px;
  }

  .name {
    font-size: 0.8rem;
    max-width: 80px;
  }

  .you {
    display: none;
  }

  .metric-value {
    font-size: 0.78rem;
  }

  .table-header {
    font-size: 0.75rem;
  }
}
</style>
