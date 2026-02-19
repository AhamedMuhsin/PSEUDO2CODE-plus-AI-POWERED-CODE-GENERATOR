<script setup>
import { Code, Eye, Trophy } from "lucide-vue-next"
import { useRouter } from "vue-router"
import StatCard from "./StatCard.vue"

defineProps({ stats: Object })

const router = useRouter()

const goToGeneratedCodes = () => {
  router.push({
    path: "/history",
    query: { type: "generated_code" }
  })
}

const goToVisualizations = () => {
  router.push({
    path: "/history",
    query: { type: "visualized_code" }
  })
}

const goToBadges = () => {
  router.push("/badges")
}
</script>

<template>
  <div class="stats-grid">
    <StatCard
      title="Codes Generated"
      :value="stats.codes_generated"
      :subtitle="`+${stats.weekly?.codes || 0} this week`"
      :icon="Code"
      icon-color="blue"
      @click="goToGeneratedCodes"
    />

    <StatCard
      title="Visualizations"
      :value="stats.visualizations"
      :subtitle="`+${stats.weekly?.visualizations || 0} this week`"
      :icon="Eye"
      icon-color="purple"
      @click="goToVisualizations"
    />

    <StatCard
      title="Badges Earned"
      :value="stats.badges"
      :subtitle="stats.badges_next?.next_title ? `Next: ${stats.badges_next.next_title}` : (stats.badges_next?.remaining ? `${stats.badges_next.remaining} more to unlock` : 'All badges unlocked')"
      :icon="Trophy"
      icon-color="cyan"
      @click="goToBadges"
    />
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
