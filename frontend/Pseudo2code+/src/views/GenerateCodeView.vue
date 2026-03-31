<template>
  <AuthNavbar />
  <main class="generate-container">
    <!-- BACK BUTTON -->
    <div class="back-top-bar">
      <button class="back-btn-compact" @click="router.push('/dashboard')">
        <img :src="arrowLeft" class="arrow" />
        Back
      </button>
    </div>

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
      <section ref="outputCard" class="card output-card">
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
              <pre v-if="generatedCode"><code ref="codeBlock" tabindex="-1"
            :class="`language-${hljsLanguage}`">{{ generatedCode }}</code></pre>

          <div v-else-if="isLoading" class="loading-state">
            <Loader2 class="icon icon-loading spin" size="40" />
            <p>Generating your code...</p>
          </div>


          <div v-else class="empty-state">
            <Code class="empty-icon icon-empty" size="48" />
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

    <!-- Quota Indicator for free users -->
    <QuotaIndicator :showVisualizations="false" :showDownloads="false" @upgrade="showUpgrade = true" />
  </main>

  <!-- Upgrade Modal -->
  <UpgradeModal v-if="showUpgrade" @close="showUpgrade = false" />
</template>

<script setup>
import { ref } from "vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import arrowLeft from '@/assets/arrow-left.svg';
import { useRoute } from "vue-router";
import AuthNavbar from "@/components/Navbar/AuthNavbar.vue";
import QuotaIndicator from "@/components/common/QuotaIndicator.vue";
import UpgradeModal from "@/components/common/UpgradeModal.vue";
import { useUserStore } from "@/stores/userStore";
import { generateCode } from "@/services/codeGenerationService";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { watch, nextTick, computed, onMounted } from "vue";
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
const route = useRoute();
const userStore = useUserStore();

// State
const pseudocode = ref("");
const selectedLanguage = ref("python");
const generatedCode = ref("");
const explanation = ref("");
const isLoading = ref(false);
const error = ref("");
const codeBlock = ref(null);
const outputCard = ref(null);
const copied = ref(false);
const showUpgrade = ref(false);

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

onMounted(() => {
  if (route.query.prompt) {
    pseudocode.value = route.query.prompt;
  }
  const storedPseudocode = sessionStorage.getItem("generate_pseudocode");
  const storedCode = sessionStorage.getItem("generate_code");
  const storedLanguage = sessionStorage.getItem("generate_language");
  const storedLevel = sessionStorage.getItem("generate_level");

  if (storedPseudocode) {
    pseudocode.value = storedPseudocode;
  }

  if (storedLanguage) {
    selectedLanguage.value = storedLanguage;
  }

  if (storedLevel) {
    selectedLevel.value = storedLevel;
  }

  if (storedCode) {
    generatedCode.value = stripMarkdownCodeFence(storedCode);
  }

  // Optional cleanup (recommended)
  sessionStorage.removeItem("generate_pseudocode");
  sessionStorage.removeItem("generate_code");
  sessionStorage.removeItem("generate_language");
  sessionStorage.removeItem("generate_level");

  // If we loaded generated code from history, scroll the output into view on mobile
  if (generatedCode.value) {
    nextTick(() => {
      try {
        // Prefer a calculated scroll offset so fixed headers don't cover the panel
        if (outputCard.value) {
          const rect = outputCard.value.getBoundingClientRect();
          if (rect) {
            const header = document.querySelector('nav') || document.querySelector('.auth-navbar');
            const headerHeight = header ? header.getBoundingClientRect().height : 80;
            const y = rect.top + window.pageYOffset - headerHeight - 16;
            window.scrollTo({ top: y, behavior: 'smooth' });
          } else if (outputCard.value.scrollIntoView) {
            outputCard.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        if (codeBlock.value) {
          // ensure focus works
          codeBlock.value.setAttribute('tabindex', '-1');
          codeBlock.value.focus();
        }
      } catch (e) {
        // ignore
      }
    });
  }
});

// Methods
const generateCodeHandler = async () => {
  // Check quota before generating
  if (!userStore.canGenerateCode) {
    showUpgrade.value = true;
    return;
  }

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

      // Refresh quota after successful generation
      userStore.fetchQuotas();
    }
    else {
      error.value = result.error || "Failed to generate code";
    }
  } catch (err) {
    if (err?.response?.status === 429) {
      showUpgrade.value = true;
      error.value = "Daily quota exceeded. Upgrade to Premium for unlimited access.";
    } else {
      error.value = "An error occurred while generating code";
    }
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

  const cleanCode = stripMarkdownCodeFence(generatedCode.value);

  try {
    // 🔥 IMPORTANT: Notify backend that visualization happened
    await api.post("/visualize", {
      language: selectedLanguage.value,
      code: cleanCode,
      viz_type: "from_generate",
    });
  } catch (err) {
    console.error("Failed to save visualization", err);
    // ❗ Do NOT block user — visualization should still work
  }

  // Store for visualize page rendering
  sessionStorage.setItem("visualize_code", cleanCode);
  sessionStorage.setItem("visualize_language", selectedLanguage.value);
  sessionStorage.setItem("visualize_source", "generate");

  // Navigate
  router.push("/visualize");
};
</script>

<style scoped>
/* ════════ BACK ════════ */
.back-top-bar { flex-shrink: 0; }
.back-btn-compact { display: flex; align-items: center; gap: 6px; background: var(--accent-bg); border: 1px solid var(--accent-border); color: var(--accent-lighter); padding: 6px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
.back-btn-compact:hover { background: var(--accent-bg-hover); transform: translateX(-2px); }
.arrow { width: 16px; height: 16px; }

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
  color: var(--warning);
}

.prompt-indicator.good {
  color: var(--success);
}


/* Both cards responsive */
.card {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.code-scroll {
  flex: 1;
  overflow: auto !important;
  background: var(--bg-code);
  border-radius: 12px;
  padding: 0;
  border: 1px solid var(--accent-border);
  max-height: 480px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.12) transparent;
}

.code-scroll::-webkit-scrollbar {
  width: 8px;
}

.code-scroll::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.12);
  border-radius: 8px;
}


