import type Stripe from 'stripe';
import { findOffer, type CheckerEnv, type ReportOffer } from './config';
import {
  ADDRESS_REQUIRED,
  CONSENT_REQUIRED,
  EMAIL_INVALID,
  PACK_ADDRESS_REJECTED,
} from './copy';
import { defaultEmbedContext, resolveEmbedSource } from './embed';
import { sha256Hex } from './hash';
import { detectNetwork, type Network } from './networks';
import { buildCheckoutSessionParams } from './payments';
import type { CheckerOrder } from './report';
import { newToken, type CheckerStore } from './store';

export type ParsedCheckout =
  | {
      ok: true;
      offer: ReportOffer;
      address: string | null;
      network: Network | null;
      addressSha256: string | null;
      email: string | null;
      source: string;
      returnOrigin: string;
      consentAt: string;
    }
  | { ok: false; status: 400; error: string };

function isEmail(value: string): boolean {
  return value.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseCheckoutBody(
  body: unknown,
  env: CheckerEnv = process.env,
  now = new Date(),
): ParsedCheckout {
  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  if (record.consent !== true) {
    return { ok: false, status: 400, error: CONSENT_REQUIRED };
  }

  const offer = findOffer(typeof record.offerId === 'string' ? record.offerId.trim() : '', env);
  if (!offer) return { ok: false, status: 400, error: 'Oferta nu există.' };

  const sourceRaw = typeof record.source === 'string' ? record.source : '';
  const embed = sourceRaw ? resolveEmbedSource(sourceRaw, env) : defaultEmbedContext(env);
  if (!embed) return { ok: false, status: 400, error: 'Sursa nu este acceptată.' };

  let email: string | null = null;
  if (typeof record.email === 'string' && record.email.trim()) {
    email = record.email.trim();
    if (!isEmail(email)) return { ok: false, status: 400, error: EMAIL_INVALID };
  }

  const rawAddress = typeof record.address === 'string' ? record.address.trim() : '';
  if (offer.credits > 1) {
    if (rawAddress) return { ok: false, status: 400, error: PACK_ADDRESS_REJECTED };
    return {
      ok: true,
      offer,
      address: null,
      network: null,
      addressSha256: null,
      email,
      source: embed.source,
      returnOrigin: embed.returnOrigin,
      consentAt: now.toISOString(),
    };
  }

  if (!rawAddress) return { ok: false, status: 400, error: ADDRESS_REQUIRED };
  const detected = detectNetwork(rawAddress);
  if (!detected) {
    return { ok: false, status: 400, error: 'Format nerecunoscut. Verifică adresa și rețeaua.' };
  }

  return {
    ok: true,
    offer,
    address: detected.address,
    network: detected.network,
    addressSha256: sha256Hex(`${detected.network}:${detected.address}`),
    email,
    source: embed.source,
    returnOrigin: embed.returnOrigin,
    consentAt: now.toISOString(),
  };
}

export async function createPaidCheckout(
  parsed: Extract<ParsedCheckout, { ok: true }>,
  deps: {
    store: CheckerStore;
    orderTtlSeconds: number;
    createSession: (
      params: Stripe.Checkout.SessionCreateParams,
      idempotencyKey: string,
    ) => Promise<{ id: string; url: string | null }>;
  },
): Promise<{ url: string; nonce: string }> {
  const now = parsed.consentAt;
  const order: CheckerOrder = {
    nonce: newToken(18),
    stripeSessionId: null,
    paymentIntentId: null,
    status: 'pending',
    offerId: parsed.offer.id,
    creditsPurchased: parsed.offer.credits,
    priceUsd: parsed.offer.priceUsd,
    source: parsed.source,
    returnOrigin: parsed.returnOrigin,
    network: parsed.network,
    address: parsed.address,
    addressSha256: parsed.addressSha256,
    email: parsed.email,
    consentAt: parsed.consentAt,
    reportToken: null,
    publicId: null,
    creditToken: null,
    refundId: null,
    failureReason: null,
    createdAt: now,
    updatedAt: now,
  };

  await deps.store.saveOrder(order, deps.orderTtlSeconds);
  const session = await deps.createSession(
    buildCheckoutSessionParams({
      offer: parsed.offer,
      returnOrigin: parsed.returnOrigin,
      source: parsed.source,
      addressSha256: parsed.addressSha256 ?? undefined,
      checkoutNonce: order.nonce,
      customerEmail: parsed.email ?? undefined,
      consentAt: parsed.consentAt,
    }),
    order.nonce,
  );
  if (!session.url) {
    throw new Error('Stripe nu a întors o adresă de plată.');
  }
  await deps.store.bindSession(session.id, order.nonce, deps.orderTtlSeconds);
  return { url: session.url, nonce: order.nonce };
}
