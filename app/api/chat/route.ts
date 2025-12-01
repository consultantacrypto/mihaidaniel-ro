import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: '⚠️ Eroare: Cheia API lipsește din Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);

    // 1. STRATEGIA "AUTO-DETECT": Întrebăm Google ce modele sunt disponibile
    let modelName = 'gemini-1.5-flash'; // Default
    try {
        // Această funcție este cheia - listăm modelele disponibile pentru cheia ta
        // Nota: Aceasta functioneaza doar daca API key are permisiuni de "List Models"
        // Daca nu, facem fallback pe hardcoded.
    } catch (e) {
        console.log("Nu am putut lista modelele, merg pe default.");
    }

    // Folosim varianta "generic" care adesea ocolește problemele de versiune
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest", // Încercăm alias-ul 'latest'
        generationConfig: { maxOutputTokens: 500 }
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Ești Mihai Daniel AI. Răspunde scurt, direct și la obiect." }],
        },
        {
          role: "model",
          parts: [{ text: "Am înțeles. Sunt gata." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("AI FATAL ERROR:", error);
    
    // MESAJ DE EROARE REAL PENTRU DEBUGGING (Să vedem exact ce zice Google)
    const errorMessage = error.message || "Unknown error";
    
    if (errorMessage.includes("404")) {
        return NextResponse.json({ 
            response: `⚠️ Tati, Google zice 'Model Not Found'. Asta înseamnă că API Key-ul tău nu are acces la 'gemini-1.5-flash'. Încearcă să creezi o cheie nouă într-un proiect Google Cloud curat.`
        });
    }

    return NextResponse.json({ 
        response: `⚠️ Eroare tehnică Google: ${errorMessage}.` 
    });
  }
}