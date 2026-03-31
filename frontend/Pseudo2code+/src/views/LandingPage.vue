<template>
  <AuthNavbar v-if="isLoggedIn" />
  <GuestNavbar v-else />

  <main class="landing-page">
    <div class="landing-container">

      <!-- Hero -->
      <section class="hero">
        <div class="hero-badge">
          <Sparkles :size="14" />
          AI-Powered Code Education
        </div>
        <h1 class="hero-title">
          Transform Pseudocode<br />into <span class="gradient-text">Real Code</span>
        </h1>
        <p class="hero-subtitle">
          Master programming with AI-powered code generation,
          interactive visualization, and gamified learning across Python,
          JavaScript, Java, C++, and C
        </p>
        <div class="hero-buttons">
          <router-link :to="isLoggedIn ? '/generate-code' : '/signup'" class="btn-primary">
            Get Started Free
            <ArrowRight :size="16" />
          </router-link>
          <router-link to="/showcase" class="btn-outline">
            View Showcase
          </router-link>
        </div>
      </section>

      <!-- Features -->
      <section class="section">
        <h2 class="section-title">Powerful Features</h2>
        <p class="section-subtitle">Everything you need to master programming</p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon icon-purple">
              <Sparkles :size="22" />
            </div>
            <h3>AI Code Generation</h3>
            <p>Transform pseudocode into production-ready code across multiple programming languages instantly</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-blue">
              <Play :size="22" />
            </div>
            <h3>Step-by-Step Visualization</h3>
            <p>Watch your code execute line by line with real-time variable tracking and loop iteration display</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-teal">
              <Languages :size="22" />
            </div>
            <h3>Multi-Language Output</h3>
            <p>Generate code in Python, JavaScript, Java, C++, and C from a single pseudocode input</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon icon-green">
              <TrendingUp :size="22" />
            </div>
            <h3>Progress Tracking</h3>
            <p>Gamified learning with XP, levels, streaks, badges, and milestones to keep you motivated</p>
          </div>
        </div>
      </section>

      <!-- Platform Stats -->
      <section class="section">
        <h2 class="section-title">Platform in Numbers</h2>
        <p class="section-subtitle">Real metrics from a platform built for learners</p>
        <div class="stats-grid" ref="statsGrid">
          <div class="stat-card">
            <div class="stat-icon icon-purple">
              <Languages :size="24" />
            </div>
            <span class="stat-number">{{ animatedStats.languages }}+</span>
            <span class="stat-label">Programming Languages</span>
            <span class="stat-detail">Python, JavaScript, Java, C++, C</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-blue">
              <Play :size="24" />
            </div>
            <span class="stat-number">{{ animatedStats.algorithms }}+</span>
            <span class="stat-label">Algorithm Visualizers</span>
            <span class="stat-detail">Sorting, graphs, trees, AI & more</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-teal">
              <Sparkles :size="24" />
            </div>
            <span class="stat-number">{{ animatedStats.badges }}+</span>
            <span class="stat-label">Badges to Earn</span>
            <span class="stat-detail">Gamified milestones & achievements</span>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-green">
              <TrendingUp :size="24" />
            </div>
            <span class="stat-number">{{ animatedStats.features }}+</span>
            <span class="stat-label">Learning Features</span>
            <span class="stat-detail">XP, streaks, leaderboards, history</span>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="section">
        <h2 class="section-title">How It Works</h2>
        <p class="section-subtitle">Three simple steps to start learning</p>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3>Write Pseudocode</h3>
            <p>Describe your algorithm in plain English or pseudocode — no syntax to worry about</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <h3>Generate & Learn</h3>
            <p>AI transforms it into production-ready code in your chosen language with explanations</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <h3>Visualize & Master</h3>
            <p>Step through algorithms visually, earn XP, unlock badges, and climb the leaderboard</p>
          </div>
        </div>
      </section>

      <!-- Pricing Teaser -->
      <section class="section">
        <h2 class="section-title">Affordable Plans for Everyone</h2>
        <p class="section-subtitle">Start for free, upgrade when you're ready — pricing designed for students</p>
        <div class="pricing-teaser">
          <div class="teaser-card">
            <h3>Free</h3>
            <div class="teaser-price">₹0<span>/month</span></div>
            <p>20 code generations, 10 visualizations, basic AI</p>
            <router-link :to="isLoggedIn ? '/generate-code' : '/signup'" class="btn-outline btn-teaser">
              Get Started
            </router-link>
          </div>
          <div class="teaser-card teaser-featured">
            <div class="teaser-badge">Popular</div>
            <h3>Premium</h3>
            <div class="teaser-price">₹99<span>/month</span></div>
            <p>Unlimited everything, all AI providers, priority support</p>
            <router-link to="/pricing" class="btn-primary btn-teaser">
              View Plans
              <ArrowRight :size="14" />
            </router-link>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="cta-card">
          <h2>Ready to Start Learning?</h2>
          <p>Join Pseudo2Code+ today and transform the way you learn programming</p>
          <div class="cta-btns-row">
            <router-link :to="isLoggedIn ? '/dashboard' : '/signup'" class="btn-primary btn-cta">
              Create Your Free Account
              <ArrowRight :size="16" />
            </router-link>
            <router-link to="/pricing" class="btn-outline btn-cta">
              View Pricing
            </router-link>
          </div>
        </div>
      </section>

    </div>
  </main>

  <SiteFooter />
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import GuestNavbar from '@/components/Navbar/GuestNavbar.vue'
import SiteFooter from '@/components/common/SiteFooter.vue'
import { isAuthenticated } from '@/services/authService'
import {
  Sparkles,
  ArrowRight,
  Play,
  Languages,
  TrendingUp,
} from 'lucide-vue-next'

