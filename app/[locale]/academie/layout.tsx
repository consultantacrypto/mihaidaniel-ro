import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Academia Crypto | Dicționar Investiții — Mihai Daniel',
  description:
    'Ghiduri complete despre Bitcoin, DeFi, trading și securitate. Termeni explicați clar, cu exemple practice.',
  path: '/academie',
  image: '/bitcoinacademy.jpg',
  keywords: [
    'academia crypto',
    'educatie bitcoin',
    'termeni crypto',
    'ghid investitii',
  ],
});

export default function AcademieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
