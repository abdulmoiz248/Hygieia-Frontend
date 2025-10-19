import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, excerpt, content } = await req.json();

    if (!title && !excerpt && !content) {
      return NextResponse.json({ error: "Please provide at least one field." }, { status: 400 });
    }

    // Combine fields into a prompt
    const prompt = `${title}. ${excerpt}. ${content}. Render a visually appealing featured image for this blog post, cinematic lighting, vibrant colors.`;

    const HF_TOKEN = process.env.HF_TOKEN!;
    const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
