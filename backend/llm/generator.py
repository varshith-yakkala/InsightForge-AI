import os

from dotenv import load_dotenv
from google import genai

load_dotenv()


class GeminiGenerator:

    def __init__(self):

        api_key = os.getenv(
            "GEMINI_API_KEY"
        )

        if not api_key:
            raise ValueError(
                "Missing GEMINI_API_KEY"
            )

        self.client = genai.Client(
            api_key=api_key
        )

        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-flash-latest"
        )

    def generate(
        self,
        prompt: str,
    ):

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

        return response.text.strip()