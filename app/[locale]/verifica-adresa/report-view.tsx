import {
  DISCLAIMER,
  EMBED_ATTRIBUTION,
  OPERATOR_NOTE,
  PRIVACY_NOTE,
  formatRoDateTime,
} from '@/lib/verifica-adresa/copy';
import { categoryLabel, exposureExtra, exposureLabel, levelLabel, signalLabel } from '@/lib/verifica-adresa/risk-labels';
import type { ReportDocument } from '@/lib/verifica-adresa/report';
import type { SponsorConfig } from '@/lib/verifica-adresa/config';

export function ReportView({
  report,
  pdfHref,
  sponsor,
}: {
  report: ReportDocument;
  pdfHref: string;
  sponsor?: SponsorConfig | null;
}) {
  const ready = report.status === 'ready' && report.sanctions && report.risk;
  const score = report.risk?.score;

  return (
    <article className="mx-auto max-w-3xl" data-testid="report-view">
      {report.sample ? (
        <p className="mb-4 rounded-2xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Exemplu ilustrativ. Toate cifrele și potrivirile de mai jos sunt fictive și nu reprezintă o verificare.
        </p>
      ) : null}

      <header className="border-b border-white/10 pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-200/80">
          QuickExit, LLC · mihaidaniel.ro
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {ready ? 'Raport de risc' : 'Livrare nefinalizată'}
        </h1>
        <dl className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-slate-500">ID raport</dt>
            <dd className="mt-1 font-medium text-white">{report.publicId}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-slate-500">Verificat la</dt>
            <dd className="mt-1">{formatRoDateTime(report.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-slate-500">Disponibil până la</dt>
            <dd className="mt-1">{formatRoDateTime(report.expiresAt)}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-slate-500">Cerere pornită de pe</dt>
            <dd className="mt-1">{report.source}</dd>
          </div>
        </dl>
      </header>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-[11px] uppercase tracking-wider text-slate-500">Adresă · {report.networkLabel}</p>
        <p className="mt-2 break-all font-mono text-sm text-white">{report.address}</p>
      </section>

      {ready ? (
        <>
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#0c1222] p-5">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Liste de sancțiuni</p>
              <p className="mt-3 text-3xl font-semibold text-white" data-testid="sanctions-verdict">
                {report.sanctions?.headline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{report.sanctions?.explanation}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0c1222] p-5">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Scor furnizor</p>
              <p className="mt-3 text-3xl font-semibold text-white" data-testid="risk-score">
                {score === null || score === undefined ? '—' : score}
                <span className="text-base font-normal text-slate-400"> / 100</span>
              </p>
              <p className="mt-2 text-sm text-slate-300">Nivel: {levelLabel(report.risk?.level ?? null)}</p>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Surse</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {report.sanctions?.sources.map((source) => (
                <li key={source.id} className="rounded-2xl border border-white/10 px-4 py-3">
                  <span className="text-white">{source.name}</span>
                  <span className="mt-1 block text-slate-400">
                    Verificare {source.fetchedOn}
                    {source.publishedOn ? ` · listă publicată ${source.publishedOn}` : ''}
                    {source.matched ? ' · potrivire' : ''}
                    {source.stale ? ' · listă mai veche de 48 de ore' : ''}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {report.risk && report.risk.labels.length > 0 ? (
            <section className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Semnale</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {report.risk.labels.map((label) => (
                  <li key={label} className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-200">
                    {signalLabel(label)}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {report.risk && report.risk.exposures.length > 0 ? (
            <section className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Expunere</h2>
              <ul className="mt-3 divide-y divide-white/10 rounded-3xl border border-white/10">
                {report.risk.exposures.map((item, index) => (
                  <li key={`${item.category}-${index}`} className="px-4 py-3 text-sm">
                    <p className="text-white">
                      {categoryLabel(item.category)} · {exposureLabel(item.exposure)}
                    </p>
                    <p className="mt-1 text-slate-400">
                      {[item.detail, exposureExtra(item)].filter(Boolean).join(' · ') || 'Fără detaliu suplimentar'}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Înainte să trimiți</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
              {report.sanctions?.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            {report.sanctions ? (
              <p className="mt-4 text-sm">
                <a
                  className="text-sky-300 underline decoration-sky-300/40 underline-offset-4"
                  href={report.sanctions.chainabuseUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {report.sanctions.chainabuseLabel}
                </a>
              </p>
            ) : null}
          </section>
        </>
      ) : (
        <section className="mt-6 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5 text-sm leading-relaxed text-amber-50">
          <p>{report.failureReason}</p>
          {report.refundId ? <p className="mt-3 text-amber-100/80">Referință rambursare: {report.refundId}</p> : null}
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={pdfHref}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
          data-testid="pdf-link"
        >
          Descarcă PDF
        </a>
      </div>

      {sponsor?.enabled ? (
        <aside className="mt-8 rounded-3xl border border-white/10 p-5">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">{sponsor.disclosure}</p>
          <p className="mt-2 font-medium text-white">{sponsor.title}</p>
          {sponsor.body ? <p className="mt-2 text-sm text-slate-300">{sponsor.body}</p> : null}
          <a className="mt-3 inline-block text-sm text-sky-300" href={sponsor.href} target="_blank" rel="noreferrer sponsored noopener">
            {sponsor.cta}
          </a>
        </aside>
      ) : null}

      <footer className="mt-8 space-y-3 text-xs leading-relaxed text-slate-500">
        <p>{DISCLAIMER}</p>
        <p>{OPERATOR_NOTE}</p>
        <p>{PRIVACY_NOTE}</p>
        <p>{EMBED_ATTRIBUTION}</p>
      </footer>
    </article>
  );
}
