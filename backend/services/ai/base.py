from abc import ABC, abstractmethod

class AIProvider(ABC):
    name = "base"

    @abstractmethod
    def generate_code(self, pseudocode: str, language: str, level: str) -> str:
        pass
