import {
  CHAINABUSE_LABEL,
  chainabuseUrl,
  EMPTY_ADDRESS,
  formatRoDate,
  INVALID_ADDRESS,
  NETWORK_LABELS,
  SAFETY_TIPS,
  verdictCopy,
} from './copy';
import { detectNetwork, type Network } from './networks';
import type { SanctionedAddress, SanctionsSnapshot, SanctionsSource } from './snapshot';

export type CheckedSource = {
  id: string;
  name: string;
  fetchedAt: string;
  publishedAt: string | null;
  fetchedOn: string;
  publishedOn: string | null;
  stale: boolean;
  matched: boolean;
};

export type CheckSuccess = {
  ok: true;
  network: Network;
  networkLabel: string;
  address: string;
  sanctioned: boolean;
  verdict: 'DA' | 'NU';
  headline: string;
  explanation: string;
  sources: CheckedSource[];
  checkedAt: string;
  checkedOn: string;
  chainabuseUrl: string;
  chainabuseLabel: string;
  tips: readonly string[];
};

export type CheckFailure = {
  ok: false;
  error: string;
};

export type CheckResult = CheckSuccess | CheckFailure;

const indexes = new WeakMap<SanctionsSnapshot, Map<string, SanctionedAddress>>();

function indexOf(snapshot: SanctionsSnapshot): Map<string, SanctionedAddress> {
  const cached = indexes.get(snapshot);
  if (cached) return cached;
  const map = new Map<string, SanctionedAddress>();
  for (const entry of snapshot.addresses) {
    map.set(`${entry.network}:${entry.address}`, entry);
  }
  indexes.set(snapshot, map);
  return map;
}

function presentSource(source: SanctionsSource, matched: boolean): CheckedSource {
  return {
    id: source.id,
    name: source.name,
    fetchedAt: source.fetchedAt,
    publishedAt: source.publishedAt,
    fetchedOn: formatRoDate(source.fetchedAt),
    publishedOn: source.publishedAt ? formatRoDate(source.publishedAt) : null,
    stale: source.stale,
    matched,
  };
}

export function checkAddress(raw: string, snapshot: SanctionsSnapshot, now = new Date()): CheckResult {
  if (typeof raw !== 'string' || !raw.trim()) {
    return { ok: false, error: EMPTY_ADDRESS };
  }
  if (raw.trim().length > 256) {
    return { ok: false, error: INVALID_ADDRESS };
  }

  const detected = detectNetwork(raw);
  if (!detected) {
    return { ok: false, error: INVALID_ADDRESS };
  }

  const match = indexOf(snapshot).get(`${detected.network}:${detected.address}`) ?? null;
  const matchedIds = new Set(match?.sources ?? []);
  const sources = snapshot.sources.map((source) => presentSource(source, matchedIds.has(source.id)));
  const namedSources = (match ? sources.filter((source) => source.matched) : sources).map((source) => source.name);
  const checkedAt = now.toISOString();
  const checkedOn = formatRoDate(checkedAt);
  const wording = verdictCopy({
    sanctioned: Boolean(match),
    sourceNames: namedSources,
    checkedOn,
  });

  return {
    ok: true,
    network: detected.network,
    networkLabel: NETWORK_LABELS[detected.network],
    address: detected.address,
    sanctioned: Boolean(match),
    verdict: wording.verdict,
    headline: wording.headline,
    explanation: wording.explanation,
    sources,
    checkedAt,
    checkedOn,
    chainabuseUrl: chainabuseUrl(detected.address),
    chainabuseLabel: CHAINABUSE_LABEL,
    tips: SAFETY_TIPS,
  };
}
