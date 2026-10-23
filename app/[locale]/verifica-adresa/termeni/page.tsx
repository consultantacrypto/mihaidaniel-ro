import { TERMS_SECTIONS } from '@/lib/verifica-adresa/legal';
import { LegalPage, legalMetadata } from '../legal-page';

export const metadata = legalMetadata(
  'Termeni — Verifică adresa',
  'Termenii raportului plătit de risc pentru adrese crypto, vândut de QuickExit, LLC.',
  '/verifica-adresa/termeni',
);

export default async function TermeniPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      title="Termeni"
      intro="Acești termeni se aplică raportului de risc cumpărat de pe mihaidaniel.ro sau din pagina încorporată pe stirilecrypto.ro."
      sections={TERMS_SECTIONS}
    />
  );
}
