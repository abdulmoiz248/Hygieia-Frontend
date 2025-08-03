"use server"

import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function AiCalorieEstimate(description: string): Promise<number> {
  const prompt = `
You are a health and fitness assistant.
Estimate how many kilocalories (kcal) are involved in the following description.
Respond ONLY with a single integer number. Do NOT include units, words, or punctuation.

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
    max_tokens: 10,
  })

  const rawOutput = chatCompletion.choices[0]?.message?.content || ""
  const match = rawOutput.trim().match(/\d+/)
  const calories = match ? parseInt(match[0]) : 0
  return calories
}
