import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Youtube, Twitter, TrendingUp, Users, Globe2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PartnershipInquiryForm from '@/components/partnerships/PartnershipInquiryForm';
import { AUDIENCE_STATS, SITE_URL } from '@/lib/seo/constants';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { buildBreadcrumbSchema } from '@/lib/seo/schemas/breadcrumb';
import JsonLd from '@/components/JsonLd';

const PAGE_PATH = '/en/partnerships';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const SPONSORS = ['Binance', 'Bybit', 'OKX'] as const;

const STATS = [
  { label: 'YouTube', value: '96.6K' },
  { label: 'TikTok', value: '118K' },
  { label: 'X (Twitter)', value: '56.7K' },
  { label: 'LinkedIn', value: '13.2K' },
  { label: 'Total reach', value: '280K+' },
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: 'Partnerships & Media Kit | Mihai Daniel',
  description:
    'Partner with Mihai Daniel — crypto KOL & educator. 280K+ audience. Past sponsorships: Binance, Bybit, OKX. Request media kit & campaign brief.',
  path: PAGE_PATH,
  locale: 'en_US',
  image: '/mihai-daniel-consultanta.jpg',
  alternates: {
    canonical: PAGE_URL,
    languages: {
      ro: `${SITE_URL}/`,
      en: PAGE_URL,
      'x-default': `${SITE_URL}/`,
    },
  },
});

export default async function PartnershipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale !== 'en') {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-purple-500/30">
      <JsonLd
        data={buildBreadcrumbSchema(
          [{ name: 'Partnerships', path: PAGE_PATH }],
          'en'
        )}
      />
      <Navbar />

      <section className="relative pt-28 pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6">
            Media Kit · Partnerships
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Mihai Daniel —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Crypto KOL & Educator
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed border-l-4 border-purple-500/40 pl-6">
            Premium integrations for exchanges and Web3 brands targeting serious
            crypto investors in Romania and CEE — with measurable reach across
            YouTube, TikTok, and X.
          </p>
        </div>
      </section>

      <section className="py-12 border-b border-white/5 bg-[#050b1d]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-[#0a0f1e] p-5 text-center"
              >
                <p className="text-2xl md:text-3xl font-black text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Users className="text-purple-400" size={24} />
                  Audience overview
                </h2>
                <ul className="space-y-3 text-gray-300 leading-relaxed">
                  <li>
                    <strong className="text-white">Core demo:</strong> 25–45,
                    male-skewed, Romania & EU crypto investors with active
                    portfolios.
                  </li>
                  <li>
                    <strong className="text-white">Intent:</strong> education,
                    portfolio strategy, exchange onboarding — not meme gambling.
                  </li>
                  <li>
                    <strong className="text-white">Formats:</strong> long-form
                    YouTube, short-form TikTok, X threads, live AMAs, dedicated
                    landing pages.
                  </li>
                  <li>
                    <strong className="text-white">Avg. engagement:</strong>{' '}
                    high comment quality on strategy and macro content (
                    {AUDIENCE_STATS.totalReach.toLocaleString('en-US')}+ total
                    reach).
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-400" size={24} />
                  Past sponsorships
                </h2>
                <div className="flex flex-wrap gap-3">
                  {SPONSORS.map((brand) => (
                    <span
                      key={brand}
                      className="px-5 py-2.5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 font-bold text-sm"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Exchange integrations, campaign launches, and educational
                  series — available on request in full media kit PDF.
                </p>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://www.youtube.com/@DanielMihaiCrypto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={22} />
                </a>
                <a
                  href="https://x.com/MIhaiDanielWeb3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-white/10 hover:border-blue-400/40 text-gray-400 hover:text-blue-300 transition-colors"
                  aria-label="X"
                >
                  <Twitter size={22} />
                </a>
                <a
                  href={SITE_URL}
                  className="p-3 rounded-xl border border-white/10 hover:border-purple-400/40 text-gray-400 hover:text-purple-300 transition-colors flex items-center gap-2 text-sm font-medium px-4"
                >
                  <Globe2 size={18} /> mihaidaniel.ro
                </a>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 hidden md:block">
                <Image
                  src="/mihai-daniel-consultanta.jpg"
                  alt="Mihai Daniel — Crypto KOL"
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Agency inquiry</h2>
              <p className="text-gray-400 mb-6 text-sm">
                Share your brief — we respond within 2 business days.
              </p>
              <PartnershipInquiryForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


