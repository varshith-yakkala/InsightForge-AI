from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.embeddings.embedding_service import EmbeddingService
from backend.ingestion.loaders.text_loader import TextLoader
from backend.llm.generator import GeminiGenerator
from backend.pipelines.query_pipeline import QueryPipeline
from backend.retrieval.bm25 import BM25Retriever
from backend.retrieval.faiss_store import FAISSStore
from backend.retrieval.hybrid_retriever import HybridRetriever
from backend.retrieval.retriever import Retriever

loader = TextLoader()

document = loader.load(
    "datasets/raw/txt/sample.txt"
)

chunker = CharacterChunker(
    chunk_size=120,
    chunk_overlap=20,
)
chunks = chunker.chunk(document)

embedding_service = EmbeddingService()

embeddings = embedding_service.embed_chunks(
    chunks
)

store = FAISSStore()

store.add(embeddings)

semantic = Retriever(store)

bm25 = BM25Retriever()

bm25.add(embeddings)

hybrid = HybridRetriever(
    semantic,
    bm25,
)

pipeline = QueryPipeline(
    hybrid
)

response = pipeline.query(
    "What is this document about?"
)

print(response["answer"])

print()

print(response["sources"])