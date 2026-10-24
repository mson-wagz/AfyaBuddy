
from crew import Afyabuddy

app = Afyabuddy()

result = app.first_aid_expert().kickoff(
    "Explain the basic first-aid steps for a minor cut. "
    "Mention warning signs that require medical attention."
)

print("\nFirst-aid agent response:\n")
print(result)
