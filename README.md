# AfyaBuddy Crew

Afyabuddy is a multi-agent AI-powered first aid and health assistant platform, built with [crewAI](https://crewai.com). It enables collaborative, intelligent responses to health emergencies, first aid queries, translation, and clinic location, leveraging the power of LLMs and agent orchestration.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Usage](#api-usage)
- [Customizing](#customizing)
- [Understanding Your Crew](#understanding-your-crew)
- [Frontend Deployment](#frontend-deployment)
- [Support](#support)
- [License](#license)

---

## Features

- **First Aid Guidance:** Get step-by-step first aid instructions for a wide range of emergencies.
- **Multilingual Support:** Translate first aid steps into multiple languages.
- **Clinic Finder:** Locate nearby clinics or hospitals.
- **Image Analysis:** Analyze images for medical emergencies (future).
- **Real-Time Situation Analysis:** Analyze live situations (future).
- **Extensible Agent System:** Easily add or modify agents and tasks.

---

## Project Structure

```
Afyabuddy/
├── backend/
│   └── src/
│       └── afyabuddy/
│           ├── config/
│           │   ├── agents.yaml
│           │   └── tasks.yaml
│           ├── crew.py
│           ├── api_server.py
│           └── main.py
├── frontend/
│   ├── src/
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── .env
├── requirements.txt
└── README.md
```

---

## Installation

**Requirements:**  
- Python >=3.10, <3.14  
- [UV](https://docs.astral.sh/uv/) (for dependency management)
- Node.js & npm (for frontend, if used)

**Backend Setup:**

1. Install [uv](https://docs.astral.sh/uv/):
    ```bash
    pip install uv
    ```

2. Install dependencies:
    ```bash
    uv pip install -r requirements.txt
    ```

3. (Optional) Lock dependencies:
    ```bash
    crewai install
    ```

4. Add your `OPENAI_API_KEY` and other secrets to the `.env` file.

**Frontend Setup:**

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

---

## Configuration

- **Agents:**  
  Define your agents in `backend/src/afyabuddy/config/agents.yaml`.

- **Tasks:**  
  Define your tasks in `backend/src/afyabuddy/config/tasks.yaml`.

- **Logic:**  
  Add or modify logic in `backend/src/afyabuddy/crew.py`.

- **Main Entrypoint:**  
  Customize agent/task orchestration in `backend/src/afyabuddy/main.py`.

---

## Running the Project

**Start the API server:**
```bash
cd backend/src/afyabuddy
python3 api_server.py
```
The server will run on [http://localhost:5000](http://localhost:5000).

**Run the crewAI workflow:**
```bash
crewai run
```
This will execute the agents and tasks as defined in your configuration.

---

## API Usage

### First Aid Steps

**POST** `/api/first-aid-steps`

**Request:**
```json
{
  "condition": "burn",
  "target_language": "en"
}
```

**Response:**
```json
{
  "title": "🔥 BURN TREATMENT (Immediate First Aid)",
  "steps": [...],
  "do_not": [...],
  "seek_help_if": [...],
  "confidence": 0.9,
  "recommendations": [...],
  "translations": {...}
}
```

### Translation

**POST** `/api/translate`

**Request:**
```json
{
  "text": "Apply pressure to stop bleeding.",
  "target_language": "sw"
}
```

**Response:**
```json
{
  "original": "Apply pressure to stop bleeding.",
  "translated": "...",
  "target_language": "sw"
}
```

---

## Customizing

- **Agents:** Edit `src/afyabuddy/config/agents.yaml`
- **Tasks:** Edit `src/afyabuddy/config/tasks.yaml`
- **Logic:** Edit `src/afyabuddy/crew.py`
- **Inputs:** Edit `src/afyabuddy/main.py`

---

## Understanding Your Crew

The AfyaBuddy Crew is composed of multiple AI agents, each with unique roles, goals, and tools. These agents collaborate on a series of tasks, defined in `config/tasks.yaml`, leveraging their collective skills to achieve complex objectives. The `config/agents.yaml` file outlines the capabilities and configurations of each agent in your crew.

---

## Frontend Deployment

If you have a frontend built with Vite/React:

1. Build the frontend:
    ```bash
    npm run build
    ```
2. Deploy the `frontend/dist` folder to Netlify or your preferred static hosting.

---

## Support

For support, questions, or feedback:

- [crewAI Documentation](https://docs.crewai.com)
- [crewAI GitHub](https://github.com/joaomdmoura/crewai)
- [Discord Community](https://discord.com/invite/X4JWnZnxPb)
- [Chat with the docs](https://chatg.pt/DWjSBZn)

---

## License

This project is licensed under the MIT License.

---

Let's create wonders together