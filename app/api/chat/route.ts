import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Preluăm cheia din setările Vercel
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare Critică: Cheia API lipsește din Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // 2. Inițializăm SDK-ul Oficial
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ⚠️ SCHIMBARE CRITICĂ: Folosim modelul ACTIV (Dec 2025)
    // 'gemini-1.5' a fost retras în Septembrie. 'gemini-2.5-flash' este noul standard.
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
        }
    });

    // 3. Setăm Personalitatea (Brain)
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Ești Mihai Daniel AI. Ești un mentor crypto expert, nu un robot. Răspunde scurt, direct, cu autoritate ('Tati, ascultă...'). Nu da sfaturi financiare riscante, ci educație pură." }],
        },
        {
          role: "model",
          parts: [{ text: "Am înțeles. Sunt Mihai Daniel AI. Sunt gata să analizez piața." }],
        },
      ],
    });

    // 4. Trimitem mesajul
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("AI ERROR:", error);
    
    // Dacă tot dă eroare, afișăm mesajul tehnic real
    return NextResponse.json({ 
        response: `Tati, Google a schimbat modelele. Eroare: ${error.message}` 
    });
  }
}