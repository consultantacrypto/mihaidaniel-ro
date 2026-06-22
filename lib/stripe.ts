import Stripe from 'stripe';

const STRIPE_API_VERSION = '2025-04-30.basil' as const;

let stripeClient: Stripe | undefined;

/** Lazy init — evită evaluarea cheii Stripe la build-time (Vercel). */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, { apiVersion: STRIPE_API_VERSION });
  }
  return stripeClient;
}

export type CheckoutProductType = 'course' | 'consultancy';

export const CHECKOUT_CURRENCY = 'eur';

export const CHECKOUT_PRODUCTS: Record<
  CheckoutProductType,
  { name: string; unitAmount: number; priceIdEnv: string }
> = {
  course: {
    name: 'Curs Trading Crypto Premium',
    unitAmount: 25000, // 250 EUR
    priceIdEnv: 'STRIPE_PRICE_ID_COURSE',
  },
  consultancy: {
    name: 'Consultanță Crypto VIP (1h)',
    unitAmount: 20000, // 200 EUR
    priceIdEnv: 'STRIPE_PRICE_ID_CONSULTANCY',
  },
};

/**
 * Preferă Price ID-uri din catalogul Stripe (Live/Test) pentru compatibilitate
 * cu cupoanele care au restricție applies_to.products.
 * Fallback: price_data (funcționează doar cu cupoane fără restricție de produs).
 */
export function buildCheckoutLineItem(
  type: CheckoutProductType
): Stripe.Checkout.SessionCreateParams.LineItem {
  const product = CHECKOUT_PRODUCTS[type];
  const catalogPriceId = process.env[product.priceIdEnv]?.trim();

  if (catalogPriceId) {
    return {
      quantity: 1,
      price: catalogPriceId,
    };
  }

  return {
    quantity: 1,
    price_data: {
      currency: CHECKOUT_CURRENCY,
      unit_amount: product.unitAmount,
      product_data: {
        name: product.name,
        metadata: {
          checkout_type: type,
        },
      },
    },
  };
}
