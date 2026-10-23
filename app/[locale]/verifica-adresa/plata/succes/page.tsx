import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PAYMENT_SUCCESS, formatRoDateTime } from '@/lib/verifica-adresa/copy';
import {
  canonicalSiteOrigin,
  creditPageUrl,
  defaultEmbedContext,
  reportPageUrl,
  resolveEmbedSource,
} from '@/lib/verifica-adresa/embed';
import { loadPaidSession } from '@/lib/verifica-adresa/paid-session';
import { CreditForm } from '../../credit-form';
import { ReportView } from '../../report-view';
import { CheckerShell } from '../../shell';
import { getSponsorConfig } from '@/lib/verifica-adresa/config';

export const metadata: Metadata = {
  title: 'Raportul tău',
  robots: { index: false, follow: false },
};

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Search = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  if (locale !== 'ro') redirect('/verifica-adresa/plata/succes');

  const embed = first(search.embed) === '1';
  const context = resolveEmbedSource(first(search.source)) ?? defaultEmbedContext();
  const sessionId = first(search.session_id) ?? '';
  const origin = canonicalSiteOrigin();

  let result: Awaited<ReturnType<typeof loadPaidSession>> | { state: 'error' };
  try {
    result = await loadPaidSession(sessionId);
  } catch (error) {
    console.error('[verifica-adresa] Confirmarea plății a eșuat.', error);
    result = { state: 'error' };
  }

  return (
    <CheckerShell embed={embed} returnOrigin={context.returnOrigin}>
      <div className="mx-auto max-w-3xl">
        {result.state === 'ok' && result.report ? (
          <>
            <p className="mb-6 text-sm text-slate-300">{PAYMENT_SUCCESS}</p>
            <ReportView
              report={result.report}
              pdfHref={`/api/verifica-adresa/raport/${result.report.token}/pdf`}
              sponsor={getSponsorConfig()}
            />
          </>
        ) : null}

        {result.state === 'ok' && result.credits ? (
          <div className="space-y-6">
            <header>
              <p className="text-[11px] uppercase tracking-[0.2em] text-sky-200/80">Pachet activ</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Verificările tale sunt gata de folosit</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Mai ai {result.credits.creditsRemaining} din {result.credits.creditsTotal}. Linkul de mai jos este cheia
                pachetului. Păstrează-l. Expiră la {formatRoDateTime(result.credits.expiresAt)}.
              </p>
              <p className="mt-4 break-all text-sm text-sky-200">
                <Link href={creditPageUrl(origin, result.credits.token)}>{creditPageUrl(origin, result.credits.token)}</Link>
              </p>
            </header>
            <CreditForm token={result.credits.token} remaining={result.credits.creditsRemaining} />
            {result.order.reportToken ? (
              <p className="text-sm">
                <Link className="text-sky-300" href={reportPageUrl(origin, result.order.reportToken)}>
                  Deschide raportul inclus
                </Link>
              </p>
            ) : null}
          </div>
        ) : null}

        {result.state === 'ok' && !result.report && !result.credits ? (
          <div className="rounded-[28px] border border-white/10 bg-[#0c1222] p-6">
            <h1 className="text-2xl font-semibold text-white">Plata este înregistrată</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Livrarea nu este gata încă. Reîncarcă pagina peste un minut. Dacă ai lăsat un email, linkul ajunge și acolo.
            </p>
          </div>
        ) : null}

        {result.state !== 'ok' ? (
          <div className="rounded-[28px] border border-white/10 bg-[#0c1222] p-6">
            <h1 className="text-2xl font-semibold text-white">Nu am putut arăta raportul</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {result.state === 'unpaid'
                ? 'Plata nu este confirmată încă. Dacă tocmai ai plătit, reîncarcă pagina peste un minut.'
                : result.state === 'invalid'
                  ? 'Linkul de întoarcere nu conține o sesiune de plată validă.'
                  : 'Dacă suma a fost încasată, păstrează emailul de la Stripe. Livrarea se reia automat când confirmarea ajunge.'}
            </p>
            <p className="mt-5 text-sm">
              <Link className="text-sky-300" href="/verifica-adresa">
                Înapoi la verificarea adresei
              </Link>
            </p>
          </div>
        ) : null}
      </div>
    </CheckerShell>
  );
}
