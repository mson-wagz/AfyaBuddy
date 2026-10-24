
import os
from dotenv import load_dotenv
from google import genai
from crewai import BaseLLM

load_dotenv()


class GemmaLLM(BaseLLM):
    def __init__(self):
        model = os.getenv(
            "GEMMA_MODEL",
            "gemma-4-26b-a4b-it",
        )
        super().__init__(model=model)

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY was not found in .env"
            )

        self.client = genai.Client(api_key=api_key)

    def call(
        self,
        messages,
        tools=None,
        callbacks=None,
        available_functions=None,
        **kwargs,
    ) -> str:
        if isinstance(messages, str):
            prompt = messages
        else:
            parts = []
            for message in messages:
                if isinstance(message, dict):
                    role = message.get("role", "user")
                    content = message.get("content", "")
                    parts.append(f"{role}: {content}")
                else:
                    parts.append(str(message))

            prompt = "\n\n".join(parts)

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )

        if not response.text:
            raise ValueError("Gemma returned an empty response.")

        return response.text

    def close(self):
        self.client.close()
