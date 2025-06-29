from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List

@CrewBase
class Afyabuddy():
    """Afyabuddy crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # --- AGENTS ---
    @agent
    def first_aid_expert(self) -> Agent:
        return Agent(config=self.agents_config['first_aid_expert'], verbose=True)

    @agent
    def translator(self) -> Agent:
        return Agent(config=self.agents_config['translator'], verbose=True)

    @agent
    def clinic_finder(self) -> Agent:
        return Agent(config=self.agents_config['clinic_finder'], verbose=True)

    @agent
    def image_analyzer(self) -> Agent:
        return Agent(config=self.agents_config['image_analyzer'], verbose=True)

    @agent
    def situation_analyst(self) -> Agent:
        return Agent(config=self.agents_config['situation_analyst'], verbose=True)

    # --- TASKS ---
    @task
    def give_first_aid(self) -> Task:
        return Task(config=self.tasks_config['give_first_aid'])

    @task
    def translate_first_aid(self) -> Task:
        return Task(config=self.tasks_config['translate_first_aid'])

    @task
    def find_nearby_clinics(self) -> Task:
        return Task(config=self.tasks_config['find_nearby_clinics'])

    @task
    def analyze_image(self) -> Task:
        return Task(config=self.tasks_config['analyze_image'])

    @task
    def analyze_real_time_situation(self) -> Task:
        return Task(config=self.tasks_config['analyze_real_time_situation'])

    @crew
    def crew(self) -> Crew:
        """Creates the Afyabuddy crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )

    # --- HELPER METHODS TO RUN TASKS ---
    def run_first_aid(self, situation):
        key = situation.lower()
        # Map keywords to canonical condition names
        condition_map = {
            "low blood sugar": "low blood sugar",
            "hypoglycemia": "low blood sugar",
            "diabetic episode": "low blood sugar",
            "burn": "burn",
            "choking": "choking",
            "bleeding": "bleeding",
            "snake bite": "snake bite",
            "asthma": "asthma",
            "asthma attack": "asthma",
            "heart attack": "heart attack",
            "stroke": "stroke",
            "seizure": "seizure",
            "nosebleed": "nosebleed",
            "anaphylaxis": "anaphylaxis"
        }
        # Find the canonical condition
        matched = None
        for k, v in condition_map.items():
            if k in key:
                matched = v
                break

        # Hardcoded first aid steps
        steps_dict = {
            "low blood sugar": {
                "title": "🍬 LOW BLOOD SUGAR (HYPOGLYCEMIA) FIRST AID",
                "steps": [
                    "Give 15–20g of fast-acting carbs (glucose tablets, fruit juice, soda, candy).",
                    "Wait 15 minutes and recheck symptoms.",
                    "If symptoms persist, give another 15g sugar.",
                    "When recovered, give a meal or snack with carbs and protein."
                ],
                "do_not": [
                    "Do NOT give anything by mouth if unconscious."
                ],
                "seek_help_if": [
                    "Person is unconscious or unable to swallow."
                ],
                "symptoms": [
                    "Shakiness, dizziness, sweating",
                    "Confusion, fast heartbeat"
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Give sugar immediately",
                    "Wait and check symptoms",
                    "Offer meal once stable",
                    "Call emergency help if unconscious"
                ]
            },
            "burn": {
                "title": "🔥 BURN TREATMENT (Immediate First Aid)",
                "steps": [
                    "Cool the burn: Run cool (not cold) water for 10–20 minutes.",
                    "Remove tight items: Take off jewelry/clothing near burn.",
                    "Protect the area: Use clean, non-stick bandage.",
                    "Pain relief: Take OTC medication if needed."
                ],
                "do_not": [
                    "Do not use butter, creams, or ice.",
                    "Do not break blisters."
                ],
                "seek_help_if": [
                    "Burn is large, deep, or on face/hands/genitals."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Cool with running water",
                    "Remove tight clothing",
                    "Cover with non-stick bandage",
                    "Seek help if severe"
                ]
            },
            "choking": {
                "title": "🫁 CHOKING FIRST AID",
                "steps": [
                    "Ask if they are choking (unable to speak/cough/breathe).",
                    "Give 5 back blows: Firm hits between shoulder blades.",
                    "Give 5 abdominal thrusts: Quick upward pulls above navel.",
                    "Alternate back blows and thrusts until object is dislodged.",
                    "If unresponsive: Start CPR and call emergency services."
                ],
                "confidence": 0.95,
                "recommendations": [
                    "Perform back blows and abdominal thrusts",
                    "Call emergency services",
                    "Start CPR if unconscious"
                ]
            },
            "bleeding": {
                "title": "🩸 BLEEDING FIRST AID",
                "steps": [
                    "Apply pressure: Use cloth or bandage to stop bleeding.",
                    "Elevate injured part above heart level if possible.",
                    "Do not remove cloth: Add more layers if bleeding continues."
                ],
                "seek_help_if": [
                    "Bleeding doesn’t stop after 10–15 minutes.",
                    "Wound is deep or gaping."
                ],
                "do_not": [
                    "Do not remove embedded objects—stabilize them."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Apply direct pressure",
                    "Elevate if possible",
                    "Seek emergency help if bleeding is severe"
                ]
            },
            "snake bite": {
                "title": "🐍 SNAKE BITE FIRST AID",
                "steps": [
                    "Stay calm and keep victim still.",
                    "Immobilize the limb and keep it below heart level.",
                    "Remove restrictive items (rings, watches, etc).",
                    "Call emergency services for antivenom."
                ],
                "do_not": [
                    "Do not cut wound, suck venom, or apply ice."
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Keep the person still",
                    "Call for help immediately",
                    "Avoid cutting or applying ice"
                ]
            },
            "asthma": {
                "title": "💨 ASTHMA ATTACK FIRST AID",
                "steps": [
                    "Sit upright and stay calm.",
                    "Use reliever inhaler: 1 puff every 30–60 seconds, max 10 puffs.",
                    "If no improvement: Call emergency services."
                ],
                "symptoms": [
                    "Difficulty speaking",
                    "Blue lips",
                    "Rapid breathing"
                ],
                "confidence": 0.94,
                "recommendations": [
                    "Use reliever inhaler",
                    "Call help if symptoms persist"
                ]
            },
            "heart attack": {
                "title": "❤️ HEART ATTACK FIRST AID",
                "steps": [
                    "Call emergency services immediately.",
                    "Keep calm and still.",
                    "Give aspirin if available (if not allergic).",
                    "Be ready for CPR if unconscious."
                ],
                "confidence": 0.95,
                "recommendations": [
                    "Call help fast",
                    "Give aspirin if safe",
                    "Prepare to give CPR"
                ]
            },
            "stroke": {
                "title": "🧠 STROKE FIRST AID",
                "steps": [
                    "Use F.A.S.T. Test:",
                    "F - Face drooping",
                    "A - Arm weakness",
                    "S - Speech slurred",
                    "T - Time to call help",
                    "Call emergency services and note time of symptom onset."
                ],
                "do_not": [
                    "Do not give food or drinks."
                ],
                "confidence": 0.94,
                "recommendations": [
                    "Use F.A.S.T. to identify stroke",
                    "Call emergency help"
                ]
            },
            "seizure": {
                "title": "⚡ SEIZURE FIRST AID",
                "steps": [
                    "Stay calm and time the seizure.",
                    "Protect from injury: Remove nearby objects.",
                    "Cushion head with folded clothing or pillow.",
                    "Roll to side after seizure ends."
                ],
                "do_not": [
                    "Do not put anything in their mouth.",
                    "Do not hold them down."
                ],
                "confidence": 0.93,
                "recommendations": [
                    "Keep them safe during seizure",
                    "Roll to side afterward",
                    "Do not restrain or give food/water"
                ]
            },
            "nosebleed": {
                "title": "👃 NOSEBLEED FIRST AID",
                "steps": [
                    "Sit up and lean forward.",
                    "Pinch nose for 10–15 minutes.",
                    "Apply ice to bridge of nose."
                ],
                "do_not": [
                    "Do not tilt head back."
                ],
                "seek_help_if": [
                    "Bleeding lasts more than 20 minutes."
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Pinch nose and lean forward",
                    "Apply ice pack",
                    "Seek help if bleeding doesn't stop"
                ]
            },
            "anaphylaxis": {
                "title": "⚠️ ANAPHYLAXIS FIRST AID",
                "steps": [
                    "Use epipen immediately.",
                    "Lie person down (raise legs if not breathing poorly).",
                    "Call emergency help.",
                    "Repeat epipen in 5–10 minutes if needed."
                ],
                "symptoms": [
                    "Difficulty breathing",
                    "Swelling of face/lips",
                    "Hives or rash"
                ],
                "confidence": 0.97,
                "recommendations": [
                    "Use epipen immediately",
                    "Call for help",
                    "Repeat after 5–10 minutes if no improvement"
                ]
            }
        }

        if matched and matched in steps_dict:
            return steps_dict[matched]
        else:
            return {
                "content": "No hardcoded steps available for this situation.",
                "confidence": 0.0,
                "recommendations": []
            }

    def run_translation(self, text, target_language):
        translated = self.crew().run_task("translate_first_aid", inputs={"text": text, "target_language": target_language})
        return {
            "original": text,
            "translated": translated,
            "target_language": target_language
        }

    def run_find_clinic(self, location):
        return self.crew().run_task("find_nearby_clinics", inputs={"location": location})

    def run_image_analysis(self, image_path):
        return self.crew().run_task("analyze_image", inputs={"image_path": image_path})

    def run_real_time_analysis(self, video_stream):
        return self.crew().run_task("analyze_real_time_situation", inputs={"video_stream": video_stream})
