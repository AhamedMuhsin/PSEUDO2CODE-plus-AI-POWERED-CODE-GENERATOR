<template>
    <nav class="auth-navbar" :class="{ 'nav-scrolled': scrolled }">
        <!-- Left: Logo -->
        <div class="left">
            <img :src="logo" alt="Logo" class="logo" />
        </div>

        <!-- Center: Links (Desktop) -->
        <ul class="nav-links">
            <li v-for="link in navLinks" :key="link.to">
                <RouterLink :to="link.to" :class="{ active: isActive(link.to) }">
                    {{ link.label }}
                </RouterLink>
            </li>
        </ul>

        <!-- Right: Theme Toggle + Logout (Desktop) -->
        <div class="right-actions">
            <ThemeToggle variant="desktop" />
            <button class="logout-btn" @click="handleLogout">
                Logout
            </button>
        </div>

        <!-- Hamburger Button (Mobile) -->
        <button class="hamburger" :class="{ open: mobileMenuOpen }" @click="toggleMenu" aria-label="Toggle menu">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>

        <!-- Mobile Backdrop -->
        <Transition name="fade">
            <div v-if="mobileMenuOpen" class="mobile-backdrop" @click="closeMenu"></div>
        </Transition>

        <!-- Mobile Drawer -->
        <Transition name="slide">
            <div v-if="mobileMenuOpen" class="mobile-drawer">
                <div class="mobile-drawer-header">
                    <img :src="logo" alt="Logo" class="mobile-logo" />
                    <span class="mobile-brand">Pseudo2Code+</span>
                </div>

                <ul class="mobile-links">
                    <li v-for="(link, i) in navLinks" :key="link.to" :style="{ animationDelay: (i * 0.06) + 's' }">
                        <RouterLink :to="link.to" :class="{ active: isActive(link.to) }" @click="closeMenu">
                            <component :is="link.icon" :size="18" class="mobile-link-icon" />
                            {{ link.label }}
                        </RouterLink>
                    </li>
                </ul>

                <!-- App Pages Submenu (collapsible) -->
                <div class="mobile-submenu">
                    <button class="submenu-trigger" @click="pagesOpen = !pagesOpen"
                        :class="{ expanded: pagesOpen }">
                        <div class="submenu-trigger-left">
                            <Layers :size="18" class="mobile-link-icon" />
                            Pages
                        </div>
                        <ChevronDown :size="16" class="submenu-chevron" />
                    </button>
                    <Transition name="submenu">
                        <ul v-if="pagesOpen" class="mobile-links mobile-app-links">
                            <li v-for="(link, i) in appLinks" :key="link.to"
                                :style="{ animationDelay: (i * 0.04) + 's' }">
                                <RouterLink :to="link.to" :class="{ active: isActive(link.to) }"
                                    @click="closeMenu">
                                    <component :is="link.icon" :size="18" class="mobile-link-icon" />
                                    {{ link.label }}
                                </RouterLink>
                            </li>
                        </ul>
                    </Transition>
                </div>

                <!-- Theme Section -->
                <div class="mobile-section-label">Theme</div>
                <ThemeToggle variant="mobile" />

                <div class="mobile-drawer-footer">
                    <button class="mobile-logout-btn" @click="handleLogout">
                        <LogOut :size="18" class="mobile-link-icon" />
                        Logout
                    </button>
                </div>
            </div>
        </Transition>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logout } from '@/services/authService'
import { useSwipeBack } from '@/composables/useSwipeBack'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import logo from '@/assets/logo_f.png'
import {
    Sparkles, Info, Mail, LayoutDashboard, User, LogOut,
    Code, Eye, Brain, Clock, Trophy, BarChart3,
    Layers, ChevronDown
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const pagesOpen = ref(false)
const scrolled = ref(false)


// Mobile swipe-right-from-edge → browser back
useSwipeBack()

const navLinks = [
    { to: '/showcase', label: 'Showcase', icon: Sparkles },
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: Mail },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: User },
]

const appLinks = [
    { to: '/generate-code', label: 'Generate Code', icon: Code },
    { to: '/visualize-playground', label: 'Visualize Code', icon: Eye },
    { to: '/algorithm-hub', label: 'Algorithm Hub', icon: Brain },
    { to: '/history', label: 'History', icon: Clock },
    { to: '/badges', label: 'Badges', icon: Trophy },
    { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
]

function isActive(path) {
    return route.path === path || route.path.startsWith(path + '/')
}

function toggleMenu() {
    mobileMenuOpen.value = !mobileMenuOpen.value
    document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
}

function closeMenu() {
    mobileMenuOpen.value = false
    document.body.style.overflow = ''
}

function handleScroll() {
    scrolled.value = window.scrollY > 20
}

const handleLogout = async () => {
    closeMenu()
    await logout()
    router.replace('/login')
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.body.style.overflow = ''
})
</script>

<style scoped>
/* ════════ NAVBAR BASE ════════ */
.auth-navbar {
    width: 100%;
    height: 70px;
    padding: 0 100px;
    background: var(--bg-navbar);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border-default);
    position: sticky;
    top: 0;
    z-index: 1000;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: all 0.3s ease;
}

.auth-navbar.nav-scrolled {
    height: 60px;
    background: var(--bg-navbar-solid);
    box-shadow: var(--shadow-md);
    border-bottom-color: var(--accent-border);
}

/* ════════ LEFT ════════ */
.left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}


.logo {
    width: 34px;
    transition: transform 0.3s ease;
}

