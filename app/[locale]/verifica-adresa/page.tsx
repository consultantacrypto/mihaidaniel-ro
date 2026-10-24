import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SITE_URL } from '@/lib/seo/constants';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { publicCheckerConfig, singleReportPrice } from '@/lib/verifica-adresa/config';
import {
  DISCLAIMER,
  BEGINNER_BODY,
  BEGINNER_TITLE,
  EMBED_ATTRIBUTION,
  EXAMPLE_BODY,
  EXAMPLE_TITLE,
  HOW_STEPS,
  HOW_TITLE,
  OPERATOR_NOTE,
  PAGE_DESCRIPTION,
  PAGE_LEAD,
  NAV_LABEL,
  PAGE_TITLE,
  PRIVACY_NOTE,
  formatUsd,
} from '@/lib/verifica-adresa/copy';
import { defaultEmbedContext, resolveEmbedSource } from '@/lib/verifica-adresa/embed';
import { categoryLabel, exposureLabel, levelLabel } from '@/lib/verifica-adresa/risk-labels';
import { sampleReport } from '@/lib/verifica-adresa/sample-report';
import { OPERATOR } from '@/lib/verifica-adresa/sources';
import { PurchaseForm } from './purchase-form';
import { CheckerShell } from './shell';

type Search = Record<string, string | string[] | undefined>;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const INCLUDED = [
  'Potrivire exactă în lista OFAC SDN și în lista consolidată de sancțiuni financiare a UE, cu data verificării.',
  'Scor de risc și nivel, plus semnalele raportate de furnizor.',
  'Expunere directă și indirectă: mixere, hack-uri, scheme de fraudă, entități sancționate.',
  'PDF cu ID-ul raportului, ora verificării, sursele și nota legală.',
];

const TRUST = [
  {
    title: 'Operator',
    body: 'QuickExit, LLC (Delaware), 131 Continental Dr, Suite 305, Newark, DE 19713, US. Comerciantul plății.',
  },
  {
    title: 'Surse',
    body: 'OFAC SDN este o lucrare a guvernului SUA, în domeniul public. Lista UE este fișierul public al Comisiei. Scorul vine de la MistTrack.',
  },
  {
    title: 'Confidențialitate',
    body: 'Adresa nu este stocată împreună cu IP-ul. Stripe primește un hash, nu adresa. Furnizorul de risc primește adresa ca să calculeze scorul.',
  },
];

