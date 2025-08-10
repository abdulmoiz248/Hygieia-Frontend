"use server"

import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export interface AiCalorieEstimateResult {
  calories: number
  carbs: number
  protein: number
  fat: number
}

export async function AiCalorieEstimate(description: string): Promise<AiCalorieEstimateResult> {
  const prompt = `
You are a health and fitness assistant.
Estimate the nutritional info in the following description.
Respond ONLY with a JSON object containing integers for calories, carbs (grams), protein (grams), and fat (grams).
No extra text, no units, just the JSON.

Description: ${description}
Answer:
  `.trim()

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
    max_tokens: 60,
  })

  const rawOutput = chatCompletion.choices[0]?.message?.content || ""

  try {
    // Extract JSON from the AI response (even if there's extra fluff)
    const jsonStart = rawOutput.indexOf("{")
    const jsonEnd = rawOutput.lastIndexOf("}") + 1
    const jsonString = rawOutput.substring(jsonStart, jsonEnd)

    const data = JSON.parse(jsonString)
    return {
      calories: Number(data.calories) || 0,
      carbs: Number(data.carbs) || 0,
      protein: Number(data.protein) || 0,
      fat: Number(data.fat) || 0,
    }
  } catch {
    // Fallback zeroes if parsing fails
    return { calories: 0, carbs: 0, protein: 0, fat: 0 }
  }
}
