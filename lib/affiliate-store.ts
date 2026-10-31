import { storeCredentials, type CheckerEnv } from '@/lib/verifica-adresa/config';
import {
  AFFILIATE_SLUGS,
  AFFILIATE_TIMEZONE,
  bucharestDayList,
  bucharestStamp,
  hashToRecord,
  parseStoredClicks,
  partnerTotals,
  rowsFromHashes,
  type AffiliateClick,
  type AffiliateStats,
} from '@/lib/affiliate';

const EVENTS_KEY = 'aff:v1:events';
const DAYS_KEY = 'aff:v1:days';
const DAY_PREFIX = 'aff:v1:day:';
const MAX_EVENTS = 20_000;
const EVENT_FETCH_LIMIT = 100;

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function clickCommands(click: AffiliateClick): string[][] {
  const source = click.utm.utm_source ?? 'mihaidaniel';
  return [
    ['LPUSH', EVENTS_KEY, JSON.stringify(click)],
    ['LTRIM', EVENTS_KEY, '0', String(MAX_EVENTS - 1)],
    ['HINCRBY', `${DAY_PREFIX}${click.day}`, `t|${click.slug}`, '1'],
    ['HINCRBY', `${DAY_PREFIX}${click.day}`, `s|${click.slug}|${source}`, '1'],
    ['SADD', DAYS_KEY, click.day],
  ];
}

async function redisCommand(
  credentials: { url: string; token: string },
  command: string[],
  fetchImpl: FetchLike,
  signal?: AbortSignal,
): Promise<unknown> {
  const response = await fetchImpl(credentials.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
    signal,
  });
  if (!response.ok) {
    throw new Error(`Stocarea afiliaților a răspuns cu HTTP ${response.status}.`);
  }
  const payload = (await response.json()) as { result?: unknown; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result ?? null;
}

async function redisPipeline(
  credentials: { url: string; token: string },
  commands: string[][],
  fetchImpl: FetchLike,
  signal?: AbortSignal,
): Promise<unknown[]> {
  const response = await fetchImpl(`${credentials.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    cache: 'no-store',
    signal,
  });
  if (response.status === 404 || response.status === 405) {
    const results: unknown[] = [];
    for (const command of commands) {
      results.push(await redisCommand(credentials, command, fetchImpl, signal));
    }
    return results;
  }
  if (!response.ok) {
    throw new Error(`Stocarea afiliaților a răspuns cu HTTP ${response.status}.`);
  }
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error?: unknown }).error)
        : 'Răspuns invalid de la stocare.';
    throw new Error(message);
  }
  const results: unknown[] = [];
  for (const item of payload) {
    if (!item || typeof item !== 'object') {
      results.push(null);
      continue;
    }
    const record = item as { result?: unknown; error?: unknown };
    if (record.error) throw new Error(String(record.error));
    results.push(record.result ?? null);
  }
  return results;
}

export async function recordAffiliateClick(
  click: AffiliateClick,
  options?: { env?: CheckerEnv; fetchImpl?: FetchLike; signal?: AbortSignal },
): Promise<void> {
  const env = options?.env ?? process.env;
  const credentials = storeCredentials(env);
  if (!credentials) {
    console.info('[affiliate-click]', JSON.stringify(click));
    return;
  }
  const signal = options?.signal ?? AbortSignal.timeout(2500);
  await redisPipeline(credentials, clickCommands(click), options?.fetchImpl ?? fetch, signal);
}

export async function readAffiliateStats(
  options: {
    env?: CheckerEnv;
    fetchImpl?: FetchLike;
    now?: Date;
    days: number;
    slug?: string;
    includeEvents?: boolean;
    signal?: AbortSignal;
  },
): Promise<{ ok: true; stats: AffiliateStats } | { ok: false; error: string }> {
  const env = options.env ?? process.env;
  const credentials = storeCredentials(env);
  if (!credentials) {
    return {
      ok: false,
      error: 'Stocarea clickurilor nu este configurată. Setează KV_REST_API_URL și KV_REST_API_TOKEN (sau Upstash).',
    };
  }

  const stamp = bucharestStamp(options.now ?? new Date());
  const dates = bucharestDayList(stamp.day, options.days);
  const commands: string[][] = [];
  if (options.includeEvents) {
    commands.push(['LRANGE', EVENTS_KEY, '0', String(EVENT_FETCH_LIMIT - 1)]);
  }
  for (const date of dates) commands.push(['HGETALL', `${DAY_PREFIX}${date}`]);

  const results = await redisPipeline(
    credentials,
    commands,
    options.fetchImpl ?? fetch,
    options.signal,
  );
  const hashResults = options.includeEvents ? results.slice(1) : results;
  const rows = rowsFromHashes(
    dates.map((date, index) => ({ date, hash: hashToRecord(hashResults[index]) })),
    options.slug,
  );
  const slugs = options.slug ? [options.slug] : [...AFFILIATE_SLUGS];
  const events = options.includeEvents
    ? parseStoredClicks(results[0]).filter((click) => !options.slug || click.slug === options.slug)
    : undefined;

  return {
    ok: true,
    stats: {
      timezone: AFFILIATE_TIMEZONE,
      generatedAt: stamp.iso,
      windowDays: dates.length,
      partners: partnerTotals(rows, slugs),
      rows,
      ...(events ? { events } : {}),
    },
  };
}
