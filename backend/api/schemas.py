from pydantic import BaseModel


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    question: str
    answer: str
    sources: list


class HealthResponse(BaseModel):
    status: str


class UploadResponse(BaseModel):
    message: str
    filename: str