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
You are an expert {language} developer and teacher.
Convert the following pseudocode into {language} code.
Skill level: {level}

IMPORTANT — Add clear, educational inline comments:
- See to that if the {language} == python use this following list of modules as 
the only allowed imports because this modules can only be visualize in python tutor: 
    Only these modules can be imported:
  __future__, abc, array, bisect, calendar, cmath,
  collections, copy, datetime, decimal, doctest, fractions,
  functools, hashlib, heapq, io, itertools, json,
  locale, math, operator, pickle, pprint, random,
  re, string, types, typing, unittest
- At the top: a brief comment describing what the program does
- For every import/include: explain WHY that library is needed (e.g. "// needed for input/output operations")
- For every function: explain WHY we use this function and what it does
- For key logic (loops, conditions, algorithms): explain the reasoning
- Keep comments concise — one line each, not paragraphs
- for various skill levels, adjust the depth of comments:
- Beginner: very detailed comments explaining basic concepts and syntax
- Intermediate: concise comments focusing on the reasoning behind key decisions
- Advanced: minimal comments, only explaining non-obvious logic and design choices
- all include what is job of this var/function/class and why it is needed in the program
- Adjust comment depth to the skill level ({level})

Return ONLY the commented code.
No markdown fences. No extra explanation outside the code.

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
