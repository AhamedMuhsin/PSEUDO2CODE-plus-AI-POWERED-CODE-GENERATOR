<template>
  <button @click="handleLogout">Logout</button>
  <div style="padding: 40px; color: white;">
    <h1>Dashboard</h1>
    <p>You are logged in 🎉</p>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { logout } from "@/services/authService";

const router = useRouter();

const handleLogout = async () => {
  await logout();
  router.push("/login");
};
</script>