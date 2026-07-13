class DocumentStore:

    def __init__(self):

        self.documents = {}

    def add_document(
        self,
        document,
        chunks,
    ):

        self.documents[document.id] = {
            "id": document.id,
            "file_name": document.metadata["file_name"],
            "source": document.metadata["source"],
            "file_type": document.metadata["file_type"],
            "chunk_count": len(chunks),
        }

    def list_documents(self):

        return list(
            self.documents.values()
        )

    def count(self):

        return len(
            self.documents
        )