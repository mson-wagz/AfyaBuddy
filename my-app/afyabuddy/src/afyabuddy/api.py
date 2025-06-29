# filepath: afyabuddy/api.py

from flask import Flask, request, jsonify
from afyabuddy.crew import Afyabuddy

app = Flask(__name__)
ai = Afyabuddy()

@app.route("/api/first-aid-steps", methods=["POST"])
def first_aid_steps():
    data = request.get_json()
    condition = data.get("condition", "").lower()
    target_language = data.get("target_language", "en").lower()

    # Get the steps dictionary from your AI class
    steps_dict = ai.run_first_aid.__self__.steps_dict if hasattr(ai.run_first_aid.__self__, 'steps_dict') else None
    # Or, if steps_dict is not a class attribute, call the method to get the steps
    if not steps_dict:
        # Use the method to get the steps for the condition
        steps = ai.run_first_aid(condition, target_language)
    else:
        steps = steps_dict.get(condition)

    if not steps:
        return jsonify({"error": "Condition not found"}), 404

    # If translation exists and requested, use it
    if (
        target_language != "en"
        and "translations" in steps
        and target_language in steps["translations"]
    ):
        translated = steps["translations"][target_language]
        # Copy over any fields not in translation (like confidence, recommendations, etc.)
        for key in ["confidence", "recommendations", "symptoms", "seek_help_if"]:
            if key in steps and key not in translated:
                translated[key] = steps[key]
        return jsonify(translated)

    # Otherwise, return the English/default version
    return jsonify(steps)

if __name__ == "__main__":
    app.run(debug=True)