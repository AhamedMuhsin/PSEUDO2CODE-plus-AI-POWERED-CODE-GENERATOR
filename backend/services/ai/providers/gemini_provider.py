import os
from google import genai
from services.ai.base import AIProvider

class GeminiProvider(AIProvider):
    name = "gemini"

    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = "models/gemini-2.5-flash"

    def generate_code(self, pseudocode, language, level):
        prompt = f"""
You are an expert {language} developer.
Convert the following pseudocode into {language} code.
Level: {level}
Return ONLY code. No explanation.

Pseudocode:
{pseudocode}
"""
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        if not response.text:
            raise RuntimeError("Empty response from Gemini")

        return response.text.strip()
