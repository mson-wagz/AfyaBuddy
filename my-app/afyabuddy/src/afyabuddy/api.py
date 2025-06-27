# filepath: afyabuddy/api.py

from fastapi import FastAPI, Request
from .crew import Afyabuddy

app = FastAPI()

@app.post("/api/first-aid-steps")
async def get_first_aid_steps(request: Request):
    data = await request.json()
    condition = data.get("condition")
    result = Afyabuddy().first_aid_steps_crew().kickoff(inputs={"condition": condition})
    return {"steps": result}