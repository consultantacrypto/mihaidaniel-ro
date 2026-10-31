import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { clickCommands, readAffiliateStats, recordAffiliateClick } from './affiliate-store';
import type { AffiliateClick } from './affiliate';

const ENV = {
  KV_REST_API_URL: 'https://example.upstash.io',
  KV_REST_API_TOKEN: 'token',
};

const click: AffiliateClick = {
  id: 'click1',
  ts: '2026-01-15T14:00:00.000+02:00',
  day: '2026-01-15',
  slug: 'redotpay',
  destination: 'https://url.hk/i/en/kqz74',
  outbound: 'https://url.hk/i/en/kqz74?utm_source=yt&utm_medium=referral&utm_campaign=affiliate',
  referrer: 'https://www.tiktok.com/',
  userAgent: 'Mozilla/5.0',
  utm: { utm_source: 'yt', utm_medium: 'referral', utm_campaign: 'affiliate' },
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('affiliate store', () => {
  it('writes one pipeline for the event and the daily counters', async () => {
    const bodies: unknown[] = [];
    await recordAffiliateClick(click, {
      env: ENV,
      fetchImpl: async (url, init) => {
        assert.equal(url, 'https://example.upstash.io/pipeline');
        assert.equal((init?.headers as Record<string, string>).Authorization, 'Bearer token');
        bodies.push(JSON.parse(String(init?.body)));
        return jsonResponse([{ result: 1 }, { result: 'OK' }, { result: 1 }, { result: 1 }, { result: 1 }]);
      },
    });
    assert.deepEqual(bodies[0], clickCommands(click));
    const commands = bodies[0] as string[][];
    assert.equal(commands[2]?.[1], 'aff:v1:day:2026-01-15');
    assert.equal(commands[3]?.[2], 's|redotpay|yt');
    assert.equal(commands[0]?.[2]?.includes('"slug":"redotpay"'), true);
  });

  it('uses single commands when the pipeline route is missing', async () => {
    const urls: string[] = [];
    const bodies: unknown[] = [];
    await recordAffiliateClick(click, {
      env: ENV,
      fetchImpl: async (url, init) => {
        urls.push(url);
        bodies.push(JSON.parse(String(init?.body)));
        if (url.endsWith('/pipeline')) return jsonResponse({ error: 'missing' }, 404);
        return jsonResponse({ result: 'OK' });
      },
    });
    assert.deepEqual(urls, [
      'https://example.upstash.io/pipeline',
      'https://example.upstash.io',
      'https://example.upstash.io',
      'https://example.upstash.io',
      'https://example.upstash.io',
      'https://example.upstash.io',
    ]);
    assert.deepEqual(bodies.slice(1), clickCommands(click));
  });

  it('logs and skips redis when no store is configured', async () => {
    let called = false;
    await recordAffiliateClick(click, {
      env: {},
      fetchImpl: async () => {
        called = true;
        return jsonResponse([]);
      },
    });
    assert.equal(called, false);
  });

  it('reads daily totals for bybit, okx, and redotpay', async () => {
    const result = await readAffiliateStats({
      env: ENV,
      now: new Date('2026-01-15T12:00:00.000Z'),
      days: 2,
      includeEvents: true,
      fetchImpl: async (_url, init) => {
        const commands = JSON.parse(String(init?.body)) as string[][];
        assert.deepEqual(
          commands.map((command) => command[1]),
          ['aff:v1:events', 'aff:v1:day:2026-01-15', 'aff:v1:day:2026-01-14'],
        );
        return jsonResponse([
          { result: [JSON.stringify(click)] },
          { result: ['s|bybit|yt', '2', 's|okx|x', '1', 's|redotpay|yt', '3', 't|bybit', '2'] },
          { result: [] },
        ]);
      },
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(
      result.stats.partners.map((partner) => [partner.slug, partner.destination, partner.clicks]),
      [
        ['bybit', 'https://partner.bybit.eu/eusot138528', 2],
        ['okx', 'https://my.okx.com/join/77249876', 1],
        ['redotpay', 'https://url.hk/i/en/kqz74', 3],
      ],
    );
    assert.equal(result.stats.events?.[0]?.slug, 'redotpay');
  });

  it('reports a missing store instead of an empty report', async () => {
    const result = await readAffiliateStats({ env: {}, days: 7, fetchImpl: async () => jsonResponse([]) });
    assert.deepEqual(result, {
      ok: false,
      error: 'Stocarea clickurilor nu este configurată. Setează KV_REST_API_URL și KV_REST_API_TOKEN (sau Upstash).',
    });
  });
});
