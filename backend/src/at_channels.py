"""Africa's Talking SMS + USSD channels for AfyaBuddy.

Wire it into api.py with two lines:

    from src.at_channels import register_africastalking
    register_africastalking(app, ai)

Environment variables (put them in your .env):
    AT_USERNAME        "sandbox" while testing, your app username when live
    AT_API_KEY         API key from the Africa's Talking dashboard
    AT_SENDER_ID       (optional) your SMS shortcode / sender ID once approved
    AT_CALLBACK_TOKEN  (optional but recommended) random string; add it to the
                       callback URLs as ?token=... so strangers can't call them
"""
import hmac
import json
import logging
import os
import re
import threading
import time

import africastalking
from flask import Response, request

log = logging.getLogger(__name__)

AT_USERNAME = os.getenv("AT_USERNAME", "sandbox")
AT_API_KEY = os.getenv("AT_API_KEY", "")
AT_SENDER_ID = os.getenv("AT_SENDER_ID") or None
AT_CALLBACK_TOKEN = os.getenv("AT_CALLBACK_TOKEN", "")

SMS_MAX_CHARS = 600  # about 4 SMS segments; keeps costs and message length sane
RATE_LIMIT_SECONDS = 20  # one request per phone number per 20 seconds

TEXT = {
    "en": {
        "footer": "Emergency? Call 999 or 112 now. AfyaBuddy gives general guidance only.",
        "avoid": "Do NOT:",
        "help": "Get help if:",
        "error": "Sorry, we could not get first aid steps right now. In an emergency call 999 or 112.",
        "usage": "AfyaBuddy first aid. Text what happened, e.g. 'deep cut on hand'. "
                 "For Kiswahili start with SW, e.g. 'SW nimeungua'. Emergency? Call 999 or 112.",
        "sending": "Steps are being sent by SMS (may take a minute). Life-threatening? Call 999 or 112 NOW.",
        "emergency_numbers": "Dial 999 or 112 for emergencies, or go to the nearest hospital.",
        "invalid": "Invalid choice. Please try again.",
        "menu": "AfyaBuddy\n1. First aid help\n2. Emergency numbers",
        "pick": "Select emergency:",
        "other": "Other",
        "describe": "Describe the emergency:",
    },
    "sw": {
        "footer": "Dharura? Piga 999 au 112 sasa. AfyaBuddy hutoa mwongozo wa jumla tu.",
        "avoid": "USIFANYE:",
        "help": "Tafuta msaada ikiwa:",
        "error": "Samahani, hatukuweza kupata hatua za huduma ya kwanza sasa. Katika dharura piga 999 au 112.",
        "usage": "AfyaBuddy huduma ya kwanza. Tuma ujumbe kuhusu kilichotokea, mfano 'nimeungua'. "
                 "Anza na SW kupata Kiswahili. Dharura? Piga 999 au 112.",
        "sending": "Hatua zinatumwa kwa SMS (inaweza kuchukua dakika). Hatari ya maisha? Piga 999 au 112 SASA.",
        "emergency_numbers": "Piga 999 au 112 kwa dharura, au nenda hospitali iliyo karibu.",
        "invalid": "Chaguo si sahihi. Tafadhali jaribu tena.",
        "menu": "AfyaBuddy\n1. Msaada wa huduma ya kwanza\n2. Namba za dharura",
        "pick": "Chagua dharura:",
        "other": "Nyingine",
        "describe": "Eleza dharura:",
    },
}

# (text sent to the first-aid agent, English label, Swahili label)
CONDITIONS = [
    ("bleeding", "Bleeding / cut", "Kutokwa na damu"),
    ("burn", "Burns", "Kuungua"),
    ("choking", "Choking", "Kubanwa koo"),
    ("snake bite", "Snake bite", "Kuumwa na nyoka"),
    ("fracture", "Broken bone", "Mfupa kuvunjika"),
    ("poisoning", "Poisoning", "Sumu"),
    ("seizure", "Seizure / fits", "Kifafa"),
    ("fainting", "Fainting", "Kuzimia"),
]
OTHER_KEY = str(len(CONDITIONS) + 1)


