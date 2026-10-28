import json
import logging
import math
import time

import requests
from crewai.tools import tool

logger = logging.getLogger(__name__)

# Public Overpass mirrors, tried in order if one is down or slow.
OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter",
]

# Backup source if every Overpass mirror is down (a different server, same OSM data).
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
NOMINATIM_TYPES = ("hospital", "clinic", "doctors")

REQUEST_TIMEOUT = (4, 12)  # (connect, read) seconds per mirror
TOTAL_BUDGET_S = 50        # stop trying more mirrors after this long
CACHE_TTL_S = 600          # reuse results for the same spot for 10 minutes
_cache = {}

TYPE_LABELS = {
    "hospital": "Hospital",
    "clinic": "Clinic",
    "doctors": "Doctor's Office",
}


def calculate_distance_km(lat1, lon1, lat2, lon2):
    """Calculate straight-line distance between two coordinates."""
    earth_radius_km = 6371

    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    )

    return 2 * earth_radius_km * math.asin(math.sqrt(min(1, a)))


def _query_overpass(latitude, longitude, radius_m):
    """Return raw OpenStreetMap elements, trying each mirror in turn."""
    around = f"(around:{radius_m},{latitude},{longitude})"
    # Exact key=value matches are much faster on Overpass than a regex.
    query = f"""
    [out:json][timeout:10];
    (
      nwr["amenity"="hospital"]{around};
      nwr["amenity"="clinic"]{around};
      nwr["amenity"="doctors"]{around};
    );
    out center tags;
    """

    deadline = time.monotonic() + TOTAL_BUDGET_S
    last_error = None

    for url in OVERPASS_URLS:
        if time.monotonic() >= deadline:
            break
        try:
            response = requests.post(
                url,
                data={"data": query},
                headers={"User-Agent": "AfyaBuddy/1.0"},
                timeout=REQUEST_TIMEOUT,
            )
            response.raise_for_status()
            payload = response.json()

            # Overpass sometimes answers 200 with an error note instead of data.
            if "runtime error" in str(payload.get("remark", "")):
                raise ValueError(payload["remark"])

            return payload.get("elements", [])
        except (requests.RequestException, ValueError) as error:
            logger.warning("Overpass mirror %s failed: %s", url, error)
            last_error = error

    raise last_error or requests.RequestException("No Overpass mirror available")


def _query_nominatim(latitude, longitude, radius_m):
    """Backup search. Returns elements shaped like Overpass results."""
    dlat = radius_m / 111320
    dlon = radius_m / (111320 * max(math.cos(math.radians(latitude)), 0.01))
    viewbox = (
        f"{longitude - dlon},{latitude + dlat},"
        f"{longitude + dlon},{latitude - dlat}"
    )

    elements = {}
    for index, amenity in enumerate(NOMINATIM_TYPES):
        if index:
            time.sleep(1.1)  # Nominatim allows at most 1 request per second

        response = requests.get(
            NOMINATIM_URL,
            params={
                "q": amenity,
                "format": "jsonv2",
                "viewbox": viewbox,
                "bounded": 1,
                "limit": 40,
                "addressdetails": 1,
                "extratags": 1,
            },
            headers={"User-Agent": "AfyaBuddy/1.0"},
            timeout=(4, 10),
        )
        response.raise_for_status()

        for item in response.json():
            if item.get("category") != "amenity":
                continue
            if item.get("type") not in NOMINATIM_TYPES:
                continue

            address = item.get("address") or {}
            extra = item.get("extratags") or {}
            key = (item.get("osm_type"), item.get("osm_id"))

            elements[key] = {
                "type": item.get("osm_type", "osm"),
                "id": item.get("osm_id"),
                "lat": float(item["lat"]),
                "lon": float(item["lon"]),
                "tags": {
                    "amenity": item["type"],
                    "name": item.get("name") or "",
                    "phone": extra.get("phone") or extra.get("contact:phone"),
                    "healthcare:speciality": extra.get("healthcare:speciality", ""),
                    "addr:street": address.get("road"),
                    "addr:suburb": address.get("suburb") or address.get("neighbourhood"),
                    "addr:city": address.get("city") or address.get("town"),
                },
            }

    return list(elements.values())


