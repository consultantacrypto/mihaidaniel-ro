/**
 * Short affiliate links: /r/{slug}
 * Destinations are hardcoded. Query params never choose the target.
 */

export const AFFILIATE_TIMEZONE = 'Europe/Bucharest';

export const AFFILIATE_DESTINATIONS = {
  bybit: 'https://partner.bybit.eu/eusot138528',
  okx: 'https://my.okx.com/join/77249876',
  redotpay: 'https://url.hk/i/en/kqz74',
} as const;

export type AffiliateSlug = keyof typeof AFFILIATE_DESTINATIONS;

export const AFFILIATE_SLUGS = Object.keys(AFFILIATE_DESTINATIONS) as AffiliateSlug[];

const DEFAULT_UTM = {
  utm_source: 'mihaidaniel',
  utm_medium: 'referral',
  utm_campaign: 'affiliate',
} as const;

const UTM_ORDER = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

const MAX_VALUE_LENGTH = 120;
const MAX_UTM_KEYS = 12;
const MAX_REFERRER_LENGTH = 500;
const MAX_USER_AGENT_LENGTH = 300;
const UTM_KEY = /^utm_[a-z][a-z0-9_]{0,31}$/;
const SLUG_KEY = /^[a-z0-9-]{1,40}$/;

export type AffiliateClick = {
  id: string;
  ts: string;
  day: string;
  slug: AffiliateSlug;
  destination: string;
  outbound: string;
  referrer: string;
  userAgent: string;
  utm: Record<string, string>;
  ref?: string;
  sid?: string;
};

export type DailyClickRow = {
  date: string;
  slug: string;
  utm_source: string;
  clicks: number;
};

export type AffiliatePartnerTotal = {
  slug: string;
  destination: string;
  clicks: number;
};

export type AffiliateStats = {
  timezone: typeof AFFILIATE_TIMEZONE;
  generatedAt: string;
  windowDays: number;
  partners: AffiliatePartnerTotal[];
  rows: DailyClickRow[];
  events?: AffiliateClick[];
};

export function isAffiliateRedirectPath(pathname: string): boolean {
  return pathname === '/r' || pathname.startsWith('/r/');
}

export function normalizeSlug(raw: string): string | null {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }
  const slug = decoded.trim().toLowerCase();
  if (!SLUG_KEY.test(slug)) return null;
  return slug;
}

export function destinationFor(slug: string): string | undefined {
  if (!isAffiliateSlug(slug)) return undefined;
  return AFFILIATE_DESTINATIONS[slug];
}

export function isAffiliateSlug(slug: string): slug is AffiliateSlug {
  return Object.prototype.hasOwnProperty.call(AFFILIATE_DESTINATIONS, slug);
}

function sanitizeValue(value: string): string | undefined {
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, MAX_VALUE_LENGTH);
  return cleaned || undefined;
}

export function cleanHeader(value: string | null | undefined, max: number): string {
  if (!value) return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

export type ResolvedAffiliateQuery = {
  utm: Record<string, string>;
  ref?: string;
  sid?: string;
};

/** Inbound utm_* win. Missing source, medium, and campaign get the defaults. */
export function resolveAffiliateQuery(searchParams: URLSearchParams): ResolvedAffiliateQuery {
  const utm: Record<string, string> = {};
  let ref: string | undefined;
  let sid: string | undefined;

  for (const [rawKey, rawValue] of searchParams.entries()) {
    const key = rawKey.toLowerCase();
    const value = sanitizeValue(rawValue);
    if (!value) continue;
    if (key === 'ref') {
      if (!ref) ref = value;
      continue;
    }
    if (key === 'sid') {
      if (!sid) sid = value;
      continue;
    }
    if (!UTM_KEY.test(key) || utm[key] || Object.keys(utm).length >= MAX_UTM_KEYS) continue;
    utm[key] = value;
  }

  for (const [key, value] of Object.entries(DEFAULT_UTM)) {
    if (!utm[key]) utm[key] = value;
  }

  return { utm, ...(ref ? { ref } : {}), ...(sid ? { sid } : {}) };
}

function orderedUtmEntries(utm: Record<string, string>): Array<[string, string]> {
  const keys = Object.keys(utm).sort((left, right) => {
    const leftIndex = UTM_ORDER.indexOf(left as (typeof UTM_ORDER)[number]);
    const rightIndex = UTM_ORDER.indexOf(right as (typeof UTM_ORDER)[number]);
    if (leftIndex === -1 && rightIndex === -1) return left.localeCompare(right);
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  });
  return keys.map((key) => [key, utm[key]!]);
}

/**
 * Appends utm_* that the destination does not already set.
 * Does not append ref or sid: those names collide with partner codes.
 */
export function buildOutboundUrl(destination: string, utm: Record<string, string>): string {
  const url = new URL(destination);
  for (const [key, value] of orderedUtmEntries(utm)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  return url.toString();
}

export function bucharestStamp(date: Date): { iso: string; day: string } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: AFFILIATE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'longOffset',
  });
  const parts = new Map<string, string>();
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') parts.set(part.type, part.value);
  }
  const year = parts.get('year') ?? '0000';
  const month = parts.get('month') ?? '01';
  const day = parts.get('day') ?? '01';
  let hour = parts.get('hour') ?? '00';
  if (hour === '24') hour = '00';
  const minute = parts.get('minute') ?? '00';
  const second = parts.get('second') ?? '00';
  const fraction = String(date.getUTCMilliseconds()).padStart(3, '0');
  const offset = offsetFromTimeZoneName(parts.get('timeZoneName') ?? '');
  return {
    day: `${year}-${month}-${day}`,
    iso: `${year}-${month}-${day}T${hour}:${minute}:${second}.${fraction}${offset}`,
  };
}

