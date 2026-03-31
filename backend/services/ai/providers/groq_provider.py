import os
from groq import Groq

class GroqProvider:
    name = "Groq"
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.1-8b-instant"

    def generate_code(self, pseudocode: str, language: str, level: str):
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
