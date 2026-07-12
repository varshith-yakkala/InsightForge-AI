from backend.retrieval.id_mapper import IDMapper

mapper = IDMapper()

id1 = mapper.add("chunk-abc")

id2 = mapper.add("chunk-def")

print(id1)

print(id2)

print(mapper.get_chunk_id(0))

print(mapper.get_chunk_id(1))