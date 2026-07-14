from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes import router
from backend.services.rag_service import RAGService

app = FastAPI(
    title="InsightForge AI",
    version="1.0.0",
)

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# RAG Service
# -----------------------------
app.state.rag = RAGService()

app.state.rag.load_document(
    "datasets/raw/txt/sample.txt"
)

# -----------------------------
# Routes
# -----------------------------
app.include_router(router)