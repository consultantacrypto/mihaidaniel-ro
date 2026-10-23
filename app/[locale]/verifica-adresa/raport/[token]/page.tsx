import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSponsorConfig } from '@/lib/verifica-adresa/config';
import { defaultEmbedContext, isPublicToken } from '@/lib/verifica-adresa/embed';
import { getCheckerStore } from '@/lib/verifica-adresa/store';
import { ReportView } from '../../report-view';
import { CheckerShell } from '../../shell';

export const metadata: Metadata = {
  title: 'Raport de risc',
  robots: { index: false, follow: false },
};

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, token } = await params;
  const search = await searchParams;
  if (locale !== 'ro') redirect(`/verifica-adresa/raport/${token}`);
  const embedValue = search.embed;
  const embed = (Array.isArray(embedValue) ? embedValue[0] : embedValue) === '1';
  const context = defaultEmbedContext();

  let report = null;
  let unavailable = false;
  if (isPublicToken(token)) {
    try {
      report = await getCheckerStore().getReport(token);
    } catch (error) {
      console.error('[verifica-adresa] Raportul nu a putut fi citit.', error);
      unavailable = true;
    }
  }

  return (
    <CheckerShell embed={embed} returnOrigin={context.returnOrigin}>
      {report && !report.sample ? (
        <ReportView
          report={report}
          pdfHref={`/api/verifica-adresa/raport/${report.token}/pdf`}
          sponsor={getSponsorConfig()}
        />
      ) : (
        <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-[#0c1222] p-6">
          <h1 className="text-2xl font-semibold text-white">
            {unavailable ? 'Raportul nu poate fi deschis acum' : 'Raportul nu mai este disponibil'}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {unavailable
              ? 'Stocarea rapoartelor nu este configurată pe acest mediu.'
              : 'Linkul a expirat sau nu este valid. Rapoartele sunt păstrate o perioadă limitată.'}
          </p>
          <p className="mt-5 text-sm">
            <Link className="text-sky-300" href="/verifica-adresa">
              Înapoi la verificarea adresei
            </Link>
          </p>
        </div>
      )}
    </CheckerShell>
  );
}
