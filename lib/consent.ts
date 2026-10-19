export const CONSENT_COOKIE = 'md_consent';
export const CONSENT_STORAGE_KEY = 'md_consent';
/** 12 months. Within the 6–12 month window for remembering a choice. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const CONSENT_VERSION = 1;

export const GA_MEASUREMENT_ID = 'G-ZYYJ251HYH';

export const CONSENT_CHANGE_EVENT = 'md-consent-change';
export const OPEN_CONSENT_EVENT = 'md-open-consent';

export type AnalyticsChoice = 'granted' | 'denied';

export type StoredConsent = {
  analytics: AnalyticsChoice;
  updatedAt: number;
};

export type ConsentModeState = {
  ad_storage: 'denied';
  ad_user_data: 'denied';
  ad_personalization: 'denied';
  analytics_storage: AnalyticsChoice;
  functionality_storage: 'denied';
  personalization_storage: 'denied';
  security_storage: 'granted';
};

/**
 * Google Consent Mode v2.
 * Analytics stays denied until the visitor presses Accept.
 * Ad signals stay denied: this site does not use Google Ads.
 * security_storage stays granted so the consent choice itself can be stored.
 */
export function consentModeState(analytics: AnalyticsChoice): ConsentModeState {
  return {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: analytics,
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
  };
}

export function hasAnalyticsConsent(consent: StoredConsent | null | undefined): boolean {
  return consent?.analytics === 'granted';
}

export function serializeConsent(consent: StoredConsent): string {
  return `${CONSENT_VERSION}.${consent.analytics}.${consent.updatedAt}`;
}

export function parseConsent(
  value: string | null | undefined,
  now = Date.now()
): StoredConsent | null {
  if (!value) return null;
  const match = /^1\.(granted|denied)\.(\d{10,13})$/.exec(value.trim());
  if (!match) return null;
  const updatedAt = Number(match[2]);
  if (!Number.isSafeInteger(updatedAt)) return null;
  if (now - updatedAt > CONSENT_MAX_AGE_SECONDS * 1000) return null;
  if (updatedAt - now > 60 * 1000) return null;
  return {
    analytics: match[1] as AnalyticsChoice,
    updatedAt,
  };
}

export function chooseConsent(
  left: StoredConsent | null,
  right: StoredConsent | null
): StoredConsent | null {
  if (!left) return right;
  if (!right) return left;
  return left.updatedAt >= right.updatedAt ? left : right;
}

export function consentCookieAttributes(secure: boolean): string {
  const secureAttr = secure ? '; Secure' : '';
  return `Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secureAttr}`;
}

export function consentCookieAssignment(consent: StoredConsent, secure: boolean): string {
  return `${CONSENT_COOKIE}=${serializeConsent(consent)}; ${consentCookieAttributes(secure)}`;
}

export function readConsentFromCookieHeader(
  header: string | null | undefined,
  now = Date.now()
): StoredConsent | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) !== CONSENT_COOKIE) continue;
    const raw = trimmed.slice(eq + 1);
    try {
      return parseConsent(decodeURIComponent(raw), now);
    } catch {
      return parseConsent(raw, now);
    }
  }
  return null;
}

export function googleAnalyticsSrc(measurementId = GA_MEASUREMENT_ID): string {
  return `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
}

/**
 * Runs before paint. Sets Consent Mode defaults to denied and does not
 * load gtag.js. The html class reveals the banner when no choice is stored.
 */
export function buildConsentDefaultScript(): string {
  const defaults = {
    ...consentModeState('denied'),
    wait_for_update: 500,
  };
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', ${JSON.stringify(defaults)});
gtag('set', 'ads_data_redaction', true);
try {
  var raw = null;
  try { raw = localStorage.getItem('${CONSENT_STORAGE_KEY}'); } catch (e) {}
  if (!raw) {
    var match = document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]+)/);
    if (match) {
      try { raw = decodeURIComponent(match[1]); } catch (e) { raw = match[1]; }
    }
  }
  var fresh = false;
  if (raw && /^1\\.(granted|denied)\\.\\d{10,13}$/.test(raw)) {
    var stamp = Number(raw.split('.')[2]);
    var age = Date.now() - stamp;
    fresh = age >= -60000 && age <= ${CONSENT_MAX_AGE_SECONDS * 1000};
  }
  if (!fresh) document.documentElement.classList.add('consent-unknown');
} catch (e) {
  document.documentElement.classList.add('consent-unknown');
}
`.trim();
}

function browserSecure(): boolean {
  return window.location.protocol === 'https:';
}

export function readStoredConsent(now = Date.now()): StoredConsent | null {
  if (typeof window === 'undefined') return null;
  let fromStorage: StoredConsent | null = null;
  try {
    fromStorage = parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY), now);
  } catch {
    fromStorage = null;
  }
  const fromCookie = readConsentFromCookieHeader(window.document.cookie, now);
  return chooseConsent(fromStorage, fromCookie);
}

function ensureGtagStub(): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    // Same stub Google documents: push the Arguments object, do not load gtag.js.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __mdGaReady?: boolean;
    __mdAttribution?: Record<string, string>;
  }
}

export function applyConsentUpdate(analytics: AnalyticsChoice): void {
  if (typeof window === 'undefined') return;
  ensureGtagStub();
  window.gtag?.('consent', 'update', consentModeState(analytics));
}

export function writeStoredConsent(
  analytics: AnalyticsChoice,
  now = Date.now()
): StoredConsent {
  const consent: StoredConsent = { analytics, updatedAt: now };
  if (typeof window === 'undefined') return consent;
  const serialized = serializeConsent(consent);
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
  } catch {
    // Private mode. The cookie still records the choice when it can.
  }
  window.document.cookie = consentCookieAssignment(consent, browserSecure());
  applyConsentUpdate(analytics);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: consent }));
  return consent;
}

export function onConsentChange(listener: (consent: StoredConsent) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<StoredConsent>).detail;
    if (detail && (detail.analytics === 'granted' || detail.analytics === 'denied')) {
      listener(detail);
    }
  };
  window.addEventListener(CONSENT_CHANGE_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
}

export function openConsentSettings(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
