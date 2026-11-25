import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_WHATSAPP_NUMBER,
  coercePublicContactChannels,
  resolveContactChannels,
  whatsappHref,
} from './scheduling';

describe('resolveContactChannels', () => {
  it('falls back to the public WhatsApp number and email when env is missing', () => {
    const channels = resolveContactChannels({});
    assert.equal(channels.whatsappUrl, `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`);
    assert.equal(channels.whatsappDisplay, `+${DEFAULT_WHATSAPP_NUMBER}`);
    assert.equal(channels.email, DEFAULT_CONTACT_EMAIL);
  });

  it('hides an invalid phone and an invalid email instead of building a broken link', () => {
    const channels = resolveContactChannels({
      WHATSAPP_NUMBER: 'abc',
      CONTACT_EMAIL: 'not-an-email',
    });
    assert.equal(channels.whatsappUrl, null);
    assert.equal(channels.email, null);
  });

  it('keeps digits only in the WhatsApp link', () => {
    const channels = resolveContactChannels({
      WHATSAPP_NUMBER: '+40 731-490-099',
    });
    assert.equal(channels.whatsappUrl, 'https://wa.me/40731490099');
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
  it('drops a javascript WhatsApp URL', () => {
    const channels = coercePublicContactChannels({
      whatsappUrl: 'javascript:alert(1)',
      email: DEFAULT_CONTACT_EMAIL,
    });
    assert.ok(channels);
    assert.equal(channels!.whatsappUrl, null);
    assert.equal(channels!.email, DEFAULT_CONTACT_EMAIL);
  });
});
