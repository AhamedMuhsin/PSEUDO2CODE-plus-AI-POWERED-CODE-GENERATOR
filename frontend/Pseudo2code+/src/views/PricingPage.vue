<template>
  <AuthNavbar v-if="isLoggedIn" />
  <GuestNavbar v-else />

  <main class="pricing-page">
    <div class="pricing-container">

      <!-- Hero -->
      <section class="pricing-hero">
        <div class="hero-badge">
          <CreditCard :size="14" />
          Student-Friendly Pricing
        </div>
        <h1>Simple, Transparent <span class="gradient-text">Pricing</span></h1>
        <p class="hero-subtitle">
          Choose the plan that fits your learning journey. No hidden charges. Cancel anytime.
        </p>
      </section>

      <!-- Offer Banner -->
      <section class="offer-banner">
        <div class="offer-icon">
          <Zap :size="20" />
        </div>
        <div class="offer-text">
          <strong>First 3 Months at 50% OFF!</strong>
          <span>Get Premium for just ₹49/month — Use code <code>STUDENT50</code></span>
        </div>
      </section>

      <!-- Billing Toggle -->
      <div class="billing-toggle">
        <button :class="{ active: billingPeriod === 'monthly' }" @click="billingPeriod = 'monthly'">
          Monthly
        </button>
        <button :class="{ active: billingPeriod === 'yearly' }" @click="billingPeriod = 'yearly'">
          Yearly
          <span class="save-pill">Save 18%</span>
        </button>
      </div>

      <!-- Plans Grid -->
      <div class="plans-grid">

        <!-- Free Plan -->
        <div class="plan-card">
          <div class="plan-header">
            <div class="plan-icon icon-blue">
              <Gift :size="22" />
            </div>
            <h3>Free</h3>
            <p class="plan-desc">Perfect for beginners</p>
          </div>

          <div class="plan-price">
            <span class="price-amount">₹0</span>
            <span class="price-period">/month</span>
          </div>

          <button class="btn-plan" :disabled="currentPlan === 'free'"
            @click="currentPlan = 'free'">
            {{ currentPlan === 'free' ? '✓ Current Plan' : 'Get Started' }}
          </button>

          <ul class="plan-features">
            <li class="included"><Check :size="16" /> 20 code generations/month</li>
            <li class="included"><Check :size="16" /> 10 visualizations/month</li>
            <li class="included"><Check :size="16" /> 5 downloads/month</li>
            <li class="included"><Check :size="16" /> Groq AI provider</li>
            <li class="included"><Check :size="16" /> Basic explanations</li>
            <li class="included"><Check :size="16" /> Badges & XP system</li>
            <li class="excluded"><X :size="16" /> Ad-free experience</li>
            <li class="excluded"><X :size="16" /> Priority support</li>
          </ul>

          <p class="plan-footer">No credit card required</p>
        </div>

        <!-- Premium Plan -->
        <div class="plan-card featured">
          <div class="featured-badge">Most Popular</div>

          <div class="plan-header">
            <div class="plan-icon icon-accent">
              <Crown :size="22" />
            </div>
            <h3>Premium</h3>
            <p class="plan-desc">Unlimited learning</p>
          </div>

          <div class="plan-price">
            <span class="price-amount">{{ billingPeriod === 'monthly' ? '₹99' : '₹999' }}</span>
            <span class="price-period">{{ billingPeriod === 'monthly' ? '/month' : '/year' }}</span>
          </div>

          <div v-if="billingPeriod === 'yearly'" class="price-savings">
            <TrendingDown :size="14" />
            Save ₹189 per year
          </div>

          <button class="btn-plan btn-premium" @click="handleUpgradeClick">
            <Sparkles :size="16" />
            Upgrade to Premium
          </button>

          <ul class="plan-features">
            <li class="included"><Check :size="16" /> Unlimited code generations</li>
            <li class="included"><Check :size="16" /> Unlimited visualizations</li>
            <li class="included"><Check :size="16" /> Unlimited downloads</li>
            <li class="included"><Check :size="16" /> All AI providers</li>
            <li class="included"><Check :size="16" /> Detailed explanations (1000+ words)</li>
            <li class="included"><Check :size="16" /> All algorithms unlocked</li>
            <li class="highlight"><Check :size="16" /> Ad-free experience</li>
            <li class="highlight"><Check :size="16" /> Priority support</li>
          </ul>

          <p class="plan-footer">14-day free trial available</p>
        </div>

        <!-- Pro Plan -->
        <div class="plan-card dimmed">
          <div class="coming-badge">Coming Soon</div>

          <div class="plan-header">
            <div class="plan-icon icon-purple">
              <GraduationCap :size="22" />
            </div>
            <h3>Pro</h3>
            <p class="plan-desc">For educators</p>
          </div>

          <div class="plan-price">
            <span class="price-amount">₹499</span>
            <span class="price-period">/month</span>
          </div>

          <button class="btn-plan" disabled>Coming Soon</button>

          <ul class="plan-features">
            <li class="included"><Check :size="16" /> Everything in Premium</li>
            <li class="included"><Check :size="16" /> Team management</li>
            <li class="included"><Check :size="16" /> Class management</li>
            <li class="included"><Check :size="16" /> Student analytics</li>
            <li class="included"><Check :size="16" /> Custom algorithms</li>
            <li class="included"><Check :size="16" /> API access</li>
            <li class="included"><Check :size="16" /> Dedicated support</li>
          </ul>

          <p class="plan-footer">For educators & institutions</p>
        </div>
      </div>

      <!-- Feature Comparison -->
      <section class="card comparison-card">
        <h2>
          <BarChart3 :size="20" class="section-icon" />
          Feature Comparison
        </h2>

        <div class="table-wrap">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th class="col-accent">Premium</th>
                <th>Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in comparisonRows" :key="row.feature">
                <td class="feature-name">{{ row.feature }}</td>
                <td>{{ row.free }}</td>
                <td class="col-accent">{{ row.premium }}</td>
                <td>{{ row.pro }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- FAQ -->
      <section class="card faq-card">
        <h2>
          <HelpCircle :size="20" class="section-icon" />
          Frequently Asked Questions
        </h2>

        <div class="faq-grid">
          <div v-for="faq in faqs" :key="faq.q" class="faq-item">
            <h4>{{ faq.q }}</h4>
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-card">
        <h2>Ready to unlock your full potential?</h2>
        <p>Join students learning better with Pseudo2Code+</p>
        <div class="cta-buttons">
          <button class="btn-primary" @click="handleUpgradeClick">
            <Sparkles :size="16" />
            Start Premium for ₹99/month
          </button>
          <router-link to="/dashboard" class="btn-outline">Continue with Free Plan</router-link>
        </div>
        <div class="trust-row">
          <span><Shield :size="14" /> Secure Payment</span>
          <span><Eye :size="14" /> No Hidden Charges</span>
          <span><Check :size="14" /> Money-Back Guarantee</span>
        </div>
      </section>

    </div>
  </main>

  <SiteFooter />

  <!-- Upgrade Modal -->
  <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { isAuthenticated } from '@/services/authService'
import AuthNavbar from '@/components/Navbar/AuthNavbar.vue'
import GuestNavbar from '@/components/Navbar/GuestNavbar.vue'
import SiteFooter from '@/components/common/SiteFooter.vue'
import UpgradeModal from '@/components/common/UpgradeModal.vue'
import {
  CreditCard, Zap, Gift, Crown, GraduationCap, Sparkles,
  Check, X, TrendingDown, BarChart3, HelpCircle,
  Shield, Eye
} from 'lucide-vue-next'

const isLoggedIn = isAuthenticated()
const router = useRouter()
const userStore = useUserStore()

const billingPeriod = ref('monthly')
const currentPlan = ref(userStore.subscription?.tier || 'free')
const showUpgradeModal = ref(false)

function handleUpgradeClick() {
  if (userStore.user) {
    showUpgradeModal.value = true
  } else {
    router.push('/login')
  }
}

const comparisonRows = [
  { feature: 'Monthly Code Generations', free: '20', premium: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Monthly Visualizations', free: '10', premium: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Monthly Downloads', free: '5', premium: 'Unlimited', pro: 'Unlimited' },
  { feature: 'AI Providers', free: '1 (Groq)', premium: '3 (All)', pro: 'All + Custom' },
  { feature: 'Explanation Length', free: '200 words', premium: '1000+ words', pro: 'Unlimited' },
  { feature: 'Algorithm Access', free: 'Basic', premium: 'All', pro: 'All + Custom' },
  { feature: 'Badges & XP', free: '✓', premium: '✓', pro: '✓' },
  { feature: 'Leaderboards', free: '✓', premium: '✓', pro: '✓' },
  { feature: 'Ad-Free', free: '✗', premium: '✓', pro: '✓' },
  { feature: 'Priority Support', free: '✗', premium: '✓', pro: '✓' },
  { feature: 'Team Management', free: '✗', premium: '✗', pro: '✓' },
  { feature: 'API Access', free: '✗', premium: '✗', pro: '✓' },
]

const faqs = [
  { q: '💳 What payment methods do you accept?', a: 'We accept Credit/Debit Cards, UPI, Net Banking, and digital wallets (Google Pay, PhonePe, Paytm).' },
  { q: '🔄 Can I change my plan anytime?', a: 'Yes! Upgrade or downgrade anytime — changes take effect immediately.' },
  { q: '↩️ What\'s your refund policy?', a: '30-day money-back guarantee. No questions asked.' },
  { q: '📱 Multiple devices?', a: 'Absolutely! Your Premium membership works across all devices.' },
  { q: '⏱️ Is there a free trial?', a: 'Yes! 14-day free trial. No credit card required to start.' },
  { q: '📦 What happens when I cancel?', a: 'Premium access continues until the end of your billing period.' },
  { q: '🎓 Student discount?', a: 'Our pricing is already student-friendly at ₹99/month. Use code STUDENT50 for 50% off first 3 months!' },
  { q: '🏫 Plans for schools?', a: 'Our Pro plan is perfect for educators. Contact us for institutional pricing.' },
]
</script>

<style scoped>
.pricing-page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 60px 20px;
}

