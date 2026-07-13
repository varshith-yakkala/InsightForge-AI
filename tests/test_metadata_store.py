from backend.ingestion.loaders.text_loader import TextLoader
from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.retrieval.metadata_store import MetadataStore

loader = TextLoader()

doc = loader.load(
    "datasets/raw/txt/sample.txt"
)

chunker = CharacterChunker()

chunks = chunker.chunk(doc)

store = MetadataStore()

for chunk in chunks:

    store.add(chunk)

store.save("vector_store")

print("Saved")

store2 = MetadataStore()

store2.load("vector_store")

print(
    len(store2.all())
)