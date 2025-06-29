from flask import Flask, request, jsonify
from flask_cors import CORS
from crew import Afyabuddy

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes
afyabuddy = Afyabuddy()

@app.route("/api/first-aid-steps", methods=["POST"])
def first_aid_steps():
    data = request.get_json()
    condition = data.get("condition", "")
    target_language = data.get("target_language", "en")
    result = afyabuddy.run_first_aid(condition)

    # Only translate if not English and result is valid
    if target_language != "en" and isinstance(result, dict):
        for key in ["title", "steps", "do_not", "seek_help_if", "symptoms", "recommendations"]:
            if key in result and result[key]:
                if isinstance(result[key], list):
                    # Translate each item in the list
                    translated_list = []
                    for item in result[key]:
                        translation = afyabuddy.run_translation(item, target_language)
                        translated_list.append(translation.get("translated", item))
                    result[key] = translated_list
                elif isinstance(result[key], str):
                    translation = afyabuddy.run_translation(result[key], target_language)
                    result[key] = translation.get("translated", result[key])
    return jsonify(result)  # Return the full structured object

@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("text", "")
    target_language = data.get("target_language", "en")
    result = afyabuddy.run_translation(text, target_language)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000, debug=True)