const isLoggedIn = isAuthenticated()

// ── Animated Stats Counter ──
const statsGrid = ref(null)
const targetStats = { languages: 5, algorithms: 15, badges: 20, features: 10 }
const animatedStats = reactive({ languages: 0, algorithms: 0, badges: 0, features: 0 })
let hasAnimated = false

function animateCount(key, target, duration = 1200) {
  const start = performance.now()
  const step = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress)
    animatedStats[key] = Math.round(eased * target)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function startCounters() {
  if (hasAnimated) return
  hasAnimated = true
  Object.entries(targetStats).forEach(([key, val], i) => {
    setTimeout(() => animateCount(key, val), i * 150)
  })
}

let observer = null
onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) startCounters() },
    { threshold: 0.3 }
  )
  if (statsGrid.value) observer.observe(statsGrid.value)
})
onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding-top: 50px;
}

.landing-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ─── Hero ─── */
.hero {
  text-align: center;
  padding: 80px 0 60px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 100px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 28px;
}

.hero-title {
  font-size: 3.4rem;
  font-weight: 800;
  line-height: 1.12;
  color: var(--text-primary);
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent), #a78bfa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  max-width: 600px;
  margin: 0 auto 36px;
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.7;
}

.hero-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* ─── Buttons ─── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 30px;
  border-radius: 12px;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.25s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px var(--accent-bg);
}

.btn-primary:hover {
  background: var(--accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px var(--accent-bg-hover), 0 2px 8px var(--accent-bg);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px var(--accent-bg);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 30px;
  border-radius: 12px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  border: 1px solid var(--border-default);
  transition: all 0.25s ease;
  cursor: pointer;
}

.btn-outline:hover {
  border-color: var(--accent-border);
  color: var(--accent);
  background: var(--accent-bg);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

/* ─── Sections ─── */
.section {
  padding: 60px 0;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.section-subtitle {
  text-align: center;
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 44px;
}

/* ─── Features Grid ─── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 28px 22px;
  transition: all 0.25s ease;
}

.feature-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
}

.icon-purple {
  background: rgba(124, 58, 237, 0.12);
  color: #a78bfa;
}

.icon-blue {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
}

.icon-teal {
  background: rgba(20, 184, 166, 0.12);
  color: #2dd4bf;
}

.icon-green {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.feature-card p {
  color: var(--text-muted);
  font-size: 0.88rem;
  line-height: 1.6;
}

/* ─── Stats Grid ─── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 32px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.25s ease;
}

.stat-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 2.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-detail {
  font-size: 0.78rem;
  color: var(--text-dim);
  line-height: 1.4;
}

/* ─── How It Works (Steps) ─── */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.step-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.25s ease;
  position: relative;
}

.step-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.step-number {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 800;
  display: inline-grid;
  place-items: center;
  margin-bottom: 16px;
}

.step-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.step-card p {
  color: var(--text-muted);
  font-size: 0.88rem;
  line-height: 1.65;
}

/* ─── CTA Section ─── */
.cta-section {
  padding: 40px 0 60px;
}

.cta-card {
  text-align: center;
  padding: 56px 32px;
  border-radius: 18px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
}

.cta-card h2 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.cta-card p {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 28px;
}

.btn-cta {
  font-size: 1.05rem;
  padding: 15px 36px;
  border-radius: 14px;
  box-shadow: 0 4px 18px var(--accent-bg-hover);
}

.btn-cta:hover {
  box-shadow: 0 8px 32px var(--accent-bg-hover), 0 4px 12px var(--accent-bg);
}

/* ─── Pricing Teaser ─── */
.pricing-teaser {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 700px;
  margin: 0 auto;
}

.teaser-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.25s ease;
  position: relative;
}

.teaser-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.teaser-featured {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 4px 16px rgba(99, 102, 241, 0.1);
}

.teaser-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: var(--text-on-accent);
  padding: 3px 14px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
}

.teaser-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.teaser-price {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.teaser-price span {
  font-size: 0.85rem;
  font-weight: 500;
}

.teaser-card p {
  color: var(--text-muted);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 18px;
}

.btn-teaser {
  padding: 10px 22px;
  font-size: 0.88rem;
}

.cta-btns-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* ─── Mobile ─── */
@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 50px 0 40px;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 0.98rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .section {
    padding: 40px 0;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .cta-card {
    padding: 40px 20px;
  }

  .cta-card h2 {
    font-size: 1.5rem;
  }

  .pricing-teaser {
    grid-template-columns: 1fr;
    max-width: 360px;
  }
}

@media (max-width: 520px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-buttons,
  .cta-btns-row {
    flex-direction: column;
  }

  .btn-primary,
  .btn-outline {
    width: 100%;
    justify-content: center;
  }
}
</style>