# --------------------------------------------------------------------- #
#  Turning the agent's answer into a short SMS                           #
# --------------------------------------------------------------------- #

def _flat(value):
    """Flatten strings / lists / dicts into a list of non-empty strings."""
    if value is None or value == "" or value == []:
        return []
    if isinstance(value, (list, tuple)):
        return [x for v in value for x in _flat(v)]
    if isinstance(value, dict):
        return [x for v in value.values() for x in _flat(v)]
    return [str(value).strip()]


def _strip_fences(text):
    return re.sub(r"```(?:json)?", "", text).strip()


def _parse_first_aid(raw):
    """run_first_aid returns {"result": "<json, often inside ``` fences>"}."""
    text = raw.get("result") if isinstance(raw, dict) else raw
    if isinstance(text, dict):
        return text
    if not isinstance(text, str):
        return None
    cleaned = _strip_fences(text)
    for candidate in (cleaned, cleaned[cleaned.find("{"): cleaned.rfind("}") + 1]):
        try:
            data = json.loads(candidate)
            if isinstance(data, dict):
                return data
        except ValueError:
            continue
    return None


def _fit(lines, footer):
    """Add lines in order until the SMS budget is used up; footer always last."""
    out, used = [], len(footer)
    for line in lines:
        if used + len(line) + 1 > SMS_MAX_CHARS:
            break
        out.append(line)
        used += len(line) + 1
    out.append(footer)
    return "\n".join(out)


def _format_sms(data, lang):
    t = TEXT[lang]
    steps = [re.sub(r"^\s*\d+[.)]\s*", "", s) for s in _flat(data.get("steps"))][:6]
    avoid = _flat(data.get("do_not"))
    help_if = _flat(data.get("seek_help_if"))

    lines = []
    if data.get("title"):
        lines.append(str(data["title"]))
    lines += [f"{i}. {s}" for i, s in enumerate(steps, 1)]
    if avoid:
        lines.append(f"{t['avoid']} {avoid[0]}")
    if help_if:
        lines.append(f"{t['help']} {help_if[0]}")
    return _fit(lines, t["footer"])


def _fallback_sms(raw, lang):
    """If the answer isn't parseable JSON, send the plain text, trimmed."""
    text = raw.get("result") if isinstance(raw, dict) else raw
    text = _strip_fences(str(text or ""))
    return _fit([text[: SMS_MAX_CHARS - 120]] if text else [], TEXT[lang]["footer"])


# --------------------------------------------------------------------- #
#  Sending, caching, rate limiting                                       #
# --------------------------------------------------------------------- #

def send_sms(phone, message):
    kwargs = {"sender_id": AT_SENDER_ID} if AT_SENDER_ID else {}
    response = africastalking.SMS.send(message, [phone], **kwargs)
    log.info("SMS to %s: %s", phone, response)


_cache = {}
_cache_lock = threading.Lock()


def _first_aid_sms(ai, query, lang):
    key = (query.strip().lower(), lang)
    with _cache_lock:
        if key in _cache:
            return _cache[key]

    raw = ai.run_first_aid(query, lang)
    data = _parse_first_aid(raw)
    if data and _flat(data.get("steps")):
        message = _format_sms(data, lang)
        with _cache_lock:
            if len(_cache) < 200:
                _cache[key] = message
        return message
    return _fallback_sms(raw, lang)


def _deliver_first_aid(ai, phone, query, lang):
    try:
        send_sms(phone, _first_aid_sms(ai, query, lang))
    except Exception:
        log.exception("Could not deliver first aid SMS to %s", phone)
        try:
            send_sms(phone, TEXT[lang]["error"])
        except Exception:
            log.exception("Could not deliver error SMS to %s", phone)


def _send_quietly(phone, message):
    try:
        send_sms(phone, message)
    except Exception:
        log.exception("Could not send SMS to %s", phone)


def _background(fn, *args):
    threading.Thread(target=fn, args=args, daemon=True).start()


_last_seen = {}
_last_seen_lock = threading.Lock()