.pricing-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* ─── Hero ─── */
.pricing-hero {
  text-align: center;
  padding: 40px 0 32px;
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
  margin-bottom: 20px;
}

.pricing-hero h1 {
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent), #a78bfa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 540px;
  margin: 0 auto;
}

/* ─── Offer Banner ─── */
.offer-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto 32px;
  padding: 16px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.12));
  border: 1px solid var(--accent-border);
}

.offer-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--accent);
  color: var(--text-on-accent);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.offer-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.offer-text strong {
  font-size: 0.95rem;
  color: var(--text-primary);
}

.offer-text span {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.offer-text code {
  background: var(--accent-bg);
  color: var(--accent);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.8rem;
}

/* ─── Billing Toggle ─── */
.billing-toggle {
  display: flex;
  gap: 4px;
  justify-content: center;
  max-width: 320px;
  margin: 0 auto 36px;
  padding: 4px;
  border-radius: 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
}

.billing-toggle button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.billing-toggle button.active {
  background: var(--accent);
  color: var(--text-on-accent);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
}

.save-pill {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 100px;
  background: var(--success);
  color: #fff;
  font-weight: 700;
}

/* ─── Plans Grid ─── */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.plan-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 28px 22px;
  position: relative;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  border-color: var(--accent-border);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.plan-card.featured {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 8px 24px rgba(99, 102, 241, 0.15);
}

.plan-card.dimmed {
  opacity: 0.65;
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: var(--text-on-accent);
  padding: 5px 16px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.coming-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--bg-elevated);
  color: var(--text-muted);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  border: 1px solid var(--border-default);
}

