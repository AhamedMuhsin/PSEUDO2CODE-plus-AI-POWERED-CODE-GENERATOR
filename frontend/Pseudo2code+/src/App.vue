<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from "vue-router";
import { useThemeStore } from "@/stores/themeStore";

// Initialize theme on app mount — applies saved preference or default
const themeStore = useThemeStore();
</script>