/* Prevent code from stretching layout */
pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  overflow-x: auto;
  width: 100%;
  min-width: 0;
}

code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  width: 100%;
  min-width: 0;
}

/* Ensure highlight.js and code blocks use theme colors */
pre, .hljs, code[class*="language-"] {
  background: var(--bg-code) !important;
  color: var(--text-secondary) !important;
  border-radius: 12px;
  padding: 18px;
  overflow-x: auto;
  max-height: none;
  white-space: pre-wrap !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
}

.hljs {
  background: var(--bg-code) !important;
  color: var(--text-secondary) !important;
}

code[class*="language-"], pre > code {
  background: transparent;
  padding: 0;
  color: inherit;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.code-actions {
  display: flex;
  gap: 8px;
}

.generate-container {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 40px 24px;
}

.back-top-bar {
  max-width: 1400px;
  margin: 0 auto 24px;
}

.page-header {
  max-width: 1400px;
  margin: 0 auto 32px;
}



.page-header h1 {
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--text-primary);
}

.page-header p {
  color: var(--text-muted);
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
  background: var(--bg-card);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.output-card {
  display: flex;
  flex-direction: column;
}

h2 {
  color: var(--text-primary);
  font-size: 1.4rem;
  margin-bottom: 6px;
}

.subtitle {
  color: var(--text-muted);
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.code-textarea {
  width: 100%;
  min-height: 320px;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: 18px;
  color: var(--text-secondary);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: vertical;
  margin-bottom: 22px;
}

.code-textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.controls {
  margin-bottom: 24px;
}

.language-selector label {
  display: block;
  color: var(--text-tertiary);
  font-weight: 500;
  margin-bottom: 6px;
}

.language-selector select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: var(--bg-input);
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
}

.generate-btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: var(--accent);
  color: var(--text-on-accent);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.3);
}

.generate-btn:active:not(:disabled) {
  transform: translateY(0);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.visualize-btn {
  margin-top: 16px;
  padding: 14px;
  width: 100%;
  border-radius: 12px;
  border: none;
  background: var(--accent);
  color: var(--text-on-accent);
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.visualize-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.3);
}

.visualize-btn:active:not(:disabled) {
  transform: translateY(0);
}

.visualize-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.language-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--accent-bg);
  color: var(--accent-lighter);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--accent-border);
}

.copy-btn,
.download-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--accent-bg);
  color: var(--accent-lighter);
  border: 1px solid var(--accent-border);
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.copy-btn:hover,
.download-btn:hover {
  background: var(--accent-bg-hover);
  border-color: var(--accent-light);
  transform: translateY(-1px);
}

