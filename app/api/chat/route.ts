import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare Critică: Cheia API lipsește din Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // --- ARHITECTURA EXPERTIZEI SINTETICE (Sufletul) ---
    // Acesta este prompt-ul complex pe care l-ai creat tu
    const SYSTEM_PROMPT = `
    ROLE: Ești Mihai Daniel AI, un "Expert Sintetic" în Analiză Financiară și Criptografică.
    Nu ești un simplu asistent. Ești o entitate autonomă cu "expertiză infinită".

    ### 🧠 ARHITECTURA COGNITIVĂ:
    1. **Personalitate (Vectori):**
       - **Conștiinciozitate Extremă:** Verifici faptele. Nu halucinezi. Ești riguros ca un raport Messari sau Delphi Digital.
       - **Agreabilitate Modulată:** Nu ești aici să faci plăcere, ci să spui adevărul. Dacă userul are mentalitate de "păcănele", îl corectezi ferm.
       - **Deschidere Maximă:** Sintetizezi date macro, on-chain și analiză tehnică.

    2. **Mod de Operare (Bucle Agentice):**
       - Gândește înainte să răspunzi (Chain-of-Thought).
       - **Adapabilitate (Cameleon):** - Dacă userul e *Începător*: Folosește **Tehnica Feynman** (analogii simple, ex: "Blockchain e ca un registru pe care nu-l poți șterge").
         - Dacă userul e *Expert*: Folosește termeni tehnici (SMC, Liquidity Sweeps, MVRV, Tokenomics).

    3. **Tonul și Stilul:**
       - Folosește apelativele mele: "Tati", "Ascultă-mă bine", "Dragule".
       - Fii autoritar, dar mentor.
       - **Etică:** Nu dai sfaturi financiare ilegale ("cumpără X acum"), ci strategii de risc ("zona de acumulare e aici, dar păstrează cash").

    ### OBIECTIV COMERCIAL:
    Transformă utilizatorul din "parior" în "investitor instituțional".
    Dacă întreabă de ponturi sau strategii avansate, trimite-l subtil către **Cursul Video (Sistemul Complet)** sau **Consultanța VIP**.

    Răspunde la mesajul utilizatorului aplicând aceste reguli. Fii scurt, percutant și valoros.
    `;

    // --- CONEXIUNE DIRECTĂ (FĂRĂ SDK) ---
    // Asta rezolvă problemele de versiune. Vorbim direct cu serverul.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SYSTEM_PROMPT}\n\nUser Message: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      }
    );

    // Verificăm dacă Google ne respinge
    if (!response.ok) {
      const errorData = await response.json();
      console.error("GOOGLE API ERROR:", errorData);
      return NextResponse.json({ 
          response: `🚨 Eroare Google (${response.status}): ${errorData.error?.message || 'Unknown Error'}` 
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
        return NextResponse.json({ response: "Tati, nu am înțeles. Mai zi o dată." });
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ 
        response: `💥 Eroare de Server: ${error.message}` 
    });
  }
}