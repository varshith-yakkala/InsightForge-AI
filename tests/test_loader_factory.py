from backend.ingestion.loaders.loader_factory import LoaderFactory

files = [
    "datasets/raw/txt/sample.txt",
    "datasets/raw/markdown/sample.md",
    "datasets/raw/pdfs/sample.pdf"
]

for file in files:

    loader = LoaderFactory.get_loader(file)

    document = loader.load(file)

    print("=" * 60)
    print(type(loader).__name__)
    print(document.metadata)