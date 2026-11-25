import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildCheckoutSessionCreateParams,
  checkoutAllowsPromotionCodes,
} from './checkout-session';

const BASE = 'https://www.mihaidaniel.ro';
const lineItem = { quantity: 1, price: 'price_consultancy' };

describe('buildCheckoutSessionCreateParams', () => {
  it('keeps the existing consultancy checkout and only adds the session id', () => {
    const params = buildCheckoutSessionCreateParams({
      type: 'consultancy',
      baseUrl: BASE,
      lineItem,
    });

    assert.equal(params.mode, 'payment');
    assert.equal(params.allow_promotion_codes, true);
    assert.equal(params.line_items?.[0], lineItem);
    assert.equal(
      params.cancel_url,
      `${BASE}/consultanta-crypto?canceled=true`
    );
    assert.equal(
      params.success_url,
      `${BASE}/consultanta-crypto?success=true&type=consultancy&session_id={CHECKOUT_SESSION_ID}`
    );
    assert.deepEqual(params.metadata, { type: 'consultancy' });
    assert.equal(params.client_reference_id, undefined);
    assert.deepEqual(Object.keys(params).sort(), [
      'allow_promotion_codes',
      'cancel_url',
      'line_items',
      'metadata',
      'mode',
      'success_url',
    ]);
  });

  it('keeps the course success and cancel paths', () => {
    const params = buildCheckoutSessionCreateParams({
      type: 'course',
      baseUrl: BASE,
      lineItem: { quantity: 1, price: 'price_course' },
    });
    assert.equal(
      params.success_url,
      `${BASE}/?success=true&type=course&session_id={CHECKOUT_SESSION_ID}`
    );
    assert.equal(params.cancel_url, `${BASE}/?canceled=true`);
    assert.deepEqual(params.metadata, { type: 'course' });
  });

  it('allows a promo code on the 200 € session and not on the other packages', () => {
    assert.equal(checkoutAllowsPromotionCodes('consultancy', null), true);
    assert.equal(checkoutAllowsPromotionCodes('consultancy', 'sesiune'), true);
    assert.equal(checkoutAllowsPromotionCodes('course', null), true);

    const pack = buildCheckoutSessionCreateParams({
      type: 'consultancy',
      baseUrl: BASE,
      lineItem,
      packageId: 'pachet-3',
    });
    const mentoring = buildCheckoutSessionCreateParams({
      type: 'consultancy',
      baseUrl: BASE,
      lineItem,
      packageId: 'mentorat-6',
    });
    assert.equal(pack.allow_promotion_codes, false);
    assert.equal(mentoring.allow_promotion_codes, false);
  });

  it('adds a package id without changing the success URL or the line item', () => {
    const params = buildCheckoutSessionCreateParams({
      type: 'consultancy',
      baseUrl: BASE,
      lineItem,
      packageId: 'sesiune',
    });
    assert.equal(params.line_items?.[0], lineItem);
    assert.equal(params.metadata.package_id, 'sesiune');
    assert.equal(
      params.success_url,
      `${BASE}/consultanta-crypto?success=true&type=consultancy&session_id={CHECKOUT_SESSION_ID}`
    );
  });

  it('adds UTM metadata and a client reference without touching the price', () => {
    const params = buildCheckoutSessionCreateParams({
      type: 'consultancy',
      baseUrl: BASE,
      lineItem,
      attribution: {
        utm_source: 'x',
        utm_medium: 'bio',
        utm_campaign: 'consult',
        utm_content: 'pin-v1',
      },
    });

    assert.deepEqual(params.metadata, {
      type: 'consultancy',
      utm_source: 'x',
      utm_medium: 'bio',
      utm_campaign: 'consult',
      utm_content: 'pin-v1',
    });
    assert.equal(
      params.client_reference_id,
      'source:x|medium:bio|campaign:consult|content:pin-v1'
    );
    assert.equal(params.line_items?.[0], lineItem);
    assert.equal(params.mode, 'payment');
  });
});
