from rank_bm25 import BM25Okapi

from backend.embeddings.models.embedding import Embedding


class BM25Retriever:

    def __init__(self):

        self.documents = []

        self.embeddings = []

        self.bm25 = None

    def add(
        self,
        embeddings: list[Embedding],
    ):

        self.embeddings.extend(embeddings)

        self.documents.extend(
            [
                embedding.chunk.content.split()
                for embedding in embeddings
            ]
        )

        self.bm25 = BM25Okapi(
            self.documents
        )

    def search(
        self,
        query: str,
        top_k: int = 5,
    ):

        if self.bm25 is None:
            return []

        tokenized_query = query.split()

        scores = self.bm25.get_scores(
            tokenized_query
        )

        ranked = sorted(
            zip(
                scores,
                self.embeddings,
            ),
            reverse=True,
            key=lambda x: x[0],
        )

        return ranked[:top_k]