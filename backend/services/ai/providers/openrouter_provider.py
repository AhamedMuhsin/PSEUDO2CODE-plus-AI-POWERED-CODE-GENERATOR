import os
import requests


class OpenRouterProvider:
    name = "OpenRouter"
    def __init__(self):
        self.name = "OpenRouter"

        self.api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise RuntimeError("OPENROUTER_API_KEY not set")

        self.url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "mistralai/mistral-7b-instruct:free"

    def _clean_code(self, text: str) -> str:
        # Remove common wrapper tokens
        for token in ["<s>", "</s>", "[OUT]", "[/OUT]"]:
            text = text.replace(token, "")
        return text.strip()

    def generate_code(self, pseudocode: str, language: str, level: str) -> str:
        prompt = f"""
You are an expert {language} developer.

Convert the following pseudocode into executable {language} code.

Rules:
- Output ONLY code
- No markdown
- No explanation

Level: {level}

Pseudocode:
{pseudocode}
""".strip()

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost",
            "X-Title": "Pseudo2Code+"
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3
        }

        response = requests.post(
            self.url,
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.status_code != 200:
            raise RuntimeError(f"OpenRouter error: {response.text}")

        data = response.json()

        if "choices" not in data or not data["choices"]:
            raise RuntimeError("OpenRouter returned no choices")

        raw_code = data["choices"][0]["message"]["content"]
        code = self._clean_code(raw_code)

        if not code:
            raise RuntimeError("OpenRouter returned empty code")

        return code
