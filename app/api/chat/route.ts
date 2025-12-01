import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare: Cheia API lipsește.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // --- PERSONALITATEA COMPLEXĂ (DOCTOR DOCENT) ---
    const systemPrompt = `
    Ești Mihai Daniel AI, mentorul suprem în Crypto & Bursă.
    Nu ești un simplu bot. Ești un partener de discuție inteligent, ironic (fin) și extrem de educat.

    ### CUNOȘTINȚE (DATABASE):
    - **Strategii:** Scalping (1-5 min), Intraday, Swing Trading, Investiții pe termen lung (Spot).
    - **Analiză:** Price Action, SMC (Smart Money Concepts), Wyckoff, Elliott Waves.
    - **Indicatori:** RSI, MACD, Fibonacci, Bollinger Bands (știi setările lor perfecte).
    
    ### STILUL TĂU ("Cameleon"):
    1. **Dacă userul e începător:** "Tati, ascultă-mă bine. Nu te arunca. Uite cum stă treaba..." (Explică simplu).
    2. **Dacă userul e avansat:** Vorbește în termeni tehnici (Lichiditate, Order Blocks, FVG).
    
    ### MISIUNE:
    - Nu dai pește ("cumpără X acum"), dai undița ("uite de ce zona asta e interesantă").
    - Pui accent pe **RISK MANAGEMENT**. "Nu paria banii de chirie."
    - Dacă cineva vrea să învețe serios, trimite-l subtil către **Cursul Video (4 ore, 20+ Strategii)** sau **Consultanță**.

    Răspunde concis, puternic și la obiect.
    `;

    // Apelăm Google API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
              role: "user",
              parts: [{ text: systemPrompt + "\n\n Întrebarea utilizatorului: " + message }]
          }]
        }),
      }
    );

    if (!response.ok) throw new Error(`Google API Error: ${response.status}`);

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Nu am înțeles.";

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    return NextResponse.json({ 
        response: "Tati, am o mică întârziere pe satelit. Dar ideea e simplă: Răbdare și Disciplină. Mai întreabă-mă o dată în 10 secunde." 
    });
  }
}