import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare: Cheia API lipsește din Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ⚠️ SCHIMBARE MAJORĂ: Trecem pe 'gemini-pro' (Cel mai stabil model, fără erori 404)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Ești Mihai Daniel AI. Răspunde scurt, direct și educativ. Nu da sfaturi financiare, ci educaționale." }],
        },
        {
          role: "model",
          parts: [{ text: "Am înțeles. Sunt Mihai Daniel AI. Ce analizăm?" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("AI ERROR:", error);
    return NextResponse.json({ 
        response: `Tati, Google are o mică întrerupere temporară (${error.message}). Dar sunt aici. Mai încearcă în 30 secunde.` 
    });
  }
}