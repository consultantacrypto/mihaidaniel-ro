import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isCheckoutSessionId, purchaseEventFromSession } from './purchase-event';

const paidConsultancy = {
  id: 'cs_test_abc123',
  payment_status: 'paid',
  amount_total: 20000,
  currency: 'eur',
  metadata: { type: 'consultancy' },
  customer_details: { email: 'ana@example.com' },
};

describe('purchaseEventFromSession', () => {
  it('reports 200 EUR for a paid consultancy session', () => {
    const event = purchaseEventFromSession(paidConsultancy);
    assert.deepEqual(event, {
      transactionId: 'cs_test_abc123',
      value: 200,
      currency: 'EUR',
      productType: 'consultancy',
      itemName: 'Consultanță Crypto VIP (1h)',
      customerEmail: 'ana@example.com',
    });
  });

  it('uses the amount Stripe collected when a coupon changes the total', () => {
    const event = purchaseEventFromSession({
      ...paidConsultancy,
      amount_total: 15000,
    });
    assert.equal(event?.value, 150);
  });

  it('does not report a visit to the success URL as a purchase', () => {
    assert.equal(
      purchaseEventFromSession({ ...paidConsultancy, payment_status: 'unpaid' }),
      null
    );
    assert.equal(
      purchaseEventFromSession({ ...paidConsultancy, id: 'not-a-session' }),
      null
    );
    assert.equal(purchaseEventFromSession({ ...paidConsultancy, metadata: { type: 'other' } }), null);
    assert.equal(isCheckoutSessionId('success=true'), false);
  });
});
