<template>
    <div class="aim-overlay" @click.self="$emit('close')">
        <div class="aim-modal">
            <div class="aim-modal-header">
                <h2>{{ info.name || 'Algorithm Info' }}</h2>
                <button class="aim-close-btn" @click="$emit('close')">×</button>
            </div>

            <div class="aim-grid">
                <div v-if="info.best" class="aim-badge-row">
                    <span class="aim-label">Best</span>
                    <span class="aim-badge aim-green">{{ info.best }}</span>
                </div>

                <div v-if="info.average" class="aim-badge-row">
                    <span class="aim-label">Average</span>
                    <span class="aim-badge aim-yellow">{{ info.average }}</span>
                </div>

                <div v-if="info.worst" class="aim-badge-row">
                    <span class="aim-label">Worst</span>
                    <span class="aim-badge aim-red">{{ info.worst }}</span>
                </div>

                <div v-if="info.space" class="aim-badge-row">
                    <span class="aim-label">Space</span>
                    <span class="aim-badge aim-blue">{{ info.space }}</span>
                </div>

                <div v-if="info.stable !== undefined" class="aim-badge-row">
                    <span class="aim-label">Stable</span>
                    <span class="aim-badge">{{ info.stable === true || info.stable === 'Yes' ? 'Yes' : (info.stable === 'N/A' ? 'N/A' : 'No') }}</span>
                </div>

                <div v-if="info.inPlace !== undefined" class="aim-badge-row">
                    <span class="aim-label">In-place</span>
                    <span class="aim-badge">{{ info.inPlace === true || info.inPlace === 'Yes' ? 'Yes' : (info.inPlace === 'N/A' ? 'N/A' : 'No') }}</span>
                </div>
            </div>

            <p v-if="info.description" class="aim-desc">{{ info.description }}</p>
        </div>
    </div>
</template>

<script setup>
defineProps({ info: Object })
</script>
<style scoped>
.aim-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 16px;
}

.aim-modal {
    width: 100%;
    max-width: 440px;
    background: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    color: var(--text-primary);
    border: 1px solid var(--border-default);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.08);
    max-height: 90vh;
    overflow-y: auto;
}

.aim-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 12px;
}

.aim-modal-header h2 {
    margin: 0;
    padding: 0;
    font-size: 1.25rem;
    color: var(--text-primary);
    line-height: 1.3;
}

.aim-close-btn {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid var(--accent-border);
    color: var(--accent-light);
    width: 36px;
    height: 36px;
    min-width: 36px;
    padding: 0;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.aim-close-btn:hover {
    background: rgba(99, 102, 241, 0.35);
}

.aim-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 16px 0;
}

.aim-badge-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    background: var(--bg-input);
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid var(--border-light);
}

.aim-label {
    color: var(--text-muted);
    font-size: 0.82rem;
    font-weight: 500;
    white-space: nowrap;
}

.aim-badge {
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary);
    white-space: nowrap;
}

.aim-badge.aim-green {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
}

.aim-badge.aim-yellow {
    background: rgba(234, 179, 8, 0.2);
    color: #eab308;
}

.aim-badge.aim-red {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.aim-badge.aim-blue {
    background: rgba(99, 102, 241, 0.2);
    color: var(--accent-light);
}

.aim-desc {
    color: var(--text-muted);
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.6;
}

@media (max-width: 480px) {
    .aim-modal {
        padding: 18px;
    }
    .aim-modal-header h2 {
        font-size: 1.1rem;
    }
    .aim-grid {
        grid-template-columns: 1fr;
        gap: 8px;
    }
    .aim-badge-row {
        padding: 7px 10px;
    }
    .aim-desc {
        font-size: 0.82rem;
    }
}
</style>
