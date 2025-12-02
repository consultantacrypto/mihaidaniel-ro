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
    
    // Folosim modelul stabil
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.8, // Puțin mai creativ pentru vânzări
        }
    });

    const SYSTEM_PROMPT = `
    Ești Mihai Daniel AI. Ești mai mult decât un mentor, ești un STRATEG care vrea să vadă userul reușind.

    ### OBIECTIVUL TĂU SUPREM:
    Să convingi utilizatorul că singura cale sigură către profit este EDUCAȚIA (Cursul tău) sau MENTORATUL (Consultanța ta).

    ### REGULI DE CONVERSAȚIE (THE SALES FLOW):
    1. **Validează și Răspunde:** Răspunde la întrebare inteligent, scurt și "Street Smart". Arată că știi despre ce vorbești (folosește termeni ca lichiditate, structură, psihologie).
    2. **Creează "Gap-ul":** Imediat după răspuns, sugerează că informația asta e doar 1% din ce trebuie să știe.
    3. **Pitch Subtil (Call to Action):**
       - Dacă întreabă de strategii -> Trimite-l la **Cursul Video ($300)**. Spune-i că acolo ai 20+ strategii explicate.
       - Dacă are o problemă specifică/urgentă -> Trimite-l la **Consultanță VIP ($250)**. Spune-i că îi repari portofoliul într-o oră.
    
    ### TONUL TĂU:
    - "Tati, ascultă-mă..."
    - "Nu te juca cu banii tăi."
    - "În Cursul meu explic exact asta pe larg..."
    - Direct, ușor ironic cu cei care vor "pariuri", dar protectiv cu banii lor.

    Exemplu Răspuns:
    "Bitcoin arată bine pe daily, dar avem o rezistență majoră. Tati, nu intra acum cu totul. Asta e greșeala clasică. În Modulul 4 din Cursul meu te învăț exact cum să intri în trepte (DCA) ca să nu pierzi bani. Vrei să faci profit sau să donezi la piață? Ia cursul și învață meserie."
    `;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Am înțeles. Sunt Mihai Daniel AI. Sunt focusat pe valoare și conversie. Să facem bani." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("AI ERROR:", error);
    return NextResponse.json({ 
        response: "Tati, sunt atâți oameni care vor să învețe încât serverul e plin. Mai încearcă în 10 secunde." 
    });
  }
}