function offsetFromTimeZoneName(name: string): string {
  const match = /([+-])(\d{1,2})(?::(\d{2}))?/.exec(name);
  if (!match) return '+00:00';
  return `${match[1]}${match[2]!.padStart(2, '0')}:${match[3] ?? '00'}`;
}

/** Calendar days in Europe/Bucharest, newest first. UTC date math so DST does not skip a day. */
export function bucharestDayList(today: string, days: number): string[] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(today);
  if (!match) return [];
  const start = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const count = Math.min(366, Math.max(1, Math.trunc(days)));
  const dates: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const date = new Date(start - index * 86_400_000);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

export function clampStatsDays(value: string | null | undefined): number {
  if (!value) return 30;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 30;
  return Math.min(366, Math.max(1, Math.trunc(parsed)));
}

export function isPrefetchRequest(headers: { get(name: string): string | null }): boolean {
  const purpose = `${headers.get('purpose') ?? ''} ${headers.get('sec-purpose') ?? ''}`.toLowerCase();
  if (purpose.includes('prefetch')) return true;
  return headers.get('next-router-prefetch') === '1';
}

export async function performAffiliateRedirect(input: {
  slug: string;
  searchParams: URLSearchParams;
  referrer: string | null;
  userAgent: string | null;
  prefetch?: boolean;
  now?: Date;
  newId?: () => string;
  record?: (click: AffiliateClick) => Promise<void>;
}): Promise<{ status: 302; location: string } | { status: 404 }> {
  const slug = normalizeSlug(input.slug);
  if (!slug || !isAffiliateSlug(slug)) return { status: 404 };
  const destination = AFFILIATE_DESTINATIONS[slug];
  const query = resolveAffiliateQuery(input.searchParams);
  const outbound = buildOutboundUrl(destination, query.utm);
  const stamp = bucharestStamp(input.now ?? new Date());
  const click: AffiliateClick = {
    id: input.newId?.() ?? 'unassigned',
    ts: stamp.iso,
    day: stamp.day,
    slug,
    destination,
    outbound,
    referrer: cleanHeader(input.referrer, MAX_REFERRER_LENGTH),
    userAgent: cleanHeader(input.userAgent, MAX_USER_AGENT_LENGTH),
    utm: query.utm,
    ...(query.ref ? { ref: query.ref } : {}),
    ...(query.sid ? { sid: query.sid } : {}),
  };

  if (!input.prefetch && input.record) {
    try {
      await input.record(click);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown';
      console.error('[affiliate-click] store failed', message);
      console.info('[affiliate-click]', JSON.stringify(click));
    }
  }

  return { status: 302, location: outbound };
}

export function hashToRecord(result: unknown): Record<string, string> {
  if (Array.isArray(result)) {
    const record: Record<string, string> = {};
    for (let index = 0; index < result.length; index += 2) {
      const field = result[index];
      if (typeof field !== 'string') continue;
      record[field] = String(result[index + 1] ?? '');
    }
    return record;
  }
  if (result && typeof result === 'object') {
    const record: Record<string, string> = {};
    for (const [key, value] of Object.entries(result)) record[key] = String(value ?? '');
    return record;
  }
  return {};
}

