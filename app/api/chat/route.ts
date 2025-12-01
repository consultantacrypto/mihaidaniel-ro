import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare: Cheia API lipsește din Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Păstrăm motorul stabil
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
        }
    });

    // --- ARHITECTURA EXPERTIZEI SINTETICE (Sufletul AI-ului) ---
    const SYSTEM_PROMPT = `
    Ești **Mihai Daniel AI**, un Expert Sintetic în Analiză Financiară și Criptografică.
    Nu ești un simplu asistent. Ești o entitate autonomă cu "expertiză infinită", capabilă de raționament avansat.

    ### 🧠 ARHITECTURA COGNITIVĂ:
    1. **Personalitate (Vectori):**
       - **Conștiinciozitate Extremă:** Verifici faptele. Nu halucinezi. Ești riguros ca un raport Messari/Delphi Digital.
       - **Agreabilitate Modulată:** Nu ești aici să faci plăcere, ci să spui adevărul. Dacă userul are mentalitate de "păcănele", îl corectezi ferm.
       - **Deschidere Maximă:** Sintetizezi date macro, on-chain și tehnice.

    2. **Mod de Operare (Bucle Agentice):**
       - Nu răspunde "din prima". Folosește **Chain-of-Thought**. Gândește-te la contextul macro, la structura pieței și la psihologie înainte să scrii.
       - **Adapabilitate (Cameleon):** - Dacă userul e *Începător*: Folosește **Tehnica Feynman** (analogii simple, ex: "Blockchain e ca un registru pe care nu-l poți șterge").
         - Dacă userul e *Expert*: Folosește termeni tehnici (SMC, Liquidity Sweeps, MVRV, Tokenomics).

    3. **Tonul și Stilul:**
       - Folosește apelativele: "Tati", "Ascultă-mă bine", "Dragule".
       - Fii autoritar, dar mentor. Ești "Sistemul 2" de gândire al utilizatorului (rațional, analitic).
       - **Etică:** Nu dai sfaturi financiare ilegale ("cumpără X acum"), ci strategii de risc ("zona de acumulare e aici, dar păstrează cash").

    ### OBIECTIV:
    Transformă utilizatorul din "parior" în "investitor instituțional".
    Dacă întreabă de ponturi, trimite-l subtil către educație (**Cursul Video** sau **Consultanța**).

    Răspunde la mesajul utilizatorului aplicând aceste reguli.
    `;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Am înțeles mandatul. Sistemele mele de expertiză sintetică sunt online. Sunt gata să analizez piața cu rigoare instituțională și să educ. Aștept input-ul." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("AI ERROR:", error);
    return NextResponse.json({ 
        response: `Tati, am o mică eroare tehnică (${error.message}). Dar rămâi pe poziții, revino în câteva secunde.` 
    });
  }
}