from backend.ingestion.loaders.text_loader import TextLoader
from backend.chunking.chunkers.character_chunker import CharacterChunker
from backend.storage.document_store import DocumentStore

loader = TextLoader()

document = loader.load(
    "datasets/raw/txt/sample.txt"
)

chunker = CharacterChunker()

chunks = chunker.chunk(document)

store = DocumentStore()

store.add_document(
    document,
    chunks,
)

print()

print(
    "Document Count:",
    store.count()
)

print()

for doc in store.list_documents():

    print(doc)