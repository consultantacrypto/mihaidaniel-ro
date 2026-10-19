'use client';

import { useEffect } from 'react';
import { markGoogleAnalyticsReady } from '@/lib/analytics';
import {
  GA_MEASUREMENT_ID,
  applyConsentUpdate,
  googleAnalyticsSrc,
  hasAnalyticsConsent,
  onConsentChange,
  readStoredConsent,
} from '@/lib/consent';

const SCRIPT_ID = 'ga4-loader';

/**
 * Loads gtag.js only after analytics consent is granted.
 * Consent Mode was already set to denied in the initial HTML.
 */
export function loadGoogleAnalytics(): void {
  if (typeof document === 'undefined') return;
  if (!hasAnalyticsConsent(readStoredConsent())) return;

  applyConsentUpdate('granted');
  if (window.__mdGaReady || document.getElementById(SCRIPT_ID)) {
    if (window.__mdGaReady) markGoogleAnalyticsReady();
    return;
  }

  window.gtag?.('js', new Date());
  window.gtag?.('config', GA_MEASUREMENT_ID);

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = googleAnalyticsSrc();
  script.onload = () => markGoogleAnalyticsReady();
  document.head.appendChild(script);
}

export default function GoogleAnalytics() {
  useEffect(() => {
    loadGoogleAnalytics();
    return onConsentChange((consent) => {
      if (consent.analytics === 'granted') {
        loadGoogleAnalytics();
        return;
      }
      applyConsentUpdate('denied');
    });
  }, []);

  return null;
}
