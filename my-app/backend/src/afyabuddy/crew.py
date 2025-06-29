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
    def run_first_aid(self, situation, target_language="en"):
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
                ],
                "translations": {
                    "sw": {
                        "title": "🍬 SUKARI YA DAMU CHINI (HYPOGLYCEMIA) HUDUMA YA KWANZA",
                        "steps": [
                            "Mpe gramu 15–20 za sukari inayofyonzwa haraka (vidonge vya glukosi, juisi ya matunda, soda, pipi).",
                            "Subiri dakika 15 na angalia dalili tena.",
                            "Ikiwa dalili zinaendelea, mpe gramu 15 zaidi za sukari.",
                            "Akipona, mpe chakula au kitafunwa chenye wanga na protini."
                        ],
                        "do_not": [
                            "Usimpe kitu chochote mdomoni ikiwa amepoteza fahamu."
                        ],
                        "seek_help_if": [
                            "Mtu amepoteza fahamu au hawezi kumeza."
                        ],
                        "symptoms": [
                            "Kutetemeka, kizunguzungu, jasho",
                            "Mkanganyiko, mapigo ya moyo kasi"
                        ],
                        "recommendations": [
                            "Mpe sukari mara moja",
                            "Subiri na angalia dalili",
                            "Mpe chakula baada ya kupona",
                            "Piga simu ya dharura ikiwa amepoteza fahamu"
                        ]
                    }
                }
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
                ],
                "translations": {
                    "sw": {
                        "title": "🔥 MATIBABU YA KUUNGUA (Huduma ya Kwanza)",
                        "steps": [
                            "Pooza sehemu iliyoungua: Miminia maji baridi (sio ya barafu) kwa dakika 10–20.",
                            "Ondoa vito/nguo karibu na sehemu iliyoungua.",
                            "Funika eneo: Tumia bandeji safi isiyoshika.",
                            "Punguza maumivu: Tumia dawa za maumivu za kawaida."
                        ],
                        "do_not": [
                            "Usitumie siagi, krimu, au barafu.",
                            "Usipasue malengelenge."
                        ],
                        "seek_help_if": [
                            "Kama kuungua ni kubwa, kumeenea, au kumeathiri uso/mikono/sehemu za siri."
                        ],
                        "recommendations": [
                            "Pooza kwa maji yanayotiririka",
                            "Ondoa nguo zilizobana",
                            "Funika kwa bandeji isiyoshika",
                            "Tafuta msaada ikiwa ni kali"
                        ]
                    }
                }
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
                ],
                "translations": {
                    "sw": {
                        "title": "🫁 HUDUMA YA KWANZA YA KUKWAMA",
                        "steps": [
                            "Uliza kama wanakosa hewa (hawawezi kuongea/kukohoa/kupumua).",
                            "Piga mgongoni mara 5: Mapigo makali kati ya mabega.",
                            "Fanya msukumo wa tumbo mara 5: Vuta juu haraka juu ya kitovu.",
                            "Rudia kupiga mgongoni na msukumo wa tumbo hadi kitu kitoke.",
                            "Akipoteza fahamu: Anza CPR na piga simu ya dharura."
                        ],
                        "recommendations": [
                            "Fanya kupiga mgongoni na msukumo wa tumbo",
                            "Piga simu ya dharura",
                            "Anza CPR ikiwa amepoteza fahamu"
                        ]
                    }
                }
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
                ],
                "translations": {
                    "sw": {
                        "title": "🩸 HUDUMA YA KWANZA YA KUTOKA DAMU",
                        "steps": [
                            "Shinikiza eneo: Tumia kitambaa au bandeji kuzuia damu.",
                            "Inua sehemu iliyojeruhiwa juu ya moyo kama inawezekana.",
                            "Usiondoe kitambaa: Ongeza tabaka zaidi kama damu inaendelea kutoka."
                        ],
                        "seek_help_if": [
                            "Damu haikomi baada ya dakika 10–15.",
                            "Jeraha ni kubwa au limepasuka sana."
                        ],
                        "do_not": [
                            "Usiondoe kitu kilichochomeka—kikaze pale pale."
                        ],
                        "recommendations": [
                            "Shinikiza moja kwa moja",
                            "Inua kama inawezekana",
                            "Tafuta msaada wa dharura kama damu ni nyingi"
                        ]
                    }
                }
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
                ],
                "translations": {
                    "sw": {
                        "title": "🐍 HUDUMA YA KWANZA YA KUUMWA NA NYOKA",
                        "steps": [
                            "Tuliza na hakikisha aliyeumwa hatembezi sana.",
                            "Funga kiungo na kiweke chini ya moyo.",
                            "Ondoa vitu vinavyobana (pete, saa, n.k).",
                            "Piga simu ya dharura kwa ajili ya antivenom."
                        ],
                        "do_not": [
                            "Usikate jeraha, usivute sumu, wala usiweke barafu."
                        ],
                        "recommendations": [
                            "Mtu akae kimya",
                            "Tafuta msaada mara moja",
                            "Epuka kukata au kuweka barafu"
                        ]
                    }
                }
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
                ],
                "translations": {
                    "sw": {
                        "title": "💨 HUDUMA YA KWANZA YA PUMU",
                        "steps": [
                            "Kaa wima na tulia.",
                            "Tumia inhaler: Piga pumzi 1 kila sekunde 30–60, hadi mara 10.",
                            "Kama hakuna nafuu: Piga simu ya dharura."
                        ],
                        "symptoms": [
                            "Ugumu wa kuongea",
                            "Midomo ya buluu",
                            "Kupumua haraka"
                        ],
                        "recommendations": [
                            "Tumia inhaler",
                            "Tafuta msaada kama dalili zinaendelea"
                        ]
                    }
                }
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
                ],
                "translations": {
                    "sw": {
                        "title": "❤️ HUDUMA YA KWANZA YA MSHTUKO WA MOYO",
                        "steps": [
                            "Piga simu ya dharura mara moja.",
                            "Kaa kimya na usiondoke.",
                            "Mpe aspirin kama ipo (kama hana mzio).",
                            "Jiandae kufanya CPR kama atapoteza fahamu."
                        ],
                        "recommendations": [
                            "Tafuta msaada haraka",
                            "Mpe aspirin kama inafaa",
                            "Jiandae kufanya CPR"
                        ]
                    }
                }
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
            },
            "poisoning": {
                "title": "☠️ POISONING FIRST AID",
                "steps": [
                    "Remove the person from exposure to the poison if safe.",
                    "Check for breathing and consciousness.",
                    "Call emergency services immediately.",
                    "Do not induce vomiting unless instructed by a professional."
                ],
                "do_not": [
                    "Do not give anything to eat or drink unless told by a professional."
                ],
                "confidence": 0.91,
                "recommendations": [
                    "Call emergency services",
                    "Monitor breathing",
                    "Do not induce vomiting unless instructed"
                ],
                "translations": {
                    "sw": {
                        "title": "☠️ HUDUMA YA KWANZA YA SUMU",
                        "steps": [
                            "Ondoa mtu kwenye chanzo cha sumu ikiwa ni salama.",
                            "Angalia kama anapumua na kama yuko fahamu.",
                            "Piga simu ya dharura mara moja.",
                            "Usimfanye atapike isipokuwa umeelekezwa na mtaalamu."
                        ],
                        "do_not": [
                            "Usimpe chakula au kinywaji chochote isipokuwa umeelekezwa na mtaalamu."
                        ],
                        "recommendations": [
                            "Piga simu ya dharura",
                            "Angalia kupumua",
                            "Usimfanye atapike bila maelekezo"
                        ]
                    }
                }
            },
            "drowning": {
                "title": "🌊 DROWNING FIRST AID",
                "steps": [
                    "Remove the person from the water if safe to do so.",
                    "Check for breathing and pulse.",
                    "Start CPR if not breathing.",
                    "Call emergency services immediately."
                ],
                "confidence": 0.93,
                "recommendations": [
                    "Start CPR if needed",
                    "Call for help",
                    "Keep the person warm"
                ],
                "translations": {
                    "sw": {
                        "title": "🌊 HUDUMA YA KWANZA YA KUZAMA MAJINI",
                        "steps": [
                            "Ondoa mtu majini ikiwa ni salama.",
                            "Angalia kama anapumua na mapigo ya moyo.",
                            "Anza CPR kama hapumui.",
                            "Piga simu ya dharura mara moja."
                        ],
                        "recommendations": [
                            "Anza CPR kama inahitajika",
                            "Piga simu ya msaada",
                            "Mfanye mtu awe na joto"
                        ]
                    }
                }
            },
            "fracture": {
                "title": "🦴 FRACTURE FIRST AID",
                "steps": [
                    "Immobilize the injured area.",
                    "Apply a splint if trained.",
                    "Apply ice to reduce swelling.",
                    "Keep the person still and calm.",
                    "Seek medical help."
                ],
                "do_not": [
                    "Do not try to realign the bone.",
                    "Do not move the person unless necessary."
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Immobilize the area",
                    "Apply ice",
                    "Seek medical attention"
                ],
                "translations": {
                    "sw": {
                        "title": "🦴 HUDUMA YA KWANZA YA KUVUNJIKA MFUPA",
                        "steps": [
                            "Fanya eneo lililovunjika lisisonge.",
                            "Tumia mbao au kitu kigumu kama unajua jinsi.",
                            "Weka barafu kupunguza uvimbe.",
                            "Mtu akae kimya na tulivu.",
                            "Tafuta msaada wa kitabibu."
                        ],
                        "do_not": [
                            "Usijaribu kurekebisha mfupa.",
                            "Usimsogeze mtu isipokuwa ni lazima."
                        ],
                        "recommendations": [
                            "Fanya eneo lisisonge",
                            "Weka barafu",
                            "Tafuta msaada wa daktari"
                        ]
                    }
                }
            },
            "electric shock": {
                "title": "⚡ ELECTRIC SHOCK FIRST AID",
                "steps": [
                    "Turn off the source of electricity if possible.",
                    "Do not touch the person until it is safe.",
                    "Check for breathing and pulse.",
                    "Start CPR if needed.",
                    "Call emergency services."
                ],
                "confidence": 0.93,
                "recommendations": [
                    "Ensure safety first",
                    "Start CPR if needed",
                    "Call for emergency help"
                ],
                "translations": {
                    "sw": {
                        "title": "⚡ HUDUMA YA KWANZA YA MSHTUKO WA UMEME",
                        "steps": [
                            "Zima chanzo cha umeme kama inawezekana.",
                            "Usimguse mtu hadi uhakikishe ni salama.",
                            "Angalia kama anapumua na mapigo ya moyo.",
                            "Anza CPR kama inahitajika.",
                            "Piga simu ya dharura."
                        ],
                        "recommendations": [
                            "Hakikisha usalama kwanza",
                            "Anza CPR kama inahitajika",
                            "Piga simu ya dharura"
                        ]
                    }
                }
            },
            "heat stroke": {
                "title": "🌞 HEAT STROKE FIRST AID",
                "steps": [
                    "Move the person to a cooler place.",
                    "Remove excess clothing.",
                    "Cool the person with water, fans, or ice packs.",
                    "Give cool fluids if conscious.",
                    "Call emergency services."
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Cool the person quickly",
                    "Give fluids if awake",
                    "Seek emergency help"
                ],
                "translations": {
                    "sw": {
                        "title": "🌞 HUDUMA YA KWANZA YA KUPATA JOTO KALI",
                        "steps": [
                            "Mhamishe mtu mahali penye baridi.",
                            "Mvue nguo nyingi.",
                            "Mpoze kwa maji, feni, au barafu.",
                            "Mpe vinywaji baridi kama yuko fahamu.",
                            "Piga simu ya dharura."
                        ],
                        "recommendations": [
                            "Mpoze haraka",
                            "Mpe vinywaji kama yuko macho",
                            "Tafuta msaada wa dharura"
                        ]
                    }
                }
            },
            "hypothermia": {
                "title": "❄️ HYPOTHERMIA FIRST AID",
                "steps": [
                    "Move the person to a warm, dry place.",
                    "Remove wet clothing.",
                    "Warm the person with blankets or body heat.",
                    "Give warm drinks if conscious.",
                    "Call emergency services."
                ],
                "do_not": [
                    "Do not use hot water or direct heat.",
                    "Do not massage or rub the person."
                ],
                "confidence": 0.91,
                "recommendations": [
                    "Warm the person gradually",
                    "Call for help",
                    "Do not use direct heat"
                ],
                "translations": {
                    "sw": {
                        "title": "❄️ HUDUMA YA KWANZA YA HYPOTHERMIA",
                        "steps": [
                            "Mhamishe mtu mahali penye joto na pakavu.",
                            "Mvue nguo zilizo na unyevu.",
                            "Mfunike kwa blanketi au tumia joto la mwili.",
                            "Mpe vinywaji vyeupe kama yuko fahamu.",
                            "Piga simu ya dharura."
                        ],
                        "do_not": [
                            "Usitumie maji ya moto au joto kali moja kwa moja.",
                            "Usimkande au kumpa masaji."
                        ],
                        "recommendations": [
                            "Mpoze taratibu",
                            "Tafuta msaada",
                            "Usitumie joto kali moja kwa moja"
                        ]
                    }
                }
            },
            "heat exhaustion": {
                "title": "🥵 HEAT EXHAUSTION FIRST AID",
                "steps": [
                    "Move the person to a cool place.",
                    "Loosen clothing.",
                    "Give cool fluids to drink.",
                    "Apply cool, wet cloths to skin.",
                    "Call emergency services if symptoms worsen."
                ],
                "confidence": 0.91,
                "recommendations": [
                    "Cool the person",
                    "Give fluids",
                    "Seek help if not improving"
                ],
                "translations": {
                    "sw": {
                        "title": "🥵 HUDUMA YA KWANZA YA KUCHOKA KWA JOTO",
                        "steps": [
                            "Mhamishe mtu mahali penye baridi.",
                            "Mvue nguo zilizobana.",
                            "Mpe vinywaji baridi.",
                            "Weka nguo au kitambaa kilicholowa kwenye ngozi.",
                            "Piga simu ya dharura kama hali inazidi kuwa mbaya."
                        ],
                        "recommendations": [
                            "Mpoze mtu",
                            "Mpe vinywaji",
                            "Tafuta msaada kama hali haiboreki"
                        ]
                    }
                }
            },
            "eye injury": {
                "title": "👁️ EYE INJURY FIRST AID",
                "steps": [
                    "Do not rub the eye.",
                    "Rinse with clean water if chemicals are involved.",
                    "Cover the eye with a clean cloth.",
                    "Seek medical attention immediately."
                ],
                "do_not": [
                    "Do not try to remove objects stuck in the eye."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Rinse if chemical exposure",
                    "Cover the eye",
                    "Seek medical help"
                ],
                "translations": {
                    "sw": {
                        "title": "👁️ HUDUMA YA KWANZA YA JERAHA LA JICHO",
                        "steps": [
                            "Usisugue jicho.",
                            "Osha kwa maji safi kama kuna kemikali.",
                            "Funika jicho kwa kitambaa safi.",
                            "Tafuta msaada wa daktari mara moja."
                        ],
                        "do_not": [
                            "Usijaribu kutoa kitu kilichokwama kwenye jicho."
                        ],
                        "recommendations": [
                            "Osha kama kuna kemikali",
                            "Funika jicho",
                            "Tafuta msaada wa daktari"
                        ]
                    }
                }
            },
            "fainting": {
                "title": "😵 FAINTING FIRST AID",
                "steps": [
                    "Lay the person flat on their back.",
                    "Elevate legs if possible.",
                    "Loosen tight clothing.",
                    "Check for breathing.",
                    "If unresponsive, call emergency services."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Lay flat and elevate legs",
                    "Loosen clothing",
                    "Call for help if not responsive"
                ],
                "translations": {
                    "sw": {
                        "title": "😵 HUDUMA YA KWANZA YA KUPOTEA FAHAMU",
                        "steps": [
                            "Mlaze mtu chali.",
                            "Inua miguu kama inawezekana.",
                            "Lainisha nguo zilizobana.",
                            "Angalia kama anapumua.",
                            "Kama hajitambui, piga simu ya dharura."
                        ],
                        "recommendations": [
                            "Mlaze chali na inua miguu",
                            "Lainisha nguo",
                            "Tafuta msaada kama hajitambui"
                        ]
                    }
                }
            },
            "animal bite": {
                "title": "🐕 ANIMAL BITE FIRST AID",
                "steps": [
                    "Wash the wound with soap and water.",
                    "Apply a clean bandage.",
                    "Seek medical attention, especially for deep bites.",
                    "Report the bite if the animal is wild or unknown."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Clean the wound",
                    "Bandage and seek help",
                    "Report wild animal bites"
                ],
                "translations": {
                    "sw": {
                        "title": "🐕 HUDUMA YA KWANZA YA KUUMWA NA MNYAMA",
                        "steps": [
                            "Osha jeraha kwa sabuni na maji.",
                            "Funga kwa bandeji safi.",
                            "Tafuta msaada wa daktari hasa kama jeraha ni kubwa.",
                            "Ripoti kama mnyama ni wa porini au hajulikani."
                        ],
                        "recommendations": [
                            "Osha jeraha",
                            "Funga na bandeji, tafuta msaada",
                            "Ripoti kama ni mnyama wa porini"
                        ]
                    }
                }
            },
            "burn (chemical)": {
                "title": "🧪 CHEMICAL BURN FIRST AID",
                "steps": [
                    "Remove contaminated clothing.",
                    "Rinse the affected area with running water for at least 20 minutes.",
                    "Do not apply creams or ointments.",
                    "Seek medical attention."
                ],
                "do_not": [
                    "Do not apply creams or ointments."
                ],
                "confidence": 0.91,
                "recommendations": [
                    "Rinse with water",
                    "Remove contaminated clothing",
                    "Seek medical help"
                ],
                "translations": {
                    "sw": {
                        "title": "🧪 HUDUMA YA KWANZA YA KUUNGUA NA KEMIKALI",
                        "steps": [
                            "Vua nguo zilizoathirika.",
                            "Osha sehemu iliyoathirika na maji yanayotiririka kwa angalau dakika 20.",
                            "Usitumie krimu au marhamu.",
                            "Tafuta msaada wa daktari."
                        ],
                        "do_not": [
                            "Usitumie krimu au marhamu."
                        ],
                        "recommendations": [
                            "Osha na maji",
                            "Vua nguo zilizoathirika",
                            "Tafuta msaada wa daktari"
                        ]
                    }
                }
            },
            "tooth knocked out": {
                "title": "🦷 TOOTH KNOCKED OUT FIRST AID",
                "steps": [
                    "Pick up the tooth by the crown (not the root).",
                    "Rinse gently with water if dirty.",
                    "Try to place the tooth back in the socket, or keep it in milk.",
                    "See a dentist immediately."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Handle tooth by crown",
                    "Keep moist or reinsert",
                    "See dentist quickly"
                ],
                "translations": {
                    "sw": {
                        "title": "🦷 HUDUMA YA KWANZA YA KUTOKA JINO",
                        "steps": [
                            "Shika jino kwenye kichwa chake (sio mzizi).",
                            "Osha kwa maji kama limechafuka.",
                            "Jaribu kurudisha jino kwenye tundu lake, au liweke kwenye maziwa.",
                            "Muone daktari wa meno haraka."
                        ],
                        "recommendations": [
                            "Shika jino kwenye kichwa",
                            "Liweke kwenye maziwa au lirudishe",
                            "Muone daktari wa meno haraka"
                        ]
                    }
                }
            },
            "bullet wound": {
                "title": "🔫 BULLET WOUND FIRST AID",
                "steps": [
                    "Call emergency services immediately.",
                    "Ensure your safety before approaching.",
                    "Apply firm pressure to stop bleeding.",
                    "Do not remove the bullet or any embedded object.",
                    "Keep the person still and calm."
                ],
                "do_not": [
                    "Do not remove the bullet.",
                    "Do not give food or drink."
                ],
                "confidence": 0.95,
                "recommendations": [
                    "Call emergency help",
                    "Apply pressure to wound",
                    "Keep person calm"
                ],
                "translations": {
                    "sw": {
                        "title": "🔫 HUDUMA YA KWANZA YA JERAHA LA RISASI",
                        "steps": [
                            "Piga simu ya dharura mara moja.",
                            "Hakikisha usalama wako kabla ya kusaidia.",
                            "Shinikiza jeraha kuzuia damu.",
                            "Usiondoe risasi au kitu chochote kilichokwama.",
                            "Mtu akae kimya na tulivu."
                        ],
                        "do_not": [
                            "Usiondoe risasi.",
                            "Usimpe chakula au kinywaji."
                        ],
                        "recommendations": [
                            "Piga simu ya dharura",
                            "Shinikiza jeraha",
                            "Mtu akae kimya"
                        ]
                    }
                }
            },
            "fire injury": {
                "title": "🔥 FIRE INJURY FIRST AID",
                "steps": [
                    "Move the person away from the fire source.",
                    "Stop, drop, and roll if clothing is on fire.",
                    "Cool burns with running water for 10–20 minutes.",
                    "Cover burns with a clean, non-stick cloth.",
                    "Call emergency services."
                ],
                "do_not": [
                    "Do not use ice or creams.",
                    "Do not break blisters."
                ],
                "confidence": 0.93,
                "recommendations": [
                    "Move away from fire",
                    "Cool burns",
                    "Call for help"
                ],
                "translations": {
                    "sw": {
                        "title": "🔥 HUDUMA YA KWANZA YA KUJERUHIWA NA MOTO",
                        "steps": [
                            "Mhamishe mtu mbali na moto.",
                            "Simama, jilaze chini, na jizungushe kama nguo zinawaka.",
                            "Pooza majeraha kwa maji yanayotiririka kwa dakika 10–20.",
                            "Funika majeraha kwa kitambaa kisichoshika.",
                            "Piga simu ya dharura."
                        ],
                        "do_not": [
                            "Usitumie barafu au krimu.",
                            "Usipasue malengelenge."
                        ],
                        "recommendations": [
                            "Mhamishe mbali na moto",
                            "Pooza majeraha",
                            "Piga simu ya dharura"
                        ]
                    }
                }
            },
            "chemical exposure": {
                "title": "🧪 CHEMICAL EXPOSURE FIRST AID",
                "steps": [
                    "Remove contaminated clothing.",
                    "Rinse affected area with running water for at least 20 minutes.",
                    "Avoid contact with chemical.",
                    "Call emergency services."
                ],
                "do_not": [
                    "Do not apply creams or ointments."
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Rinse with water",
                    "Remove contaminated clothing",
                    "Call for help"
                ],
                "translations": {
                    "sw": {
                        "title": "🧪 HUDUMA YA KWANZA YA KUATHIRIKA NA KEMIKALI",
                        "steps": [
                            "Vua nguo zilizoathirika.",
                            "Osha sehemu iliyoathirika na maji yanayotiririka kwa angalau dakika 20.",
                            "Epuka kugusa kemikali.",
                            "Piga simu ya dharura."
                        ],
                        "do_not": [
                            "Usitumie krimu au marhamu."
                        ],
                        "recommendations": [
                            "Osha na maji",
                            "Vua nguo zilizoathirika",
                            "Piga simu ya dharura"
                        ]
                    }
                }
            },
            "allergic reaction": {
                "title": "🤧 ALLERGIC REACTION FIRST AID",
                "steps": [
                    "Remove allergen if possible.",
                    "Give antihistamine if available.",
                    "Monitor for signs of anaphylaxis.",
                    "Call emergency services if symptoms worsen."
                ],
                "do_not": [
                    "Do not give food or drink if swelling is present."
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Remove allergen",
                    "Give antihistamine",
                    "Call for help if severe"
                ],
                "translations": {
                    "sw": {
                        "title": "🤧 HUDUMA YA KWANZA YA MCHAFUKO WA ALLERGY",
                        "steps": [
                            "Ondoa kitu kinachosababisha allergy kama inawezekana.",
                            "Mpe dawa ya allergy kama ipo.",
                            "Angalia dalili za anaphylaxis.",
                            "Piga simu ya dharura kama hali inazidi kuwa mbaya."
                        ],
                        "do_not": [
                            "Usimpe chakula au kinywaji kama kuna uvimbe."
                        ],
                        "recommendations": [
                            "Ondoa kisababishi",
                            "Mpe dawa ya allergy",
                            "Piga simu ya dharura kama ni kali"
                        ]
                    }
                }
            },
            "head injury": {
                "title": "🧑‍🦲 HEAD INJURY FIRST AID",
                "steps": [
                    "Keep the person still and calm.",
                    "Apply a cold pack to reduce swelling.",
                    "Monitor for loss of consciousness or confusion.",
                    "Call emergency services if symptoms worsen."
                ],
                "do_not": [
                    "Do not move the person unless necessary."
                ],
                "confidence": 0.91,
                "recommendations": [
                    "Keep person still",
                    "Apply cold pack",
                    "Call for help if severe"
                ],
                "translations": {
                    "sw": {
                        "title": "🧑‍🦲 HUDUMA YA KWANZA YA JERAHA LA KICHWA",
                        "steps": [
                            "Mtu akae kimya na tulivu.",
                            "Weka barafu kupunguza uvimbe.",
                            "Angalia kama anapoteza fahamu au kuchanganyikiwa.",
                            "Piga simu ya dharura kama hali inazidi kuwa mbaya."
                        ],
                        "do_not": [
                            "Usimsogeze mtu isipokuwa ni lazima."
                        ],
                        "recommendations": [
                            "Mtu akae kimya",
                            "Weka barafu",
                            "Piga simu ya dharura kama ni kali"
                        ]
                    }
                }
            },
            "spinal injury": {
                "title": "🦴 SPINAL INJURY FIRST AID",
                "steps": [
                    "Do not move the person unless absolutely necessary.",
                    "Call emergency services immediately.",
                    "Stabilize the head and neck.",
                    "Monitor breathing and consciousness."
                ],
                "do_not": [
                    "Do not move or twist the spine."
                ],
                "confidence": 0.95,
                "recommendations": [
                    "Do not move the person",
                    "Call for help",
                    "Stabilize head and neck"
                ],
                "translations": {
                    "sw": {
                        "title": "🦴 HUDUMA YA KWANZA YA JERAHA LA MGONGO",
                        "steps": [
                            "Usimsogeze mtu isipokuwa ni lazima sana.",
                            "Piga simu ya dharura mara moja.",
                            "Shikilia kichwa na shingo visisonge.",
                            "Angalia kupumua na fahamu."
                        ],
                        "do_not": [
                            "Usisogeze au kuzungusha mgongo."
                        ],
                        "recommendations": [
                            "Usimsogeze mtu",
                            "Piga simu ya dharura",
                            "Shikilia kichwa na shingo"
                        ]
                    }
                }
            },
            "amputation": {
                "title": "🦵 AMPUTATION FIRST AID",
                "steps": [
                    "Call emergency services immediately.",
                    "Apply firm pressure to stop bleeding.",
                    "Wrap the amputated part in a clean cloth, place in a plastic bag, and keep cool.",
                    "Do not place directly on ice."
                ],
                "do_not": [
                    "Do not wash the amputated part with water."
                ],
                "confidence": 0.96,
                "recommendations": [
                    "Call for help",
                    "Stop bleeding",
                    "Preserve amputated part"
                ],
                "translations": {
                    "sw": {
                        "title": "🦵 HUDUMA YA KWANZA YA KUKATIKA KIUNGO",
                        "steps": [
                            "Piga simu ya dharura mara moja.",
                            "Shinikiza kuzuia damu.",
                            "Funga kiungo kilichokatika kwa kitambaa safi, kiweke kwenye mfuko wa plastiki, na kiweke sehemu baridi.",
                            "Usikiweke moja kwa moja kwenye barafu."
                        ],
                        "do_not": [
                            "Usioshe kiungo kilichokatika kwa maji."
                        ],
                        "recommendations": [
                            "Piga simu ya dharura",
                            "Zuia damu",
                            "Hifadhi kiungo kilichokatika"
                        ]
                    }
                }
            },
            "crush injury": {
                "title": "🦶 CRUSH INJURY FIRST AID",
                "steps": [
                    "Call emergency services immediately.",
                    "Remove crushing object if safe and possible.",
                    "Control bleeding with firm pressure.",
                    "Monitor for shock."
                ],
                "do_not": [
                    "Do not remove object if person is trapped for more than 15 minutes."
                ],
                "confidence": 0.93,
                "recommendations": [
                    "Call for help",
                    "Control bleeding",
                    "Monitor for shock"
                ],
                "translations": {
                    "sw": {
                        "title": "🦶 HUDUMA YA KWANZA YA KUBANWA",
                        "steps": [
                            "Piga simu ya dharura mara moja.",
                            "Ondoa kitu kinachobana kama ni salama.",
                            "Zuia damu kwa shinikizo.",
                            "Angalia dalili za mshtuko."
                        ],
                        "do_not": [
                            "Usiondoe kitu kama mtu amebanwa zaidi ya dakika 15."
                        ],
                        "recommendations": [
                            "Piga simu ya dharura",
                            "Zuia damu",
                            "Angalia mshtuko"
                        ]
                    }
                }
            },
            "eye chemical burn": {
                "title": "👁️ CHEMICAL BURN TO EYE FIRST AID",
                "steps": [
                    "Rinse the eye with clean running water for at least 15 minutes.",
                    "Remove contact lenses if present.",
                    "Do not rub the eye.",
                    "Seek medical attention immediately."
                ],
                "do_not": [
                    "Do not rub the eye."
                ],
                "confidence": 0.94,
                "recommendations": [
                    "Rinse eye with water",
                    "Remove contacts",
                    "Seek medical help"
                ],
                "translations": {
                    "sw": {
                        "title": "👁️ HUDUMA YA KWANZA YA KUUNGUA JICHO NA KEMIKALI",
                        "steps": [
                            "Osha jicho kwa maji safi yanayotiririka kwa angalau dakika 15.",
                            "Ondoa lensi za macho kama zipo.",
                            "Usisugue jicho.",
                            "Tafuta msaada wa daktari mara moja."
                        ],
                        "do_not": [
                            "Usisugue jicho."
                        ],
                        "recommendations": [
                            "Osha jicho na maji",
                            "Ondoa lensi",
                            "Tafuta msaada wa daktari"
                        ]
                    }
                }
            },
            "frostbite": {
                "title": "🧊 FROSTBITE FIRST AID",
                "steps": [
                    "Move the person to a warm place.",
                    "Remove wet clothing.",
                    "Warm the affected area with body heat or warm water (not hot).",
                    "Do not rub or massage the area.",
                    "Seek medical attention."
                ],
                "do_not": [
                    "Do not use direct heat or rub the area."
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Warm gradually",
                    "Do not rub area",
                    "Seek medical help"
                ],
                "translations": {
                    "sw": {
                        "title": "🧊 HUDUMA YA KWANZA YA KUFURA KWA BARIDI (FROSTBITE)",
                        "steps": [
                            "Mhamishe mtu mahali penye joto.",
                            "Mvue nguo zenye unyevu.",
                            "Pasha sehemu iliyoathirika kwa joto la mwili au maji ya uvuguvugu (sio ya moto).",
                            "Usikande au kusugua sehemu hiyo.",
                            "Tafuta msaada wa daktari."
                        ],
                        "do_not": [
                            "Usitumie joto kali au kusugua sehemu hiyo."
                        ],
                        "recommendations": [
                            "Pasha taratibu",
                            "Usisugue sehemu hiyo",
                            "Tafuta msaada wa daktari"
                        ]
                    }
                }
            },
            "hyperventilation": {
                "title": "😮‍💨 HYPERVENTILATION FIRST AID",
                "steps": [
                    "Encourage slow, deep breaths.",
                    "Have the person breathe into a paper bag (if not asthmatic).",
                    "Reassure and calm the person.",
                    "Seek medical help if symptoms persist."
                ],
                "do_not": [
                    "Do not use a paper bag if the person has heart or lung problems."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Encourage slow breathing",
                    "Calm the person",
                    "Seek help if needed"
                ],
                "translations": {
                    "sw": {
                        "title": "😮‍💨 HUDUMA YA KWANZA YA KUPUMUA KWA HARAKA (HYPERVENTILATION)",
                        "steps": [
                            "Mwelekeze apumue polepole na kwa kina.",
                            "Aweze kupumua kwenye mfuko wa karatasi (kama hana pumu).",
                            "Mtulize na mpe faraja.",
                            "Tafuta msaada wa daktari kama hali haiboreki."
                        ],
                        "do_not": [
                            "Usitumie mfuko wa karatasi kama ana matatizo ya moyo au mapafu."
                        ],
                        "recommendations": [
                            "Himiza upumuaji wa polepole",
                            "Mtulize",
                            "Tafuta msaada kama inahitajika"
                        ]
                    }
                }
            },
            "heat cramps": {
                "title": "💪 HEAT CRAMPS FIRST AID",
                "steps": [
                    "Move the person to a cool place.",
                    "Give water or electrolyte drink.",
                    "Stretch and massage cramped muscles.",
                    "Rest before resuming activity."
                ],
                "do_not": [
                    "Do not resume strenuous activity immediately."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Cool down",
                    "Hydrate",
                    "Rest and stretch"
                ],
                "translations": {
                    "sw": {
                        "title": "💪 HUDUMA YA KWANZA YA MIKAZO YA MISULI KWA JOTO",
                        "steps": [
                            "Mhamishe mtu mahali penye baridi.",
                            "Mpe maji au kinywaji chenye chumvi.",
                            "Nyoosha na kanda misuli iliyokaza.",
                            "Pumzika kabla ya kuendelea na shughuli."
                        ],
                        "do_not": [
                            "Usiendelee na shughuli nzito mara moja."
                        ],
                        "recommendations": [
                            "Pooza mwili",
                            "Mpe maji",
                            "Pumzika na nyoosha misuli"
                        ]
                    }
                }
            },
            "bee sting": {
                "title": "🐝 BEE STING FIRST AID",
                "steps": [
                    "Remove the stinger by scraping (not squeezing).",
                    "Wash the area with soap and water.",
                    "Apply a cold pack to reduce swelling.",
                    "Monitor for allergic reaction."
                ],
                "do_not": [
                    "Do not squeeze the stinger."
                ],
                "confidence": 0.91,
                "recommendations": [
                    "Remove stinger",
                    "Apply cold pack",
                    "Watch for allergy"
                ],
                "translations": {
                    "sw": {
                        "title": "🐝 HUDUMA YA KWANZA YA KUUMWA NA NYUKI",
                        "steps": [
                            "Ondoa kichomi kwa kukwangua (usikikande).",
                            "Osha eneo hilo kwa sabuni na maji.",
                            "Weka barafu kupunguza uvimbe.",
                            "Angalia dalili za allergy."
                        ],
                        "do_not": [
                            "Usikikande kichomi."
                        ],
                        "recommendations": [
                            "Ondoa kichomi",
                            "Weka barafu",
                            "Angalia allergy"
                        ]
                    }
                }
            },
            "dog bite": {
                "title": "🐶 DOG BITE FIRST AID",
                "steps": [
                    "Wash the wound with soap and water for at least 5 minutes.",
                    "Apply a clean bandage.",
                    "Seek medical attention, especially if the dog is unknown.",
                    "Report the bite to authorities."
                ],
                "do_not": [
                    "Do not ignore deep or bleeding wounds."
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Clean wound",
                    "Bandage",
                    "Seek medical help"
                ],
                "translations": {
                    "sw": {
                        "title": "🐶 HUDUMA YA KWANZA YA KUUMWA NA MBWA",
                        "steps": [
                            "Osha jeraha kwa sabuni na maji kwa angalau dakika 5.",
                            "Funga kwa bandeji safi.",
                            "Tafuta msaada wa daktari hasa kama mbwa hajulikani.",
                            "Ripoti tukio kwa mamlaka."
                        ],
                        "do_not": [
                            "Usipuuze majeraha makubwa au yanayotoka damu."
                        ],
                        "recommendations": [
                            "Osha jeraha",
                            "Funga bandeji",
                            "Tafuta msaada wa daktari"
                        ]
                    }
                }
            },
            "childbirth emergency": {
                "title": "🤰 CHILDBIRTH EMERGENCY FIRST AID",
                "steps": [
                    "Call emergency services immediately.",
                    "Help the mother lie down comfortably.",
                    "Support the baby's head as it emerges.",
                    "Do not pull the baby out.",
                    "Keep the baby warm after delivery."
                ],
                "do_not": [
                    "Do not pull on the baby."
                ],
                "confidence": 0.95,
                "recommendations": [
                    "Call for help",
                    "Support mother and baby",
                    "Keep baby warm"
                ],
                "translations": {
                    "sw": {
                        "title": "🤰 HUDUMA YA KWANZA YA KUJIFUNGUA DHARURA",
                        "steps": [
                            "Piga simu ya dharura mara moja.",
                            "Msaidie mama alale kwa utulivu.",
                            "Shikilia kichwa cha mtoto kinapotoka.",
                            "Usimvute mtoto.",
                            "Mfanye mtoto awe na joto baada ya kuzaliwa."
                        ],
                        "do_not": [
                            "Usimvute mtoto."
                        ],
                        "recommendations": [
                            "Piga simu ya dharura",
                            "Msaidie mama na mtoto",
                            "Mfanye mtoto awe na joto"
                        ]
                    }
                }
            },
            "carbon monoxide poisoning": {
                "title": "🛑 CARBON MONOXIDE POISONING FIRST AID",
                "steps": [
                    "Move the person to fresh air immediately.",
                    "Call emergency services.",
                    "Loosen tight clothing.",
                    "Monitor breathing and consciousness."
                ],
                "do_not": [
                    "Do not return to the contaminated area."
                ],
                "confidence": 0.94,
                "recommendations": [
                    "Move to fresh air",
                    "Call for help",
                    "Monitor breathing"
                ],
                "translations": {
                    "sw": {
                        "title": "🛑 HUDUMA YA KWANZA YA SUMU YA MONOKSAIDI YA KABONI",
                        "steps": [
                            "Mhamishe mtu mahali penye hewa safi mara moja.",
                            "Piga simu ya dharura.",
                            "Lainisha nguo zilizobana.",
                            "Angalia kupumua na fahamu."
                        ],
                        "do_not": [
                            "Usirudi kwenye eneo lenye sumu."
                        ],
                        "recommendations": [
                            "Mpeleke kwenye hewa safi",
                            "Piga simu ya dharura",
                            "Angalia kupumua"
                        ]
                    }
                }
            },
            "ear bleeding": {
                "title": "👂 EAR BLEEDING FIRST AID",
                "steps": [
                    "Sit the person upright and tilt head to allow drainage.",
                    "Do not plug the ear.",
                    "Apply gentle pressure around the ear if bleeding is external.",
                    "Seek medical attention immediately."
                ],
                "do_not": [
                    "Do not insert anything into the ear canal."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Keep head tilted",
                    "Do not block ear",
                    "Seek medical help"
                ],
                "translations": {
                    "sw": {
                        "title": "👂 HUDUMA YA KWANZA YA KUTOKA DAMU MASIKIONI",
                        "steps": [
                            "Mkalie mtu wima na ainue kichwa ili damu itoke.",
                            "Usizibe sikio.",
                            "Shinikiza kwa upole karibu na sikio kama damu inatoka nje.",
                            "Tafuta msaada wa daktari mara moja."
                        ],
                        "do_not": [
                            "Usiweke kitu chochote ndani ya sikio."
                        ],
                        "recommendations": [
                            "Ainue kichwa",
                            "Usizibe sikio",
                            "Tafuta msaada wa daktari"
                        ]
                    }
                }
            },
            "vomiting blood": {
                "title": "🤮 VOMITING BLOOD FIRST AID",
                "steps": [
                    "Keep the person calm and sitting up.",
                    "Do not give food or drink.",
                    "Collect sample if possible for medical staff.",
                    "Call emergency services immediately."
                ],
                "do_not": [
                    "Do not give anything by mouth."
                ],
                "confidence": 0.95,
                "recommendations": [
                    "Keep upright",
                    "Do not give food/drink",
                    "Call for help"
                ],
                "translations": {
                    "sw": {
                        "title": "🤮 HUDUMA YA KWANZA YA KUTAPIKA DAMU",
                        "steps": [
                            "Mtu akae kimya na akae wima.",
                            "Usimpe chakula wala kinywaji.",
                            "Kusanya sampuli kama inawezekana kwa daktari.",
                            "Piga simu ya dharura mara moja."
                        ],
                        "do_not": [
                            "Usimpe kitu chochote mdomoni."
                        ],
                        "recommendations": [
                            "Akae wima",
                            "Usimpe chakula/kinywaji",
                            "Piga simu ya dharura"
                        ]
                    }
                }
            },
            "diarrhea": {
                "title": "🚽 DIARRHEA FIRST AID",
                "steps": [
                    "Give plenty of clear fluids (oral rehydration solution if available).",
                    "Encourage rest.",
                    "Monitor for signs of dehydration.",
                    "Seek medical help if blood is present or symptoms persist."
                ],
                "do_not": [
                    "Do not give dairy or fatty foods."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Hydrate",
                    "Rest",
                    "Seek help if severe"
                ],
                "translations": {
                    "sw": {
                        "title": "🚽 HUDUMA YA KWANZA YA KUHARISHA",
                        "steps": [
                            "Mpe vinywaji vingi (maji au ORS kama ipo).",
                            "Mhimize apumzike.",
                            "Angalia dalili za upungufu wa maji mwilini.",
                            "Tafuta msaada wa daktari kama kuna damu au hali haiboreki."
                        ],
                        "do_not": [
                            "Usimpe vyakula vya maziwa au mafuta."
                        ],
                        "recommendations": [
                            "Mpe maji",
                            "Pumzika",
                            "Tafuta msaada kama ni kali"
                        ]
                    }
                }
            },
            "panic attack": {
                "title": "😱 PANIC ATTACK FIRST AID",
                "steps": [
                    "Stay calm and speak reassuringly.",
                    "Encourage slow, deep breathing.",
                    "Move to a quiet place if possible.",
                    "Stay with the person until symptoms pass."
                ],
                "do_not": [
                    "Do not leave the person alone."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Stay calm",
                    "Encourage slow breathing",
                    "Stay with person"
                ],
                "translations": {
                    "sw": {
                        "title": "😱 HUDUMA YA KWANZA YA MSHTUKO WA HOFU",
                        "steps": [
                            "Tulia na ongea kwa upole.",
                            "Mwelekeze apumue polepole na kwa kina.",
                            "Mpeleke mahali tulivu kama inawezekana.",
                            "Kaa naye hadi hali itulie."
                        ],
                        "do_not": [
                            "Usimuache peke yake."
                        ],
                        "recommendations": [
                            "Tulia",
                            "Himiza upumuaji wa polepole",
                            "Kaa naye"
                        ]
                    }
                }
            },
            "broken tooth": {
                "title": "🦷 BROKEN TOOTH FIRST AID",
                "steps": [
                    "Rinse mouth with warm water.",
                    "Apply cold compress to reduce swelling.",
                    "Save any broken pieces.",
                    "See a dentist as soon as possible."
                ],
                "do_not": [
                    "Do not use aspirin directly on gums."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Rinse mouth",
                    "Apply cold compress",
                    "See dentist"
                ],
                "translations": {
                    "sw": {
                        "title": "🦷 HUDUMA YA KWANZA YA JINO KUVUNJIKA",
                        "steps": [
                            "Osha mdomo kwa maji ya uvuguvugu.",
                            "Weka barafu kupunguza uvimbe.",
                            "Hifadhi vipande vilivyovunjika.",
                            "Muone daktari wa meno haraka."
                        ],
                        "do_not": [
                            "Usitumie aspirin moja kwa moja kwenye fizi."
                        ],
                        "recommendations": [
                            "Osha mdomo",
                            "Weka barafu",
                            "Muone daktari wa meno"
                        ]
                    }
                }
            },
            "object in nose": {
                "title": "👃 OBJECT IN NOSE FIRST AID",
                "steps": [
                    "Do not try to remove with sharp objects.",
                    "Encourage gentle blowing through the nose.",
                    "Seek medical help if object does not come out."
                ],
                "do_not": [
                    "Do not use tweezers or sharp tools."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Do not use sharp tools",
                    "Try gentle blowing",
                    "Seek help if needed"
                ],
                "translations": {
                    "sw": {
                        "title": "👃 HUDUMA YA KWANZA YA KITU KWENYE PUANI",
                        "steps": [
                            "Usijaribu kutoa kwa kitu chenye ncha kali.",
                            "Mwelekeze apulize puani kwa upole.",
                            "Tafuta msaada wa daktari kama hakitoki."
                        ],
                        "do_not": [
                            "Usitumie koleo au chombo chenye ncha kali."
                        ],
                        "recommendations": [
                            "Usitumie chombo chenye ncha kali",
                            "Jaribu kupuliza kwa upole",
                            "Tafuta msaada"
                        ]
                    }
                }
            },
            "object in ear": {
                "title": "👂 OBJECT IN EAR FIRST AID",
                "steps": [
                    "Do not insert anything into the ear.",
                    "Tilt head to try to let object fall out.",
                    "Seek medical help if object remains."
                ],
                "do_not": [
                    "Do not use cotton swabs or tweezers."
                ],
                "confidence": 0.9,
                "recommendations": [
                    "Do not insert objects",
                    "Try tilting head",
                    "Seek help if needed"
                ],
                "translations": {
                    "sw": {
                        "title": "👂 HUDUMA YA KWANZA YA KITU KWENYE SIKIO",
                        "steps": [
                            "Usiweke kitu chochote ndani ya sikio.",
                            "Inamisha kichwa ili kitu kitoke.",
                            "Tafuta msaada wa daktari kama hakitoki."
                        ],
                        "do_not": [
                            "Usitumie pamba au koleo."
                        ],
                        "recommendations": [
                            "Usiweke kitu sikioni",
                            "Inamisha kichwa",
                            "Tafuta msaada"
                        ]
                    }
                }
            },
            "jaw dislocation": {
                "title": "🦷 JAW DISLOCATION FIRST AID",
                "steps": [
                    "Support the jaw with a bandage or cloth.",
                    "Apply cold pack to reduce swelling.",
                    "Do not try to move the jaw back.",
                    "Seek medical attention immediately."
                ],
                "do_not": [
                    "Do not attempt to relocate the jaw."
                ],
                "confidence": 0.92,
                "recommendations": [
                    "Support jaw",
                    "Apply cold pack",
                    "Seek medical help"
                ],
                "translations": {
                    "sw": {
                        "title": "🦷 HUDUMA YA KWANZA YA TAYA KUTOKA MAHALI PAKE",
                        "steps": [
                            "Shikilia taya kwa bandeji au kitambaa.",
                            "Weka barafu kupunguza uvimbe.",
                            "Usijaribu kurudisha taya mahali pake.",
                            "Tafuta msaada wa daktari mara moja."
                        ],
                        "do_not": [
                            "Usijaribu kurudisha taya mwenyewe."
                        ],
                        "recommendations": [
                            "Shikilia taya",
                            "Weka barafu",
                            "Tafuta msaada wa daktari"
                        ]
                    }
                }
            },
            "finger amputation": {
                "title": "☝️ FINGER AMPUTATION FIRST AID",
                "steps": [
                    "Apply pressure to stop bleeding.",
                    "Wrap the finger in a clean cloth, place in a plastic bag, and keep cool.",
                    "Do not place directly on ice.",
                    "Seek emergency medical attention."
                ],
                "do_not": [
                    "Do not wash the finger with water."
                ],
                "confidence": 0.95,
                "recommendations": [
                    "Stop bleeding",
                    "Preserve finger",
                    "Seek emergency help"
                ],
                "translations": {
                    "sw": {
                        "title": "☝️ HUDUMA YA KWANZA YA KUKATIKA KIDOLE",
                        "steps": [
                            "Shinikiza kuzuia damu.",
                            "Funga kidole kwa kitambaa safi, kiweke kwenye mfuko wa plastiki, na kiweke sehemu baridi.",
                            "Usikiweke moja kwa moja kwenye barafu.",
                            "Tafuta msaada wa dharura."
                        ],
                        "do_not": [
                            "Usioshe kidole kwa maji."
                        ],
                        "recommendations": [
                            "Zuia damu",
                            "Hifadhi kidole",
                            "Tafuta msaada wa dharura"
                        ]
                    }
                }
            },
            "scald (hot liquid burn)": {
                "title": "🥣 SCALD (HOT LIQUID BURN) FIRST AID",
                "steps": [
                    "Remove wet clothing immediately.",
                    "Cool the burn with running water for 10–20 minutes.",
                    "Cover with a clean, non-stick cloth.",
                    "Seek medical help if severe."
                ],
                "do_not": [
                    "Do not use ice or creams."
                ],
                "confidence": 0.91,
                "recommendations": [
                    "Remove wet clothes",
                    "Cool with water",
                    "Seek help if severe"
                ],
                "translations": {
                    "sw": {
                        "title": "🥣 HUDUMA YA KWANZA YA KUUNGUA NA MAJI YA MOTO",
                        "steps": [
                            "Vua nguo zenye unyevu mara moja.",
                            "Pooza kwa maji yanayotiririka kwa dakika 10–20.",
                            "Funika kwa kitambaa kisichoshika.",
                            "Tafuta msaada wa daktari kama ni kali."
                        ],
                        "do_not": [
                            "Usitumie barafu au krimu."
                        ],
                        "recommendations": [
                            "Vua nguo zenye unyevu",
                            "Pooza kwa maji",
                            "Tafuta msaada"
                        ]
                    }
                }
            },
        }
        matched = situation.lower().strip()
        
        if matched not in steps_dict:
            detected = detect_condition_from_input(matched)
            if detected:
                matched = detected

        if matched and matched in steps_dict:
            entry = steps_dict[matched]
            if target_language != "en" and "translations" in entry and target_language in entry["translations"]:
                translated = entry["translations"][target_language]
                translated["confidence"] = entry.get("confidence", 0.9)
                return translated
            else:
                return entry
        else:
            return {
                "content": "No hardcoded steps available for this situation.",
                "confidence": 0.0,
                "recommendations": []
            }

    def run_translation(self, text, target_language):
    
        matched = situation.lower().strip()
        
        if matched not in steps_dict:
            detected = detect_condition_from_input(matched)
            if detected:
                matched = detected

        if matched and matched in steps_dict:
            entry = steps_dict[matched]
            if target_language != "en" and "translations" in entry and target_language in entry["translations"]:
                translated = entry["translations"][target_language]
                translated["confidence"] = entry.get("confidence", 0.9)
                return translated
            else:
                return entry
        else:
            return {
                "content": "No hardcoded steps available for this situation.",
                "confidence": 0.0,
                "recommendations": []
            }

    def run_translation(self, text, target_language):
        # Placeholder: implement actual translation logic if needed
        return {
            "original": text,
            "translated": text,
            "target_language": target_language
        }

    def run_find_clinic(self, location):
        # Placeholder: implement actual clinic finding logic if needed
        return {
            "clinics": [],
            "location": location
        }

    def run_image_analysis(self, image_path):
        # Placeholder: implement actual image analysis logic if needed
        return {
            "image_path": image_path,
            "analysis": "Not implemented"
        }

    def run_real_time_analysis(self, video_stream):
        # Placeholder: implement actual real-time analysis logic if needed
        return {
            "video_stream": video_stream,
            "analysis": "Not implemented"
        }

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
