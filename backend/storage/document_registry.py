import json
from pathlib import Path

from backend.storage.models.indexed_document import IndexedDocument


class DocumentRegistry:

    def __init__(self):

        self.path = Path(
            "backend/storage/data/documents.json"
        )

        self.path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.documents = {}

        self.load()

    # ----------------------------------
    # Persistence
    # ----------------------------------

    def load(self):

        if not self.path.exists():

            return

        with open(
            self.path,
            "r",
            encoding="utf-8",
        ) as f:

            data = json.load(f)

        self.documents = {}

        for item in data:

            document = IndexedDocument(
                **item
            )

            self.documents[
                document.id
            ] = document

    def save(self):

        with open(
            self.path,
            "w",
            encoding="utf-8",
        ) as f:

            json.dump(

                [

                    document.to_dict()

                    for document in self.documents.values()

                ],

                f,

                indent=2,

                ensure_ascii=False,

            )

    # ----------------------------------
    # CRUD
    # ----------------------------------

    def add(
        self,
        document: IndexedDocument,
    ):

        self.documents[
            document.id
        ] = document

        self.save()

    def remove(
        self,
        document_id: str,
    ):

        if document_id in self.documents:

            del self.documents[
                document_id
            ]

            self.save()

    def get(
        self,
        document_id: str,
    ):

        return self.documents.get(
            document_id
        )

    def all(self):

        return list(
            self.documents.values()
        )

    def count(self):

        return len(
            self.documents
        )