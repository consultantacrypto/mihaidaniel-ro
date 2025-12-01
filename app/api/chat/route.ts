import { NextResponse } from 'next/server';

// Forțăm serverul să nu țină cache (Să fie mereu fresh)
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
        response: "🛑 EROARE: Cheia API lipsește din Vercel. Verifică Settings -> Environment Variables." 
    });
  }

  try {
    const { message } = await req.json();

    // 1. Definim Personalitatea
    const systemPrompt = `
    Ești Mihai Daniel AI.
    
    TON:
    - Prietenos, direct, autoritar ("Tati", "Ascultă-mă").
    - Nu ești robot, ești mentor.
    
    REGULI:
    - Nu dai sfaturi financiare explicite ("cumpără acum"), ci educaționale.
    - Dacă userul vrea ponturi, trimite-l la Curs.
    - Răspunde scurt și la obiect.
    `;

    // 2. Apelăm modelul STABIL "gemini-pro" (Ăsta merge 100%)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nÎntrebarea userului: ${message}`
            }]
          }]
        })
      }
    );

    // 3. Verificăm dacă Google răspunde cu eroare
    if (!response.ok) {
      const errorData = await response.json();
      console.error("GOOGLE ERROR:", errorData);
      return NextResponse.json({ 
          response: `🚨 Eroare Google (${response.status}): Modelul nu răspunde. Încearcă mai târziu.` 
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) return NextResponse.json({ response: "Nu am înțeles întrebarea." });

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    return NextResponse.json({ 
        response: `💥 Eroare Server: ${error.message}` 
    });
  }
}