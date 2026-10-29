FROM python:3.12-slim

WORKDIR /app

# requirements.txt must include: flask, flask-cors, requests, africastalking,
# python-dotenv, crewai and whatever GemmaLLM needs
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

ENV PORT=5000
EXPOSE 5000

# One worker on purpose: the SMS rate limiter and cache live in memory, and the
# SMS reply is sent from a background thread. --timeout is long because the AI
# agent can take 30+ seconds to answer.
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 1 --threads 8 --timeout 180 api:app"]