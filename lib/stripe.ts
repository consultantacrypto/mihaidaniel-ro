import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export type CheckoutProductType = 'course' | 'consultancy';

export const CHECKOUT_PRODUCTS: Record<
  CheckoutProductType,
  { name: string; unitAmount: number }
> = {
  course: {
    name: 'Curs Trading Crypto Premium',
    unitAmount: 30000,
  },
  consultancy: {
    name: 'Consultanță Crypto VIP (1h)',
    unitAmount: 25000,
  },
};
