import { escapeHtml } from './html';
import {
  WHATSAPP_MESSAGES,
  whatsappHref,
  type PublicContactChannels,
} from './scheduling';

function greeting(customerName?: string | null): string {
  const name = customerName?.trim();
  return name ? `Bună, ${escapeHtml(name)},` : 'Bună,';
}

function whatsappAnchor(url: string, label: string): string {
  return `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;
}

function emailAnchor(email: string): string {
  return `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`;
}

export function buildConsultancyEmailHtml(
  channels: PublicContactChannels,
  customerName?: string | null
): string {
  const whatsapp = channels.whatsappUrl
    ? whatsappHref(channels.whatsappUrl, WHATSAPP_MESSAGES.consultancy.ro)
    : null;

  let contact = 'Pentru a fixa data și ora sesiunii noastre, te rog să răspunzi la acest email.';
  if (whatsapp && channels.whatsappDisplay && channels.email) {
    contact = `Pentru a fixa data și ora sesiunii noastre, te rog să îmi trimiți un mesaj pe WhatsApp la ${whatsappAnchor(whatsapp, channels.whatsappDisplay)} sau să răspunzi la acest email pe adresa ${emailAnchor(channels.email)}.`;
  } else if (whatsapp && channels.whatsappDisplay) {
    contact = `Pentru a fixa data și ora sesiunii noastre, te rog să îmi trimiți un mesaj pe WhatsApp la ${whatsappAnchor(whatsapp, channels.whatsappDisplay)}.`;
  } else if (channels.email) {
    contact = `Pentru a fixa data și ora sesiunii noastre, te rog să răspunzi la acest email pe adresa ${emailAnchor(channels.email)}.`;
  }

  const calendar = channels.bookingUrl
    ? `<p>Poți alege ora direct în calendar: <a href="${escapeHtml(channels.bookingUrl)}">Deschide calendarul</a>.</p>`
    : '';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <p>${greeting(customerName)}</p>
      <p>Îți mulțumim pentru achiziția sesiunii de <strong>Consultanță VIP Crypto</strong>.</p>
      <p>${contact}</p>
      ${calendar}
      <p>Cu respect,<br/><strong>Mihai Daniel</strong></p>
    </div>
  `;
}

export function buildCourseEmailHtml(
  channels: PublicContactChannels,
  customerName?: string | null
): string {
  const whatsapp = channels.whatsappUrl
    ? whatsappHref(channels.whatsappUrl, WHATSAPP_MESSAGES.course.ro)
    : null;

  const whatsappPart =
    whatsapp && channels.whatsappDisplay
      ? `pe WhatsApp la ${whatsappAnchor(whatsapp, channels.whatsappDisplay)}`
      : null;
  const emailPart = channels.email
    ? `răspunzând la acest email (${emailAnchor(channels.email)})`
    : null;
  const via = [whatsappPart, emailPart].filter(Boolean).join(' sau ');
  const contact = via
    ? `Cursul este găzduit privat pe YouTube. Pentru a-ți acorda accesul, te rog să îmi trimiți adresa ta de Gmail (asociată contului tău de YouTube) printr-un mesaj ${via}.`
    : 'Cursul este găzduit privat pe YouTube. Pentru a-ți acorda accesul, te rog să îmi trimiți adresa ta de Gmail (asociată contului tău de YouTube) răspunzând la acest email.';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <p>${greeting(customerName)}</p>
      <p>Îți mulțumim pentru achiziția <strong>Cursului Trading Crypto Premium</strong>.</p>
      <p>${contact}</p>
      <p>Cu respect,<br/><strong>Mihai Daniel</strong></p>
    </div>
  `;
}
