<template>
  <AuthNavbar v-if="isLoggedIn" />
  <GuestNavbar v-else />
  <main class="showcase-page">
    <div class="showcase-container">

      <!-- Hero -->
      <section class="hero">
        <div class="hero-badge">
          <Sparkles :size="14" />
          AI-Powered Platform
        </div>
        <h1>See Pseudo2Code<span class="plus">+</span> in Action</h1>
        <p class="hero-subtitle">
          Explore how our platform transforms pseudocode into real, working code across multiple
          programming languages — with built-in visualization and gamified learning.
        </p>
        <router-link :to="isLoggedIn ? '/generate-code' : '/login'" class="hero-cta">
          Try It Free
          <ArrowRight :size="18" />
        </router-link>
      </section>

      <!-- How It Works -->
      <section class="section">
        <h2 class="section-title">How It Works</h2>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">1</div>
            <div class="step-icon">
              <PenLine :size="28" />
            </div>
            <h3>Write Pseudocode</h3>
            <p>Describe your logic in plain English or structured pseudocode. No syntax rules — just your ideas.</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <div class="step-icon">
              <Cpu :size="28" />
            </div>
            <h3>Generate Code</h3>
            <p>Our multi-AI engine (Gemini, Groq, OpenRouter) converts your pseudocode into clean, runnable code in any language.</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <div class="step-icon">
              <Play :size="28" />
            </div>
            <h3>Visualize & Learn</h3>
            <p>Watch algorithms come alive with step-by-step animated visualizations. Understand how code actually executes.</p>
          </div>
        </div>
      </section>

      <!-- Popular Examples -->
      <section class="section">
        <h2 class="section-title">Popular Examples</h2>
        <div class="examples-grid">
          <router-link to="/algorithm-hub" class="example-card">
            <div class="example-icon sorting-icon">
              <ArrowUpDown :size="24" />
            </div>
            <h3>Sorting Algorithms</h3>
            <p>Visualize bubble sort, quick sort, merge sort, insertion sort, and selection sort with animated comparisons.</p>
          </router-link>
          <router-link to="/algorithm-hub" class="example-card">
            <div class="example-icon search-icon">
              <Search :size="24" />
            </div>
            <h3>Search Algorithms</h3>
            <p>Binary search, linear search with step-by-step execution tracking and index highlighting.</p>
          </router-link>
          <router-link to="/algorithm-hub" class="example-card">
            <div class="example-icon ds-icon">
              <GitBranch :size="24" />
            </div>
            <h3>Data Structures</h3>
            <p>Stacks, queues, linked lists, binary trees, and graphs — interactive visualizations for each operation.</p>
          </router-link>
          <router-link to="/algorithm-hub" class="example-card">
            <div class="example-icon ai-icon">
              <Brain :size="24" />
            </div>
            <h3>AI Problems</h3>
            <p>A* pathfinding, minimax, N-Queens, hill climbing, genetic algorithms, and more — all visualized.</p>
          </router-link>
          <router-link to="/generate-code" class="example-card">
            <div class="example-icon code-icon">
              <Code :size="24" />
            </div>
            <h3>Code Generation</h3>
            <p>Convert pseudocode to Python, JavaScript, Java, C++, and C — clean, runnable code generated instantly.</p>
          </router-link>
          <router-link to="/badges" class="example-card">
            <div class="example-icon gamify-icon">
              <Trophy :size="24" />
            </div>
            <h3>Gamified Learning</h3>
            <p>Earn XP, unlock badges, maintain streaks, and climb the leaderboard as you learn and practice.</p>
          </router-link>
        </div>
      </section>

      <!-- Supported Languages -->
      <section class="section">
        <h2 class="section-title">Supported Languages</h2>
        <div class="langs-wrap">
          <span class="lang-tag" v-for="lang in languages" :key="lang">{{ lang }}</span>
        </div>
      </section>

      <!-- Stats -->
      <section class="section">
        <h2 class="section-title">Platform Highlights</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">5</span>
            <span class="stat-label">Languages Supported</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">30+</span>
            <span class="stat-label">Algorithm Visualizers</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">3</span>
            <span class="stat-label">AI Providers</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">20</span>
            <span class="stat-label">Badges to Earn</span>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <h2>Ready to Start Learning?</h2>
        <p>Turn your ideas into real code. Visualize algorithms. Level up your skills.</p>
        <div class="cta-btns">
          <router-link :to="isLoggedIn ? '/generate-code' : '/login'" class="hero-cta">
            Get Started Now
            <ArrowRight :size="18" />
          </router-link>
          <router-link to="/pricing" class="hero-cta-outline">
            View Pricing
          </router-link>
        </div>
      </section>

    </div>
  </main>
  <SiteFooter />
