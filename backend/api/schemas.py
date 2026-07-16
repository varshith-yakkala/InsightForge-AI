from typing import Any

from pydantic import BaseModel


# -------------------------------------------------
# Query
# -------------------------------------------------

class QueryRequest(BaseModel):

    question: str


class TokenUsage(BaseModel):

    prompt: int

    completion: int

    total: int


class QueryResponse(BaseModel):

    question: str

    content: str

    answer: str

    confidence: float

    sources: list[dict[str, Any]]

    retrievedChunks: list[dict[str, Any]]

    generationTimeMs: int

    tokenUsage: TokenUsage


# -------------------------------------------------
# Health
# -------------------------------------------------

class HealthResponse(BaseModel):

    status: str

    embeddingModel: str

    llmModel: str


# -------------------------------------------------
# Documents
# -------------------------------------------------

class DocumentResponse(BaseModel):

    id: str

    file_name: str

    file_type: str

    path: str

    chunk_count: int

    indexed_at: str

    status: str

    size_bytes: int


# -------------------------------------------------
# Upload
# -------------------------------------------------

class UploadResponse(BaseModel):

    message: str

    documents: list[DocumentResponse]


# -------------------------------------------------
# Dashboard
# -------------------------------------------------

class StatsResponse(BaseModel):

    documentsIndexed: int

    totalChunks: int

    totalEmbeddings: int

    totalQueries: int

    avgRetrievalMs: float

    avgLlmResponseMs: float