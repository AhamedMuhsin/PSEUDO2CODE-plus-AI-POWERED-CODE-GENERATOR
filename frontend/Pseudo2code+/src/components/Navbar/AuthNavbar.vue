<template>
    <nav class="auth-navbar">
        <!-- Left: Logo -->
        <div class="left">
            <img :src="logo" alt="Logo" class="logo" />
        </div>

        <!-- Center: Links -->
        <ul class="nav-links">
            <li>
                <RouterLink to="/showcase">Showcase</RouterLink>
            </li>
            <li>
                <RouterLink to="/about">About</RouterLink>
            </li>
            <li>
                <RouterLink to="/contact">Contact</RouterLink>
            </li>
            <li>
                <RouterLink to="/dashboard" class="active">
                    Dashboard
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/profile">Profile</RouterLink>
            </li>
        </ul>

        <!-- Right: Logout -->
        <button class="logout-btn" @click="handleLogout">
            Logout
        </button>
    </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { logout } from "@/services/authService";
import logo from "@/assets/logo_f.png";

const router = useRouter();

const handleLogout = async () => {
    await logout();
    router.replace("/login");
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.auth-navbar {
    width: 100%;
    height: 70px;
    padding: 0 100px;
    background: linear-gradient(to bottom,
            rgba(15, 23, 42, 0.95),
            rgba(2, 6, 23, 0.95));
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* Left */
.left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo {
    width: 34px;
}

.brand {
    font-size: 1.1rem;
    font-weight: 600;
    color: #e5e7eb;
}

/* Links */
.nav-links {
    display: flex;
    gap: 28px;
    list-style: none;
}

.nav-links a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s ease;
}

.nav-links a:hover {
    color: #e5e7eb;
}

.nav-links .active {
    color: #6366f1;
    font-weight: 600;
}

/* Logout */
.logout-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #e5e7eb;
    padding: 6px 16px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.logout-btn:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
}
</style>
