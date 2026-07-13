from pydantic import BaseModel


# -------------------------
# Query
# -------------------------

class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    question: str
    answer: str
    sources: list


# -------------------------
# Health
# -------------------------

class HealthResponse(BaseModel):
    status: str
    embeddingModel: str
    llmModel: str


# -------------------------
# Documents
# -------------------------

class DocumentResponse(BaseModel):
    id: str
    filename: str
    fileType: str
    sizeBytes: int
    uploadedAt: str
    chunks: int
    embeddingStatus: str
    indexed: bool


# -------------------------
# Upload
# -------------------------

class UploadResponse(BaseModel):
    message: str
    documents: list[DocumentResponse]