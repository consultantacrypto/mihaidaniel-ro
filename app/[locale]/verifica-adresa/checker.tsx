'use client';

import { FormEvent, useState } from 'react';
import { ExternalLink, Info, Loader2, ShieldAlert } from 'lucide-react';
import type { CheckSuccess } from '@/lib/verifica-adresa/check';
import type { PublicCheckerConfig } from '@/lib/verifica-adresa/config';
import {
  CHAINABUSE_LABEL,
  DISCLAIMER,
  EMBED_ATTRIBUTION,
  FULL_REPORT_BODY,
  FULL_REPORT_PACKS_NOTE,
  FULL_REPORT_PAYMENT_ON,
  FULL_REPORT_PRICE_NOTE,
  FULL_REPORT_TITLE,
  INPUT_HINT,
  INPUT_LABEL,
  INPUT_PLACEHOLDER,
  LEGAL_TITLE,
  OFAC_LICENSE_NOTE,
  OPERATOR_NOTE,
  PAGE_LEAD,
  PAGE_LEAD_NOTE,
  PAGE_TITLE,
  PAY_BUTTON,
  PAYMENT_CANCELLED,
  PAYMENT_SUCCESS,
  priceOrientation,
  PRIVACY_NOTE,
  RESULT_CHECKED,
  RESULT_LISTS,
  RESULT_MATCHED,
  RESULT_NETWORK,
  SAFETY_TIPS,
  SAFETY_TITLE,
  SUBMIT_LABEL,
  SUBMIT_PENDING,
  WAITLIST_BUTTON,
  WAITLIST_FAIL,
  WAITLIST_LABEL,
  WAITLIST_MAILTO,
  WAITLIST_PENDING,
  WAITLIST_SUCCESS,
  WAITLIST_TITLE,
  formatUsd,
  GENERIC_ERROR,
} from '@/lib/verifica-adresa/copy';

type PaymentNotice = 'success' | 'cancelled' | null;

type Props = {
  config: PublicCheckerConfig;
  embed: boolean;
  paymentNotice: PaymentNotice;
};

