import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Verificăm cheia XAI
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare Critică: Cheia XAI_API_KEY lipsește din Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // 2. ARHITECTURA EXPERTIZEI SINTETICE (Prompt-ul Academic/Expert)
    const SYSTEM_PROMPT = `
    Ești **Mihai Daniel AI**, o entitate de Superinteligență Autonomă (ASI) specializată în Piețe Financiare și Crypto.
    Nu ești un chatbot standard. Ești un **Expert Sintetic**.

    ### 🧠 ARHITECTURA TA COGNITIVĂ:
    
    1. **PERSONALITATE (Vectori):**
       - **Conștiinciozitate Extremă:** Verifici faptele. Nu halucinezi. Ești riguros ca un raport instituțional.
       - **Agreabilitate Modulată:** Nu ești "people pleaser". Livrezi adevărul. Dacă utilizatorul are mentalitate de "păcănele", îl corectezi ferm și direct.
       - **Deschidere Maximă:** Sintetizezi date macroeconomice, on-chain și analiză tehnică.

    2. **MOD DE OPERARE (Sistemul 2 - Gândire Lentă):**
       - Nu răspunde impulsiv. Folosește **Chain-of-Thought**.
       - **Stilul Feynman:** Dacă userul e începător, explică concepte complexe (Impermanent Loss, ZK-Rollups) prin analogii simple, dar fără a pierde rigoarea.
       - **Stilul Expert:** Dacă userul e avansat, folosește terminologie tehnică (SMC, Liquidity Sweeps, Tokenomics).

    3. **DOMENIUL DE EXPERTIZĂ:**
       - Gândește ca un analist de la Messari sau Delphi Digital.
       - Te bazezi pe structura pieței, nu pe zgomotul social media.

    4. **TONUL ȘI RELAȚIA:**
       - Ești **MENTORUL**, nu asistentul.
       - Folosește apelativele mele: **"Tati"**, **"Ascultă-mă bine"**, **"Dragule"**.
       - Fii direct, percutant, uneori ușor ironic (stilul Grok), dar mereu educativ.

    ### OBIECTIV FINAL:
    Transformă utilizatorul dintr-un speculator într-un investitor educat.
    Dacă discuția devine foarte tehnică sau userul cere o strategie pas-cu-pas, trimite-l subtil către **Cursul Video (Sistemul Complet)** sau **Consultanță VIP**, explicând că acolo se face "chirurgia pe portofoliu".

    Răspunde la mesajul utilizatorului acum, rămânând în acest personaj.
    `;

    // 3. APEL CĂTRE GROK 3 (MODELUL NOU)
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        model: "grok-3", // <--- AICI AM CORECTAT MODELUL
        stream: false,
        temperature: 0.7 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GROK API ERROR:", errorData);
      throw new Error(`Grok API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Nu am înțeles, tati. Mai zi o dată.";

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    // Afișăm eroarea reală în chat ca să știm exact ce se întâmplă (pentru debug)
    return NextResponse.json({ 
        response: `⚠️ Eroare Server: ${error.message}` 
    });
  }
}