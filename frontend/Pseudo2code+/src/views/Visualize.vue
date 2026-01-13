<template>
  <AuthNavbar />

  <main class="visualize-container">
    <header class="page-header">
      <h1>Code Visualization Playground</h1>
      <p>Watch your code execute step-by-step</p>
    </header>

    <div class="visualize-grid">
      <!-- LEFT: Python Tutor -->
      <section class="card execution-card">
        <h2>Code Execution</h2>

        <iframe v-if="visualizationUrl" :src="visualizationUrl" width="100%" height="650" frameborder="0"
          allowfullscreen />
        <div v-else-if="externalVisualizerUrl" class="external-visualizer">
          <p class="helper-text">
            This language uses an external visualizer.
            Copy your code and paste it there, then click Run.
          </p>

          <div class="action-row">
            <button class="copy-btn" :class="{ copied }" @click="copyCode">
              {{ copied ? "Copied ✓" : "Copy Code" }}
            </button>

            <a :href="externalVisualizerUrl" target="_blank" class="open-btn">
              Open Visualizer
            </a>
          </div>
        </div>

        <div v-else-if="visualizerType === 'mermaid'" class="empty-state">
          Control-flow visualization for this language
          will be added in a future update.
        </div>

        <div v-else-if="error" class="empty-state">
          {{ error }}
        </div>
        <div v-else class="empty-state">
          No code to visualize
        </div>
      </section>

      <!-- RIGHT: Info -->
      <section class="card info-card">
        <h2>What you can do</h2>
        <ul>
          <li>▶ Step through execution</li>
          <li>📦 Track variable changes</li>
          <li>🔁 Observe loops & functions</li>
        </ul>
      </section>
    </div>
  </main>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";

const router = useRouter();
const copied = ref(false);
const code = sessionStorage.getItem("visualize_code");
const language = sessionStorage.getItem("visualize_language");

if (!code || !language) {
  router.replace("/generate-code");
}
const visualizerType = computed(() => {
  switch (language) {
    case "python":
      return "python-tutor";
    case "javascript":
      return "js-visualizer";
    case "java":
      return "java-visualizer";
    case "c":
    case "cpp":
      return "mermaid";
    default:
      return "unsupported";
  }
});
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(code);
    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (e) {
    console.error("Copy failed", e);
  }
};

const externalVisualizerUrl = computed(() => {
  switch (language) {
    case "javascript":
      return "https://jsv9000.app";
    case "java":
      return "https://cscircles.cemc.uwaterloo.ca/java_visualize/";
    default:
      return null;
  }
});

const visualizationUrl = computed(() => {
  if (language !== "python") return null;

  const encoded = encodeURIComponent(code);
  return `https://pythontutor.com/iframe-embed.html#code=${encoded}&py=3&curInstr=0`;
});

</script>
<style scoped>
.visualize-container {
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 40px 24px;
}

.page-header {
  max-width: 1400px;
  margin: 0 auto 32px;
}

.copy-btn.copied {
  border-color: #22c55e;
  color: #22c55e;
}

.external-visualizer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: #cbd5e1;
}

.action-row {
  display: flex;
  gap: 14px;
  margin-top: 12px;
}

.copy-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #e5e7eb;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.open-btn {
  background: #22c55e;
  color: #022c22;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
}

.page-header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #f8fafc;
}

.page-header p {
  color: #94a3b8;
  margin-top: 6px;
}

.visualize-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 18px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.execution-card {
  height: 650px;
  display: flex;
  flex-direction: column;
}

.tutor-frame {
  flex: 1;
  width: 100%;
  border-radius: 12px;
}

.tutor-frame {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background: #020617;
  /* dark behind iframe */
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    0 20px 40px rgba(0, 0, 0, 0.6);
}

/* Optional subtle dim */
.execution-card {
  position: relative;
}

.execution-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 18px;
  pointer-events: none;
  box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.35);
}

.info-card ul {
  margin-top: 16px;
  padding-left: 18px;
  color: #cbd5e1;
}

@media (max-width: 1024px) {
  .visualize-grid {
    grid-template-columns: 1fr;
  }

  .execution-card {
    height: 500px;
  }
}
</style>
