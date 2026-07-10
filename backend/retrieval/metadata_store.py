from backend.chunking.models.chunk import Chunk


class MetadataStore:

    def __init__(self):

        self.store = {}

    def add(
        self,
        chunk: Chunk,
    ):

        self.store[chunk.id] = chunk

    def get(
        self,
        chunk_id: str,
    ):

        return self.store.get(chunk_id)

    def all(self):

        return self.store