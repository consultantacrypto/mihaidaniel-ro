import assert from 'node:assert/strict';
import { deflateRawSync } from 'node:zlib';
import { describe, it } from 'node:test';
import { checkAddress } from './verifica-adresa/check';
import { loadBundledSnapshot } from './verifica-adresa/bundled';
import {
  creditPacks,
  getSponsorConfig,
  isPaymentsEnabled,
  paymentsReady,
  singleReportPrice,
} from './verifica-adresa/config';
import * as copy from './verifica-adresa/copy';
import { cronAuthorized } from './verifica-adresa/request';
import { detectNetwork } from './verifica-adresa/networks';
import { parseEuSanctionsXml, parseOfacSdnXml } from './verifica-adresa/parse-lists';
import {
  assertCheckoutAllowed,
  buildCheckoutSessionParams,
  planAddressCheckerFulfillment,
} from './verifica-adresa/payments';
import { getRiskReportProvider } from './verifica-adresa/providers';
import { createRateLimiter } from './verifica-adresa/rate-limit';
import { OPERATOR_LINE } from './verifica-adresa/sources';
import { unzipFirstFile } from './verifica-adresa/zip';

const KNOWN_OFAC = '0x252a8bd2319d8a555b872990601221b3a2053bce';
const RANDOM_EVM = '0x1111111111111111111111111111111111111111';
const FIXED_NOW = new Date('2026-10-23T12:00:00.000Z');
const BANNED = /\b(?:curat[aă]?|scam)\b/i;

function walkStrings(value: unknown, into: string[]): void {
  if (typeof value === 'string') {
    into.push(value);
    return;
  }
  if (typeof value === 'function') return;
  if (Array.isArray(value)) {
    for (const item of value) walkStrings(item, into);
    return;
  }
  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) walkStrings(nested, into);
  }
}

function makeZip(name: string, content: string): Buffer {
  const data = Buffer.from(content);
  const compressed = deflateRawSync(data);
  const nameBuf = Buffer.from(name);
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(8, 8);
  header.writeUInt32LE(compressed.length, 18);
  header.writeUInt32LE(data.length, 22);
  header.writeUInt16LE(nameBuf.length, 26);
  return Buffer.concat([header, nameBuf, compressed]);
}

