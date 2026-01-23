<template>
  <div class="profile-card">
    <!-- User Info -->
    <div class="user">
      <div class="avatar">{{ initials }}</div>
      <div>
        <h3>{{ name }}</h3>
        <p class="email">{{ email }}</p>
      </div>
    </div>

    <!-- Level -->
    <div class="level">
      <span>Level {{ level }}</span>
      <span class="xp">{{ xp }} / {{ nextXp }} XP</span>
    </div>

    <!-- Progress Bar -->
    <div class="progress">
      <div class="fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <!-- Extra Stats -->
    <div class="stats">
      <div class="stat-item">
        <Trophy size="16" />
        <span>{{ totalXp }} Total XP</span>
      </div>
      <div class="stat-item" :class="streakActiveToday ? 'streak-active' : 'streak-warning'">
        <Flame size="16" />
        <span>
          {{ streak }} Day Streak
          <small v-if="streak === 1 && !streakActiveToday"> (start today)</small>
          <small v-else-if="streak >= 2 && !streakActiveToday"> (at risk)</small>
        </span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from "vue";
import { Trophy, Flame } from "lucide-vue-next";

const props = defineProps({
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  nextXp: { type: Number, default: 100 },
  totalXp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  streakActiveToday: { type: Boolean, default: false },
});


const progressPercent = computed(() => {
  if (!props.nextXp || !props.nextXp) {
    return 0;
  }
  return Math.min((props.xp / props.nextXp) * 100, 100);
});

const initials = computed(() => {
  if (!props.name || typeof props.name !== "string") {
    return "";
  }

  return props.name
    .trim()
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
});

</script>
<style scoped>
.profile-card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
}

.streak-active {
  color: #f97316;
}

.streak-warning {
  color: #ef4444;
}

.streak-warning small {
  font-size: 11px;
  opacity: 0.85;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.avatar {
  box-shadow: 0 0 0 2px rgba(96, 165, 250, .3),
    0 0 20px rgba(96, 165, 250, .25);
  transition: transform .2s ease;
}

.avatar:hover {
  transform: scale(1.05);
}


.email {
  font-size: 13px;
  color: #94a3b8;
}

.level {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.xp {
  color: #94a3b8;
}

.progress {
  height: 6px;
  background: #1e293b;
  border-radius: 8px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: #6366f1;
}

.stats {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e5e7eb;
}

.stat-item:first-child {
  color: #fbbf24;
}

.stat-item:last-child {
  color: #ef4444;
}
</style>
