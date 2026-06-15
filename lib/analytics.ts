type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

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
