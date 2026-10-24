
from gemma_llm import GemmaLLM

llm = GemmaLLM()

try:
    response = llm.call(
        "You are AfyaBuddy. In one sentence, "
        "explain how to care for a minor cut."
    )

    print("\n--- CREWAI GEMMA ADAPTER TEST ---")
    print(response)

except Exception as error:
    print("\nAdapter test failed:")
    print(type(error).__name__, str(error))

finally:
    llm.close()
