import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { markGoogleAnalyticsReady, trackBuyConsultancy, trackPurchaseOnce } from './analytics';
import { writeStoredConsent } from './consent';
import { installTestBrowser, type TestBrowser } from './test-dom';

const purchase = {
  transactionId: 'cs_test_consent1',
  value: 200,
  currency: 'EUR',
  productType: 'consultancy',
  itemName: 'Consultanță Crypto VIP (1h)',
};

function eventCalls(browser: TestBrowser, name?: string): unknown[][] {
  return browser.calls.filter((call) => {
    if (call[0] !== 'event') return false;
    return name ? call[1] === name : true;
  });
}

describe('analytics consent gate', () => {
  let browser: TestBrowser;

  afterEach(() => {
    browser.restore();
  });

  it('does not call gtag for clicks before accept', () => {
    browser = installTestBrowser();
    trackBuyConsultancy('hero_consultanta_page');
    assert.equal(eventCalls(browser).length, 0);
    assert.equal(browser.calls.some((call) => String(call).includes('click_buy')), false);
  });

  it('does not fire purchase on Refuz, even if GA4 would be marked ready', () => {
    browser = installTestBrowser();
    trackPurchaseOnce({ ...purchase, transactionId: 'cs_test_refuz' });
    writeStoredConsent('denied', 1_779_000_000_000);
    markGoogleAnalyticsReady();
    assert.equal(eventCalls(browser, 'purchase').length, 0);
    assert.equal(browser.storage.has('md_purchase_cs_test_refuz'), false);
  });

  it('fires purchase only after Accept and after the GA4 library is ready', () => {
    browser = installTestBrowser();
    trackPurchaseOnce({ ...purchase, transactionId: 'cs_test_wait' });
    writeStoredConsent('granted', 1_779_000_000_000);
    assert.equal(eventCalls(browser, 'purchase').length, 0);
    assert.equal(browser.storage.has('md_purchase_cs_test_wait'), false);

    markGoogleAnalyticsReady();
    const purchases = eventCalls(browser, 'purchase');
    assert.equal(purchases.length, 1);
    assert.equal((purchases[0][2] as { transaction_id: string }).transaction_id, 'cs_test_wait');
    assert.equal(browser.storage.get('md_purchase_cs_test_wait'), '1');
  });

  it('sends a click only after Accept and after GA4 is ready', () => {
    browser = installTestBrowser();
    writeStoredConsent('granted', 1_779_000_000_000);
    trackBuyConsultancy('footer_consultanta_page');
    assert.equal(eventCalls(browser, 'click_buy_consultancy').length, 0);
    markGoogleAnalyticsReady();
    assert.equal(eventCalls(browser, 'click_buy_consultancy').length, 1);
  });

  it('sends purchase once consent and GA4 are already in place', () => {
    browser = installTestBrowser();
    writeStoredConsent('granted', 1_779_000_000_000);
    markGoogleAnalyticsReady();
    trackPurchaseOnce({ ...purchase, transactionId: 'cs_test_ready' });
    trackPurchaseOnce({ ...purchase, transactionId: 'cs_test_ready' });
    assert.equal(eventCalls(browser, 'purchase').length, 1);
  });

  it('drops a queued purchase if consent is withdrawn before GA4 loads', () => {
    browser = installTestBrowser();
    writeStoredConsent('granted', 1_779_000_000_000);
    trackPurchaseOnce({ ...purchase, transactionId: 'cs_test_revoke' });
    writeStoredConsent('denied', 1_779_000_000_001);
    markGoogleAnalyticsReady();
    assert.equal(eventCalls(browser, 'purchase').length, 0);
    assert.equal(browser.storage.has('md_purchase_cs_test_revoke'), false);
  });
});
