import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { buildCheckoutSessionCreateParams } from './checkout-session';
import { resolveCheckoutSelection } from './consultancy-checkout';
import {
  CONSULTANCY_PACKAGE_ORDER,
  CONSULTANCY_PACKAGES,
  consultancyFollowupMessage,
  consultancySuccessMessage,
  formatEurAmount,
  formatEurPrice,
  threeSessionCompare,
} from './consultancy-packages';
import { buildConsultancyServiceSchema } from './seo/schemas/service';
import { getConsultancyFaq } from './seo/schemas/faq';
import { WHATSAPP_MESSAGES } from './scheduling';
import { CHECKOUT_PRODUCTS, buildCheckoutLineItem } from './stripe';

const EMPTY_ENV = {
  STRIPE_PRICE_ID_CONSULTANCY: '',
  STRIPE_PRICE_ID_COURSE: '',
};

describe('consultancy package config', () => {
  it('prices the three offers in euro cents and keeps the 1:1 name', () => {
    assert.deepEqual(CONSULTANCY_PACKAGE_ORDER, ['sesiune', 'pachet-3', 'mentorat-6']);
    assert.equal(CONSULTANCY_PACKAGES.sesiune.unitAmount, 20000);
    assert.equal(CONSULTANCY_PACKAGES['pachet-3'].unitAmount, 54000);
    assert.equal(CONSULTANCY_PACKAGES['mentorat-6'].unitAmount, 150000);
    for (const id of CONSULTANCY_PACKAGE_ORDER) {
      assert.equal(CONSULTANCY_PACKAGES[id].currency, 'eur');
      assert.equal(Number.isInteger(CONSULTANCY_PACKAGES[id].unitAmount), true);
    }
    assert.equal(
      CONSULTANCY_PACKAGES.sesiune.unitAmount,
      CHECKOUT_PRODUCTS.consultancy.unitAmount
    );
    assert.equal(
      CONSULTANCY_PACKAGES.sesiune.checkoutName,
      CHECKOUT_PRODUCTS.consultancy.name
    );
    assert.equal(CONSULTANCY_PACKAGES.sesiune.useCatalogPrice, true);
    assert.equal(CONSULTANCY_PACKAGES['pachet-3'].useCatalogPrice, false);
    assert.equal(CONSULTANCY_PACKAGES['mentorat-6'].useCatalogPrice, false);
  });

  it('prices the 3-session pack at 10% under 3 × 200 €', () => {
    const compare = threeSessionCompare();
    assert.equal(compare.fullCents, 60000);
    assert.equal(compare.payCents, 54000);
    assert.equal(compare.percentOff, 10);
    assert.equal(compare.payCents, compare.fullCents - compare.fullCents / 10);
  });

  it('formats euro the way the page shows them', () => {
    assert.equal(formatEurAmount(20000), '200');
    assert.equal(formatEurAmount(54000), '540');
    assert.equal(formatEurAmount(150000), '1.500');
    assert.equal(formatEurAmount(150000, 'en'), '1,500');
    assert.equal(formatEurPrice(20000), '200 €');
    assert.equal(formatEurPrice(150000, 'en'), '€1,500');
  });
});

