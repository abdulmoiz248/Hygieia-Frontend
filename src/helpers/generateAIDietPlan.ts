"use server"

import { DietPlan } from "@/store/nutritionist/diet-plan-store"
import { ProfileType } from "@/types/patient/profile"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })



function cleanJsonOutput(output: string): string {
  return output
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim()
}

function sanitizeDietPlan(parsed: any, profile: ProfileType): DietPlan {
  return {
    id: String(parsed.id || `plan_${Date.now()}`),
    dailyCalories: String(parsed.dailyCalories || "2000"),
    protein: String(parsed.protein || "100g"),
    carbs: String(parsed.carbs || "250g"),
    fat: String(parsed.fat || "70g"),
    deficiency: String(parsed.deficiency || "None"),
    notes: String(parsed.notes || "Maintain hydration and balanced meals"),
    caloriesBurned: String(parsed.caloriesBurned || "250"),
    exercise: String(parsed.exercise || "30 min daily walk"),
    startDate: String(parsed.startDate || new Date().toISOString()),
    endDate: String(
      parsed.endDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    ),
    patientId: String(profile.id),
    patientName: String(profile.name),
    nutritionistId: String(parsed.nutritionistId || "ai_nutritionist"),
  }
}

export async function generateAIDietPlanGrok(
  profile: ProfileType,
  preferences: string
): Promise<DietPlan> {
  const prompt = `
You are an expert nutritionist.  
Create a personalized 30-day diet and fitness plan for the following patient.  
The plan should be practical, structured, and based on health data.  

Output ONLY in valid raw JSON.  
Do NOT include markdown code fences, labels, or explanations.  
All values MUST be strings, even numbers.  

Keys: id, dailyCalories, protein, carbs, fat, deficiency, notes, caloriesBurned, exercise, startDate, endDate, patientId, patientName, nutritionistId.

Patient Profile:
Name: ${profile.name}
Age: ${new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()}
Gender: ${profile.gender}
Weight: ${profile.weight} kg
Height: ${profile.height} cm
Blood Type: ${profile.bloodType}
Allergies: ${profile.allergies}
Medical Conditions: ${profile.conditions}
Medications: ${profile.medications}
Lifestyle: ${profile.lifestyle}
Disabilities: ${profile.disabilities}

Preferences: ${preferences}
Answer:
`.trim()

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
  })

  const rawOutput = chatCompletion.choices[0]?.message?.content?.trim() || "{}"
  console.log(rawOutput)
  const cleanedOutput = cleanJsonOutput(rawOutput)

  let parsed: unknown
  try {
    parsed = JSON.parse(cleanedOutput)
  } catch {
    parsed = {}
  }


  return sanitizeDietPlan(parsed, profile)
}
