import { NextResponse } from 'next/server';
import { checkAddress } from '@/lib/verifica-adresa/check';
import { loadActiveSnapshot } from '@/lib/verifica-adresa/cache';
import { EMPTY_ADDRESS, GENERIC_ERROR, RATE_LIMIT_MESSAGE } from '@/lib/verifica-adresa/copy';
import { logRef } from '@/lib/verifica-adresa/hash';
import { checkRateLimiter } from '@/lib/verifica-adresa/rate-limit';
import { clientIpHash } from '@/lib/verifica-adresa/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { 'cache-control': 'no-store' };

export async function POST(request: Request) {
  const limit = checkRateLimiter.check(clientIpHash(request));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: RATE_LIMIT_MESSAGE },
      {
        status: 429,
        headers: {
          ...NO_STORE,
          'retry-after': String(Math.ceil(limit.retryAfterMs / 1000)),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: EMPTY_ADDRESS }, { status: 400, headers: NO_STORE });
  }

  const address =
    body && typeof body === 'object' && 'address' in body
      ? (body as { address?: unknown }).address
      : undefined;
  if (typeof address !== 'string') {
    return NextResponse.json({ ok: false, error: EMPTY_ADDRESS }, { status: 400, headers: NO_STORE });
  }

  try {
    const snapshot = await loadActiveSnapshot();
    const result = checkAddress(address, snapshot);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400, headers: NO_STORE });
    }
    console.log(
      `[verifica-adresa] network=${result.network} verdict=${result.verdict} ref=${logRef(result.address)}`,
    );
    return NextResponse.json(result, { headers: NO_STORE });
  } catch (error) {
    console.error('[verifica-adresa] Verificarea a eșuat.', error);
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 500, headers: NO_STORE });
  }
}
