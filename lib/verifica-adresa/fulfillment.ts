import { checkAddress } from './check';
import { NETWORK_LABELS, REFUND_PENDING_MESSAGE, REFUNDED_MESSAGE } from './copy';
import { creditPageUrl, reportPageUrl } from './embed';
import { logRef } from './hash';
import type { Network } from './networks';
import type { RiskReportProvider } from './providers';
import type { CheckerOrder, CreditPass, ReportDocument } from './report';
import type { ReportMail } from './mail';
import { newPublicId, newToken, type CheckerStore } from './store';
import type { SanctionsSnapshot } from './snapshot';

export const ORDER_TTL_SECONDS = 90 * 24 * 60 * 60;

export type FulfillDeps = {
  store: CheckerStore;
  snapshot: SanctionsSnapshot;
  provider: RiskReportProvider;
  now: Date;
  sleep: (ms: number) => Promise<void>;
  attempts: number;
  reportTtlSeconds: number;
  creditTtlSeconds: number;
  orderTtlSeconds: number;
  siteOrigin: string;
  refund: (paymentIntentId: string | null) => Promise<string | null>;
  email: ReportMail;
};

function terminal(status: CheckerOrder['status']): boolean {
  return status === 'ready' || status === 'refund_due' || status === 'refunded';
}

async function withRetries<T>(
  fn: () => Promise<T>,
  attempts: number,
  sleep: (ms: number) => Promise<void>,
): Promise<T> {
  let last: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      last = error;
      if (attempt < attempts - 1) await sleep(150 * (attempt + 1));
    }
  }
  throw last instanceof Error ? last : new Error('Furnizorul de risc nu a răspuns.');
}

async function buildReadyReport(order: CheckerOrder, deps: FulfillDeps): Promise<ReportDocument> {
  if (!order.address || !order.network) throw new Error('Adresa lipsește.');
  const sanctions = checkAddress(order.address, deps.snapshot, deps.now);
  if (!sanctions.ok) throw new Error(sanctions.error);
  if (!deps.provider.isEnabled()) throw new Error('Furnizorul de risc este dezactivat.');
  const risk = await withRetries(
    () => deps.provider.getReport({ address: order.address as string, network: order.network as Network }),
    deps.attempts,
    deps.sleep,
  );
  const createdAt = deps.now.toISOString();
  return {
    token: order.reportToken as string,
    publicId: order.publicId as string,
    status: 'ready',
    sample: false,
    createdAt,
    expiresAt: new Date(deps.now.getTime() + deps.reportTtlSeconds * 1000).toISOString(),
    source: order.source,
    network: order.network,
    networkLabel: sanctions.networkLabel,
    address: sanctions.address,
    sanctions,
    risk,
    failureReason: null,
    refundId: null,
  };
}

function failureDocument(order: CheckerOrder, deps: FulfillDeps, status: ReportDocument['status']): ReportDocument {
  const createdAt = deps.now.toISOString();
  return {
    token: order.reportToken as string,
    publicId: order.publicId as string,
    status,
    sample: false,
    createdAt,
    expiresAt: new Date(deps.now.getTime() + deps.reportTtlSeconds * 1000).toISOString(),
    source: order.source,
    network: order.network ?? 'evm',
    networkLabel: order.network ? NETWORK_LABELS[order.network] : '',
    address: order.address ?? '',
    sanctions: null,
    risk: null,
    failureReason: status === 'refunded' ? REFUNDED_MESSAGE : REFUND_PENDING_MESSAGE,
    refundId: order.refundId,
  };
}

async function notify(order: CheckerOrder, deps: FulfillDeps, kind: 'report' | 'credits' | 'refund', url: string) {
  if (!order.email || !order.publicId) return;
  await deps.email({ to: order.email, url, publicId: order.publicId, kind });
}

async function deliver(order: CheckerOrder, deps: FulfillDeps): Promise<CheckerOrder> {
  order.updatedAt = deps.now.toISOString();
  if (!order.publicId) order.publicId = newPublicId();

  if (order.creditsPurchased === 1) {
    if (!order.reportToken) order.reportToken = newToken();
    await deps.store.saveOrder(order, deps.orderTtlSeconds);
    const existing = await deps.store.getReport(order.reportToken);
    if (existing) {
      order.status = existing.status;
      order.failureReason = existing.failureReason;
      order.refundId = existing.refundId;
      await deps.store.saveOrder(order, deps.orderTtlSeconds);
      return order;
    }
    const report = await buildReadyReport(order, deps);
    await deps.store.saveReport(report, deps.reportTtlSeconds);
    order.status = 'ready';
    order.failureReason = null;
    await deps.store.saveOrder(order, deps.orderTtlSeconds);
    await notify(order, deps, 'report', reportPageUrl(deps.siteOrigin, report.token));
    return order;
  }

  if (!order.creditToken) order.creditToken = newToken();
  const existingPass = await deps.store.getCredits(order.creditToken);
  if (!existingPass) {
    const pass: CreditPass = {
      token: order.creditToken,
      orderNonce: order.nonce,
      source: order.source,
      creditsTotal: order.creditsPurchased,
      creditsRemaining: order.creditsPurchased,
      reportTokens: [],
      createdAt: deps.now.toISOString(),
      expiresAt: new Date(deps.now.getTime() + deps.creditTtlSeconds * 1000).toISOString(),
    };
    await deps.store.saveCredits(pass, deps.creditTtlSeconds);
  }
  order.status = 'ready';
  await deps.store.saveOrder(order, deps.orderTtlSeconds);
  await notify(order, deps, 'credits', creditPageUrl(deps.siteOrigin, order.creditToken));
  return order;
}

