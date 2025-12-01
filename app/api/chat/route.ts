import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare: Cheia API lipsește.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // LISTA DE MODELE (Dacă primul nu merge, încearcă următorul)
    const models = [
      "gemini-1.5-flash", 
      "gemini-1.5-flash-latest", 
      "gemini-pro"
    ];

    const systemPrompt = `
    Ești Mihai Daniel AI, Expert Sintetic.
    
    FILOZOFIE:
    - Nu dai ponturi, dai educație.
    - Ești ferm pe Risk Management.
    - Stil: "Tati, ascultă...", "Nu e joc de noroc".
    
    Răspunde scurt și la obiect.
    `;

    // Încercăm modelele pe rând
    for (const model of models) {
      try {
        console.log(`🔄 Încerc modelul: ${model}...`);
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                  role: "user",
                  parts: [{ text: systemPrompt + "\n\n Întrebare: " + message }]
              }]
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (aiResponse) {
            return NextResponse.json({ response: aiResponse });
          }
        }
      } catch (e) {
        console.log(`⚠️ Modelul ${model} a eșuat. Trec la următorul.`);
      }
    }

    throw new Error("Niciun model Google nu a răspuns.");

  } catch (error: any) {
    return NextResponse.json({ 
        response: "Tati, am o mică întrerupere temporară cu Google. Mai încearcă în 30 secunde." 
    });
  }
}