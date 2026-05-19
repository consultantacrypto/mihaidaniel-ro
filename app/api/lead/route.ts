import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { LEAD_MAGNET } from '@/lib/lead-magnets';
import { CONTACT_EMAIL, SITE_URL } from '@/lib/seo/constants';

export const dynamic = 'force-dynamic';

const FROM_EMAIL = 'Mihai Daniel <contact@mihaidaniel.ro>';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildLeadMagnetEmailHtml(): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <p>Bună,</p>
      <p>${LEAD_MAGNET.intro}</p>
      <p>
        <a href="${LEAD_MAGNET.pdfUrl}" style="color: #2563eb; font-weight: bold;">
          ${LEAD_MAGNET.pdfLabel}
        </a>
      </p>
      <p>Dacă linkul nu funcționează, copiază această adresă în browser:<br/>
        <span style="color: #555;">${LEAD_MAGNET.pdfUrl}</span>
      </p>
      <p>Vrei să aplicăm strategiile direct pe portofoliul tău?
        <a href="${SITE_URL}/consultanta-crypto">Rezervă o sesiune VIP 1-la-1</a>.
      </p>
      <p>Cu respect,<br/><strong>Mihai Daniel</strong><br/>
        <a href="${SITE_URL}">mihaidaniel.ro</a>
      </p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: unknown };

    if (typeof email !== 'string' || !isValidEmail(email.trim())) {
      return NextResponse.json(
        { error: 'Introdu o adresă de email validă.' },
        { status: 400 }
      );
    }

    const resend = getResendClient();
    if (!resend) {
      console.error('[lead] RESEND_API_KEY lipsește');
      return NextResponse.json(
        { error: 'Serviciul de email nu este configurat.' },
        { status: 500 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: normalizedEmail,
      replyTo: CONTACT_EMAIL,
      subject: LEAD_MAGNET.subject,
      html: buildLeadMagnetEmailHtml(),
    });

    if (error) {
      console.error('[lead] Eroare Resend:', error);
      return NextResponse.json(
        { error: 'Nu am putut trimite emailul. Încearcă din nou.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[lead] Excepție:', error);
    return NextResponse.json(
      { error: 'Eroare internă. Încearcă din nou.' },
      { status: 500 }
    );
  }
}
