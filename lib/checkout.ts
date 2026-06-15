import { trackBuyConsultancy, trackBuyCourse } from '@/lib/analytics';
import type { CheckoutProductType } from '@/lib/stripe';

type CheckoutResponse = { url: string };
type CheckoutErrorResponse = { error: string };

export async function startCheckout(
  type: CheckoutProductType,
  trackingLabel = 'Stripe'
): Promise<void> {
  // Fire-and-forget analytics — NEVER allow it to block the Stripe redirect.
  try {
    if (type === 'consultancy') {
      trackBuyConsultancy(trackingLabel);
    } else {
      trackBuyCourse(trackingLabel);
    }
  } catch (error) {
    console.error('[checkout] Tracking failed (ignored):', error);
  }

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });

  let data: CheckoutResponse | CheckoutErrorResponse;
  try {
    data = await response.json();
  } catch {
    throw new Error('Răspuns invalid de la server.');
  }

  if (!response.ok || !('url' in data) || !data.url) {
    const message =
      'error' in data && data.error
        ? data.error
        : 'Nu am putut porni plata. Încearcă din nou.';
    throw new Error(message);
  }

  window.location.href = data.url;
}
