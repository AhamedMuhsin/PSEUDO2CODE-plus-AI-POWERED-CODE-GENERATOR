<template>
  <div class="overlay">
    <div class="modal">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>

      <div class="actions">
        <button class="btn ghost" @click="$emit('cancel')">Cancel</button>
        <button class="btn danger" @click="$emit('confirm')">
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
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: #020617;
  border-radius: 16px;
  padding: 24px;
  width: 360px;
  border: 1px solid rgba(255,255,255,.1);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.btn.danger {
  background: #ef4444;
  color: white;
}
</style>
