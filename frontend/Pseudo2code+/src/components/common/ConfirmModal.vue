<template>
  <div class="overlay" @click.self="$emit('cancel')">
    <div class="modal" :class="{ 'modal-danger': isDanger }">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('cancel')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <p>{{ message }}</p>
      </div>

      <div class="modal-actions">
        <button class="btn ghost" @click="$emit('cancel')">Cancel</button>
        <button :class="isDanger ? 'btn danger' : 'btn primary'" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: "Confirm",
  },
  isDanger: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: rgba(15, 23, 42, 0.95);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

.modal-danger {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(127, 29, 29, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-header h3 {
  color: #ffffff;
  font-size: 1.2rem;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #e5e7eb;
}

.modal-body {
  padding: 20px 24px;
}

.modal-body p {
  color: #cbd5e1;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
}

.btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn.ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e5e7eb;
}

.btn.ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.btn.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn.danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