describe('resolveCheckoutSelection', () => {
  it('keeps a consultancy request without a package on the existing 200 € line', () => {
    const legacy = buildCheckoutLineItem('consultancy', EMPTY_ENV);
    const selected = resolveCheckoutSelection({ type: 'consultancy' }, EMPTY_ENV);
    assert.equal(selected.ok, true);
    if (!selected.ok) return;
    assert.equal(selected.packageId, null);
    assert.equal(selected.type, 'consultancy');
    assert.deepEqual(selected.lineItem, legacy);
    assert.equal(selected.lineItem.price_data?.unit_amount, 20000);
    assert.equal(selected.lineItem.price_data?.currency, 'eur');
    assert.equal(
      selected.lineItem.price_data?.product_data?.name,
      'Consultanță Crypto VIP (1h)'
    );
  });

  it('keeps the catalog price id for the 1:1 session only', () => {
    const env = { STRIPE_PRICE_ID_CONSULTANCY: 'price_consultancy_live' };
    const selected = resolveCheckoutSelection(
      { type: 'consultancy', packageId: 'sesiune', amount: 100 },
      env
    );
    assert.equal(selected.ok, true);
    if (!selected.ok) return;
    assert.deepEqual(selected.lineItem, {
      quantity: 1,
      price: 'price_consultancy_live',
    });
    assert.equal('price_data' in selected.lineItem, false);
  });

  it('ignores a client amount and never reuses the 1:1 price id for the other packages', () => {
    const env = { STRIPE_PRICE_ID_CONSULTANCY: 'price_consultancy_live' };
    const selected = resolveCheckoutSelection(
      {
        type: 'consultancy',
        packageId: 'pachet-3',
        amount: 123,
        unit_amount: 123,
        unitAmount: 123,
        price: 'price_attacker',
        currency: 'usd',
        quantity: 99,
      },
      env
    );
    assert.equal(selected.ok, true);
    if (!selected.ok) return;
    assert.equal(selected.packageId, 'pachet-3');
    assert.equal(selected.lineItem.quantity, 1);
    assert.equal(selected.lineItem.price, undefined);
    assert.equal(selected.lineItem.price_data?.currency, 'eur');
    assert.equal(selected.lineItem.price_data?.unit_amount, 54000);
    assert.equal(
      selected.lineItem.price_data?.product_data?.name,
      'Pachet 3 sesiuni — Consultanță Crypto'
    );
    const serialized = JSON.stringify(selected.lineItem);
    assert.equal(serialized.includes('123'), false);
    assert.equal(serialized.includes('price_attacker'), false);
    assert.equal(serialized.includes('usd'), false);
    assert.equal(serialized.includes('price_consultancy_live'), false);
  });

  it('builds the mentoring checkout from the server config', () => {
    const selected = resolveCheckoutSelection(
      { packageId: 'mentorat-6', amount: 1 },
      EMPTY_ENV
    );
    assert.equal(selected.ok, true);
    if (!selected.ok) return;
    assert.equal(selected.type, 'consultancy');
    assert.equal(selected.lineItem.price_data?.unit_amount, 150000);
    assert.equal(selected.lineItem.price_data?.currency, 'eur');
    assert.equal(
      selected.lineItem.price_data?.product_data?.name,
      'Mentorat 6 săptămâni — Consultanță Crypto'
    );
  });

  it('trims a known package id and still ignores the client amount', () => {
    const selected = resolveCheckoutSelection(
      { type: 'consultancy', packageId: '  pachet-3  ', amount: 1 },
      EMPTY_ENV
    );
    assert.equal(selected.ok, true);
    if (!selected.ok) return;
    assert.equal(selected.packageId, 'pachet-3');
    assert.equal(selected.lineItem.price_data?.unit_amount, 54000);
  });

  it('rejects an unknown package id with 400', () => {
    for (const packageId of ['gratis', 'SESIUNE', 'pachet-4', 20000, { id: 'pachet-3' }, true]) {
      const selected = resolveCheckoutSelection(
        { type: 'consultancy', packageId },
        EMPTY_ENV
      );
      assert.equal(selected.ok, false);
      if (selected.ok) return;
      assert.equal(selected.status, 400);
      assert.equal(selected.error, 'Pachet invalid.');
    }
  });

  it('rejects a package id on the course checkout', () => {
    const selected = resolveCheckoutSelection(
      { type: 'course', packageId: 'pachet-3' },
      EMPTY_ENV
    );
    assert.equal(selected.ok, false);
    if (selected.ok) return;
    assert.equal(selected.status, 400);
  });

  it('keeps the course line item on the existing path', () => {
    const env = { STRIPE_PRICE_ID_COURSE: 'price_course' };
    const selected = resolveCheckoutSelection({ type: 'course', amount: 1 }, env);
    assert.equal(selected.ok, true);
    if (!selected.ok) return;
    assert.deepEqual(selected.lineItem, buildCheckoutLineItem('course', env));
    assert.equal(selected.packageId, null);
  });

  it('rejects a body that is not a checkout', () => {
    for (const body of [null, [], 'consultancy', { type: 'webinar' }]) {
      const selected = resolveCheckoutSelection(body, EMPTY_ENV);
      assert.equal(selected.ok, false);
      if (selected.ok) return;
      assert.equal(selected.status, 400);
    }
  });
});

describe('checkout session metadata', () => {
  it('records the package id and does not put a client amount on the session', () => {
    const lineItem = {
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: 54000,
        product_data: { name: 'Pachet 3 sesiuni — Consultanță Crypto' },
      },
    };
    const params = buildCheckoutSessionCreateParams({
      type: 'consultancy',
      baseUrl: 'https://www.mihaidaniel.ro',
      lineItem,
      packageId: 'pachet-3',
    });
    assert.equal(params.line_items?.[0], lineItem);
    assert.equal(params.metadata.package_id, 'pachet-3');
    assert.equal(params.metadata.type, 'consultancy');
    assert.equal(params.success_url.includes('type=consultancy'), true);
    assert.equal(JSON.stringify(params).includes('123'), false);
  });
});

