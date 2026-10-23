'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  CONSENT_LABEL,
  EMAIL_HINT,
  INPUT_HINT,
  INPUT_LABEL,
  INPUT_PLACEHOLDER,
  PACK_NOTE,
  PAY_BUTTON,
  PAY_UNAVAILABLE,
  PREVIEW_ONLY,
  SUBMIT_PENDING,
  formatUsd,
} from '@/lib/verifica-adresa/copy';
import { checkoutNavigation } from '@/lib/verifica-adresa/embed';
import type { ReportOffer } from '@/lib/verifica-adresa/config';

type Preview =
  | { ok: true; network: string; networkLabel: string; address: string }
  | { ok: false; error: string }
  | null;

export function PurchaseForm({
  embed,
  paymentsEnabled,
  offers,
  source,
}: {
  embed: boolean;
  paymentsEnabled: boolean;
  offers: ReportOffer[];
  source: string;
}) {
  const [offerId, setOfferId] = useState(offers[0]?.id ?? 'single');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [preview, setPreview] = useState<Preview>(null);
  const [previewing, setPreviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const offer = offers.find((item) => item.id === offerId) ?? offers[0];
  const single = offer?.credits === 1;

  useEffect(() => {
    if (!single) return;
    const trimmed = address.trim();
    if (!trimmed) return;
    let cancelled = false;
    const handle = setTimeout(async () => {
      try {
        const response = await fetch('/api/verifica-adresa', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ address: trimmed }),
        });
        const data = (await response.json()) as Preview;
        if (!cancelled) setPreview(data);
      } catch {
        if (!cancelled) setPreview({ ok: false, error: 'Nu am putut verifica formatul.' });
      } finally {
        if (!cancelled) setPreviewing(false);
      }
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [address, single]);

  async function pay() {
    if (!offer) return;
    setError(null);
    setCheckoutUrl(null);
    const inFrame = window.self !== window.top;
    const popup = checkoutNavigation(inFrame) === 'new-tab' ? window.open('about:blank', '_blank') : null;
    setSubmitting(true);
    try {
      const response = await fetch('/api/verifica-adresa/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.id,
          address: single ? address : undefined,
          email,
          consent,
          source,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        popup?.close();
        setError(data.error || 'Plata nu a putut fi pornită.');
        return;
      }
      if (popup) {
        popup.location.assign(data.url);
        setCheckoutUrl(data.url);
        return;
      }
      if (inFrame) {
        setCheckoutUrl(data.url);
        return;
      }
      window.location.assign(data.url);
    } catch {
      popup?.close();
      setError('Plata nu a putut fi pornită.');
    } finally {
      setSubmitting(false);
    }
  }

  const networkReady = !single || preview?.ok === true;
  const canPay = paymentsEnabled && Boolean(offer) && consent && networkReady && !submitting;

  return (
    <form
      className="rounded-[28px] border border-white/10 bg-[#0c1222] p-5 shadow-2xl shadow-black/40 sm:p-6"
      data-testid="purchase-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (canPay) void pay();
      }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200/90">Adresă crypto</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Alege verificarea</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{PREVIEW_ONLY}</p>

      <div className="mt-5 grid gap-2">
        {offers.map((item) => {
          const selected = item.id === offer?.id;
          const unit = item.priceUsd / item.credits;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setOfferId(item.id);
                setPreview(null);
                setPreviewing(false);
              }}
              aria-pressed={selected}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                selected ? 'border-sky-300/70 bg-sky-300/10' : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <span>
                <span className="block text-sm font-medium text-white">{item.label}</span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {item.credits === 1 ? 'O adresă crypto, livrat imediat' : `${item.credits} adrese crypto · ${formatUsd(unit)} / raport`}
                </span>
              </span>
              <span className="text-sm font-semibold text-white">{formatUsd(item.priceUsd)}</span>
            </button>
          );
        })}
      </div>

      {single ? (
        <label className="mt-5 block text-sm text-slate-300">
          {INPUT_LABEL}
          <input
            value={address}
            onChange={(event) => {
              const value = event.target.value;
              setAddress(value);
              setPreview(null);
              setPreviewing(Boolean(value.trim()));
            }}
            placeholder={INPUT_PLACEHOLDER}
            autoComplete="off"
            spellCheck={false}
            data-testid="address-input"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white outline-none ring-sky-300/40 placeholder:text-slate-600 focus:ring-2"
          />
          <span className="mt-2 block text-xs text-slate-500">{INPUT_HINT}</span>
        </label>
      ) : (
        <p className="mt-5 text-sm leading-relaxed text-slate-400">{PACK_NOTE}</p>
      )}

      <div className="mt-4 min-h-12 rounded-2xl border border-white/10 bg-black/20 px-4 py-3" data-testid="network-result" aria-live="polite">
        {single && previewing ? <p className="text-sm text-slate-400">Se verifică formatul…</p> : null}
        {single && !previewing && preview?.ok ? (
          <p className="text-sm text-white">
            Rețea detectată: <span className="font-semibold text-sky-200">{preview.networkLabel}</span>
          </p>
        ) : null}
        {single && !previewing && preview && !preview.ok ? <p className="text-sm text-amber-200">{preview.error}</p> : null}
        {single && !previewing && !preview ? (
          <p className="text-sm text-slate-500">Formatul și rețeaua apar aici, înainte de plată.</p>
        ) : null}
        {!single ? <p className="text-sm text-slate-400">Adresa se introduce după plată, din linkul pachetului.</p> : null}
      </div>

      <label className="mt-4 block text-sm text-slate-300">
        Email pentru link
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          placeholder="opțional"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-sky-300/40 placeholder:text-slate-600 focus:ring-2"
        />
        <span className="mt-2 block text-xs text-slate-500">{EMAIL_HINT}</span>
      </label>

      <label className="mt-4 flex gap-3 text-sm leading-relaxed text-slate-200">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          data-testid="consent"
          className="mt-1 h-5 w-5 shrink-0 accent-sky-300"
        />
        <span>
          {CONSENT_LABEL}{' '}
          <Link className="text-sky-300 underline decoration-sky-300/30 underline-offset-2" href="/verifica-adresa/termeni">
            Termeni
          </Link>
          {' · '}
          <Link
            className="text-sky-300 underline decoration-sky-300/30 underline-offset-2"
            href="/verifica-adresa/confidentialitate"
          >
            Confidențialitate
          </Link>
        </span>
      </label>

      {embed ? (
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Plata se deschide într-o filă nouă. După plată revii pe {source}, unde vezi raportul.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canPay}
        data-testid="pay-button"
        className="mt-5 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-slate-400"
      >
        {submitting ? SUBMIT_PENDING : paymentsEnabled && offer ? `${PAY_BUTTON} · ${formatUsd(offer.priceUsd)}` : PAY_UNAVAILABLE}
      </button>
      {error ? (
        <p className="mt-3 text-sm text-amber-200" role="alert">
          {error}
        </p>
      ) : null}
      {checkoutUrl ? (
        <p className="mt-3 text-sm text-slate-300">
          Dacă fila nu s-a deschis,{' '}
          <a className="text-sky-300 underline" href={checkoutUrl} target="_blank" rel="noreferrer noopener">
            continuă către plata securizată
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
