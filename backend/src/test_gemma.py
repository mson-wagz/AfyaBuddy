
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
model = os.getenv("GEMMA_MODEL", "gemma-4-26b-a4b-it")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY was not found. Check your .env file."
    )

client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model=model,
        contents=(
            "You are powering AfyaBuddy, a first-aid assistance app. "
            "In two sentences, explain what someone should do "
            "for a minor cut."
        ),
    )

    print("\n--- GEMMA TEST RESULT ---")
    print("Model:", model)
    print("Response:", response.text)

except Exception as error:
    print("\nGemma API test failed.")
    print(type(error).__name__, str(error))

finally:
    client.close()
