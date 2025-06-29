// Mock API endpoint for OpenAI medical consultation
// In production, this would be a proper API route with OpenAI integration

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }
  
    try {
      const { query, image, language } = req.body
  
      // Simulate OpenAI API processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))
  
      // Generate medical advice based on query
      const advice = generateMedicalAdvice(query, image, language)
  
      res.status(200).json({
        advice: advice.content,
        confidence: advice.confidence,
        recommendations: advice.recommendations,
      })
    } catch (error) {
      console.error("OpenAI API error:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  }
  
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
  