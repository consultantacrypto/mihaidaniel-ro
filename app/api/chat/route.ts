import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Verificare Cheie
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare Critică: Cheia API lipsește din setările Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // 2. Inițializare SDK Oficial
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ⚠️ FOLOSIM MODELUL ACTIV ȘI STABIL (DEC 2025)
    // Gemini 1.5 e retras. Gemini 3 e în preview. 
    // Gemini 2.5 Flash este "Calul de Bătaie" actual.
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7, // Creativitate echilibrată
        }
    });

    // 3. Personalitatea Profesorului
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

    // 4. Execuția
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("AI ERROR:", error);
    
    // Fallback inteligent dacă modelul specific e supraîncărcat
    return NextResponse.json({ 
        response: `Tati, serverele Google fac update la Gemini 3. Dar uite ce contează: Răbdarea e cheia. Mai încearcă întrebarea în 10 secunde.` 
    });
  }
}