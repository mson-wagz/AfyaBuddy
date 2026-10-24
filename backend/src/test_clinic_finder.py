
from crew import Afyabuddy

app = Afyabuddy()
clinic_finder = app.clinic_finder()

result = clinic_finder.kickoff(
    "A user needs medical care for a minor cut in Juja, "
    "Kiambu County, Kenya. Explain what information is needed "
    "to identify nearby clinics. Do not invent clinic names, "
    "addresses, phone numbers, opening hours, or distances. "
    "Clearly state that live clinic data is not connected yet."
)

print("\nClinic finder response:\n")
print(result)
