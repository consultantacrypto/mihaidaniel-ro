type GtagParamValue =
  | string
  | number
  | boolean
  | undefined
  | GtagParamValue[]
  | { [key: string]: GtagParamValue };

type GtagParams = Record<string, GtagParamValue>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const purchasePending = new Set<string>();

function trackEvent(eventName: string, params?: GtagParams): void {
  // Analytics must never block business-critical flows (e.g. Stripe redirect).
  // Any failure (undefined gtag, ad-blocker, proxy error) is ignored silently.
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', eventName, params);
  } catch (error) {
    console.error('[analytics] gtag event failed (ignored):', error);
  }
}

function whenGtagReady(run: () => void): void {
  if (typeof window === 'undefined') return;
  const started = Date.now();
  const attempt = () => {
    if (typeof window.gtag === 'function') {
      run();
      return;
    }
    if (Date.now() - started > 12000) return;
    window.setTimeout(attempt, 250);
  };
  attempt();
}

export function purchaseStorageKey(transactionId: string): string {
  return `md_purchase_${transactionId}`;
}

/** Stripe / Calendly / purchase intent — consultanță VIP */
export function trackBuyConsultancy(label: string): void {
  trackEvent('click_buy_consultancy', {
    event_category: 'engagement',
    event_label: label,
  });
}

/** Stripe / purchase intent — curs */
export function trackBuyCourse(label: string): void {
  trackEvent('click_buy_course', {
    event_category: 'engagement',
    event_label: label,
  });
}

/**
 * GA4 purchase, once per Stripe Checkout session on this browser.
 * Waits until the existing gtag snippet has loaded so the event is queued
 * after `config` and is not dropped.
 */
export function trackPurchaseOnce(input: {
  transactionId: string;
  value: number;
  currency: string;
  productType: string;
  itemName: string;
}): void {
  if (typeof window === 'undefined') return;
  const { transactionId } = input;
  if (!transactionId || purchasePending.has(transactionId)) return;

  const storageKey = purchaseStorageKey(transactionId);
  try {
    if (window.localStorage.getItem(storageKey) === '1') return;
  } catch {
    // Continue with the in-memory guard when storage is blocked.
  }

  purchasePending.add(transactionId);
  whenGtagReady(() => {
    try {
      if (window.localStorage.getItem(storageKey) === '1') return;
      window.localStorage.setItem(storageKey, '1');
    } catch {
      // Still send once for this page view.
    }
    trackEvent('purchase', {
      transaction_id: transactionId,
      value: input.value,
      currency: input.currency,
      items: [
        {
          item_id: input.productType,
          item_name: input.itemName,
          price: input.value,
          quantity: 1,
        },
      ],
    });
  });
}
