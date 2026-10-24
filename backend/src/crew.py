from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from .gemma_llm import GemmaLLM
from .clinic_search import find_nearby_clinics_tool

@CrewBase
class Afyabuddy():
    """Afyabuddy crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    # --- AGENTS ---
    @agent
    def first_aid_expert(self) -> Agent:
      return Agent(
        config=self.agents_config["first_aid_expert"],
        llm=GemmaLLM(),
        verbose=True,
    )

    @agent
    def translator(self) -> Agent:
     return Agent(
        config=self.agents_config["translator"],
        llm=GemmaLLM(),
        verbose=True,
    )

    
    
    @agent
    def clinic_finder(self) -> Agent:
     return Agent(
        config=self.agents_config["clinic_finder"],
        llm=GemmaLLM(),
        tools=[find_nearby_clinics_tool],
        verbose=True,
    )




    @agent
    def image_analyzer(self) -> Agent:
     return Agent(
        config=self.agents_config["image_analyzer"],
        llm=GemmaLLM(),
        verbose=True,
    )


    
    @agent
    def situation_analyst(self) -> Agent:
     return Agent(
        config=self.agents_config["situation_analyst"],
        llm=GemmaLLM(),
        verbose=True,
    )


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
  
    def _run_single_agent(self, agent, description, expected_output):
        """Execute one existing agent without running unrelated tasks."""
        task = Task(
            description=description,
            expected_output=expected_output,
            agent=agent,
        )

        result = Crew(
            agents=[agent],
            tasks=[task],
            process=Process.sequential,
            verbose=False,
        ).kickoff(inputs={})

        return result.raw

    def run_first_aid(self, situation, target_language="en"):
        """Get first-aid guidance from the first-aid agent."""
        agent = self.first_aid_expert()

        result = self._run_single_agent(
            agent=agent,
            description=(
                f"Provide safe, evidence-based first aid for this situation: "
                f"{situation}\n"
                "Identify immediate danger, list clear steps, explain what "
                "not to do, and state when emergency help is needed. "
                "Do not invent facts. Return structured JSON with title, "
                "immediate_danger, steps, do_not, seek_help_if, symptoms, "
                "confidence, recommendations, and sources."
            ),
            expected_output=(
                "A JSON object with first-aid steps, emergency warnings, "
                "actions to avoid, and sources."
            ),
        )

        if target_language.lower() not in ("en", "english"):
            result = self.run_translation(result, target_language)

        return {"result": result, "language": target_language}

    def run_translation(self, text, target_language):
        """Translate instructions using the translator agent."""
        agent = self.translator()

        return self._run_single_agent(
            agent=agent,
            description=(
                f"Translate these first-aid instructions into "
                f"{target_language}:\n{text}\n"
                "Preserve all emergency warnings, the order of steps, "
                "and the original meaning. Do not add or remove medical advice."
            ),
            expected_output="The complete translated first-aid instructions.",
        )

    def run_find_clinic(self, location, latitude=None, longitude=None):
        """Ask the clinic-finder agent to search for nearby facilities."""
        agent = self.clinic_finder()

        coordinates = ""
        if latitude is not None and longitude is not None:
            coordinates = (
                f"\nLatitude: {latitude}\nLongitude: {longitude}"
            )

        return self._run_single_agent(
            agent=agent,
            description=(
                f"Find nearby healthcare facilities for this location: "
                f"{location}{coordinates}\n"
                "Use the available facility-search tool. Do not invent "
                "facility names, addresses, contact details, or distances. "
                "Clearly report if the search fails."
            ),
            expected_output=(
                "A structured list of healthcare facilities with available "
                "details and a clear indication of any search failure."
            ),
        )

    def run_image_analysis(self, image_path):
        """Do not pretend a text-only model can inspect an image."""
        return {
            "error": (
                "Image analysis requires an image-capable model or vision "
                "tool. The current GemmaLLM adapter is text-only."
            ),
            "image_path": str(image_path),
        }

    def run_real_time_analysis(self, video_stream):
        """Analyze supplied textual observations, not an unseen live stream."""
        agent = self.situation_analyst()

        return self._run_single_agent(
            agent=agent,
            description=(
                "Assess the following supplied situation information. "
                "Identify immediate danger, safe next actions, and when "
                "emergency services are required. Do not claim to see live "
                f"video or frames that were not supplied.\n{video_stream}"
            ),
            expected_output=(
                "A concise assessment with immediate actions, warning signs, "
                "uncertainty, and escalation guidance."
            ),
        )


    KEYWORD_MAP = {
            "low blood sugar": [
                "low blood sugar", "hypoglycemia", "sugar low", "diabetic episode", "shaky", "dizzy", "sweating", "confused", "weak", "faint", "unconscious diabetes"
            ],
            "burn": [
                "burn", "burned", "burnt", "fire", "scald", "hot water", "hot oil", "flame", "skin burn", "steam burn"
            ],
            "choking": [
                "choke", "choking", "can't breathe", "airway", "food stuck", "object in throat", "coughing", "blocked airway"
            ],
            "bleeding": [
                "bleed", "bleeding", "blood", "cut", "wound", "hemorrhage", "gash", "laceration", "open wound", "profuse bleeding"
            ],
            "snake bite": [
                "snake", "snakebite", "bitten by snake", "venom", "snake wound", "reptile bite"
            ],
            "asthma": [
                "asthma", "wheezing", "inhaler", "can't breathe", "shortness of breath", "difficulty breathing", "asthma attack", "tight chest"
            ],
            "heart attack": [
                "heart attack", "chest pain", "myocardial infarction", "tight chest", "pain in chest", "heart problem", "cardiac arrest"
            ],
            "stroke": [
                "stroke", "face drooping", "arm weakness", "speech slurred", "paralysis", "can't speak", "sudden numbness", "brain attack"
            ],
            "seizure": [
                "seizure", "convulsion", "epilepsy", "fits", "shaking", "unconscious", "jerking", "foaming at mouth"
            ],
            "nosebleed": [
                "nosebleed", "nose bleed", "bleeding nose", "blood from nose", "epistaxis"
            ],
            "anaphylaxis": [
                "anaphylaxis", "allergic shock", "severe allergy", "swelling face", "swelling lips", "difficulty breathing allergy", "epipen"
            ],
            "poisoning": [
                "poison", "poisoning", "swallowed poison", "toxic", "ingested chemical", "ate poison", "drank poison"
            ],
            "drowning": [
                "drowning", "almost drowned", "water inhalation", "can't breathe water", "submerged", "near drowning"
            ],
            "fracture": [
                "fracture", "broken bone", "bone break", "crack in bone", "snapped bone", "bone injury"
            ],
            "electric shock": [
                "electric shock", "electrocuted", "shocked", "electricity injury", "power shock", "live wire"
            ],
            "heat stroke": [
                "heat stroke", "overheated", "too hot", "sun stroke", "high temperature", "heat illness", "heat emergency"
            ],
            "hypothermia": [
                "hypothermia", "too cold", "freezing", "low temperature", "shivering", "cold exposure"
            ],
            "heat exhaustion": [
                "heat exhaustion", "tired from heat", "overheated", "sweating a lot", "weak from heat", "heat collapse"
            ],
            "eye injury": [
                "eye injury", "eye trauma", "hit in eye", "object in eye", "chemical in eye", "eye pain", "eye wound"
            ],
            "fainting": [
                "faint", "fainted", "passed out", "lost consciousness", "blackout", "collapse"
            ],
            "animal bite": [
                "animal bite", "bitten by animal", "dog bite", "cat bite", "wild animal bite", "animal wound"
            ],
            "burn (chemical)": [
                "chemical burn", "acid burn", "alkali burn", "chemical on skin", "corrosive burn"
            ],
            "tooth knocked out": [
                "tooth knocked out", "lost tooth", "tooth fell out", "tooth injury", "tooth out"
            ],
            "bullet wound": [
                "bullet wound", "gunshot", "shot", "gun wound", "firearm injury"
            ],
            "fire injury": [
                "fire injury", "burned by fire", "caught fire", "flames injury"
            ],
            "chemical exposure": [
                "chemical exposure", "chemical spill", "chemical on skin", "chemical contact", "toxic exposure"
            ],
            "allergic reaction": [
                "allergic reaction", "allergy", "rash", "swelling", "hives", "itchy", "allergic response"
            ],
            "head injury": [
                "head injury", "hit head", "concussion", "bump on head", "head trauma", "skull injury"
            ],
            "spinal injury": [
                "spinal injury", "back injury", "neck injury", "spine trauma", "can't move legs", "paralyzed"
            ],
            "amputation": [
                "amputation", "cut off", "severed limb", "lost arm", "lost leg", "body part cut off"
            ],
            "crush injury": [
                "crush injury", "crushed", "heavy object fell", "trapped under", "compression injury"
            ],
            "eye chemical burn": [
                "eye chemical burn", "chemical in eye", "acid in eye", "alkali in eye"
            ],
            "frostbite": [
                "frostbite", "frozen skin", "skin turned white", "numb fingers", "cold injury"
            ],
            "hyperventilation": [
                "hyperventilation", "breathing fast", "panic breathing", "rapid breathing", "can't catch breath"
            ],
            "heat cramps": [
                "heat cramps", "muscle cramps", "cramps from heat", "muscle pain heat"
            ],
            "bee sting": [
                "bee sting", "stung by bee", "wasp sting", "insect sting", "bee bite"
            ],
            "dog bite": [
                "dog bite", "bitten by dog", "dog attack", "dog wound"
            ],
            "childbirth emergency": [
                "childbirth", "labor", "giving birth", "baby coming", "delivery emergency", "pregnant emergency"
            ],
            "carbon monoxide poisoning": [
                "carbon monoxide", "gas poisoning", "CO poisoning", "inhaled gas", "heater poisoning"
            ],
            "ear bleeding": [
                "ear bleeding", "blood from ear", "bleeding ear", "ear injury"
            ],
            "vomiting blood": [
                "vomiting blood", "throwing up blood", "blood in vomit", "hematemesis"
            ],
            "diarrhea": [
                "diarrhea", "loose stool", "runny stool", "watery stool", "frequent stool"
            ],
            "panic attack": [
                "panic attack", "anxiety attack", "panic", "sudden fear", "hyperventilating"
            ],
            "broken tooth": [
                "broken tooth", "chipped tooth", "tooth fracture", "tooth broke"
            ],
            "object in nose": [
                "object in nose", "something in nose", "stuck in nose", "nose blockage"
            ],
            "object in ear": [
                "object in ear", "something in ear", "stuck in ear", "ear blockage"
            ],
            "jaw dislocation": [
                "jaw dislocation", "jaw out of place", "dislocated jaw", "jaw injury"
            ],
            "finger amputation": [
                "finger amputation", "cut off finger", "lost finger", "finger severed"
            ],
            "scald (hot liquid burn)": [
                "scald", "hot liquid burn", "burned by hot water", "burned by tea", "burned by soup"
            ]
        }

def detect_condition_from_input(user_input):
    user_input = user_input.lower()
    for condition, keywords in KEYWORD_MAP.items():
        for kw in keywords:
            if kw in user_input:
                return condition
    return None
