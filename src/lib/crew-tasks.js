import { Task } from "@crewai/crewai"

// Medical consultation task
export const createMedicalConsultationTask = (userQuery, userImage = null, language = "en") => {
  return new Task({
    description: `
      Analyze the following medical query and provide comprehensive first aid guidance:
      
      User Query: "${userQuery}"
      ${userImage ? "User has provided an image for analysis." : ""}
      Language: ${language}
      
      Please provide:
      1. Immediate assessment of the situation
      2. Step-by-step first aid instructions
      3. Warning signs to watch for
      4. When to seek emergency medical care
      5. Follow-up care recommendations
      
      Format the response with clear sections and appropriate emoji for better readability.
      Always prioritize user safety and emphasize professional medical care when needed.
    `,
    expectedOutput: `A comprehensive first aid response with clear instructions, safety warnings, 
                    and recommendations for professional medical care when appropriate.`,
  })
}

// Clinic finding task
export const createClinicFindingTask = (userLocation, medicalNeed = "general", urgency = "normal") => {
  return new Task({
    description: `
      Find and recommend healthcare facilities near the user's location:
      
      User Location: Latitude ${userLocation.latitude}, Longitude ${userLocation.longitude}
      Medical Need: ${medicalNeed}
      Urgency Level: ${urgency}
      
      Please provide:
      1. List of 5-10 nearby healthcare facilities
      2. Distance from user location
      3. Facility type and specializations
      4. Operating hours and availability
      5. Contact information
      6. Recommendations based on medical need and urgency
      
      Prioritize emergency-capable facilities for urgent cases.
      Include both public and private healthcare options.
    `,
    expectedOutput: `A ranked list of healthcare facilities with detailed information including 
                    distance, specializations, contact details, and suitability recommendations.`,
  })
}

// Translation task
export const createTranslationTask = (text, fromLanguage, toLanguage, context = "medical") => {
  return new Task({
    description: `
      Translate the following medical text while maintaining accuracy and cultural appropriateness:
      
      Text to translate: "${text}"
      From: ${fromLanguage}
      To: ${toLanguage}
      Context: ${context}
      
      Requirements:
      1. Maintain medical accuracy
      2. Use culturally appropriate language
      3. Ensure clarity and understanding
      4. Adapt to local medical practices if relevant
      5. Preserve important safety warnings
      
      If the target language has multiple dialects, use the most widely understood variant.
    `,
    expectedOutput: `Accurate translation that maintains medical meaning while being culturally 
                    appropriate and easily understood by native speakers.`,
  })
}

// Facial analysis task
export const createFacialAnalysisTask = (analysisData, vitalSigns = null) => {
  return new Task({
    description: `
      Analyze facial features and expressions to assess health indicators:
      
      Analysis Data: ${JSON.stringify(analysisData)}
      ${vitalSigns ? `Vital Signs: ${JSON.stringify(vitalSigns)}` : ""}
      
      Please assess:
      1. Stress level indicators (0-100 scale)
      2. Pain level indicators (0-100 scale)
      3. Fatigue and wellness indicators
      4. Emotional state assessment
      5. Recommendations for health improvement
      
      Provide insights while emphasizing the limitations of visual assessment.
      Always recommend professional medical evaluation for concerning findings.
    `,
    expectedOutput: `Health assessment with stress levels, pain indicators, wellness score, 
                    and recommendations while noting assessment limitations.`,
  })
}
