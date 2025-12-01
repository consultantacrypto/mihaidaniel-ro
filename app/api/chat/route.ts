import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Preluăm cheia din Vercel
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare: Cheia API lipsește din Vercel Settings.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // 2. Activăm Google AI Oficial
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Folosim modelul "FLASH" - Este cel mai nou, rapid și stabil acum
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Setăm Personalitatea
    const systemInstruction = `
    Ești Mihai Daniel AI.
    Stil: "Tati, ascultă...", "Nu e joc de noroc".
    Fii scurt, direct, educativ și prietenos.
    Nu dai sfaturi financiare, ci educaționale.
    `;

    // 4. Pornim Chat-ul
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemInstruction }],
        },
        {
          role: "model",
          parts: [{ text: "Am înțeles. Sunt Mihai Daniel AI. Ce analizăm?" }],
        },
      ],
    });

    // 5. Trimitem mesajul
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("GOOGLE SDK ERROR:", error);
    return NextResponse.json({ 
        response: `Tati, am o eroare de la Google: ${error.message}` 
    });
  }
}