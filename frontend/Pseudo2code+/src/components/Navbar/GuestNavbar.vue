<template>
    <nav class="guest-navbar" :class="{ 'nav-scrolled': scrolled }">
        <!-- Left: Logo -->
        <div class="left">
            <router-link to="/">
                <img :src="logo" alt="Logo" class="logo" />
            </router-link>
        </div>

        <!-- Center: Links (Desktop) -->
        <ul class="nav-links">
            <li v-for="link in navLinks" :key="link.to">
                <RouterLink :to="link.to" :class="{ active: isActive(link.to) }">
                    {{ link.label }}
                </RouterLink>
            </li>
        </ul>

        <!-- Right: Theme Toggle + Login + Get Started (Desktop) -->
        <div class="right-actions">
            <ThemeToggle variant="desktop" />
            <RouterLink to="/login" class="login-link">Login</RouterLink>
            <RouterLink to="/signup" class="get-started-btn">Get Started</RouterLink>
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

                <!-- Theme Section -->
                <div class="mobile-section-label">Theme</div>
                <ThemeToggle variant="mobile" />

                <div class="mobile-drawer-footer">
                    <RouterLink to="/login" class="mobile-login-btn" @click="closeMenu">
                        <LogIn :size="18" class="mobile-link-icon" />
                        Login
                    </RouterLink>
                    <RouterLink to="/signup" class="mobile-get-started-btn" @click="closeMenu">
                        <UserPlus :size="18" class="mobile-link-icon" />
                        Get Started
                    </RouterLink>
                </div>
            </div>
        </Transition>
    </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import logo from '@/assets/logo_f.png'
import { Sparkles, Info, Mail, LogIn, UserPlus, CreditCard } from 'lucide-vue-next'

const route = useRoute()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

const navLinks = [
    { to: '/showcase', label: 'Showcase', icon: Sparkles },
    { to: '/pricing', label: 'Pricing', icon: CreditCard },
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: Mail },
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

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.body.style.overflow = ''
})
</script>

<style scoped>
/* ════════ NAVBAR BASE ════════ */
.guest-navbar {
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


.guest-navbar.nav-scrolled {
    height: 60px;
    background: var(--bg-navbar-solid);
    box-shadow: var(--shadow-md);
    border-bottom-color: var(--accent-border);
}

/* ════════ LEFT ════════ */
.left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.left a {
    display: flex;
    align-items: center;
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
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
    background: var(--accent);
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
    gap: 12px;
    flex-shrink: 0;
}

.login-link {
    color: var(--text-primary);
    text-decoration: none;
    font-size: 0.92rem;
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 10px;
    transition: all 0.25s ease;
}

.login-link:hover {
    color: var(--accent);
    background: var(--accent-bg);
}

.get-started-btn {
    background: var(--accent);
    color: #fff;
    padding: 9px 22px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.25s ease;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
}

.get-started-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
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

/* ════════ THEME LABEL ════════ */
.mobile-section-label {
    padding: 6px 28px 4px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--text-faint);
}

/* ════════ DRAWER FOOTER ════════ */
.mobile-drawer-footer {
    padding: 12px 12px 28px;
    border-top: 1px solid var(--border-light);
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.mobile-login-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    color: var(--text-secondary);
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.25s ease;
}

.mobile-login-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent-border);
    color: var(--accent);
}

.mobile-get-started-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    background: var(--accent);
    border: none;
    color: var(--text-on-accent);
    font-size: 0.95rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.25s ease;
}

.mobile-get-started-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

/* ════════ RESPONSIVE ════════ */
@media (max-width: 900px) {
    .guest-navbar {
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
    .guest-navbar {
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
