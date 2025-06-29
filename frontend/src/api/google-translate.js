// Mock API endpoint for Google Translate integration
// In production, this would use actual Google Translate API

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }
  
    try {
      const { text, from, to, context } = req.body
  
      // Simulate API processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      // Generate translation
      const translatedText = translateText(text, from, to, context)
  
      res.status(200).json({
        translatedText: translatedText,
        confidence: 0.95,
        detectedSourceLanguage: from,
      })
    } catch (error) {
      console.error("Google Translate API error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
  
  function translateText(text, fromLang, toLang, ) {
    // Comprehensive translation dictionary for medical terms
    const translations = {
      sw: {
        // Swahili
        Emergency: "Dharura",
        "First Aid": "Huduma za Kwanza",
        Hospital: "Hospitali",
        Doctor: "Daktari",
        Nurse: "Muuguzi",
        Medicine: "Dawa",
        Pain: "Maumivu",
        Injury: "Jeraha",
        Bleeding: "Kutokwa na damu",
        Breathing: "Kupumua",
        Heart: "Moyo",
        Head: "Kichwa",
        Chest: "Kifua",
        Arm: "Mkono",
        Leg: "Mguu",
        Back: "Mgongo",
        Stomach: "Tumbo",
        Fever: "Homa",
        Cough: "Kikohozi",
        Help: "Msaada",
        Call: "Piga simu",
        Ambulance: "Gari la wagonjwa",
        "Emergency Room": "Chumba cha dharura",
        Pharmacy: "Duka la dawa",
        Treatment: "Matibabu",
        Symptoms: "Dalili",
        Allergy: "Mzio",
        Infection: "Maambukizi",
        Surgery: "Upasuaji",
        "X-ray": "Eksirei",
        "Blood pressure": "Shinikizo la damu",
        Temperature: "Joto la mwili",
        Pulse: "Mapigo ya moyo",
      },
      ki: {
        // Kikuyu
        Emergency: "Ihinda",
        "First Aid": "Ũtaaro wa mbere",
        Hospital: "Kĩrĩra",
        Doctor: "Muganga",
        Nurse: "Mũruti",
        Medicine: "Ndawa",
        Pain: "Rũrũ",
        Injury: "Kĩronda",
        Bleeding: "Gũita thakame",
        Breathing: "Gũcama",
        Heart: "Ngoro",
        Head: "Mũtwe",
        Chest: "Gĩthũri",
        Arm: "Guoko",
        Leg: "Kũgũrũ",
        Back: "Mũgongo",
        Stomach: "Nda",
        Fever: "Ũrũaru",
        Cough: "Kĩhũha",
        Help: "Ũteithio",
        Call: "Ĩta",
        Ambulance: "Motokaa ya arũaru",
        "Emergency Room": "Nyũmba ya ihinda",
        Pharmacy: "Duka rĩa ndawa",
        Treatment: "Ũgima",
        Symptoms: "Imenyithia",
        Allergy: "Mũrimũ wa kũiguithia",
        Infection: "Mũrimũ wa gũgwatania",
        Surgery: "Gũtema",
        "X-ray": "Mũcoro wa thĩinĩ",
        "Blood pressure": "Hinya wa thakame",
        Temperature: "Ũrugarĩ wa mwĩrĩ",
        Pulse: "Gũkũra kwa ngoro",
      },
      luo: {
        // Luo
        Emergency: "Kech matek",
        "First Aid": "Kony mokwongo",
        Hospital: "Ospedale",
        Doctor: "Jathieth",
        Nurse: "Jarit",
        Medicine: "Yath",
        Pain: "Rem",
        Injury: "Adhonde",
        Bleeding: "Remo mawuok",
        Breathing: "Yuak",
        Heart: "Chuny",
        Head: "Wi",
        Chest: "Agoko",
        Arm: "Bad",
        Leg: "Tiend",
        Back: "Ngʼe",
        Stomach: "Ich",
        Fever: "Liet",
        Cough: "Watiti",
        Help: "Kony",
        Call: "Luong",
        Ambulance: "Motoka mar jotuo",
        "Emergency Room": "Ot mar kech matek",
        Pharmacy: "Duka mar yedhe",
        Treatment: "Thieth",
        Symptoms: "Ranyisi mar tuo",
        Allergy: "Tuo mar ok yie",
        Infection: "Tuo makadho",
        Surgery: "Ngʼado",
        "X-ray": "Neno ma iye",
        "Blood pressure": "Teko mar remo",
        Temperature: "Liet mar dend",
        Pulse: "Goyo mar chuny",
      },
      kam: {
        // Kamba
        Emergency: "Mbesa ya haraka",
        "First Aid": "Usaidizi wa kwanza",
        Hospital: "Kĩrĩra",
        Doctor: "Muganga",
        Nurse: "Mũruti",
        Medicine: "Ndawa",
        Pain: "Ũũa",
        Injury: "Kĩvune",
        Bleeding: "Kũita thakame",
        Breathing: "Kũvuta",
        Heart: "Moyo",
        Head: "Mũtwe",
        Chest: "Kĩfua",
        Arm: "Mukono",
        Leg: "Kũgũũ",
        Back: "Mũongo",
        Stomach: "Nda",
        Fever: "Ũũa wa mwĩĩ",
        Cough: "Kĩkũũ",
        Help: "Ũtethyo",
        Call: "Ĩta",
        Ambulance: "Motoka ya arũaru",
        "Emergency Room": "Nyũmba ya mbesa",
        Pharmacy: "Duka la ndawa",
        Treatment: "Ũima",
        Symptoms: "Imenyithia",
        Allergy: "Mũrimũ wa kũũa",
        Infection: "Mũrimũ wa kũgwatania",
        Surgery: "Kũtema",
        "X-ray": "Mũcoro wa thĩinĩ",
        "Blood pressure": "Hinya wa thakame",
        Temperature: "Ũrugarĩ wa mwĩĩ",
        Pulse: "Kũkũra kwa moyo",
      },
    }
  
    // If translating to a supported language
    if (translations[toLang]) {
      let translatedText = text
      const langDict = translations[toLang]
  
      // Replace English terms with translated equivalents
      for (const [english, translated] of Object.entries(langDict)) {
        const regex = new RegExp(`\\b${english}\\b`, "gi")
        translatedText = translatedText.replace(regex, translated)
      }
  
      // If significant translation occurred, return it
      if (translatedText !== text) {
        return translatedText
      }
    }
  
    // Fallback: Basic word-by-word translation for common medical phrases
    if (toLang === "sw") {
      return text
        .replace(/emergency/gi, "dharura")
        .replace(/help/gi, "msaada")
        .replace(/doctor/gi, "daktari")
        .replace(/hospital/gi, "hospitali")
        .replace(/pain/gi, "maumivu")
        .replace(/call/gi, "piga simu")
    }
  
    // If no translation available, return original text
    return text
  }
  