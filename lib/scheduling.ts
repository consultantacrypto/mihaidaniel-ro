export const DEFAULT_WHATSAPP_NUMBER = '40731490099';
export const DEFAULT_CONTACT_EMAIL = 'contact@stirilecrypto.ro';

export const WHATSAPP_MESSAGES = {
  consultancy: {
    ro: 'Bună, Mihai. Am plătit sesiunea de consultanță de 60 de minute și vreau să stabilim data și ora.',
    en: 'Hi Mihai. I paid for the 60-minute consulting session and I want to set a date and time.',
  },
  course: {
    ro: 'Bună, Mihai. Am plătit cursul și îți trimit adresa de Gmail pentru acces.',
    en: 'Hi Mihai. I paid for the course and I am sending my Gmail address for access.',
  },
} as const;

export type SchedulingLocale = 'ro' | 'en';

export type PublicContactChannels = {
  whatsappDisplay: string | null;
  whatsappUrl: string | null;
  email: string | null;
};

export type SchedulingEnv = {
  WHATSAPP_NUMBER?: string;
  CONTACT_EMAIL?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

/** Digits only, country code included, no leading zeros stripped. */
export function normalizeWhatsappNumber(raw: string | undefined | null): string | null {
  if (raw == null) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
}

export function parseWhatsappBase(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.hostname !== 'wa.me') return null;
    const number = normalizeWhatsappNumber(url.pathname);
    if (!number) return null;
    return `https://wa.me/${number}`;
  } catch {
    return null;
  }
}

export function whatsappHref(baseUrl: string, message: string): string | null {
  const base = parseWhatsappBase(baseUrl);
  if (!base) return null;
  const url = new URL(base);
  url.searchParams.set('text', message);
  return url.toString();
}

export function resolveContactChannels(env: SchedulingEnv): PublicContactChannels {
  const whatsappRaw = env.WHATSAPP_NUMBER?.trim()
    ? env.WHATSAPP_NUMBER
    : DEFAULT_WHATSAPP_NUMBER;
  const whatsappNumber = normalizeWhatsappNumber(whatsappRaw);

  const emailRaw = env.CONTACT_EMAIL?.trim()
    ? env.CONTACT_EMAIL.trim()
    : DEFAULT_CONTACT_EMAIL;
  const email = isEmail(emailRaw) ? emailRaw : null;

  return {
    whatsappDisplay: whatsappNumber ? `+${whatsappNumber}` : null,
    whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : null,
    email,
  };
}

export function defaultPublicChannels(): PublicContactChannels {
  return resolveContactChannels({});
}

export function inboxEmail(channels: PublicContactChannels): string {
  return channels.email ?? DEFAULT_CONTACT_EMAIL;
}

/** Drop any field that is not a safe https link. Never returns a javascript: URL. */
export function coercePublicContactChannels(value: unknown): PublicContactChannels | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;

  const whatsappUrl =
    candidate.whatsappUrl == null
      ? null
      : parseWhatsappBase(
          typeof candidate.whatsappUrl === 'string' ? candidate.whatsappUrl : null
        );
  const whatsappNumber = whatsappUrl
    ? normalizeWhatsappNumber(new URL(whatsappUrl).pathname)
    : null;

  const email =
    typeof candidate.email === 'string' && isEmail(candidate.email) ? candidate.email : null;

  return {
    whatsappDisplay: whatsappNumber ? `+${whatsappNumber}` : null,
    whatsappUrl,
    email,
  };
}
