<template>
  <AuthNavbar />
  <main class="contact-page">
    <div class="contact-container">
      <!-- Back Button -->
      <div class="back-top-bar">
        <button class="back-btn-compact" @click="router.back()">
          <img :src="arrowLeft" class="arrow" />
          Back
        </button>
      </div>

      <!-- Header -->
      <section class="contact-header">
        <div class="header-icon">
          <Mail :size="32" />
        </div>
        <h1>Get in Touch</h1>
        <p>Have a question, suggestion, or just want to say hello? Reach out through any of the channels below.</p>
      </section>

      <!-- Contact Cards -->
      <div class="contact-grid">
        <!-- Developer Card -->
        <section class="card developer-card">
          <div class="dev-avatar">
            <span>AM</span>
          </div>
          <h2>Ahamed Muhsin</h2>
          <p class="dev-role">Full-Stack Developer</p>
          <p class="dev-location">
            <MapPin :size="16" />
            Mumbai, India
          </p>
        </section>

        <!-- Contact Methods -->
        <section class="card contact-methods">
          <h3>Contact Information</h3>

          <a href="mailto:ahamedmuhsin6@gmail.com" class="contact-item">
            <div class="contact-icon email-icon">
              <Mail :size="20" />
            </div>
            <div class="contact-detail">
              <span class="contact-label">Email</span>
              <span class="contact-value">ahamedmuhsin6@gmail.com</span>
            </div>
            <ExternalLink :size="16" class="external" />
          </a>

          <a href="https://github.com/AhamedMuhsin" target="_blank" rel="noopener noreferrer" class="contact-item">
            <div class="contact-icon github-icon">
              <Github :size="20" />
            </div>
            <div class="contact-detail">
              <span class="contact-label">GitHub</span>
              <span class="contact-value">AhamedMuhsin</span>
            </div>
            <ExternalLink :size="16" class="external" />
          </a>

          <a href="https://www.linkedin.com/in/ahamed-muhsin/" target="_blank" rel="noopener noreferrer" class="contact-item">
            <div class="contact-icon linkedin-icon">
              <Linkedin :size="20" />
            </div>
            <div class="contact-detail">
              <span class="contact-label">LinkedIn</span>
              <span class="contact-value">ahamed-muhsin</span>
            </div>
            <ExternalLink :size="16" class="external" />
          </a>

          <div class="contact-item no-hover">
            <div class="contact-icon location-icon">
              <MapPin :size="20" />
            </div>
            <div class="contact-detail">
              <span class="contact-label">Location</span>
              <span class="contact-value">Mumbai, India</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Message Form -->
      <section class="card message-card">
        <h3>Send a Message</h3>
        <p class="form-subtitle">Fill out the form below and I'll get back to you as soon as possible.</p>

        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Name</label>
              <input id="name" v-model="form.name" type="text" placeholder="Your name" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="form.email" type="email" placeholder="your@email.com" required />
            </div>
          </div>

          <div class="form-group">
            <label for="subject">Subject</label>
            <input id="subject" v-model="form.subject" type="text" placeholder="What's this about?" required />
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" v-model="form.message" rows="5" placeholder="Write your message here..." required></textarea>
          </div>

          <button type="submit" class="send-btn" :disabled="sending">
            <Send :size="18" v-if="!sending" />
            <Loader2 :size="18" class="spin" v-else />
            {{ sending ? 'Sending...' : 'Send Message' }}
          </button>

          <p v-if="successMsg" class="success-msg">
            <CircleCheck :size="16" />
            {{ successMsg }}
          </p>
        </form>
      </section>

      <!-- About the Project -->
      <section class="card about-card">
        <h3>About Pseudo2Code+</h3>
        <p>
          Pseudo2Code+ is an AI-powered code generator and algorithm visualizer built to help students
          and developers learn programming concepts through interactive tools. Convert pseudocode to real code,
          visualize algorithms step-by-step, earn badges, and track your learning progress.
        </p>
        <div class="tech-stack">
          <span class="tech-tag">Vue 3</span>
          <span class="tech-tag">FastAPI</span>
          <span class="tech-tag">MongoDB</span>
          <span class="tech-tag">Gemini AI</span>
          <span class="tech-tag">Firebase Auth</span>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import { Mail, Github, Linkedin, MapPin, ExternalLink, Send, Loader2, CircleCheck } from 'lucide-vue-next'

