"use server"

import { NutritionistProfile } from "@/store/nutritionist/userStore"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })




export async function generateBio(profile: NutritionistProfile): Promise<string> {
  const prompt = `
You are a professional copywriter for healthcare specialists.  
Write a concise, engaging biography for the following nutritionist profile.  
Focus on their expertise, experience, certifications, education, and specialties.  
Respond ONLY with a plain text biography, no extra formatting.


Name: ${profile.name}
Specialization: ${profile.specialization}
Experience (years): ${profile.experienceYears}
Certifications: ${profile.certifications.join(", ")}
Education: ${profile.education.join(", ")}
Languages: ${profile.languages.join(", ")}
Consultation Fee: ${profile.consultationFee}
Working Hours: ${profile.workingHours?.map(w => `${w.day} (${w.start} - ${w.end})${w.location ? ` at ${w.location}` : ""}`).join(", ")}
Rating: ${profile.rating}

**-Note:  you are writing in place of person so you dont have to write john is you have to write i am**

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
    temperature: 0.6,
    max_tokens: 300,
  })

  const rawOutput = chatCompletion.choices[0]?.message?.content?.trim() || ""

  console.log("[INFO] LLM GENERATED BIO: ", rawOutput)
  return rawOutput
}

export async function generateAIReport(patientData: any, fitnessData: any[], medicalRecords: any[]): Promise<string> {
  const prompt = `
You are an expert nutritionist AI assistant analyzing 30 days of patient data to provide actionable insights for nutrition consultation. 
Generate a comprehensive nutritionist-focused report that helps the nutritionist make informed decisions quickly.

PATIENT PROFILE:
- Name: ${patientData.name}
- Age: ${new Date().getFullYear() - new Date(patientData.dateOfBirth).getFullYear()} years
- Gender: ${patientData.gender}
- Weight: ${patientData.weight} kg
- Height: ${patientData.height}
- BMI: ${(patientData.weight / ((patientData.height / 100) ** 2)).toFixed(1)}
- Blood Type: ${patientData.bloodType}
- Health Score: ${patientData.healthscore}/100
- Adherence Rate: ${patientData.adherence}
- Allergies: ${patientData.allergies}
- Medical Conditions: ${patientData.conditions}
- Medications: ${patientData.medications}
- Family History: ${patientData.familyHistory}
- Lifestyle: ${patientData.lifestyle}

30-DAY FITNESS & NUTRITION DATA:
${fitnessData.length > 0 ? (() => {
  // Calculate averages and trends
  const avgSteps = Math.round(fitnessData.reduce((sum, f) => sum + (f.steps || 0), 0) / fitnessData.length)
  const avgWater = (fitnessData.reduce((sum, f) => sum + (f.water || 0), 0) / fitnessData.length).toFixed(1)
  const avgSleep = (fitnessData.reduce((sum, f) => sum + (f.sleep || 0), 0) / fitnessData.length).toFixed(1)
  const avgCaloriesBurned = Math.round(fitnessData.reduce((sum, f) => sum + (f.calories_burned || 0), 0) / fitnessData.length)
  const avgCaloriesIntake = Math.round(fitnessData.reduce((sum, f) => sum + (f.calories_intake || 0), 0) / fitnessData.length)
  const avgFat = (fitnessData.reduce((sum, f) => sum + (f.fat || 0), 0) / fitnessData.length).toFixed(1)
  const avgProtein = (fitnessData.reduce((sum, f) => sum + (f.protein || 0), 0) / fitnessData.length).toFixed(1)
  const avgCarbs = (fitnessData.reduce((sum, f) => sum + (f.carbs || 0), 0) / fitnessData.length).toFixed(1)
  
  // Calculate trends (first half vs second half)
  const firstHalf = fitnessData.slice(0, Math.floor(fitnessData.length / 2))
  const secondHalf = fitnessData.slice(Math.floor(fitnessData.length / 2))
  
  const firstHalfAvgSteps = firstHalf.reduce((sum, f) => sum + (f.steps || 0), 0) / firstHalf.length
  const secondHalfAvgSteps = secondHalf.reduce((sum, f) => sum + (f.steps || 0), 0) / secondHalf.length
  const stepsTrend = secondHalfAvgSteps > firstHalfAvgSteps ? 'increasing' : 'decreasing'
  
  const firstHalfAvgSleep = firstHalf.reduce((sum, f) => sum + (f.sleep || 0), 0) / firstHalf.length
  const secondHalfAvgSleep = secondHalf.reduce((sum, f) => sum + (f.sleep || 0), 0) / secondHalf.length
  const sleepTrend = secondHalfAvgSleep > firstHalfAvgSleep ? 'improving' : 'declining'
  
  return `SUMMARY STATISTICS (${fitnessData.length} days of data):
- Average Steps: ${avgSteps} (trend: ${stepsTrend})
- Average Water Intake: ${avgWater} glasses/day
- Average Sleep: ${avgSleep} hours (trend: ${sleepTrend})
- Average Calories Burned: ${avgCaloriesBurned}/day
- Average Calories Intake: ${avgCaloriesIntake}/day
- Average Macronutrients: Fat ${avgFat}g, Protein ${avgProtein}g, Carbs ${avgCarbs}g

DETAILED DAILY DATA:
${fitnessData.map((f, index) => {
  const date = new Date(f.created_at).toLocaleDateString()
  return `Day ${index + 1} (${date}):
  - Steps: ${f.steps || 0}
  - Water: ${f.water || 0} glasses
  - Sleep: ${f.sleep || 0} hours
  - Calories Burned: ${f.calories_burned || 0}
  - Calories Intake: ${f.calories_intake || 0}
  - Macronutrients - Fat: ${f.fat || 0}g, Protein: ${f.protein || 0}g, Carbs: ${f.carbs || 0}g`
}).join('\n\n')}`
})() : 'No fitness data available'}

MEDICAL RECORDS:
${medicalRecords.length > 0 ? medicalRecords.map(r => `- ${r.title} (${r.record_type}) - ${r.date}`).join('\n') : 'No recent medical records'}

Generate a comprehensive health report with these sections:

**1. NUTRITIONAL ASSESSMENT OVERVIEW**
- Current nutritional status and BMI analysis
- Key nutritional concerns and red flags
- Dietary adherence patterns from 30-day data

**2. 30-DAY TREND ANALYSIS**
- Analyze the provided step count trends and activity patterns
- Review sleep duration and quality indicators from the data
- Examine calorie burn vs intake patterns
- Identify consistency in daily habits

**3. NUTRITIONAL GAPS & DEFICIENCIES**
- Analyze the macronutrient data (fat, protein, carbs) for imbalances
- Review water intake patterns and hydration adequacy
- Identify any concerning nutritional patterns from the data
- Assess meal timing based on calorie intake patterns

**4. RISK FACTORS & CONCERNS**
- Immediate health risks
- Long-term nutritional risks
- Medication interactions with nutrition
- Lifestyle factors affecting nutrition

**5. PERSONALIZED NUTRITION RECOMMENDATIONS**
- Specific dietary modifications needed
- Calorie and macronutrient targets
- Meal planning suggestions
- Supplement recommendations (if needed)

**6. ACTION PLAN FOR NUTRITIONIST**
- Priority areas to address in consultation
- Key questions to ask the patient
- Specific goals to set
- Follow-up monitoring points

**7. PERSONALIZED DIET PLAN RECOMMENDATIONS**
Based on the patient's current data, provide specific recommendations:

CALORIE & MACRONUTRIENT TARGETS:
- Daily calorie target: [Calculate based on current intake, BMI, and goals]
- Protein: [X]g per day ([X]g per meal)
- Carbohydrates: [X]g per day ([X]g per meal)
- Fat: [X]g per day ([X]g per meal)
- Fiber: [X]g per day

MEAL PLANNING:
- Number of meals per day: [X]
- Meal timing: [Specific times based on current patterns]
- Pre/post workout nutrition: [Specific recommendations]
- Snack suggestions: [Healthy options with portions]

HYDRATION PLAN:
- Daily water target: [X] glasses (based on current intake)
- Timing: [When to drink water throughout the day]

EXERCISE RECOMMENDATIONS:
- Daily step goal: [X] steps (based on current average)
- Cardio: [X] minutes, [X] times per week
- Strength training: [X] times per week
- Rest days: [X] days per week

SPECIFIC FOOD SUGGESTIONS:
- Breakfast: [Specific foods with portions]
- Lunch: [Specific foods with portions]
- Dinner: [Specific foods with portions]
- Snacks: [Healthy options with portions]

**8. PATIENT EDUCATION POINTS**
- Key concepts to explain to patient
- Behavioral change strategies
- Motivation techniques

IMPORTANT: Use the ACTUAL data provided above. Do not say "no data available" - analyze the specific numbers, trends, and patterns from the 30-day fitness data. Calculate specific insights from the provided averages and daily values.

FOR DIET PLAN RECOMMENDATIONS:
- Calculate calorie targets based on current intake vs burn ratio
- Determine protein needs based on weight and activity level
- Adjust carb and fat ratios based on current macronutrient data
- Set realistic step goals based on current average
- Recommend specific foods based on patient's conditions and preferences
- Provide exact gram amounts and portion sizes

Focus on PRACTICAL, ACTIONABLE insights that will help the nutritionist:
- Save time during consultation
- Make data-driven recommendations based on the actual numbers
- Identify critical issues quickly using the provided data
- Create effective treatment plans based on real patterns

Use professional but accessible language. Be specific with numbers, trends, and recommendations from the actual data provided.

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
    temperature: 0.7,
    max_tokens: 2500,
  })

  const rawOutput = chatCompletion.choices[0]?.message?.content?.trim() || ""

  console.log("[INFO] LLM GENERATED NUTRITIONIST REPORT: ", rawOutput)
  return rawOutput
}

