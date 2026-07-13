from backend.pipelines.indexing_pipeline import IndexingPipeline
from backend.pipelines.query_pipeline import QueryPipeline


class RAGService:

    def __init__(self):

        self.indexer = IndexingPipeline()

        self.query_pipeline = QueryPipeline(
            self.indexer.get_retriever()
        )

    def load_document(
        self,
        path: str,
    ):

        result = self.indexer.index(
            path
        )

        return result

    def load_documents(
        self,
        paths: list[str],
    ):

        indexed_documents = []

        for path in paths:

            result = self.indexer.index(
                path
            )

            if result["indexed"]:

                indexed_documents.append(
                    result["document"]
                )

        return indexed_documents

    def get_documents(self):

        return self.indexer.get_documents()

    def query(
        self,
        question: str,
    ):

        return self.query_pipeline.query(
            question
        )