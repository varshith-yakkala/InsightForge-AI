import os
import time

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
            "gemini-3.5-flash",
        )

    def generate(
        self,
        prompt: str,
    ):

        print("\n" + "=" * 80)
        print("MODEL:", self.model)
        print("PROMPT LENGTH:", len(prompt))
        print("=" * 80)
        print(prompt[:2000])
        print("=" * 80)

        last_error = None

        for attempt in range(3):

            try:

                print(f"\nAttempt {attempt + 1}/3")
                print("Calling Gemini...")

                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                )

                print("Gemini responded successfully.")

                print("Response object:")
                print(response)

                if response.text:

                    print("Response text received.")
                    print("=" * 80)

                    return response.text.strip()

                print("Gemini returned an empty response.")
                return "The model returned an empty response."

            except Exception as e:

                last_error = e

                print("\nGemini request failed.")
                print("Attempt:", attempt + 1)
                print("Exception Type:", type(e).__name__)
                print("Exception:", e)
                print("=" * 80)

                if attempt < 2:
                    print("Retrying in 2 seconds...\n")
                    time.sleep(2)

        print("\nAll Gemini attempts failed.")
        raise last_error