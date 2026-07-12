from backend.pipelines.indexing_pipeline import IndexingPipeline
from backend.pipelines.query_pipeline import QueryPipeline


class RAGService:

    def __init__(self):

        self.indexer = IndexingPipeline()

        self.query_pipeline = None

    def load_document(
        self,
        path: str,
    ):

        retriever = self.indexer.index(path)

        self.query_pipeline = QueryPipeline(
            retriever
        )

    def query(
        self,
        question: str,
    ):

        if self.query_pipeline is None:

            raise ValueError(
                "No indexed document."
            )

        return self.query_pipeline.query(
            question
        )