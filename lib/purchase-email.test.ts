import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildConsultancyEmailHtml, buildCourseEmailHtml } from './purchase-email';
import { resolveContactChannels } from './scheduling';

describe('purchase emails', () => {
  it('includes WhatsApp and email, and hides the calendar until a booking URL exists', () => {
    const html = buildConsultancyEmailHtml(resolveContactChannels({}), 'Ana');
    assert.match(html, /wa\.me\/40731490099/);
    assert.match(html, /consultantacrypto\.ro@gmail\.com/);
    assert.doesNotMatch(html, /Deschide calendarul/);
    assert.match(html, /Bună, Ana/);
  });

  it('adds the calendar link when BOOKING_URL is set and escapes the name', () => {
    const html = buildConsultancyEmailHtml(
      resolveContactChannels({ BOOKING_URL: 'https://cal.com/mihai/consultanta' }),
      '<script>'
    );
    assert.match(html, /https:\/\/cal\.com\/mihai\/consultanta/);
    assert.match(html, /Deschide calendarul/);
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>/);
  });

  it('does not put a consultancy calendar on the course email', () => {
    const html = buildCourseEmailHtml(
      resolveContactChannels({ BOOKING_URL: 'https://cal.com/mihai/consultanta' }),
      null
    );
    assert.match(html, /wa\.me\/40731490099/);
    assert.doesNotMatch(html, /Deschide calendarul/);
  });
});