describe('detectNetwork', () => {
  it('accepts BTC legacy, bech32, and taproot', () => {
    assert.deepEqual(detectNetwork('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'), {
      network: 'btc',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    });
    assert.equal(
      detectNetwork('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')?.network,
      'btc',
    );
    assert.equal(
      detectNetwork('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')?.address,
      'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    );
    assert.equal(
      detectNetwork('BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4')?.address,
      'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    );
    assert.equal(
      detectNetwork('bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0')?.network,
      'btc',
    );
  });

  it('rejects a broken bech32 checksum and testnet', () => {
    assert.equal(detectNetwork('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t5'), null);
    assert.equal(detectNetwork('tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'), null);
  });

  it('normalizes EVM and accepts TRON and SOL', () => {
    assert.deepEqual(detectNetwork('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'), {
      network: 'evm',
      address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    });
    assert.equal(detectNetwork('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')?.network, 'tron');
    assert.equal(detectNetwork('So11111111111111111111111111111111111111112')?.network, 'sol');
  });

  it('rejects invalid formats with no network', () => {
    assert.equal(detectNetwork(''), null);
    assert.equal(detectNetwork('hello'), null);
    assert.equal(detectNetwork('0x1234'), null);
    assert.equal(detectNetwork('1not-a-valid-btc-address'), null);
  });
});

describe('sanctions parsers', () => {
  it('keeps supported OFAC digital-currency ids and drops unsupported assets', () => {
    const xml = `
      <Publish_Date>10/21/2026</Publish_Date>
      <idType>Digital Currency Address - ETH</idType>
      <idNumber>0x252a8bd2319d8a555b872990601221b3a2053bce</idNumber>
      <idType>Digital Currency Address - XMR</idType>
      <idNumber>44dZUJ7w1T3fKAvFW8XyXUVoAGSbFvXef2wcbnsjNKGWYorpLJBjth5VKSFhLGkpYKJb2J341tdZHBnbpv72WL7e8zuxfR2</idNumber>
    `;
    const parsed = parseOfacSdnXml(xml);
    assert.equal(parsed.publishedAt, '2026-10-21');
    assert.equal(parsed.entries.length, 1);
    assert.equal(parsed.entries[0]?.network, 'evm');
  });

  it('joins an EU wallet address that was wrapped across lines', () => {
    const xml = `
      <export generationDate="2026-10-15T12:10:34.160+02:00">
        <remark>Known blockchain wallet addresses
TNZxGWCwvsHr6JxQxzoeDXV5
97Yf7Zb7nV</remark>
      </export>
    `;
    const parsed = parseEuSanctionsXml(xml);
    assert.equal(parsed.entries.some((entry) => entry.address === 'TNZxGWCwvsHr6JxQxzoeDXV597Yf7Zb7nV'), true);
  });

  it('reads the first file out of a deflate ZIP', () => {
    const zip = makeZip('SDN.XML', '<id>ok</id>');
    assert.equal(unzipFirstFile(zip), '<id>ok</id>');
  });
});

describe('checkAddress', () => {
  const snapshot = loadBundledSnapshot();

  it('returns DA for a known OFAC address', () => {
    const result = checkAddress(KNOWN_OFAC.toUpperCase(), snapshot, FIXED_NOW);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.verdict, 'DA');
    assert.equal(result.sanctioned, true);
    assert.equal(result.network, 'evm');
    assert.match(result.explanation, /expunere la sancțiuni/i);
    assert.equal(result.sources.some((source) => source.matched && source.id === 'ofac-sdn'), true);
    assert.match(result.chainabuseUrl, /^https:\/\/www\.chainabuse\.com\/address\//);
    assert.doesNotMatch(`${result.headline} ${result.explanation}`, BANNED);
  });

  it('returns NU for a valid address that is not listed', () => {
    assert.equal(snapshot.addresses.some((entry) => entry.address === RANDOM_EVM), false);
    const result = checkAddress(RANDOM_EVM, snapshot, FIXED_NOW);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.verdict, 'NU');
    assert.equal(result.sanctioned, false);
    assert.match(result.explanation, /nu exclude expunere/i);
    assert.match(result.explanation, /OFAC SDN \(Trezoreria SUA\) și Lista consolidată/);
    assert.doesNotMatch(`${result.headline} ${result.explanation}`, BANNED);
  });

  it('rejects an invalid address with a clear message', () => {
    const result = checkAddress('nu-e-o-adresa', snapshot, FIXED_NOW);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.match(result.error, /BTC/);
    assert.match(result.error, /TRON/);
  });
});

describe('wording', () => {
  it('does not call an address curat or scam', () => {
    const strings: string[] = [];
    walkStrings(copy, strings);
    strings.push(copy.verdictCopy({ sanctioned: true, sourceNames: ['OFAC'], checkedOn: '23 octombrie 2026' }).explanation);
    strings.push(copy.verdictCopy({ sanctioned: false, sourceNames: ['OFAC'], checkedOn: '23 octombrie 2026' }).explanation);
    strings.push(copy.priceOrientation('10 USD'));
    for (const text of strings) {
      assert.doesNotMatch(text, BANNED);
    }
    assert.match(copy.OPERATOR_NOTE, /QuickExit, LLC/);
    assert.match(OPERATOR_LINE, /131 Continental Dr, Suite 305, Newark, DE 19713, US/);
  });
});

describe('paid flow stays disabled', () => {
  it('requires an explicit flag and a QuickExit key', () => {
    assert.equal(isPaymentsEnabled({}), false);
    assert.equal(paymentsReady({}).ok, false);
    assert.deepEqual(paymentsReady({ ADDRESS_CHECKER_PAYMENTS_ENABLED: 'true' }), {
      ok: false,
      reason: 'missing_key',
    });
    assert.deepEqual(
      paymentsReady({
        ADDRESS_CHECKER_PAYMENTS_ENABLED: 'true',
        QUICKEXIT_STRIPE_SECRET_KEY: 'sk_test_example',
      }),
      { ok: false, reason: 'missing_store' },
    );
    assert.deepEqual(
      paymentsReady({
        ADDRESS_CHECKER_PAYMENTS_ENABLED: 'true',
        QUICKEXIT_STRIPE_SECRET_KEY: 'sk_test_example',
        UPSTASH_REDIS_REST_URL: 'https://example.upstash.io',
        UPSTASH_REDIS_REST_TOKEN: 'token',
        RISK_REPORT_PROVIDER_ENABLED: 'true',
        MISTTRACK_API_KEY: 'key',
      }),
      { ok: true },
    );
    const blocked = assertCheckoutAllowed({});
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.equal(blocked.status, 403);
    assert.equal(singleReportPrice({}), 10);
    assert.equal(singleReportPrice({ RISK_REPORT_PRICE_USD: '12.5' }), 12.5);
    assert.equal(creditPacks({}).length, 2);
    assert.deepEqual(creditPacks({ RISK_REPORT_CREDIT_PACKS: '[]' }), []);
    assert.equal(creditPacks({ RISK_REPORT_CREDIT_PACKS: 'not-json' }).length, 2);
  });

  it('builds Stripe metadata without the raw address', () => {
    const params = buildCheckoutSessionParams({
      offer: { id: 'single', credits: 1, priceUsd: 10, label: 'Raport complet' },
      returnOrigin: 'https://www.stirilecrypto.ro',
      source: 'stirilecrypto.ro',
      checkoutNonce: 'nonce',
      consentAt: '2026-10-23T12:00:00.000Z',
      addressSha256: 'abc123',
    });
    assert.equal(params.mode, 'payment');
    assert.equal(params.metadata?.product, 'address_checker');
    assert.equal(params.metadata?.source, 'stirilecrypto.ro');
    assert.equal(params.metadata?.address_sha256, 'abc123');
    assert.equal(params.metadata?.immediate_delivery_consent, 'yes');
    assert.equal(Object.hasOwn(params.metadata ?? {}, 'address'), false);
    assert.equal(params.payment_intent_data?.metadata?.product, 'address_checker');
    assert.equal(params.line_items?.[0]?.price_data?.currency, 'usd');
    assert.equal(params.line_items?.[0]?.price_data?.unit_amount, 1000);
    assert.equal(params.line_items?.[0]?.price_data?.product_data?.name, 'Raport complet de risc — adresă crypto');
    const pack = buildCheckoutSessionParams({
      offer: { id: 'pack_5', credits: 5, priceUsd: 40, label: 'Pachet 5 adrese crypto' },
      returnOrigin: 'https://www.mihaidaniel.ro',
      source: 'mihaidaniel.ro',
      checkoutNonce: 'nonce-pack',
      consentAt: '2026-10-23T12:00:00.000Z',
    });
    assert.equal(pack.line_items?.[0]?.price_data?.product_data?.name, 'Raport complet de risc — pachet 5 adrese crypto');
    assert.equal(
      params.success_url,
      'https://www.stirilecrypto.ro/verifica-adresa/plata/succes?session_id={CHECKOUT_SESSION_ID}',
    );
    assert.equal(params.cancel_url, 'https://www.stirilecrypto.ro/verifica-adresa/plata/anulata');
  });

  it('plans fulfillment and ignores other products', () => {
    const plan = planAddressCheckerFulfillment({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_abc',
          payment_status: 'paid',
          payment_intent: 'pi_test_abc',
          metadata: {
            product: 'address_checker',
            source: 'stirilecrypto.ro',
            offer_id: 'single',
            credits: '1',
            address_sha256: 'abc',
            checkout_nonce: 'nonce',
          },
        },
      },
    });
    assert.equal(plan.action, 'fulfill');
    if (plan.action !== 'fulfill') return;
    assert.equal(plan.source, 'stirilecrypto.ro');
    assert.equal(plan.checkoutNonce, 'nonce');
    assert.equal(plan.paymentIntentId, 'pi_test_abc');

    const ignored = planAddressCheckerFulfillment({
      type: 'checkout.session.completed',
      data: { object: { metadata: { product: 'consultancy' } } },
    });
    assert.equal(ignored.action, 'ignore');
  });
});

