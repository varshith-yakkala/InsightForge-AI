from fastapi import FastAPI

from backend.api.routes import router
from backend.services.rag_service import RAGService

app = FastAPI(
    title="InsightForge AI",
    version="1.0.0",
)

app.state.rag = RAGService()

app.state.rag.load_document(
    "datasets/raw/txt/sample.txt"
)

app.include_router(router)