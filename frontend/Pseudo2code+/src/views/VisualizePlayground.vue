<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";

const router = useRouter();

const code = ref("");
const language = ref("python");

const visualize = () => {
  if (!code.value.trim()) return;

  sessionStorage.setItem("visualize_code", code.value);
  sessionStorage.setItem("visualize_language", language.value);

  router.push("/visualize");
};
</script>

<template>
  <AuthNavbar />

  <main class="playground-container">
    <h1>Visualize Code</h1>
    <p>Paste your code and visualize its execution</p>

    <div class="playground-card">
    <textarea
      v-model="code"
      placeholder="Paste your code here..."
      class="code-input"
    />

<div class="controls-row">
  <select v-model="language" class="language-select">
    <option value="python">Python</option>
    <option value="javascript">JavaScript</option>
    <option value="java">Java</option>
    <option value="c">C</option>
    <option value="cpp">C++</option>
  </select>

  <button class="visualize-btn" @click="visualize">
    Visualize Code
  </button>
</div>

    </div>
  </main>
</template>

<style scoped>
.code-input {
  width: 100%;
  height: 260px;
  background: #020617;
  border: 1px solid rgba(255,255,255,0.1);
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
  margin-top: 32px;
  background: rgba(15, 23, 42, 0.85);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.03),
    0 20px 40px rgba(0,0,0,0.6);
}

/* 🧠 Code Input */
.code-input {
  width: 100%;
  height: 320px;
  background: #020617;
  border: 1px solid rgba(255,255,255,0.08);
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
  box-shadow: 0 0 0 1px rgba(99,102,241,0.4);
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
  border: 1px solid rgba(255,255,255,0.12);
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
  box-shadow: 0 10px 30px rgba(34,197,94,0.35);
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
