// AI services with working mock implementations (no API calls needed)

// OpenAI integration for medical consultation (Mock Implementation)
export const getMedicalAdviceOpenAI = async (userQuery, userImage = null, language = "en") => {
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))
  
      // Generate medical advice based on query
      const advice = generateMedicalAdvice(userQuery, userImage, language)
  
      return {
        success: true,
        advice: advice.content,
        confidence: advice.confidence,
        urgencyLevel: assessUrgencyLevel(userQuery),
        recommendations: advice.recommendations,
      }
    } catch (error) {
      console.error("OpenAI medical advice error:", error)
      return {
        success: false,
        error: "Unable to process medical query. Please try again or contact emergency services.",
        fallbackAdvice: getFallbackMedicalAdvice(userQuery),
      }
    }
  }
  
  // Google Maps integration for clinic finding (Mock Implementation)
  export const findNearbyClinicsMaps = async (userLocation, medicalNeed = "general", urgency = "normal") => {
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))
  
      // Generate mock clinic data
      const mockClinics = generateMockClinics(userLocation, medicalNeed, urgency)
  
      return {
        success: true,
        clinics: mockClinics,
        recommendations: generateLocationRecommendations(urgency, medicalNeed),
      }
    } catch (error) {
      console.error("Google Places error:", error)
      return {
        success: false,
        error: "Unable to find clinics. Using fallback data.",
        clinics: getFallbackClinics(userLocation),
      }
    }
  }
  
  // Google Translate integration for multilingual support (Mock Implementation)
  export const translateTextGoogle = async (text, fromLanguage, toLanguage, context = "medical") => {
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 800))
  
      // Use fallback translation
      const translatedText = getFallbackTranslation(text, toLanguage)
  
      return {
        success: true,
        translatedText: translatedText,
        confidence: 0.95,
        culturalNotes: generateCulturalNotes(toLanguage, context),
      }
    } catch (error) {
      console.error("Google Translate error:", error)
      return {
        success: false,
        error: "Translation failed. Using fallback.",
        translatedText: getFallbackTranslation(text, toLanguage),
      }
    }
  }
  
  // TensorFlow.js integration for facial analysis (Mock Implementation)
  export const analyzeFacialHealthTensorFlow = async ( ) => {
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 3000))
  
      // Generate mock analysis results
      const analysisResults = {
        stressLevel: Math.floor(Math.random() * 100),
        painLevel: Math.floor(Math.random() * 100),
        fatigueLevel: Math.floor(Math.random() * 100),
        mentalHealthScore: Math.floor(Math.random() * 40) + 60,
        overallWellness: Math.floor(Math.random() * 30) + 70,
        keyFindings: [
          "Facial symmetry analysis completed",
          "Eye movement patterns analyzed",
          "Stress indicators detected in facial expressions",
          "Overall health indicators within normal range",
        ],
        confidence: 0.85,
      }
  
      return {
        success: true,
        analysis: analysisResults,
        recommendations: generateHealthRecommendations(analysisResults),
        confidence: analysisResults.confidence,
      }
    } catch (error) {
      console.error("TensorFlow facial analysis error:", error)
      return {
        success: false,
        error: "Facial analysis failed. Using basic assessment.",
        analysis: getBasicHealthAssessment(),
      }
    }
  }
  
  // Helper function to generate medical advice
  function generateMedicalAdvice(query) {
    const lowerQuery = query.toLowerCase()
  
    // Emergency responses
    if (lowerQuery.includes("bleeding") || lowerQuery.includes("blood")) {
      return {
        content: `🩸 **BLEEDING EMERGENCY RESPONSE**
  
  **IMMEDIATE ACTIONS:**
  1. **Call Emergency Services** - Dial 911/999/112 immediately for severe bleeding
  2. **Apply Direct Pressure** - Use clean cloth/gauze, press firmly on wound
  3. **Elevate the Area** - Raise injured area above heart level if possible
  4. **Do NOT Remove Objects** - If object is embedded, stabilize it, don't pull out
  
  **MONITOR FOR SHOCK:**
  - Pale, cool, clammy skin
  - Rapid weak pulse
  - Shallow breathing
  - Confusion or anxiety
  
  **WHEN TO SEEK IMMEDIATE HELP:**
  - Bleeding won't stop after 10 minutes of direct pressure
  - Blood is spurting or flowing rapidly
  - Wound is deep or gaping
  - Signs of shock appear
  
  💡 **Next Steps:** I can help you find the nearest emergency room or trauma center. Would you like me to locate nearby hospitals?`,
        confidence: 0.95,
        recommendations: [
          "Call emergency services immediately",
          "Apply continuous direct pressure",
          "Monitor for signs of shock",
          "Prepare for immediate transport to hospital",
        ],
      }
    }
  
    if (lowerQuery.includes("burn")) {
      return {
        content: `🔥 **BURN INJURY TREATMENT**
  
  **IMMEDIATE CARE:**
  1. **Remove from Heat Source** - Get away from fire, hot surface, chemicals
  2. **Cool the Burn** - Run cool (not cold) water over burn for 10-20 minutes
  3. **Remove Jewelry/Clothing** - Before swelling occurs, if not stuck to skin
  4. **Cover Loosely** - Use sterile gauze or clean cloth
  
  **DO NOT:**
  - Use ice, butter, or ointments
  - Break blisters
  - Remove stuck clothing
  
  **SEEK EMERGENCY CARE IF:**
  - Burn is larger than palm of hand
  - Burn is on face, hands, feet, or genitals
  - Burn appears white, charred, or leathery
  - Person is having trouble breathing
  
  **BURN SEVERITY:**
  - **1st Degree:** Red, painful (like sunburn)
  - **2nd Degree:** Blisters, very painful
  - **3rd Degree:** White/charred, may not be painful
  
  💡 **Next Steps:** For serious burns, I can help locate the nearest burn center or emergency room.`,
        confidence: 0.92,
        recommendations: [
          "Cool with running water immediately",
          "Remove from heat source",
          "Seek medical attention for severe burns",
          "Do not use ice or home remedies",
        ],
      }
    }
  
    if (lowerQuery.includes("choking")) {
      return {
        content: `🫁 **CHOKING EMERGENCY**
  
  **FOR CONSCIOUS PERSON:**
  1. **Encourage Coughing** - If they can cough/speak, let them try to clear it
  2. **Back Blows** - Lean them forward, give 5 sharp blows between shoulder blades
  3. **Abdominal Thrusts (Heimlich):**
     - Stand behind person
     - Place hands above navel, below ribcage
     - Give quick upward thrusts
     - Alternate 5 back blows, 5 abdominal thrusts
  
  **FOR UNCONSCIOUS PERSON:**
  1. **Call 911 immediately**
  2. **Begin CPR** - Chest compressions may dislodge object
  3. **Check mouth** - Look for visible object, remove if seen
  
  **INFANTS (Under 1 year):**
  - Use back blows and chest thrusts only
  - NO abdominal thrusts for babies
  
  **CALL EMERGENCY SERVICES IF:**
  - Person becomes unconscious
  - Object won't dislodge
  - Person has difficulty breathing after object is removed
  
  💡 **Remember:** Even if successful, seek medical evaluation to ensure no injury occurred.`,
        confidence: 0.94,
        recommendations: [
          "Call emergency services if unsuccessful",
          "Alternate back blows and abdominal thrusts",
          "Begin CPR if person becomes unconscious",
          "Seek medical evaluation even after successful removal",
        ],
      }
    }
  
    if (lowerQuery.includes("heart attack") || lowerQuery.includes("chest pain")) {
      return {
        content: `❤️ **HEART ATTACK EMERGENCY**
  
  **CALL 911 IMMEDIATELY** - Time is critical!
  
  **IMMEDIATE ACTIONS:**
  1. **Have person sit down** - Comfortable position, knees bent
  2. **Loosen tight clothing** - Around neck and chest
  3. **Give aspirin if available** - 1 adult aspirin (325mg) to chew
  4. **Monitor breathing** - Be ready to perform CPR
  
  **HEART ATTACK SYMPTOMS:**
  - Chest pain/pressure (may radiate to arm, jaw, back)
  - Shortness of breath
  - Nausea, sweating
  - Lightheadedness
  - Pain in arm, jaw, or back
  
  **WOMEN'S SYMPTOMS MAY INCLUDE:**
  - Unusual fatigue
  - Nausea/vomiting
  - Back or jaw pain
  - Shortness of breath
  
  **DO NOT:**
  - Drive to hospital yourself
  - Wait to see if symptoms improve
  - Give anything by mouth if unconscious
  
  💡 **Critical:** Every minute counts in a heart attack. Emergency services can begin treatment immediately.`,
        confidence: 0.96,
        recommendations: [
          "Call emergency services immediately",
          "Give aspirin if available and not allergic",
          "Keep person calm and seated",
          "Be prepared to perform CPR if needed",
        ],
      }
    }
  
    // General first aid responses
    if (lowerQuery.includes("cut") || lowerQuery.includes("wound")) {
      return {
        content: `🩹 **WOUND CARE TREATMENT**
  
  **IMMEDIATE CARE:**
  1. **Clean Your Hands** - Wash with soap or use hand sanitizer
  2. **Stop the Bleeding** - Apply direct pressure with clean cloth
  3. **Clean the Wound** - Rinse with clean water when bleeding stops
  4. **Apply Antibiotic** - Use antibiotic ointment if available
  5. **Cover the Wound** - Use sterile bandage or clean cloth
  
  **WOUND ASSESSMENT:**
  - **Minor:** Shallow, edges close together, bleeding stops easily
  - **Major:** Deep, gaping, won't stop bleeding, or on face/joints
  
  **SEEK MEDICAL CARE IF:**
  - Cut is deep (you can see fat, muscle, or bone)
  - Edges won't stay closed
  - Bleeding won't stop after 10 minutes of pressure
  - Signs of infection (redness, warmth, pus, red streaking)
  - Tetanus shot is not up to date
  
  **INFECTION SIGNS TO WATCH:**
  - Increased pain, redness, swelling
  - Warmth around wound
  - Pus or unusual drainage
  - Red streaking from wound
  - Fever
  
  💡 **Follow-up:** Keep wound clean and dry. Change bandages daily.`,
        confidence: 0.88,
        recommendations: [
          "Clean hands before treating wound",
          "Apply direct pressure to stop bleeding",
          "Keep wound clean and covered",
          "Watch for signs of infection",
        ],
      }
    }
  
    if (lowerQuery.includes("sprain") || lowerQuery.includes("ankle") || lowerQuery.includes("wrist")) {
      return {
        content: `🦴 **SPRAIN TREATMENT (R.I.C.E. Method)**
  
  **R - REST**
  - Stop activity immediately
  - Avoid putting weight on injured area
  - Use crutches if needed for ankle sprains
  
  **I - ICE**
  - Apply ice pack for 15-20 minutes
  - Repeat every 2-3 hours for first 48 hours
  - Use towel between ice and skin
  
  **C - COMPRESSION**
  - Wrap with elastic bandage
  - Start below injury, wrap upward
  - Not too tight - should not cause numbness
  
  **E - ELEVATION**
  - Raise injured area above heart level when possible
  - Use pillows to prop up ankle or wrist
  - Helps reduce swelling
  
  **PAIN MANAGEMENT:**
  - Over-the-counter pain relievers (ibuprofen, acetaminophen)
  - Follow package directions
  
  **SEEK MEDICAL CARE IF:**
  - Severe pain or inability to bear weight
  - Numbness or tingling
  - No improvement after 2-3 days
  - Joint appears deformed
  
  💡 **Recovery:** Gradual return to activity. May take 1-6 weeks depending on severity.`,
        confidence: 0.85,
        recommendations: [
          "Follow R.I.C.E. protocol immediately",
          "Use over-the-counter pain relievers as needed",
          "Seek medical attention if severe or not improving",
          "Gradual return to normal activity",
        ],
      }
    }
  
    // Default response for general queries
    return {
      content: `🩺 **GENERAL FIRST AID GUIDANCE**
  
  Thank you for your question about "${query}". Here's some general first aid guidance:
  
  **BASIC FIRST AID PRINCIPLES:**
  1. **Assess the Situation** - Ensure scene safety first
  2. **Check Responsiveness** - Tap and shout "Are you okay?"
  3. **Call for Help** - Dial emergency services if serious
  4. **Provide Care** - Based on specific injury or illness
  
  **WHEN TO CALL EMERGENCY SERVICES:**
  - Person is unconscious or unresponsive
  - Difficulty breathing or no breathing
  - Severe bleeding that won't stop
  - Signs of heart attack or stroke
  - Severe allergic reaction
  - Suspected spinal injury
  
  **BASIC SUPPLIES TO HAVE:**
  - Sterile gauze and bandages
  - Adhesive tape
  - Antiseptic wipes
  - Pain relievers
  - Emergency contact numbers
  
  **IMPORTANT REMINDERS:**
  - Only provide care within your training level
  - Get consent before helping conscious adults
  - Call emergency services for serious situations
  - Stay calm and reassure the injured person
  
  💡 **For specific medical advice, please consult with healthcare professionals or provide more details about the situation.**`,
      confidence: 0.75,
      recommendations: [
        "Assess situation and ensure safety",
        "Call emergency services if serious",
        "Provide care within your skill level",
        "Seek professional medical advice for specific conditions",
      ],
    }
  }
  
  // Generate mock clinic data
  function generateMockClinics( ) {
    const baseDistance = Math.random() * 5 + 1 // 1-6 km
  
    return [
      {
        id: "mock1",
        name: "Nairobi Hospital",
        address: "Argwings Kodhek Rd, Nairobi",
        phone: "+254-20-2845000",
        type: "General Hospital",
        isOpen: true,
        rating: 4.5,
        distance: baseDistance,
        coordinates: { lat: -1.3067, lng: 36.7906 },
        aiRecommendation: "Major hospital with comprehensive emergency services",
        specializations: ["Emergency Medicine", "Surgery", "Internal Medicine"],
      },
      {
        id: "mock2",
        name: "Kenyatta National Hospital",
        address: "Hospital Rd, Nairobi",
        phone: "+254-20-2726300",
        type: "National Referral Hospital",
        isOpen: true,
        rating: 4.2,
        distance: baseDistance + 1.4,
        coordinates: { lat: -1.3013, lng: 36.8073 },
        aiRecommendation: "National referral hospital with specialized departments",
        specializations: ["All Specialties", "Research", "Teaching"],
      },
      {
        id: "mock3",
        name: "Aga Khan University Hospital",
        address: "3rd Parklands Ave, Nairobi",
        phone: "+254-20-3662000",
        type: "Private Hospital",
        isOpen: true,
        rating: 4.8,
        distance: baseDistance + 2.1,
        coordinates: { lat: -1.2635, lng: 36.8017 },
        aiRecommendation: "Premium private hospital with excellent facilities",
        specializations: ["Cardiology", "Oncology", "Neurology"],
      },
    ].sort((a, b) => a.distance - b.distance)
  }
  
  // Rest of the helper functions remain the same...
  const assessUrgencyLevel = (query) => {
    const urgentKeywords = [
      "bleeding",
      "unconscious",
      "chest pain",
      "difficulty breathing",
      "severe pain",
      "heart attack",
      "stroke",
      "choking",
      "allergic reaction",
    ]
    const lowerQuery = query.toLowerCase()
  
    for (const keyword of urgentKeywords) {
      if (lowerQuery.includes(keyword)) {
        return "high"
      }
    }
  
    const moderateKeywords = ["pain", "injury", "burn", "cut", "sprain", "fever"]
    for (const keyword of moderateKeywords) {
      if (lowerQuery.includes(keyword)) {
        return "moderate"
      }
    }
  
    return "normal"
  }
  
  const generateLocationRecommendations = (urgency) => {
    const recommendations = []
  
    if (urgency === "high") {
      recommendations.push("For emergencies, prioritize hospitals with 24/7 emergency departments")
      recommendations.push("Call ahead to inform them of your arrival")
    } else {
      recommendations.push("Consider appointment availability and waiting times")
      recommendations.push("Verify insurance coverage before visiting")
    }
  
    recommendations.push("Check current traffic conditions for fastest route")
    return recommendations
  }
  
  const generateCulturalNotes = (language, context) => {
    const notes = []
  
    if (language === "sw") {
      notes.push("Translation adapted for Kenyan Swahili dialect")
      notes.push("Medical terms simplified for better understanding")
    }
  
    if (context === "medical") {
      notes.push("Cultural sensitivity applied to medical terminology")
    }
  
    return notes
  }
  
  const generateHealthRecommendations = (analysis) => {
    const recommendations = []
  
    if (analysis.stressLevel > 70) {
      recommendations.push("Consider stress reduction techniques like deep breathing")
      recommendations.push("Take regular breaks and practice mindfulness")
    }
  
    if (analysis.painLevel > 50) {
      recommendations.push("Monitor pain levels and consider medical consultation")
      recommendations.push("Apply appropriate pain management techniques")
    }
  
    if (analysis.mentalHealthScore < 70) {
      recommendations.push("Consider speaking with a mental health professional")
      recommendations.push("Engage in activities that promote mental wellness")
    }
  
    recommendations.push("Maintain regular sleep schedule and healthy diet")
    recommendations.push("Stay hydrated and exercise regularly")
  
    return recommendations
  }
  
  // Fallback functions
  const getFallbackMedicalAdvice = (query) => {
    const urgency = assessUrgencyLevel(query)
  
    if (urgency === "high") {
      return `🚨 EMERGENCY: This appears to be a serious medical situation. Call emergency services immediately (911, 999, 112). 
  
  While waiting for help:
  1. Ensure the person is safe and breathing
  2. Do not move them unless necessary
  3. Apply direct pressure to any bleeding wounds
  4. Stay calm and provide reassurance
  5. Be ready to provide CPR if trained
  
  Seek immediate professional medical attention.`
    }
  
    return `🩹 Basic First Aid Guidance:
  
  1. Assess the situation and ensure safety
  2. Check for consciousness and breathing
  3. Control any bleeding with direct pressure
  4. Treat for shock if necessary
  5. Seek professional medical help if symptoms worsen
  
  Remember: This is general guidance only. Always consult healthcare professionals for proper medical advice.`
  }
  
  const getFallbackClinics = ( ) => {
    return [
      {
        id: "fallback1",
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
      {
        id: "fallback2",
        name: "Kenyatta National Hospital",
        address: "Hospital Rd, Nairobi",
        phone: "+254-20-2726300",
        type: "National Referral Hospital",
        isOpen: true,
        rating: 4.2,
        distance: 3.5,
        coordinates: { lat: -1.3013, lng: 36.8073 },
        aiRecommendation: "National referral hospital with specialized departments",
        specializations: ["All Specialties", "Research", "Teaching"],
      },
      {
        id: "fallback3",
        name: "Aga Khan University Hospital",
        address: "3rd Parklands Ave, Nairobi",
        phone: "+254-20-3662000",
        type: "Private Hospital",
        isOpen: true,
        rating: 4.8,
        distance: 4.2,
        coordinates: { lat: -1.2635, lng: 36.8017 },
        aiRecommendation: "Premium private hospital with excellent facilities",
        specializations: ["Cardiology", "Oncology", "Neurology"],
      },
    ]
  }
  
  const getFallbackTranslation = (text, language) => {
    const basicTranslations = {
      sw: {
        Emergency: "Dharura",
        "First Aid": "Huduma za Kwanza",
        Hospital: "Hospitali",
        Doctor: "Daktari",
        Help: "Msaada",
        Pain: "Maumivu",
        Injury: "Jeraha",
        "How can I help you": "Ninawezaje kukusaidia",
        "Call emergency services": "Piga simu ya dharura",
        "Apply pressure": "Weka shinikizo",
        "Stay calm": "Tulia",
        "Seek medical help": "Tafuta msaada wa kimatibabu",
      },
      ki: {
        Emergency: "Ihinda",
        "First Aid": "Ũtaaro wa mbere",
        Hospital: "Kĩrĩra",
        Doctor: "Muganga",
        Help: "Ũteithio",
        Pain: "Rũrũ",
        Injury: "Kĩronda",
      },
      luo: {
        Emergency: "Kech matek",
        "First Aid": "Kony mokwongo",
        Hospital: "Ospedale",
        Doctor: "Jathieth",
        Help: "Kony",
        Pain: "Rem",
        Injury: "Adhonde",
      },
    }
  
    const translations = basicTranslations[language]
    if (translations) {
      let translatedText = text
      for (const [english, translated] of Object.entries(translations)) {
        translatedText = translatedText.replace(new RegExp(english, "gi"), translated)
      }
      return translatedText
    }
  
    return text // Return original if no translation found
  }
  
  const getBasicHealthAssessment = () => {
    return {
      stressLevel: 45,
      painLevel: 25,
      fatigueLevel: 35,
      mentalHealthScore: 78,
      overallWellness: 82,
      keyFindings: [
        "Basic visual assessment completed",
        "No immediate health concerns detected",
        "Recommend professional evaluation for detailed analysis",
      ],
    }
  }
  