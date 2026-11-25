import { WHATSAPP_MESSAGES, type SchedulingLocale } from './scheduling';

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

/**
 * Success-modal copy. The 60-minute session names the hour.
 * Anything else, including a package we have not identified yet, uses «să stabilim datele».
 */
export function consultancySuccessMessage(
  locale: SchedulingLocale,
  itemName: string | null | undefined
): string {
  const single = CONSULTANCY_PACKAGES.sesiune.checkoutName;
  const pack = CONSULTANCY_PACKAGES['pachet-3'].checkoutName;
  const mentor = CONSULTANCY_PACKAGES['mentorat-6'].checkoutName;

  if (locale === 'en') {
    if (itemName === single) {
      return 'To set the day and time of the session, message me on WhatsApp. You also get a confirmation email.';
    }
    if (itemName === pack) {
      return 'To set the dates for the three sessions, message me on WhatsApp. You also get a confirmation email.';
    }
    if (itemName === mentor) {
      return 'To set the dates across the six weeks, message me on WhatsApp. You also get a confirmation email.';
    }
    return 'Message me on WhatsApp so we can set the dates. You also get a confirmation email.';
  }

  if (itemName === single) {
    return 'Pentru a stabili data și ora sesiunii, scrie-mi pe WhatsApp. Primești și un email de confirmare.';
  }
  if (itemName === pack) {
    return 'Ca să stabilim datele celor trei sesiuni, scrie-mi pe WhatsApp. Primești și un email de confirmare.';
  }
  if (itemName === mentor) {
    return 'Ca să stabilim datele celor șase săptămâni, scrie-mi pe WhatsApp. Primești și un email de confirmare.';
  }
  return 'Ca să stabilim datele, scrie-mi pe WhatsApp. Primești și un email de confirmare.';
}
