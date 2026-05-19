import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export type CheckoutProductType = 'course' | 'consultancy';

export const CHECKOUT_PRODUCTS: Record<
  CheckoutProductType,
  { name: string; unitAmount: number; priceIdEnv: string }
> = {
  course: {
    name: 'Curs Trading Crypto Premium',
    unitAmount: 30000,
    priceIdEnv: 'STRIPE_PRICE_ID_COURSE',
  },
  consultancy: {
    name: 'Consultanță Crypto VIP (1h)',
    unitAmount: 25000,
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
      currency: 'usd',
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
