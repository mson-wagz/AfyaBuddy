import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Avatar, AvatarFallback } from "./components/ui/avatar"
import { Alert, AlertDescription } from "./components/ui/alert"
import { Badge } from "./components/ui/badge"
import { Separator } from "./components/ui/separator"
import { Progress } from "./components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { Switch } from "./components/ui/switch"
import {
  Send,
  Upload,
  AlertTriangle,
  Phone,
  Loader2,
  Globe,
  MapPin,
  Navigation,
  Clock,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Zap,
  Shield,
  Award,
  Users,
  Bell,
  Moon,
  Sun,
  Activity,
  Thermometer,
  Eye,
  Brain,
  Stethoscope,
  Timer,
  Share2,
  Star,
  Plane,
  Snowflake,
  Smartphone,
  Bot,
  Network,
  CheckCircle,
  XCircle,
} from "lucide-react"
import logo from "./assets/afyabuddy-logo.png"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"

// Import AI services
import {
  translateTextGoogle,
  analyzeFacialHealthTensorFlow,
} from "./lib/ai-services"

/* ------------------------------------------------------------------ */
/*  BRAND                                                              */
/*  Teal  #02595A  (main)   Mint  #68DEC4  (accent)   Coral #FD7963    */
/* ------------------------------------------------------------------ */
const BRAND_GRADIENT = "bg-gradient-to-r from-[#02595A] to-[#68DEC4]"
const BRAND_GRADIENT_HOVER = "hover:from-[#014647] hover:to-[#4fcfb2]"

// Toggle switches: visible border in both themes, teal when ON, grey when OFF
const switchClass = (darkMode) =>
  `border-2 rounded-full ${
    darkMode ? "border-[#68DEC4]" : "border-[#02595A]"
  } data-[state=checked]:bg-[#0a7a77] data-[state=unchecked]:bg-gray-300`

const TAB_CLASS =
  "flex items-center justify-center gap-2 data-[state=active]:bg-[#02595A] data-[state=active]:text-white"

// Where your backend lives. Set VITE_BACKEND_URL in a .env file to change it.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000"

// Kenya emergency numbers
const EMERGENCY_NUMBER = "999"

// --- getTranslation lives OUTSIDE the App component so it can be reused ---
// eslint-disable-next-line react-refresh/only-export-components
export const getTranslation = async ({ key, selectedLanguage, translations, setAiStatus, translateTextGoogle }) => {
  const baseText = translations.en[key]

  // English: just return English
  if (selectedLanguage === "en") {
    return baseText
  }

  // Use a manual translation if we have one
  if (translations[selectedLanguage]?.[key]) {
    return translations[selectedLanguage][key]
  }

  // Otherwise, use Google Translate
  try {
    setAiStatus((prev) => ({ ...prev, translation: "processing" }))
    const result = await translateTextGoogle(baseText, "en", selectedLanguage, "ui")
    setAiStatus((prev) => ({ ...prev, translation: "ready" }))

    if (result.success) {
      return result.translatedText
    }
  } catch (error) {
    console.error("AI translation failed:", error)
    setAiStatus((prev) => ({ ...prev, translation: "error" }))
  }

  // Fall back to English if translation fails
  return baseText
}

// --- Small helper components (outside App so they are not re-created on every render) ---

const AIStatusIndicator = ({ status, label }) => {
  const color =
    status === "ready"
      ? "text-green-500"
      : status === "processing"
        ? "text-yellow-500"
        : status === "error"
          ? "text-red-500"
          : "text-gray-500"

  const icon =
    status === "ready" ? (
      <CheckCircle className="w-3 h-3" />
    ) : status === "processing" ? (
      <Loader2 className="w-3 h-3 animate-spin" />
    ) : status === "error" ? (
      <XCircle className="w-3 h-3" />
    ) : (
      <Network className="w-3 h-3" />
    )

  return (
    <div className={`flex items-center gap-1 text-xs ${color}`}>
      {icon}
      <span>{label}</span>
    </div>
  )
}

const DemoNotice = ({ darkMode, children }) => (
  <Alert className={darkMode ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"}>
    <AlertTriangle className="h-4 w-4 text-yellow-600" />
    <AlertDescription className={darkMode ? "text-yellow-300" : "text-yellow-800"}>{children}</AlertDescription>
  </Alert>
)

/* ------------------------------------------------------------------ */
/*  FIRST AID: backend call + response cleanup                         */
/* ------------------------------------------------------------------ */

// The agent can return its JSON as a string wrapped in ```json fences, with steps
// already numbered ("1. Wash...") and lists that are sometimes strings, arrays, or
// objects like { signs_of_infection: [...] }. These helpers turn any of that into
// one clean object that React can always render.
const toList = (value) => {
  if (value === null || value === undefined || value === "") return []
  if (Array.isArray(value)) return value.flatMap(toList)
  if (typeof value === "object") return Object.values(value).flatMap(toList)
  return [String(value)]
}

const stripNumber = (s) => String(s).replace(/^\s*\d+[.)]\s*/, "")

const normalizeFirstAid = (raw) => {
  let data = raw

  // Unwrap { result: ... } style envelopes
  if (data && typeof data === "object" && !Array.isArray(data) && !data.steps) {
    data = data.result ?? data.raw ?? data.output ?? data.final_answer ?? data
  }

  // Parse JSON strings (with or without code fences)
  if (typeof data === "string") {
    const cleaned = data
      .replace(/^[\s\S]*?```(?:json)?\s*/i, "")
      .replace(/\s*```[\s\S]*$/, "")
      .trim()
    try {
      data = JSON.parse(cleaned)
    } catch {
      const start = data.indexOf("{")
      const end = data.lastIndexOf("}")
      try {
        data = JSON.parse(data.slice(start, end + 1))
      } catch {
        return null
      }
    }
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) return null

  return {
    ...data,
    title: typeof data.title === "string" ? data.title : toList(data.title).join(" "),
    immediate_danger: toList(data.immediate_danger),
    steps: toList(data.steps).map(stripNumber),
    do_not: toList(data.do_not),
    seek_help_if: toList(data.seek_help_if),
    symptoms: toList(data.symptoms),
    recommendations: toList(data.recommendations),
    sources: toList(data.sources),
  }
}

async function getFirstAidStepsFromBackend(condition, targetLanguage = "en") {
  const response = await fetch(`${BACKEND_URL}/api/first-aid-steps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ condition, target_language: targetLanguage }),
  })
  if (!response.ok) throw new Error("Failed to fetch first aid steps")
  return normalizeFirstAid(await response.json())
}

async function getTranslationFromBackend(text, targetLanguage) {
  const response = await fetch(`${BACKEND_URL}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target_language: targetLanguage }),
  })
  if (!response.ok) throw new Error("Failed to fetch translation")
  return await response.json()
}

/* ------------------------------------------------------------------ */
/*  CLINICS: backend call + response cleanup                           */
/* ------------------------------------------------------------------ */

