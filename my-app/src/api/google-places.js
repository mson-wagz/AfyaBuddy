// Mock API endpoint for Google Places integration
// In production, this would use actual Google Places API

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }
  
    try {
      const { location, type,  keyword } = req.body
  
      // Simulate API processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))
  
      // Generate mock clinic data based on location
      const clinics = generateMockClinics(location, type, keyword)
  
      res.status(200).json({
        results: clinics,
        status: "OK",
      })
    } catch (error) {
      console.error("Google Places API error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
  
  function generateMockClinics(location, type, keyword) {
    const baseClinicData = [
      {
        place_id: "ChIJ1",
        name: "Nairobi Hospital",
        vicinity: "Argwings Kodhek Rd, Nairobi",
        types: ["hospital", "health", "establishment"],
        rating: 4.5,
        geometry: {
          location: {
            lat: -1.3067,
            lng: 36.7906,
          },
        },
        opening_hours: {
          open_now: true,
        },
        formatted_phone_number: "+254-20-2845000",
      },
      {
        place_id: "ChIJ2",
        name: "Kenyatta National Hospital",
        vicinity: "Hospital Rd, Nairobi",
        types: ["hospital", "health", "establishment"],
        rating: 4.2,
        geometry: {
          location: {
            lat: -1.3013,
            lng: 36.8073,
          },
        },
        opening_hours: {
          open_now: true,
        },
        formatted_phone_number: "+254-20-2726300",
      },
      {
        place_id: "ChIJ3",
        name: "Aga Khan University Hospital",
        vicinity: "3rd Parklands Ave, Nairobi",
        types: ["hospital", "health", "establishment"],
        rating: 4.8,
        geometry: {
          location: {
            lat: -1.2635,
            lng: 36.8017,
          },
        },
        opening_hours: {
          open_now: true,
        },
        formatted_phone_number: "+254-20-3662000",
      },
      {
        place_id: "ChIJ4",
        name: "MP Shah Hospital",
        vicinity: "Shivachi Rd, Nairobi",
        types: ["hospital", "health", "establishment"],
        rating: 4.3,
        geometry: {
          location: {
            lat: -1.2921,
            lng: 36.7856,
          },
        },
        opening_hours: {
          open_now: true,
        },
        formatted_phone_number: "+254-20-4285000",
      },
      {
        place_id: "ChIJ5",
        name: "Gertrude's Children's Hospital",
        vicinity: "Muthaiga Rd, Nairobi",
        types: ["hospital", "health", "establishment"],
        rating: 4.6,
        geometry: {
          location: {
            lat: -1.2505,
            lng: 36.8126,
          },
        },
        opening_hours: {
          open_now: true,
        },
        formatted_phone_number: "+254-20-2712000",
      },
      {
        place_id: "ChIJ6",
        name: "Avenue Healthcare",
        vicinity: "Ralph Bunche Rd, Nairobi",
        types: ["doctor", "health", "establishment"],
        rating: 4.4,
        geometry: {
          location: {
            lat: -1.2634,
            lng: 36.7908,
          },
        },
        opening_hours: {
          open_now: true,
        },
        formatted_phone_number: "+254-20-2720000",
      },
      {
        place_id: "ChIJ7",
        name: "Karen Hospital",
        vicinity: "Karen Rd, Nairobi",
        types: ["hospital", "health", "establishment"],
        rating: 4.1,
        geometry: {
          location: {
            lat: -1.3197,
            lng: 36.7025,
          },
        },
        opening_hours: {
          open_now: true,
        },
        formatted_phone_number: "+254-20-6600000",
      },
      {
        place_id: "ChIJ8",
        name: "Mater Hospital",
        vicinity: "Dunga Rd, Nairobi",
        types: ["hospital", "health", "establishment"],
        rating: 4.0,
        geometry: {
          location: {
            lat: -1.3108,
            lng: 36.7856,
          },
        },
        opening_hours: {
          open_now: true,
        },
        formatted_phone_number: "+254-20-2717000",
      },
    ]
  
    // Filter and sort based on keyword and location
    let filteredClinics = baseClinicData
  
    if (keyword && keyword !== "general") {
      // Add keyword-specific filtering logic
      if (keyword.includes("emergency")) {
        filteredClinics = filteredClinics.filter((clinic) => clinic.types.includes("hospital"))
      }
    }
  
    // Calculate distances and sort by proximity
    filteredClinics = filteredClinics
      .map((clinic) => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          clinic.geometry.location.lat,
          clinic.geometry.location.lng,
        )
        return { ...clinic, distance }
      })
      .sort((a, b) => a.distance - b.distance)
  
    return filteredClinics.slice(0, 8) // Return top 8 results
  }
  
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
  