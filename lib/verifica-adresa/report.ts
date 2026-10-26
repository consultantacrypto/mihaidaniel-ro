import type { CheckSuccess } from './check';
import type { Network } from './networks';
import type { PaidRiskReport } from './providers';

export type ReportStatus = 'ready' | 'refund_due' | 'refunded';

export type ReportDocument = {
  token: string;
  publicId: string;
  status: ReportStatus;
  sample: boolean;
  createdAt: string;
  expiresAt: string;
  source: string;
  network: Network;
  networkLabel: string;
  address: string;
  sanctions: CheckSuccess | null;
  risk: PaidRiskReport | null;
  failureReason: string | null;
  refundId: string | null;
};

export type CreditPass = {
  token: string;
  orderNonce: string;
  source: string;
  creditsTotal: number;
  creditsRemaining: number;
  reportTokens: string[];
  createdAt: string;
  expiresAt: string;
};

export type OrderStatus = 'pending' | ReportStatus;

export type CheckerOrder = {
  nonce: string;
  stripeSessionId: string | null;
  paymentIntentId: string | null;
  status: OrderStatus;
  offerId: string;
  creditsPurchased: number;
  priceUsd: number;
  source: string;
  returnOrigin: string;
  network: Network | null;
  address: string | null;
  addressSha256: string | null;
  email: string | null;
  consentAt: string;
  reportToken: string | null;
  publicId: string | null;
  creditToken: string | null;
  refundId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};
