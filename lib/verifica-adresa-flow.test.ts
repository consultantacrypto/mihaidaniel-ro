import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { loadBundledSnapshot } from './verifica-adresa/bundled';
import { previewAddress } from './verifica-adresa/check';
import { createPaidCheckout, parseCheckoutBody } from './verifica-adresa/checkout';
import { corsHeaders } from './verifica-adresa/cors';
import {
  checkoutNavigation,
  frameAncestorsValue,
  resolveEmbedSource,
} from './verifica-adresa/embed';
import { fulfillPaidOrder, redeemCredit, type FulfillDeps } from './verifica-adresa/fulfillment';
import { buildReportPdf } from './verifica-adresa/pdf';
import type { PaidRiskReport, RiskReportProvider } from './verifica-adresa/providers';
import type { CheckerOrder } from './verifica-adresa/report';
import { categoryLabel } from './verifica-adresa/risk-labels';
import { sampleReport } from './verifica-adresa/sample-report';
import { createMemoryStore, createUpstashStore } from './verifica-adresa/store';

const KNOWN_OFAC = '0x252a8bd2319d8a555b872990601221b3a2053bce';
const RANDOM_EVM = '0x1111111111111111111111111111111111111111';
const NOW = new Date('2026-10-23T12:00:00.000Z');

function risk(address: string): PaidRiskReport {
  return {
    provider: 'misttrack',
    address,
    network: 'evm',
    score: 86,
    level: 'High',
    summary: 'Mixer',
    labels: ['Malicious Address'],
    exposures: [
      { category: 'mixer', detail: 'Exemplu', exposure: 'direct', hops: 1, percent: 0.4 },
      { category: 'hack', detail: 'Incident', exposure: 'indirect', hops: 2, percent: 0.1 },
      { category: 'scam', detail: 'Semnal', exposure: 'indirect', hops: 3, percent: 0.05 },
    ],
    generatedAt: NOW.toISOString(),
  };
}

function provider(impl: RiskReportProvider['getReport'], calls: { n: number }): RiskReportProvider {
  return {
    id: 'misttrack',
    isEnabled: () => true,
    getReport: async (input) => {
      calls.n += 1;
      return impl(input);
    },
  };
}

function order(patch: Partial<CheckerOrder> = {}): CheckerOrder {
  return {
    nonce: 'nonce-1',
    stripeSessionId: null,
    paymentIntentId: null,
    status: 'pending',
    offerId: 'single',
    creditsPurchased: 1,
    priceUsd: 10,
    source: 'stirilecrypto.ro',
    returnOrigin: 'https://www.stirilecrypto.ro',
    network: 'evm',
    address: KNOWN_OFAC,
    addressSha256: 'hash',
    email: 'buyer@example.com',
    consentAt: NOW.toISOString(),
    reportToken: null,
    publicId: null,
    creditToken: null,
    refundId: null,
    failureReason: null,
    createdAt: NOW.toISOString(),
    updatedAt: NOW.toISOString(),
    ...patch,
  };
}

function makeDeps(store = createMemoryStore(), reportProvider?: RiskReportProvider): FulfillDeps & { refunds: string[] } {
  const refunds: string[] = [];
  const deps: FulfillDeps & { refunds: string[] } = {
    store,
    snapshot: loadBundledSnapshot(),
    provider: reportProvider ?? provider(async (input) => risk(input.address), { n: 0 }),
    now: NOW,
    sleep: async () => {},
    attempts: 3,
    reportTtlSeconds: 72 * 3600,
    creditTtlSeconds: 180 * 86400,
    orderTtlSeconds: 90 * 86400,
    siteOrigin: 'https://www.mihaidaniel.ro',
    refund: async (paymentIntentId) => {
      refunds.push(paymentIntentId ?? '');
      return paymentIntentId ? 're_test_1' : null;
    },
    email: async () => 'sent',
    refunds,
  };
  return deps;
}

describe('pre-payment preview', () => {
  it('returns the network and nothing about sanctions', () => {
    const result = previewAddress(KNOWN_OFAC);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.network, 'evm');
    assert.equal(Object.hasOwn(result, 'sanctioned'), false);
    assert.equal(Object.hasOwn(result, 'verdict'), false);
    const invalid = previewAddress('nu-e-o-adresa');
    assert.equal(invalid.ok, false);
  });
});

