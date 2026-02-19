<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useThemeStore } from "@/stores/themeStore";

// Initialize theme on app mount — applies saved preference or default
const themeStore = useThemeStore();

// Dismiss the initial HTML splash screen once Vue is mounted and ready
onMounted(() => {
  const splash = document.getElementById("initial-splash");
  if (splash) {
    // Small delay so the transition feels intentional
    setTimeout(() => {
      splash.classList.add("hide");
      // Remove from DOM and clean up splash class after fade-out
      setTimeout(() => {
        splash.remove();
        document.documentElement.classList.remove("splash-theme-dark", "splash-theme-light");
      }, 450);
    }, 600);
  }
});
</script>
