import { CHECKOUT_PRODUCTS, type CheckoutProductType } from './stripe';

export type PurchaseEventPayload = {
  transactionId: string;
  value: number;
  currency: string;
  productType: CheckoutProductType;
  itemName: string;
  customerEmail: string | null;
};

export type CheckoutSessionLike = {
  id?: string | null;
  payment_status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: { type?: string | null } | null;
};

const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]+$/;

export function isCheckoutSessionId(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.length <= 255 && SESSION_ID_RE.test(value);
}

/**
 * A purchase is reportable only when Stripe says the session is paid.
 * `value` is the amount Stripe collected (200 for a full-price consultancy).
 */
export function purchaseEventFromSession(
  session: CheckoutSessionLike
): PurchaseEventPayload | null {
  if (session.payment_status !== 'paid') return null;
  if (!isCheckoutSessionId(session.id)) return null;
  if (typeof session.amount_total !== 'number' || !Number.isFinite(session.amount_total)) {
    return null;
  }
  if (!session.currency) return null;

  const productType = session.metadata?.type;
  if (productType !== 'consultancy' && productType !== 'course') return null;

  const email = session.customer_details?.email?.trim() || null;

  return {
    transactionId: session.id,
    value: session.amount_total / 100,
    currency: session.currency.toUpperCase(),
    productType,
    itemName: CHECKOUT_PRODUCTS[productType].name,
    customerEmail: email,
  };
}
