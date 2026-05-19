import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'Mihai Daniel | Consultanță Crypto & Mentorat',
  description:
    'Mihai Daniel — consultanță crypto premium, mentorat 1-la-1 și cursuri de trading. Strategii validate pentru investitori serioși. 280K+ urmăritori.',
  alternates: {
    canonical: 'https://www.mihaidaniel.ro/',
  },
  openGraph: {
    title: 'Mihai Daniel | Consultanță Crypto & Mentorat',
    description:
      'Consultanță crypto premium, mentorat 1-la-1 și cursuri de trading pentru investitori serioși din România.',
    url: 'https://www.mihaidaniel.ro/',
    locale: 'ro_RO',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
