import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ATTRIBUTION_COOKIE,
  attributionFromCookieHeader,
  hasAttribution,
  parseAttributionValue,
  resolveRequestAttribution,
  sanitizeAttribution,
  toClientReferenceId,
} from './attribution';

describe('sanitizeAttribution', () => {
  it('keeps the four UTM fields and drops anything else', () => {
    const attr = sanitizeAttribution({
      utm_source: 'x',
      utm_medium: 'bio',
      utm_campaign: 'consult',
      utm_content: 'pin-v1',
      utm_term: 'ignored',
      ref: 'nope',
    });
    assert.deepEqual(attr, {
      utm_source: 'x',
      utm_medium: 'bio',
      utm_campaign: 'consult',
      utm_content: 'pin-v1',
    });
  });

  it('strips control characters and caps length', () => {
    const attr = sanitizeAttribution({
      utm_source: ' x\n ',
      utm_campaign: 'a'.repeat(200),
    });
    assert.equal(attr.utm_source, 'x');
    assert.equal(attr.utm_campaign?.length, 120);
  });
});

describe('parseAttributionValue', () => {
  it('reads a query string, including a leading question mark', () => {
    const attr = parseAttributionValue(
      '?utm_source=x&utm_medium=post&utm_campaign=consult_taxe&utm_content=20261019'
    );
    assert.equal(attr.utm_source, 'x');
    assert.equal(attr.utm_medium, 'post');
    assert.equal(attr.utm_content, '20261019');
  });
});

describe('attribution cookies', () => {
  it('reads the first-party cookie and ignores unrelated cookies', () => {
    const header = `NEXT_LOCALE=en; ${ATTRIBUTION_COOKIE}=${encodeURIComponent('utm_source=x&utm_medium=bio')}`;
    const attr = attributionFromCookieHeader(header);
    assert.equal(attr.utm_source, 'x');
    assert.equal(attr.utm_medium, 'bio');
  });

  it('prefers the request body and falls back to the cookie', () => {
    const fromBody = resolveRequestAttribution(
      { utm_source: 'stirilecrypto' },
      `${ATTRIBUTION_COOKIE}=${encodeURIComponent('utm_source=x')}`
    );
    assert.equal(fromBody.utm_source, 'stirilecrypto');

    const fromCookie = resolveRequestAttribution(
      {},
      `${ATTRIBUTION_COOKIE}=${encodeURIComponent('utm_source=x&utm_medium=bio')}`
    );
    assert.equal(fromCookie.utm_medium, 'bio');
    assert.equal(hasAttribution(resolveRequestAttribution(null, '')), false);
  });
});

describe('toClientReferenceId', () => {
  it('builds a compact id and stays within 200 characters', () => {
    const id = toClientReferenceId({
      utm_source: 'x',
      utm_medium: 'pinned',
      utm_campaign: 'consult',
      utm_content: 'pin-v1',
    });
    assert.equal(id, 'source:x|medium:pinned|campaign:consult|content:pin-v1');
    assert.ok(id && id.length <= 200);

    const longId = toClientReferenceId({
      utm_source: 'x',
      utm_content: 'c'.repeat(120),
    });
    assert.ok(longId && longId.length <= 200);
  });
});
