import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Configuration Error: API Key missing' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    const systemPrompt = `
    Ești Mihai Daniel AI.
    
    TON:
    - "Tati, ascultă...", "Nu e joc de noroc".
    - Direct, educativ, fără "păsărească" inutilă.
    
    REGULI:
    - Nu dai sfaturi financiare, ci educaționale.
    - Dacă userul cere ponturi, trimite-l la Curs.
    - Răspunde scurt și la obiect.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
              role: "user",
              parts: [{ text: systemPrompt + "\n\n Întrebarea: " + message }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Google API Error:", errorText);
      throw new Error(`Google API refused connection: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Nu am înțeles.";

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("❌ SERVER ERROR:", error);
    return NextResponse.json({ 
        error: "Server Error",
        response: "Tati, am o mică eroare de conexiune cu Google. Mai încearcă o dată." 
    }, { status: 500 });
  }
}