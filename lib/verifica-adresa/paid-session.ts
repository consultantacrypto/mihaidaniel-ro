import { isStripeSessionId } from './embed';
import { fulfillPaidOrder } from './fulfillment';
import { productionFulfillDeps } from './runtime';
import { getQuickexitStripe, paymentIntentIdOf, planAddressCheckerFulfillment } from './payments';
import type { CheckerOrder, CreditPass, ReportDocument } from './report';

export type PaidSessionResult =
  | { state: 'invalid' }
  | { state: 'unavailable' }
  | { state: 'unpaid' }
  | { state: 'missing' }
  | { state: 'ok'; order: CheckerOrder; report: ReportDocument | null; credits: CreditPass | null };

export async function loadPaidSession(sessionId: string): Promise<PaidSessionResult> {
  if (!isStripeSessionId(sessionId)) return { state: 'invalid' };
  if (!process.env.QUICKEXIT_STRIPE_SECRET_KEY?.trim()) return { state: 'unavailable' };

  const session = await getQuickexitStripe().checkout.sessions.retrieve(sessionId);
  const plan = planAddressCheckerFulfillment({
    type: 'checkout.session.completed',
    data: { object: session },
  });
  if (plan.action === 'ignore' && plan.reason === 'unpaid') return { state: 'unpaid' };
  if (plan.action !== 'fulfill') return { state: 'missing' };

  const deps = await productionFulfillDeps();
  const order = await fulfillPaidOrder(
    {
      nonce: plan.checkoutNonce,
      stripeSessionId: plan.sessionId,
      paymentIntentId: plan.paymentIntentId ?? paymentIntentIdOf(session.payment_intent),
    },
    deps,
  );
  const report = order.reportToken ? await deps.store.getReport(order.reportToken) : null;
  const credits = order.creditToken ? await deps.store.getCredits(order.creditToken) : null;
  return { state: 'ok', order, report, credits };
}
