import {
  parseBookingUrl,
  WHATSAPP_MESSAGES,
  type SchedulingLocale,
} from './scheduling';

export const CONSULTANCY_PACKAGE_ORDER = ['sesiune', 'pachet-3', 'mentorat-6'] as const;

export type ConsultancyPackageId = (typeof CONSULTANCY_PACKAGE_ORDER)[number];

export type ConsultancyPackage = {
  id: ConsultancyPackageId;
  /** Name written on the Stripe Checkout line. The 1:1 name stays the historical one. */
  checkoutName: string;
  offerName: { ro: string; en: string };
  /** Amount in euro cents. The client never supplies this. */
  unitAmount: number;
  currency: 'eur';
  /**
   * Only the 60-minute session may use STRIPE_PRICE_ID_CONSULTANCY.
   * The other packages always use inline price_data.
   */
  useCatalogPrice: boolean;
};

export const CONSULTANCY_PACKAGES: Record<ConsultancyPackageId, ConsultancyPackage> = {
  sesiune: {
    id: 'sesiune',
    checkoutName: 'Consultanță Crypto VIP (1h)',
    offerName: { ro: 'Sesiune 1:1', en: '1:1 session' },
    unitAmount: 20000,
    currency: 'eur',
    useCatalogPrice: true,
  },
  'pachet-3': {
    id: 'pachet-3',
    checkoutName: 'Pachet 3 sesiuni — Consultanță Crypto',
    offerName: { ro: 'Pachet 3 sesiuni', en: '3-session pack' },
    unitAmount: 54000,
    currency: 'eur',
    useCatalogPrice: false,
  },
  'mentorat-6': {
    id: 'mentorat-6',
    checkoutName: 'Mentorat 6 săptămâni — Consultanță Crypto',
    offerName: { ro: 'Mentorat 6 săptămâni', en: '6-week mentoring' },
    unitAmount: 150000,
    currency: 'eur',
    useCatalogPrice: false,
  },
};

const PACKAGE_MESSAGE_KEY: Record<ConsultancyPackageId, 'sesiune' | 'pack3' | 'mentor'> = {
  sesiune: 'sesiune',
  'pachet-3': 'pack3',
  'mentorat-6': 'mentor',
};

export function consultancyMessageKey(id: ConsultancyPackageId): 'sesiune' | 'pack3' | 'mentor' {
  return PACKAGE_MESSAGE_KEY[id];
}

export function isConsultancyPackageId(value: string): value is ConsultancyPackageId {
  return (CONSULTANCY_PACKAGE_ORDER as readonly string[]).includes(value);
}

export function consultancyPackageById(
  value: string | null | undefined
): ConsultancyPackage | null {
  if (!value || !isConsultancyPackageId(value)) return null;
  return CONSULTANCY_PACKAGES[value];
}

/** 200 stays "200". Romanian groups thousands with a dot: "1.500". English uses a comma. */
export function formatEurAmount(cents: number, locale: 'ro' | 'en' = 'ro'): string {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error('Suma în cenți trebuie să fie un întreg pozitiv.');
  }
  const [whole, frac] = (cents / 100).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, locale === 'en' ? ',' : '.');
  if (frac === '00') return grouped;
  return `${grouped}${locale === 'en' ? '.' : ','}${frac}`;
}

export function formatEurPrice(cents: number, locale: 'ro' | 'en' = 'ro'): string {
  const amount = formatEurAmount(cents, locale);
  return locale === 'en' ? `€${amount}` : `${amount} €`;
}

export function threeSessionCompare(): {
  fullCents: number;
  payCents: number;
  percentOff: number;
} {
  const fullCents = CONSULTANCY_PACKAGES.sesiune.unitAmount * 3;
  const payCents = CONSULTANCY_PACKAGES['pachet-3'].unitAmount;
  const percentOff = Math.round((1 - payCents / fullCents) * 100);
  return { fullCents, payCents, percentOff };
}

/**
 * Href for the calendar button.
 * Empty, "#", and any non-https value must not render a link.
 */
export function bookingAnchorHref(raw: string | null | undefined): string | null {
  const href = parseBookingUrl(raw);
  if (!href || href === '#' || href.startsWith('#')) return null;
  return href;
}

/**
 * The 60-minute purchase keeps the existing WhatsApp text.
 * Larger packages ask to set the dates, without calling them a single hour.
 */
export function consultancyFollowupMessage(
  locale: SchedulingLocale,
  itemName: string | null | undefined
): string {
  const single = CONSULTANCY_PACKAGES.sesiune.checkoutName;
  if (itemName && itemName !== single) {
    return locale === 'en'
      ? 'Hi Mihai. I paid for consulting and I want to set the dates.'
      : 'Bună, Mihai. Am plătit consultanța și vreau să stabilim datele.';
  }
  return WHATSAPP_MESSAGES.consultancy[locale];
}
