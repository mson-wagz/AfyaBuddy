import json
from crewai.tools import tool
from clinic_search import find_nearby_clinics

# Test coordinates for Juja, Kenya.
# These are test coordinates, not the user's live location.
latitude = -1.101
longitude = 37.014

try:
    clinics = find_nearby_clinics(
        latitude,
        longitude,
        radius_m=5000,
    )

    print(f"\nFound {len(clinics)} mapped facilities.\n")

    for clinic in clinics[:10]:
        print(f"Name: {clinic['name']}")
        print(f"Type: {clinic['type']}")
        print(f"Distance: {clinic['distance_km']} km")
        print(f"Address: {clinic['address']}")
        print(f"Directions: {clinic['directions_url']}")
        print("-" * 40)

except Exception as error:
    print("Clinic search failed:")
    print(type(error).__name__, str(error))


@tool("Find Nearby Health Facilities")
def find_nearby_clinics_tool(
    latitude: float,
    longitude: float,
    radius_m: int = 5000,
) -> str:
    """Search OpenStreetMap for mapped hospitals, clinics, and doctors
    near the supplied latitude and longitude.

    Args:
        latitude: Latitude of the user's location.
        longitude: Longitude of the user's location.
        radius_m: Search radius in metres. Defaults to 5000.
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
        })

    except requests.RequestException as error:
        return json.dumps({
            "error": "The facility search service is unavailable.",
            "details": str(error),
        })
