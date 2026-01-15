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

        <div v-else-if="visualizerType === 'mermaid'" ref="mermaidRef" class="mermaid-container"></div>
        <div
  v-else-if="visualizerType === 'mermaid'"
  ref="mermaidRef"
  class="mermaid-container">
</div>

<!-- ✅ ADD THIS BLOCK -->
<div v-if="visualizerType === 'mermaid'" class="export-row">
  <button class="export-btn" @click="exportSVG">Export SVG</button>
</div>

        <div v-else-if="error" class="empty-state">
          {{ error }}
        </div>
        <!-- <div v-else class="empty-state">
          No code to visualize
        </div> -->
      </section>

      <!-- RIGHT: Info -->
      <section class="card info-card">
        <h2>What you can do</h2>
        <ul>
          <li>▶ Step through execution</li>
          <li>📦 Track variable changes</li>
          <li>🔁 Observe loops & functions</li>
        </ul>
          <div class="cfg-legend">
    <h3>CFG Legend</h3>
    <ul>
      <li><span class="dot start"></span> Start / End</li>
      <li><span class="box"></span> Process</li>
      <li><span class="diamond"></span> Condition</li>
      <li><span class="arrow"></span> Loop Back</li>
    </ul>
  </div>
      </section>
    </div>
  </main>
</template>
<script setup>
import { ref, computed } from "vue";
import { onMounted, nextTick, watch } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import mermaid from "mermaid";
import { Canvg } from "canvg";

const router = useRouter();
const copied = ref(false);
const mermaidRef = ref(null);
const visualization = ref(null);
const error = ref("");

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});
const code = sessionStorage.getItem("visualize_code");
const language = sessionStorage.getItem("visualize_language");

if (!code || !language) {
  router.replace("/generate-code");
}
onMounted(async () => {
  if (visualizerType.value !== "mermaid") return;

  try {
    const res = await api.post("/visualize", {
      language,
      code,
    });

    visualization.value = res.data.visualization;
  } catch (err) {
    error.value = "Failed to load visualization";
    console.error(err);
  }
});
watch(visualization, async (val) => {
  if (!val || val.type !== "mermaid") return;
  if (!mermaidRef.value) return;

  await nextTick();

  try {
    mermaidRef.value.innerHTML = val.diagram;
    mermaid.run({ nodes: [mermaidRef.value] });
  } catch (err) {
    console.error("Mermaid render failed", err);
  }
});


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

const exportSVG = () => {
  const svg = mermaidRef.value?.querySelector("svg");
  if (!svg) return;

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  const blob = new Blob([source], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "cfg-diagram.svg";
  link.click();

  URL.revokeObjectURL(url);
};
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
.cfg-legend {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.cfg-legend h3 {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #e5e7eb;
}

.cfg-legend ul {
  list-style: none;
  padding: 0;
  color: #cbd5e1;
}

.cfg-legend li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.dot.start {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #22c55e;
}

.box {
  width: 14px;
  height: 10px;
  background: #64748b;
}

.diamond {
  width: 12px;
  height: 12px;
  background: #facc15;
  transform: rotate(45deg);
}

.arrow {
  width: 16px;
  height: 2px;
  background: #38bdf8;
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
.mermaid-container {
  background: #020617;
  border-radius: 12px;
  padding: 16px;
  overflow-x: auto;
}

.mermaid svg {
  max-width: 100%;
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
.export-row {
  display: flex;
  gap: 12px;
  margin-top: 14px;
}

.export-btn {
  align-self: flex-start;
  margin-top: 16px;

  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #022c22;

  padding: 10px 18px;
  border-radius: 12px;
  border: none;

  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  box-shadow:
    0 10px 20px rgba(34, 197, 94, 0.25),
    inset 0 0 0 1px rgba(255, 255, 255, 0.25);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    filter 0.15s ease;
}

.export-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow:
    0 14px 30px rgba(34, 197, 94, 0.35),
    inset 0 0 0 1px rgba(255, 255, 255, 0.35);
}

.export-btn:active {
  transform: translateY(0);
  box-shadow:
    0 6px 14px rgba(34, 197, 94, 0.25),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
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
