import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  CONSENT_MAX_AGE_SECONDS,
  buildConsentDefaultScript,
  consentCookieAssignment,
  consentModeState,
  googleAnalyticsSrc,
  hasAnalyticsConsent,
  parseConsent,
  readConsentFromCookieHeader,
  serializeConsent,
} from './consent';

const NOW = 1_779_000_000_000;

describe('consent storage', () => {
  it('round-trips a choice and rejects anything else', () => {
    const stored = { analytics: 'granted' as const, updatedAt: NOW };
    assert.deepEqual(parseConsent(serializeConsent(stored), NOW), stored);
    assert.equal(parseConsent('yes', NOW), null);
    assert.equal(parseConsent('1.maybe.1', NOW), null);
    assert.equal(hasAnalyticsConsent(stored), true);
    assert.equal(hasAnalyticsConsent({ analytics: 'denied', updatedAt: NOW }), false);
    assert.equal(hasAnalyticsConsent(null), false);
  });

  it('forgets a choice older than the cookie lifetime', () => {
    const updatedAt = NOW - (CONSENT_MAX_AGE_SECONDS + 5) * 1000;
    assert.equal(parseConsent(serializeConsent({ analytics: 'granted', updatedAt }), NOW), null);
  });

  it('stores the choice for 6 to 12 months with a first-party cookie', () => {
    const sixMonths = 60 * 60 * 24 * 182;
    const twelveMonths = 60 * 60 * 24 * 366;
    assert.ok(CONSENT_MAX_AGE_SECONDS >= sixMonths);
    assert.ok(CONSENT_MAX_AGE_SECONDS <= twelveMonths);

    const assignment = consentCookieAssignment(
      { analytics: 'denied', updatedAt: NOW },
      true
    );
    assert.match(assignment, /^md_consent=1\.denied\.\d+; /);
    assert.match(assignment, new RegExp(`Max-Age=${CONSENT_MAX_AGE_SECONDS}`));
    assert.match(assignment, /Path=\//);
    assert.match(assignment, /SameSite=Lax/);
    assert.match(assignment, /Secure/);
    assert.doesNotMatch(consentCookieAssignment({ analytics: 'granted', updatedAt: NOW }, false), /Secure/);
  });

  it('reads the consent cookie and ignores unrelated cookies', () => {
    const header = `NEXT_LOCALE=ro; md_consent=${serializeConsent({
      analytics: 'denied',
      updatedAt: NOW,
    })}`;
    assert.equal(readConsentFromCookieHeader(header, NOW)?.analytics, 'denied');
    assert.equal(readConsentFromCookieHeader('md_utm=utm_source%3Dx', NOW), null);
  });
});

describe('Consent Mode v2 defaults', () => {
  it('denies analytics and ad storage until accept', () => {
    const denied = consentModeState('denied');
    assert.equal(denied.analytics_storage, 'denied');
    assert.equal(denied.ad_storage, 'denied');
    assert.equal(denied.ad_user_data, 'denied');
    assert.equal(denied.ad_personalization, 'denied');
    assert.equal(denied.security_storage, 'granted');

    const granted = consentModeState('granted');
    assert.equal(granted.analytics_storage, 'granted');
    assert.equal(granted.ad_storage, 'denied');
    assert.equal(granted.ad_user_data, 'denied');
    assert.equal(granted.ad_personalization, 'denied');
  });

  it('does not load GA4 from the default consent snippet', () => {
    const script = buildConsentDefaultScript();
    assert.match(script, /gtag\('consent', 'default'/);
    assert.match(script, /"analytics_storage":"denied"/);
    assert.match(script, /"ad_user_data":"denied"/);
    assert.match(script, /"ad_personalization":"denied"/);
    assert.match(script, /"ad_storage":"denied"/);
    assert.doesNotMatch(script, /googletagmanager\.com/);
    assert.doesNotMatch(script, /gtag\('config'/);
    assert.doesNotMatch(script, /gtag\('event'/);
    assert.equal(
      googleAnalyticsSrc(),
      'https://www.googletagmanager.com/gtag/js?id=G-ZYYJ251HYH'
    );
  });

  it('does not embed the GA4 loader in the page layout', () => {
    const layout = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../app/[locale]/layout.tsx'),
      'utf8'
    );
    assert.doesNotMatch(layout, /googletagmanager\.com/);
    assert.match(layout, /buildConsentDefaultScript/);
    assert.match(layout, /GoogleAnalytics/);
  });

  it('mounts Vercel Web Analytics in the document layout', () => {
    const layout = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '../app/[locale]/layout.tsx'),
      'utf8'
    );
    assert.match(layout, /import \{ Analytics \} from '@vercel\/analytics\/next'/);
    assert.match(layout, /<Analytics \/>/);
  });
});
