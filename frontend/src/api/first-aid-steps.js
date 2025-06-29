import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Store your key in .env.local
})
const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { condition } = req.body
  if (!condition) {
    return res.status(400).json({ error: "Condition is required" })
  }

  try {
    const prompt = `You are a medical assistant. List step-by-step first aid instructions for the following condition: "${condition}". Respond with a numbered list.`
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
    })

    const text = completion.data.choices[0].message.content
    // Split into steps by line
    const steps = text
      .split(/\n+/)
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 0)

    res.status(200).json({ steps })
  } catch (error) {
    console.error(error)
    res.status(500).json({ steps: ["Sorry, I couldn't fetch first aid steps at this time."] })
  }
}