export function VerificaAdresaChecker({ config, embed, paymentNotice }: Props) {
  const [address, setAddress] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [waitlistPending, setWaitlistPending] = useState(false);
  const [payPending, setPayPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckSuccess | null>(null);
  const [waitlistMessage, setWaitlistMessage] = useState<string | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  const single = config.offers.find((offer) => offer.id === 'single');
  const packs = config.offers.filter((offer) => offer.id !== 'single');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/verifica-adresa', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const payload: unknown = await response.json();
      if (!payload || typeof payload !== 'object') {
        setError(GENERIC_ERROR);
        return;
      }
      const data = payload as { ok?: boolean; error?: string };
      if (!response.ok || data.ok === false) {
        setError(typeof data.error === 'string' ? data.error : GENERIC_ERROR);
        return;
      }
      setResult(payload as CheckSuccess);
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setPending(false);
    }
  }

  async function onWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWaitlistPending(true);
    setWaitlistMessage(null);
    setMailto(null);
    try {
      const response = await fetch('/api/verifica-adresa/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, website: honeypot }),
      });
      const payload: unknown = await response.json();
      const data = payload && typeof payload === 'object' ? (payload as { ok?: boolean; error?: string; mailto?: string }) : {};
      if (data.ok) {
        setWaitlistMessage(WAITLIST_SUCCESS);
        setEmail('');
        return;
      }
      setWaitlistMessage(typeof data.error === 'string' ? data.error : WAITLIST_FAIL);
      if (typeof data.mailto === 'string') setMailto(data.mailto);
    } catch {
      setWaitlistMessage(WAITLIST_FAIL);
    } finally {
      setWaitlistPending(false);
    }
  }

  async function onPay(offerId: string) {
    setPayPending(offerId);
    setPayError(null);
    try {
      const response = await fetch('/api/verifica-adresa/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ offerId, address: result?.address }),
      });
      const payload: unknown = await response.json();
      const data = payload && typeof payload === 'object' ? (payload as { ok?: boolean; url?: string; error?: string }) : {};
      if (data.ok && typeof data.url === 'string') {
        window.location.assign(data.url);
        return;
      }
      setPayError(typeof data.error === 'string' ? data.error : GENERIC_ERROR);
    } catch {
      setPayError(GENERIC_ERROR);
    } finally {
      setPayPending(null);
    }
  }

  return (
    <div className={`mx-auto w-full max-w-3xl ${embed ? '' : ''}`}>
      {paymentNotice === 'success' ? <Notice tone="info">{PAYMENT_SUCCESS}</Notice> : null}
      {paymentNotice === 'cancelled' ? <Notice tone="muted">{PAYMENT_CANCELLED}</Notice> : null}

      <header className="mb-8 text-center">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-blue-400">
          Sancțiuni OFAC și UE
        </p>
        <h1 className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-3xl font-black text-transparent sm:text-5xl">
          {PAGE_TITLE}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-300 sm:text-lg">{PAGE_LEAD}</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">{PAGE_LEAD_NOTE}</p>
      </header>

      <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-[#0b1221] p-4 sm:p-6">
        <label htmlFor="adresa" className="mb-2 block text-sm font-medium text-gray-200">
          {INPUT_LABEL}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="adresa"
            name="adresa"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={INPUT_PLACEHOLDER}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 font-mono text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500/60"
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 font-bold text-white transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60"
          >
            {pending ? <Loader2 className="animate-spin" size={18} /> : null}
            {pending ? SUBMIT_PENDING : SUBMIT_LABEL}
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-gray-500">{INPUT_HINT}</p>
      </form>

      {error ? (
        <p role="alert" className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          {error}
        </p>
      ) : null}

      {result ? (
        <section
          id="rezultat"
          aria-live="polite"
          className={`mt-6 rounded-2xl border p-5 sm:p-6 ${
            result.sanctioned
              ? 'border-rose-400/40 bg-rose-500/10'
              : 'border-sky-400/30 bg-sky-500/5'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.sanctioned ? (
              <ShieldAlert className="mt-0.5 shrink-0 text-rose-300" aria-hidden />
            ) : (
              <Info className="mt-0.5 shrink-0 text-sky-300" aria-hidden />
            )}
            <div className="min-w-0">
              <h2 className="text-2xl font-black text-white">{result.headline}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-200">{result.explanation}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <Row label={RESULT_NETWORK} value={result.networkLabel} />
            <div>
              <dt className="text-gray-500">Adresă verificată</dt>
              <dd className="mt-1 break-all font-mono text-xs text-white sm:text-sm">{result.address}</dd>
            </div>
            <Row label={RESULT_CHECKED} value={result.checkedOn} />
            <div>
              <dt className="text-gray-500">{result.sanctioned ? RESULT_MATCHED : RESULT_LISTS}</dt>
              <dd className="mt-1 space-y-1 text-gray-200">
                {result.sources
                  .filter((source) => (result.sanctioned ? source.matched : true))
                  .map((source) => (
                    <p key={source.id}>
                      {source.name}
                      {source.publishedOn ? ` — listă din ${source.publishedOn}` : ''}
                      {source.stale ? ' (copie locală)' : ''}
                    </p>
                  ))}
              </dd>
            </div>
          </dl>

          <a
            href={result.chainabuseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-blue-200"
          >
            {CHAINABUSE_LABEL}
            <ExternalLink size={14} aria-hidden />
          </a>
        </section>
      ) : null}

      {result && config.sponsor.enabled ? (
        <aside className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-5">
          <p className="text-[11px] uppercase tracking-wider text-gray-500">{config.sponsor.disclosure}</p>
          <h2 className="mt-2 text-lg font-bold text-white">{config.sponsor.title}</h2>
          {config.sponsor.body ? <p className="mt-2 text-sm text-gray-300">{config.sponsor.body}</p> : null}
          <a
            href={config.sponsor.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-3 inline-flex text-sm font-semibold text-blue-300 hover:text-blue-200"
          >
            {config.sponsor.cta}
          </a>
        </aside>
      ) : null}

      <section id="raport-complet" className="mt-8 rounded-2xl border border-white/10 bg-[#0b1221] p-5 sm:p-6">
        <h2 className="text-xl font-bold text-white">{FULL_REPORT_TITLE}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-300">{FULL_REPORT_BODY}</p>
        {single ? (
          <p className="mt-3 text-sm text-gray-200">{priceOrientation(formatUsd(single.priceUsd))}</p>
        ) : null}
        <p className="mt-2 text-sm text-gray-500">
          {config.paymentsEnabled ? FULL_REPORT_PAYMENT_ON : FULL_REPORT_PRICE_NOTE}
        </p>
        {packs.length > 0 ? (
          <p className="mt-2 text-sm text-gray-500">
            {FULL_REPORT_PACKS_NOTE}{' '}
            {packs.map((pack) => `${pack.label}: ${formatUsd(pack.priceUsd)}`).join(' · ')}.
          </p>
        ) : null}

        {config.paymentsEnabled ? (
          <div className="mt-4 flex flex-col gap-2">
            {config.offers.map((offer) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => onPay(offer.id)}
                disabled={payPending !== null}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
              >
                {payPending === offer.id ? SUBMIT_PENDING : `${PAY_BUTTON} — ${offer.label} · ${formatUsd(offer.priceUsd)}`}
              </button>
            ))}
            {payError ? <p className="text-sm text-amber-200">{payError}</p> : null}
          </div>
        ) : (
          <form onSubmit={onWaitlist} className="relative mt-5">
            <p className="mb-2 text-sm font-medium text-gray-200">{WAITLIST_TITLE}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="waitlist-email">
                {WAITLIST_LABEL}
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@exemplu.com"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500/60"
              />
              <button
                type="submit"
                disabled={waitlistPending}
                className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-60"
              >
                {waitlistPending ? WAITLIST_PENDING : WAITLIST_BUTTON}
              </button>
            </div>
            <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </label>
            {waitlistMessage ? <p className="mt-3 text-sm text-gray-300">{waitlistMessage}</p> : null}
            {mailto ? (
              <a href={mailto} className="mt-2 inline-flex text-sm text-blue-300 hover:text-blue-200">
                {WAITLIST_MAILTO}
              </a>
            ) : null}
          </form>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-white">{SAFETY_TITLE}</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-300">
          {SAFETY_TIPS.map((tip) => (
            <li key={tip} className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <section id="nota-legala" className="mt-8 rounded-2xl border border-white/10 px-5 py-5 text-sm leading-relaxed text-gray-400">
        <h2 className="text-base font-bold text-gray-200">{LEGAL_TITLE}</h2>
        <p className="mt-3">{DISCLAIMER}</p>
        <p className="mt-3 text-gray-200">{OPERATOR_NOTE}</p>
        <p className="mt-3">{PRIVACY_NOTE}</p>
        <p className="mt-3">{OFAC_LICENSE_NOTE}</p>
      </section>

      {embed ? <p className="mt-6 text-center text-xs text-gray-500">{EMBED_ATTRIBUTION}</p> : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-100">{value}</dd>
    </div>
  );
}

function Notice({ tone, children }: { tone: 'info' | 'muted'; children: string }) {
  const color = tone === 'info' ? 'border-blue-400/30 bg-blue-500/10 text-blue-100' : 'border-white/10 bg-white/5 text-gray-300';
  return <p className={`mb-6 rounded-xl border px-4 py-3 text-sm ${color}`}>{children}</p>;
}
