
import json
import math
import requests
from crewai.tools import tool

OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter"


def calculate_distance_km(lat1, lon1, lat2, lon2):
    """Calculate straight-line distance between two coordinates."""
    earth_radius_km = 6371

    lat1, lon1, lat2, lon2 = map(
        math.radians, [lat1, lon1, lat2, lon2]
    )

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    return 2 * earth_radius_km * math.asin(
        math.sqrt(min(1, a))
    )


def find_nearby_clinics(latitude, longitude, radius_m=5000):
    """Find mapped health facilities near the supplied coordinates."""
    query = f"""
    [out:json][timeout:20];
    (
      nwr["amenity"~"^(hospital|clinic|doctors)$"]
        (around:{radius_m},{latitude},{longitude});
    );
    out center tags;
    """

    response = requests.post(
        OVERPASS_URL,
        data={"data": query},
        headers={"User-Agent": "AfyaBuddy/1.0"},
        timeout=(5, 15),
    )
    response.raise_for_status()

    facilities = []

    for item in response.json().get("elements", []):
        tags = item.get("tags", {})
        lat = item.get("lat")
        lon = item.get("lon")

        if lat is None or lon is None:
            center = item.get("center", {})
            lat = center.get("lat")
            lon = center.get("lon")

        if lat is None or lon is None:
            continue

        distance = calculate_distance_km(
            latitude, longitude, lat, lon
        )

        facilities.append({
            "name": tags.get("name", "Unnamed health facility"),
            "type": tags.get("amenity", "healthcare"),
            "latitude": lat,
            "longitude": lon,
            "distance_km": round(distance, 2),
            "address": ", ".join(filter(None, [
                tags.get("addr:street"),
                tags.get("addr:suburb"),
                tags.get("addr:city"),
            ])) or "Address not listed",
            "directions_url": (
                "https://www.openstreetmap.org/directions"
                f"?engine=fossgis_osrm_car&route="
                f"{latitude}%2C{longitude}%3B{lat}%2C{lon}"
            ),
        })

    facilities.sort(key=lambda facility: facility["distance_km"])
    return facilities


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
        facilities = find_nearby_clinics(
            latitude=latitude,
            longitude=longitude,
            radius_m=radius_m,
        )

        return json.dumps({
            "count": len(facilities),
            "facilities": facilities,
            "distance_note": (
                "Distances are straight-line estimates, "
                "not road travel distances."
            ),
            "source": "OpenStreetMap via Overpass API",
        })

    except requests.RequestException:
        return json.dumps({
            "error": "The clinic search service is temporarily unavailable.",
            "count": 0,
            "facilities": [],
            "source": "OpenStreetMap via Overpass API",
        })
