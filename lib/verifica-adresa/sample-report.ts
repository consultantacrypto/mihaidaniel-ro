import type { CheckSuccess } from './check';
import { NETWORK_LABELS, SAFETY_TIPS } from './copy';
import type { PaidRiskReport } from './providers';
import type { ReportDocument } from './report';

const SAMPLE_SANCTIONS: CheckSuccess = {
  ok: true,
  network: 'evm',
  networkLabel: NETWORK_LABELS.evm,
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  sanctioned: true,
  verdict: 'DA',
  headline: 'Sancționată: DA',
  explanation:
    'Exemplu fictiv: adresa apare într-o listă consultată. Există expunere la sancțiuni. Potrivirea nu descrie întreaga activitate a adresei. Aceste date nu provin dintr-o verificare.',
  sources: [
    {
      id: 'ofac-sdn',
      name: 'OFAC SDN (Trezoreria SUA)',
      fetchedAt: '2026-10-23T05:20:00.000Z',
      publishedAt: '2026-10-22T00:00:00.000Z',
      fetchedOn: '23 octombrie 2026',
      publishedOn: '22 octombrie 2026',
      stale: false,
      matched: true,
    },
    {
      id: 'eu-fsd',
      name: 'Lista consolidată de sancțiuni financiare a UE',
      fetchedAt: '2026-10-23T05:20:00.000Z',
      publishedAt: '2026-10-22T00:00:00.000Z',
      fetchedOn: '23 octombrie 2026',
      publishedOn: '22 octombrie 2026',
      stale: false,
      matched: false,
    },
  ],
  checkedAt: '2026-10-23T12:00:00.000Z',
  checkedOn: '23 octombrie 2026',
  chainabuseUrl: 'https://www.chainabuse.com/address/exemplu',
  chainabuseLabel: 'Vezi rapoartele publice de pe Chainabuse pentru această adresă',
  tips: SAFETY_TIPS,
};

const SAMPLE_RISK: PaidRiskReport = {
  provider: 'misttrack',
  address: SAMPLE_SANCTIONS.address,
  network: 'evm',
  score: 86,
  level: 'High',
  summary: 'Mixer, Hack',
  labels: ['Malicious Address', 'Interact With High-risk Address'],
  exposures: [
    {
      category: 'mixer',
      detail: 'Serviciu de amestecare (exemplu)',
      exposure: 'direct',
      hops: 1,
      percent: 0.42,
    },
    {
      category: 'hack',
      detail: 'Incident publicat (exemplu)',
      exposure: 'indirect',
      hops: 3,
      percent: 0.11,
    },
    {
      category: 'scam',
      detail: 'Semnal de furnizor (exemplu)',
      exposure: 'indirect',
      hops: 4,
      percent: 0.07,
    },
  ],
  generatedAt: '2026-10-23T12:00:00.000Z',
};

export function sampleReport(): ReportDocument {
  return {
    token: 'exemplu',
    publicId: 'QE-EXEMPLU',
    status: 'ready',
    sample: true,
    createdAt: '2026-10-23T12:00:00.000Z',
    expiresAt: '2026-10-26T12:00:00.000Z',
    source: 'mihaidaniel.ro',
    network: 'evm',
    networkLabel: NETWORK_LABELS.evm,
    address: SAMPLE_SANCTIONS.address,
    sanctions: SAMPLE_SANCTIONS,
    risk: SAMPLE_RISK,
    failureReason: null,
    refundId: null,
  };
}
