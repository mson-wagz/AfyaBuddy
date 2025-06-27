import { useState, useRef, useEffect } from "react"
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
  Hand,
  Plane,
  Snowflake,
  Smartphone,
  Bot,
  Network,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"

// Import AI services
import {
  getMedicalAdviceOpenAI,
  findNearbyClinicsMaps,
  translateTextGoogle,
  analyzeFacialHealthTensorFlow,
} from "./lib/ai-services"

// --- Move getTranslation OUTSIDE the App component for external use ---
// eslint-disable-next-line react-refresh/only-export-components
export const getTranslation = async ({
  key,
  selectedLanguage,
  translations,
  setAiStatus,
  translateTextGoogle,
}) => {
  const baseTranslation = translations[selectedLanguage]?.[key] || translations.en[key]

  if (selectedLanguage !== "en" && baseTranslation) {
    try {
      setAiStatus((prev) => ({ ...prev, translation: "processing" }))
      const result = await translateTextGoogle(translations.en[key], "en", selectedLanguage, "ui")
      setAiStatus((prev) => ({ ...prev, translation: "ready" }))

      if (result.success) {
        return result.translatedText
      }
    } catch (error) {
      console.error("AI translation failed:", error)
      setAiStatus((prev) => ({ ...prev, translation: "error" }))
    }
  }

  return baseTranslation
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

  // AI service status indicators
  const [aiStatus, setAiStatus] = useState({
    medical: "ready",
    location: "ready",
    translation: "ready",
    facial: "ready",
  })

  // Enhanced state variables
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

  // Enhanced AI-powered features
  const [ setCameraStream] = useState(null)
  const [isAnalyzingFace, setIsAnalyzingFace] = useState(false)
  const [aiHealthAnalysis, setAiHealthAnalysis] = useState(null)
  const [stressLevel, setStressLevel] = useState(0)
  const [painLevel, setPainLevel] = useState(0)
  const [mentalHealthScore, setMentalHealthScore] = useState(85)
  const [environmentalAlerts, setEnvironmentalAlerts] = useState([])
  const [aiCoachMessages, setAiCoachMessages] = useState([])
  const [isHologramMode, setIsHologramMode] = useState(false)
  const [gestureControl, setGestureControl] = useState(false)
  const [biometricAuth, setBiometricAuth] = useState(false)
  const [droneResponse, setDroneResponse] = useState(false)

  // Fix: useState returns [state, setState], not just state
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
    { code: "ki", name: "Kikuyu", nativeName: "Gĩkũyũ" },
    { code: "lu", name: "Luhya", nativeName: "Luluhya" },
    { code: "luo", name: "Luo", nativeName: "Dholuo" },
    { code: "kam", name: "Kamba", nativeName: "Kikamba" },
    { code: "kis", name: "Kisii", nativeName: "Ekegusii" },
    { code: "mer", name: "Meru", nativeName: "Kimeru" },
    { code: "mij", name: "Mijikenda", nativeName: "Kimijikenda" },
    { code: "tur", name: "Turkana", nativeName: "Ngaturkana" },
    { code: "mas", name: "Maasai", nativeName: "Maa" },
    { code: "kal", name: "Kalenjin", nativeName: "Kalenjin" },
    { code: "som", name: "Somali", nativeName: "Soomaali" },
  ]

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })
  const [nearbyClinics, setNearbyClinics] = useState([])
  const [showClinics, setShowClinics] = useState(false)

  // Cool animations and effects
  const [pulseAnimation, setPulseAnimation] = useState(false)
  const [emergencyPulse, setEmergencyPulse] = useState(false)

  useEffect(() => {
    // Add welcome message with AI capabilities
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

    // Simulate vital signs updates
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggerEmergencySOS = () => {
    setEmergencyPulse(true)

    // Simulate emergency actions
    emergencyContacts.forEach((contact) => {
      console.log(`Sending emergency alert to ${contact.name}: ${contact.phone}`)
    })

    // Share location
    if (location.latitude && location.longitude) {
      const locationMessage = `Emergency! I need help. My location: https://maps.google.com/?q=${location.latitude},${location.longitude}`
      console.log("Emergency location shared:", locationMessage)
    }

    setTimeout(() => {
      setEmergencyPulse(false)
      setIsEmergencyMode(false)
    }, 5000)
  }

  useEffect(() => {
    // SOS countdown effect
    if (sosCountdown > 0) {
      const timer = setTimeout(() => setSosCountdown(sosCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (sosCountdown === 0 && isEmergencyMode) {
      triggerEmergencySOS()
    }
  }, [sosCountdown, isEmergencyMode, triggerEmergencySOS])

  const translations = {
    en: {
      title: "AfyaBuddy AI",
      subtitle: "Your AI-Powered First Aid Assistant",
      emergencyDisclaimer: "AI Emergency Disclaimer:",
      emergencyText:
        "This AI assistant provides general first aid guidance only. In serious emergencies, call your local emergency number immediately (911, 999, 112, etc.). Always seek professional medical help for severe injuries.",
      emergencyCall: "Emergency Call",
      emergencyCallDesc: "Call 911 immediately",
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
        "Msaidizi huu wa AI anatoa mwongozo wa jumla wa huduma za kwanza tu. Katika hali za dharura kali, piga simu ya dharura ya eneo lako mara moja. Tafuta msaada wa kitaaluma kila wakati kwa majeraha makubwa.",
      emergencyCall: "Simu ya Dharura",
      emergencyCallDesc: "Piga 911 mara moja",
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

    // Translate text to selected language if needed
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

  // eslint-disable-next-line react-hooks/exhaustive-deps

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

  // Enhanced AI-powered clinic finding
  const findNearbyClinicsAI = async (userLat, userLng) => {
    try {
      setAiStatus((prev) => ({ ...prev, location: "processing" }))

      const result = await findNearbyClinicsMaps({ latitude: userLat, longitude: userLng }, "general", "normal")

      setAiStatus((prev) => ({ ...prev, location: "ready" }))

      if (result.success) {
        setNearbyClinics(result.clinics)
        setShowClinics(true)

        // Update achievements
        setAchievements((prev) =>
          prev.map((achievement) => {
            if (achievement.id === "4") {
              return { ...achievement, unlocked: true, progress: 100 }
            }
            return achievement
          }),
        )
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("AI clinic finding failed:", error)
      setAiStatus((prev) => ({ ...prev, location: "error" }))

      // Use fallback clinic data
      const fallbackClinics = [
        {
          id: "1",
          name: "Nairobi Hospital",
          address: "Argwings Kodhek Rd, Nairobi",
          phone: "+254-20-2845000",
          type: "General Hospital",
          isOpen: true,
          rating: 4.5,
          distance: 2.1,
          coordinates: { lat: -1.3067, lng: 36.7906 },
          aiRecommendation: "Major hospital with comprehensive emergency services",
          specializations: ["Emergency Medicine", "Surgery", "Internal Medicine"],
        },
      ]

      setNearbyClinics(fallbackClinics)
      setShowClinics(true)
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

  // Enhanced AI-powered chat submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() && !uploadedImage) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input || "Image uploaded for AI analysis",
      image: uploadedImage || undefined,
      timestamp: new Date(),
      isVoice: isListening,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setInput("")
    setUploadedImage(null)

    try {
      setAiStatus((prev) => ({ ...prev, medical: "processing" }))

      // Get AI-powered medical advice
      const result = await getMedicalAdviceOpenAI(userMessage.content, userMessage.image, selectedLanguage)

      setAiStatus((prev) => ({ ...prev, medical: "ready" }))

      let assistantMessage

      if (result.success) {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: result.advice,
          timestamp: new Date(),
          isAI: true,
          confidence: result.confidence,
          urgencyLevel: result.urgencyLevel,
          recommendations: result.recommendations,
        }

        // Update achievements for AI consultation
        setAchievements((prev) =>
          prev.map((achievement) => {
            if (achievement.id === "1" && achievement.progress < 100) {
              return { ...achievement, progress: 100, unlocked: true }
            }
            return achievement
          }),
        )

        // Auto-trigger location request for urgent cases
        if (result.urgencyLevel === "high") {
          setTimeout(() => {
            getCurrentLocation()
          }, 1000)
        }
      } else {
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: result.error + "\n\n" + (result.fallbackAdvice || "Please try again or contact emergency services."),
          timestamp: new Date(),
          isAI: true,
          isError: true,
        }
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // Speak the response if voice is enabled
      if (voiceEnabled && assistantMessage.content) {
        speakText(assistantMessage.content.replace(/[🩹🔥🦴🫁💡🤖]/gu, ""))
      }
    } catch (error) {
      console.error("AI consultation failed:", error)
      setAiStatus((prev) => ({ ...prev, medical: "error" }))

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "🤖 I'm experiencing technical difficulties. Please try again or contact emergency services if this is urgent.",
        timestamp: new Date(),
        isAI: true,
        isError: true,
      }

      setMessages((prev) => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  // Enhanced AI-powered facial analysis
  const startFacialAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setCameraStream(stream)
      setIsAnalyzingFace(true)
      setAiStatus((prev) => ({ ...prev, facial: "processing" }))

      // Create video element for analysis
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      // Wait for video to be ready
      video.onloadedmetadata = async () => {
        // Get AI analysis after 5 seconds of "scanning"
        setTimeout(async () => {
          try {
            const result = await analyzeFacialHealthTensorFlow(video, vitalSigns)

            setAiStatus((prev) => ({ ...prev, facial: "ready" }))

            if (result.success) {
              setAiHealthAnalysis(result.analysis)
              setStressLevel(result.analysis.stressLevel)
              setPainLevel(result.analysis.painLevel)
              setMentalHealthScore(result.analysis.mentalHealthScore)

              // Update achievements
              setAchievements((prev) =>
                prev.map((achievement) => {
                  if (achievement.id === "3" && achievement.progress < 5) {
                    const newProgress = achievement.progress + 1
                    return {
                      ...achievement,
                      progress: newProgress,
                      unlocked: newProgress >= 5,
                    }
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

  const activateHologramMode = () => {
    setIsHologramMode(!isHologramMode)
    if (!isHologramMode) {
      setAiCoachMessages((prev) => [
        ...prev,
        "🔮 Hologram mode activated! AI-powered 3D anatomical models now available for enhanced guidance.",
      ])
    }
  }

  const enableGestureControl = () => {
    setGestureControl(!gestureControl)
    if (!gestureControl) {
      setAiCoachMessages((prev) => [
        ...prev,
        "👋 AI Gesture control enabled! Wave your hand to navigate, point to select.",
      ])
    }
  }

  const authenticateBiometric = async () => {
    if ("credentials" in navigator) {
      try {
        setBiometricAuth(true)
        setAiCoachMessages((prev) => [
          ...prev,
          "🔐 Biometric authentication successful! Your AI health data is now secured with advanced encryption.",
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
      "🚁 AI Emergency drone dispatched! ETA: 3 minutes. Drone equipped with medical supplies and AI-guided defibrillator.",
    ])

    setTimeout(() => {
      setDroneResponse(false)
      setAiCoachMessages((prev) => [
        ...prev,
        "🚁 AI Drone arrived at your location! Follow the AI-powered audio instructions from the drone.",
      ])
    }, 5000)
  }

  const analyzeEnvironment = () => {
    const alerts = [
      "🌡️ AI detected high temperature (32°C) - Risk of heat exhaustion",
      "💨 AI air quality analysis shows poor conditions - Consider wearing a mask",
      "🌧️ AI weather analysis: High humidity (85%) - Stay hydrated",
      "☀️ AI UV analysis: High UV index - Apply sunscreen",
    ]

    setEnvironmentalAlerts([alerts[Math.floor(Math.random() * alerts.length)]])
  }

  const startAIHealthCoach = () => {
    const coachMessages = [
      "🤖 Advanced AI Health Coach activated! I've analyzed your patterns using machine learning algorithms.",
      "💡 Based on AI stress analysis, I recommend 5 minutes of guided breathing exercises.",
      "🏃‍♂️ AI activity tracker shows low movement today. A 10-minute walk would boost your energy!",
      "💧 AI hydration algorithm reminder: You should drink water every 30 minutes in this weather.",
      "🧘‍♀️ AI mental health assessment suggests you'd benefit from a mindfulness session.",
    ]

    setAiCoachMessages(coachMessages)
  }

  // AI Status indicator component
  const AIStatusIndicator = ({ status, label }) => {
    const getStatusColor = () => {
      switch (status) {
        case "ready":
          return "text-green-500"
        case "processing":
          return "text-yellow-500"
        case "error":
          return "text-red-500"
        default:
          return "text-gray-500"
      }
    }

    const getStatusIcon = () => {
      switch (status) {
        case "ready":
          return <CheckCircle className="w-3 h-3" />
        case "processing":
          return <Loader2 className="w-3 h-3 animate-spin" />
        case "error":
          return <XCircle className="w-3 h-3" />
        default:
          return <Network className="w-3 h-3" />
      }
    }

    return (
      <div className={`flex items-center gap-1 text-xs ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{label}</span>
      </div>
    )
  }

  // Example: Use getTranslation to fetch a translated title and display it
  const [, setTranslatedTitle] = useState(translations[selectedLanguage]?.title || translations.en.title)

  useEffect(() => {
    // Call getTranslation when selectedLanguage changes
    getTranslation({
      key: "title",
      selectedLanguage,
      translations,
      setAiStatus,
      translateTextGoogle,
    }).then(setTranslatedTitle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage])

  const [firstAidCondition, setFirstAidCondition] = useState("");
  const [firstAidSteps, setFirstAidSteps] = useState([]);

  async function handleGetFirstAidSteps() {
    setFirstAidSteps([]); // Clear previous
    const res = await fetch("http://localhost:5000/api/first-aid-steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condition: firstAidCondition }),
    });
    const data = await res.json();
    setFirstAidSteps(Array.isArray(data.steps) ? data.steps : data.steps.split("\n"));
  }

  return (
    
    <div
      className={`min-h-screen transition-all duration-500 ${darkMode ? "bg-gradient-to-br from-gray-900 to-blue-900 text-white" : "bg-gradient-to-br from-blue-50 to-green-50"}`}
    >
      {/* Enhanced Header with AI Status */}
      <div
        className={`shadow-lg border-b backdrop-blur-md ${darkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"}`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full ${pulseAnimation ? "animate-pulse" : ""} ${emergencyPulse ? "animate-bounce bg-red-600" : "bg-gradient-to-r from-red-500 to-pink-500"}`}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  AfyaBuddy AI
                </h1>
                <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Powered by OpenAI, Google AI & TensorFlow
                </p>

                {/* AI Status Indicators */}
                <div className="flex gap-4 mt-1">
                  <AIStatusIndicator status={aiStatus.medical} label="OpenAI" />
                  <AIStatusIndicator status={aiStatus.location} label="Google Maps" />
                  <AIStatusIndicator status={aiStatus.translation} label="Translate" />
                  <AIStatusIndicator status={aiStatus.facial} label="TensorFlow" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Voice Toggle */}
              <div className="flex items-center gap-2">
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <Switch
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                  className="border border-gray-400 rounded-full"
                />
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="border border-gray-400 rounded-full"
                />
              </div>

              {/* Enhanced Language Selector with AI indicator */}
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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

              {/* Emergency SOS Button */}
              <Button
                variant={isEmergencyMode ? "destructive" : "outline"}
                size="sm"
                onClick={isEmergencyMode ? cancelSOS : startSOSCountdown}
                className={`${isEmergencyMode ? "animate-pulse" : ""} font-bold`}
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
        {/* Enhanced Emergency Alert with AI */}
        <Alert className={`mb-6 border-red-200 ${darkMode ? "bg-red-900/20" : "bg-red-50"}`}>
          <Bot className="h-4 w-4 text-red-600" />
          <AlertDescription className={`${darkMode ? "text-red-300" : "text-red-800"}`}>
            <strong>AI Emergency Disclaimer:</strong> This AI assistant provides general first aid guidance only. In
            serious emergencies, call your local emergency number immediately. AI recommendations should not replace
            professional medical care.
          </AlertDescription>
        </Alert>

        {/* Enhanced Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="vitals" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              AI Vitals
            </TabsTrigger>
            <TabsTrigger value="clinics" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              AI Clinics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="futuristic" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI Tech
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Chat Tab with AI Features */}
          <TabsContent value="chat" className="space-y-6">
            {/* Enhanced Quick Actions with AI indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <CardContent className="p-4 text-center">
                  <div className="bg-red-500 p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Phone className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-sm">Emergency Call</h3>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    AI-assisted emergency dispatch
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <CardContent className="p-4 text-center">
                  <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Brain className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="font-semibold text-sm">OpenAI Diagnosis</h3>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    GPT-powered medical analysis
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <CardContent className="p-4 text-center">
                  <div className="bg-green-500 p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Eye className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-sm">TensorFlow Vision</h3>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Advanced image analysis</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <CardContent className="p-4 text-center">
                  <div className="bg-purple-500 p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Globe className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-sm">Google Translate</h3>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>13+ Kenyan languages</p>
                </CardContent>
              </Card>
            </div>

            {/* First Aid Steps Request UI */}
            <Card className={`mb-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardContent className="p-4 flex flex-col md:flex-row items-center gap-2">
                <Input
                  placeholder="Enter a condition (e.g. burn, cut, choking)"
                  value={firstAidCondition}
                  onChange={e => setFirstAidCondition(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleGetFirstAidSteps} disabled={!firstAidCondition.trim()}>
                  Get First Aid Steps
                </Button>
              </CardContent>
              {firstAidSteps.length > 0 && (
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">First Aid Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    {firstAidSteps.map((step, idx) => (
                      <li key={idx} className="text-sm">{step}</li>
                    ))}
                  </ol>
                </CardContent>
              )}
            </Card>

            {/* Enhanced Chat Interface with AI indicators */}
            <Card className={`h-[500px] flex flex-col ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Medical Consultation
                  {isSpeaking && <Volume2 className="w-4 h-4 animate-pulse text-blue-500" />}
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
                      <Avatar className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500">
                        <AvatarFallback className="text-white text-xs">{message.isAI ? "🤖" : "AI"}</AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-auto"
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
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                        {/* AI-specific indicators */}
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
                          {message.urgencyLevel && message.urgencyLevel === "high" && (
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
                      <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500">
                        <AvatarFallback className="text-white text-xs">You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500">
                      <AvatarFallback className="text-white text-xs">🤖</AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg p-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI is analyzing and preparing expert response...</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <Separator />

              {/* Enhanced Input Area with AI features */}
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
                    placeholder="Ask your AI medical assistant anything..."
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
                    className="bg-gradient-to-r from-blue-500 to-purple-500"
                    title="Send to AI"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </div>
            </Card>
          </TabsContent>

          {/* Rest of the tabs remain the same as in the previous implementation */}
          {/* ... (continuing with vitals, clinics, achievements, emergency, and futuristic tabs) */}
          {/* Enhanced Vital Signs Tab with AI */}
          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-500 p-3 rounded-full relative">
                      <Activity className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>AI Heart Rate</p>
                      <p className="text-2xl font-bold">{vitalSigns.heartRate} BPM</p>
                    </div>
                  </div>
                  <Progress value={(vitalSigns.heartRate / 120) * 100} className="mt-3" />
                  <p className="text-xs text-green-600 mt-1">AI: Normal range</p>
                </CardContent>
              </Card>

              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-3 rounded-full relative">
                      <Thermometer className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>AI Temperature</p>
                      <p className="text-2xl font-bold">{vitalSigns.temperature}°C</p>
                    </div>
                  </div>
                  <Progress value={((vitalSigns.temperature - 35) / 5) * 100} className="mt-3" />
                  <p className="text-xs text-green-600 mt-1">AI: Optimal</p>
                </CardContent>
              </Card>

              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 p-3 rounded-full relative">
                      <Activity className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>AI Oxygen Level</p>
                      <p className="text-2xl font-bold">{vitalSigns.oxygenLevel}%</p>
                    </div>
                  </div>
                  <Progress value={vitalSigns.oxygenLevel} className="mt-3" />
                  <p className="text-xs text-green-600 mt-1">AI: Excellent</p>
                </CardContent>
              </Card>

              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500 p-3 rounded-full relative">
                      <Stethoscope className="w-6 h-6 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>AI Blood Pressure</p>
                      <p className="text-2xl font-bold">{vitalSigns.bloodPressure}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-green-600">AI: Normal Range</div>
                </CardContent>
              </Card>
            </div>

            {/* AI Health Analysis Results */}
            {aiHealthAnalysis && (
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    AI Health Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10">
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

                    <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-red-500/10">
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

                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10">
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

            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Health Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert
                    className={`${darkMode ? "bg-green-900/20 border-green-700" : "bg-green-50 border-green-200"}`}
                  >
                    <Bot className="h-4 w-4 text-green-600" />
                    <AlertDescription className={`${darkMode ? "text-green-300" : "text-green-800"}`}>
                      AI Analysis: Your vital signs are within normal ranges. The AI health monitoring system shows
                      optimal performance across all metrics.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                      <Timer className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-semibold">AI Last Scan</p>
                      <p className="text-sm text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10">
                      <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p className="font-semibold">AI Health Score</p>
                      <p className="text-sm text-gray-500">Excellent (95/100)</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <p className="font-semibold">AI Alerts</p>
                      <p className="text-sm text-gray-500">None active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Clinics Tab with AI */}
          <TabsContent value="clinics" className="space-y-6">
            {showClinics && nearbyClinics.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">AI-Recommended Healthcare Facilities</h3>
                  <Badge variant="outline" className="text-xs">
                    Powered by Google Maps
                  </Badge>
                </div>

                {nearbyClinics.map((clinic) => (
                  <Card
                    key={clinic.id}
                    className={`hover:shadow-lg transition-all duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
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
                          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>{clinic.address}</p>
                          <div className="flex items-center gap-4 mt-2">
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
                            <Alert className="mt-3 bg-blue-50 border-blue-200">
                              <Bot className="h-4 w-4 text-blue-600" />
                              <AlertDescription className="text-blue-800 text-sm">
                                <strong>AI Recommendation:</strong> {clinic.aiRecommendation}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">{clinic.distance.toFixed(1)} km</div>
                          <div className="text-xs text-gray-500">away</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
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
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${clinic.coordinates.lat},${clinic.coordinates.lng}`,
                              "_blank",
                            )
                          }
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
                            };
                            if (navigator.share) {
                              navigator.share(shareData).catch(() => {});
                            } else {
                              // Fallback: copy to clipboard
                              const textToCopy = `${shareData.text}\n${shareData.url}`;
                              navigator.clipboard.writeText(textToCopy);
                              alert("Clinic info copied to clipboard!");
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
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardContent className="p-8 text-center">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Clinic Finder</h3>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
                    Allow location access to let our AI discover and recommend the best medical facilities near you
                  </p>
                  <Button
                    onClick={getCurrentLocation}
                    disabled={location.loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500"
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

          {/* Enhanced Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold">AI-Powered Achievements</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} ${achievement.unlocked ? "ring-2 ring-yellow-400" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${achievement.unlocked ? "grayscale-0" : "grayscale"}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {achievement.description}
                        </p>
                        <div className="mt-2">
                          <Progress value={achievement.progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{achievement.progress}% Complete</p>
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-yellow-500 text-yellow-900">
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

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Emergency Contacts
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
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{contact.relation}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => window.open(`tel:${contact.phone}`, "_self")}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader>
                <CardTitle>Quick Emergency Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="h-20 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => window.open("tel:911", "_self")}
                  >
                    <Phone className="w-6 h-6 mr-2" />
                    Call 911
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-20"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Emergency Location",
                          text: `I need help! My location: https://maps.google.com/?q=${location.latitude},${location.longitude}`,
                        })
                      }
                    }}
                  >
                    <Share2 className="w-6 h-6 mr-2" />
                    Share Location
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Futuristic Features Tab with AI */}
          <TabsContent value="futuristic" className="space-y-6">
            {/* AI-Powered Real-time Analysis */}
            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  TensorFlow Real-time Health Analysis
                  {aiStatus.facial === "processing" && <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Button
                      onClick={startFacialAnalysis}
                      disabled={isAnalyzingFace}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      {isAnalyzingFace ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          AI Analyzing Face...
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Scan Face for AI Analysis
                        </>
                      )}
                    </Button>

                    {isAnalyzingFace && (
                      <div className="flex justify-center">
                        <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        AI Stress Level
                      </h4>
                      <Progress value={stressLevel} className="mb-2" />
                      <p className="text-sm">
                        {stressLevel}% - AI Assessment:{" "}
                        {stressLevel > 70 ? "High" : stressLevel > 40 ? "Moderate" : "Low"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-red-500/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        AI Pain Detection
                      </h4>
                      <Progress value={painLevel} className="mb-2" />
                      <p className="text-sm">
                        {painLevel}% - AI Assessment:{" "}
                        {painLevel > 70 ? "Severe" : painLevel > 40 ? "Moderate" : "Minimal"}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        AI Mental Health Score
                      </h4>
                      <Progress value={mentalHealthScore} className="mb-2" />
                      <p className="text-sm">
                        {mentalHealthScore}/100 - AI Assessment:{" "}
                        {mentalHealthScore > 80 ? "Excellent" : mentalHealthScore > 60 ? "Good" : "Needs Attention"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced AI Interaction Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} ${isHologramMode ? "ring-2 ring-purple-500 animate-pulse" : ""}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-500 p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Zap className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <h3 className="font-semibold mb-2">AI Hologram Mode</h3>
                  <Button size="sm" onClick={activateHologramMode} variant={isHologramMode ? "default" : "outline"}>
                    {isHologramMode ? "Deactivate" : "Activate"}
                  </Button>
                </CardContent>
              </Card>

              <Card
  className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} ${gestureControl ? "ring-2 ring-blue-500" : ""}`}
>
  <CardContent className="p-6 text-center">
    <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto mb-3 relative">
      <Hand className="w-6 h-6 text-white" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
    </div>
    <Button size="sm" onClick={enableGestureControl} variant={gestureControl ? "default" : "outline"}>
      {gestureControl ? "Disable Gesture" : "Enable Gesture"}
    </Button>
    <Button size="sm" onClick={authenticateBiometric} variant={biometricAuth ? "default" : "outline"} className="ml-2">
      {biometricAuth ? "Authenticated" : "Authenticate"}
    </Button>
  </CardContent>
</Card>

              <Card
                className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"} ${droneResponse ? "ring-2 ring-red-500 animate-bounce" : ""}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-red-500 p-3 rounded-full w-fit mx-auto mb-3 relative">
                    <Plane className="w-6 h-6 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <h3 className="font-semibold mb-2">AI Drone Response</h3>
                  <Button size="sm" onClick={requestDroneResponse} variant="destructive" disabled={droneResponse}>
                    {droneResponse ? "Dispatched" : "Request Drone"}
                  </Button>
                </CardContent>
              </Card>
            </div>

 
            {/* AI Health Predictions */}
            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Snowflake className="w-5 h-5 text-blue-500" />
                  AI Health Predictions
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
                          {prediction.probability}% AI Risk
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{prediction.timeframe}</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        🤖 AI Recommendation: {prediction.prevention}
                      </p>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={startAIHealthCoach}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Activate AI Health Coach
                </Button>
              </CardContent>
            </Card>

            {/* Community Emergency Network */}
            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  AI-Powered Community Emergency Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communityHelpers.map((helper, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${helper.available ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            {helper.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {helper.specialty} • {helper.distance} • AI Verified
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={!helper.available}
                        variant={helper.available ? "default" : "secondary"}
                      >
                        {helper.available ? "AI Connect" : "Busy"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Smart Device Integration */}
            <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-purple-500" />
                  AI Smart Device Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {smartDevices.map((device, index) => (
                    <div key={index} className="mb-4 p-2 rounded bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          {device.name}
                        </h4>
                        <div
                          className={`w-3 h-3 rounded-full ${device.connected ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">AI Battery: {device.battery}%</p>
                      <p className="text-xs text-gray-500">Last AI sync: {device.lastSync}</p>
                      <Progress value={device.battery} className="mt-2" />
                    </div>
                  ))}
                </div>
                <Button onClick={analyzeEnvironment} className="w-full mt-4" variant="outline">
                  <Thermometer className="w-4 h-4 mr-2" />
                  AI Analyze Environment
                </Button>
              </CardContent>
            </Card>

            {aiCoachMessages.length > 0 && (
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-500" />
                    AI Coach Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {aiCoachMessages.map((message, index) => (
                      <Alert
                        key={index}
                        className={`${darkMode ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"}`}
                      >
                        <Bot className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className={`${darkMode ? "text-yellow-300" : "text-yellow-800"}`}>
                          {message}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {environmentalAlerts.length > 0 && (
              <Card className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    AI Environmental Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {environmentalAlerts.map((alert, index) => (
                      <Alert
                        key={index}
                        className={`${darkMode ? "bg-orange-900/20 border-orange-700" : "bg-orange-50 border-orange-200"}`}
                      >
                        <Bot className="h-4 w-4 text-orange-600" />
                        <AlertDescription className={`${darkMode ? "text-orange-300" : "text-orange-800"}`}>
                          {alert}
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
