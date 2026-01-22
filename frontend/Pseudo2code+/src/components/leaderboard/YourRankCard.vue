<template>
  <div class="rank-card">
    <h3>Your Rank</h3>

    <div class="row">
      <span>Global Rank</span>
      <strong>#{{ rank }}</strong>
    </div>

    <div class="row">
      <span>This Month</span>
      <strong :class="{ up: monthlyChange > 0 }">
        {{ monthlyChange > 0 ? `+${monthlyChange}` : monthlyChange }}
      </strong>
    </div>

    <div class="row">
      <span>Next Rank</span>
      <strong>{{ nextRankXp }} XP needed</strong>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rank: Number,
  monthlyChange: {
    type: Number,
    default: 0
  },
  nextRankXp: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.rank-card {
  background: linear-gradient(145deg, #0b1220, #0e1628);
  border-radius: 18px;
  padding: 20px;
  color: #f8fafc;
}

.rank-card h3 {
  font-size: 1.1rem;
  margin-bottom: 14px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: #94a3b8;
}

.row strong {
  color: #f8fafc;
}

.up {
  color: #22c55e;
}
</style>
