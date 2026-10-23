import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SITE_URL } from '@/lib/seo/constants';
import { buildPageMetadata } from '@/lib/seo/metadata';
import type { LegalSection } from '@/lib/verifica-adresa/legal';
import { CheckerShell } from './shell';
import { defaultEmbedContext } from '@/lib/verifica-adresa/embed';

export function legalMetadata(title: string, description: string, path: string): Metadata {
  return {
    ...buildPageMetadata({ title, description, path, locale: 'ro_RO' }),
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: { ro: `${SITE_URL}${path}`, 'x-default': `${SITE_URL}${path}` },
    },
  };
}

export function LegalPage({
  locale,
  title,
  intro,
  sections,
}: {
  locale: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  if (locale !== 'ro') redirect('/verifica-adresa');
  const context = defaultEmbedContext();
  return (
    <CheckerShell embed={false} returnOrigin={context.returnOrigin}>
      <article className="mx-auto max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200/80">QuickExit, LLC</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-300">{intro}</p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-slate-300">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm">
          <Link className="text-sky-300" href="/verifica-adresa">
            Înapoi la verificarea adresei
          </Link>
        </p>
      </article>
    </CheckerShell>
  );
}
