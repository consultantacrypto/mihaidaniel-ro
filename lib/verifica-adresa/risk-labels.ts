import type { RiskExposure } from './providers';

const CATEGORY_LABELS: Record<string, string> = {
  mixer: 'Mixer',
  sanctioned_entity: 'Entitate sancționată',
  illicit_activity: 'Activitate ilicită',
  gambling: 'Jocuri de noroc',
  risk_exchange: 'Schimb cu risc',
  bridge: 'Bridge',
  hack: 'Hack',
  hacking: 'Hack',
  hacking_event: 'Hack',
  theft: 'Furt raportat',
  scam: 'Schemă de fraudă',
  fraud: 'Schemă de fraudă',
  phishing: 'Înșelăciune',
  ransomware: 'Ransomware',
  darknet: 'Piață ascunsă',
};

const SIGNAL_LABELS: Record<string, string> = {
  'malicious address': 'Adresă cu activitate malițioasă',
  'interact with high-risk address': 'Interacțiune cu o adresă de risc ridicat',
  'interacted with high-risk address': 'Interacțiune cu o adresă de risc ridicat',
  'interact with sanctioned entity': 'Interacțiune cu o entitate sancționată',
  mixer: 'Mixer',
  sanctioned_entity: 'Entitate sancționată',
  hack: 'Hack',
};

export function categoryLabel(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return CATEGORY_LABELS[key] ?? 'Categorie de risc';
}

export function levelLabel(level: string | null): string {
  if (!level) return 'Necomunicat';
  const key = level.trim().toLowerCase();
  if (key === 'low') return 'Scăzut';
  if (key === 'moderate' || key === 'medium') return 'Moderat';
  if (key === 'high') return 'Ridicat';
  if (key === 'severe' || key === 'critical') return 'Sever';
  return 'Necomunicat';
}

export function exposureLabel(value: RiskExposure['exposure']): string {
  if (value === 'direct') return 'Directă';
  if (value === 'indirect') return 'Indirectă';
  return 'Neclasificată';
}

/** Buyer-facing provider text. Unknown wording is not passed through. */
export function signalLabel(raw: string): string {
  const key = raw.trim().toLowerCase();
  return SIGNAL_LABELS[key] ?? 'Semnal de risc de la furnizor';
}

export function exposureExtra(item: Pick<RiskExposure, 'hops' | 'percent'>): string {
  const parts: string[] = [];
  if (typeof item.hops === 'number' && item.hops > 0) {
    parts.push(item.hops === 1 ? '1 hop' : `${item.hops} hopuri`);
  }
  if (typeof item.percent === 'number' && Number.isFinite(item.percent)) {
    const value = item.percent <= 1 ? item.percent * 100 : item.percent;
    parts.push(`${Math.round(value)}%`);
  }
  return parts.join(' | ');
}
