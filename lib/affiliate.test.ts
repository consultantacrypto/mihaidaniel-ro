import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  AFFILIATE_DESTINATIONS,
  bucharestDayList,
  bucharestStamp,
  buildOutboundUrl,
  clicksToCsv,
  dailyClicksToCsv,
  hashToRecord,
  isAffiliateRedirectPath,
  partnerTotals,
  performAffiliateRedirect,
  presentedStatsSecrets,
  resolveAffiliateQuery,
  rowsFromHashes,
  statsAccess,
} from './affiliate';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const NOW = new Date('2026-01-15T12:00:00.000Z');

describe('affiliate destinations', () => {
  it('maps only the confirmed partner URLs', () => {
    assert.deepEqual(Object.keys(AFFILIATE_DESTINATIONS).sort(), ['bybit', 'okx', 'redotpay']);
    assert.equal(AFFILIATE_DESTINATIONS.bybit, 'https://partner.bybit.eu/eusot138528');
    assert.equal(AFFILIATE_DESTINATIONS.okx, 'https://my.okx.com/join/77249876');
    assert.equal(AFFILIATE_DESTINATIONS.redotpay, 'https://url.hk/i/en/kqz74');
  });
});

describe('resolveAffiliateQuery', () => {
  it('fills the three defaults when the link is bare', () => {
    assert.deepEqual(resolveAffiliateQuery(new URLSearchParams()).utm, {
      utm_source: 'mihaidaniel',
      utm_medium: 'referral',
      utm_campaign: 'affiliate',
    });
  });

  it('keeps inbound UTMs and defaults only the missing ones', () => {
    const query = resolveAffiliateQuery(
      new URLSearchParams('utm_source=yt&utm_content=bio&ref=abc&sid=9&utm_term=card'),
    );
    assert.equal(query.utm.utm_source, 'yt');
    assert.equal(query.utm.utm_medium, 'referral');
    assert.equal(query.utm.utm_campaign, 'affiliate');
    assert.equal(query.utm.utm_content, 'bio');
    assert.equal(query.utm.utm_term, 'card');
    assert.equal(query.ref, 'abc');
    assert.equal(query.sid, '9');
  });
});

describe('buildOutboundUrl', () => {
  it('appends UTMs without replacing a partner parameter', () => {
    const outbound = buildOutboundUrl('https://wap.redotpay.com/en/invite/?referralId=kqz74', {
      utm_source: 'mihaidaniel',
      utm_medium: 'referral',
      utm_campaign: 'affiliate',
    });
    const url = new URL(outbound);
    assert.equal(url.searchParams.get('referralId'), 'kqz74');
    assert.equal(url.searchParams.get('utm_source'), 'mihaidaniel');
    assert.equal(url.searchParams.get('ref'), null);
  });

  it('does not overwrite a utm the destination already set', () => {
    const outbound = buildOutboundUrl('https://example.com/a?utm_source=keep', {
      utm_source: 'mihaidaniel',
      utm_medium: 'referral',
      utm_campaign: 'affiliate',
    });
    const url = new URL(outbound);
    assert.equal(url.searchParams.get('utm_source'), 'keep');
    assert.equal(url.searchParams.get('utm_medium'), 'referral');
  });
});

describe('performAffiliateRedirect', () => {
  it('redirects bare partner slugs with default UTMs', async () => {
    const expected = {
      bybit: 'https://partner.bybit.eu/eusot138528?utm_source=mihaidaniel&utm_medium=referral&utm_campaign=affiliate',
      okx: 'https://my.okx.com/join/77249876?utm_source=mihaidaniel&utm_medium=referral&utm_campaign=affiliate',
      redotpay: 'https://url.hk/i/en/kqz74?utm_source=mihaidaniel&utm_medium=referral&utm_campaign=affiliate',
    } as const;

    for (const slug of Object.keys(expected) as Array<keyof typeof expected>) {
      const recorded: string[] = [];
      const outcome = await performAffiliateRedirect({
        slug: slug.toUpperCase(),
        searchParams: new URLSearchParams(),
        referrer: 'https://www.youtube.com/watch?v=abc',
        userAgent: 'Mozilla/5.0',
        now: NOW,
        newId: () => 'click1',
        record: async (click) => {
          recorded.push(click.slug);
          assert.equal(click.destination, AFFILIATE_DESTINATIONS[slug]);
          assert.equal(click.day, '2026-01-15');
          assert.equal(click.ts, '2026-01-15T14:00:00.000+02:00');
          assert.equal(click.outbound, expected[slug]);
        },
      });
      assert.equal(outcome.status, 302);
      if (outcome.status === 302) assert.equal(outcome.location, expected[slug]);
      assert.deepEqual(recorded, [slug]);
    }
  });

  it('preserves inbound UTMs, logs ref and sid, and does not put them on the partner URL', async () => {
    let ref: string | undefined;
    const outcome = await performAffiliateRedirect({
      slug: 'redotpay',
      searchParams: new URLSearchParams('utm_source=tt&utm_content=bio&ref=abc&sid=9'),
      referrer: null,
      userAgent: 'x'.repeat(400),
      now: NOW,
      newId: () => 'click2',
      record: async (click) => {
        ref = click.ref;
        assert.equal(click.sid, '9');
        assert.equal(click.utm.utm_source, 'tt');
        assert.equal(click.userAgent.length, 300);
      },
    });
    assert.equal(ref, 'abc');
    assert.equal(outcome.status, 302);
    if (outcome.status === 302) {
      const url = new URL(outcome.location);
      assert.equal(`${url.origin}${url.pathname}`, 'https://url.hk/i/en/kqz74');
      assert.equal(url.searchParams.get('utm_source'), 'tt');
      assert.equal(url.searchParams.get('utm_medium'), 'referral');
      assert.equal(url.searchParams.get('utm_content'), 'bio');
      assert.equal(url.searchParams.get('ref'), null);
      assert.equal(url.searchParams.get('sid'), null);
    }
  });

  it('returns 404 for an unknown slug and does not log', async () => {
    let called = false;
    const outcome = await performAffiliateRedirect({
      slug: 'https://evil.example',
      searchParams: new URLSearchParams('url=https://evil.example'),
      referrer: null,
      userAgent: null,
      record: async () => {
        called = true;
      },
    });
    assert.equal(outcome.status, 404);
    assert.equal(called, false);
  });

  it('still redirects when the store throws', async () => {
    const outcome = await performAffiliateRedirect({
      slug: 'okx',
      searchParams: new URLSearchParams(),
      referrer: null,
      userAgent: null,
      now: NOW,
      record: async () => {
        throw new Error('down');
      },
    });
    assert.equal(outcome.status, 302);
    if (outcome.status === 302) {
      assert.equal(new URL(outcome.location).pathname, '/join/77249876');
    }
  });

  it('does not log a prefetch', async () => {
    let called = false;
    const outcome = await performAffiliateRedirect({
      slug: 'bybit',
      searchParams: new URLSearchParams(),
      referrer: null,
      userAgent: null,
      prefetch: true,
      record: async () => {
        called = true;
      },
    });
    assert.equal(outcome.status, 302);
    assert.equal(called, false);
  });
});

