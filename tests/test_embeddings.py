from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.embeddings.embedding_service import EmbeddingService
from backend.ingestion.loaders.text_loader import TextLoader


loader = TextLoader()

document = loader.load(
    "datasets/raw/txt/sample.txt"
)

chunker = CharacterChunker(
    chunk_size=40,
    chunk_overlap=10,
)

chunks = chunker.chunk(document)

service = EmbeddingService()

embeddings = service.embed_chunks(chunks)

print("=" * 60)
print("Embedding Service Test")
print("=" * 60)

print(f"Chunks: {len(chunks)}")
print(f"Embeddings: {len(embeddings)}")
print(f"Vector Dimension: {len(embeddings[0].vector)}")

print()

for i, embedding in enumerate(embeddings):

    print("=" * 60)

    print(f"Chunk {i}")

    print()

    print(embedding.chunk.content)

    print()

    print("Vector (first 10 values):")

    print(embedding.vector[:10])