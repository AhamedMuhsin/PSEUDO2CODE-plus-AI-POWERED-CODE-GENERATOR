<template>
    <div class="badge-progress-card">
        <h3>Badge Progress</h3>

        <div class="progress-stats">
            <div class="stat-row">
                <span>Earned</span>
                <strong>{{ earned }}</strong>
            </div>

            <div class="stat-row">
                <span>Locked</span>
                <strong>{{ locked }}</strong>
            </div>
        </div>


        <div class="progress-bar">
            <div class="progress-fill" :style="{ width: percent + '%' }"></div>
        </div>

        <p class="progress-text">{{ percent }}% Complete</p>
    </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    earned: Number,
    locked: Number
})

const percent = computed(() => {
    const total = props.earned + props.locked
    return total ? Math.round((props.earned / total) * 100) : 0
})
</script>

<style scoped>
.badge-progress-card {
    background: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--border-default);
    box-shadow: var(--shadow-md);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.badge-progress-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.progress-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
}

.progress-bar {
    margin-top: 12px;
    height: 8px;
    background: var(--bg-page);
    border-radius: 999px;
}

.progress-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
}

.stat-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: var(--text-tertiary);
}

.stat-row strong {
    color: var(--text-primary);
}

.stat-row:first-child strong {
    color: #22d3ee;
    /* Earned */
}

.stat-row:last-child strong {
    color: var(--text-muted);
    /* Locked */
}

.progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 999px;
}

.progress-text {
    margin-top: 8px;
    font-size: 0.8rem;
    color: var(--text-muted);
}
</style>
