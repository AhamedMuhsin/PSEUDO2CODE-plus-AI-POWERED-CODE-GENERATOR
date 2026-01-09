<script setup>
import { Code, Eye, Trophy } from "lucide-vue-next";
import StatCard from "./StatCard.vue";

defineProps({ stats: Object });
</script>

<template>
  <div class="stats-grid">
<StatCard
  title="Codes Generated"
  :value="stats.codes_generated"
  subtitle="+3 this week"
  :icon="Code"
  icon-color="blue"
/>

<StatCard
  title="Visualizations"
  :value="stats.visualizations"
  subtitle="+2 this week"
  :icon="Eye"
  icon-color="purple"
/>

<StatCard
  title="Badges Earned"
  :value="stats.badges"
  subtitle="More to unlock"
  :icon="Trophy"
  icon-color="cyan"
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
