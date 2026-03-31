<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-content" @click.stop>
          <button class="btn-close" @click="closeModal" aria-label="Close">&times;</button>

          <!-- Header -->
          <div class="modal-header">
            <div class="header-icon"><Sparkles :size="28" /></div>
            <h2>Upgrade to Premium</h2>
            <p>Unlock unlimited code generations, visualizations &amp; more</p>
          </div>

          <!-- Body -->
          <div class="modal-body">

            <!-- Feature Comparison -->
            <div class="feature-grid">
              <div class="feature-item" v-for="f in features" :key="f.label">
                <component :is="f.icon" :size="20" class="feat-icon" />
                <div>
                  <strong>{{ f.label }}</strong>
                  <p class="feat-free">Free: {{ f.free }}</p>
                  <p class="feat-premium">Premium: {{ f.premium }}</p>
                </div>
              </div>
            </div>

            <!-- Billing toggle -->
            <div class="billing-toggle">
              <button
                :class="['toggle-btn', { active: plan === 'premium_monthly' }]"
                @click="plan = 'premium_monthly'"
              >
                <span class="t-label">Monthly</span>
                <span class="t-price">&#8377;99</span>
              </button>
              <button
                :class="['toggle-btn', { active: plan === 'premium_yearly' }]"
                @click="plan = 'premium_yearly'"
              >
                <span class="t-label">Yearly</span>
                <span class="t-price">&#8377;999</span>
                <span class="t-save">Save 16%</span>
              </button>
            </div>

            <!-- Promo code -->
            <div class="promo-row">
              <input
                v-model="promoCode"
                class="promo-input"
                placeholder="Promo code (e.g. STUDENT50)"
                maxlength="20"
              />
              <span v-if="promoApplied" class="promo-ok"><Check :size="14" /> Applied</span>
            </div>

            <!-- Error -->
            <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Continue Free</button>
            <button class="btn-upgrade" :disabled="processing" @click="handleUpgrade">
              <Loader2 v-if="processing" :size="16" class="spin" />
              <span v-else>{{ upgradeLabel }}</span>
            </button>
          </div>

          <!-- Payment methods strip -->
          <div class="pay-strip">
            <span>💳 Cards</span>
            <span>📱 UPI</span>
            <span>🏦 Net Banking</span>
            <span>₹ Wallets</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Sparkles, Loader2, Check } from 'lucide-vue-next'
import { Code, BarChart3, Cpu, FileText, Unlock, ShieldCheck } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import api from '@/services/api'

const emit = defineEmits(['close', 'upgrade-complete'])

const userStore = useUserStore()
const plan = ref('premium_monthly')
const promoCode = ref('')
const processing = ref(false)
const errorMsg = ref('')
const promoApplied = computed(() => promoCode.value.toUpperCase() === 'STUDENT50')

const features = [
  { icon: Code,        label: 'Code Generations', free: '20/month',   premium: 'Unlimited' },
  { icon: BarChart3,   label: 'Visualizations',   free: '10/month',   premium: 'Unlimited' },
  { icon: Cpu,         label: 'AI Providers',      free: 'Groq only', premium: 'All (Gemini, Groq, OpenRouter)' },
  { icon: FileText,    label: 'Explanations',      free: '200 words', premium: '1 000+ words' },
  { icon: Unlock,      label: 'Algorithms',        free: 'Basic set', premium: 'All unlocked' },
  { icon: ShieldCheck, label: 'Ad-Free',           free: 'With ads',  premium: 'No ads' },
]

const upgradeLabel = computed(() => {
  const prices = { premium_monthly: '₹99/mo', premium_yearly: '₹999/yr' }
  return `Pay ${prices[plan.value]}`
})

function closeModal() { emit('close') }

// ---------- Razorpay Checkout ----------
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
    document.head.appendChild(s)
  })
}

