<template>
    <div class="badge-card" :class="{ locked: !earned }" @click="handleClick">
        <!-- Lock icon -->
        <div v-if="!earned" class="lock-icon">🔒</div>

        <!-- Badge Icon -->
        <div class="badge-icon">
            {{ icon }}
        </div>


        <!-- Title -->
        <h3 class="title">{{ title }}</h3>

        <!-- Description -->
        <p class="description">
            {{ earned ? description : requirement }}
        </p>

        <!-- Earned Date -->
        <p v-if="earned && earnedAt" class="earned-date">
            Earned: {{ formatDate(earnedAt) }}
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    description: String,
    requirement: String,
    icon: String,
    earned: Boolean,
    earnedAt: String
})

const emit = defineEmits(["click"])

const handleClick = () => {
    if (props.earned) emit("click")
}

const formatDate = (date) =>
    new Date(date).toLocaleDateString()
</script>

<style scoped>
.title {
    color: var(--text-primary);
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 6px;
}

.description {
    color: var(--text-muted);
    font-size: 0.85rem;
    min-height: 40px;
}

.badge-card.locked .description {
    color: var(--text-dim);
    font-style: italic;
}

.badge-card {
    /* background: var(--accent); */
    background: var(--bg-card);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--border-default);
    box-shadow: var(--shadow-md);
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
}

.badge-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.badge-icon {
    font-size: 3rem;
    margin-bottom: 14px;
}

.badge-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

/* LOCKED STATE */
.badge-card.locked {
    opacity: 0.45;
    filter: grayscale(1);
}

.badge-icon {
    font-size: 3rem;
    margin-bottom: 14px;
}

.badge-title {
    color: var(--text-primary);
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 6px;
}

.badge-desc {
    color: var(--text-muted);
    font-size: 0.85rem;
    min-height: 40px;
}

.earned-date {
    margin-top: 10px;
    font-size: 0.75rem;
    color: var(--accent-light);
}
</style>
