<template>
  <div class="algo-card" @click="$emit('click')">
    <div class="top">
      <h3>{{ title }}</h3>
      <span class="level">{{ level }}</span>
    </div>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  level: String,
  description: String,
})
</script>

<style scoped>
.algo-card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255,255,255,.08);
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
}

.algo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,.4);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.level {
  font-size: .7rem;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(99,102,241,.2);
  color: #c7d2fe;
}

p {
  margin-top: 10px;
  color: #94a3b8;
  font-size: .9rem;
}
</style>