describe('risk provider and sponsor slot', () => {
  it('does not call MistTrack while disabled', async () => {
    let calls = 0;
    const provider = getRiskReportProvider({}, async () => {
      calls += 1;
      return new Response('{}');
    });
    assert.equal(provider.isEnabled(), false);
    await assert.rejects(
      () => provider.getReport({ address: RANDOM_EVM, network: 'evm' }),
      /dezactivat/,
    );
    assert.equal(calls, 0);
  });

  it('builds a MistTrack request only when explicitly enabled', async () => {
    const provider = getRiskReportProvider(
      { RISK_REPORT_PROVIDER_ENABLED: 'true', MISTTRACK_API_KEY: 'test-key' },
      async (url) => {
        const href = String(url);
        assert.match(href, /https:\/\/openapi\.misttrack\.io\/v3\/risk_score/);
        assert.match(href, /coin=ETH/);
        assert.match(href, /api_key=test-key/);
        return Response.json({
          success: true,
          data: { score: 9, risk_level: 'Low', detail_list: ['example'], risk_detail: [] },
        });
      },
    );
    const report = await provider.getReport({ address: RANDOM_EVM, network: 'evm' });
    assert.equal(report.provider, 'misttrack');
    assert.equal(report.score, 9);
  });

  it('keeps the sponsor slot empty unless https config is present', () => {
    assert.equal(getSponsorConfig({}).enabled, false);
    assert.equal(
      getSponsorConfig({
        VERIFICA_SPONSOR_ENABLED: 'true',
        VERIFICA_SPONSOR_TITLE: 'Partener',
        VERIFICA_SPONSOR_HREF: 'javascript:alert(1)',
      }).enabled,
      false,
    );
    const enabled = getSponsorConfig({
      VERIFICA_SPONSOR_ENABLED: 'true',
      VERIFICA_SPONSOR_TITLE: 'Partener',
      VERIFICA_SPONSOR_HREF: 'https://example.com/oferta',
    });
    assert.equal(enabled.enabled, true);
    assert.equal(enabled.href, 'https://example.com/oferta');
  });
});

