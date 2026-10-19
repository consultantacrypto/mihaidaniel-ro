import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getContactChannels } from '@/lib/contact-channels';
import { escapeHtml } from '@/lib/html';
import { inboxEmail, isEmail, whatsappHref } from '@/lib/scheduling';

export const dynamic = 'force-dynamic';

const FROM_EMAIL = 'Mihai Daniel <contact@mihaidaniel.ro>';

const SUBJECTS = [
  'Suport General',
  'Consultanță 1-la-1',
  'Problemă Acces Academie',
  'Propunere Parteneriat',
  'Presă / Media',
] as const;

type Subject = (typeof SUBJECTS)[number];

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function isSubject(value: string): value is Subject {
  return (SUBJECTS as readonly string[]).includes(value);
}

function buildMailto(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildBodyText(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  return `Bună, Mihai. Sunt ${input.name} (${input.email}).\nSubiect: ${input.subject}\n\n${input.message}`;
}

function handoff(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const channels = getContactChannels();
  const text = buildBodyText(input);
  return {
    ok: false as const,
    fallback: true as const,
    error: 'Nu am putut trimite mesajul automat.',
    mailto: channels.email ? buildMailto(channels.email, input.subject, text) : null,
    whatsapp: channels.whatsappUrl
      ? whatsappHref(channels.whatsappUrl, text)
      : null,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, md_hp: honeypot } = body as {
      name?: unknown;
      email?: unknown;
      subject?: unknown;
      message?: unknown;
      md_hp?: unknown;
    };

    if (typeof honeypot === 'string' && honeypot.trim()) {
      return NextResponse.json({ ok: true });
    }

    if (typeof name !== 'string' || !name.trim() || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { ok: false, error: 'Completează numele, emailul și mesajul.' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !isEmail(email.trim())) {
      return NextResponse.json(
        { ok: false, error: 'Introdu o adresă de email validă.' },
        { status: 400 }
      );
    }

    if (typeof subject !== 'string' || !isSubject(subject)) {
      return NextResponse.json(
        { ok: false, error: 'Alege un subiect din listă.' },
        { status: 400 }
      );
    }

    const payload = {
      name: name.trim().slice(0, 120),
      email: email.trim().toLowerCase().slice(0, 200),
      subject,
      message: message.trim().slice(0, 4000),
    };

    const resend = getResendClient();
    if (!resend) {
      console.error('[contact] RESEND_API_KEY lipsește');
      return NextResponse.json(handoff(payload), { status: 503 });
    }

    const channels = getContactChannels();
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin-top: 0;">Mesaj nou de pe site</h2>
        <p><strong>Nume:</strong> ${escapeHtml(payload.name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
        <p><strong>Subiect:</strong> ${escapeHtml(payload.subject)}</p>
        <p style="white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #666; font-size: 12px;">Trimis din formularul /contact</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: inboxEmail(channels),
      replyTo: payload.email,
      subject: `Mesaj de pe site: ${payload.subject}`,
      html,
    });

    if (error) {
      console.error('[contact] Eroare Resend:', error);
      return NextResponse.json(handoff(payload), { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] Excepție:', error);
    return NextResponse.json(
      { ok: false, error: 'Nu am putut trimite mesajul. Încearcă din nou.' },
      { status: 500 }
    );
  }
}
