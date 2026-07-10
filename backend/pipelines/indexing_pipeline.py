from pathlib import Path

from backend.chunking.chunkers.recursive_chunker import RecursiveChunker
from backend.embeddings.embedding_service import EmbeddingService
from backend.ingestion.loaders.loader_factory import LoaderFactory
from backend.retrieval.vector_store import VectorStore


class IndexingPipeline:

    def __init__(
        self,
        vector_store: VectorStore,
        chunk_size: int = 500,
        chunk_overlap: int = 100,
    ):

        self.vector_store = vector_store

        self.chunker = RecursiveChunker(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

        self.embedding_service = EmbeddingService()

    def index_file(
        self,
        file_path: str,
    ):

        loader = LoaderFactory.get_loader(file_path)

        document = loader.load(file_path)

        chunks = self.chunker.chunk(document)

        embeddings = self.embedding_service.embed_chunks(chunks)

        self.vector_store.add(embeddings)

        return len(chunks)

    def index_directory(
        self,
        directory: str,
    ):

        count = 0

        directory = Path(directory)

        for file in directory.rglob("*"):

            if file.suffix.lower() not in [
                ".txt",
                ".pdf",
                ".md",
            ]:
                continue

            print(f"Indexing {file.name}")

            count += self.index_file(str(file))

        return count