describe('embed checkout', () => {
  it('sends stirilecrypto buyers back to stirilecrypto and rejects other hosts', () => {
    const embed = resolveEmbedSource('stirilecrypto.ro');
    assert.equal(embed?.source, 'stirilecrypto.ro');
    assert.equal(embed?.returnOrigin, 'https://www.stirilecrypto.ro');
    assert.equal(resolveEmbedSource('https://evil.example'), null);
    assert.equal(checkoutNavigation(true), 'new-tab');
    assert.equal(checkoutNavigation(false), 'same-tab');
    assert.match(frameAncestorsValue(), /https:\/\/www\.stirilecrypto\.ro/);
    assert.match(frameAncestorsValue(), /https:\/\/www\.mihaidaniel\.ro/);
  });

  it('requires consent and keeps the raw address out of Stripe', async () => {
    const denied = parseCheckoutBody({ offerId: 'single', address: RANDOM_EVM, consent: false });
    assert.equal(denied.ok, false);

    const parsed = parseCheckoutBody(
      {
        offerId: 'single',
        address: RANDOM_EVM,
        consent: true,
        source: 'www.stirilecrypto.ro',
        email: 'buyer@example.com',
      },
      {},
      NOW,
    );
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.source, 'stirilecrypto.ro');

    let captured: { metadata?: Record<string, string>; success_url?: string } | null = null;
    const store = createMemoryStore();
    const created = await createPaidCheckout(parsed, {
      store,
      orderTtlSeconds: 3600,
      createSession: async (params) => {
        captured = params;
        return { id: 'cs_test_session123', url: 'https://checkout.stripe.com/c/pay/cs_test_session123' };
      },
    });
    assert.equal(created.url.startsWith('https://checkout.stripe.com/'), true);
    assert.equal(captured?.metadata?.source, 'stirilecrypto.ro');
    assert.equal(captured?.metadata?.product, 'address_checker');
    assert.equal(Object.hasOwn(captured?.metadata ?? {}, 'address'), false);
    assert.match(captured?.success_url ?? '', /^https:\/\/www\.stirilecrypto\.ro\//);
    const saved = await store.getOrderByNonce(created.nonce);
    assert.equal(saved?.address, RANDOM_EVM);
    assert.equal(saved?.source, 'stirilecrypto.ro');
  });

  it('allows the stirilecrypto origin through CORS and blocks others', () => {
    const allowed = corsHeaders(new Request('https://www.mihaidaniel.ro/api/verifica-adresa', {
      headers: { origin: 'https://www.stirilecrypto.ro' },
    }));
    assert.equal(allowed['Access-Control-Allow-Origin'], 'https://www.stirilecrypto.ro');
    const blocked = corsHeaders(new Request('https://www.mihaidaniel.ro/api/verifica-adresa', {
      headers: { origin: 'https://evil.example' },
    }));
    assert.equal(blocked['Access-Control-Allow-Origin'], undefined);
  });
});

