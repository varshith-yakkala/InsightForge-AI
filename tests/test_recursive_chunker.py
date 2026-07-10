from backend.chunking.chunkers.recursive_chunker import RecursiveChunker
from backend.ingestion.loaders.markdown_loader import MarkdownLoader

loader = MarkdownLoader()

document = loader.load(
    "datasets/raw/markdown/sample.md"
)

chunker = RecursiveChunker(
    chunk_size=120,
    chunk_overlap=30,
)

chunks = chunker.chunk(document)

for chunk in chunks:

    print("=" * 60)

    print(chunk.content)

    print(chunk.metadata)