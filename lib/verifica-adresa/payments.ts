import Stripe from 'stripe';
import {
  PAYMENTS_DISABLED_ERROR,
  PAYMENTS_PROVIDER_ERROR,
  PAYMENTS_STORE_ERROR,
  PAYMENTS_UNAVAILABLE_ERROR,
} from './copy';
import { findOffer, paymentsReady, type CheckerEnv, type ReportOffer } from './config';
import { checkoutReturnUrls } from './embed';
import { PRODUCT_CODE } from './sources';

/**
 * Paid full-report checkout for QuickExit, LLC.
 * Uses QUICKEXIT_STRIPE_* only. Never reads STRIPE_SECRET_KEY (that key belongs
 * to the consultancy / course checkout on mihaidaniel.ro).
 *
 * Disabled unless ADDRESS_CHECKER_PAYMENTS_ENABLED=true and the order store
 * plus MistTrack are configured. The webhook delivers the report idempotently.
 */

let stripeClient: Stripe | undefined;
let stripeClientKey: string | undefined;

export function getQuickexitStripe(env: CheckerEnv = process.env): Stripe {
  const key = env.QUICKEXIT_STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error('QUICKEXIT_STRIPE_SECRET_KEY is not configured');
  }
  if (!stripeClient || stripeClientKey !== key) {
    // Separate client from lib/stripe.ts. Uses the installed SDK default API version.
    stripeClient = new Stripe(key);
    stripeClientKey = key;
  }
  return stripeClient;
}

export function assertCheckoutAllowed(
  env: CheckerEnv = process.env,
): { ok: true } | { ok: false; status: 403 | 503; error: string } {
  const ready = paymentsReady(env);
  if (ready.ok) return { ok: true };
  if (ready.reason === 'disabled') {
    return { ok: false, status: 403, error: PAYMENTS_DISABLED_ERROR };
  }
  if (ready.reason === 'missing_store') {
    return { ok: false, status: 503, error: PAYMENTS_STORE_ERROR };
  }
  if (ready.reason === 'missing_provider') {
    return { ok: false, status: 503, error: PAYMENTS_PROVIDER_ERROR };
  }
  return {
    ok: false,
    status: 503,
    error: PAYMENTS_UNAVAILABLE_ERROR,
  };
}

export function resolveOffer(offerId: unknown, env: CheckerEnv = process.env): ReportOffer | null {
  if (typeof offerId !== 'string' || !offerId.trim()) return null;
  return findOffer(offerId.trim(), env);
}

export function buildCheckoutSessionParams(input: {
  offer: ReportOffer;
  returnOrigin: string;
  source: string;
  checkoutNonce: string;
  consentAt: string;
  addressSha256?: string;
  customerEmail?: string;
}): Stripe.Checkout.SessionCreateParams {
  const { successUrl, cancelUrl } = checkoutReturnUrls(input.returnOrigin);
  const metadata: Record<string, string> = {
    product: PRODUCT_CODE,
    source: input.source,
    offer_id: input.offer.id,
    credits: String(input.offer.credits),
    price_usd: String(input.offer.priceUsd),
    checkout_nonce: input.checkoutNonce,
    return_origin: input.returnOrigin,
    immediate_delivery_consent: 'yes',
    consent_at: input.consentAt,
  };
  if (input.addressSha256) metadata.address_sha256 = input.addressSha256;

  const name =
    input.offer.credits === 1
      ? 'Raport complet de risc — adresă crypto'
      : `Raport complet de risc — pachet ${input.offer.credits} adrese crypto`;

  return {
    mode: 'payment',
    locale: 'ro',
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...(input.customerEmail ? { customer_email: input.customerEmail } : {}),
    client_reference_id: `${input.source}:${PRODUCT_CODE}:${input.offer.id}`.slice(0, 200),
    metadata,
    payment_intent_data: { metadata },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(input.offer.priceUsd * 100),
          product_data: {
            name,
            metadata: {
              product: PRODUCT_CODE,
              source: input.source,
            },
          },
        },
      },
    ],
  };
}

export type FulfillmentPlan =
  | { action: 'ignore'; reason: string }
  | {
      action: 'fulfill';
      offerId: string | null;
      credits: number;
      source: string | null;
      addressSha256: string | null;
      sessionId: string;
      checkoutNonce: string;
      paymentIntentId: string | null;
    };

type SessionLike = {
  id?: string;
  payment_status?: string | null;
  metadata?: Record<string, string> | null;
  payment_intent?: string | { id?: string | null } | null;
};

export function paymentIntentIdOf(value: SessionLike['payment_intent']): string | null {
  if (typeof value === 'string' && value) return value;
  if (value && typeof value === 'object' && typeof value.id === 'string' && value.id) return value.id;
  return null;
}

/** Recognises a paid address-checker session. Delivery happens in fulfillPaidOrder. */
export function planAddressCheckerFulfillment(event: {
  type: string;
  data: { object: SessionLike };
}): FulfillmentPlan {
  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'checkout.session.async_payment_succeeded'
  ) {
    return { action: 'ignore', reason: 'unhandled_event' };
  }

  const session = event.data.object;
  const metadata = session.metadata ?? {};
  if (metadata.product !== PRODUCT_CODE) {
    return { action: 'ignore', reason: 'other_product' };
  }
  if (
    session.payment_status &&
    session.payment_status !== 'paid' &&
    session.payment_status !== 'no_payment_required'
  ) {
    return { action: 'ignore', reason: 'unpaid' };
  }
  if (!session.id || !metadata.checkout_nonce) {
    return { action: 'ignore', reason: 'missing_checkout' };
  }

  const credits = Number(metadata.credits ?? 0);
  return {
    action: 'fulfill',
    offerId: metadata.offer_id ?? null,
    credits: Number.isFinite(credits) ? credits : 0,
    source: metadata.source ?? null,
    addressSha256: metadata.address_sha256 ?? null,
    sessionId: session.id,
    checkoutNonce: metadata.checkout_nonce,
    paymentIntentId: paymentIntentIdOf(session.payment_intent),
  };
}

export async function refundQuickexitPayment(
  paymentIntentId: string | null,
  env: CheckerEnv = process.env,
): Promise<string | null> {
  if (!paymentIntentId) return null;
  const refund = await getQuickexitStripe(env).refunds.create({ payment_intent: paymentIntentId });
  return refund.id;
}

export function siteOrigin(request: Request, env: CheckerEnv = process.env): string {
  const configured = env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/$/, '');
  if (configured && /^https:\/\//i.test(configured)) return configured;
  const url = new URL(request.url);
  if (url.protocol === 'https:' || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return url.origin;
  }
  return url.origin;
}
