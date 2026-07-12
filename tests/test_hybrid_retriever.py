from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.embeddings.embedding_service import EmbeddingService
from backend.ingestion.loaders.text_loader import TextLoader
from backend.retrieval.bm25 import BM25Retriever
from backend.retrieval.faiss_store import FAISSStore
from backend.retrieval.hybrid_retriever import HybridRetriever
from backend.retrieval.retriever import Retriever

loader = TextLoader()

document = loader.load(
    "datasets/raw/txt/sample.txt"
)

chunker = CharacterChunker(
    chunk_size=40,
    chunk_overlap=10,
)

chunks = chunker.chunk(document)

embedding_service = EmbeddingService()

embeddings = embedding_service.embed_chunks(chunks)

store = FAISSStore()

store.add(embeddings)

semantic = Retriever(store)

bm25 = BM25Retriever()

bm25.add(embeddings)

hybrid = HybridRetriever(
    semantic,
    bm25,
)

results = hybrid.retrieve(
    "first document",
    top_k=3,
)

for result in results:

    print("=" * 60)

    print("Score:")

    print(result["score"])

    print()

    print(result["embedding"].chunk.content)