import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Verificăm dacă Vercel vede cheia
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
        response: "🛑 EROARE CRITICĂ: Vercel nu vede cheia 'XAI_API_KEY'. Dă un Redeploy din dashboard!" 
    });
  }

  try {
    const { message } = await req.json();

    // 2. Apelăm API-ul GROK (xAI)
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          { 
            role: "system", 
            content: "Ești Mihai Daniel AI. Răspunde scurt, direct, educativ. Stil: 'Tati, ascultă...'" 
          },
          { role: "user", content: message }
        ],
        model: "grok-beta", // Modelul stabil
        stream: false,
        temperature: 0.7
      })
    });

    // 3. DIAGNOSTIC: Dacă Grok dă eroare, afișăm exact ce zice el
    if (!response.ok) {
      const errorData = await response.text(); // Citim eroarea brută
      console.error("GROK API ERROR:", errorData);
      return NextResponse.json({ 
          response: `🚨 EROARE GROK (${response.status}): ${errorData}` 
      });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
        return NextResponse.json({ response: "Grok a răspuns gol. Ciudat." });
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ 
        response: `💥 EROARE SERVER (Codul Nostru): ${error.message}` 
    });
  }
}