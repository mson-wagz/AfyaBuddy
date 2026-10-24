
from backboard_llm import BackboardLLM

llm = BackboardLLM()

response = llm.call(
    "Explain three basic first-aid steps for a minor cut. "
    "Keep the answer concise and mention when to seek medical care."
)

print("\nCrewAI → Backboard → Gemini response:\n")
print(response)
