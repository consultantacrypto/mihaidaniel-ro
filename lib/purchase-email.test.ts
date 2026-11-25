import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildConsultancyEmailHtml, buildCourseEmailHtml } from './purchase-email';
import { resolveContactChannels } from './scheduling';

describe('purchase emails', () => {
  it('includes WhatsApp and email and does not add a calendar link', () => {
    const html = buildConsultancyEmailHtml(resolveContactChannels({}), 'Ana');
    assert.match(html, /wa\.me\/40731490099/);
    assert.match(html, /contact@stirilecrypto\.ro/);
    assert.doesNotMatch(html, /calendar/);
    assert.doesNotMatch(html, /cal\.com/);
    assert.match(html, /Bună, Ana/);
  });

  it('escapes the buyer name', () => {
    const html = buildConsultancyEmailHtml(resolveContactChannels({}), '<script>');
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>/);
  });

  it('names the mentoring purchase and keeps the 1:1 email on the old sentence', () => {
    const single = buildConsultancyEmailHtml(resolveContactChannels({}), null, 'sesiune');
    assert.match(single, /Consultanță VIP Crypto/);
    assert.doesNotMatch(single, /Mentorat 6 săptămâni/);

    const mentoring = buildConsultancyEmailHtml(
      resolveContactChannels({}),
      null,
      'mentorat-6'
    );
    assert.match(mentoring, /Mentorat 6 săptămâni — Consultanță Crypto/);
    assert.match(mentoring, /Pentru a fixa datele/);
    assert.doesNotMatch(mentoring, /profit garantat/);
    assert.doesNotMatch(mentoring, /Deschide calendarul/);
  });

  it('does not put a consultancy calendar on the course email', () => {
    const html = buildCourseEmailHtml(resolveContactChannels({}), null);
    assert.match(html, /wa\.me\/40731490099/);
    assert.doesNotMatch(html, /Deschide calendarul/);
  });
});
