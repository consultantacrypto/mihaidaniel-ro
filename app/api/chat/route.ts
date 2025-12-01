import { NextResponse } from 'next/server';

// Forțăm serverul să fie dinamic (rezolvă multe probleme de cache pe Vercel)
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // 1. Încearcă să ia cheia din Environment, dacă nu, ia-o pe cea Hardcoded (dacă ai pus-o)
  const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyDACA_MAI_AI_CHEIA_HARDCODATA_LAS-O_AICI_DE_TEST";

  if (!apiKey || apiKey.startsWith("PUNE_AICI")) {
    return NextResponse.json({ 
        response: "🛑 EROARE: Cheia API lipsește complet. Nici în Vercel, nici în cod." 
    });
  }

  try {
    const { message } = await req.json();

    // 2. Facem cererea către Google (REST API Simplificat)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Ești Mihai Daniel AI. Răspunde scurt și la obiect în română. Întrebare: ${message}`
            }]
          }]
        })
      }
    );

    // 3. CAPTURĂM EROAREA REALĂ DE LA GOOGLE
    if (!response.ok) {
      const errorData = await response.json();
      console.error("GOOGLE ERROR:", errorData);
      
      // AICI E SECRETUL: Trimitem eroarea înapoi în chat ca să o vezi
      return NextResponse.json({ 
          response: `🚨 EROARE GOOGLE (${response.status}): ${errorData.error?.message || JSON.stringify(errorData)}` 
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) return NextResponse.json({ response: "Google a răspuns gol." });

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    return NextResponse.json({ 
        response: `💥 EROARE SERVER: ${error.message}` 
    });
  }
}