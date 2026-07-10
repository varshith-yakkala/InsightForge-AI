class IDMapper:

    def __init__(self):

        self.chunk_to_index = {}

        self.index_to_chunk = {}

        self.next_index = 0

    def add(self, chunk_id: str):

        if chunk_id in self.chunk_to_index:

            return self.chunk_to_index[chunk_id]

        index = self.next_index

        self.chunk_to_index[chunk_id] = index

        self.index_to_chunk[index] = chunk_id

        self.next_index += 1

        return index

    def get_chunk_id(
        self,
        index: int,
    ):

        return self.index_to_chunk[index]

    def get_index(
        self,
        chunk_id: str,
    ):

        return self.chunk_to_index[chunk_id]