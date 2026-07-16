from pathlib import Path

from backend.chunking.models.chunk import Chunk
from backend.retrieval.bm25 import BM25Retriever
from backend.retrieval.faiss_store import FAISSStore
from backend.storage.chunks.chunk_store import ChunkStore
from backend.storage.document_registry import DocumentRegistry


class StorageManager:

    def __init__(self):

        self.root = Path(
            "backend/storage/data"
        )

        self.root.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.registry = DocumentRegistry()

        self.chunk_store = ChunkStore()

    @property
    def faiss_path(self):

        return str(
            self.root / "faiss"
        )

    @property
    def bm25_path(self):

        return str(
            self.root / "bm25.pkl"
        )

    def save_indexes(
        self,
        faiss_store: FAISSStore,
        bm25: BM25Retriever,
    ):

        faiss_store.save(
            self.faiss_path
        )

        bm25.save(
            self.bm25_path
        )

    def load_indexes(
        self,
        faiss_store: FAISSStore,
        bm25: BM25Retriever,
    ):

        try:

            faiss_store.load(
                self.faiss_path
            )

            print(
                "Loaded FAISS."
            )

        except Exception:

            print(
                "FAISS not found."
            )

        try:

            bm25.load(
                self.bm25_path
            )

            print(
                "Loaded BM25."
            )

        except Exception:

            print(
                "BM25 not found."
            )

    def save_chunks(
        self,
        document_id: str,
        chunks: list[Chunk],
    ):

        self.chunk_store.save_chunks(
            document_id,
            chunks,
        )

    def load_chunks(
        self,
        document_id: str,
    ):

        return self.chunk_store.load_chunks(
            document_id
        )

    def delete_chunks(
        self,
        document_id: str,
    ):

        self.chunk_store.delete_chunks(
            document_id
        )