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
  color: #f8fafc;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.description {
  color: #94a3b8;
  font-size: 0.85rem;
  min-height: 40px;
}
.badge-card.locked .description {
  color: #64748b;
  font-style: italic;
}

.badge-card {
    /* background: linear-gradient(145deg, #0b1220, #0e1628); */
    background: rgba(15, 23, 42, 0.85);
    border-radius: 18px;
    padding: 24px;
    border: 1px solid #1e293b;
    text-align: center;
    transition: all 0.25s ease;
    cursor: default;
}
.badge-icon {
  font-size: 3rem;
  margin-bottom: 14px;
}

.badge-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
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
    color: #f8fafc;
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 6px;
}

.badge-desc {
    color: #94a3b8;
    font-size: 0.85rem;
    min-height: 40px;
}

.earned-date {
    margin-top: 10px;
    font-size: 0.75rem;
    color: #60a5fa;
}
</style>
