from backend.storage.models.indexed_document import IndexedDocument


class DocumentRegistry:

    def __init__(self):

        self.documents = {}

    def add(self, document: IndexedDocument):

        self.documents[document.id] = document

    def remove(self, document_id: str):

        if document_id in self.documents:
            del self.documents[document_id]

    def get(self, document_id: str):

        return self.documents.get(document_id)

    def all(self):

        return list(self.documents.values())

    def count(self):

        return len(self.documents)