const FAQ = [
  {
    q: 'De ce nu văd rezultatul înainte de plată?',
    a: 'Raportul este produsul. Înainte de plată confirmăm doar formatul și rețeaua, ca să nu plătești pentru o adresă scrisă greșit.',
  },
  {
    q: 'Ce rețele sunt acceptate?',
    a: 'Bitcoin, inclusiv bech32, Ethereum și alte rețele EVM, TRON și Solana.',
  },
  {
    q: 'Cât timp pot deschide raportul?',
    a: 'Linkul nu poate fi ghicit și expiră la data scrisă pe raport. După aceea este șters. Descarcă PDF-ul dacă vrei o copie.',
  },
  {
    q: 'Ce se întâmplă dacă furnizorul nu răspunde?',
    a: 'Încercăm de mai multe ori. Dacă tot nu primim scorul, nu livrăm un rezultat parțial și marcăm plata pentru rambursare. La un pachet, creditul nu se consumă.',
  },
  {
    q: 'Pot renunța în 14 zile?',
    a: 'Nu, dacă livrarea a început. Raportul este conținut digital livrat imediat, iar bifarea casetei este consimțământul cerut de OUG nr. 34/2014 art. 16 lit. m. Dacă raportul nu a putut fi livrat, plata se rambursează.',
  },
  {
    q: 'Funcționează și de pe stirilecrypto.ro?',
    a: 'Da. Pagina poate fi încorporată acolo. Plata se deschide într-o filă nouă și revii pe stirilecrypto.ro. În Stripe, sursa este stirilecrypto.ro.',
  },
];

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const search = await searchParams;
  const embed = first(search.embed) === '1';
  return {
    ...buildPageMetadata({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      path: '/verifica-adresa',
      locale: 'ro_RO',
      keywords: ['verificare portofel crypto', 'adresă crypto', 'sancțiuni OFAC', 'TRON', 'ETH', 'BTC'],
    }),
    robots: embed ? { index: false, follow: false } : { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/verifica-adresa`,
      languages: { ro: `${SITE_URL}/verifica-adresa`, 'x-default': `${SITE_URL}/verifica-adresa` },
    },
  };
}

export default async function VerificaAdresaPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const search = await searchParams;
  if (locale !== 'ro') {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(search)) {
      const item = first(value);
      if (item) query.set(key, item);
    }
    const qs = query.toString();
    redirect(qs ? `/verifica-adresa?${qs}` : '/verifica-adresa');
  }

  const embed = first(search.embed) === '1';
  const context = resolveEmbedSource(first(search.source)) ?? defaultEmbedContext();
  const config = publicCheckerConfig();
  const sample = sampleReport();
  const price = singleReportPrice();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: PAGE_TITLE,
    url: `${SITE_URL}/verifica-adresa`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    inLanguage: 'ro-RO',
    description: PAGE_DESCRIPTION,
    isAccessibleForFree: false,
    offers: {
      '@type': 'Offer',
      price: String(price),
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: OPERATOR.legalName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: OPERATOR.street,
        addressLocality: OPERATOR.city,
        addressRegion: OPERATOR.region,
        postalCode: OPERATOR.postalCode,
        addressCountry: OPERATOR.country,
      },
    },
  };

  return (
    <CheckerShell embed={embed} returnOrigin={context.returnOrigin}>
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200/80">
            QuickExit, LLC · {NAV_LABEL}
          </p>
          <h1
            className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl sm:leading-[1.05]"
            data-testid="hero-title"
          >
            {PAGE_TITLE}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{PAGE_LEAD}</p>
          <p className="mt-4 text-sm font-medium text-white">De la {formatUsd(price)} pentru verificarea unui portofel.</p>
        </header>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className={embed ? 'order-2' : 'order-2 space-y-8 lg:order-1'}>
            <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6" data-testid="sample-report">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">Exemplu · date fictive</p>
                <p className="text-xs text-slate-500">{sample.publicId}</p>
              </div>
              <p className="mt-4 break-all font-mono text-xs text-slate-400">{sample.address}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-black/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Sancțiuni</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{sample.sanctions?.headline}</p>
                </div>
                <div className="rounded-2xl bg-black/30 p-4">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Scor</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {sample.risk?.score}
                    <span className="text-sm font-normal text-slate-400"> · {levelLabel(sample.risk?.level ?? null)}</span>
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {sample.risk?.exposures.map((item) => (
                  <li key={item.category} className="flex justify-between gap-3 border-t border-white/10 pt-2">
                    <span>{categoryLabel(item.category)}</span>
                    <span className="text-slate-500">{exposureLabel(item.exposure)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <Link className="text-sky-300" href="/verifica-adresa/exemplu">
                  Vezi exemplul complet
                </Link>
                <a className="text-sky-300" href="/api/verifica-adresa/exemplu/pdf" target="_blank" rel="noreferrer">
                  PDF exemplu
                </a>
              </div>
            </section>

            {embed ? null : (
              <>
                <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6" data-testid="beginner">
                  <h2 className="text-2xl font-semibold text-white">{BEGINNER_TITLE}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{BEGINNER_BODY}</p>
                </section>
                <section data-testid="how-it-works">
                  <h2 className="text-2xl font-semibold text-white">{HOW_TITLE}</h2>
                  <ol className="mt-4 grid gap-3 sm:grid-cols-3">
                    {HOW_STEPS.map((step, index) => (
                      <li key={step.title} className="rounded-2xl border border-white/10 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/80">
                          {String(index + 1).padStart(2, '0')}
                        </p>
                        <h3 className="mt-2 text-sm font-semibold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
                      </li>
                    ))}
                  </ol>
                </section>
                <section className="rounded-[28px] border border-amber-300/30 bg-amber-300/10 p-5 sm:p-6" data-testid="telegram-example">
                  <h2 className="text-2xl font-semibold text-white">{EXAMPLE_TITLE}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-amber-50">{EXAMPLE_BODY}</p>
                </section>
                <section>
                  <h2 className="text-2xl font-semibold text-white">Ce conține raportul</h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {INCLUDED.map((item) => (
                      <li key={item} className="rounded-2xl border border-white/10 px-4 py-4 text-sm leading-relaxed text-slate-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="grid gap-3 sm:grid-cols-3">
                  {TRUST.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-white/10 p-4">
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
                    </article>
                  ))}
                </section>
              </>
            )}
          </div>

          <div className="order-1 lg:sticky lg:top-24 lg:order-2">
            <PurchaseForm
              embed={embed}
              paymentsEnabled={config.paymentsEnabled}
              offers={config.offers}
              source={context.source}
            />
          </div>
        </div>

        {embed ? (
          <p className="mx-auto mt-8 max-w-3xl text-xs leading-relaxed text-slate-500">
            {DISCLAIMER} {OPERATOR_NOTE} {PRIVACY_NOTE}{' '}
            <a className="text-sky-300" href="https://www.mihaidaniel.ro/verifica-adresa" target="_blank" rel="noreferrer">
              {EMBED_ATTRIBUTION}
            </a>
          </p>
        ) : (
          <>
            <section className="mx-auto mt-16 max-w-3xl">
              <h2 className="text-2xl font-semibold text-white">Întrebări</h2>
              <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
                {FAQ.map((item) => (
                  <details key={item.q} className="group py-4">
                    <summary className="cursor-pointer list-none text-base font-medium text-white">{item.q}</summary>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
            <section className="mx-auto mt-12 max-w-3xl space-y-3 text-xs leading-relaxed text-slate-500" id="nota">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Notă</h2>
              <p>{DISCLAIMER}</p>
              <p>{OPERATOR_NOTE}</p>
              <p>{PRIVACY_NOTE}</p>
              <p>
                <Link className="text-sky-300" href="/verifica-adresa/termeni">
                  Termeni
                </Link>
                {' · '}
                <Link className="text-sky-300" href="/verifica-adresa/confidentialitate">
                  Confidențialitate
                </Link>
              </p>
            </section>
          </>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </CheckerShell>
  );
}
