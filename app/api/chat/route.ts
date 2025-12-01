import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Aici preluam cheia setata in Vercel
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Cheia API nu este setată în Vercel.' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Ești Mihai Daniel AI. Răspunde scurt și la obiect în română.
              User întreabă: ${message}`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Google API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Nu am înțeles.";

    return NextResponse.json({ response: text });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ response: "Eroare de conexiune cu Google." }, { status: 500 });
  }
}