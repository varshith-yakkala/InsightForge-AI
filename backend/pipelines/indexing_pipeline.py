from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.embeddings.embedding_service import EmbeddingService
from backend.ingestion.loaders.loader_factory import LoaderFactory
from backend.retrieval.bm25 import BM25Retriever
from backend.retrieval.faiss_store import FAISSStore
from backend.retrieval.hybrid_retriever import HybridRetriever
from backend.retrieval.retriever import Retriever

from backend.storage.document_registry import DocumentRegistry
from backend.storage.models.indexed_document import IndexedDocument


class IndexingPipeline:

    def __init__(self):

        self.loader_factory = LoaderFactory()

        self.chunker = CharacterChunker(
            chunk_size=500,
            chunk_overlap=100,
        )

        self.embedding_service = EmbeddingService()

        self.faiss_store = FAISSStore()

        self.bm25 = BM25Retriever()

        self.semantic_retriever = Retriever(
            self.faiss_store
        )

        self.hybrid_retriever = HybridRetriever(
            self.semantic_retriever,
            self.bm25,
        )

        self.indexed_files = set()

        self.registry = DocumentRegistry()

    def index(
        self,
        file_path: str,
    ):

        if file_path in self.indexed_files:

            return {
                "retriever": self.hybrid_retriever,
                "document": None,
                "chunks": 0,
                "indexed": False,
            }

        loader = self.loader_factory.get_loader(
            file_path
        )

        document = loader.load(
            file_path
        )

        chunks = self.chunker.chunk(
            document
        )

        embeddings = self.embedding_service.embed_chunks(
            chunks
        )

        self.faiss_store.add(
            embeddings
        )

        self.bm25.add(
            embeddings
        )

        indexed_document = IndexedDocument(
            id=document.id,
            file_name=document.filename,
            file_type=document.file_type,
            path=file_path,
            chunk_count=len(chunks),
            indexed_at=document.uploaded_at,
            size_bytes=document.size_bytes,
        )

        self.registry.add(
            indexed_document
        )

        self.indexed_files.add(
            file_path
        )

        return {
            "retriever": self.hybrid_retriever,
            "document": indexed_document.to_dict(),
            "chunks": len(chunks),
            "indexed": True,
        }

    def get_documents(self):

        return [
            document.to_dict()
            for document in self.registry.all()
        ]

    def get_document(
        self,
        document_id: str,
    ):

        document = self.registry.get(
            document_id
        )

        if document is None:
            return None

        return document.to_dict()

    def get_document_count(self):

        return self.registry.count()

    def get_retriever(self):

        return self.hybrid_retriever