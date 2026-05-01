"use server"

import { DoctorProfile } from "@/store/doctor/doctor-store"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateDoctorAIReport(
  patientData: any,
  fitnessData: any[],
  medicalRecords: any[]
): Promise<string> {
  const prompt = `
You are an expert physician AI assistant analyzing 30 days of patient data to provide actionable clinical insights for a doctor's consultation.
Generate a comprehensive physician-focused report that helps the doctor make informed clinical decisions quickly.

PATIENT PROFILE:
- Name: ${patientData.name}
- Age: ${new Date().getFullYear() - new Date(patientData.dateOfBirth).getFullYear()} years
- Gender: ${patientData.gender}
- Weight: ${patientData.weight} kg
- Height: ${patientData.height} cm
- BMI: ${(patientData.weight / ((patientData.height / 100) ** 2)).toFixed(1)}
- Blood Type: ${patientData.bloodType}
- Health Score: ${patientData.healthscore}/100
- Adherence Rate: ${patientData.adherence}
- Allergies: ${patientData.allergies}
- Medical Conditions: ${patientData.conditions}
- Medications: ${patientData.medications}
- Family History: ${patientData.familyHistory}
- Lifestyle: ${patientData.lifestyle}

30-DAY FITNESS & VITALS DATA:
${
  fitnessData.length > 0
    ? (() => {
        const avgSteps = Math.round(fitnessData.reduce((s, f) => s + (f.steps || 0), 0) / fitnessData.length)
        const avgWater = (fitnessData.reduce((s, f) => s + (f.water || 0), 0) / fitnessData.length).toFixed(1)
        const avgSleep = (fitnessData.reduce((s, f) => s + (f.sleep || 0), 0) / fitnessData.length).toFixed(1)
        const avgCaloriesBurned = Math.round(fitnessData.reduce((s, f) => s + (f.calories_burned || 0), 0) / fitnessData.length)
        const avgCaloriesIntake = Math.round(fitnessData.reduce((s, f) => s + (f.calories_intake || 0), 0) / fitnessData.length)
        const avgProtein = (fitnessData.reduce((s, f) => s + (f.protein || 0), 0) / fitnessData.length).toFixed(1)
        const avgCarbs = (fitnessData.reduce((s, f) => s + (f.carbs || 0), 0) / fitnessData.length).toFixed(1)
        const avgFat = (fitnessData.reduce((s, f) => s + (f.fat || 0), 0) / fitnessData.length).toFixed(1)

        const firstHalf = fitnessData.slice(0, Math.floor(fitnessData.length / 2))
        const secondHalf = fitnessData.slice(Math.floor(fitnessData.length / 2))
        const stepsTrend =
          secondHalf.reduce((s, f) => s + (f.steps || 0), 0) / secondHalf.length >
          firstHalf.reduce((s, f) => s + (f.steps || 0), 0) / firstHalf.length
            ? "improving"
            : "declining"
        const sleepTrend =
          secondHalf.reduce((s, f) => s + (f.sleep || 0), 0) / secondHalf.length >
          firstHalf.reduce((s, f) => s + (f.sleep || 0), 0) / firstHalf.length
            ? "improving"
            : "declining"

        return `SUMMARY (${fitnessData.length} days):
- Avg Steps: ${avgSteps} (${stepsTrend})
- Avg Water: ${avgWater} glasses/day
- Avg Sleep: ${avgSleep} hrs (${sleepTrend})
- Avg Calories Burned: ${avgCaloriesBurned}/day
- Avg Calories Intake: ${avgCaloriesIntake}/day
- Avg Macronutrients: Protein ${avgProtein}g, Carbs ${avgCarbs}g, Fat ${avgFat}g

DAILY DATA:
${fitnessData
  .map(
    (f, i) => `Day ${i + 1} (${new Date(f.created_at).toLocaleDateString()}):
  Steps: ${f.steps || 0}, Water: ${f.water || 0}gl, Sleep: ${f.sleep || 0}h, Cal Burned: ${f.calories_burned || 0}, Cal Intake: ${f.calories_intake || 0}`
  )
  .join("\n")}`
      })()
    : "No fitness data available"
}

MEDICAL RECORDS (recent):
${medicalRecords.length > 0 ? medicalRecords.map((r) => `- ${r.title} (${r.record_type}) - ${r.date}`).join("\n") : "None on file"}

Generate a comprehensive clinical report with the following sections:

**1. CLINICAL SUMMARY**
- Patient's overall health status based on available data
- Key clinical concerns and red flags requiring immediate attention
- BMI classification and its clinical implications

**2. VITAL SIGNS & ACTIVITY ANALYSIS**
- Step count trends and what they indicate clinically
- Sleep patterns and potential sleep disorder indicators
- Caloric balance and metabolic health implications
- Hydration status assessment

**3. CLINICAL RISK ASSESSMENT**
- Cardiovascular risk indicators from activity and lifestyle data
- Metabolic syndrome risk factors
- Medication interactions or concerns (based on medications listed)
- Comorbidity risks given family history and current conditions

**4. DIFFERENTIAL CONSIDERATIONS**
- Conditions to consider or rule out based on the 30-day data patterns
- Symptoms that may warrant further investigation
- Lifestyle factors influencing the patient's conditions

**5. RECOMMENDED INVESTIGATIONS**
- Lab tests to order and their clinical rationale
- Imaging or specialist referrals if warranted
- Monitoring parameters to track

**6. CLINICAL ACTION PLAN**
- Priority interventions for this consultation
- Medication review recommendations
- Lifestyle modification prescriptions (specific and measurable)
- Follow-up timeline and milestones

**7. PATIENT EDUCATION POINTS**
- Key clinical information to communicate to the patient
- Warnings or red flags the patient should watch for
- Adherence strategies for treatment plan

Use clinical, evidence-based language. Be specific with numbers from the actual data. Focus on what is actionable in a clinical consultation setting.

Answer:
  `.trim()

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2500,
  })

  const rawOutput = chatCompletion.choices[0]?.message?.content?.trim() || ""
  console.log("[INFO] LLM GENERATED DOCTOR REPORT: ", rawOutput)
  return rawOutput
}
