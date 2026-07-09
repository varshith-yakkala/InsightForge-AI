from backend.ingestion.loaders.text_loader import TextLoader

loader = TextLoader()

document = loader.load("datasets/raw/txt/sample.txt")

print(document)