"use server"

import Groq from "groq-sdk";


interface ChatCompletionMessageParam {
  role: "user" | "assistant" | "system";
  content: string;
}

const prompt = `You're Hygieia's landing page assistant. Your job is to:

1. Greet users in a friendly way using emojis and casual language.
2. Offer basic health tips across categories like diet, exercise, sleep, and mental health.
3. Refer users to the right doctor based on their symptoms and help them book a consultation (virtual or in-person).
4. Inform users about Hygieia’s features like fitness tracker, symptom checker, e-pharmacy, and health record system.
5. Subtly promote offers (like 20% off first consult) and encourage users to sign up.
6. Handle unclear queries politely and guide them toward valid options.
7. Keep everything action-oriented, user-friendly, and supportive. No jargon.`


const messages:ChatCompletionMessageParam[]= [
    {
      role: "system",
      content: prompt,
    },
  ];

  
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function sendChatMessage(message: string) {
 
    messages.push({
      role: "user",
      content: message,
    });
    const chatCompletion = await getGroqChatCompletion();
    const response = chatCompletion.choices[0]?.message?.content || ""
    messages.push({
        role: "assistant",
      content: response,
    })

    return response;
  
}

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages:messages,
    model: "llama-3.3-70b-versatile",
    max_tokens: 100,
    temperature: 0.5,
  });
}
