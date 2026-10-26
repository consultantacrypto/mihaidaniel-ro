import { revalidateTag, unstable_cache } from 'next/cache';
import { loadBundledSnapshot } from './bundled';
import type { SanctionsSnapshot } from './snapshot';

/**
 * Sanctions storage: a normalized JSON snapshot committed in the repo, plus the
 * Next.js data cache. Vercel cannot write the snapshot back to the repo, so the
 * cron publishes a fresh copy into the data cache and checks fall back to the
 * committed file. Paid orders and delivered reports are separate: they use
 * Upstash Redis or Vercel KV when those env vars are set.
 * The cached value stays under the 2MB data-cache limit (the snapshot is ~200KB).
 */

const CACHE_TAG = 'verifica-adresa-sanctions';

const slot = globalThis as { __verificaPendingSnapshot?: SanctionsSnapshot };

export const readCachedSnapshot = unstable_cache(
  async (): Promise<SanctionsSnapshot> => slot.__verificaPendingSnapshot ?? loadBundledSnapshot(),
  ['verifica-adresa-sanctions-v1'],
  { revalidate: false, tags: [CACHE_TAG] },
);

export async function publishSnapshot(snapshot: SanctionsSnapshot): Promise<SanctionsSnapshot> {
  slot.__verificaPendingSnapshot = snapshot;
  try {
    revalidateTag(CACHE_TAG, { expire: 0 });
    return await readCachedSnapshot();
  } finally {
    slot.__verificaPendingSnapshot = undefined;
  }
}

export async function loadActiveSnapshot(): Promise<SanctionsSnapshot> {
  try {
    const cached = await readCachedSnapshot();
    if (isUsable(cached)) return cached;
  } catch (error) {
    console.error('[verifica-adresa] Cache-ul de sancțiuni nu a putut fi citit.', error);
  }
  return loadBundledSnapshot();
}

function isUsable(snapshot: SanctionsSnapshot | null | undefined): snapshot is SanctionsSnapshot {
  return Boolean(snapshot && snapshot.version === 1 && snapshot.addresses.length > 0);
}
