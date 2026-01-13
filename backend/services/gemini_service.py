from services.ai.provider_manager import AIProviderManager

ai_manager = AIProviderManager()

def generate_code(pseudocode: str, language: str, level: str):
    return ai_manager.generate_code(pseudocode, language, level)

def generate_multi_language(pseudocode: str, languages: list, level: str):
    return {
        "success": True,
        "generated_code": {
            lang: generate_code(pseudocode, lang, level)
            for lang in languages
        },
        "level": level
    }
