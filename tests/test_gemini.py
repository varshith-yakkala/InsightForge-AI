import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

print("=" * 60)
print("Using Model :", model)
print("=" * 60)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

try:

    response = client.models.generate_content(
        model=model,
        contents="Reply with exactly this sentence: Hello InsightForge!",
    )

    print("\nSUCCESS!\n")
    print(response.text)

except Exception as e:

    print("\nERROR\n")
    print(type(e).__name__)
    print(e)