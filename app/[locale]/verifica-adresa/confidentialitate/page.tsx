import { PRIVACY_SECTIONS } from '@/lib/verifica-adresa/legal';
import { LegalPage, legalMetadata } from '../legal-page';

export const metadata = legalMetadata(
  'Confidențialitate — Verifică adresa',
  'Ce date folosește raportul de risc vândut de QuickExit, LLC și cât timp sunt păstrate.',
  '/verifica-adresa/confidentialitate',
);

export default async function ConfidentialitatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      title="Confidențialitate"
      intro="Nota de mai jos acoperă doar verificarea de adresă. Nu înlocuiește politica generală a site-ului."
      sections={PRIVACY_SECTIONS}
    />
  );
}
