from backend.llm.generator import GeminiGenerator

generator = GeminiGenerator()

response = generator.generate(
    "Say hello in one sentence."
)

print(response)