def _search_elements(latitude, longitude, radius_m):
    """Overpass first; if every mirror fails, fall back to Nominatim."""
    try:
        return _query_overpass(latitude, longitude, radius_m)
    except (requests.RequestException, ValueError) as error:
        logger.warning("All Overpass mirrors failed (%s); trying Nominatim", error)
        try:
            return _query_nominatim(latitude, longitude, radius_m)
        except (requests.RequestException, ValueError) as fallback_error:
            raise requests.RequestException(
                f"Overpass and Nominatim both failed: {fallback_error}"
            ) from fallback_error


def _to_frontend_clinic(item, latitude, longitude):
    """Convert one OSM element into the object the Clinics tab renders.

    Returns None for entries that are unusable (no name or no coordinates).
    """
    tags = item.get("tags", {})

    name = tags.get("name")
    if not name:
        return None

    lat = item.get("lat")
    lon = item.get("lon")
    if lat is None or lon is None:
        center = item.get("center", {})
        lat = center.get("lat")
        lon = center.get("lon")
    if lat is None or lon is None:
        return None

    type_label = TYPE_LABELS.get(tags.get("amenity", ""), "Healthcare Facility")

    specialities = [
        s.strip().replace("_", " ").title()
        for s in tags.get("healthcare:speciality", "").split(";")
        if s.strip()
    ]

    address = ", ".join(
        filter(
            None,
            [
                tags.get("addr:street"),
                tags.get("addr:suburb"),
                tags.get("addr:city"),
            ],
        )
    ) or "Address not listed"

    return {
        "id": f"{item.get('type', 'osm')}-{item.get('id')}",
        "name": name,
        "address": address,
        "phone": tags.get("phone") or tags.get("contact:phone") or "",
        "type": type_label,
        # OpenStreetMap does not provide live open/closed status or ratings.
        "isOpen": False,
        "rating": 0,
        "distance": round(
            calculate_distance_km(latitude, longitude, lat, lon), 2
        ),
        "coordinates": {"lat": lat, "lng": lon},
        "aiRecommendation": "",
        # Never invented: from the OSM tag if present, otherwise the facility type.
        "specializations": specialities or [type_label],
    }


def find_nearby_clinics(latitude, longitude, radius_m=5000, limit=10):
    """Find mapped health facilities near the coordinates.

    Returns a list shaped exactly like the frontend expects. Raises
    requests.RequestException (or ValueError) if every mirror fails, so the
    caller can return an error instead of an empty list.
    """
    cache_key = (round(latitude, 3), round(longitude, 3), radius_m, limit)
    cached = _cache.get(cache_key)
    if cached and time.monotonic() - cached[0] < CACHE_TTL_S:
        return cached[1]

    clinics = []

    # If nothing is mapped within the radius, widen it once before giving up.
    for radius in (radius_m, radius_m * 3):
        elements = _search_elements(latitude, longitude, radius)

        clinics = [
            clinic
            for clinic in (
                _to_frontend_clinic(item, latitude, longitude)
                for item in elements
            )
            if clinic is not None
        ]

        if clinics:
            break

    clinics.sort(key=lambda clinic: clinic["distance"])
    clinics = clinics[:limit]

    if clinics:
        _cache[cache_key] = (time.monotonic(), clinics)
    return clinics


@tool("Find Nearby Health Facilities")
def find_nearby_clinics_tool(
    latitude: float,
    longitude: float,
    radius_m: int = 5000,
) -> str:
    """Find mapped health facilities near the user's coordinates.

    Args:
        latitude: User's latitude.
        longitude: User's longitude.
        radius_m: Search radius in metres.
    """
    try:
        clinics = find_nearby_clinics(
            latitude=latitude,
            longitude=longitude,
            radius_m=radius_m,
        )

        return json.dumps({
            "count": len(clinics),
            "clinics": clinics,
            "distance_note": (
                "Distances are straight-line estimates, "
                "not road travel distances."
            ),
            "source": "OpenStreetMap via Overpass API",
        })

    except (requests.RequestException, ValueError):
        return json.dumps({
            "error": "The clinic search service is temporarily unavailable.",
            "count": 0,
            "clinics": [],
            "source": "OpenStreetMap via Overpass API",
        })