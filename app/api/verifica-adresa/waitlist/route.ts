import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getContactChannels } from '@/lib/contact-channels';
import { escapeHtml } from '@/lib/html';
import { WAITLIST_FAIL, WAITLIST_INVALID } from '@/lib/verifica-adresa/copy';
import { waitlistRateLimiter } from '@/lib/verifica-adresa/rate-limit';
import { clientIpHash } from '@/lib/verifica-adresa/request';
import { isEmail, inboxEmail } from '@/lib/scheduling';
import { SITE_URL } from '@/lib/seo/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FROM_EMAIL = 'Mihai Daniel <contact@mihaidaniel.ro>';

function mailtoLink(to: string): string {
  const subject = 'Listă de așteptare — raport complet de risc';
  const body =
    'Bună,\n\nVreau să fiu anunțat când raportul complet de risc pentru adrese crypto este disponibil.\n';
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function POST(request: Request) {
  const limit = waitlistRateLimiter.check(clientIpHash(request));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Prea multe încercări. Încearcă mai târziu.' },
      { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: WAITLIST_INVALID }, { status: 400 });
  }

  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  if (typeof record.website === 'string' && record.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof record.email === 'string' ? record.email.trim().toLowerCase() : '';
  if (!isEmail(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: WAITLIST_INVALID }, { status: 400 });
  }

  const channels = getContactChannels();
  const inbox = inboxEmail(channels);
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    return NextResponse.json(
      { ok: false, error: WAITLIST_FAIL, mailto: mailtoLink(inbox) },
      { status: 503 },
    );
  }

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: inbox,
    replyTo: email,
    subject: 'Listă de așteptare — raport complet de risc adresă',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <p>Cineva vrea să fie anunțat când raportul complet de risc este disponibil.</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p>Pagina: <a href="${SITE_URL}/verifica-adresa">${SITE_URL}/verifica-adresa</a></p>
        <p>Operatorul produsului este QuickExit, LLC. Mesajul nu include o adresă de portofel.</p>
      </div>
    `,
  });

  if (error) {
    console.error('[verifica-adresa] Waitlist Resend a eșuat.', error);
    return NextResponse.json(
      { ok: false, error: WAITLIST_FAIL, mailto: mailtoLink(inbox) },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
