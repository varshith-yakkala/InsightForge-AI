from backend.ingestion.loaders.markdown_loader import MarkdownLoader

loader = MarkdownLoader()

document = loader.load("datasets/raw/markdown/sample.md")

print(document)