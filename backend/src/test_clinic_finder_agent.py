
from crew import Afyabuddy

app = Afyabuddy()

test_inputs = {
    "latitude": -1.101,
    "longitude": 37.014,
    "location": "Juja, Kenya",
    "radius_m": 5000,
}

try:
    # Get the configured clinic-finder agent.
    agent = app.clinic_finder()

    # Create a proper CrewAI Task instead of passing a string
    # directly to execute_task().
    from crewai import Task

    task = Task(
        description=(
            "Find nearby hospitals and clinics for a user in "
            "{location}. Use the Find Nearby Health Facilities "
            "tool with latitude {latitude}, longitude {longitude}, "
            "and radius {radius_m} metres. Base your answer only "
            "on the tool results. List each facility's name, "
            "distance, and directions link. State clearly if no "
            "facilities are returned. Do not invent facilities "
            "or claim they are open."
        ).format(**test_inputs),
        expected_output=(
            "A list of facilities returned by the tool, including "
            "names, distances, and directions links, or a clear "
            "statement that no facilities were found."
        ),
        agent=agent,
    )

    result = task.execute_sync()

    print("\n--- CLINIC FINDER AGENT RESULT ---")
    print(result)

except Exception as error:
    print("\nClinic-finder agent test failed:")
    print(type(error).__name__, str(error))
