from backend.ingestion.loaders.pdf_loader import PDFLoader

loader = PDFLoader()

document = loader.load("datasets/raw/pdfs/sample.pdf")

print(document)