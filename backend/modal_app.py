import os
import modal

# Define the Modal app and container image
image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install("modal","fastapi", "uvicorn","pydantic")  # Install Modal in the container
    .env({"PYTHONPATH": "/root/src"})  # Set environment variables
)

app = modal.App("afya-buddy-backend", image=image)

# Define secrets if needed (optional)
secrets = modal.Secret.from_name("afyabuddy-secrets")

@app.function(
    secrets=[secrets],  # Uncomment if you have secrets
    min_containers=1,
    max_containers=2,
    scaledown_window=600,
    timeout=300,
)
@modal.asgi_app()
def web():
    from fastapi import FastAPI
    from pydantic import BaseModel

    # Initialize FastAPI app
    app = FastAPI()

    # Define request models
    class USSDRequest(BaseModel):
        session_id: str
        phone_number: str
        text: str

    class SMSRequest(BaseModel):
        message: str

    # Define USSD endpoint
    @app.post("/ussd")
    async def handle_ussd(request: USSDRequest):
        text = request.text
        if text == "":
            return {"response": "CON Welcome to AfyaBuddy\n1. First Aid Chat\n2. Nearby Hospitals"}
        elif text == "1":
            return {"response": "CON What is the emergency?\n1. Child choking\n2. Snake bite"}
        elif text == "1*1":
            return {"response": "END Stay calm. Perform back blows and chest thrusts. Seek medical help."}
        elif text == "1*2":
            return {"response": "END Keep the victim still. Immobilize the limb. Call emergency services."}
        elif text == "2":
            return {"response": "END Dial 999 or visit the nearest hospital."}
        else:
            return {"response": "END Invalid choice. Please try again."}

    # Define SMS endpoint
    @app.post("/sms")
    async def handle_sms(request: SMSRequest):
        message = request.message.lower()
        if "choking" in message:
            return {"response": "Stay calm. Perform back blows and chest thrusts. Seek medical help."}
        elif "snake bite" in message:
            return {"response": "Keep the victim still. Immobilize the limb. Call emergency services."}
        else:
            return {"response": "Sorry, I didn't understand that. Please specify the emergency (e.g., 'Child choking')."}

    return app