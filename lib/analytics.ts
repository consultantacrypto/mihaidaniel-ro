import { hasAnalyticsConsent, onConsentChange, readStoredConsent } from '@/lib/consent';

type GtagParamValue =
  | string
  | number
  | boolean
  | undefined
  | GtagParamValue[]
  | { [key: string]: GtagParamValue };

type GtagParams = Record<string, GtagParamValue>;

const purchasePending = new Set<string>();
const pendingRuns: Array<() => void> = [];

function analyticsAllowed(): boolean {
  return hasAnalyticsConsent(readStoredConsent());
}

function deliver(eventName: string, params?: GtagParams): void {
  // No consent, no hit. A stub gtag must not queue events that would
  // flush later when the library finally loads.
  if (!analyticsAllowed()) return;
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params);
  } catch (error) {
    console.error('[analytics] gtag event failed (ignored):', error);
  }
}

/** Run only after the GA4 library has loaded and consent is granted. */
function whenGaReady(run: () => void): void {
  if (typeof window === 'undefined' || !analyticsAllowed()) return;
  if (window.__mdGaReady) {
    run();
    return;
  }
  pendingRuns.push(run);
}

/** Called from the GA4 script onload, after `config`. */
export function markGoogleAnalyticsReady(): void {
  if (typeof window === 'undefined') return;
  window.__mdGaReady = true;
  const runs = pendingRuns.splice(0, pendingRuns.length);
  for (const run of runs) run();
}

function trackEvent(eventName: string, params?: GtagParams): void {
  try {
    whenGaReady(() => deliver(eventName, params));
  } catch (error) {
    console.error('[analytics] gtag event failed (ignored):', error);
  }
}

export function purchaseStorageKey(transactionId: string): string {
  return `md_purchase_${transactionId}`;
}

function purchaseAlreadySent(transactionId: string): boolean {
  try {
    return window.localStorage.getItem(purchaseStorageKey(transactionId)) === '1';
  } catch {
    return false;
  }
}

function rememberPurchase(transactionId: string): void {
  try {
    window.localStorage.setItem(purchaseStorageKey(transactionId), '1');
  } catch {
    // Still send once for this page view.
  }
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
 * Does not call gtag, and does not mark the purchase as sent, until the
 * visitor has accepted analytics and the GA4 library has loaded.
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
  if (purchaseAlreadySent(transactionId)) return;

  purchasePending.add(transactionId);

  const send = () => {
    whenGaReady(() => {
      if (!analyticsAllowed() || purchaseAlreadySent(transactionId)) return;
      rememberPurchase(transactionId);
      deliver('purchase', {
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
  };

  if (analyticsAllowed()) {
    send();
    return;
  }

  const stop = onConsentChange((consent) => {
    if (consent.analytics !== 'granted') return;
    stop();
    send();
  });
}
