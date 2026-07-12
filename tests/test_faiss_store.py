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

embeddings = embedding_service.embed_chunks(chunks)

store = FAISSStore()

store.add(embeddings)

query = embedding_service.embed(
    "Artificial Intelligence"
)

results = store.search(query)

for embedding, distance in results:

    print("=" * 60)

    print("Distance:", distance)

    print()

    print(embedding.chunk.content)