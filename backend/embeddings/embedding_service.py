from sentence_transformers import SentenceTransformer

from backend.chunking.models.chunk import Chunk
from backend.embeddings.models.embedding import Embedding


class EmbeddingService:

    def __init__(
        self,
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
    ):
        print("Loading embedding model...")

        self.model = SentenceTransformer(model_name)

        print("Embedding model loaded.")

    def embed(self, text: str):

        return self.model.encode(
            text,
            convert_to_numpy=True,
        )

    def embed_chunk(
        self,
        chunk: Chunk,
    ) -> Embedding:

        vector = self.embed(chunk.content)

        return Embedding(
            chunk=chunk,
            vector=vector.tolist(),
        )

    def embed_chunks(
        self,
        chunks: list[Chunk],
    ) -> list[Embedding]:

        texts = [
            chunk.content
            for chunk in chunks
        ]

        vectors = self.model.encode(
            texts,
            convert_to_numpy=True,
        )

        embeddings = []

        for chunk, vector in zip(chunks, vectors):

            embeddings.append(
                Embedding(
                    chunk=chunk,
                    vector=vector.tolist(),
                )
            )

        return embeddings