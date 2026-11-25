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
    // The SDK types only name their newest version. The pinned version stays on the wire.
    stripeClient = new Stripe(key, {
      apiVersion: STRIPE_API_VERSION as '2026-04-22.dahlia',
    });
  }
  return stripeClient;
}

export type CheckoutProductType = 'course' | 'consultancy';

export const CHECKOUT_CURRENCY = 'eur';

export type CheckoutLineItem = {
  quantity: number;
  price?: string;
  price_data?: {
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
      metadata?: Record<string, string>;
    };
  };
};

export const CHECKOUT_PRODUCTS: Record<
  CheckoutProductType,
  { name: string; unitAmount: number; priceIdEnv: 'STRIPE_PRICE_ID_CONSULTANCY' | 'STRIPE_PRICE_ID_COURSE' }
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
 * Pachetele de 3 sesiuni și mentoratul nu trec pe aici: au price_data propriu.
 */
export function buildCheckoutLineItem(
  type: CheckoutProductType,
  env: Record<string, string | undefined> = process.env
): CheckoutLineItem {
  const product = CHECKOUT_PRODUCTS[type];
  const catalogPriceId = env[product.priceIdEnv]?.trim();

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
