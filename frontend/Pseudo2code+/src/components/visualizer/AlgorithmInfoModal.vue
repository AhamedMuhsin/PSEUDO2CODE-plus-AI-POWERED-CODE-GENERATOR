<template>
    <div class="overlay" @click.self="$emit('close')">
        <div class="modal">
            <div class="modal-header">
                <h2>{{ info.name || 'Algorithm Info' }}</h2>
                <button class="close-btn" @click="$emit('close')">×</button>
            </div>

            <div class="grid">
                <div v-if="info.best" class="badge-row">
                    <span class="label">Best</span>
                    <span class="badge green">{{ info.best }}</span>
                </div>

                <div v-if="info.average" class="badge-row">
                    <span class="label">Average</span>
                    <span class="badge yellow">{{ info.average }}</span>
                </div>

                <div v-if="info.worst" class="badge-row">
                    <span class="label">Worst</span>
                    <span class="badge red">{{ info.worst }}</span>
                </div>

                <div v-if="info.space" class="badge-row">
                    <span class="label">Space</span>
                    <span class="badge blue">{{ info.space }}</span>
                </div>

                <div v-if="info.stable !== undefined" class="badge-row">
                    <span class="label">Stable</span>
                    <span class="badge">{{ info.stable ? 'Yes' : 'No' }}</span>
                </div>

                <div v-if="info.inPlace !== undefined" class="badge-row">
                    <span class="label">In-place</span>
                    <span class="badge">{{ info.inPlace ? 'Yes' : 'No' }}</span>
                </div>
            </div>

            <p v-if="info.description" class="desc">{{ info.description }}</p>
        </div>
    </div>
</template>

<script setup>
defineProps({ info: Object })
</script>
<style>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: grid;
    place-items: center;
    z-index: 100;
}

.modal {
    width: 420px;
    background: #020617;
    border-radius: 16px;
    padding: 24px;
    color: white;
}

.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 16px 0;
}

.desc {
    color: #94a3b8;
    margin-bottom: 20px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h2 {
    margin: 0;
    padding: 0;
}

.close-btn {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #a78bfa;
    width: 36px;
    height: 36px;
    padding: 0;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: rgba(99, 102, 241, 0.35);
}
.badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  color: #94a3b8;
  font-size: 0.85rem;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  background: rgba(255,255,255,0.08);
  color: white;
}

/* Complexity colors */
.badge.green {
  background: rgba(34,197,94,0.2);
  color: #22c55e;
}

.badge.yellow {
  background: rgba(234,179,8,0.2);
  color: #eab308;
}

.badge.red {
  background: rgba(239,68,68,0.2);
  color: #ef4444;
}

.badge.blue {
  background: rgba(99,102,241,0.2);
  color: #818cf8;
}
</style>