</template>

<script setup>
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import GuestNavbar from '@/components/Navbar/GuestNavbar.vue'
import SiteFooter from '@/components/common/SiteFooter.vue'
import { isAuthenticated } from '@/services/authService'
import {
  Sparkles, ArrowRight, PenLine, Cpu, Play,
  ArrowUpDown, Search, GitBranch, Brain, Code, Trophy
} from 'lucide-vue-next'

const isLoggedIn = isAuthenticated()

const languages = [
  'Python', 'JavaScript', 'Java', 'C++', 'C'
]
</script>

<style scoped>
.showcase-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 80px 20px 0;
}

.showcase-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Hero */
.hero {
  text-align: center;
  padding: 20px 0 48px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 50px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 16px;
  line-height: 1.2;
}

.plus {
  color: var(--accent);
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 28px;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 12px;
  background: var(--accent);
  color: var(--text-on-accent);
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.hero-cta:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

/* Section */
.section {
  margin-bottom: 48px;
}

.section-title {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 28px;
}

/* Steps */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.step-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 28px 22px;
  text-align: center;
  position: relative;
  transition: border-color 0.2s ease;
}

.step-card:hover {
  border-color: var(--accent-border);
}

.step-number {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--text-on-accent);
  display: grid;
  place-items: center;
  font-size: 0.82rem;
  font-weight: 800;
}

.step-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
  color: var(--accent);
}

.step-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.step-card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Examples */
.examples-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.example-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 24px 20px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: block;
}

.example-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-2px);
}

.example-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
}

.sorting-icon { background: rgba(99, 102, 241, 0.12); color: var(--accent); }
.search-icon { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
.ds-icon { background: rgba(34, 197, 94, 0.12); color: #22c55e; }
.ai-icon { background: rgba(236, 72, 153, 0.12); color: #ec4899; }
.code-icon { background: rgba(168, 85, 247, 0.12); color: #a855f7; }
.gamify-icon { background: rgba(234, 179, 8, 0.12); color: #eab308; }

.example-card h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.example-card p {
  font-size: 0.83rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Languages */
.langs-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.lang-tag {
  padding: 8px 18px;
  border-radius: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.lang-tag:hover {
  border-color: var(--accent-border);
  color: var(--accent);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 24px 16px;
  text-align: center;
  transition: border-color 0.2s ease;
}

.stat-card:hover {
  border-color: var(--accent-border);
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.82rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* CTA */
.cta-section {
  text-align: center;
  padding: 48px 20px;
  margin-bottom: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 16px;
}

.cta-section h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.cta-section p {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 24px;
}

.cta-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.hero-cta-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 12px;
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid var(--border-default);
  transition: all 0.2s ease;
}

.hero-cta-outline:hover {
  border-color: var(--accent-border);
  color: var(--accent);
  background: var(--accent-bg);
}

/* Mobile */
@media (max-width: 768px) {
  .showcase-page {
    padding: 65px 14px 0;
  }

  .hero h1 {
    font-size: 1.7rem;
  }

  .steps-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .examples-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .section-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 1.4rem;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .step-card {
    padding: 22px 18px;
  }

  .cta-section {
    padding: 32px 16px;
  }
}
</style>