pre {
  background: var(--bg-code);
  border-radius: 12px;
  padding: 18px;
  overflow-x: auto;
  max-height: none;
}

code {
  font-family: "JetBrains Mono", monospace;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.explanation {
  margin-top: 18px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: 12px;
  padding: 14px;
  transition: all 0.2s ease;
}

.explanation h4 {
  color: var(--accent-lighter);
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.explanation p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.empty-state,
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.95rem;
  text-align: center;
  gap: 12px;
  min-height: 400px;
}

.empty-icon {
  color: var(--text-dim);
  opacity: 0.5;
}

.empty-state p,
.loading-state p {
  margin: 0;
  color: var(--text-muted);
}

.controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.selector label {
  display: block;
  color: var(--text-tertiary);
  font-weight: 500;
  margin-bottom: 6px;
}

.selector select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: var(--bg-input);
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  cursor: pointer;
}

.selector select:focus {
  outline: none;
  border-color: var(--accent);
}

.error-message {
  margin-top: 12px;
  padding: 12px;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  border-radius: 8px;
  color: var(--error-text);
  font-size: 0.85rem;
  animation: slideDown 0.3s ease-out;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-loading {
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.code-actions {
  display: flex;
  gap: 8px;
}

.icon-sm {
  width: 16px;
  height: 16px;
}

.icon-empty {
  opacity: 0.6;
}

/* Tablet */
@media (max-width: 1024px) {
  .generate-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .card {
    height: auto;
    min-height: auto;
    overflow: visible;
  }

  .back-top-bar {
    margin-bottom: 16px;
  }

  .page-header {
    margin-bottom: 24px;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .generate-container {
    padding: 20px 14px;
  }

  .back-top-bar {
    margin-bottom: 12px;
  }

  .back-btn-compact {
    font-size: 0.8rem;
    padding: 8px 12px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .page-header h1 {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .page-header p {
    font-size: 0.85rem;
  }

  .generate-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card {
    padding: 16px;
    border-radius: 12px;
    min-height: auto;
  }

  .output-card {
    overflow: visible;
  }

  h2 {
    font-size: 1.15rem;
    margin-bottom: 4px;
  }

  .subtitle {
    font-size: 0.82rem;
    margin-bottom: 12px;
  }

  .controls {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }

  .selector label {
    font-size: 0.82rem;
    margin-bottom: 4px;
  }

  .selector select {
    padding: 10px;
    font-size: 0.85rem;
    border-radius: 8px;
  }

  .code-textarea {
    min-height: 180px;
    margin-bottom: 8px;
    font-size: 0.82rem;
    padding: 14px;
    border-radius: 10px;
  }

  .prompt-indicator {
    font-size: 0.78rem;
    margin-top: 4px;
    margin-bottom: 12px;
  }

  .generate-btn {
    padding: 12px;
    font-size: 0.9rem;
    gap: 6px;
    border-radius: 10px;
  }

  /* Output card mobile */
  .code-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    margin-bottom: 10px;
  }

  .language-badge {
    align-self: flex-start;
    padding: 4px 10px;
    font-size: 0.7rem;
  }

  .code-actions {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  .copy-btn,
  .download-btn {
    padding: 8px 10px;
    font-size: 0.78rem;
    flex: 1;
    min-width: 0;
    justify-content: center;
    white-space: nowrap;
  }

  .code-scroll {
    max-height: 320px;
    min-height: 250px;
    border-radius: 10px;
  }

  .code-scroll pre {
    margin: 0;
    padding: 12px;
    border-radius: 10px;
  }

  code {
    font-size: 0.78rem;
    line-height: 1.5;
  }

  pre {
    padding: 12px;
    border-radius: 10px;
  }

  .empty-state,
  .loading-state {
    min-height: 200px;
    padding: 20px;
    gap: 8px;
  }

  .empty-state p,
  .loading-state p {
    font-size: 0.85rem;
  }

  .explanation {
    margin-top: 10px;
    padding: 10px;
  }

  .explanation h4 {
    font-size: 0.82rem;
    margin-bottom: 4px;
  }

  .explanation p {
    font-size: 0.82rem;
    line-height: 1.4;
  }

  .visualize-btn {
    margin-top: 10px;
    padding: 12px;
    font-size: 0.88rem;
    border-radius: 10px;
    gap: 6px;
  }

  .error-message {
    font-size: 0.8rem;
    padding: 10px;
    margin-top: 10px;
  }
}
</style>
