
from crew import Afyabuddy

app = Afyabuddy()

translator = app.translator()

result = translator.kickoff(
    "Translate the following first-aid instructions into Swahili. "
    "Preserve the meaning and safety warnings accurately:\n\n"
    "Wash the cut with clean running water. Apply direct pressure "
    "with a clean cloth to stop bleeding. Seek medical attention "
    "if the bleeding does not stop."
)

print("\nTranslator response:\n")
print(result)
