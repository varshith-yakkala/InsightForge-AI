from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.embeddings.embedding_service import EmbeddingService
from backend.ingestion.loaders.text_loader import TextLoader
from backend.retrieval.bm25 import BM25Retriever

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

bm25 = BM25Retriever()

bm25.add(
    embeddings
)

results = bm25.search(
    "first document",
    top_k=3,
)

for score, embedding in results:

    print("=" * 60)

    print("Score:", score)

    print()

    print(
        embedding.chunk.content
    )