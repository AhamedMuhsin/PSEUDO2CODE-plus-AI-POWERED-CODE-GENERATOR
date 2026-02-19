<template>
  <AuthNavbar v-if="isLoggedIn" />
  <GuestNavbar v-else />
  <main class="about-page">
    <div class="about-container">
      <!-- Hero -->
      <section class="about-hero">
        <div class="hero-icon">
          <Code2 :size="36" />
        </div>
        <h1>About Pseudo2Code<span class="plus">+</span></h1>
        <p class="hero-subtitle">
          An AI-powered code generator and algorithm visualizer built to help students
          and developers learn programming concepts through interactive tools.
        </p>
      </section>

      <!-- What It Does -->
      <section class="card">
        <h3>
          <Sparkles :size="20" class="section-icon" />
          What It Does
        </h3>
        <div class="feature-grid">
          <div class="feature">
            <div class="feature-icon code-icon">
              <Code :size="22" />
            </div>
            <h4>Pseudocode to Code</h4>
            <p>Write pseudocode in plain English and get real, runnable code in Python, Java, C++, JavaScript, and more — powered by Gemini, Groq, and OpenRouter AI.</p>
          </div>
          <div class="feature">
            <div class="feature-icon viz-icon">
              <Eye :size="22" />
            </div>
            <h4>Algorithm Visualizer</h4>
            <p>Watch sorting, searching, graph traversal, tree operations, and AI algorithms come alive with step-by-step animated visualizations.</p>
          </div>
          <div class="feature">
            <div class="feature-icon badge-icon">
              <Trophy :size="22" />
            </div>
            <h4>Badges & XP</h4>
            <p>Earn badges, gain experience points, and level up as you generate code, visualize algorithms, and complete daily challenges.</p>
          </div>
          <div class="feature">
            <div class="feature-icon board-icon">
              <BarChart3 :size="22" />
            </div>
            <h4>Leaderboard</h4>
            <p>Compete with other learners on the global leaderboard. Track your streak, XP, and rank to stay motivated.</p>
          </div>
          <div class="feature">
            <div class="feature-icon hub-icon">
              <Brain :size="22" />
            </div>
            <h4>Algorithm Hub</h4>
            <p>Explore a curated collection of algorithms — from basic sorting to advanced AI problems like A*, minimax, and genetic algorithms.</p>
          </div>
          <div class="feature">
            <div class="feature-icon history-icon">
              <Clock :size="22" />
            </div>
            <h4>History & Tracking</h4>
            <p>Every code generation is saved. Review your past conversions, track your learning activity, and pick up where you left off.</p>
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="card">
        <h3>
          <Layers :size="20" class="section-icon" />
          Tech Stack
        </h3>
        <div class="stack-grid">
          <div class="stack-item">
            <div class="stack-logo vue">Vue</div>
            <div class="stack-info">
              <h4>Vue 3</h4>
              <p>Frontend framework with Composition API, Pinia stores, and Vue Router</p>
            </div>
          </div>
          <div class="stack-item">
            <div class="stack-logo fastapi">FA</div>
            <div class="stack-info">
              <h4>FastAPI</h4>
              <p>Python backend with async routes, JWT authentication, and RESTful API design</p>
            </div>
          </div>
          <div class="stack-item">
            <div class="stack-logo mongo">M</div>
            <div class="stack-info">
              <h4>MongoDB Atlas</h4>
              <p>Cloud-hosted NoSQL database for users, history, badges, XP, and leaderboard data</p>
            </div>
          </div>
          <div class="stack-item">
            <div class="stack-logo ai">AI</div>
            <div class="stack-info">
              <h4>Multi-AI Providers</h4>
              <p>Gemini, Groq, and OpenRouter — three AI providers for reliable, high-quality code generation</p>
            </div>
          </div>
          <div class="stack-item">
            <div class="stack-logo jwt">JWT</div>
            <div class="stack-info">
              <h4>JWT Authentication</h4>
              <p>Secure token-based auth with Google & GitHub OAuth login and session management</p>
            </div>
          </div>
          <div class="stack-item">
            <div class="stack-logo vite">V</div>
            <div class="stack-info">
              <h4>Vite</h4>
              <p>Lightning-fast build tool with hot module replacement for development</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Developer -->
      <section class="card developer-section">
        <h3>
          <User :size="20" class="section-icon" />
          Developer
        </h3>
        <div class="dev-profile">
          <div class="dev-avatar">AM</div>
          <div class="dev-info">
            <h4>Ahamed Muhsin</h4>
            <p class="dev-role">Full-Stack Developer</p>
            <p class="dev-location">
              <MapPin :size="14" />
              Mumbai, India
            </p>
            <div class="dev-links">
              <a href="https://github.com/AhamedMuhsin" target="_blank" rel="noopener noreferrer" class="dev-link">
                <Github :size="16" />
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/ahamed-muhsin/" target="_blank" rel="noopener noreferrer" class="dev-link">
                <Linkedin :size="16" />
                LinkedIn
              </a>
              <a href="mailto:ahamedmuhsin6@gmail.com" class="dev-link">
                <Mail :size="16" />
                Email
              </a>
            </div>
          </div>
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
  Code2, Code, Eye, Trophy, BarChart3, Brain, Clock,
  Layers, Sparkles, User, MapPin, Github, Linkedin, Mail
} from 'lucide-vue-next'

