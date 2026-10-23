import { SPONSOR_DISCLOSURE_DEFAULT } from './copy';
import { OPERATOR_LINE } from './sources';

export type ReportOffer = {
  id: string;
  credits: number;
  priceUsd: number;
  label: string;
};

export type SponsorConfig = {
  enabled: boolean;
  title: string;
  body: string;
  href: string;
  cta: string;
  disclosure: string;
};

export type CheckerEnv = Record<string, string | undefined>;

export const DEFAULT_SINGLE_PRICE_USD = 10;

export const DEFAULT_CREDIT_PACKS: ReportOffer[] = [
  { id: 'pack_5', credits: 5, priceUsd: 40, label: 'Pachet 5 rapoarte' },
  { id: 'pack_20', credits: 20, priceUsd: 140, label: 'Pachet 20 rapoarte' },
];

export function singleReportPrice(env: CheckerEnv = process.env): number {
  const raw = env.RISK_REPORT_PRICE_USD?.trim();
  if (!raw) return DEFAULT_SINGLE_PRICE_USD;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0 || value > 10000) return DEFAULT_SINGLE_PRICE_USD;
  return Math.round(value * 100) / 100;
}

/**
 * Missing or invalid JSON keeps the default packs.
 * An explicit empty array turns packs off.
 */
export function creditPacks(env: CheckerEnv = process.env): ReportOffer[] {
  const raw = env.RISK_REPORT_CREDIT_PACKS?.trim();
  if (!raw) return DEFAULT_CREDIT_PACKS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_CREDIT_PACKS;
    const packs: ReportOffer[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== 'object') return DEFAULT_CREDIT_PACKS;
      const record = item as Record<string, unknown>;
      const id = typeof record.id === 'string' ? record.id.trim() : '';
      const credits = Number(record.credits);
      const priceUsd = Number(record.priceUsd);
      const label = typeof record.label === 'string' ? record.label.trim() : '';
      if (!/^[a-z0-9_-]{1,40}$/i.test(id) || id === 'single') return DEFAULT_CREDIT_PACKS;
      if (!Number.isInteger(credits) || credits < 2 || credits > 1000) return DEFAULT_CREDIT_PACKS;
      if (!Number.isFinite(priceUsd) || priceUsd <= 0 || priceUsd > 10000) return DEFAULT_CREDIT_PACKS;
      if (!label || label.length > 80) return DEFAULT_CREDIT_PACKS;
      packs.push({
        id,
        credits,
        priceUsd: Math.round(priceUsd * 100) / 100,
        label,
      });
    }
    return packs;
  } catch {
    return DEFAULT_CREDIT_PACKS;
  }
}

export function reportOffers(env: CheckerEnv = process.env): ReportOffer[] {
  return [
    {
      id: 'single',
      credits: 1,
      priceUsd: singleReportPrice(env),
      label: 'Raport complet',
    },
    ...creditPacks(env),
  ];
}

export function findOffer(offerId: string, env: CheckerEnv = process.env): ReportOffer | null {
  return reportOffers(env).find((offer) => offer.id === offerId) ?? null;
}

/** The paid flow stays off unless this flag is exactly "true". */
export function isPaymentsEnabled(env: CheckerEnv = process.env): boolean {
  return env.ADDRESS_CHECKER_PAYMENTS_ENABLED === 'true';
}

/**
 * Orders and reports live in Upstash Redis or Vercel KV (same REST API).
 * Either pair is enough. No store is shipped with the repo.
 */
export function storeCredentials(env: CheckerEnv = process.env): { url: string; token: string } | null {
  const url = (env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL || '').trim().replace(/\/$/, '');
  const token = (env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN || '').trim();
  if (!url || !token) return null;
  if (!/^https:\/\//i.test(url)) return null;
  return { url, token };
}

export function reportTtlHours(env: CheckerEnv = process.env): number {
  const value = Number(env.REPORT_TTL_HOURS);
  if (!Number.isFinite(value) || value < 1 || value > 24 * 30) return 72;
  return Math.round(value);
}

export function creditPassTtlDays(env: CheckerEnv = process.env): number {
  const value = Number(env.CREDIT_PASS_TTL_DAYS);
  if (!Number.isFinite(value) || value < 1 || value > 365) return 180;
  return Math.round(value);
}

export type PaymentsBlockReason = 'disabled' | 'missing_key' | 'missing_store' | 'missing_provider';

/**
 * Checkout stays closed until Stripe, the order store, and MistTrack are all set.
 * Taking payment without a place to save the report, or without the risk provider,
 * would charge the buyer for a report we cannot deliver.
 */
export function paymentsReady(
  env: CheckerEnv = process.env,
): { ok: true } | { ok: false; reason: PaymentsBlockReason } {
  if (!isPaymentsEnabled(env)) return { ok: false, reason: 'disabled' };
  if (!env.QUICKEXIT_STRIPE_SECRET_KEY?.trim()) return { ok: false, reason: 'missing_key' };
  if (!storeCredentials(env)) return { ok: false, reason: 'missing_store' };
  if (!isRiskProviderEnabled(env)) return { ok: false, reason: 'missing_provider' };
  return { ok: true };
}

export function isRiskProviderEnabled(env: CheckerEnv = process.env): boolean {
  return env.RISK_REPORT_PROVIDER_ENABLED === 'true' && Boolean(env.MISTTRACK_API_KEY?.trim());
}

export function getSponsorConfig(env: CheckerEnv = process.env): SponsorConfig {
  const href = env.VERIFICA_SPONSOR_HREF?.trim() ?? '';
  const title = env.VERIFICA_SPONSOR_TITLE?.trim() ?? '';
  const body = env.VERIFICA_SPONSOR_BODY?.trim() ?? '';
  const cta = env.VERIFICA_SPONSOR_CTA?.trim() || 'Află mai mult';
  const disclosure = env.VERIFICA_SPONSOR_DISCLOSURE?.trim() || SPONSOR_DISCLOSURE_DEFAULT;
  const safeHref = href.startsWith('https://') ? href : '';
  const enabled = env.VERIFICA_SPONSOR_ENABLED === 'true' && Boolean(safeHref) && Boolean(title);
  return {
    enabled,
    title: enabled ? title : '',
    body: enabled ? body : '',
    href: enabled ? safeHref : '',
    cta,
    disclosure,
  };
}

export type PublicCheckerConfig = {
  paymentsEnabled: boolean;
  offers: ReportOffer[];
  sponsor: SponsorConfig;
  operatorLine: string;
};

export function publicCheckerConfig(env: CheckerEnv = process.env): PublicCheckerConfig {
  return {
    paymentsEnabled: paymentsReady(env).ok,
    offers: reportOffers(env),
    sponsor: getSponsorConfig(env),
    operatorLine: OPERATOR_LINE,
  };
}