.logo:hover {
    transform: rotate(-8deg) scale(1.05);
}

/* ════════ DESKTOP LINKS ════════ */
.nav-links {
    display: flex;
    gap: 28px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.95rem;
    position: relative;
    transition: color 0.25s ease;
    padding: 4px 0;
}

.nav-links a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--accent), var(--accent-light));
    border-radius: 1px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(-50%);
}

.nav-links a:hover {
    color: var(--text-secondary);
}

.nav-links a:hover::after {
    width: 100%;
}

.nav-links .active {
    color: var(--accent);
    font-weight: 600;
}

.nav-links .active::after {
    width: 100%;
}

/* ════════ RIGHT ACTIONS (Desktop) ════════ */
.right-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

/* ════════ LOGOUT DESKTOP ════════ */
.logout-btn {
    background: transparent;
    border: 1px solid var(--border-default);
    color: var(--text-secondary);
    padding: 6px 16px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.88rem;
    transition: all 0.25s ease;
    flex-shrink: 0;
}

.logout-btn:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: var(--text-primary);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* ════════ HAMBURGER ════════ */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 40px;
    height: 40px;
    background: var(--bg-hover);
    border: 1px solid var(--border-default);
    border-radius: 10px;
    cursor: pointer;
    padding: 8px;
    transition: all 0.3s ease;
    z-index: 1002;
    flex-shrink: 0;
}

.hamburger:hover {
    background: var(--accent-bg);
    border-color: var(--accent-border);
}

.hamburger-line {
    width: 20px;
    height: 2px;
    background: var(--text-secondary);
    border-radius: 2px;
    transition: all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6);
    transform-origin: center;
}

.hamburger.open .hamburger-line:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}

.hamburger.open .hamburger-line:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
}

.hamburger.open .hamburger-line:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}

/* ════════ MOBILE BACKDROP ════════ */
.mobile-backdrop {
    position: fixed;
    inset: 0;
    background: var(--bg-overlay);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 998;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* ════════ MOBILE DRAWER ════════ */
.mobile-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    max-width: 85vw;
    height: 100dvh;
    background: var(--bg-drawer);
    border-left: 1px solid var(--accent-border);
    z-index: 999;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
}

.slide-enter-active {
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-leave-active {
    transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

/* ════════ DRAWER HEADER ════════ */
.mobile-drawer-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border-light);
}

.mobile-logo {
    width: 32px;
}

.mobile-brand {
    font-size: 1.1rem;
    font-weight: 700;
    background: var(--accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* ════════ MOBILE LINKS ════════ */
.mobile-links {
    list-style: none;
    padding: 12px 12px;
    margin: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.mobile-links li {
    animation: slideInLink 0.35s ease forwards;
    opacity: 0;
    transform: translateX(20px);
}

@keyframes slideInLink {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.mobile-links a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.mobile-links a::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--accent);
    border-radius: 0 3px 3px 0;
    transform: scaleY(0);
    transition: transform 0.25s ease;
}

.mobile-links a:hover,
.mobile-links a:active {
    background: var(--bg-hover);
    color: var(--text-secondary);
}

.mobile-links a:hover::before {
    transform: scaleY(1);
}

.mobile-links a.active {
    background: var(--accent-bg);
    color: var(--accent-light);
    font-weight: 600;
}

.mobile-links a.active::before {
    transform: scaleY(1);
}

.mobile-link-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

.mobile-links a:hover .mobile-link-icon,
.mobile-links a.active .mobile-link-icon {
    opacity: 1;
}

/* ════════ DRAWER FOOTER ════════ */
.mobile-section-label {
    padding: 6px 28px 4px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--text-faint);
}

.mobile-app-links {
    padding-top: 0;
    flex: 0;
}

/* ════════ PAGES SUBMENU ════════ */
.mobile-submenu {
    padding: 4px 12px;
}

.submenu-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.submenu-trigger-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.submenu-trigger:hover {
    background: var(--bg-hover);
    color: var(--text-secondary);
}

.submenu-trigger.expanded {
    color: var(--accent-light);
}

.submenu-chevron {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.5;
}

.submenu-trigger.expanded .submenu-chevron {
    transform: rotate(180deg);
    opacity: 1;
    color: var(--accent-light);
}

/* Submenu transition */
.submenu-enter-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.submenu-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
    overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-8px);
}

.submenu-enter-to,
.submenu-leave-from {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
}

.mobile-submenu .mobile-app-links {
    padding: 4px 0 0 8px;
}

.mobile-submenu .mobile-app-links a {
    padding: 10px 14px;
    font-size: 0.9rem;
}

.mobile-drawer-footer {
    padding: 12px 12px 28px;
    border-top: 1px solid var(--border-light);
    margin-top: auto;
}

.mobile-logout-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: var(--error-text);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
}

.mobile-logout-btn:hover {
    background: rgba(239, 68, 68, 0.18);
    border-color: rgba(239, 68, 68, 0.4);
    color: #ef4444;
    transform: translateX(-2px);
}

/* ════════ RESPONSIVE ════════ */
@media (max-width: 900px) {
    .auth-navbar {
        padding: 0 20px;
    }

    .nav-links,
    .right-actions {
        display: none;
    }

    .hamburger {
        display: flex;
    }
}

@media (max-width: 480px) {
    .auth-navbar {
        padding: 0 14px;
        height: 60px;
    }

    .logo {
        width: 30px;
    }

    .mobile-drawer {
        width: 100%;
        max-width: 100vw;
        border-left: none;
    }
}
</style>
