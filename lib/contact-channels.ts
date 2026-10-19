import { resolveContactChannels, type PublicContactChannels } from './scheduling';

/**
 * Server-only read of scheduling env vars.
 * Missing WhatsApp or email falls back to the public defaults.
 * A missing or invalid booking URL hides the calendar.
 */
export function getContactChannels(): PublicContactChannels {
  const bookingRaw = process.env.BOOKING_URL;
  const whatsappRaw = process.env.WHATSAPP_NUMBER;
  const emailRaw = process.env.CONTACT_EMAIL;

  const channels = resolveContactChannels({
    BOOKING_URL: bookingRaw,
    WHATSAPP_NUMBER: whatsappRaw,
    CONTACT_EMAIL: emailRaw,
  });

  if (bookingRaw?.trim() && !channels.bookingUrl) {
    console.error(
      '[scheduling] BOOKING_URL is set but is not a valid https URL. Calendar hidden.'
    );
  }
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
