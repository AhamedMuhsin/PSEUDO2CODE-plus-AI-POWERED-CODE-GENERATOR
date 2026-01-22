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
        <div class="avatar">
          {{ initials(user.name) }}
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
  background: linear-gradient(145deg, #0b1220, #0e1628);
  border-radius: 18px;
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
  color: #64748b;
  font-size: 0.85rem;
}

.table-header {
  color: #94a3b8;
  font-size: 0.85rem;
  border-bottom: 1px solid #1e293b;
}

.badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(circle at top, #1e293b, #020617);
  display: grid;
  place-items: center;
  font-size: 1rem;
  border: 1px solid #1e293b;
}

/* 🥇 Gold */
.rank-gold {
  background: linear-gradient(135deg,
      rgba(234, 179, 8, 0.18),
      rgba(234, 179, 8, 0.05));
}

.rank-gold .rank-badge {
  background: linear-gradient(135deg, #facc15, #eab308);
  color: #1e293b;
  box-shadow: 0 0 18px rgba(234, 179, 8, 0.6);
}

/* 🥈 Silver */
.rank-silver {
  background: linear-gradient(135deg,
      rgba(148, 163, 184, 0.18),
      rgba(148, 163, 184, 0.05));
}

.rank-silver .rank-badge {
  background: linear-gradient(135deg, #e5e7eb, #94a3b8);
  color: #020617;
  box-shadow: 0 0 14px rgba(148, 163, 184, 0.5);
}

/* 🥉 Bronze */
.rank-bronze {
  background: linear-gradient(135deg,
      rgba(180, 83, 9, 0.2),
      rgba(180, 83, 9, 0.06));
}

.rank-bronze .rank-badge {
  background: linear-gradient(135deg, #f97316, #b45309);
  color: #fff7ed;
  box-shadow: 0 0 14px rgba(180, 83, 9, 0.6);
}

.table-row {
  border-bottom: 1px solid #020617;
  transition: background 0.2s ease;
}

.table-row:hover {
  background: rgba(99, 102, 241, 0.06);
}

.table-row.me {
  background: rgba(99, 102, 241, 0.12);
}

.table-row.me {
  background: rgba(99, 102, 241, 0.12);
}

.rank-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #020617;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #e5e7eb;
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
  background: #6366f1;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: white;
}

.name {
  font-weight: 600;
  color: #f8fafc;
}

.you {
  margin-left: 6px;
  font-size: 0.75rem;
  color: #60a5fa;
}

.metric-value {
  font-weight: 700;
  color: #f8fafc;
}

.badges {
  display: flex;
  gap: 8px;
}

.badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #020617;
  display: grid;
  place-items: center;
  font-size: 0.9rem;
}
</style>
