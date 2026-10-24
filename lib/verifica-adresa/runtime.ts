import { loadActiveSnapshot } from './cache';
import { creditPassTtlDays, reportTtlHours, type CheckerEnv } from './config';
import { canonicalSiteOrigin } from './embed';
import { ORDER_TTL_SECONDS, type FulfillDeps } from './fulfillment';
import { createReportMail } from './mail';
import { refundQuickexitPayment } from './payments';
import { getRiskReportProvider } from './providers';
import { getCheckerStore } from './store';

export async function productionFulfillDeps(env: CheckerEnv = process.env): Promise<FulfillDeps> {
  return {
    store: getCheckerStore(env),
    snapshot: await loadActiveSnapshot(),
    provider: getRiskReportProvider(env),
    now: new Date(),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    attempts: 3,
    reportTtlSeconds: reportTtlHours(env) * 3600,
    creditTtlSeconds: creditPassTtlDays(env) * 86400,
    orderTtlSeconds: ORDER_TTL_SECONDS,
    siteOrigin: canonicalSiteOrigin(env),
    refund: (paymentIntentId) => refundQuickexitPayment(paymentIntentId, env),
    email: createReportMail(env),
  };
}
