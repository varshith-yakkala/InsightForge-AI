from backend.pipelines.indexing_pipeline import IndexingPipeline

pipeline = IndexingPipeline()

retriever = pipeline.index(
    "datasets/raw/txt/sample.txt"
)

print("Pipeline Built Successfully")

results = retriever.retrieve(
    "What is InsightForge AI?"
)

print()

for result in results:

    print("=" * 50)

    print(result["score"])

    print()

    print(
        result["embedding"].chunk.content
    )