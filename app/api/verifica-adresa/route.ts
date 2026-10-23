import { previewAddress } from '@/lib/verifica-adresa/check';
import { jsonCors, corsPreflight } from '@/lib/verifica-adresa/cors';
import { EMPTY_ADDRESS, RATE_LIMIT_MESSAGE } from '@/lib/verifica-adresa/copy';
import { logRef } from '@/lib/verifica-adresa/hash';
import { checkRateLimiter } from '@/lib/verifica-adresa/rate-limit';
import { clientIpHash } from '@/lib/verifica-adresa/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { 'cache-control': 'no-store' };

export function OPTIONS(request: Request) {
  return corsPreflight(request);
}

/** Format and network only. Sanctions and the risk score are delivered after payment. */
export async function POST(request: Request) {
  const limit = checkRateLimiter.check(clientIpHash(request));
  if (!limit.ok) {
    return jsonCors(
      request,
      { ok: false, error: RATE_LIMIT_MESSAGE },
      {
        status: 429,
        headers: { ...NO_STORE, 'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonCors(request, { ok: false, error: EMPTY_ADDRESS }, { status: 400, headers: NO_STORE });
  }

  const address =
    body && typeof body === 'object' && 'address' in body
      ? (body as { address?: unknown }).address
      : undefined;
  if (typeof address !== 'string') {
    return jsonCors(request, { ok: false, error: EMPTY_ADDRESS }, { status: 400, headers: NO_STORE });
  }

  const result = previewAddress(address);
  if (!result.ok) {
    return jsonCors(request, result, { status: 400, headers: NO_STORE });
  }
  console.log(`[verifica-adresa] preview network=${result.network} ref=${logRef(result.address)}`);
  return jsonCors(request, result, { headers: NO_STORE });
}
