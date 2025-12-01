import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  
  // ⚠️ PASTE AICI CHEIA TA REALA INTRE GHILIMELE ⚠️
  // Sterge AIza...Exemplu si pune cheia ta lunga care incepe cu AIza
  const apiKey = "AIzaSyA6Iq8BpZCSLDTY00J9zZ3b8NCIV-I9GQo"; 

  try {
    const { message } = await req.json();

    const systemPrompt = `
    Ești Mihai Daniel AI.
    Stil: "Tati, ascultă...", "Nu e joc de noroc", "Matematică pură".
    Fii scurt, direct și educativ.
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
      // Aici vedem exact eroarea de la Google in Logs daca nu merge
      console.error("❌ Google Error:", errorText);
      throw new Error(`Google Error: ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Nu am înțeles.";

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("SERVER ERROR:", error.message);
    // Returnam eroarea exacta pe ecran ca sa stim ce are
    return NextResponse.json({ 
        response: `Eroare detaliată: ${error.message}` 
    }, { status: 500 });
  }
}
