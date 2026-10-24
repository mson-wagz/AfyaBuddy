
import os
import requests
from dotenv import load_dotenv
from crewai import BaseLLM

load_dotenv()

BACKBOARD_URL = "https://app.backboard.io/api/threads/messages"


class BackboardLLM(BaseLLM):
    def __init__(self):
        super().__init__(model="gemini-2.5-flash-lite")

        self.api_key = os.getenv("BACKBOARD_API_KEY")
        self.model_name = os.getenv(
            "BACKBOARD_MODEL",
            "gemini-2.5-flash-lite",
        )

        if not self.api_key:
            raise ValueError(
                "BACKBOARD_API_KEY is missing from your .env file."
            )

    def call(
        self,
        messages,
        tools=None,
        callbacks=None,
        available_functions=None,
        **kwargs,
    ) -> str:
        # Convert CrewAI's prompt/messages into Backboard's
        # text-based content field.
        if isinstance(messages, str):
            content = messages
        elif isinstance(messages, list):
            parts = []

            for message in messages:
                if isinstance(message, dict):
                    role = message.get("role", "user")
                    text = message.get("content", "")
                    parts.append(f"{role}: {text}")
                else:
                    parts.append(str(message))

            content = "\n\n".join(parts)
        else:
            content = str(messages)

        headers = {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json",
        }

        payload = {
            "content": content,
            "llm_provider": "google",
            "model_name": self.model_name,
            "stream": False,
        }

        try:
            response = requests.post(
                BACKBOARD_URL,
                headers=headers,
                json=payload,
                timeout=60,
            )
            response.raise_for_status()
            result = response.json()

            answer = result.get("content")

            if not answer:
                raise ValueError(
                    f"Unexpected Backboard response: {result}"
                )

            return answer

        except requests.RequestException as error:
            details = (
                error.response.text
                if error.response is not None
                else str(error)
            )
            raise RuntimeError(
                f"Backboard LLM request failed: {details}"
            ) from error
