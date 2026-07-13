from backend.retrieval.id_mapper import IDMapper

mapper = IDMapper()

mapper.add("chunk1")
mapper.add("chunk2")

mapper.save("vector_store")

print("Saved")

mapper2 = IDMapper()

mapper2.load("vector_store")

print(
    mapper2.get_chunk_id(0)
)

print(
    mapper2.get_chunk_id(1)
)