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
    background: rgba(15, 23, 42, 0.85);
    border-radius: 16px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rank-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
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
