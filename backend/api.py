
from flask import Flask, request, jsonify
from flask_cors import CORS

from src.crew import Afyabuddy

app = Flask(__name__)
CORS(app)

ai = Afyabuddy()


def get_json_body():
    return request.get_json(silent=True) or {}


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "running", "service": "AfyaBuddy API"}), 200


# 1. First aid instructions
@app.route("/api/first-aid-steps", methods=["POST"])
def first_aid_steps():
    data = get_json_body()

    situation = data.get("condition", "").strip()
    target_language = data.get("target_language", "en").strip()

    if not situation:
        return jsonify({"error": "Please describe the emergency or condition."}), 400

    try:
        result = ai.run_first_aid(situation, target_language)
        return jsonify(result), 200
    except Exception:
        app.logger.exception("First aid agent failed")
        return jsonify({"error": "Unable to generate first aid instructions."}), 500


# 2. Translation
@app.route("/api/translate", methods=["POST"])
def translate():
    data = get_json_body()

    text = data.get("text", "").strip()
    target_language = data.get("target_language", "").strip()

    if not text or not target_language:
        return jsonify({
            "error": "Both text and target_language are required."
        }), 400

    try:
        result = ai.run_translation(text, target_language)
        return jsonify({
            "translated_text": result,
            "target_language": target_language
        }), 200
    except Exception:
        app.logger.exception("Translation agent failed")
        return jsonify({"error": "Translation failed."}), 500


# 3. Nearby clinic finding
@app.route("/api/find-clinics", methods=["POST"])
def find_clinics():
    data = get_json_body()

    location = data.get("location", "").strip()
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if not location and (latitude is None or longitude is None):
        return jsonify({
            "error": "Provide a location or both latitude and longitude."
        }), 400

    try:
        if latitude is not None and longitude is not None:
            latitude = float(latitude)
            longitude = float(longitude)

            if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
                return jsonify({"error": "Invalid coordinates."}), 400

        result = ai.run_find_clinic(
            location=location or f"{latitude}, {longitude}",
            latitude=latitude,
            longitude=longitude,
        )
        return jsonify({"result": result}), 200
    except (ValueError, TypeError):
        return jsonify({"error": "Latitude and longitude must be valid numbers."}), 400
    except Exception:
        app.logger.exception("Clinic finder failed")
        return jsonify({"error": "Unable to find nearby clinics."}), 500


# 4. Image analysis
@app.route("/api/image-analysis", methods=["POST"])
def image_analysis():
    if "image" not in request.files:
        return jsonify({
            "error": "Upload an image using the 'image' field."
        }), 400

    image = request.files["image"]

    if not image.filename:
        return jsonify({"error": "No image selected."}), 400

    # The current GemmaLLM adapter is text-only.
    # Do not claim to analyze an image until a vision model is integrated.
    return jsonify({
        "error": "Image analysis is not yet connected to a vision-capable model.",
        "status": "not_implemented"
    }), 501


# 5. Situation analysis
@app.route("/api/situation-analysis", methods=["POST"])
def situation_analysis():
    data = get_json_body()

    situation = data.get("situation", "").strip()

    if not situation:
        return jsonify({
            "error": "Please provide a description of the situation."
        }), 400

    try:
        result = ai.run_real_time_analysis(situation)
        return jsonify({"result": result}), 200
    except Exception:
        app.logger.exception("Situation analysis failed")
        return jsonify({"error": "Unable to analyze the situation."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
