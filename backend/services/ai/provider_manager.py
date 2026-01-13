from services.ai.providers.groq_provider import GroqProvider
from services.ai.providers.gemini_provider import GeminiProvider
from services.ai.providers.openrouter_provider import OpenRouterProvider


class AIProviderManager:
    def __init__(self):
        self.providers = []

        # Priority order matters
        try:
            self.providers.append(GroqProvider())
            print("[AI MANAGER] Groq enabled")
        except Exception as e:
            print("[AI MANAGER] Groq disabled:", e)

        try:
            self.providers.append(GeminiProvider())
            print("[AI MANAGER] Gemini enabled")
        except Exception as e:
            print("[AI MANAGER] Gemini disabled:", e)

        try:
            self.providers.append(OpenRouterProvider())
            print("[AI MANAGER] OpenRouter enabled")
        except Exception as e:
            print("[AI MANAGER] OpenRouter disabled:", e)

        if not self.providers:
            raise RuntimeError("No AI providers available")

    def generate_code(self, pseudocode: str, language: str, level: str) -> str:
        last_error = None

        for provider in self.providers:
            try:
                print(f"[AI MANAGER] Trying {provider.name}...")
                code = provider.generate_code(pseudocode, language, level)

                if code:
                    print(f"[AI MANAGER] ✅ Success with {provider.name}")
                    return code

            except Exception as e:
                print(f"[AI MANAGER] ❌ {provider.name} failed:", e)
                last_error = e

        raise RuntimeError("All AI providers failed") from last_error
