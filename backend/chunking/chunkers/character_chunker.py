import uuid

from backend.chunking.chunkers.base_chunker import BaseChunker
from backend.chunking.models.chunk import Chunk
from backend.ingestion.models.document import Document


class CharacterChunker(BaseChunker):

    def __init__(self, chunk_size: int = 500):
        self.chunk_size = chunk_size

    def chunk(self, document: Document) -> list[Chunk]:

        chunks = []

        text = document.content

        for i in range(0, len(text), self.chunk_size):

            chunk_text = text[i:i + self.chunk_size]

            chunk = Chunk(
                id=str(uuid.uuid4()),
                document_id=document.id,
                content=chunk_text,
                metadata={
                    **document.metadata,
                    "chunk_number": len(chunks),
                    "start_char": i,
                    "end_char": i + len(chunk_text)
                }
            )

            chunks.append(chunk)

        return chunks