const isLoggedIn = isAuthenticated()
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 70px 20px 60px;
}

.about-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Hero */
.about-hero {
  text-align: center;
  margin-bottom: 32px;
}

.hero-icon {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
  color: var(--accent);
}

.about-hero h1 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.plus {
  color: var(--accent);
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto;
}

/* Card */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 28px;
  margin-bottom: 20px;
}

.card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.section-icon {
  color: var(--accent);
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.feature {
  padding: 20px;
  border-radius: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  transition: border-color 0.2s ease;
}

.feature:hover {
  border-color: var(--accent-border);
}

.feature-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  margin-bottom: 12px;
}

.code-icon { background: rgba(99, 102, 241, 0.12); color: var(--accent); }
.viz-icon { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
.badge-icon { background: rgba(234, 179, 8, 0.12); color: #eab308; }
.board-icon { background: rgba(168, 85, 247, 0.12); color: #a855f7; }
.hub-icon { background: rgba(236, 72, 153, 0.12); color: #ec4899; }
.history-icon { background: rgba(34, 197, 94, 0.12); color: #22c55e; }

.feature h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.feature p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Stack Grid */
.stack-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stack-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  transition: border-color 0.2s ease;
}

.stack-item:hover {
  border-color: var(--accent-border);
}

.stack-logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.stack-logo.vue { background: rgba(66, 184, 131, 0.15); color: #42b883; }
.stack-logo.fastapi { background: rgba(0, 150, 136, 0.15); color: #009688; }
.stack-logo.mongo { background: rgba(0, 237, 100, 0.12); color: #00ed64; }
.stack-logo.ai { background: rgba(99, 102, 241, 0.12); color: #6366f1; }
.stack-logo.jwt { background: rgba(255, 160, 0, 0.12); color: #f59e0b; }
.stack-logo.vite { background: rgba(189, 52, 254, 0.12); color: #bd34fe; }

.stack-info h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.stack-info p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Developer */
.dev-profile {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.dev-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent);
  display: grid;
  place-items: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-on-accent);
  flex-shrink: 0;
}

.dev-info h4 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.dev-role {
  color: var(--accent-light);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.dev-location {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 14px;
}

.dev-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.dev-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.dev-link:hover {
  background: var(--bg-hover);
  border-color: var(--accent-border);
  color: var(--accent);
}

/* Mobile */
@media (max-width: 768px) {
  .about-page {
    padding: 60px 14px 40px;
  }

  .about-hero h1 {
    font-size: 1.6rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 20px;
  }

  .dev-profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .dev-location {
    justify-content: center;
  }

  .dev-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stack-item {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .dev-link {
    padding: 6px 12px;
    font-size: 0.78rem;
  }
}
</style>
