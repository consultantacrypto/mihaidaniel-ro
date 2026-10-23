import type { Network } from './networks';
import type { CheckerEnv } from './config';
import { isRiskProviderEnabled } from './config';

/**
 * Server-side adapter for a paid full risk report.
 * The free sanctions check must never call this.
 * Disabled unless RISK_REPORT_PROVIDER_ENABLED=true and MISTTRACK_API_KEY is set.
 * No key is shipped with the repo.
 *
 * MistTrack Developer API (v3), documented at
 * https://docs.misttrack.io/api-endpoints/get-risk-score-v3
 * GET https://openapi.misttrack.io/v3/risk_score?coin=ETH&address=...&api_key=...
 */

export type RiskReportRequest = {
  address: string;
  network: Network;
};

export type RiskExposure = {
  category: string;
  detail: string;
  exposure: 'direct' | 'indirect' | 'unknown';
};

export type PaidRiskReport = {
  provider: string;
  address: string;
  network: Network;
  score: number | null;
  level: string | null;
  summary: string;
  exposures: RiskExposure[];
  generatedAt: string;
};

export interface RiskReportProvider {
  readonly id: string;
  isEnabled(): boolean;
  getReport(input: RiskReportRequest): Promise<PaidRiskReport>;
}

export class RiskReportDisabledError extends Error {
  constructor() {
    super('Raportul complet de risc este dezactivat.');
    this.name = 'RiskReportDisabledError';
  }
}

const MISTTRACK_COIN: Record<Network, string> = {
  btc: 'BTC',
  evm: 'ETH',
  tron: 'TRX',
  sol: 'SOL',
};

type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;

export class MistTrackProvider implements RiskReportProvider {
  readonly id = 'misttrack';

  constructor(
    private readonly env: CheckerEnv = process.env,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  isEnabled(): boolean {
    return isRiskProviderEnabled(this.env);
  }

  async getReport(input: RiskReportRequest): Promise<PaidRiskReport> {
    if (!this.isEnabled()) {
      throw new RiskReportDisabledError();
    }
    const apiKey = this.env.MISTTRACK_API_KEY?.trim() ?? '';
    const url = new URL('https://openapi.misttrack.io/v3/risk_score');
    url.searchParams.set('coin', MISTTRACK_COIN[input.network]);
    url.searchParams.set('address', input.address);
    url.searchParams.set('api_key', apiKey);

    const response = await this.fetchImpl(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`MistTrack a răspuns cu HTTP ${response.status}.`);
    }
    const payload: unknown = await response.json();
    return normalizeMistTrack(payload, input);
  }
}

export function getRiskReportProvider(
  env: CheckerEnv = process.env,
  fetchImpl?: FetchLike,
): RiskReportProvider {
  return new MistTrackProvider(env, fetchImpl);
}

function normalizeMistTrack(payload: unknown, input: RiskReportRequest): PaidRiskReport {
  const root = asRecord(payload);
  const data = asRecord(root?.data) ?? root;
  const score = typeof data?.score === 'number' ? data.score : null;
  const level = typeof data?.risk_level === 'string' ? data.risk_level : null;
  const details = Array.isArray(data?.detail_list)
    ? data.detail_list.filter((item): item is string => typeof item === 'string')
    : [];
  const riskDetail = Array.isArray(data?.risk_detail) ? data.risk_detail : [];
  const exposures: RiskExposure[] = riskDetail.map((item) => {
    const record = asRecord(item);
    const exposure = record?.exposure_type;
    return {
      category: typeof record?.risk_type === 'string' ? record.risk_type : 'unknown',
      detail: typeof record?.entity === 'string' ? record.entity : '',
      exposure: exposure === 'direct' || exposure === 'indirect' ? exposure : 'unknown',
    };
  });

  return {
    provider: 'misttrack',
    address: input.address,
    network: input.network,
    score,
    level,
    summary: details.join(', '),
    exposures,
    generatedAt: new Date().toISOString(),
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null;
  return value as Record<string, unknown>;
}
