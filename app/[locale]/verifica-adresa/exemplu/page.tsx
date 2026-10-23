import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { defaultEmbedContext } from '@/lib/verifica-adresa/embed';
import { sampleReport } from '@/lib/verifica-adresa/sample-report';
import { ReportView } from '../report-view';
import { CheckerShell } from '../shell';

export const metadata: Metadata = {
  title: 'Exemplu de raport',
  robots: { index: false, follow: false },
};

export default async function ExempluPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'ro') redirect('/verifica-adresa/exemplu');
  const context = defaultEmbedContext();
  return (
    <CheckerShell embed={false} returnOrigin={context.returnOrigin}>
      <ReportView report={sampleReport()} pdfHref="/api/verifica-adresa/exemplu/pdf" />
    </CheckerShell>
  );
}