export function rowsFromHashes(
  days: Array<{ date: string; hash: Record<string, string> }>,
  slugFilter?: string,
): DailyClickRow[] {
  const rows: DailyClickRow[] = [];
  for (const { date, hash } of days) {
    for (const [field, raw] of Object.entries(hash)) {
      const parsed = parseSourceField(field);
      if (!parsed) continue;
      if (slugFilter && parsed.slug !== slugFilter) continue;
      const clicks = Number(raw);
      if (!Number.isFinite(clicks) || clicks <= 0) continue;
      rows.push({ date, slug: parsed.slug, utm_source: parsed.source, clicks });
    }
  }
  rows.sort(
    (left, right) =>
      right.date.localeCompare(left.date) ||
      left.slug.localeCompare(right.slug) ||
      left.utm_source.localeCompare(right.utm_source),
  );
  return rows;
}

function parseSourceField(field: string): { slug: string; source: string } | null {
  if (!field.startsWith('s|')) return null;
  const rest = field.slice(2);
  const separator = rest.indexOf('|');
  if (separator <= 0) return null;
  const slug = rest.slice(0, separator);
  const source = rest.slice(separator + 1);
  if (!slug || !source) return null;
  return { slug, source };
}

export function partnerTotals(rows: DailyClickRow[], slugs: readonly string[]): AffiliatePartnerTotal[] {
  return slugs.map((slug) => ({
    slug,
    destination: destinationFor(slug) ?? '',
    clicks: rows.reduce((sum, row) => (row.slug === slug ? sum + row.clicks : sum), 0),
  }));
}

export function parseStoredClicks(result: unknown): AffiliateClick[] {
  if (!Array.isArray(result)) return [];
  const clicks: AffiliateClick[] = [];
  for (const item of result) {
    if (typeof item !== 'string') continue;
    try {
      const value = JSON.parse(item) as Partial<AffiliateClick>;
      if (!value || typeof value.slug !== 'string' || typeof value.ts !== 'string') continue;
      clicks.push(value as AffiliateClick);
    } catch {
      // Skip a corrupt line. The daily hash is the measurement that remains.
    }
  }
  return clicks;
}

function csvCell(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function dailyClicksToCsv(rows: DailyClickRow[]): string {
  const lines = ['date,slug,utm_source,clicks'];
  for (const row of rows) {
    lines.push([row.date, row.slug, csvCell(row.utm_source), String(row.clicks)].join(','));
  }
  return `${lines.join('\n')}\n`;
}

export function clicksToCsv(clicks: AffiliateClick[]): string {
  const lines = ['ts,day,slug,utm_source,utm_medium,utm_campaign,utm_content,ref,sid,destination,referrer'];
  for (const click of clicks) {
    const utm = click.utm ?? {};
    lines.push(
      [
        click.ts,
        click.day,
        click.slug,
        csvCell(utm.utm_source ?? ''),
        csvCell(utm.utm_medium ?? ''),
        csvCell(utm.utm_campaign ?? ''),
        csvCell(utm.utm_content ?? ''),
        csvCell(click.ref ?? ''),
        csvCell(click.sid ?? ''),
        csvCell(click.destination),
        csvCell(click.referrer),
      ].join(','),
    );
  }
  return `${lines.join('\n')}\n`;
}

export function secretsMatch(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

export function presentedStatsSecrets(
  headers: { get(name: string): string | null },
  url: string,
): string[] {
  const direct = headers.get('x-aff-stats-key')?.trim() ?? '';
  const authorization = headers.get('authorization') ?? '';
  const bearer = /^Bearer\s+/i.test(authorization)
    ? authorization.replace(/^Bearer\s+/i, '').trim()
    : '';
  let query = '';
  try {
    query = new URL(url).searchParams.get('key')?.trim() ?? '';
  } catch {
    query = '';
  }
  return [direct, bearer, query].filter((value) => value.length > 0);
}

export function statsAccess(secret: string | undefined, presented: string[]): 'missing' | 'rejected' | 'ok' {
  const key = secret?.trim() ?? '';
  if (!key) return 'missing';
  return presented.some((value) => secretsMatch(value, key)) ? 'ok' : 'rejected';
}
