import { resolveContactChannels, type PublicContactChannels } from './scheduling';

/**
 * Server-only read of contact env vars.
 * Missing WhatsApp or email falls back to the public defaults used after payment.
 * The consulting page buttons do not use this fallback: see consultingContactLinks.
 */
export function getContactChannels(): PublicContactChannels {
  const whatsappRaw = process.env.WHATSAPP_NUMBER;
  const emailRaw = process.env.CONTACT_EMAIL;

  const channels = resolveContactChannels({
    WHATSAPP_NUMBER: whatsappRaw,
    CONTACT_EMAIL: emailRaw,
  });

  if (whatsappRaw?.trim() && !channels.whatsappUrl) {
    console.error(
      '[scheduling] WHATSAPP_NUMBER is set but is not a valid phone number. WhatsApp link hidden.'
    );
  }
  if (emailRaw?.trim() && !channels.email) {
    console.error(
      '[scheduling] CONTACT_EMAIL is set but is not a valid email. Email link hidden.'
    );
  }

  return channels;
}
