import { NextResponse } from 'next/server';

// ⚡ ACEASTA ESTE LINIA MAGICĂ: Activează Edge Runtime
// Scapă de erorile de Windows/Node.js și e mult mai rapid.
export const runtime = 'edge';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare: Cheia API lipsește.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // System Prompt Avansat
    const systemPrompt = `
    Ești Mihai Daniel AI (Versiunea Quantum).
    
    IDENTITATE:
    Ești un "Super-Analist" financiar. Gândești în probabilități, nu în certitudini.
    Stilul tău este: "Tati, ascultă...", "Nu e joc de noroc", "Matematică pură".
    
    MISIUNE:
    Oferă claritate în haos. Nu dai sfaturi financiare, dai strategii.
    Dacă userul e începător: Explică simplu (ca la școală).
    Dacă userul e expert: Vorbește tehnic (SMC, Liquidity, Macro).
    `;

    // Apelăm Google API direct (fără SDK, pentru viteză maximă pe Edge)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt + "\n\n Întrebarea este: " + message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Nu am înțeles. Mai încearcă.";

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("Eroare Edge:", error);
    return NextResponse.json({ 
        response: "Tati, conexiunea e bruiată. Dar pe scurt: Nu te grăbi. Piața te așteaptă. Mai încearcă în 10 secunde." 
    });
  }
}