def _rate_limited(phone):
    now = time.time()
    with _last_seen_lock:
        if now - _last_seen.get(phone, 0) < RATE_LIMIT_SECONDS:
            return True
        _last_seen[phone] = now
        return False


# --------------------------------------------------------------------- #
#  Routes                                                                #
# --------------------------------------------------------------------- #

def register_africastalking(app, ai):
    africastalking.initialize(AT_USERNAME, AT_API_KEY)

    def authorized():
        if not AT_CALLBACK_TOKEN:
            return True
        return hmac.compare_digest(request.args.get("token", ""), AT_CALLBACK_TOKEN)

    def ussd_reply(prefix, message):
        return Response(f"{prefix} {message}", mimetype="text/plain")

    # ---- Incoming SMS -------------------------------------------------
    # Africa's Talking POSTs form fields: from, to, text, date, id, linkId.
    # The HTTP response is ignored, so we answer 200 quickly and send the
    # reply as a separate SMS once the (slow) AI answer is ready.
    @app.route("/sms", methods=["POST"])
    def at_sms_callback():
        if not authorized():
            return "Forbidden", 403

        phone = request.form.get("from", "").strip()
        text = request.form.get("text", "").strip()
        if not phone or not text:
            return "", 200
        if _rate_limited(phone):
            return "", 200

        lang = "en"
        match = re.match(r"^(sw|en)\s+(.+)$", text, re.I | re.S)
        if match:
            lang, text = match.group(1).lower(), match.group(2).strip()

        if text.lower() in ("help", "msaada", "hi", "hello", "habari", "sw", "en"):
            _background(_send_quietly, phone, TEXT[lang]["usage"])
        else:
            _background(_deliver_first_aid, ai, phone, text, lang)
        return "", 200

    # ---- USSD ---------------------------------------------------------
    # Africa's Talking POSTs: sessionId, serviceCode, phoneNumber, text, networkCode.
    # `text` is every answer so far joined with "*" (empty on the first screen).
    # Replies must start with CON (keep the session open) or END (close it)
    # and be about 182 characters or fewer.
    @app.route("/ussd", methods=["POST"])
    def at_ussd_callback():
        if not authorized():
            return "Forbidden", 403

        phone = request.values.get("phoneNumber", "").strip()
        text = request.values.get("text", "")
        parts = text.split("*") if text else []

        # Screen 1: language
        if not parts:
            return ussd_reply("CON", "Welcome / Karibu AfyaBuddy\n1. English\n2. Kiswahili")

        lang = {"1": "en", "2": "sw"}.get(parts[0])
        if lang is None:
            return ussd_reply("END", "Invalid choice. / Chaguo si sahihi.")
        t = TEXT[lang]

        # Screen 2: main menu
        if len(parts) == 1:
            return ussd_reply("CON", t["menu"])

        if parts[1] == "2":
            return ussd_reply("END", t["emergency_numbers"])
        if parts[1] != "1":
            return ussd_reply("END", t["invalid"])

        # Screen 3: pick an emergency
        if len(parts) == 2:
            idx = 1 if lang == "en" else 2
            lines = [f"{n}. {c[idx]}" for n, c in enumerate(CONDITIONS, 1)]
            lines.append(f"{OTHER_KEY}. {t['other']}")
            return ussd_reply("CON", t["pick"] + "\n" + "\n".join(lines))

        choice = parts[2]
        if choice == OTHER_KEY:
            if len(parts) == 3:
                return ussd_reply("CON", t["describe"])
            query = "*".join(parts[3:]).strip()
        elif choice.isdigit() and 1 <= int(choice) <= len(CONDITIONS):
            query = CONDITIONS[int(choice) - 1][0]
        else:
            return ussd_reply("END", t["invalid"])

        if not query:
            return ussd_reply("END", t["invalid"])

        # The AI takes far too long for a USSD session, so answer by SMS.
        if phone and not _rate_limited(phone):
            _background(_deliver_first_aid, ai, phone, query, lang)
        return ussd_reply("END", t["sending"])