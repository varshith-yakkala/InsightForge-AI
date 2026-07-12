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

        self.semantic_retriever = None

        self.hybrid_retriever = None

    def index(self, file_path: str):

        loader = self.loader_factory.get_loader(file_path)

        document = loader.load(file_path)

        chunks = self.chunker.chunk(document)

        embeddings = self.embedding_service.embed_chunks(chunks)

        self.faiss_store.add(embeddings)

        self.bm25.add(embeddings)

        self.semantic_retriever = Retriever(
            self.faiss_store
        )

        self.hybrid_retriever = HybridRetriever(
            self.semantic_retriever,
            self.bm25,
        )

        return self.hybrid_retriever