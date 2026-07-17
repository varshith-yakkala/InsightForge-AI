import os

from dotenv import load_dotenv

load_dotenv()


class Config:

    # -----------------------------
    # Groq Configuration
    # -----------------------------
    GROQ_API_KEY = os.getenv(
        "GROQ_API_KEY"
    )

    GROQ_MODEL = os.getenv(
        "GROQ_MODEL",
        "llama-3.3-70b-versatile"
    )

    # -----------------------------
    # Embedding Model
    # -----------------------------
    EMBEDDING_MODEL = (
        "sentence-transformers/all-MiniLM-L6-v2"
    )