describe('abuse limits', () => {
  it('blocks the third call inside the window and forgets it afterwards', () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1_000 });
    assert.equal(limiter.check('hash', 0).ok, true);
    assert.equal(limiter.check('hash', 10).ok, true);
    const blocked = limiter.check('hash', 20);
    assert.equal(blocked.ok, false);
    if (blocked.ok) return;
    assert.ok(blocked.retryAfterMs > 0);
    assert.equal(limiter.check('hash', 2_000).ok, true);
  });

  it('authorizes the cron with CRON_SECRET and locks production when it is missing', () => {
    const authed = new Request('https://www.mihaidaniel.ro/api/verifica-adresa/cron', {
      headers: { authorization: 'Bearer top-secret' },
    });
    assert.equal(cronAuthorized(authed, { CRON_SECRET: 'top-secret', NODE_ENV: 'production' }), true);
    assert.equal(cronAuthorized(authed, { CRON_SECRET: 'other', NODE_ENV: 'production' }), false);
    assert.equal(
      cronAuthorized(new Request('https://www.mihaidaniel.ro/api/verifica-adresa/cron'), {
        NODE_ENV: 'production',
      }),
      false,
    );
    assert.equal(
      cronAuthorized(new Request('https://www.mihaidaniel.ro/api/verifica-adresa/cron'), {
        NODE_ENV: 'development',
      }),
      true,
    );
  });
});
