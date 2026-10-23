import { NextResponse } from 'next/server';
import { INVALID_ADDRESS } from '@/lib/verifica-adresa/copy';
import { detectNetwork } from '@/lib/verifica-adresa/networks';
import { sha256Hex } from '@/lib/verifica-adresa/hash';
import {
  assertCheckoutAllowed,
  buildCheckoutSessionParams,
  getQuickexitStripe,
  resolveOffer,
  siteOrigin,
} from '@/lib/verifica-adresa/payments';
import { checkoutRateLimiter } from '@/lib/verifica-adresa/rate-limit';
import { clientIpHash } from '@/lib/verifica-adresa/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const allowed = assertCheckoutAllowed();
  if (!allowed.ok) {
    return NextResponse.json({ ok: false, error: allowed.error, code: 'payments_disabled' }, { status: allowed.status });
  }

  const limit = checkoutRateLimiter.check(clientIpHash(request));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Prea multe încercări de plată. Încearcă mai târziu.' },
      { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Alege un raport sau un pachet.' }, { status: 400 });
  }

  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const offer = resolveOffer(record.offerId);
  if (!offer) {
    return NextResponse.json({ ok: false, error: 'Oferta nu există.' }, { status: 400 });
  }

  let addressSha256: string | undefined;
  if (typeof record.address === 'string' && record.address.trim()) {
    const detected = detectNetwork(record.address);
    if (!detected) {
      return NextResponse.json({ ok: false, error: INVALID_ADDRESS }, { status: 400 });
    }
    addressSha256 = sha256Hex(`${detected.network}:${detected.address}`);
  }

  try {
    const origin = siteOrigin(request);
    const session = await getQuickexitStripe().checkout.sessions.create(
      buildCheckoutSessionParams({ offer, origin, addressSha256 }),
      {
        idempotencyKey: sha256Hex(`${offer.id}|${addressSha256 ?? 'none'}|${Math.floor(Date.now() / 60000)}`).slice(0, 64),
      },
    );
    if (!session.url) {
      return NextResponse.json({ ok: false, error: 'Stripe nu a întors o adresă de plată.' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    console.error('[verifica-adresa] Checkout QuickExit a eșuat.', error);
    return NextResponse.json({ ok: false, error: 'Plata nu a putut fi pornită.' }, { status: 502 });
  }
}
