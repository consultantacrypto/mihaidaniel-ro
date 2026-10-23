import { NextResponse } from 'next/server';
import { publishSnapshot } from '@/lib/verifica-adresa/cache';
import { loadBundledSnapshot } from '@/lib/verifica-adresa/bundled';
import { euEntriesFromSnapshot, fetchOfficialSnapshot } from '@/lib/verifica-adresa/fetch-lists';
import { cronAuthorized } from '@/lib/verifica-adresa/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!cronAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Neautorizat.' }, { status: 401 });
  }

  const bundled = loadBundledSnapshot();
  const result = await fetchOfficialSnapshot({
    fallbackEu: euEntriesFromSnapshot(bundled),
  });

  if (!result.ok) {
    console.error('[verifica-adresa] Refresh eșuat.', result.error);
    return NextResponse.json(
      { ok: false, error: result.error, storage: 'bundled-snapshot' },
      { status: 502 },
    );
  }

  const summary = {
    generatedAt: result.snapshot.generatedAt,
    addresses: result.snapshot.addresses.length,
    sources: result.snapshot.sources.map((source) => ({
      id: source.id,
      addressCount: source.addressCount,
      publishedAt: source.publishedAt,
      stale: source.stale,
    })),
  };

  try {
    await publishSnapshot(result.snapshot);
  } catch (error) {
    console.error('[verifica-adresa] Publicarea în data cache a eșuat. Rămâne snapshot-ul din repo.', error);
    return NextResponse.json({ ok: true, published: false, storage: 'bundled-snapshot', ...summary });
  }

  return NextResponse.json({ ok: true, published: true, storage: 'data-cache', ...summary });
}
