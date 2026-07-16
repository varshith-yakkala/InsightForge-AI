import time

from backend.llm.generator import GeminiGenerator
from backend.llm.prompt_builder import PromptBuilder

from backend.retrieval.reranker import CrossEncoderReranker
from backend.retrieval.context_compressor import ContextCompressor
from backend.retrieval.confidence import ConfidenceEstimator


class QueryPipeline:

    def __init__(
        self,
        retriever,
    ):

        self.retriever = retriever

        self.prompt_builder = PromptBuilder()

        self.generator = GeminiGenerator()

        self.reranker = CrossEncoderReranker()

        self.compressor = ContextCompressor()

        self.confidence_estimator = ConfidenceEstimator()

    def query(
        self,
        question: str,
    ):

        start = time.time()

        # --------------------------------------------------
        # Step 1 : Candidate Retrieval
        # --------------------------------------------------

        candidate_results = self.retriever.retrieve(
            question,
            top_k=30,
        )

        # --------------------------------------------------
        # Step 2 : Cross Encoder Reranking
        # --------------------------------------------------

        reranked_results = self.reranker.rerank(
            query=question,
            candidates=candidate_results,
            top_k=15,
        )

        # --------------------------------------------------
        # Step 3 : Context Compression
        # --------------------------------------------------

        results = self.compressor.compress(
            reranked_results,
            max_chunks=5,
        )

        # --------------------------------------------------
        # Step 4 : Confidence Estimation
        # --------------------------------------------------

        confidence = self.confidence_estimator.estimate(
            results
        )

        # --------------------------------------------------
        # Step 5 : Prompt Building
        # --------------------------------------------------

        prompt = self.prompt_builder.build(
            question,
            results,
        )

        # --------------------------------------------------
        # Step 6 : LLM Generation
        # --------------------------------------------------

        answer = self.generator.generate(
            prompt
        )

        generation_time = int(
            (time.time() - start) * 1000
        )

        sources = []

        retrieved_chunks = []

        seen_documents = set()

        for rank, result in enumerate(results):

            embedding = result["embedding"]

            chunk = embedding.chunk

            metadata = chunk.metadata

            similarity = result.get(
                "rerank_score",
                result.get(
                    "score",
                    0.0,
                ),
            )

            filename = metadata.get(
                "file_name",
                "Unknown",
            )

            if filename not in seen_documents:

                seen_documents.add(
                    filename
                )

                sources.append(
                    {
                        "id": chunk.id,
                        "documentId": chunk.document_id,
                        "filename": filename,
                        "fileType": metadata.get(
                            "file_type",
                            "txt",
                        ),
                        "page": metadata.get(
                            "page",
                        ),
                        "chunkIndex": metadata.get(
                            "chunk_number",
                            rank,
                        ),
                        "similarity": round(
                            similarity,
                            4,
                        ),
                        "preview": chunk.content[:250],
                    }
                )

            retrieved_chunks.append(
                {
                    "id": chunk.id,
                    "chunkIndex": metadata.get(
                        "chunk_number",
                        rank,
                    ),
                    "page": metadata.get(
                        "page",
                    ),
                    "text": chunk.content,
                    "similarity": round(
                        similarity,
                        4,
                    ),
                }
            )

        return {

            "question": question,

            "content": answer,

            "answer": answer,

            "confidence": confidence,

            "sources": sources,

            "retrievedChunks": retrieved_chunks,

            "generationTimeMs": generation_time,

            "tokenUsage": {

                "prompt": 0,

                "completion": 0,

                "total": 0,

            },

        }