import uuid

from backend.chunking.models.chunk import Chunk

chunk = Chunk(
    id=str(uuid.uuid4()),
    document_id="document123",
    content="Artificial Intelligence is amazing.",
    metadata={
        "chunk_number":1
    }
)

print(chunk)