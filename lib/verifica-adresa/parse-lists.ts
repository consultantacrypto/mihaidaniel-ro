import { detectNetwork, type Network } from './networks';
import type { SanctionsSourceId } from './sources';

export type ParsedSanctionAddress = {
  network: Network;
  address: string;
  asset: string;
  source: SanctionsSourceId;
};

const OFAC_ID_RE =
  /<idType>\s*Digital Currency Address\s*-\s*([^<]+?)\s*<\/idType>\s*<idNumber>\s*([^<]+?)\s*<\/idNumber>/gi;

const ADDRESS_RES: RegExp[] = [
  /0x[a-fA-F0-9]{40}/g,
  /bc1[ac-hj-np-z02-9]{11,71}/gi,
  /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g,
  /\bT[1-9A-HJ-NP-Za-km-z]{33}\b/g,
];

export function parseOfacSdnXml(xml: string): {
  publishedAt: string | null;
  entries: ParsedSanctionAddress[];
} {
  const publishedAt = parseOfacPublishDate(xml);
  const entries: ParsedSanctionAddress[] = [];
  for (const match of xml.matchAll(OFAC_ID_RE)) {
    const asset = decodeXml(match[1] ?? '').trim().toUpperCase();
    const address = decodeXml(match[2] ?? '').trim();
    const parsed = acceptAddress(address, asset, 'ofac-sdn');
    if (parsed) entries.push(parsed);
  }
  return { publishedAt, entries: dedupeParsed(entries) };
}

export function parseEuSanctionsXml(xml: string): {
  publishedAt: string | null;
  entries: ParsedSanctionAddress[];
} {
  const publishedAt = parseEuGenerationDate(xml);
  const entries: ParsedSanctionAddress[] = [];
  collectValidated(xml, 'eu-fsd', entries);

  const remarkRe = /<remark\b[^>]*>([\s\S]*?)<\/remark>/gi;
  for (const match of xml.matchAll(remarkRe)) {
    const remark = decodeXml(match[1] ?? '');
    if (!/wallet|address|0x|bc1|trx|btc|eth/i.test(remark)) continue;
    // Some listings wrap a single address across lines. Joining the text
    // glues it to the previous word, so this pass does not require a boundary.
    collectLoose(remark.replace(/\s+/g, ''), 'eu-fsd', entries);
  }

  return { publishedAt, entries: dedupeParsed(entries) };
}

export function parseOfacPublishDate(xml: string): string | null {
  const match = xml.match(/<Publish_Date>\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s*<\/Publish_Date>/);
  if (!match) return null;
  const month = match[1].padStart(2, '0');
  const day = match[2].padStart(2, '0');
  return `${match[3]}-${month}-${day}`;
}

export function parseEuGenerationDate(xml: string): string | null {
  const match = xml.match(/\bgenerationDate="([^"]+)"/);
  if (!match) return null;
  const date = new Date(match[1]);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function collectValidated(text: string, source: SanctionsSourceId, into: ParsedSanctionAddress[]): void {
  for (const pattern of ADDRESS_RES) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      const parsed = acceptAddress(match[0], assetHint(match[0]), source);
      if (parsed) into.push(parsed);
    }
  }
}

function collectLoose(text: string, source: SanctionsSourceId, into: ParsedSanctionAddress[]): void {
  for (const match of text.matchAll(/0x[a-fA-F0-9]{40}/g)) {
    const parsed = acceptAddress(match[0], 'ETH', source);
    if (parsed) into.push(parsed);
  }
  for (const match of text.matchAll(/bc1[ac-hj-np-z02-9]{11,71}/gi)) {
    const parsed = acceptAddress(match[0], 'BTC', source);
    if (parsed) into.push(parsed);
  }
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === 'T' && index + 34 <= text.length) {
      const parsed = acceptAddress(text.slice(index, index + 34), 'TRX', source);
      if (parsed) {
        into.push(parsed);
        index += 33;
      }
    } else if ((char === '1' || char === '3') && index + 26 <= text.length) {
      let acceptedLength = 0;
      const max = Math.min(35, text.length - index);
      for (let length = 26; length <= max; length += 1) {
        const parsed = acceptAddress(text.slice(index, index + length), 'BTC', source);
        if (parsed) acceptedLength = length;
      }
      if (acceptedLength > 0) {
        const parsed = acceptAddress(text.slice(index, index + acceptedLength), 'BTC', source);
        if (parsed) into.push(parsed);
        index += acceptedLength - 1;
      }
    }
  }
}

function assetHint(address: string): string {
  if (/^0x/i.test(address)) return 'ETH';
  if (/^bc1/i.test(address) || /^[13]/.test(address)) return 'BTC';
  if (address.startsWith('T')) return 'TRX';
  return 'UNKNOWN';
}

function acceptAddress(
  address: string,
  asset: string,
  source: SanctionsSourceId,
): ParsedSanctionAddress | null {
  const detected = detectNetwork(address);
  if (!detected) return null;
  return {
    network: detected.network,
    address: detected.address,
    asset: asset || 'UNKNOWN',
    source,
  };
}

function dedupeParsed(entries: ParsedSanctionAddress[]): ParsedSanctionAddress[] {
  const seen = new Set<string>();
  const result: ParsedSanctionAddress[] = [];
  for (const entry of entries) {
    const key = `${entry.source}|${entry.network}|${entry.address}|${entry.asset}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(entry);
  }
  return result;
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
