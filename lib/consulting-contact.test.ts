import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  CONSULTING_WHATSAPP_TEXT,
  consultingContactLinks,
  visibleContactHref,
} from './consulting-contact';
import { DEFAULT_CONTACT_EMAIL, DEFAULT_WHATSAPP_NUMBER } from './scheduling';

describe('consultingContactLinks', () => {
  it('builds both links when the email and the number are set', () => {
    const links = consultingContactLinks({
      CONTACT_EMAIL: '  Dani@Example.com ',
      WHATSAPP_NUMBER: '+40 731-490-099',
    });

    assert.equal(links.emailHref, 'mailto:Dani@Example.com');
    assert.ok(links.whatsappHref);
    const whatsapp = new URL(links.whatsappHref!);
    assert.equal(whatsapp.protocol, 'https:');
    assert.equal(whatsapp.hostname, 'wa.me');
    assert.equal(whatsapp.pathname, '/40731490099');
    assert.equal(whatsapp.searchParams.get('text'), CONSULTING_WHATSAPP_TEXT);
    assert.equal(whatsapp.pathname, '/40731490099');
    assert.equal(whatsapp.pathname.includes('+'), false);
    assert.equal(whatsapp.pathname.includes('-'), false);
  });

  it('shows only the email button when the number is missing', () => {
    const links = consultingContactLinks({ CONTACT_EMAIL: 'contact@stirilecrypto.ro' });
    assert.equal(links.emailHref, 'mailto:contact@stirilecrypto.ro');
    assert.equal(links.whatsappHref, null);
  });

  it('shows only the WhatsApp button when the email is missing', () => {
    const links = consultingContactLinks({ WHATSAPP_NUMBER: '40731490099' });
    assert.equal(links.emailHref, null);
    assert.ok(links.whatsappHref?.startsWith('https://wa.me/40731490099'));
  });

  it('renders neither link when nothing is set', () => {
    for (const env of [{}, { CONTACT_EMAIL: '', WHATSAPP_NUMBER: '   ' }, { CONTACT_EMAIL: null, WHATSAPP_NUMBER: null }]) {
      const links = consultingContactLinks(env);
      assert.equal(links.emailHref, null);
      assert.equal(links.whatsappHref, null);
    }
    const empty = consultingContactLinks();
    assert.equal(empty.emailHref?.includes(DEFAULT_CONTACT_EMAIL) ?? false, false);
    assert.equal(empty.whatsappHref?.includes(DEFAULT_WHATSAPP_NUMBER) ?? false, false);
  });

  it('hides invalid emails and numbers instead of building a dead link', () => {
    const links = consultingContactLinks({
      CONTACT_EMAIL: 'not-an-email',
      WHATSAPP_NUMBER: 'abc',
    });
    assert.equal(links.emailHref, null);
    assert.equal(links.whatsappHref, null);

    assert.equal(consultingContactLinks({ CONTACT_EMAIL: 'javascript:alert(1)' }).emailHref, null);
    assert.equal(consultingContactLinks({ CONTACT_EMAIL: 'a@b' }).emailHref, null);
    assert.equal(consultingContactLinks({ WHATSAPP_NUMBER: '+40' }).whatsappHref, null);
    assert.equal(consultingContactLinks({ WHATSAPP_NUMBER: '123' }).whatsappHref, null);
    assert.equal(consultingContactLinks({ WHATSAPP_NUMBER: '---' }).whatsappHref, null);
    assert.equal(consultingContactLinks({ WHATSAPP_NUMBER: '1234567890123456' }).whatsappHref, null);
    assert.equal(visibleContactHref('email', '#'), null);
    assert.equal(visibleContactHref('whatsapp', 'javascript:alert(1)'), null);
    assert.equal(visibleContactHref('email', 'mailto:not-an-email'), null);
  });
});
