import {
  hasAttribution,
  sanitizeAttribution,
  toClientReferenceId,
  type Attribution,
} from './attribution';
import { includedAnalysesFor } from './consultancy-packages';
import type { CheckoutProductType } from './stripe';

type CheckoutLineItem = {
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

export type CheckoutSessionCreateParams = {
  mode: 'payment';
  allow_promotion_codes: boolean;
  line_items: CheckoutLineItem[];
  success_url: string;
  cancel_url: string;
  metadata: Record<string, string>;
  client_reference_id?: string;
};

/** Promo codes stay on the course and on the 200 € session. The other packages are fixed prices. */
export function checkoutAllowsPromotionCodes(
  type: CheckoutProductType,
  packageId?: string | null
): boolean {
  if (type !== 'consultancy') return true;
  return !packageId || packageId === 'sesiune';
}

/**
 * Additive wrapper around the existing Checkout session.
 * Products, prices, mode, promotion codes, and cancel URL stay as they are.
 * The success URL keeps `success=true` and `type`, and appends Stripe's
 * `{CHECKOUT_SESSION_ID}` so the success page can verify the payment.
 */
export function buildCheckoutSessionCreateParams(input: {
  type: CheckoutProductType;
  baseUrl: string;
  lineItem: CheckoutLineItem;
  attribution?: Attribution;
  /** Set only after the server has accepted the package id. Never a client amount. */
  packageId?: string | null;
}): CheckoutSessionCreateParams {
  const successPath = input.type === 'consultancy' ? '/consultanta-crypto' : '/';
  const attribution = sanitizeAttribution(input.attribution);
  const metadata: Record<string, string> = { type: input.type };

  if (input.packageId) metadata.package_id = input.packageId;
  if (input.type === 'consultancy') {
    const packageId = input.packageId || 'sesiune';
    metadata.included_analyses = String(includedAnalysesFor(packageId));
  }

  if (attribution.utm_source) metadata.utm_source = attribution.utm_source;
  if (attribution.utm_medium) metadata.utm_medium = attribution.utm_medium;
  if (attribution.utm_campaign) metadata.utm_campaign = attribution.utm_campaign;
  if (attribution.utm_content) metadata.utm_content = attribution.utm_content;

  const params: CheckoutSessionCreateParams = {
    mode: 'payment',
    allow_promotion_codes: checkoutAllowsPromotionCodes(input.type, input.packageId),
    line_items: [input.lineItem],
    success_url: `${input.baseUrl}${successPath}?success=true&type=${input.type}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.baseUrl}${successPath}?canceled=true`,
    metadata,
  };

  const reference = toClientReferenceId(attribution);
  if (hasAttribution(attribution) && reference) {
    params.client_reference_id = reference;
  }

  return params;
}
