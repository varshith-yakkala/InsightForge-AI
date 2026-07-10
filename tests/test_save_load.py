from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.embeddings.embedding_service import EmbeddingService
from backend.ingestion.loaders.text_loader import TextLoader
from backend.retrieval.faiss_store import FAISSStore

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

embeddings = embedding_service.embed_chunks(
    chunks
)

store = FAISSStore()

store.add(
    embeddings
)

store.save(
    "vector_store"
)

print("Saved.")

store2 = FAISSStore()

store2.load(
    "vector_store"
)

print("Loaded.")

print(
    len(store2.embeddings)
)