async function markRefund(order: CheckerOrder, deps: FulfillDeps): Promise<CheckerOrder> {
  order.failureReason = REFUND_PENDING_MESSAGE;
  order.status = 'refund_due';
  try {
    const refundId = await deps.refund(order.paymentIntentId);
    if (refundId) {
      order.refundId = refundId;
      order.status = 'refunded';
      order.failureReason = REFUNDED_MESSAGE;
    }
  } catch (error) {
    console.error('[verifica-adresa] Rambursarea automată a eșuat.', error);
  }

  if (order.creditsPurchased === 1 && order.address) {
    if (!order.reportToken) order.reportToken = newToken();
    if (!order.publicId) order.publicId = newPublicId();
    const document = failureDocument(order, deps, order.status === 'refunded' ? 'refunded' : 'refund_due');
    document.failureReason = order.failureReason;
    document.refundId = order.refundId;
    await deps.store.saveReport(document, deps.reportTtlSeconds);
    await notify(order, deps, 'refund', reportPageUrl(deps.siteOrigin, document.token));
  }

  order.updatedAt = deps.now.toISOString();
  await deps.store.saveOrder(order, deps.orderTtlSeconds);
  return order;
}

async function fulfillOnce(
  input: { nonce: string; stripeSessionId: string; paymentIntentId: string | null },
  deps: FulfillDeps,
): Promise<CheckerOrder | 'busy'> {
  const locked = await deps.store.acquireLock(`fulfill:${input.stripeSessionId}`, 120);
  if (!locked) return 'busy';
  try {
    const order = await deps.store.getOrderByNonce(input.nonce);
    if (!order) throw new Error('Comanda lipsește.');
    if (order.stripeSessionId && order.stripeSessionId !== input.stripeSessionId) {
      throw new Error('Sesiune nepotrivită.');
    }
    order.stripeSessionId = input.stripeSessionId;
    if (input.paymentIntentId) order.paymentIntentId = input.paymentIntentId;
    await deps.store.bindSession(input.stripeSessionId, order.nonce, deps.orderTtlSeconds);
    if (terminal(order.status)) {
      await deps.store.saveOrder(order, deps.orderTtlSeconds);
      return order;
    }
    try {
      return await deliver(order, deps);
    } catch (error) {
      console.error('[verifica-adresa] Livrarea a eșuat.', logRef(order.address ?? order.nonce), error);
      return await markRefund(order, deps);
    }
  } finally {
    await deps.store.releaseLock(`fulfill:${input.stripeSessionId}`);
  }
}

export async function fulfillPaidOrder(
  input: { nonce: string; stripeSessionId: string; paymentIntentId: string | null },
  deps: FulfillDeps,
): Promise<CheckerOrder> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const result = await fulfillOnce(input, deps);
    if (result !== 'busy') return result;
    await deps.sleep(100);
  }
  const existing =
    (await deps.store.getOrderBySession(input.stripeSessionId)) ??
    (await deps.store.getOrderByNonce(input.nonce));
  if (existing && terminal(existing.status)) return existing;
  throw new Error('Livrarea este în curs.');
}

export type RedeemResult =
  | { ok: true; report: ReportDocument }
  | { ok: false; status: number; error: string };

export async function redeemCredit(
  input: { token: string; address: string; consent: boolean },
  deps: FulfillDeps,
): Promise<RedeemResult> {
  if (input.consent !== true) {
    return { ok: false, status: 400, error: 'Bifează consimțământul pentru livrarea imediată.' };
  }
  const locked = await deps.store.acquireLock(`credit:${input.token}`, 120);
  if (!locked) return { ok: false, status: 409, error: 'O verificare este deja în curs pe acest pachet.' };
  try {
    const pass = await deps.store.getCredits(input.token);
    if (!pass) return { ok: false, status: 404, error: 'Pachetul nu există sau a expirat.' };
    if (new Date(pass.expiresAt).getTime() <= deps.now.getTime()) {
      return { ok: false, status: 410, error: 'Pachetul a expirat.' };
    }
    if (pass.creditsRemaining < 1) {
      return { ok: false, status: 402, error: 'Nu mai ai verificări în acest pachet.' };
    }

    const probe = checkAddress(input.address, deps.snapshot, deps.now);
    if (!probe.ok) return { ok: false, status: 400, error: probe.error };

    const orderLike: CheckerOrder = {
      nonce: pass.orderNonce,
      stripeSessionId: null,
      paymentIntentId: null,
      status: 'pending',
      offerId: 'credit',
      creditsPurchased: 1,
      priceUsd: 0,
      source: pass.source,
      returnOrigin: deps.siteOrigin,
      network: probe.network,
      address: probe.address,
      addressSha256: null,
      email: null,
      consentAt: deps.now.toISOString(),
      reportToken: newToken(),
      publicId: newPublicId(),
      creditToken: pass.token,
      refundId: null,
      failureReason: null,
      createdAt: deps.now.toISOString(),
      updatedAt: deps.now.toISOString(),
    };

    try {
      const report = await buildReadyReport(orderLike, deps);
      await deps.store.saveReport(report, deps.reportTtlSeconds);
      pass.creditsRemaining -= 1;
      pass.reportTokens = [...pass.reportTokens, report.token].slice(-50);
      await deps.store.saveCredits(pass, deps.creditTtlSeconds);
      return { ok: true, report };
    } catch (error) {
      console.error('[verifica-adresa] Verificarea din pachet a eșuat.', error);
      return {
        ok: false,
        status: 502,
        error:
          'Furnizorul de risc nu a răspuns. Creditul nu a fost consumat. Poți încerca din nou.',
      };
    }
  } finally {
    await deps.store.releaseLock(`credit:${input.token}`);
  }
}
