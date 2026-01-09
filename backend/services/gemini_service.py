import os
import traceback
from google import genai

# Initialize Gemini client (NEW SDK ONLY)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "models/gemini-2.5-flash"

def generate_code(pseudocode: str, language: str = "python") -> dict:
    try:
        prompt = f"""
Convert the following pseudocode into clean, executable {language} code.
Return ONLY code.

PSEUDOCODE:
{pseudocode}
"""

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        code = response.text
        if not code:
            raise ValueError("Empty response from Gemini")

        explanation_response = client.models.generate_content(
            model=MODEL_NAME,
            contents=f"Explain this {language} code briefly:\n{code}"
        )

        return {
            "success": True,
            "code": code,
            "explanation": explanation_response.text,
            "language": language
        }

    except Exception as e:
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }


def generate_multi_language(pseudocode: str, languages: list):
    results = {}
    for lang in languages:
        res = generate_code(pseudocode, lang)
        results[lang] = res.get("code") if res.get("success") else None

    return {
        "success": True,
        "generated_code": results
    }
