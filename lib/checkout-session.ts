import {
  hasAttribution,
  sanitizeAttribution,
  toClientReferenceId,
  type Attribution,
} from './attribution';
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
  allow_promotion_codes: true;
  line_items: CheckoutLineItem[];
  success_url: string;
  cancel_url: string;
  metadata: Record<string, string>;
  client_reference_id?: string;
};

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
}): CheckoutSessionCreateParams {
  const successPath = input.type === 'consultancy' ? '/consultanta-crypto' : '/';
  const attribution = sanitizeAttribution(input.attribution);
  const metadata: Record<string, string> = { type: input.type };

  if (attribution.utm_source) metadata.utm_source = attribution.utm_source;
  if (attribution.utm_medium) metadata.utm_medium = attribution.utm_medium;
  if (attribution.utm_campaign) metadata.utm_campaign = attribution.utm_campaign;
  if (attribution.utm_content) metadata.utm_content = attribution.utm_content;

  const params: CheckoutSessionCreateParams = {
    mode: 'payment',
    allow_promotion_codes: true,
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
