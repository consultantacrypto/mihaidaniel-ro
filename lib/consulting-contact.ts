import { isEmail, normalizeWhatsappNumber, whatsappHref } from './scheduling';

/** Prefilled text on the consulting-page WhatsApp button. */
export const CONSULTING_WHATSAPP_TEXT = 'Salut Dani, vreau o consultanță crypto';

export type ConsultingContactLinks = {
  emailHref: string | null;
  whatsappHref: string | null;
};

export type ConsultingContactEnv = {
  CONTACT_EMAIL?: string | null;
  WHATSAPP_NUMBER?: string | null;
};

/** Trim and accept only a plain email. Empty and invalid values stay hidden. */
export function normalizeContactEmail(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const email = raw.trim();
  if (!email || email.length > 200 || !isEmail(email)) return null;
  return email;
}

/**
 * Links for the consulting page. Nothing is invented when a var is missing.
 * The number keeps digits only: +, spaces and dashes are stripped.
 */
export function consultingContactLinks(env: ConsultingContactEnv = {}): ConsultingContactLinks {
  const email = normalizeContactEmail(env.CONTACT_EMAIL);
  const digits = normalizeWhatsappNumber(env.WHATSAPP_NUMBER);
  const whatsapp = digits
    ? whatsappHref(`https://wa.me/${digits}`, CONSULTING_WHATSAPP_TEXT)
    : null;

  return {
    emailHref: email ? `mailto:${email}` : null,
    whatsappHref: whatsapp,
  };
}

/** Last check before an anchor is rendered. Rejects "#", javascript:, and other schemes. */
export function visibleContactHref(
  kind: 'email' | 'whatsapp',
  href: string | null | undefined
): string | null {
  if (!href || href === '#' || href.startsWith('#')) return null;

  if (kind === 'email') {
    if (!href.toLowerCase().startsWith('mailto:')) return null;
    const address = decodeURIComponent(href.slice('mailto:'.length).split('?')[0] ?? '');
    return normalizeContactEmail(address) ? href : null;
  }

  try {
    const url = new URL(href);
    if (url.protocol !== 'https:' || url.hostname !== 'wa.me') return null;
    const digits = normalizeWhatsappNumber(url.pathname);
    if (!digits || `/${digits}` !== url.pathname) return null;
    return url.toString();
  } catch {
    return null;
  }
}
