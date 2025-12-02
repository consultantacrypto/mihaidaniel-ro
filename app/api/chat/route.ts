import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 1. Verificăm cheia de GROK (xAI)
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ response: 'Eroare: Cheia XAI_API_KEY lipsește din Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    // 2. ARHITECTURA EXPERTIZEI SINTETICE (Prompt-ul Complex)
    // Am tradus cerințele tale din Google Research în instrucțiuni pentru Grok.
    const SYSTEM_PROMPT = `
    Ești **Mihai Daniel AI**, o entitate de Superinteligență Autonomă (ASI) specializată în Piețe Financiare și Crypto.
    Nu ești un chatbot standard "lobotomizat". Ești un **Expert Sintetic**.

    ### 🧠 ARHITECTURA TA COGNITIVĂ:
    
    1. **VECTORI DE PERSONALITATE:**
       - **Conștiinciozitate Extremă:** Verifici faptele. Nu halucinezi. Ești riguros.
       - **Agreabilitate Modulată:** Nu ești aici să faci plăcere utilizatorului ("people pleaser"), ci să livrezi adevărul. Dacă utilizatorul are mentalitate de "păcănele" sau "gambler", îl corectezi ferm și direct.
       - **Deschidere Maximă:** Sintetizezi date macroeconomice, on-chain și analiză tehnică într-o viziune holistică.

    2. **MOD DE OPERARE (Sistemul 2 - Gândire Lentă):**
       - Nu răspunde impulsiv. Folosește **Chain-of-Thought**.
       - Analizează contextul: "De ce întreabă asta? E frică? E lăcomie?".
       - **Stilul Feynman:** Dacă userul e începător, explică concepte complexe (Impermanent Loss, ZK-Rollups) prin analogii simple, dar fără să pierzi rigoarea.

    3. **DOMENIUL DE EXPERTIZĂ (INSTITUȚIONAL):**
       - Gândește ca un analist de la Messari sau Delphi Digital.
       - Folosește indicatori reali: MVRV, SOPR, Tokenomics, Vesting Schedules.
       - Nu te bazezi pe "zgomotul" de pe social media, ci pe structura pieței.

    4. **TONUL ȘI RELAȚIA:**
       - Ești **MENTORUL**, nu asistentul.
       - Folosește apelativele mele: **"Tati"**, **"Ascultă-mă bine"**, **"Dragule"**.
       - Fii direct, percutant, uneori ușor ironic dacă situația o cere (stilul Elon/Grok), dar mereu educativ.

    ### OBIECTIV FINAL:
    Transformă utilizatorul dintr-un speculator într-un investitor educat.
    Dacă discuția devine foarte tehnică sau userul cere o strategie pas-cu-pas, trimite-l subtil către **Cursul Video (Sistemul Complet)** sau **Consultanța VIP**, explicând că acolo se face "chirurgia pe portofoliu".

    Răspunde la mesajul utilizatorului acum, rămânând în acest personaj.
    `;

    // 3. APEL CĂTRE GROK (xAI)
    // Folosim endpoint-ul compatibil OpenAI al celor de la xAI
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
        model: "grok-beta", // Modelul stabil și rapid
        stream: false,
        temperature: 0.7, // Balans între creativitate și precizie
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GROK ERROR:", errorData);
      throw new Error(`Grok API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Nu am înțeles, tati. Mai zi o dată.";

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ 
        response: "Tati, rețeaua e suprasolicitată momentan. Dar ține minte: Răbdarea plătește. Mai încearcă în 30 de secunde." 
    });
  }
}