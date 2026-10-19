import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_WHATSAPP_NUMBER,
  coercePublicContactChannels,
  parseBookingUrl,
  resolveContactChannels,
  whatsappHref,
  withBookingPrefill,
} from './scheduling';

describe('resolveContactChannels', () => {
  it('falls back to the public WhatsApp number and email when env is missing', () => {
    const channels = resolveContactChannels({});
    assert.equal(channels.whatsappUrl, `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`);
    assert.equal(channels.whatsappDisplay, `+${DEFAULT_WHATSAPP_NUMBER}`);
    assert.equal(channels.email, DEFAULT_CONTACT_EMAIL);
    assert.equal(channels.bookingUrl, null);
    assert.equal(channels.bookingEmbedUrl, null);
  });

  it('hides an invalid booking URL and an invalid phone instead of building a broken link', () => {
    const channels = resolveContactChannels({
      BOOKING_URL: 'javascript:alert(1)',
      WHATSAPP_NUMBER: 'abc',
      CONTACT_EMAIL: 'not-an-email',
    });
    assert.equal(channels.bookingUrl, null);
    assert.equal(channels.bookingEmbedUrl, null);
    assert.equal(channels.whatsappUrl, null);
    assert.equal(channels.email, null);
  });

  it('accepts a Cal.com https URL and marks it embeddable', () => {
    const channels = resolveContactChannels({
      BOOKING_URL: 'https://cal.com/mihai/consultanta',
      WHATSAPP_NUMBER: '+40 731 490 099',
    });
    assert.equal(channels.bookingUrl, 'https://cal.com/mihai/consultanta');
    assert.equal(channels.bookingEmbedUrl, 'https://cal.com/mihai/consultanta');
    assert.equal(channels.whatsappUrl, 'https://wa.me/40731490099');
  });

  it('shows a button URL for other https schedulers but does not embed them', () => {
    const channels = resolveContactChannels({
      BOOKING_URL: 'https://calendar.example.com/mihai',
    });
    assert.equal(channels.bookingUrl, 'https://calendar.example.com/mihai');
    assert.equal(channels.bookingEmbedUrl, null);
  });

  it('rejects http and credentialed booking URLs', () => {
    assert.equal(parseBookingUrl('http://cal.com/mihai'), null);
    assert.equal(parseBookingUrl('https://user:pass@cal.com/mihai'), null);
  });
});

describe('whatsappHref', () => {
  it('builds a wa.me link with a prefilled message', () => {
    const href = whatsappHref('https://wa.me/40731490099', 'Bună, Mihai.');
    assert.ok(href);
    const url = new URL(href!);
    assert.equal(url.hostname, 'wa.me');
    assert.equal(url.searchParams.get('text'), 'Bună, Mihai.');
  });

  it('returns null for a non-WhatsApp URL', () => {
    assert.equal(whatsappHref('https://example.com', 'Bună'), null);
  });
});

describe('coercePublicContactChannels', () => {
  it('drops javascript booking URLs', () => {
    const channels = coercePublicContactChannels({
      whatsappUrl: 'https://wa.me/40731490099',
      email: DEFAULT_CONTACT_EMAIL,
      bookingUrl: 'javascript:alert(1)',
      bookingEmbedUrl: 'https://evil.example/embed',
    });
    assert.ok(channels);
    assert.equal(channels!.bookingUrl, null);
    assert.equal(channels!.bookingEmbedUrl, null);
    assert.equal(channels!.whatsappUrl, 'https://wa.me/40731490099');
  });
});

describe('withBookingPrefill', () => {
  it('adds the buyer email without dropping an existing query', () => {
    const href = withBookingPrefill('https://cal.com/mihai/consultanta?utm=1', 'a@b.ro');
    const url = new URL(href);
    assert.equal(url.searchParams.get('utm'), '1');
    assert.equal(url.searchParams.get('email'), 'a@b.ro');
  });
});
