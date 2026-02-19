<template>
  <AuthNavbar v-if="isLoggedIn" />
  <GuestNavbar v-else />
  <main class="contact-page">
    <div class="contact-container">
      <!-- Header -->
      <section class="contact-header">
        <div class="header-icon">
          <Mail :size="32" />
        </div>
        <h1>Get in Touch</h1>
        <p>Have a question, suggestion, or just want to say hello? Reach out through any of the channels below.</p>
      </section>

      <!-- Developer Card (same style as About page) -->
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

    </div>
  </main>
  <SiteFooter />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import GuestNavbar from '@/components/Navbar/GuestNavbar.vue'
import SiteFooter from '@/components/common/SiteFooter.vue'
import { isAuthenticated } from '@/services/authService'
import { Mail, Github, Linkedin, MapPin, ExternalLink, Send, Loader2, CircleCheck, User } from 'lucide-vue-next'

const isLoggedIn = isAuthenticated()
const router = useRouter()

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
  padding: 70px 20px 60px;
}

.contact-container {
  max-width: 800px;
  margin: 0 auto;
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

/* Contact Grid — now stacked */
.contact-methods,
.developer-section {
  margin-bottom: 20px;
}

/* Card Base */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 24px;
  backdrop-filter: blur(8px);
}

.card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.section-icon {
  color: var(--accent);
}

/* Developer Section (matches About page) */
.dev-profile {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.dev-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  display: grid;
  place-items: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
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

.no-hover {
  cursor: default;
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

/* Mobile */
@media (max-width: 768px) {
  .contact-page {
    padding: 60px 14px 40px;
  }

  .contact-header h1 {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
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

  .dev-link {
    padding: 6px 12px;
    font-size: 0.78rem;
  }
}
</style>
