import { hasAnalyticsConsent, readStoredConsent } from '@/lib/consent';

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type Attribution = Partial<Record<UtmKey, string>>;

export const ATTRIBUTION_COOKIE = 'md_utm';
export const ATTRIBUTION_STORAGE_KEY = 'md_utm';
export const ATTRIBUTION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

const MAX_VALUE_LENGTH = 120;

function sanitizeUtmValue(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
  if (!cleaned) return undefined;
  return cleaned.slice(0, MAX_VALUE_LENGTH);
}

export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== 'object') return {};
  const source = input as Record<string, unknown>;
  const result: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = sanitizeUtmValue(source[key]);
    if (value) result[key] = value;
  }
  return result;
}

export function hasAttribution(attr: Attribution | null | undefined): boolean {
  if (!attr) return false;
  return UTM_KEYS.some((key) => Boolean(attr[key]));
}

export function serializeAttribution(attr: Attribution): string {
  const params = new URLSearchParams();
  for (const key of UTM_KEYS) {
    const value = attr[key];
    if (value) params.set(key, value);
  }
  return params.toString();
}

export function parseAttributionValue(value: string | null | undefined): Attribution {
  if (!value) return {};
  const params = new URLSearchParams(value);
  const raw: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const found = params.get(key);
    if (found) raw[key] = found;
  }
  return sanitizeAttribution(raw);
}

export function attributionFromCookieHeader(
  header: string | null | undefined
): Attribution {
  if (!header) return {};
  for (const part of header.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) !== ATTRIBUTION_COOKIE) continue;
    try {
      return parseAttributionValue(decodeURIComponent(trimmed.slice(eq + 1)));
    } catch {
      return {};
    }
  }
  return {};
}

/** Body wins when it has any UTM. Otherwise fall back to the first-party cookie. */
export function resolveRequestAttribution(
  bodyAttribution: unknown,
  cookieHeader: string | null | undefined
): Attribution {
  const fromBody = sanitizeAttribution(bodyAttribution);
  if (hasAttribution(fromBody)) return fromBody;
  return attributionFromCookieHeader(cookieHeader);
}

/**
 * Compact id for Stripe `client_reference_id` (max 200 chars).
 * Shape: `source:x|medium:bio|campaign:consult|content:pin`
 */
export function toClientReferenceId(attr: Attribution | undefined): string | undefined {
  if (!hasAttribution(attr) || !attr) return undefined;
  const compact = UTM_KEYS.filter((key) => attr[key])
    .map((key) => `${key.slice(4)}:${attr[key]!.replace(/[|;]/g, '')}`)
    .join('|')
    .slice(0, 200);
  return compact || undefined;
}

function readMemoryAttribution(): Attribution {
  if (typeof window === 'undefined' || !window.__mdAttribution) return {};
  return sanitizeAttribution(window.__mdAttribution);
}

function rememberAttribution(attr: Attribution): void {
  window.__mdAttribution = { ...attr };
}

/** Drops the campaign cookie and localStorage copy. Keeps the in-tab value. */
export function clearPersistedAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
  } catch {
    // Storage can be blocked. The cookie clear below still runs.
  }
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  window.document.cookie = `${ATTRIBUTION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function readStoredAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  const memory = readMemoryAttribution();
  if (hasAttribution(memory)) return memory;
  try {
    const stored = parseAttributionValue(
      window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY)
    );
    if (hasAttribution(stored)) return stored;
  } catch {
    // Private mode or blocked storage.
  }
  return attributionFromCookieHeader(window.document.cookie);
}

export function persistAttribution(attr: Attribution): void {
  if (typeof window === 'undefined') return;
  if (!hasAttribution(attr)) return;
  rememberAttribution(attr);
  // Campaign storage is not required for Stripe. Write it only after Accept.
  if (!hasAnalyticsConsent(readStoredConsent())) return;
  const value = serializeAttribution(attr);
  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, value);
  } catch {
    // Ignore storage failures. The cookie is the server-visible copy.
  }
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  window.document.cookie = `${ATTRIBUTION_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${ATTRIBUTION_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

/** Persist after Accept, or delete the campaign cookie after Refuz. */
export function syncAttributionWithConsent(): void {
  const consent = readStoredConsent();
  if (!consent) return;
  if (consent.analytics === 'denied') {
    clearPersistedAttribution();
    return;
  }
  const memory = readMemoryAttribution();
  if (hasAttribution(memory)) persistAttribution(memory);
}

/**
 * Last touch: a landing URL that carries any utm_* replaces the stored set.
 * A later page without UTMs keeps what was already stored.
 */
export function captureAttributionFromLocation(): Attribution {
  if (typeof window === 'undefined') return {};
  const fromUrl = parseAttributionValue(window.location.search);
  if (hasAttribution(fromUrl)) {
    persistAttribution(fromUrl);
    return fromUrl;
  }
  return readStoredAttribution();
}
