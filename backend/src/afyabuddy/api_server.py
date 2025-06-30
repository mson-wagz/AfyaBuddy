from flask import Flask, request, jsonify
from flask_cors import CORS
from .crew import Afyabuddy

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes
afyabuddy = Afyabuddy()

@app.route("/api/first-aid-steps", methods=["POST"])
def first_aid_steps():
    data = request.get_json()
    condition = data.get("condition", "")
    target_language = data.get("target_language", "en")
    result = afyabuddy.run_first_aid(condition, target_language)
    return jsonify(result)

@app.route("/api/translate", methods=["POST"])
def translate():
    data = request.get_json()
    text = data.get("text", "")
    target_language = data.get("target_language", "en")
    result = afyabuddy.run_translation(text, target_language)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000, debug=True)