<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import arrowLeft from '@/assets/arrow-left.svg';

const router = useRouter();

const code = ref("");
const language = ref("python");
const isVisualizing = ref(false);

onMounted(() => {
  const savedCode = sessionStorage.getItem("visualize_code");
  const savedLanguage = sessionStorage.getItem("visualize_language");

  if (savedCode && savedLanguage) {
    code.value = savedCode;
    language.value = savedLanguage;
  }
});

const visualize = async () => {
  if (!code.value.trim()) return;
  
  // Prevent double submission
  if (isVisualizing.value) return;
  isVisualizing.value = true;

  try {
    // ✅ THIS IS THE FIX
    await api.post("/visualize", {
      language: language.value,
      code: code.value,
    });

    // keep existing flow
    sessionStorage.setItem("visualize_code", code.value);
    sessionStorage.setItem("visualize_language", language.value);

    router.push("/visualize");
  } catch (err) {
    console.error("Visualization failed", err);
  } finally {
    isVisualizing.value = false;
  }
};
</script>

<template>
  <AuthNavbar />

  <main class="playground-container">
    <!-- BACK BUTTON -->
    <div class="back-top-bar">
      <button class="back-btn-compact" @click="router.push('/dashboard')">
        <img :src="arrowLeft" class="arrow" />
        Back
      </button>
    </div>

    <h1>Visualize Code</h1>
    <p>Paste your code and visualize its execution</p>

    <div class="playground-card">
      <textarea v-model="code" placeholder="Paste your code here..." class="code-input" />

      <div class="controls-row">
        <select v-model="language" class="language-select">
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>

        <button class="visualize-btn" @click="visualize" :disabled="isVisualizing">
          {{ isVisualizing ? "Visualizing..." : "Visualize Code" }}
        </button>
      </div>

    </div>
  </main>
</template>

<style scoped>
/* ════════ BACK ════════ */
.back-top-bar { flex-shrink: 0; }
.back-btn-compact { display: flex; align-items: center; gap: 6px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #e0e7ff; padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
.back-btn-compact:hover { background: rgba(99,102,241,0.25); transform: translateX(-2px); }
.arrow { width: 16px; height: 16px; }

.code-input {
  width: 100%;
  height: 260px;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  color: #e5e7eb;
  margin-top: 20px;
  font-family: monospace;
}

.language-select {
  margin-top: 16px;
  padding: 10px;
  background: #020617;
  color: #e5e7eb;
  border-radius: 8px;
}

.visualize-btn {
  margin-top: 20px;
  padding: 12px 18px;
  background: #22c55e;
  color: #022c22;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.playground-container {
  min-height: 100vh;
  padding: 48px 24px;
  background: radial-gradient(circle at top, #0f172a, #020617);
  color: #f8fafc;
}

.playground-container h1 {
  font-size: 2.4rem;
  font-weight: 800;
}

.playground-container p {
  color: #94a3b8;
  margin-top: 6px;
}

/* 🔮 Glass Card */
.playground-card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.2s ease;
}

.playground-card:hover {
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45);
}

/* 🧠 Code Input */
.code-input {
  width: 100%;
  height: 320px;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 18px;
  color: #e5e7eb;
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  resize: vertical;
}

.code-input::placeholder {
  color: #64748b;
}

.code-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.4);
}

/* ⚙️ Controls Row */
.controls-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
  flex-wrap: wrap;
}

/* 🌐 Language Select */
.language-select {
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e5e7eb;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 500;
}

/* 🚀 Visualize Button */
.visualize-btn {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #022c22;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.visualize-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.35);
}

.visualize-btn:active {
  transform: scale(0.97);
}

/* 📱 Mobile */
@media (max-width: 768px) {
  .code-input {
    height: 260px;
  }
}
</style>
