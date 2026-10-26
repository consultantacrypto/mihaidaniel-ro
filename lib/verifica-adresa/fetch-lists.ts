import { unzipFirstFile } from './zip';
import { parseEuSanctionsXml, parseOfacSdnXml, type ParsedSanctionAddress } from './parse-lists';
import { mergeSanctionEntries, sourceRecord, type SanctionsSnapshot } from './snapshot';
import { EU_FSD_XML_URL, OFAC_SDN_XML_URL, OFAC_SDN_ZIP_URL } from './sources';

const USER_AGENT = 'mihaidaniel-verifica-adresa/1.0 (+https://www.mihaidaniel.ro/verifica-adresa)';

/** Below this, a parse is treated as a broken download rather than a real list. */
export const MIN_OFAC_ADDRESSES = 50;

export type FetchSnapshotResult =
  | { ok: true; snapshot: SanctionsSnapshot }
  | { ok: false; error: string };

export async function fetchOfficialSnapshot(options?: {
  ofacXml?: string;
  euXml?: string | null;
  now?: Date;
  fallbackEu?: ParsedSanctionAddress[];
  fetchImpl?: typeof fetch;
}): Promise<FetchSnapshotResult> {
  const now = options?.now ?? new Date();
  const generatedAt = now.toISOString();
  const fetchImpl = options?.fetchImpl ?? fetch;

  let ofacXml = options?.ofacXml;
  let ofacFetchedAt = generatedAt;
  if (!ofacXml) {
    try {
      const downloaded = await downloadOfacXml(fetchImpl);
      ofacXml = downloaded.xml;
      ofacFetchedAt = downloaded.fetchedAt;
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'OFAC download failed' };
    }
  }

  const ofac = parseOfacSdnXml(ofacXml);
  if (ofac.entries.length < MIN_OFAC_ADDRESSES) {
    return {
      ok: false,
      error: `OFAC parse returned ${ofac.entries.length} supported addresses (minimum ${MIN_OFAC_ADDRESSES}).`,
    };
  }

  let euEntries: ParsedSanctionAddress[] = [];
  let euFetchedAt = generatedAt;
  let euPublishedAt: string | null = null;
  let euStale = false;
  let euUrl = EU_FSD_XML_URL;

  if (options?.euXml) {
    const eu = parseEuSanctionsXml(options.euXml);
    euEntries = eu.entries;
    euPublishedAt = eu.publishedAt;
  } else if (options?.euXml === null) {
    euEntries = options.fallbackEu ?? [];
    euStale = euEntries.length > 0;
    euUrl = 'bundled-snapshot';
  } else {
    try {
      const downloaded = await downloadText(EU_FSD_XML_URL, 40_000, fetchImpl);
      euFetchedAt = downloaded.fetchedAt;
      const eu = parseEuSanctionsXml(downloaded.text);
      euEntries = eu.entries;
      euPublishedAt = eu.publishedAt;
      if (euEntries.length === 0 && options?.fallbackEu && options.fallbackEu.length > 0) {
        euEntries = options.fallbackEu;
        euStale = true;
      }
    } catch {
      euEntries = options?.fallbackEu ?? [];
      euStale = true;
      euUrl = 'bundled-snapshot';
    }
  }

  const addresses = mergeSanctionEntries([...ofac.entries, ...euEntries]);
  const snapshot: SanctionsSnapshot = {
    version: 1,
    generatedAt,
    sources: [
      sourceRecord({
        id: 'ofac-sdn',
        url: OFAC_SDN_ZIP_URL,
        fetchedAt: ofacFetchedAt,
        publishedAt: ofac.publishedAt,
        addressCount: ofac.entries.length,
      }),
      sourceRecord({
        id: 'eu-fsd',
        url: euUrl,
        fetchedAt: euFetchedAt,
        publishedAt: euPublishedAt,
        addressCount: euEntries.length,
        stale: euStale,
      }),
    ],
    addresses,
  };

  return { ok: true, snapshot };
}

async function downloadOfacXml(fetchImpl: typeof fetch): Promise<{ xml: string; fetchedAt: string }> {
  try {
    const zip = await downloadBuffer(OFAC_SDN_ZIP_URL, 30_000, fetchImpl);
    return { xml: unzipFirstFile(zip), fetchedAt: new Date().toISOString() };
  } catch {
    const xml = await downloadText(OFAC_SDN_XML_URL, 45_000, fetchImpl);
    return { xml: xml.text, fetchedAt: xml.fetchedAt };
  }
}

async function downloadText(
  url: string,
  timeoutMs: number,
  fetchImpl: typeof fetch,
): Promise<{ text: string; fetchedAt: string }> {
  const buffer = await downloadBuffer(url, timeoutMs, fetchImpl);
  return { text: buffer.toString('utf8'), fetchedAt: new Date().toISOString() };
}

async function downloadBuffer(url: string, timeoutMs: number, fetchImpl: typeof fetch): Promise<Buffer> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT, accept: '*/*' },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return Buffer.from(await response.arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

export function euEntriesFromSnapshot(snapshot: SanctionsSnapshot | undefined): ParsedSanctionAddress[] {
  if (!snapshot) return [];
  return snapshot.addresses
    .filter((entry) => entry.sources.includes('eu-fsd'))
    .map((entry) => ({
      network: entry.network,
      address: entry.address,
      asset: entry.assets[0] ?? 'UNKNOWN',
      source: 'eu-fsd' as const,
    }));
}
