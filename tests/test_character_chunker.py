from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.ingestion.loaders.text_loader import TextLoader

loader = TextLoader()

document = loader.load("datasets/raw/txt/sample.txt")

chunker = CharacterChunker(
    chunk_size=40,
    chunk_overlap=10,
)

chunks = chunker.chunk(document)

for chunk in chunks:

    print("=" * 60)

    print(chunk.content)

    print(chunk.metadata)