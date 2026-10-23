import type { CheckerEnv } from './config';

/**
 * Sites allowed to frame the checker and to receive Stripe return URLs.
 * Apex hosts redirect to www, so return URLs use the canonical www origin.
 * Metadata `source` stays the bare host: stirilecrypto.ro or mihaidaniel.ro.
 */
export const CANONICAL_RETURN_ORIGINS: Record<string, string> = {
  'mihaidaniel.ro': 'https://www.mihaidaniel.ro',
  'stirilecrypto.ro': 'https://www.stirilecrypto.ro',
};

export const DEFAULT_EMBED_ORIGINS = [
  'https://mihaidaniel.ro',
  'https://www.mihaidaniel.ro',
  'https://stirilecrypto.ro',
  'https://www.stirilecrypto.ro',
];

export type EmbedContext = {
  source: string;
  returnOrigin: string;
};

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function isHttpOrigin(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.origin !== value.replace(/\/$/, '')) return false;
    if (url.protocol === 'https:') return true;
    return url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1');
  } catch {
    return false;
  }
}

export function embedOrigins(env: CheckerEnv = process.env): string[] {
  const extras = (env.ADDRESS_CHECKER_EMBED_ORIGINS ?? '')
    .split(',')
    .map((item) => item.trim().replace(/\/$/, ''))
    .filter(isHttpOrigin);
  const local =
    env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : [];
  return unique([...DEFAULT_EMBED_ORIGINS, ...local, ...extras]);
}

export function isAllowedEmbedOrigin(origin: string, env: CheckerEnv = process.env): boolean {
  return embedOrigins(env).includes(origin.replace(/\/$/, ''));
}

export function bareHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, '');
}

/**
 * Accepts `stirilecrypto.ro`, `www.stirilecrypto.ro`, or a full allowlisted origin.
 * Unknown hosts are rejected so return URLs cannot be used as an open redirect.
 */
export function resolveEmbedSource(
  raw: string | null | undefined,
  env: CheckerEnv = process.env,
): EmbedContext | null {
  if (!raw?.trim()) return null;
  const value = raw.trim();

  if (value.includes('://')) {
    const origin = value.replace(/\/$/, '');
    if (!isAllowedEmbedOrigin(origin, env)) return null;
    let hostname: string;
    try {
      hostname = new URL(origin).hostname;
    } catch {
      return null;
    }
    const source = bareHost(hostname);
    const canonical = CANONICAL_RETURN_ORIGINS[source];
    return { source, returnOrigin: canonical ?? origin };
  }

  const source = bareHost(value);
  if (!/^[a-z0-9.-]+$/.test(source) || source.includes('..')) return null;
  const canonical = CANONICAL_RETURN_ORIGINS[source];
  if (canonical) return { source, returnOrigin: canonical };

  const match = embedOrigins(env).find((origin) => {
    try {
      return bareHost(new URL(origin).hostname) === source;
    } catch {
      return false;
    }
  });
  if (!match) return null;
  return { source, returnOrigin: match };
}

export function defaultEmbedContext(env: CheckerEnv = process.env): EmbedContext {
  const configured = env.NEXT_PUBLIC_BASE_URL?.trim();
  return (
    resolveEmbedSource(configured, env) ?? {
      source: 'mihaidaniel.ro',
      returnOrigin: 'https://www.mihaidaniel.ro',
    }
  );
}

export function canonicalSiteOrigin(env: CheckerEnv = process.env): string {
  return defaultEmbedContext(env).returnOrigin;
}

/** Stripe sends the buyer back to the site that started the check. Paths match on both sites. */
export function checkoutReturnUrls(returnOrigin: string): { successUrl: string; cancelUrl: string } {
  return {
    successUrl: `${returnOrigin}/verifica-adresa/plata/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${returnOrigin}/verifica-adresa/plata/anulata`,
  };
}

export function frameAncestorsValue(env: CheckerEnv = process.env): string {
  return ["'self'", ...embedOrigins(env)].join(' ');
}

export function isCheckerPage(pathname: string): boolean {
  return (
    pathname === '/verifica-adresa' ||
    pathname.startsWith('/verifica-adresa/') ||
    pathname === '/en/verifica-adresa' ||
    pathname.startsWith('/en/verifica-adresa/')
  );
}

export function applyCheckerFrameHeaders(
  pathname: string,
  headers: { set: (name: string, value: string) => void },
  env: CheckerEnv = process.env,
): void {
  if (!isCheckerPage(pathname)) return;
  headers.set('Content-Security-Policy', `frame-ancestors ${frameAncestorsValue(env)}`);
  headers.set('Referrer-Policy', 'no-referrer');
}

/** Stripe Checkout refuses to run inside a cross-site iframe, so the embed opens a new tab. */
export function checkoutNavigation(inIframe: boolean): 'new-tab' | 'same-tab' {
  return inIframe ? 'new-tab' : 'same-tab';
}

export function reportPageUrl(origin: string, token: string): string {
  return `${origin}/verifica-adresa/raport/${encodeURIComponent(token)}`;
}

export function creditPageUrl(origin: string, token: string): string {
  return `${origin}/verifica-adresa/credite/${encodeURIComponent(token)}`;
}

export function isPublicToken(value: string): boolean {
  return /^[A-Za-z0-9_-]{20,128}$/.test(value);
}

export function isStripeSessionId(value: string): boolean {
  return /^cs_(test|live)_[A-Za-z0-9]+$/.test(value) && value.length <= 255;
}
