import os
import traceback
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "models/gemini-2.5-flash"

def build_prompt(pseudocode: str, language: str, level: str) -> str:
    level_rules = {
        "beginner": """
- Write very simple and readable code
- Use clear variable names
- Add helpful comments
- Avoid advanced syntax
""",
        "intermediate": """
- Follow best practices
- Use clean structure
- Add minimal comments
- Balanced readability and performance
""",
        "pro": """
- Write optimized and production-grade code
- Use advanced language features where appropriate
- Avoid unnecessary comments
- Focus on efficiency and scalability
"""
    }

    return f"""
You are an expert {language} developer.

Convert the following pseudocode into **{language} code**.

LEVEL: {level.upper()}

RULES:
{level_rules.get(level, level_rules["intermediate"])}

IMPORTANT:
- Do NOT use markdown
- Do NOT explain
- Return ONLY executable code

PSEUDOCODE:
{pseudocode}
"""

def generate_code(pseudocode: str, language: str, level: str):
    try:
        prompt = build_prompt(pseudocode, language, level)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        if not response.text:
            raise ValueError("Empty response from Gemini")

        return response.text.strip()

    except Exception as e:
        traceback.print_exc()
        return None


def generate_multi_language(pseudocode: str, languages: list, level: str):
    results = {}

    for lang in languages:
        code = generate_code(pseudocode, lang, level)
        results[lang] = code

    return {
        "success": True,
        "generated_code": results,
        "level": level
    }