const router = useRouter()
const arrowLeft = new URL('@/assets/arrow-left.svg', import.meta.url).href

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})
const sending = ref(false)
const successMsg = ref('')

const handleSubmit = async () => {
  sending.value = true
  successMsg.value = ''

  // mailto fallback — opens user's email client
  const mailtoLink = `mailto:ahamedmuhsin6@gmail.com?subject=${encodeURIComponent(form.value.subject)}&body=${encodeURIComponent(
    `From: ${form.value.name} (${form.value.email})\n\n${form.value.message}`
  )}`

  window.open(mailtoLink, '_blank')

  setTimeout(() => {
    sending.value = false
    successMsg.value = 'Your email client has been opened with the message. Thank you!'
    form.value = { name: '', email: '', subject: '', message: '' }
  }, 1000)
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 90px 20px 60px;
}

.contact-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Back Button */
.back-top-bar {
  margin-bottom: 24px;
}

.back-btn-compact {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 10px;
  padding: 8px 16px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.back-btn-compact:hover {
  background: var(--bg-hover);
  border-color: var(--accent-border);
  color: var(--accent);
}

.back-btn-compact .arrow {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

/* Header */
.contact-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
  color: var(--accent);
}

.contact-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.contact-header p {
  color: var(--text-muted);
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Contact Grid */
.contact-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

/* Card Base */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 24px;
}

.card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

/* Developer Card */
.developer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.dev-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent);
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-on-accent);
  margin-bottom: 8px;
}

.developer-card h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.dev-role {
  color: var(--accent-light);
  font-size: 0.9rem;
  font-weight: 500;
}

.dev-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: 4px;
}

/* Contact Methods */
.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-methods h3 {
  margin-bottom: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  cursor: pointer;
}

.contact-item:not(.no-hover):hover {
  background: var(--bg-hover);
}

.contact-item .external {
  margin-left: auto;
  color: var(--text-dim);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.contact-item:hover .external {
  opacity: 1;
}

.contact-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.email-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.github-icon {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.linkedin-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.location-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.contact-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-label {
  font-size: 0.78rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.contact-value {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* Message Card */
.message-card {
  margin-bottom: 20px;
}

.form-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: -8px;
  margin-bottom: 20px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea {
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: 10px;
  padding: 12px 14px;
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  resize: vertical;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-dim);
}

.send-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  background: var(--accent);
  color: var(--text-on-accent);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.send-btn:hover:not(:disabled) {
  background: var(--accent-dark);
  transform: translateY(-1px);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--success);
  font-size: 0.9rem;
  font-weight: 500;
}

/* About Card */
.about-card p {
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.7;
  margin-bottom: 16px;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  padding: 6px 14px;
  border-radius: 8px;
  background: var(--accent-bg);
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 600;
  border: 1px solid var(--accent-border);
}

/* Mobile */
@media (max-width: 768px) {
  .contact-page {
    padding: 80px 14px 40px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .contact-header h1 {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .developer-card {
    flex-direction: row;
    text-align: left;
    gap: 16px;
  }

  .dev-avatar {
    width: 56px;
    height: 56px;
    font-size: 1.1rem;
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .card {
    padding: 18px;
  }
}

@media (max-width: 480px) {
  .contact-item {
    padding: 12px;
    gap: 10px;
  }

  .contact-icon {
    width: 36px;
    height: 36px;
  }

  .contact-value {
    font-size: 0.85rem;
  }

  .send-btn {
    width: 100%;
  }
}
</style>
