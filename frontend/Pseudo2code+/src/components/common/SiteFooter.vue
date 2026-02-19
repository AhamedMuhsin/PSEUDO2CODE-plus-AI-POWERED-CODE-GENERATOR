<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="footer-brand">
          <img :src="logo" alt="Pseudo2Code+" class="footer-logo" />
          <p>Transform pseudocode into real code with AI-powered visualization and learning.</p>
        </div>

        <!-- Product -->
        <div class="footer-col">
          <h4>Product</h4>
          <router-link to="/showcase">Showcase</router-link>
          <router-link to="/generate-code">Generate Code</router-link>
          <router-link to="/visualize">Visualize Code</router-link>
          <router-link to="/badges">Track Progress</router-link>
        </div>

        <!-- Company -->
        <div class="footer-col">
          <h4>Company</h4>
          <router-link to="/about">About Us</router-link>
          <router-link to="/contact">Contact</router-link>
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/terms">Terms of Service</router-link>
        </div>

        <!-- Connect -->
        <div class="footer-col">
          <h4>Connect</h4>
          <div class="social-links">
            <a href="https://github.com/AhamedMuhsin" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github :size="20" />
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X">
              <Twitter :size="20" />
            </a>
            <a href="https://www.linkedin.com/in/ahamed-muhsin/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin :size="20" />
            </a>
          </div>
        </div>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Pseudo2Code+ AI. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Github, Twitter, Linkedin } from 'lucide-vue-next'

const logo = new URL('@/assets/logo_f.png', import.meta.url).href
</script>

<style scoped>
.site-footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border-default);
  padding: 48px 24px 0;
  margin-top: 40px;
}

.footer-inner {
  max-width: 1000px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 0.8fr;
  gap: 40px;
}

/* Brand */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-logo {
  width: 42px;
  height: auto;
}

.footer-brand p {
  color: var(--text-muted);
  font-size: 0.88rem;
  line-height: 1.6;
  max-width: 280px;
}

/* Columns */
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.footer-col a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.88rem;
  transition: color 0.2s ease;
}

.footer-col a:hover {
  color: var(--accent);
}

/* Social */
.social-links {
  display: flex;
  gap: 14px;
}

.social-links a {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.social-links a:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--bg-hover);
}

/* Divider & Bottom */
.footer-divider {
  height: 1px;
  background: var(--border-default);
  margin: 36px 0 0;
}

.footer-bottom {
  padding: 20px 0;
  text-align: center;
}

.footer-bottom p {
  color: var(--text-dim);
  font-size: 0.82rem;
}

/* Mobile */
@media (max-width: 768px) {
  .site-footer {
    padding: 36px 16px 0;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-brand {
    grid-column: auto;
  }
}
</style>
