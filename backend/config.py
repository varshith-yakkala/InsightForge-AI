import os

from dotenv import load_dotenv

load_dotenv()


class Config:

    GEMINI_API_KEY = os.getenv(
        "GEMINI_API_KEY"
    )

    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "gemini-flash-latest"
    )

    EMBEDDING_MODEL = (
        "sentence-transformers/all-MiniLM-L6-v2"
    )