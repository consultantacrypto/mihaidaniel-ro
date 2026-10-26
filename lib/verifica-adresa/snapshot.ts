import type { Network } from './networks';
import {
  SANCTION_SOURCE_META,
  type SanctionsSourceId,
} from './sources';
import type { ParsedSanctionAddress } from './parse-lists';

export type SanctionsSource = {
  id: SanctionsSourceId;
  name: string;
  publisher: string;
  url: string;
  fetchedAt: string;
  publishedAt: string | null;
  addressCount: number;
  stale: boolean;
};

export type SanctionedAddress = {
  network: Network;
  address: string;
  sources: SanctionsSourceId[];
  assets: string[];
};

export type SanctionsSnapshot = {
  version: 1;
  generatedAt: string;
  sources: SanctionsSource[];
  addresses: SanctionedAddress[];
};

export function mergeSanctionEntries(entries: ParsedSanctionAddress[]): SanctionedAddress[] {
  const map = new Map<string, SanctionedAddress>();
  for (const entry of entries) {
    const key = `${entry.network}:${entry.address}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        network: entry.network,
        address: entry.address,
        sources: [entry.source],
        assets: [entry.asset],
      });
      continue;
    }
    if (!existing.sources.includes(entry.source)) existing.sources.push(entry.source);
    if (!existing.assets.includes(entry.asset)) existing.assets.push(entry.asset);
  }

  return [...map.values()]
    .map((entry) => ({
      ...entry,
      sources: [...entry.sources].sort(),
      assets: [...entry.assets].sort(),
    }))
    .sort((a, b) => a.network.localeCompare(b.network) || a.address.localeCompare(b.address));
}

export function sourceRecord(input: {
  id: SanctionsSourceId;
  url: string;
  fetchedAt: string;
  publishedAt: string | null;
  addressCount: number;
  stale?: boolean;
}): SanctionsSource {
  const meta = SANCTION_SOURCE_META[input.id];
  return {
    id: input.id,
    name: meta.name,
    publisher: meta.publisher,
    url: input.url,
    fetchedAt: input.fetchedAt,
    publishedAt: input.publishedAt,
    addressCount: input.addressCount,
    stale: input.stale ?? false,
  };
}

export function isSanctionsSnapshot(value: unknown): value is SanctionsSnapshot {
  if (!value || typeof value !== 'object') return false;
  const snapshot = value as SanctionsSnapshot;
  return snapshot.version === 1 && Array.isArray(snapshot.addresses) && Array.isArray(snapshot.sources);
}