describe('bucharest time', () => {
  it('uses the winter and summer offsets', () => {
    assert.deepEqual(bucharestStamp(new Date('2026-01-15T12:00:00.000Z')), {
      day: '2026-01-15',
      iso: '2026-01-15T14:00:00.000+02:00',
    });
    assert.deepEqual(bucharestStamp(new Date('2026-07-15T12:00:00.000Z')), {
      day: '2026-07-15',
      iso: '2026-07-15T15:00:00.000+03:00',
    });
    assert.equal(bucharestStamp(new Date('2026-01-15T22:30:00.000Z')).day, '2026-01-16');
  });

  it('walks calendar days without skipping the DST boundary', () => {
    assert.deepEqual(bucharestDayList('2026-03-01', 3), ['2026-03-01', '2026-02-28', '2026-02-27']);
    assert.deepEqual(bucharestDayList('2026-03-30', 3), ['2026-03-30', '2026-03-29', '2026-03-28']);
  });
});

describe('stats shaping', () => {
  it('reads daily source counts and keeps a pipe inside the source', () => {
    const rows = rowsFromHashes([
      {
        date: '2026-10-31',
        hash: hashToRecord(['s|bybit|yt', '2', 's|redotpay|bio|pin', '4', 't|okx', '9', 's|okx|x', '1']),
      },
    ]);
    assert.deepEqual(rows, [
      { date: '2026-10-31', slug: 'bybit', utm_source: 'yt', clicks: 2 },
      { date: '2026-10-31', slug: 'okx', utm_source: 'x', clicks: 1 },
      { date: '2026-10-31', slug: 'redotpay', utm_source: 'bio|pin', clicks: 4 },
    ]);
    assert.deepEqual(
      partnerTotals(rows, ['bybit', 'okx', 'redotpay']).map((partner) => [partner.slug, partner.clicks]),
      [
        ['bybit', 2],
        ['okx', 1],
        ['redotpay', 4],
      ],
    );
    assert.match(dailyClicksToCsv(rows), /^date,slug,utm_source,clicks\n/);
    assert.match(clicksToCsv([]), /^ts,day,slug,/);
  });

  it('accepts the stats key from the header, bearer token, or query', () => {
    const headers = { get: (name: string) => (name === 'x-aff-stats-key' ? 'secret-key' : null) };
    assert.equal(statsAccess('secret-key', presentedStatsSecrets(headers, 'https://mihaidaniel.ro/api/r/stats')), 'ok');
    assert.equal(statsAccess(undefined, ['secret-key']), 'missing');
    assert.equal(statsAccess('secret-key', ['nope']), 'rejected');
    assert.deepEqual(
      presentedStatsSecrets(
        { get: (name: string) => (name === 'authorization' ? 'Bearer night-key' : null) },
        'https://mihaidaniel.ro/api/r/stats?key=query-key',
      ),
      ['night-key', 'query-key'],
    );
  });
});

describe('locale bypass', () => {
  it('only skips internationalization for the short-link path', () => {
    assert.equal(isAffiliateRedirectPath('/r/redotpay'), true);
    assert.equal(isAffiliateRedirectPath('/r'), true);
    assert.equal(isAffiliateRedirectPath('/refund'), false);
    assert.equal(isAffiliateRedirectPath('/en/r/bybit'), false);
    const middleware = readFileSync(join(root, 'middleware.ts'), 'utf8');
    assert.match(middleware, /isAffiliateRedirectPath/);
  });
});
