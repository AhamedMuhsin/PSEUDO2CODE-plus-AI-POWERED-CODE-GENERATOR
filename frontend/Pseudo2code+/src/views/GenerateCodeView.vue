<template>
  <AuthNavbar />
  <main class="generate-container">
    <!-- Page Header -->
    <header class="page-header">
      <h1>AI Code Generator</h1>
      <p>Transform your pseudocode into production-ready code</p>
    </header>

    <div class="generate-grid">
      <!-- Input Section -->
      <section class="card">
        <h2>Pseudocode Input</h2>
        <p class="subtitle">
          Describe your algorithm using pseudocode or plain English
        </p>

        <textarea v-model="pseudocode"
          placeholder="FUNCTION bubbleSort(array):&#10;FOR i FROM 0 TO n-1:&#10;  FOR j FROM 0 TO n-i-2:&#10;    IF array[j] > array[j+1]:&#10;      SWAP array[j] AND array[j+1]"
          class="code-textarea"></textarea>

        <div class="prompt-indicator" :class="promptQuality.level">
          {{ promptQuality.message }}
        </div>


        <!-- 🔥 Controls Row -->
        <div class="controls">
          <!-- Language -->
          <div class="selector">
            <label>Language</label>
            <select v-model="selectedLanguage">
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>

          </div>

          <!-- 🔥 Level (NEW) -->
          <div class="selector">
            <label>Level</label>
            <select v-model="selectedLevel">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="pro">Pro</option>
            </select>

          </div>
        </div>

        <button class="generate-btn" :disabled="isLoading || !pseudocode.trim()" @click="generateCodeHandler">
          <span v-if="isLoading" class="btn-content">
            <Loader2 class="icon icon-loading spin" />
            Generating...
          </span>

          <span v-else class="btn-content">
            <Sparkles class="icon icon-generate" />
            {{ generatedCode ? "Re-Generate Code" : "Generate Code" }}
          </span>
        </button>


        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </section>

      <!-- Output Section -->
      <section class="card output-card">
        <h2>Generated Code</h2>

        <!-- Header -->
        <div class="code-header">
          <span class="language-badge">
            <Code class="icon-sm icon-language" />
            {{ selectedLanguage }}
          </span>

          <div class="code-actions">
            <button class="copy-btn" @click="copyToClipboard">
              <Check v-if="copied" class="icon-sm icon-success" />
              <Copy v-else class="icon-sm icon-copy" />
              {{ copied ? "Copied" : "Copy" }}
            </button>


            <button class="download-btn" @click="downloadCode">
              <Download class="icon-sm icon-download" />
              Download
            </button>
          </div>



        </div>

        <!-- Scrollable Code Area -->
        <div class="code-scroll">
          <pre v-if="generatedCode"><code ref="codeBlock"
    :class="`language-${hljsLanguage}`">{{ generatedCode }}</code></pre>

          <div v-else-if="isLoading" class="loading-state">
            <Loader2 class="icon icon-loading spin" />
            Generating your code...
          </div>


          <div v-else class="empty-state">
            <Code class="empty-icon icon-empty" />
            <p>Generated code will appear here</p>
          </div>

        </div>

        <!-- Explanation -->
        <div v-if="explanation" class="explanation">
          <h4>Explanation</h4>
          <p>{{ explanation }}</p>
        </div>

        <!-- 🔥 FIXED BOTTOM BUTTON -->
        <button class="visualize-btn" :disabled="!generatedCode || !canVisualize" @click="visualizeCode">

          <Play class="icon icon-visualize" />
          Visualize Code
        </button>


      </section>

    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import { generateCode } from "@/services/codeGenerationService";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { watch, nextTick, computed } from "vue";
import {
  Check,
  Download,
  Sparkles,
  Copy,
  Code,
  Loader2,
  Play
} from "lucide-vue-next";


const router = useRouter();

// State
const pseudocode = ref("");
const selectedLanguage = ref("python");
const generatedCode = ref("");
const explanation = ref("");
const isLoading = ref(false);
const error = ref("");
const codeBlock = ref(null);
const copied = ref(false);

const languageMap = {
  python: "python",
  javascript: "javascript",
  java: "java",
  cpp: "cpp",
  c: "c",
};

const hljsLanguage = computed(() => {
  return languageMap[selectedLanguage.value] || "plaintext";
});

