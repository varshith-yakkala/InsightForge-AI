from backend.services.rag_service import RAGService

rag = RAGService()

rag.load_document(
    "datasets/raw/txt/sample.txt"
)

rag.load_document(
    "datasets/raw/md/sample.md"
)

response = rag.query(
    "What documents are available?"
)

print()

print(response["answer"])

print()

print("Sources")

for source in response["sources"]:

    print(source["file_name"])