/* Plan Header */
.plan-header {
  margin-bottom: 16px;
}

.plan-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
}

.icon-blue { background: rgba(59, 130, 246, 0.12); color: #60a5fa; }
.icon-accent { background: var(--accent-bg); color: var(--accent); }
.icon-purple { background: rgba(168, 85, 247, 0.12); color: #a855f7; }

.plan-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.plan-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Price */
.plan-price {
  margin-bottom: 16px;
}

.price-amount {
  font-size: 2.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.price-period {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-left: 2px;
}

.price-savings {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: var(--success);
  font-weight: 600;
  background: var(--success-bg);
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
}

/* Plan Buttons */
.btn-plan {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border-default);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-plan:hover:not(:disabled) {
  border-color: var(--accent-border);
  color: var(--accent);
  background: var(--bg-hover);
}

.btn-plan:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-premium {
  background: var(--accent);
  color: var(--text-on-accent);
  border-color: var(--accent);
}

.btn-premium:hover:not(:disabled) {
  background: var(--accent-dark);
  border-color: var(--accent-dark);
  color: var(--text-on-accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
}

/* Plan Features */
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.plan-features li.included svg { color: var(--success); flex-shrink: 0; }
.plan-features li.excluded { opacity: 0.45; }
.plan-features li.excluded svg { color: var(--text-dim); flex-shrink: 0; }
.plan-features li.highlight { color: var(--accent-light); font-weight: 600; }
.plan-features li.highlight svg { color: var(--accent); }

.plan-footer {
  text-align: center;
  font-size: 0.78rem;
  color: var(--text-dim);
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
  margin: 0;
}

/* ─── Comparison Card ─── */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 28px;
  margin-bottom: 20px;
}

.card h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.section-icon { color: var(--accent); }

.table-wrap {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid var(--border-light);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table thead {
  background: var(--bg-elevated);
}

.comparison-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border-default);
}

.comparison-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-muted);
  font-size: 0.85rem;
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

.comparison-table tr:hover {
  background: var(--bg-hover);
}

.feature-name {
  font-weight: 500;
  color: var(--text-secondary);
}

.col-accent {
  color: var(--accent-light) !important;
  font-weight: 600;
}

/* ─── FAQ ─── */
.faq-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.faq-item {
  padding: 18px;
  border-radius: 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  transition: border-color 0.2s ease;
}

.faq-item:hover {
  border-color: var(--accent-border);
}

.faq-item h4 {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.faq-item p {
  font-size: 0.83rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* ─── CTA ─── */
.cta-card {
  text-align: center;
  padding: 48px 28px;
  border-radius: 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  margin-top: 20px;
}

.cta-card h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.cta-card p {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 28px;
}

.cta-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 30px;
  border-radius: 12px;
  background: var(--accent);
  color: var(--text-on-accent);
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
  box-shadow: 0 6px 24px var(--accent-bg-hover);
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
}

.trust-row {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.trust-row span {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  color: var(--text-dim);
  font-weight: 500;
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .plans-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto 40px;
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .pricing-page {
    padding: 50px 14px;
  }

  .pricing-hero h1 {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .offer-banner {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .card {
    padding: 20px;
  }

  .cta-card {
    padding: 32px 18px;
  }

  .cta-card h2 {
    font-size: 1.3rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-outline {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .pricing-hero h1 {
    font-size: 1.5rem;
  }

  .plan-card {
    padding: 22px 18px;
  }

  .price-amount {
    font-size: 2rem;
  }

  .trust-row {
    gap: 12px;
  }

  .trust-row span {
    font-size: 0.75rem;
  }

  .billing-toggle button {
    padding: 8px 14px;
    font-size: 0.82rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 10px 12px;
    font-size: 0.78rem;
  }
}
</style>
