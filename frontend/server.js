import 'dotenv/config';
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// eslint-disable-next-line no-undef
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/first-aid-steps", async (req, res) => {
  const { condition } = req.body;
  if (!condition) {
    return res.status(400).json({ error: "Condition is required" });
  }
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
    const prompt = `You are a medical assistant. List step-by-step first aid instructions for the following condition: "${condition}". Respond with a numbered list.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const steps = text
      .split(/\n+/)
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 0);
    res.status(200).json({ steps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ steps: ["Sorry, I couldn't fetch first aid steps at this time."] });
  }
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));