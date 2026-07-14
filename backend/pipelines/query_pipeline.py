import time

from backend.llm.generator import GeminiGenerator
from backend.llm.prompt_builder import PromptBuilder


class QueryPipeline:

    def __init__(self, retriever):

        self.retriever = retriever

        self.prompt_builder = PromptBuilder()

        self.generator = GeminiGenerator()

    def query(
        self,
        question: str,
    ):

        start = time.time()

        results = self.retriever.retrieve(
            question,
            top_k=5,
        )

        prompt = self.prompt_builder.build(
            question,
            results,
        )

        answer = self.generator.generate(
            prompt
        )

        generation_time = int(
            (time.time() - start) * 1000
        )

        sources = []

        retrieved_chunks = []

        seen = set()

        for rank, result in enumerate(results):

            embedding = result["embedding"]

            chunk = embedding.chunk

            metadata = chunk.metadata

            file_name = metadata.get(
                "file_name"
            )

            if file_name not in seen:

                seen.add(file_name)

                sources.append(
                    {
                        "id": chunk.id,
                        "documentId": chunk.document_id,
                        "filename": file_name,
                        "fileType": metadata.get(
                            "file_type",
                            "txt",
                        ),
                        "page": metadata.get("page"),
                        "chunkIndex": metadata.get(
                            "chunk_number",
                            rank,
                        ),
                        "similarity": round(
                            result["score"],
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
                    "page": metadata.get("page"),
                    "text": chunk.content,
                    "similarity": round(
                        result["score"],
                        4,
                    ),
                }
            )

        return {

            "question": question,

            # Current frontend expects content
            "content": answer,

            # Older backend tests still expect answer
            "answer": answer,

            "confidence": 0.95,

            "sources": sources,

            "retrievedChunks": retrieved_chunks,

            "generationTimeMs": generation_time,

            "tokenUsage": {
                "prompt": 0,
                "completion": 0,
                "total": 0,
            },
        }