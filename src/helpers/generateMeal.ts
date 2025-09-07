"use server"

import { MealSuggestion, MealPreferences } from "@/types/patient/dietSlice"
import { ProfileType } from "@/types/patient/profile"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

function cleanJsonOutput(output: string): string {
  return output.replace(/```json/gi, "").replace(/```/g, "").trim()
}

export async function generateAIMealSuggestionsGrok(
  profile: ProfileType,
  preferences: MealPreferences
): Promise<MealSuggestion[]> {
  const prompt = `
You are an expert nutritionist and chef.
Generate 4 meal suggestions (breakfast, lunch, dinner, snack) for today.

Output MUST be a SINGLE valid JSON array of objects.
Do NOT return separate objects line by line.
Do NOT include markdown code fences or explanations.

Each object must follow the MealSuggestion interface:

Keys: id, name, type, calories, protein, carbs, fat, ingredients, cookingTime, difficulty, budget, cuisine

Patient Profile:
Name: ${profile.name}
Age: ${new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()}
Gender: ${profile.gender}
Weight: ${profile.weight} kg
Height: ${profile.height} cm
Allergies: ${profile.allergies}
Medical Conditions: ${profile.conditions}
Lifestyle: ${profile.lifestyle}

Meal Preferences: ${JSON.stringify(preferences)}

Answer:
`.trim()

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 800,
  })

  const rawOutput = chatCompletion.choices[0]?.message?.content?.trim() || "[]"
  console.log("Raw AI Output:", rawOutput)

  const cleanedOutput = cleanJsonOutput(rawOutput)

  let parsed: unknown
  try {
    // If AI gave multiple JSON objects, wrap them into an array
    if (cleanedOutput.startsWith("{") && cleanedOutput.includes("}\n{")) {
      const wrapped = `[${cleanedOutput.replace(/\n/g, ",")}]`
      parsed = JSON.parse(wrapped)
    } else {
      parsed = JSON.parse(cleanedOutput)
    }
  } catch (err) {
    console.error("Meal parsing failed:", err)
    parsed = []
  }

  return Array.isArray(parsed) ? (parsed as MealSuggestion[]) : []
}
