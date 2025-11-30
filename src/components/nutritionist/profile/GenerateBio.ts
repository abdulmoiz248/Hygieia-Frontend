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

