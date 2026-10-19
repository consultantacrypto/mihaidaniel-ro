'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const SUBJECTS = [
  'Suport General',
  'Consultanță 1-la-1',
  'Problemă Acces Academie',
  'Propunere Parteneriat',
  'Presă / Media',
] as const;

type Status = 'idle' | 'loading' | 'success' | 'error' | 'fallback';

function safeMailto(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('mailto:') || /[\r\n]/.test(value)) return null;
  return value;
}

function safeWhatsapp(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'wa.me') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>(SUBJECTS[0]);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          md_hp: honeypot,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fallback?: boolean;
        mailto?: unknown;
        whatsapp?: unknown;
      } | null;

      if (response.ok && data?.ok) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        return;
      }

      if (data?.fallback) {
        setMailto(safeMailto(data.mailto));
        setWhatsapp(safeWhatsapp(data.whatsapp));
        setStatus('fallback');
        return;
      }

      setStatus('error');
      setError(data?.error || 'Nu am putut trimite mesajul. Încearcă din nou.');
    } catch {
      setStatus('error');
      setError('Nu am putut trimite mesajul. Încearcă din nou.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-400" />
        <p className="mb-2 text-lg font-bold text-white">Am primit mesajul.</p>
        <p className="text-sm text-gray-300">Îți răspund în curând.</p>
      </div>
    );
  }

  if (status === 'fallback') {
    return (
      <div className="space-y-4 rounded-2xl border border-white/10 bg-[#02050a] p-6">
        <p className="font-bold text-white">Mesajul nu a plecat automat.</p>
        <p className="text-sm leading-relaxed text-gray-300">
          Poți să mi-l trimiți direct pe email sau pe WhatsApp. Textul e deja completat.
        </p>
        <div className="space-y-3">
          {mailto && (
            <a
              href={mailto}
              className="block w-full rounded-lg bg-blue-600 py-3 text-center font-bold text-white transition-colors hover:bg-blue-700"
            >
              Trimite pe email
            </a>
          )}
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-green-600 py-3 text-center font-bold text-white transition-colors hover:bg-green-500"
            >
              Trimite pe WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6">
      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="md_hp">Nu completa acest câmp</label>
        <input
          id="md_hp"
          name="md_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact-name" className="mb-2 block text-sm font-bold text-gray-300">
          Numele Tău
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-[#02050a] p-3 text-white outline-none transition-colors focus:border-blue-500"
          placeholder="Ex: Alex Popescu"
          autoComplete="name"
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-2 block text-sm font-bold text-gray-300">
          Adresa de Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-[#02050a] p-3 text-white outline-none transition-colors focus:border-blue-500"
          placeholder="alex@email.com"
          autoComplete="email"
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-2 block text-sm font-bold text-gray-300">
          Subiect
        </label>
        <select
          id="contact-subject"
          name="subject"
          value={subject}
          onChange={(event) =>
            setSubject(event.target.value as (typeof SUBJECTS)[number])
          }
          className="w-full rounded-lg border border-gray-800 bg-[#02050a] p-3 text-white outline-none transition-colors focus:border-blue-500"
          disabled={status === 'loading'}
        >
          {SUBJECTS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-bold text-gray-300">
          Mesaj
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-lg border border-gray-800 bg-[#02050a] p-3 text-white outline-none transition-colors focus:border-blue-500"
          placeholder="Salut Mihai, aș vrea să știu..."
          disabled={status === 'loading'}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-700 disabled:opacity-70"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Se trimite...
          </>
        ) : (
          'Trimite Mesajul'
        )}
      </button>

      <p className="mt-4 text-center text-xs text-gray-500">
        *Datele tale sunt protejate conform politicii GDPR. Nu trimitem spam.
      </p>
    </form>
  );
}