// Straight-line distance in km, used only if the backend doesn't send one
const haversineKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// Parses JSON that may be wrapped in ```json fences or surrounded by extra text
const parseJsonLoose = (value) => {
  if (typeof value !== "string") return value
  const text = value.replace(/```(?:json)?/gi, "").trim()
  try {
    return JSON.parse(text)
  } catch {
    // fall through to extracting the JSON portion
  }
  const starts = [text.indexOf("["), text.indexOf("{")].filter((i) => i !== -1)
  if (starts.length === 0) return null
  const end = Math.max(text.lastIndexOf("]"), text.lastIndexOf("}"))
  try {
    return JSON.parse(text.slice(Math.min(...starts), end + 1))
  } catch {
    return null
  }
}

// Turns whatever the backend returns into the exact shape the Clinics tab renders.
// Accepts an array, or an object like { clinics: [...] } / { results: [...] } / { result: "<json string>" }.
const normalizeClinics = (raw, userLat, userLng) => {
  let data = parseJsonLoose(raw)

  // Unwrap envelopes: { result: "<json string>" } -> string -> { clinics: [...] } -> array
  for (let i = 0; i < 4 && data && !Array.isArray(data); i++) {
    if (typeof data === "string") {
      data = parseJsonLoose(data)
    } else if (typeof data === "object") {
      data = data.clinics ?? data.results ?? data.data ?? data.result ?? data.raw ?? data.output ?? null
    } else {
      break
    }
  }
  if (!Array.isArray(data)) return []

  return data
    .map((c, i) => {
      const lat = Number(c.coordinates?.lat ?? c.lat ?? c.latitude ?? c.location?.lat)
      const lng = Number(c.coordinates?.lng ?? c.lng ?? c.longitude ?? c.location?.lng)
      const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)

      let distance = Number(c.distance ?? c.distance_km)
      if (!Number.isFinite(distance)) {
        distance = hasCoords ? haversineKm(userLat, userLng, lat, lng) : 0
      }

      const rating = Number(c.rating)

      return {
        id: String(c.id ?? c.place_id ?? i),
        name: c.name ?? "Unnamed facility",
        address: c.address ?? c.vicinity ?? "",
        phone: c.phone ?? c.phone_number ?? "",
        type: c.type ?? "Healthcare Facility",
        isOpen: Boolean(c.isOpen ?? c.is_open ?? c.open_now),
        rating: Number.isFinite(rating) ? rating : 0,
        distance,
        coordinates: hasCoords ? { lat, lng } : null,
        aiRecommendation: c.aiRecommendation ?? c.ai_recommendation ?? c.recommendation ?? "",
        specializations: toList(c.specializations),
      }
    })
    .sort((a, b) => a.distance - b.distance)
}

async function getNearbyClinicsFromBackend(latitude, longitude) {
  const response = await fetch(`${BACKEND_URL}/api/find-clinics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude, longitude }),
  })
  if (!response.ok) throw new Error("Failed to fetch nearby clinics")
  return normalizeClinics(await response.json(), latitude, longitude)
}