async function handleUpgrade() {
  processing.value = true
  errorMsg.value = ''

  try {
    // 1. Load Razorpay SDK
    await loadRazorpayScript()

    // 2. Create order on backend
    const { data: order } = await api.post('/payment/create-order', {
      plan_id: plan.value,
      promo_code: promoCode.value || null,
    })

    // 3. Open Razorpay checkout
    const options = {
      key: order.key_id,
      amount: order.amount,
      currency: order.currency,
      name: 'Pseudo2Code+',
      description: order.description,
      order_id: order.order_id,
      prefill: {
        email: userStore.user?.email || '',
        name: userStore.user?.name || '',
      },
      theme: { color: '#6366f1' },
      handler: async (response) => {
        // 4. Verify payment on backend
        try {
          await api.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })

          // 5. Refresh subscription state
          await userStore.fetchSubscription()
          await userStore.fetchQuotas()

          emit('upgrade-complete')
          closeModal()

          if (window.showSuccessToast) {
            window.showSuccessToast('🎉 Welcome to Premium! Enjoy unlimited features.')
          }
        } catch (verifyErr) {
          errorMsg.value = 'Payment received but verification failed. Contact support.'
          console.error('Verify error:', verifyErr)
        }
      },
      modal: {
        ondismiss: () => {
          processing.value = false
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (resp) => {
      errorMsg.value = resp.error?.description || 'Payment failed. Please try again.'
      processing.value = false
    })
    rzp.open()
  } catch (err) {
    errorMsg.value = err?.response?.data?.detail || err.message || 'Something went wrong'
    processing.value = false
  }
}
</script>

<style scoped>
/* ---- Overlay ---- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  backdrop-filter: blur(4px);
}

/* ---- Card ---- */
.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: 16px;
  max-width: 560px;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
}

.btn-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--text-muted);
  z-index: 10;
  line-height: 1;
  transition: color 0.2s;
}
.btn-close:hover { color: var(--text-primary); }

/* ---- Header ---- */
.modal-header {
  background: linear-gradient(135deg, var(--accent), #a855f7);
  color: #fff;
  padding: 28px 20px;
  border-radius: 16px 16px 0 0;
  text-align: center;
}
.header-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  display: grid;
  place-items: center;
  margin: 0 auto 12px;
}
.modal-header h2 { margin: 0 0 6px; font-size: 1.5rem; font-weight: 700; }
.modal-header p  { margin: 0; opacity: 0.9; font-size: 0.9rem; }

/* ---- Body ---- */
.modal-body { padding: 24px 20px; }

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.feature-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: 10px;
  font-size: 0.82rem;
}
.feat-icon { color: var(--accent); flex-shrink: 0; margin-top: 2px; }
.feature-item strong { display: block; color: var(--text-primary); margin-bottom: 4px; }
.feat-free    { margin: 2px 0; color: var(--text-muted); }
.feat-premium { margin: 2px 0; color: var(--accent); font-weight: 600; }

/* ---- Billing Toggle ---- */
.billing-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}
.toggle-btn {
  background: var(--bg-page);
  border: 2px solid var(--border-default);
  color: var(--text-secondary);
  padding: 14px 10px;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}
.toggle-btn.active {
  border-color: var(--accent);
  background: var(--accent-bg);
  color: var(--text-primary);
}
.t-label { display: block; font-size: 0.78rem; }
.t-price { display: block; font-size: 1.2rem; font-weight: 700; margin-top: 2px; }
.t-save  {
  display: inline-block;
  background: #22c55e;
  color: #fff;
  font-size: 0.68rem;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 4px;
  font-weight: 600;
}

/* ---- Promo ---- */
.promo-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.promo-input {
  flex: 1;
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 0.88rem;
}
.promo-input::placeholder { color: var(--text-muted); }
.promo-ok { color: #22c55e; font-size: 0.82rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  margin: 8px 0 0;
  padding: 8px 12px;
  background: rgba(239,68,68,0.08);
  border-radius: 8px;
}

/* ---- Footer ---- */
.modal-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-default);
}
.btn-cancel,
.btn-upgrade {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel {
  background: var(--bg-page);
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
}
.btn-cancel:hover { background: var(--border-default); }
.btn-upgrade {
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-upgrade:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-upgrade:disabled { opacity: 0.6; cursor: not-allowed; }

/* ---- Pay strip ---- */
.pay-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 12px 20px 16px;
  font-size: 0.75rem;
  color: var(--text-muted);
}
.pay-strip span {
  background: var(--bg-page);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-default);
}

/* ---- Animations ---- */
.spin { animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

/* ---- Mobile ---- */
@media (max-width: 640px) {
  .modal-overlay { padding: 0; align-items: flex-end; }
  .modal-content { border-radius: 16px 16px 0 0; max-height: 95vh; }
  .feature-grid { grid-template-columns: 1fr; }
  .modal-footer { flex-direction: column; }
}
</style>