describe('paid fulfillment', () => {
  it('delivers sanctions plus the risk score once, then stays idempotent', async () => {
    const calls = { n: 0 };
    const deps = makeDeps(
      createMemoryStore(),
      provider(async (input) => risk(input.address), calls),
    );
    await deps.store.saveOrder(order(), 3600);
    const first = await fulfillPaidOrder(
      { nonce: 'nonce-1', stripeSessionId: 'cs_test_paid', paymentIntentId: 'pi_test_paid' },
      deps,
    );
    assert.equal(first.status, 'ready');
    assert.equal(calls.n, 1);
    const report = await deps.store.getReport(first.reportToken ?? '');
    assert.equal(report?.sanctions?.verdict, 'DA');
    assert.equal(report?.risk?.score, 86);
    assert.equal(report?.source, 'stirilecrypto.ro');
    assert.equal(categoryLabel(report?.risk?.exposures[2]?.category ?? ''), 'Schemă de fraudă');

    const second = await fulfillPaidOrder(
      { nonce: 'nonce-1', stripeSessionId: 'cs_test_paid', paymentIntentId: 'pi_test_paid' },
      deps,
    );
    assert.equal(second.reportToken, first.reportToken);
    assert.equal(calls.n, 1);
    assert.equal(deps.refunds.length, 0);

    const pdf = await buildReportPdf(report!);
    assert.equal(Buffer.from(pdf.subarray(0, 5)).toString(), '%PDF-');
    assert.ok(pdf.byteLength > 1000);
  });

  it('marks the payment for refund when MistTrack keeps failing', async () => {
    const calls = { n: 0 };
    const deps = makeDeps(
      createMemoryStore(),
      provider(async () => {
        throw new Error('down');
      }, calls),
    );
    await deps.store.saveOrder(order({ address: RANDOM_EVM }), 3600);
    const result = await fulfillPaidOrder(
      { nonce: 'nonce-1', stripeSessionId: 'cs_test_fail', paymentIntentId: 'pi_test_fail' },
      deps,
    );
    assert.equal(calls.n, 3);
    assert.equal(result.status, 'refunded');
    assert.deepEqual(deps.refunds, ['pi_test_fail']);
    const report = await deps.store.getReport(result.reportToken ?? '');
    assert.equal(report?.status, 'refunded');
    assert.equal(report?.sanctions, null);
    assert.match(report?.failureReason ?? '', /ramburs/i);
  });

  it('does not consume a pack credit when the provider fails', async () => {
    const deps = makeDeps(
      createMemoryStore(),
      provider(async () => {
        throw new Error('down');
      }, { n: 0 }),
    );
    await deps.store.saveOrder(
      order({
        nonce: 'pack-1',
        offerId: 'pack_5',
        creditsPurchased: 5,
        address: null,
        network: null,
        priceUsd: 40,
      }),
      3600,
    );
    const paid = await fulfillPaidOrder(
      { nonce: 'pack-1', stripeSessionId: 'cs_test_pack', paymentIntentId: 'pi_test_pack' },
      deps,
    );
    assert.equal(paid.status, 'ready');
    assert.ok(paid.creditToken);
    const before = await deps.store.getCredits(paid.creditToken ?? '');
    assert.equal(before?.creditsRemaining, 5);

    const failed = await redeemCredit(
      { token: paid.creditToken ?? '', address: RANDOM_EVM, consent: true },
      deps,
    );
    assert.equal(failed.ok, false);
    const afterFail = await deps.store.getCredits(paid.creditToken ?? '');
    assert.equal(afterFail?.creditsRemaining, 5);

    deps.provider = provider(async (input) => risk(input.address), { n: 0 });
    const ok = await redeemCredit(
      { token: paid.creditToken ?? '', address: RANDOM_EVM, consent: true },
      deps,
    );
    assert.equal(ok.ok, true);
    if (!ok.ok) return;
    assert.equal(ok.report.sanctions?.verdict, 'NU');
    const after = await deps.store.getCredits(paid.creditToken ?? '');
    assert.equal(after?.creditsRemaining, 4);
  });
});

describe('sample pdf', () => {
  it('embeds Inter and keeps Romanian text readable', async () => {
    const { execFileSync } = await import('node:child_process');
    const { mkdtempSync, writeFileSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const fontkit = (await import('@pdf-lib/fontkit')).default;
    const { readFileSync } = await import('node:fs');
    const face = fontkit.create(readFileSync(join(process.cwd(), 'lib/verifica-adresa/fonts/Inter-Regular.ttf')));
    for (const ch of ['A', 'a', 'ă', 'â', 'î', 'ș', 'ț', 'Ă', 'Â', 'Î', 'Ș', 'Ț']) {
      const glyph = face.glyphForCodePoint(ch.codePointAt(0) ?? 0);
      assert.ok(glyph.path.commands.length > 0, ch);
    }

    const pdf = await buildReportPdf(sampleReport());
    assert.equal(Buffer.from(pdf.subarray(0, 5)).toString(), '%PDF-');
    assert.ok(pdf.byteLength > 1000);
    const dir = mkdtempSync(join(tmpdir(), 'verifica-pdf-'));
    const file = join(dir, 'report.pdf');
    writeFileSync(file, pdf);
    const text = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' });
    assert.match(text, /Adresă crypto/);
    assert.match(text, /QuickExit, LLC/);
    assert.match(text, /Sancționată/);
    assert.match(text, /PÂNĂ/);
    assert.match(text, /Cifrele și/);
    assert.match(text, /într-o/);
    assert.match(text, /QE-EXEMPLU/);
    assert.match(text, /Schemă de fraudă/);
    assert.doesNotMatch(text, /\bscam\b/i);
  });
});

describe('upstash store', () => {
  it('sets a value with expiry and a lock that does not overwrite', async () => {
    const calls: unknown[][] = [];
    const store = createUpstashStore({ url: 'https://example.upstash.io', token: 'secret' }, async (_url, init) => {
      calls.push(JSON.parse(String(init?.body)));
      const command = calls.at(-1)?.[0];
      const result = command === 'GET' ? null : 'OK';
      return new Response(JSON.stringify({ result }), { status: 200 });
    });
    await store.saveOrder(order(), 60);
    assert.equal(calls[0]?.[0], 'SET');
    assert.equal(calls[0]?.[3], 'EX');
    const locked = await store.acquireLock('fulfill:cs', 120);
    assert.equal(locked, true);
    assert.equal(calls.at(-1)?.[2], '1');
    assert.ok(calls.at(-1)?.includes('NX'));
  });
});
