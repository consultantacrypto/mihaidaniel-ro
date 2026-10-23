import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatRoDateTime } from '@/lib/verifica-adresa/copy';
import { canonicalSiteOrigin, defaultEmbedContext, isPublicToken, reportPageUrl } from '@/lib/verifica-adresa/embed';
import { getCheckerStore } from '@/lib/verifica-adresa/store';
import { CreditForm } from '../../credit-form';
import { CheckerShell } from '../../shell';

export const metadata: Metadata = {
  title: 'Pachet de verificări',
  robots: { index: false, follow: false },
};

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function CreditPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  if (locale !== 'ro') redirect(`/verifica-adresa/credite/${token}`);
  const context = defaultEmbedContext();

  let pass = null;
  let unavailable = false;
  if (isPublicToken(token)) {
    try {
      pass = await getCheckerStore().getCredits(token);
    } catch (error) {
      console.error('[verifica-adresa] Pachetul nu a putut fi citit.', error);
      unavailable = true;
    }
  }

  const origin = canonicalSiteOrigin();

  return (
    <CheckerShell embed={false} returnOrigin={context.returnOrigin}>
      <div className="mx-auto max-w-xl space-y-6">
        {pass ? (
          <>
            <header>
              <p className="text-[11px] uppercase tracking-[0.2em] text-sky-200/80">Pachet {pass.source}</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">
                {pass.creditsRemaining} verificări rămase
              </h1>
              <p className="mt-3 text-sm text-slate-300">
                Din {pass.creditsTotal}. Linkul expiră la {formatRoDateTime(pass.expiresAt)}.
              </p>
            </header>
            <CreditForm token={pass.token} remaining={pass.creditsRemaining} />
            {pass.reportTokens.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {pass.reportTokens.map((reportToken) => (
                  <li key={reportToken}>
                    <Link className="text-sky-300" href={reportPageUrl(origin, reportToken)}>
                      Deschide un raport generat
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[#0c1222] p-6">
            <h1 className="text-2xl font-semibold text-white">
              {unavailable ? 'Pachetul nu poate fi deschis acum' : 'Pachetul nu mai este disponibil'}
            </h1>
            <p className="mt-3 text-sm text-slate-300">
              {unavailable
                ? 'Stocarea comenzilor nu este configurată pe acest mediu.'
                : 'Linkul a expirat sau nu este valid.'}
            </p>
          </div>
        )}
      </div>
    </CheckerShell>
  );
}
