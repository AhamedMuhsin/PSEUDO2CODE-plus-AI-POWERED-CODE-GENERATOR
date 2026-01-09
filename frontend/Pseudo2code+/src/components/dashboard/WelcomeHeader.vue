<template>
  <div class="welcome">
<h1>
  Welcome back,
  <span v-if="name">{{ name.split(' ')[0] }}</span>
  <span v-else>User</span>
  !
</h1>



    <p class="subtitle">
      Here's what's happening with your learning journey
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
});

const firstName = computed(() => {
  return props.name ? props.name.split(" ")[0] : "";
});
</script>
