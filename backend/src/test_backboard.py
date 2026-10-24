
import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("BACKBOARD_API_KEY")

if not API_KEY:
    raise ValueError("BACKBOARD_API_KEY is missing from your .env file.")

url = "https://app.backboard.io/api/threads/messages"

headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
}

payload = {
    "content": (
        "Explain the basic first-aid steps for a minor cut. "
        "Give general guidance and mention when medical care is needed."
    ),
    "llm_provider": "google",
    "model_name": "gemini-2.5-flash-lite",
    "stream": False,
}

try:
    response = requests.post(
        url,
        headers=headers,
        json=payload,
        timeout=60,
    )

    response.raise_for_status()
    result = response.json()

    print("\nGemini response:\n")
    print(result.get("content", result))

    print("\nBackboard connection successful.")

except requests.RequestException as error:
    print("Backboard request failed:", error)

    if error.response is not None:
        print("Response details:", error.response.text)