function FirstAidInstructions({ data, darkMode }) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  return (
    <div>
      {data.title && (
        <h3 className={`font-bold mb-2 text-lg ${darkMode ? "text-yellow-300" : "text-[#02595A]"}`}>{data.title}</h3>
      )}

      {data.immediate_danger?.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold text-sm">Immediate Danger:</span>
          <ul className="list-disc list-inside ml-4 text-sm">
            {data.immediate_danger.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {data.steps?.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold text-sm">Steps:</span>
          <ol className="list-decimal list-inside ml-4 text-sm">
            {data.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {data.do_not?.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold text-sm text-red-600">Do NOT:</span>
          <ul className="list-disc list-inside ml-4 text-sm text-red-500">
            {data.do_not.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {data.seek_help_if?.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold text-sm text-orange-600">Seek help if:</span>
          <ul className="list-disc list-inside ml-4 text-sm text-orange-500">
            {data.seek_help_if.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {data.symptoms?.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold text-sm">Watch for these signs:</span>
          <ul className="list-disc list-inside ml-4 text-sm">
            {data.symptoms.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {data.recommendations?.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold text-sm text-[#02595A]">Recommendations:</span>
          <ul className="list-disc list-inside ml-4 text-sm text-[#0a7a77]">
            {data.recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {data.sources?.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold text-sm">Sources:</span>
          <ul className="list-disc list-inside ml-4 text-sm">
            {data.sources.map((source, i) => (
              <li key={i}>{source}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
const App = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const fileInputRef = useRef(null)

  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [darkMode, setDarkMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState("chat")
  const [lastFirstAidQuery, setLastFirstAidQuery] = useState(null)

  // AI service status indicators
  const [aiStatus, setAiStatus] = useState({
    location: "ready",
    translation: "ready",
    facial: "ready",
  })

  // Vital signs (simulated demo data)
  const [vitalSigns, setVitalSigns] = useState({
    heartRate: 72,
    temperature: 36.5,
    oxygenLevel: 98,
    bloodPressure: "120/80",
  })

  const [achievements, setAchievements] = useState([
    {
      id: "1",
      title: "AI Medical Expert",
      description: "Completed first AI-powered medical consultation",
      icon: "🤖",
      unlocked: false,
      progress: 0,
    },
    {
      id: "2",
      title: "Multilingual Helper",
      description: "Used AI translation in 3 languages",
      icon: "🌍",
      unlocked: false,
      progress: 1,
    },
    {
      id: "3",
      title: "Health Scanner",
      description: "Completed 5 AI facial health analyses",
      icon: "🔬",
      unlocked: false,
      progress: 2,
    },
    {
      id: "4",
      title: "Location Expert",
      description: "Found clinics using AI location services",
      icon: "📍",
      unlocked: true,
      progress: 100,
    },
  ])

  const [emergencyContacts] = useState([
    { name: "Dr. Sarah Mwangi", phone: "+254-700-123456", relation: "Family Doctor" },
    { name: "John Kamau", phone: "+254-722-987654", relation: "Emergency Contact" },
  ])

  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [sosCountdown, setSosCountdown] = useState(0)

  // AI-powered features
  const [, setCameraStream] = useState(null) // we only need the setter
  const [isAnalyzingFace, setIsAnalyzingFace] = useState(false)
  const [aiHealthAnalysis, setAiHealthAnalysis] = useState(null)
  const [stressLevel, setStressLevel] = useState(0)
  const [painLevel, setPainLevel] = useState(0)
  const [mentalHealthScore, setMentalHealthScore] = useState(85)
  const [environmentalAlerts, setEnvironmentalAlerts] = useState([])
  const [aiCoachMessages, setAiCoachMessages] = useState([])
  const [gestureControl, setGestureControl] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(false)
  const [droneResponse, setDroneResponse] = useState(false)

  const [communityHelpers] = useState([
    { name: "Dr. Jane Wanjiku", distance: "0.5km", specialty: "Emergency Medicine", available: true },
    { name: "Nurse Peter Ochieng", distance: "1.2km", specialty: "First Aid Trainer", available: true },
    { name: "Paramedic Sarah Muthoni", distance: "2.1km", specialty: "Trauma Care", available: false },
  ])

  const [healthPredictions] = useState([
    { condition: "Dehydration Risk", probability: 15, timeframe: "Next 2 hours", prevention: "Drink 500ml water" },
    { condition: "Stress Overload", probability: 35, timeframe: "Today", prevention: "Take 10min meditation break" },
    { condition: "Sleep Deprivation", probability: 60, timeframe: "Tonight", prevention: "Sleep by 10 PM" },
  ])

  const [smartDevices] = useState([
    { name: "Smart Watch", connected: true, battery: 85, lastSync: "2 min ago" },
    { name: "Smart Scale", connected: true, battery: 92, lastSync: "1 hour ago" },
    { name: "Air Quality Monitor", connected: false, battery: 0, lastSync: "Never" },
  ])

  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  ]

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })
  const [nearbyClinics, setNearbyClinics] = useState([])
  const [showClinics, setShowClinics] = useState(false)

  // Animations
  const [pulseAnimation, setPulseAnimation] = useState(false)
  const [emergencyPulse, setEmergencyPulse] = useState(false)

  // Translated chat title
  const [translatedTitle, setTranslatedTitle] = useState("AI Medical Consultation")

  const translations = {
    en: {
      title: "AfyaBuddy AI",
      subtitle: "Your AI-Powered First Aid Assistant",
      emergencyDisclaimer: "AI Emergency Disclaimer:",
      emergencyText:
        "This AI assistant provides general first aid guidance only. In serious emergencies, call your local emergency number immediately (999 or 112 in Kenya). Always seek professional medical help for severe injuries.",
      emergencyCall: "Emergency Call",
      emergencyCallDesc: "Call 999 or 112 immediately",
      askQuestion: "Ask AI Assistant",
      askQuestionDesc: "Get AI-powered first aid guidance",
      uploadImage: "AI Image Analysis",
      uploadImageDesc: "AI-powered accident photo analysis",
      firstAidChat: "AI Medical Consultation",
      placeholder: "Ask your AI medical assistant anything...",
      commonTopics: "AI-Powered First Aid Topics",
      analyzing: "AI is analyzing and preparing expert response...",
      welcomeMessage:
        "Hello! I'm AfyaBuddy AI, powered by advanced AI technology. I can provide expert medical guidance, analyze images, translate to local languages, and find the best healthcare facilities near you!",
      selectLanguage: "Select Language (AI Translated)",
      vitalSigns: "AI Vital Signs Monitor",
      achievements: "AI Achievements",
      emergencyContacts: "Emergency Contacts",
      sosMode: "SOS Emergency Mode",
      darkMode: "Dark Mode",
      voiceMode: "AI Voice Assistant",
    },
    sw: {
      title: "AfyaBuddy AI",
      subtitle: "Msaidizi Wako wa AI wa Huduma za Kwanza",
      emergencyDisclaimer: "Onyo la Dharura la AI:",
      emergencyText:
        "Msaidizi huu wa AI anatoa mwongozo wa jumla wa huduma za kwanza tu. Katika hali za dharura kali, piga simu ya dharura ya eneo lako mara moja (999 au 112 nchini Kenya). Tafuta msaada wa kitaaluma kila wakati kwa majeraha makubwa.",
      emergencyCall: "Simu ya Dharura",
      emergencyCallDesc: "Piga 999 au 112 mara moja",
      askQuestion: "Uliza Msaidizi wa AI",
      askQuestionDesc: "Pata mwongozo wa AI wa huduma za kwanza",
      uploadImage: "Uchambuzi wa Picha wa AI",
      uploadImageDesc: "Uchambuzi wa picha za ajali kwa AI",
      firstAidChat: "Mazungumzo ya Matibabu ya AI",
      placeholder: "Uliza msaidizi wako wa matibabu wa AI chochote...",
      commonTopics: "Mada za Huduma za Kwanza za AI",
      analyzing: "AI inachunguza na kuandaa jibu la kitaalamu...",
      welcomeMessage:
        "Hujambo! Mimi ni AfyaBuddy AI, ninayetumia teknolojia ya hali ya juu ya AI. Ninaweza kutoa mwongozo wa kitaalamu wa matibabu, kuchunguza picha, kutafsiri kwa lugha za ndani, na kupata vituo bora vya afya karibu nawe!",
      selectLanguage: "Chagua Lugha (Imetafsiriwa na AI)",
      vitalSigns: "Kifuatiliaji cha Dalili za Kimwili cha AI",
      achievements: "Mafanikio ya AI",
      emergencyContacts: "Anwani za Dharura",
      sosMode: "Hali ya Dharura ya SOS",
      darkMode: "Hali ya Giza",
      voiceMode: "Msaidizi wa Sauti wa AI",
    },
  }

  const t = translations[selectedLanguage] || translations.en

  // Shared card style (light / dark)
  const cardCls = darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
  const mutedText = darkMode ? "text-gray-400" : "text-gray-600"

  /* -------------------------- EFFECTS -------------------------- */

  // Re-fetch the last first-aid answer when the language changes
  useEffect(() => {
    if (!lastFirstAidQuery) return

    const lastAssistantMsgIndex = messages
      .slice()
      .reverse()
      .findIndex((msg) => msg.type === "assistant" && typeof msg.content === "object" && msg.content.steps)

    if (lastAssistantMsgIndex === -1) return

    const idxToRemove = messages.length - 1 - lastAssistantMsgIndex
    const newMessages = messages.filter((_, i) => i !== idxToRemove)

    setIsLoading(true)
    getFirstAidStepsFromBackend(lastFirstAidQuery, selectedLanguage)
      .then((data) => {
        if (data && data.steps?.length) {
          setMessages([
            ...newMessages,
            {
              id: (Date.now() + 1).toString(),
              type: "assistant",
              content: data,
              timestamp: new Date(),
              isAI: true,
            },
          ])
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage])

  // Welcome message + simulated vitals
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      type: "assistant",
      content: `🤖 Welcome to AfyaBuddy AI! I'm powered by advanced AI technology to provide you with:

🩺 **OpenAI Medical Consultation** - Expert first aid guidance powered by GPT
🌍 **Google Maps Location Services** - Smart clinic recommendations  
🗣️ **Google Translate Support** - Real-time translation in 13+ Kenyan languages
👁️ **TensorFlow Facial Analysis** - AI-powered stress and wellness assessment

How can I assist you today? You can ask questions, upload images, or use voice commands!`,
      timestamp: new Date(),
      isAI: true,
    }
    setMessages([welcomeMessage])

    // Simulated vital signs (demo only)
    const interval = setInterval(() => {
      setVitalSigns((prev) => ({
        ...prev,
        heartRate: Math.floor(Math.random() * 20) + 65,
        temperature: Math.round((Math.random() * 2 + 36) * 10) / 10,
        oxygenLevel: Math.floor(Math.random() * 5) + 95,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // SOS action. useCallback keeps it stable so the countdown effect doesn't re-fire.
  const triggerEmergencySOS = useCallback(() => {
    setEmergencyPulse(true)
    setIsEmergencyMode(false) // stop the countdown right away so this only fires once

    // Simulated emergency actions
    emergencyContacts.forEach((contact) => {
      console.log(`Sending emergency alert to ${contact.name}: ${contact.phone}`)
    })

    if (location.latitude && location.longitude) {
      const locationMessage = `Emergency! I need help. My location: https://maps.google.com/?q=${location.latitude},${location.longitude}`
      console.log("Emergency location shared:", locationMessage)
    }

    setTimeout(() => setEmergencyPulse(false), 5000)
  }, [emergencyContacts, location.latitude, location.longitude])

  // SOS countdown
  useEffect(() => {
    if (sosCountdown > 0) {
      const timer = setTimeout(() => setSosCountdown((c) => c - 1), 1000)
      return () => clearTimeout(timer)
    } else if (sosCountdown === 0 && isEmergencyMode) {
      triggerEmergencySOS()
    }
  }, [sosCountdown, isEmergencyMode, triggerEmergencySOS])

  // Translate the chat title when the language changes
  useEffect(() => {
    getTranslation({
      key: "firstAidChat",
      selectedLanguage,
      translations,
      setAiStatus,
      translateTextGoogle,
    }).then(setTranslatedTitle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage])

  /* -------------------------- ACTIONS -------------------------- */

  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser")
      return
    }

    const recognition = new window.webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = selectedLanguage === "sw" ? "sw-KE" : "en-US"

    recognition.onstart = () => {
      setIsListening(true)
      setPulseAnimation(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
      setPulseAnimation(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
      setPulseAnimation(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setPulseAnimation(false)
    }

    recognition.start()
  }

  const speakText = async (text) => {
    if (!voiceEnabled) return

    let textToSpeak = text
    if (selectedLanguage !== "en") {
      try {
        const result = await translateTextGoogle(text, "en", selectedLanguage, "speech")
        if (result.success) {
          textToSpeak = result.translatedText
        }
      } catch (error) {
        console.error("Speech translation failed:", error)
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = selectedLanguage === "sw" ? "sw-KE" : "en-US"
    utterance.rate = 0.8
    utterance.pitch = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  const startSOSCountdown = () => {
    setIsEmergencyMode(true)
    setSosCountdown(10)
  }

  const cancelSOS = () => {
    setIsEmergencyMode(false)
    setSosCountdown(0)
  }

  const getCurrentLocation = () => {
    setLocation((prev) => ({ ...prev, loading: true, error: null }))

    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by this browser.",
      }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
        findNearbyClinicsAI(position.coords.latitude, position.coords.longitude)
      },
      () => {
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: "Unable to retrieve your location. Please enable location services.",
        }))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    )
  }

  const findNearbyClinicsAI = async (userLat, userLng) => {
    try {
      setAiStatus((prev) => ({ ...prev, location: "processing" }))

      const clinics = await getNearbyClinicsFromBackend(userLat, userLng)
      if (clinics.length === 0) throw new Error("No clinics returned")

      setAiStatus((prev) => ({ ...prev, location: "ready" }))
      setNearbyClinics(clinics)
      setShowClinics(true)

      setAchievements((prev) =>
        prev.map((achievement) =>
          achievement.id === "4" ? { ...achievement, unlocked: true, progress: 100 } : achievement,
        ),
      )
    } catch (error) {
      console.error("Backend clinic search failed:", error)
      setAiStatus((prev) => ({ ...prev, location: "error" }))
      setShowClinics(false)
      setLocation((prev) => ({
        ...prev,
        error: "Couldn't load nearby clinics. Please try again, or call 999 in an emergency.",
      }))
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !uploadedImage) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input || "Image uploaded for AI analysis",
      image: uploadedImage || undefined,
      timestamp: new Date(),
      isVoice: isListening,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    setUploadedImage(null);

    try {
      // Fetch first aid steps from the backend
      const data = await getFirstAidStepsFromBackend(userMessage.content, selectedLanguage);

      if (data && data.steps?.length) {
        // Add the detailed response to the messages
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: data, // Pass the entire response object
            timestamp: new Date(),
            isAI: true,
          },
        ]);
        setLastFirstAidQuery(userMessage.content);

        // Read the first aid steps aloud
        const stepsText = `Here are the first aid steps: ${data.steps.join(", ")}`;
        speakText(stepsText);
      } else {
        // Fallback to general guidance if no steps are returned
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: "No specific steps found. Please try again.",
            timestamp: new Date(),
            isAI: true,
            isError: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching first aid steps:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "Unable to fetch first aid steps. Please try again later.",
          timestamp: new Date(),
          isAI: true,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startFacialAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setCameraStream(stream)
      setIsAnalyzingFace(true)
      setAiStatus((prev) => ({ ...prev, facial: "processing" }))

      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      video.onloadedmetadata = async () => {
        // "Scan" for 8 seconds, then analyse
        setTimeout(async () => {
          try {
            const result = await analyzeFacialHealthTensorFlow(video, vitalSigns)

            setAiStatus((prev) => ({ ...prev, facial: "ready" }))

            if (result.success) {
              setAiHealthAnalysis(result.analysis)
              setStressLevel(result.analysis.stressLevel)
              setPainLevel(result.analysis.painLevel)
              setMentalHealthScore(result.analysis.mentalHealthScore)

              setAchievements((prev) =>
                prev.map((achievement) => {
                  if (achievement.id === "3" && achievement.progress < 5) {
                    const newProgress = achievement.progress + 1
                    return { ...achievement, progress: newProgress, unlocked: newProgress >= 5 }
                  }
                  return achievement
                }),
              )

              setAiCoachMessages((prev) => [
                ...prev,
                `🔬 AI Health Analysis Complete! Stress: ${result.analysis.stressLevel}%, Pain: ${result.analysis.painLevel}%, Wellness: ${result.analysis.overallWellness}%`,
              ])
            } else {
              setAiStatus((prev) => ({ ...prev, facial: "error" }))
              setAiCoachMessages((prev) => [...prev, "🔬 AI analysis encountered an issue. Using basic assessment."])
            }
          } catch (error) {
            console.error("AI facial analysis failed:", error)
            setAiStatus((prev) => ({ ...prev, facial: "error" }))
          }

          setIsAnalyzingFace(false)
          stream.getTracks().forEach((track) => track.stop())
          setCameraStream(null)
        }, 8000)
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      setAiStatus((prev) => ({ ...prev, facial: "error" }))
    }
  }

  const enableGestureControl = () => {
    setGestureControl(!gestureControl)
    if (!gestureControl) {
      setAiCoachMessages((prev) => [
        ...prev,
        "👋 Gesture control switched on (demo). Real hand tracking is not connected yet.",
      ])
    }
  }

  const authenticateBiometric = async () => {
    if ("credentials" in navigator) {
      try {
        setBiometricAuth(true)
        setAiCoachMessages((prev) => [
          ...prev,
          "🔐 Biometric sign-in switched on (demo). No real fingerprint or face check is connected yet.",
        ])
      } catch (error) {
        console.error("Biometric auth failed:", error)
      }
    }
  }

  const requestDroneResponse = () => {
    setDroneResponse(true)
    setAiCoachMessages((prev) => [
      ...prev,
      "🚁 Drone request (demo only): no real drone is dispatched. In an emergency, call " + EMERGENCY_NUMBER + " or 112.",
    ])

    setTimeout(() => {
      setDroneResponse(false)
    }, 5000)
  }

  const analyzeEnvironment = () => {
    const alerts = [
      "🌡️ High temperature (32°C) - Risk of heat exhaustion (demo)",
      "💨 Poor air quality - Consider wearing a mask (demo)",
      "🌧️ High humidity (85%) - Stay hydrated (demo)",
      "☀️ High UV index - Apply sunscreen (demo)",
    ]

    setEnvironmentalAlerts([alerts[Math.floor(Math.random() * alerts.length)]])
  }

  const startAIHealthCoach = () => {
    const coachMessages = [
      "🤖 Health Coach activated! Here are a few general wellness tips.",
      "💡 Try 5 minutes of slow, guided breathing to ease stress.",
      "🏃‍♂️ A 10-minute walk can boost your energy.",
      "💧 Drink water regularly, especially in warm weather.",
      "🧘‍♀️ A short mindfulness break can help you reset.",
    ]

    setAiCoachMessages(coachMessages)
  }

  const shareLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const shareData = {
          title: "Emergency Location",
          text: `I need help! My live location: https://maps.google.com/?q=${latitude},${longitude}`,
        }
        if (navigator.share) {
          navigator.share(shareData).catch(() => {})
        } else {
          navigator.clipboard.writeText(shareData.text)
          alert("Location copied to clipboard!")
        }
      },
      () => {
        alert("Unable to retrieve your location. Please enable location services.")
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  /* -------------------------- RENDER -------------------------- */

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode ? "bg-gradient-to-br from-gray-900 to-[#02595A] text-white" : "bg-gradient-to-br from-[#effaf7] to-white"
      }`}
    >
      {/* Header */}
      <div
        className={`shadow-lg border-b backdrop-blur-md ${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"}`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo + status */}
            <div className="flex items-center gap-3">
              <div
                className={`${darkMode ? "bg-white rounded-xl px-2 py-1" : ""} ${emergencyPulse ? "animate-bounce" : ""} ${pulseAnimation ? "animate-pulse" : ""}`}
              >
                <img
                  src={logo}
                  alt="AfyaBuddy"
                  className="h-12 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling.style.display = "block"
                  }}
                />
                <span style={{ display: "none" }} className="text-2xl font-bold text-[#02595A]">
                  AfyaBuddy
                </span>
              </div>
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-[#02595A]"}`}>{t.subtitle}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <AIStatusIndicator status={aiStatus.location} label="Google Maps" />
                  <AIStatusIndicator status={aiStatus.translation} label="Translate" />
                  <AIStatusIndicator status={aiStatus.facial} label="TensorFlow" />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Voice toggle */}
              <div className="flex items-center gap-2">
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <Switch
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                  className={switchClass(darkMode)}
                />
              </div>

              {/* Dark mode toggle */}
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className={switchClass(darkMode)}
                />
              </div>

              {/* Language selector */}
              <div className="flex items-center gap-2 bg-white rounded-md pl-2 text-gray-900">
                <Globe className="w-4 h-4" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex flex-col">
                          <span className="font-medium">{lang.nativeName}</span>
                          <span className="text-xs text-gray-500">{lang.name} (AI Powered)</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Emergency SOS button (stays red on purpose) */}
              <Button
                variant={isEmergencyMode ? "destructive" : "outline"}
                size="sm"
                onClick={isEmergencyMode ? cancelSOS : startSOSCountdown}
                className={`${isEmergencyMode ? "animate-pulse" : "border-red-500 text-red-600"} font-bold`}
              >
                {isEmergencyMode ? (
                  <>
                    <Shield className="w-4 h-4 mr-1" />
                    Cancel SOS ({sosCountdown})
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-1" />
                    SOS
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Emergency disclaimer (stays red on purpose) */}
        <Alert className={`mb-6 border-red-200 ${darkMode ? "bg-red-900/20" : "bg-red-50"}`}>
          <Bot className="h-4 w-4 text-red-600" />
          <AlertDescription className={darkMode ? "text-red-300" : "text-red-800"}>
            <strong>{t.emergencyDisclaimer}</strong> {t.emergencyText}
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <TabsTrigger value="chat" className={TAB_CLASS}>
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="vitals" className={TAB_CLASS}>
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">AI Vitals</span>
            </TabsTrigger>
            <TabsTrigger value="clinics" className={TAB_CLASS}>
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">AI Clinics</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className={TAB_CLASS}>
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className={TAB_CLASS}>
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency</span>
            </TabsTrigger>
            <TabsTrigger value="futuristic" className={TAB_CLASS}>
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">AI Tech</span>
            </TabsTrigger>
          </TabsList>

          {/* ---------------- CHAT TAB ---------------- */}
          <TabsContent value="chat" className="space-y-6">
            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${cardCls}`}
                onClick={() => window.open(`tel:${EMERGENCY_NUMBER}`, "_self")}
              >
                <CardContent className="p-4 text-center">
                  <div className="bg-red-500 p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Phone className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#68DEC4] rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-sm">{t.emergencyCall}</h3>
                  <p className={`text-xs ${mutedText}`}>{t.emergencyCallDesc}</p>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${cardCls}`}>
                <CardContent className="p-4 text-center">
                  <div className="bg-[#02595A] p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Brain className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#68DEC4] rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="font-semibold text-sm">OpenAI Diagnosis</h3>
                  <p className={`text-xs ${mutedText}`}>GPT-powered medical analysis</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${cardCls}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="p-4 text-center">
                  <div className="bg-[#0a7a77] p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Eye className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#68DEC4] rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-sm">TensorFlow Vision</h3>
                  <p className={`text-xs ${mutedText}`}>Advanced image analysis</p>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${cardCls}`}>
                <CardContent className="p-4 text-center">
                  <div className="bg-[#FD7963] p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Globe className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#68DEC4] rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-sm">Google Translate</h3>
                  <p className={`text-xs ${mutedText}`}>13+ Kenyan languages</p>
                </CardContent>
              </Card>
            </div>

            {/* Chat */}
            <Card className={`h-[500px] flex flex-col ${cardCls}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#02595A]" />
                  {translatedTitle}
                  {isSpeaking && <Volume2 className="w-4 h-4 animate-pulse text-[#02595A]" />}
                  {aiStatus.medical === "processing" && <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "assistant" && (
                      <Avatar className={`w-8 h-8 ${BRAND_GRADIENT}`}>
                        <AvatarFallback className="text-white text-xs bg-transparent">
                          {message.isAI ? "🤖" : "AI"}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user"
                            ? `${BRAND_GRADIENT} text-white ml-auto`
                            : message.isError
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : darkMode
                                ? "bg-gray-700 text-gray-100"
                                : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.image && (
                          <img
                            src={message.image || "/placeholder.svg"}
                            alt="Uploaded"
                            className="max-w-full h-32 object-cover rounded mb-2"
                          />
                        )}
                        {typeof message.content === "object" && message.content.steps ? (
                          <FirstAidInstructions data={message.content} darkMode={darkMode} />
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}

                        <div className="flex gap-2 mt-2 flex-wrap">
                          {message.isVoice && (
                            <Badge variant="secondary" className="text-xs">
                              <Mic className="w-3 h-3 mr-1" />
                              Voice Message
                            </Badge>
                          )}
                          {message.isAI && (
                            <Badge variant="outline" className="text-xs">
                              <Bot className="w-3 h-3 mr-1" />
                              AI Powered
                            </Badge>
                          )}
                          {message.confidence && (
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(message.confidence * 100)}% Confidence
                            </Badge>
                          )}
                          {message.urgencyLevel === "high" && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              High Urgency
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className={`text-xs mt-1 px-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>

                    {message.type === "user" && (
                      <Avatar className="w-8 h-8 bg-[#FD7963]">
                        <AvatarFallback className="text-white text-xs bg-transparent">You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className={`w-8 h-8 ${BRAND_GRADIENT}`}>
                      <AvatarFallback className="text-white text-xs bg-transparent">🤖</AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg p-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{t.analyzing}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <Separator />

              {/* Input area */}
              <div className="p-4">
                {uploadedImage && (
                  <div className="mb-3 relative inline-block">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => setUploadedImage(null)}
                    >
                      ×
                    </Button>
                    <Badge className="absolute bottom-0 left-0 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      AI Ready
                    </Badge>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.placeholder}
                    className="flex-1"
                    disabled={isLoading}
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    title="AI Image Analysis"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={startVoiceRecognition}
                    disabled={isLoading || isListening}
                    className={isListening ? "animate-pulse bg-red-500 text-white" : ""}
                    title="AI Voice Recognition"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading || (!input.trim() && !uploadedImage)}
                    className={`${BRAND_GRADIENT} ${BRAND_GRADIENT_HOVER} text-white`}
                    title="Send to AI"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </Card>
          </TabsContent>

          {/* ---------------- VITALS TAB ---------------- */}
          <TabsContent value="vitals" className="space-y-6">
            <DemoNotice darkMode={darkMode}>
              <strong>Demo data:</strong> these numbers are simulated and are not real measurements. Do not use them to
              make health decisions.
            </DemoNotice>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className={cardCls}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#FD7963] p-3 rounded-full relative">
                      <Activity className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#68DEC4] rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <p className={`text-sm ${mutedText}`}>Heart Rate (demo)</p>
                      <p className="text-2xl font-bold">{vitalSigns.heartRate} BPM</p>
                    </div>
                  </div>
                  <Progress value={(vitalSigns.heartRate / 120) * 100} className="mt-3" />
                  <p className="text-xs text-[#0a7a77] mt-1">Normal range</p>
                </CardContent>
              </Card>

              <Card className={cardCls}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#02595A] p-3 rounded-full relative">
                      <Thermometer className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#68DEC4] rounded-full"></div>
                    </div>
                    <div>
                      <p className={`text-sm ${mutedText}`}>Temperature (demo)</p>
                      <p className="text-2xl font-bold">{vitalSigns.temperature}°C</p>
                    </div>
                  </div>
                  <Progress value={((vitalSigns.temperature - 35) / 5) * 100} className="mt-3" />
                  <p className="text-xs text-[#0a7a77] mt-1">Optimal</p>
                </CardContent>
              </Card>

              <Card className={cardCls}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0a7a77] p-3 rounded-full relative">
                      <Activity className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#68DEC4] rounded-full"></div>
                    </div>
                    <div>
                      <p className={`text-sm ${mutedText}`}>Oxygen Level (demo)</p>
                      <p className="text-2xl font-bold">{vitalSigns.oxygenLevel}%</p>
                    </div>
                  </div>
                  <Progress value={vitalSigns.oxygenLevel} className="mt-3" />
                  <p className="text-xs text-[#0a7a77] mt-1">Excellent</p>
                </CardContent>
              </Card>

              <Card className={cardCls}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#3bb9a0] p-3 rounded-full relative">
                      <Stethoscope className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#68DEC4] rounded-full"></div>
                    </div>
                    <div>
                      <p className={`text-sm ${mutedText}`}>Blood Pressure (demo)</p>
                      <p className="text-2xl font-bold">{vitalSigns.bloodPressure}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-[#0a7a77]">Normal range</div>
                </CardContent>
              </Card>
            </div>

            {/* AI Health Analysis Results */}
            {aiHealthAnalysis && (
              <Card className={cardCls}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#02595A]" />
                    AI Health Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-[#FD7963]/10 to-orange-500/10">
                      <h4 className="font-semibold mb-2">AI Stress Analysis</h4>
                      <Progress value={aiHealthAnalysis.stressLevel} className="mb-2" />
                      <p className="text-sm">
                        {aiHealthAnalysis.stressLevel}% - AI Assessment:{" "}
                        {aiHealthAnalysis.stressLevel > 70
                          ? "High"
                          : aiHealthAnalysis.stressLevel > 40
                            ? "Moderate"
                            : "Low"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-[#FD7963]/10">
                      <h4 className="font-semibold mb-2">AI Pain Detection</h4>
                      <Progress value={aiHealthAnalysis.painLevel} className="mb-2" />
                      <p className="text-sm">
                        {aiHealthAnalysis.painLevel}% - AI Assessment:{" "}
                        {aiHealthAnalysis.painLevel > 70
                          ? "Severe"
                          : aiHealthAnalysis.painLevel > 40
                            ? "Moderate"
                            : "Minimal"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-[#68DEC4]/20 to-[#02595A]/10">
                      <h4 className="font-semibold mb-2">AI Wellness Score</h4>
                      <Progress value={aiHealthAnalysis.overallWellness} className="mb-2" />
                      <p className="text-sm">
                        {aiHealthAnalysis.overallWellness}/100 - AI Assessment:{" "}
                        {aiHealthAnalysis.overallWellness > 80
                          ? "Excellent"
                          : aiHealthAnalysis.overallWellness > 60
                            ? "Good"
                            : "Needs Attention"}
                      </p>
                    </div>
                  </div>

                  {aiHealthAnalysis.keyFindings && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">AI Key Findings:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {aiHealthAnalysis.keyFindings.map((finding, index) => (
                          <li key={index} className="text-sm">
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#02595A]" />
                  AI Health Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className={darkMode ? "bg-[#02595A]/20 border-[#0a7a77]" : "bg-[#effaf7] border-[#68DEC4]"}>
                    <Bot className="h-4 w-4 text-[#02595A]" />
                    <AlertDescription className={darkMode ? "text-[#68DEC4]" : "text-[#02595A]"}>
                      Sample insight (demo): these cards show how results will look once real sensors are connected.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-[#02595A]/10 to-[#68DEC4]/10">
                      <Timer className="w-8 h-8 mx-auto mb-2 text-[#02595A]" />
                      <p className="font-semibold">Last Scan</p>
                      <p className="text-sm text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-[#68DEC4]/10 to-[#02595A]/10">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-[#0a7a77]" />
                      <p className="font-semibold">Health Score</p>
                      <p className="text-sm text-gray-500">Excellent (95/100)</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-[#FD7963]/10 to-[#68DEC4]/10">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-[#FD7963]" />
                      <p className="font-semibold">Alerts</p>
                      <p className="text-sm text-gray-500">None active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- CLINICS TAB ---------------- */}
          <TabsContent value="clinics" className="space-y-6">
            {showClinics && nearbyClinics.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-[#02595A]" />
                  <h3 className="text-lg font-semibold">AI-Recommended Healthcare Facilities</h3>
                  <Badge variant="outline" className="text-xs">
                    Powered by Google Maps
                  </Badge>
                </div>

                {nearbyClinics.map((clinic) => (
                  <Card key={clinic.id} className={`hover:shadow-lg transition-all duration-300 ${cardCls}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex flex-wrap items-center gap-2">
                            {clinic.name}
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(clinic.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                              <span className="ml-1 text-sm text-gray-500">({clinic.rating})</span>
                            </div>
                          </h3>
                          <p className={`${mutedText} text-sm`}>{clinic.address}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <Badge variant={clinic.isOpen ? "default" : "secondary"} className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {clinic.isOpen ? "Open" : "Closed"}
                            </Badge>
                            <span className="text-sm text-gray-500">{clinic.type}</span>
                            {clinic.specializations && (
                              <Badge variant="outline" className="text-xs">
                                <Stethoscope className="w-3 h-3 mr-1" />
                                {clinic.specializations[0]}
                              </Badge>
                            )}
                          </div>

                          {clinic.aiRecommendation && (
                            <Alert
                              className={`mt-3 ${darkMode ? "bg-[#02595A]/20 border-[#0a7a77]" : "bg-[#effaf7] border-[#68DEC4]"}`}
                            >
                              <Bot className="h-4 w-4 text-[#02595A]" />
                              <AlertDescription className={`text-sm ${darkMode ? "text-[#68DEC4]" : "text-[#02595A]"}`}>
                                <strong>AI Recommendation:</strong> {clinic.aiRecommendation}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${darkMode ? "text-[#68DEC4]" : "text-[#02595A]"}`}>
                            {clinic.distance.toFixed(1)} km
                          </div>
                          <div className="text-xs text-gray-500">away</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${clinic.phone}`, "_self")}
                          className="flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const destination = clinic.coordinates
                              ? `${clinic.coordinates.lat},${clinic.coordinates.lng}`
                              : encodeURIComponent(clinic.address)
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, "_blank")
                          }}
                          className="flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" />
                          Directions
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => {
                            const shareData = {
                              title: clinic.name,
                              text: `Check out this clinic: ${clinic.name}\nAddress: ${clinic.address}\nRating: ${clinic.rating}\nType: ${clinic.type}`,
                              url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`,
                            }
                            if (navigator.share) {
                              navigator.share(shareData).catch(() => {})
                            } else {
                              const textToCopy = `${shareData.text}\n${shareData.url}`
                              navigator.clipboard.writeText(textToCopy)
                              alert("Clinic info copied to clipboard!")
                            }
                          }}
                        >
                          <Share2 className="w-3 h-3" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className={cardCls}>
                <CardContent className="p-8 text-center">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-[#02595A]" />
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Clinic Finder</h3>
                  <p className={`${mutedText} mb-4`}>
                    Allow location access to let our AI discover and recommend the best medical facilities near you
                  </p>
                  {location.error && <p className="text-sm text-red-600 mb-4">{location.error}</p>}
                  <Button
                    onClick={getCurrentLocation}
                    disabled={location.loading}
                    className={`mx-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      location.loading
                        ? "bg-gradient-to-r from-[#02595A]/50 to-[#68DEC4]/50 text-gray-100 cursor-not-allowed"
                        : `${BRAND_GRADIENT} ${BRAND_GRADIENT_HOVER} text-white`
                    }`}
                  >
                    {location.loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <MapPin className="w-4 h-4 mr-2" />
                    )}
                    {location.loading ? "AI Analyzing Location..." : "Find Clinics with AI"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ---------------- ACHIEVEMENTS TAB ---------------- */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-[#02595A]" />
              <h3 className="text-lg font-semibold">{t.achievements}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`${cardCls} ${achievement.unlocked ? "ring-2 ring-[#68DEC4]" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${achievement.unlocked ? "grayscale-0" : "grayscale"}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className={`text-sm ${mutedText}`}>{achievement.description}</p>
                        <div className="mt-2">
                          <Progress value={achievement.progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{achievement.progress}% Complete</p>
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-[#68DEC4] text-[#02595A]">
                          <Award className="w-3 h-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ---------------- EMERGENCY TAB (stays red on purpose) ---------------- */}
          <TabsContent value="emergency" className="space-y-6">
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t.emergencyContacts}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10"
                    >
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className={`text-sm ${mutedText}`}>{contact.relation}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => window.open(`tel:${contact.phone}`, "_self")}
                        className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={cardCls}>
              <CardHeader>
                <CardTitle>Quick Emergency Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="flex items-center justify-center gap-3 h-20 px-8 py-6 rounded-xl font-bold text-lg bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
                    onClick={() => window.open(`tel:${EMERGENCY_NUMBER}`, "_self")}
                  >
                    <Phone className="w-6 h-6 mr-2" />
                    Call {EMERGENCY_NUMBER}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex items-center justify-center gap-3 h-20 px-8 py-6 rounded-xl font-bold text-lg border-2 border-[#02595A] text-[#02595A] bg-gradient-to-r from-[#effaf7] to-white hover:from-[#68DEC4]/30 hover:to-[#effaf7] focus:outline-none focus:ring-2 focus:ring-[#68DEC4] transition-all duration-200"
                    onClick={shareLiveLocation}
                  >
                    <Share2 className="w-6 h-6 mr-2" />
                    Share Live Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- AI TECH TAB ---------------- */}
          <TabsContent value="futuristic" className="space-y-6">
            <DemoNotice darkMode={darkMode}>
              <strong>Experimental / demo features:</strong> the drone, gesture, biometric, predictions, devices and
              community network on this tab are samples. They are not connected to real services yet.
            </DemoNotice>

            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#02595A]" />
                  TensorFlow Real-time Health Analysis
                  {aiStatus.facial === "processing" && <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LEFT: scan button stretched to the full height of the results column */}
                  <div className="flex flex-col">
                    <Button
                      onClick={startFacialAnalysis}
                      disabled={isAnalyzingFace}
                      className={`w-full flex-1 min-h-[160px] flex flex-col items-center justify-center gap-3 text-base ${BRAND_GRADIENT} ${BRAND_GRADIENT_HOVER} text-white`}
                    >
                      {isAnalyzingFace ? (
                        <>
                          <Loader2 className="w-10 h-10 animate-spin" />
                          AI Analyzing Face...
                        </>
                      ) : (
                        <>
                          <Eye className="w-10 h-10" />
                          Scan Face for AI Analysis
                        </>
                      )}
                    </Button>
                  </div>

                  {/* RIGHT: results */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-[#FD7963]/10 to-orange-500/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        AI Stress Level
                      </h4>
                      <Progress value={stressLevel} className="mb-2" />
                      <p className="text-sm">
                        {stressLevel}% - AI Assessment: {stressLevel > 70 ? "High" : stressLevel > 40 ? "Moderate" : "Low"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-[#FD7963]/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        AI Pain Detection
                      </h4>
                      <Progress value={painLevel} className="mb-2" />
                      <p className="text-sm">
                        {painLevel}% - AI Assessment: {painLevel > 70 ? "Severe" : painLevel > 40 ? "Moderate" : "Minimal"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-[#68DEC4]/20 to-[#02595A]/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        AI Wellness Score
                      </h4>
                      <Progress value={mentalHealthScore} className="mb-2" />
                      <p className="text-sm">
                        {mentalHealthScore}/100 - AI Assessment:{" "}
                        {mentalHealthScore > 80 ? "Excellent" : mentalHealthScore > 60 ? "Good" : "Needs Attention"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BELOW: gesture + biometric, directly under the stretched scan button */}
                <div className="mt-6 space-y-4 md:w-[calc(50%-0.75rem)]">
                  <Button
                    onClick={enableGestureControl}
                    variant={gestureControl ? "default" : "outline"}
                    className="w-full"
                  >
                    {gestureControl ? "Disable Gesture Control" : "Enable Gesture Control"}
                  </Button>

                  <Button
                    onClick={authenticateBiometric}
                    variant={biometricAuth ? "default" : "outline"}
                    className="w-full"
                  >
                    {biometricAuth ? "Authenticated" : "Authenticate with Biometric"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={`${cardCls} ${droneResponse ? "ring-2 ring-red-500 animate-bounce" : ""}`}>
              <CardContent className="p-6 text-center">
                <div className="bg-red-500 p-3 rounded-full w-fit mx-auto mb-3 relative">
                  <Plane className="w-6 h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#68DEC4] rounded-full"></div>
                </div>
                <h3 className="font-semibold mb-2">Drone Response (demo)</h3>
                <Button size="sm" onClick={requestDroneResponse} variant="destructive" disabled={droneResponse}>
                  {droneResponse ? "Requested" : "Request Drone"}
                </Button>
              </CardContent>
            </Card>

            {/* Health predictions */}
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Snowflake className="w-5 h-5 text-[#02595A]" />
                  Health Predictions (demo)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthPredictions.map((prediction, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          {prediction.condition}
                        </h4>
                        <Badge
                          variant={
                            prediction.probability > 50
                              ? "destructive"
                              : prediction.probability > 25
                                ? "default"
                                : "secondary"
                          }
                        >
                          {prediction.probability}% Risk
                        </Badge>
                      </div>
                      <p className={`text-sm mb-2 ${mutedText}`}>{prediction.timeframe}</p>
                      <p className={`text-sm font-medium ${darkMode ? "text-[#68DEC4]" : "text-[#02595A]"}`}>
                        🤖 Suggestion: {prediction.prevention}
                      </p>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={startAIHealthCoach}
                  className={`w-full mt-4 ${BRAND_GRADIENT} ${BRAND_GRADIENT_HOVER} text-white`}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Activate AI Health Coach
                </Button>
              </CardContent>
            </Card>

            {/* Community network */}
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#02595A]" />
                  Community Emergency Network (demo)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communityHelpers.map((helper, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#68DEC4]/15 to-[#02595A]/10"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${helper.available ? "bg-[#68DEC4]" : "bg-[#FD7963]"}`}
                        ></div>
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            {helper.name}
                          </h4>
                          <p className={`text-sm ${mutedText}`}>
                            {helper.specialty} • {helper.distance}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={!helper.available}
                        variant={helper.available ? "default" : "secondary"}
                      >
                        {helper.available ? "Connect" : "Busy"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Smart devices */}
            <Card className={cardCls}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#02595A]" />
                  Smart Device Integration (demo)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {smartDevices.map((device, index) => (
                    <div
                      key={index}
                      className={`mb-4 p-2 rounded ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          {device.name}
                        </h4>
                        <div
                          className={`w-3 h-3 rounded-full ${device.connected ? "bg-[#68DEC4]" : "bg-[#FD7963]"}`}
                        ></div>
                      </div>
                      <p className={`text-sm mb-1 ${mutedText}`}>Battery: {device.battery}%</p>
                      <p className="text-xs text-gray-500">Last sync: {device.lastSync}</p>
                      <Progress value={device.battery} className="mt-2" />
                    </div>
                  ))}
                </div>
                <Button onClick={analyzeEnvironment} className="w-full mt-4" variant="outline">
                  <Thermometer className="w-4 h-4 mr-2" />
                  Analyze Environment
                </Button>
              </CardContent>
            </Card>

            {aiCoachMessages.length > 0 && (
              <Card className={cardCls}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#FD7963]" />
                    AI Coach Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {aiCoachMessages.map((message, index) => (
                      <Alert
                        key={index}
                        className={darkMode ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"}
                      >
                        <Bot className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className={darkMode ? "text-yellow-300" : "text-yellow-800"}>
                          {message}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {environmentalAlerts.length > 0 && (
              <Card className={cardCls}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Environmental Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {environmentalAlerts.map((alertText, index) => (
                      <Alert
                        key={index}
                        className={darkMode ? "bg-orange-900/20 border-orange-700" : "bg-orange-50 border-orange-200"}
                      >
                        <Bot className="h-4 w-4 text-orange-600" />
                        <AlertDescription className={darkMode ? "text-orange-300" : "text-orange-800"}>
                          {alertText}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App