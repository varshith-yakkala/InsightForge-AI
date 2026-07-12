import uuid

from backend.chunking.models.chunk import Chunk
from backend.retrieval.metadata_store import MetadataStore

store = MetadataStore()

chunk = Chunk(
    id=str(uuid.uuid4()),
    document_id="doc1",
    content="Artificial Intelligence",
    metadata={}
)

store.add(chunk)

print(store.get(chunk.id))