const selectedLevel = ref("intermediate");
const visualizableLanguages = ["python", "java", "javascript", "c", "cpp"];

const canVisualize = computed(() => {
  return ["python", "javascript", "java", "c", "cpp"].includes(
    selectedLanguage.value
  );
});

// Methods
const generateCodeHandler = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const result = await generateCode(
      pseudocode.value,
      [selectedLanguage.value],
      selectedLevel.value
    );

    if (result.success) {
      generatedCode.value = stripMarkdownCodeFence(
        result.generated_code?.[selectedLanguage.value] ||
        "No code generated for selected language"
      );

      explanation.value = result.explanation || "";
    }
    else {
      error.value = result.error || "Failed to generate code";
    }
  } catch (err) {
    error.value = "An error occurred while generating code";
  } finally {
    isLoading.value = false;
  }
};
watch(generatedCode, async () => {
  await nextTick();
  if (codeBlock.value) {
    hljs.highlightElement(codeBlock.value);
  }
});

const promptQuality = computed(() => {
  const text = pseudocode.value.trim();

  if (text.length < 20) {
    return { level: "poor", message: "Prompt too short — add more details" };
  }

  if (!/(for|if|while|function|loop)/i.test(text)) {
    return { level: "average", message: "Add control logic (if / loops) for better results" };
  }

  return { level: "good", message: "Good prompt — ready to generate" };
});
function stripMarkdownCodeFence(code) {
  if (!code) return code;

  return code
    .replace(/^```[\w]*\n?/i, "") // removes ```python
    .replace(/```$/i, "")         // removes ending ```
    .trim();
}

const downloadCode = () => {
  if (!generatedCode.value) return;

  const extensionMap = {
    python: "py",
    javascript: "js",
    java: "java",
    cpp: "cpp",
    c: "c",
  };

  const ext = extensionMap[selectedLanguage.value] || "txt";
  const blob = new Blob([generatedCode.value], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = `generated_code.${ext}`;
  link.click();

  URL.revokeObjectURL(link.href);
};

const copyToClipboard = async () => {
  if (!generatedCode.value) return;

  try {
    await navigator.clipboard.writeText(generatedCode.value);
    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Copy failed", err);
  }
};
const visualizeCode = async () => {
  if (!generatedCode.value || !selectedLanguage.value) return;

  // 🔥 STRIP ```python ``` BEFORE VISUALIZATION
  const cleanCode = stripMarkdownCodeFence(generatedCode.value);

  // Store ONLY clean code for visualization
  sessionStorage.setItem("visualize_code", cleanCode);
  sessionStorage.setItem("visualize_language", selectedLanguage.value);

  // 🚀 Navigate (NO API CALL HERE)
  router.push("/visualize");
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.generate-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: stretch;
}

.prompt-indicator {
  margin-top: 8px;
  font-size: 0.85rem;
}

.prompt-indicator.poor {
  color: #f87171;
}

.prompt-indicator.average {
  color: #facc15;
}

.prompt-indicator.good {
  color: #4ade80;
}

.icon {
  width: 18px;
  height: 18px;
}

.icon-sm {
  width: 14px;
  height: 14px;
}

.icon-success {
  color: #4ade80;
  /* green */
}

.copy-btn {
  transition: all 0.2s ease;
}

.copy-btn:has(.icon-success) {
  background: rgba(74, 222, 128, 0.15);
  border-color: rgba(74, 222, 128, 0.35);
  color: #4ade80;
}

.code-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-icon {
  width: 28px;
  height: 28px;
  opacity: 0.6;
  margin-bottom: 8px;
}

/* ================= ICON BASE ================= */
.icon,
.icon-sm,
.empty-icon {
  stroke-width: 2;
  vertical-align: middle;
}

/* Sizes */
.icon {
  width: 18px;
  height: 18px;
}

.icon-sm {
  width: 14px;
  height: 14px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(34, 197, 94, 0.18);
  border: 1px solid rgba(34, 197, 94, 0.35);
  color: #4ade80;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}

.empty-icon {
  width: 32px;
  height: 32px;
  opacity: 0.5;
}

/* ================= ICON COLORS ================= */

/* Generate */
.icon-generate {
  color: #a78bfa;
  /* violet-400 */
}

/* Loading */
.icon-loading {
  color: #818cf8;
  /* indigo-400 */
}

/* Copy */
.icon-copy {
  color: #60a5fa;
  /* blue-400 */
}

/* Language badge */
.icon-language {
  color: #c084fc;
  /* purple-400 */
}

/* Empty state */
.icon-empty {
  color: #64748b;
  /* slate-500 */
}

/* Visualize */
.icon-visualize {
  color: #4ade80;
  /* green-400 */
}

/* ================= BUTTON ALIGNMENT ================= */

.btn-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Copy button fix */
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Language badge fix */
.language-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* Empty state alignment */
.empty-state {
  flex-direction: column;
  gap: 10px;
}

/* Visualize button alignment */
.visualize-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.prompt-indicator {
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
}

.prompt-indicator.poor {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.prompt-indicator.average {
  background: rgba(250, 204, 21, 0.15);
  color: #facc15;
  border: 1px solid rgba(250, 204, 21, 0.3);
}

.prompt-indicator.good {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

/* Both cards same height */
.card {
  height: 680px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.code-scroll {
  flex: 1;
  overflow-y: auto;
  background: rgba(2, 6, 23, 0.85);
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.code-scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  /* Firefox */
}

.code-scroll::-webkit-scrollbar {
  display: none;
  /* Chrome / Edge */
}


/* Prevent code from stretching layout */
pre {
  margin: 0;
  white-space: pre-wrap;
}

pre {
  background: transparent;
  padding: 0;
}

code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  display: block;
  white-space: pre;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.visualize-btn {
  margin-top: 16px;
  padding: 14px;
  width: 100%;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #ecfdf5;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.visualize-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.4);
}

.visualize-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.generate-container {
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f172a, #020617);
  padding: 40px 24px;
}

.page-header {
  max-width: 1400px;
  margin: 0 auto 32px;
}

.copy-btn:hover {
  background: rgba(96, 165, 250, 0.2);
  border-color: rgba(96, 165, 250, 0.4);
}

.visualize-btn:hover .icon-visualize {
  transform: translateX(2px);
  transition: transform 0.2s ease;
}

.page-header h1 {
  font-size: 2.4rem;
  font-weight: 800;
  color: #f8fafc;
}

.page-header p {
  color: #94a3b8;
  margin-top: 6px;
  font-size: 1rem;
}

.generate-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.card {
  background: rgba(15, 23, 42, 0.85);
  border-radius: 18px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
}

.output-card {
  display: flex;
  flex-direction: column;
}

h2 {
  color: #f1f5f9;
  font-size: 1.4rem;
  margin-bottom: 6px;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.code-textarea {
  width: 100%;
  min-height: 320px;
  background: rgba(2, 6, 23, 0.7);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 14px;
  padding: 18px;
  color: #e5e7eb;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  margin-bottom: 22px;
}

.code-textarea:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.6);
}

.controls {
  margin-bottom: 24px;
}

.language-selector label {
  display: block;
  color: #cbd5f5;
  font-weight: 500;
  margin-bottom: 6px;
}

.language-selector select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.7);
  color: #e5e7eb;
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.generate-btn {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.45);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.language-badge {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.copy-btn {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}

pre {
  background: rgba(2, 6, 23, 0.8);
  border-radius: 14px;
  padding: 18px;
  overflow-x: auto;
  max-height: 420px;
}

code {
  font-family: "JetBrains Mono", monospace;
  color: #e5e7eb;
  font-size: 0.9rem;
}

.explanation {
  margin-top: 18px;
  background: rgba(99, 102, 241, 0.12);
  border-radius: 12px;
  padding: 16px;
}

.explanation h4 {
  color: #a5b4fc;
  margin-bottom: 6px;
}

.empty-state,
.loading-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.95rem;
  text-align: center;
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.selector label {
  display: block;
  color: #cbd5f5;
  font-weight: 500;
  margin-bottom: 6px;
}

.selector select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.7);
  color: #e5e7eb;
  border: 1px solid rgba(99, 102, 241, 0.25);
  cursor: pointer;
}

.selector select:focus {
  outline: none;
  border-color: rgba(99, 102, 241, 0.6);
}

/* Mobile */
@media (max-width: 640px) {
  .controls {
    grid-template-columns: 1fr;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .generate-grid {
    grid-template-columns: 1fr;
  }
}
</style>
