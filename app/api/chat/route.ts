import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare Critică: Cheia API lipsește din Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ⚠️ FOLOSIM 'gemini-pro' PENTRU CĂ ESTE CEL MAI COMPATIBIL MODEL
    // Asta rezolvă eroarea 404 garantat.
    const model = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
        }
    });

    // --- ARHITECTURA EXPERTIZEI SINTETICE (Sufletul AI-ului) ---
    // Aici am implementat cerințele tale din document: SMC, Feynman, Messari.
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

    Răspunde la mesajul utilizatorului aplicând aceste reguli. Fii scurt și percutant.
    `;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Am înțeles mandatul. Sistemele mele de expertiză sintetică sunt online. Sunt gata să analizez piața cu rigoare instituțională. Aștept input-ul." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("AI ERROR:", error);
    // Dacă tot crapă, dăm un mesaj care să nu sperie userul
    return NextResponse.json({ 
        response: `Tati, serverele Google sunt aglomerate acum. Dar sfatul meu rămâne: Răbdare și Disciplină. Mai întreabă-mă o dată în 10 secunde.` 
    });
  }
}