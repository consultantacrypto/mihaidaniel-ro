'use client';

import { useState } from 'react';
import { CONSENT_LABEL, INPUT_PLACEHOLDER } from '@/lib/verifica-adresa/copy';

export function CreditForm({ token, remaining }: { token: string; remaining: number }) {
  const [address, setAddress] = useState('');
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function redeem() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/verifica-adresa/credite', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, address, consent }),
      });
      const data = (await response.json()) as { reportUrl?: string; error?: string };
      if (!response.ok || !data.reportUrl) {
        setError(data.error || 'Verificarea nu a putut fi făcută.');
        return;
      }
      window.location.assign(data.reportUrl);
    } catch {
      setError('Verificarea nu a putut fi făcută.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="rounded-[28px] border border-white/10 bg-[#0c1222] p-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!pending && consent && address.trim() && remaining > 0) void redeem();
      }}
    >
      <h2 className="text-xl font-semibold text-white">Folosește un credit</h2>
      <p className="mt-2 text-sm text-slate-400">Mai ai {remaining} verificări. Creditul se consumă doar dacă raportul este gata.</p>
      <label className="mt-4 block text-sm text-slate-300">
        Adresă
        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder={INPUT_PLACEHOLDER}
          autoComplete="off"
          spellCheck={false}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white outline-none focus:ring-2 focus:ring-sky-300/40"
        />
      </label>
      <label className="mt-4 flex gap-3 text-sm leading-relaxed text-slate-200">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-sky-300"
        />
        <span>{CONSENT_LABEL}</span>
      </label>
      <button
        type="submit"
        disabled={pending || !consent || !address.trim() || remaining < 1}
        className="mt-5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 disabled:bg-white/20 disabled:text-slate-400"
      >
        {pending ? 'Se generează raportul…' : 'Generează raportul'}
      </button>
      {error ? (
        <p className="mt-3 text-sm text-amber-200" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