describe('consultancy offers in structured data and copy', () => {
  it('lists three EUR offers and no rating', () => {
    const schema = buildConsultancyServiceSchema(
      'https://www.mihaidaniel.ro/consultanta-crypto',
      'ro'
    );
    assert.deepEqual(
      schema.offers.map((offer) => [offer.name, offer.price, offer.priceCurrency]),
      [
        ['Sesiune 1:1', '200', 'EUR'],
        ['Pachet 3 sesiuni', '540', 'EUR'],
        ['Mentorat 6 săptămâni', '1500', 'EUR'],
      ]
    );
    const serialized = JSON.stringify(schema);
    assert.equal(serialized.includes('aggregateRating'), false);
    assert.equal(serialized.includes('ratingValue'), false);
    assert.equal(serialized.includes('review'), false);

    const english = buildConsultancyServiceSchema(
      'https://www.mihaidaniel.ro/en/consultanta-crypto',
      'en'
    );
    assert.equal(english.offers[2].name, '6-week mentoring');
    assert.equal(english.offers[2].priceCurrency, 'EUR');
    assert.equal(schema.serviceType, 'Educational Consulting');
    assert.equal(english.serviceType, 'Educational Consulting');
  });

  it('says Dani works with beginners and traders, and that this is not financial advice', () => {
    const ro = JSON.parse(
      readFileSync(new URL('../messages/ro.json', import.meta.url), 'utf8')
    ) as {
      consultancyPage: {
        levels: { title: string; beginnerTitle: string; traderTitle: string; beginnerBody: string };
        packages: { disclaimer: string };
      };
    };
    assert.equal(
      ro.consultancyPage.levels.title,
      'Lucrez cu plăcere cu oricine, de la începători la traderi.'
    );
    assert.equal(ro.consultancyPage.levels.beginnerTitle, 'Să nu pierzi bani');
    assert.match(ro.consultancyPage.levels.beginnerBody, /Securitate, exchange, primii pași/);
    assert.match(ro.consultancyPage.levels.traderTitle, /Plan de trading și management al riscului/);
    assert.match(ro.consultancyPage.packages.disclaimer, /Nu este sfat financiar/);

    const faq = getConsultancyFaq('ro').map((item) => item.answer).join(' ');
    assert.match(faq, /200 €/);
    assert.match(faq, /540 €/);
    assert.match(faq, /1\.500 €/);
    assert.match(faq, /Nu este o recomandare de investiții/);
    assert.doesNotMatch(faq, /Nu este un curs pentru începători/);
  });

  it('redirects /consultanta to /consultanta-crypto permanently', () => {
    const source = readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8');
    assert.match(
      source,
      /source: '\/consultanta',\s*destination: '\/consultanta-crypto',\s*permanent: true/
    );
  });
});

describe('follow-up copy', () => {
  it('keeps the 60-minute WhatsApp text for the 1:1 purchase', () => {
    assert.equal(
      consultancyFollowupMessage('ro', null),
      WHATSAPP_MESSAGES.consultancy.ro
    );
    assert.equal(
      consultancyFollowupMessage('ro', CONSULTANCY_PACKAGES.sesiune.checkoutName),
      WHATSAPP_MESSAGES.consultancy.ro
    );
  });

  it('names the hour only for the 1:1 purchase and otherwise says to set the dates', () => {
    const single = CONSULTANCY_PACKAGES.sesiune.checkoutName;
    assert.match(consultancySuccessMessage('ro', single), /data și ora sesiunii/);
    assert.match(
      consultancySuccessMessage('ro', CONSULTANCY_PACKAGES['pachet-3'].checkoutName),
      /să stabilim datele/
    );
    assert.match(
      consultancySuccessMessage('ro', CONSULTANCY_PACKAGES['mentorat-6'].checkoutName),
      /să stabilim datele/
    );
    assert.match(consultancySuccessMessage('ro', null), /să stabilim datele/);
    assert.doesNotMatch(consultancySuccessMessage('ro', null), /data și ora sesiunii/);
    assert.match(consultancySuccessMessage('en', null), /set the dates/);
  });

  it('does not call a 6-week purchase a single hour', () => {
    const message = consultancyFollowupMessage(
      'ro',
      CONSULTANCY_PACKAGES['mentorat-6'].checkoutName
    );
    assert.match(message, /Am plătit consultanța/);
    assert.doesNotMatch(message, /60 de minute/);
  });
});
