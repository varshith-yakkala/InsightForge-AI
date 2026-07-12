from backend.llm.generator import GeminiGenerator
from backend.llm.prompt_builder import PromptBuilder


class QueryPipeline:

    def __init__(self, retriever):
        self.retriever = retriever
        self.prompt_builder = PromptBuilder()
        self.generator = GeminiGenerator()

    def query(self, question: str):

        results = self.retriever.retrieve(
            question,
            top_k=5
        )

        prompt = self.prompt_builder.build(
            question,
            results
        )

        answer = self.generator.generate(prompt)

        sources = []
        seen = set()

        for result in results:

            metadata = result["embedding"].chunk.metadata

            file_name = metadata.get("file_name")

            if file_name not in seen:
                seen.add(file_name)
                sources.append(metadata)

        return {
            "question": question,
            "answer": answer,
            "sources": sources
        }