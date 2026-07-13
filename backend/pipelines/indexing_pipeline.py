from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.embeddings.embedding_service import EmbeddingService
from backend.ingestion.loaders.loader_factory import LoaderFactory
from backend.retrieval.bm25 import BM25Retriever
from backend.retrieval.faiss_store import FAISSStore
from backend.retrieval.hybrid_retriever import HybridRetriever
from backend.retrieval.retriever import Retriever


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

        self.documents = []

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

        self.indexed_files.add(
            file_path
        )

        self.documents.append(
            {
                "id": document.id,
                "filename": document.filename,
                "fileType": document.file_type,
                "sizeBytes": document.size_bytes,
                "uploadedAt": document.uploaded_at,
                "chunks": len(chunks),
                "embeddingStatus": "indexed",
                "indexed": True,
            }
        )

        return {
            "retriever": self.hybrid_retriever,
            "document": self.documents[-1],
            "chunks": len(chunks),
            "indexed": True,
        }

    def get_documents(self):

        return self.documents

    def get_retriever(self):

        return self.hybrid_retriever