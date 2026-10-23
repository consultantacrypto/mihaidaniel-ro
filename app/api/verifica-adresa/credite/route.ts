import { jsonCors, corsPreflight } from '@/lib/verifica-adresa/cors';
import { isPublicToken, reportPageUrl, canonicalSiteOrigin } from '@/lib/verifica-adresa/embed';
import { redeemCredit } from '@/lib/verifica-adresa/fulfillment';
import { productionFulfillDeps } from '@/lib/verifica-adresa/runtime';
import { paymentsReady } from '@/lib/verifica-adresa/config';
import { checkRateLimiter } from '@/lib/verifica-adresa/rate-limit';
import { clientIpHash } from '@/lib/verifica-adresa/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function OPTIONS(request: Request) {
  return corsPreflight(request);
}

export async function POST(request: Request) {
  if (!paymentsReady().ok) {
    return jsonCors(request, { ok: false, error: 'Verificările plătite nu sunt active pe acest mediu.' }, { status: 403 });
  }

  const limit = checkRateLimiter.check(clientIpHash(request));
  if (!limit.ok) {
    return jsonCors(
      request,
      { ok: false, error: 'Prea multe verificări. Încearcă mai târziu.' },
      { status: 429, headers: { 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonCors(request, { ok: false, error: 'Date lipsă.' }, { status: 400 });
  }

  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const token = typeof record.token === 'string' ? record.token : '';
  const address = typeof record.address === 'string' ? record.address : '';
  if (!isPublicToken(token)) {
    return jsonCors(request, { ok: false, error: 'Linkul pachetului nu este valid.' }, { status: 400 });
  }

  try {
    const deps = await productionFulfillDeps();
    const result = await redeemCredit({ token, address, consent: record.consent === true }, deps);
    if (!result.ok) {
      return jsonCors(request, { ok: false, error: result.error }, { status: result.status });
    }
    return jsonCors(request, {
      ok: true,
      publicId: result.report.publicId,
      reportUrl: reportPageUrl(canonicalSiteOrigin(), result.report.token),
    });
  } catch (error) {
    console.error('[verifica-adresa] Consumul unui credit a eșuat.', error);
    return jsonCors(request, { ok: false, error: 'Verificarea nu a putut fi pornită.' }, { status: 500 });
  }
}
