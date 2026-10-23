import { createPaidCheckout, parseCheckoutBody } from '@/lib/verifica-adresa/checkout';
import { jsonCors, corsPreflight } from '@/lib/verifica-adresa/cors';
import { assertCheckoutAllowed, getQuickexitStripe } from '@/lib/verifica-adresa/payments';
import { checkoutRateLimiter } from '@/lib/verifica-adresa/rate-limit';
import { clientIpHash } from '@/lib/verifica-adresa/request';
import { getCheckerStore } from '@/lib/verifica-adresa/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PENDING_TTL_SECONDS = 48 * 60 * 60;

export function OPTIONS(request: Request) {
  return corsPreflight(request);
}

export async function POST(request: Request) {
  const allowed = assertCheckoutAllowed();
  if (!allowed.ok) {
    return jsonCors(
      request,
      { ok: false, error: allowed.error, code: 'payments_disabled' },
      { status: allowed.status },
    );
  }

  const limit = checkoutRateLimiter.check(clientIpHash(request));
  if (!limit.ok) {
    return jsonCors(
      request,
      { ok: false, error: 'Prea multe încercări de plată. Încearcă mai târziu.' },
      { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonCors(request, { ok: false, error: 'Alege un raport sau un pachet.' }, { status: 400 });
  }

  const parsed = parseCheckoutBody(body);
  if (!parsed.ok) {
    return jsonCors(request, { ok: false, error: parsed.error }, { status: parsed.status });
  }

  try {
    const stripe = getQuickexitStripe();
    const session = await createPaidCheckout(parsed, {
      store: getCheckerStore(),
      orderTtlSeconds: PENDING_TTL_SECONDS,
      createSession: async (params, idempotencyKey) => {
        const created = await stripe.checkout.sessions.create(params, { idempotencyKey });
        return { id: created.id, url: created.url };
      },
    });
    return jsonCors(request, { ok: true, url: session.url });
  } catch (error) {
    console.error('[verifica-adresa] Checkout QuickExit a eșuat.', error);
    return jsonCors(request, { ok: false, error: 'Plata nu a putut fi pornită.' }, { status: 502 });
  }
}
