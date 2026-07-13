from backend.pipelines.indexing_pipeline import IndexingPipeline
from backend.pipelines.query_pipeline import QueryPipeline


class RAGService:

    def __init__(self):

        self.indexer = IndexingPipeline()

        self.query_pipeline = QueryPipeline(
            self.indexer.hybrid_retriever
        )

    def load_document(
        self,
        path: str,
    ):

        self.indexer.index(path)

    def query(
        self,
        question: str,
    ):

        return self.query_pipeline.query(
            question
        )