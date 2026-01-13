import os
from groq import Groq

class GroqProvider:
    name = "Groq"
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.1-8b-instant"

    def generate_code(self, pseudocode: str, language: str, level: str):
        prompt = f"""
Convert the following pseudocode into {language} code.
Return ONLY executable code.
No markdown. No explanation.

Pseudocode:
{pseudocode}
"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )

        code = response.choices[0].message.content.strip()

        if not code:
            raise RuntimeError("Groq returned empty response")

        return code
