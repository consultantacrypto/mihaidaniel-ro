import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PAYMENT_CANCELLED } from '@/lib/verifica-adresa/copy';
import { defaultEmbedContext, resolveEmbedSource } from '@/lib/verifica-adresa/embed';
import { CheckerShell } from '../../shell';

export const metadata: Metadata = {
  title: 'Plată anulată',
  robots: { index: false, follow: false },
};

type Search = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CancelPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  if (locale !== 'ro') redirect('/verifica-adresa/plata/anulata');
  const embed = first(search.embed) === '1';
  const context = resolveEmbedSource(first(search.source)) ?? defaultEmbedContext();

  return (
    <CheckerShell embed={embed} returnOrigin={context.returnOrigin}>
      <div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-[#0c1222] p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Plata a fost anulată</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{PAYMENT_CANCELLED}</p>
        <p className="mt-6 text-sm">
          <Link className="text-sky-300" href={embed ? `/verifica-adresa?embed=1&source=${context.source}` : '/verifica-adresa'}>
            Înapoi la verificarea adresei
          </Link>
        </p>
      </div>
    </CheckerShell>
  );
}
