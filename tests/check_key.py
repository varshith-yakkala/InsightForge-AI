import os
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY")

print("Key exists:", key is not None)
print("First 8 chars:", key[:8])
print("Last 6 chars:", key[-6:])