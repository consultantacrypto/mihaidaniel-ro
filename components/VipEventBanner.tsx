'use client';

import {
  MapPin,
  CalendarClock,
  Sparkles,
  MessageCircle,
  Mail,
  FileText,
  UtensilsCrossed,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CONTACT_EMAIL } from '@/lib/seo/constants';

const WHATSAPP_URL = 'https://wa.me/40731490099';
const WHATSAPP_MESSAGE =
  'Salut Mihai, vreau să rezerv unul din locurile pentru cina de consultanță din Sinaia';

function buildWhatsAppLink(): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

function buildMailtoLink(): string {
  const subject = encodeURIComponent('Rezervare Cină VIP Sinaia — Mastermind Crypto');
  const body = encodeURIComponent(WHATSAPP_MESSAGE);
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export default function VipEventBanner() {
  const t = useTranslations('home.vipEvent');

  return (
    <section className="relative py-12 md:py-16 border-y border-amber-500/20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1208] via-[#0a0f1e] to-[#020617] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,720px)] h-48 bg-amber-500/15 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto rounded-2xl md:rounded-3xl border border-amber-500/35 bg-[#0a0f1e]/90 backdrop-blur-md shadow-[0_0_60px_rgba(245,158,11,0.12)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} className="text-amber-400" />
                {t('badgeEvent')}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {t('badgeLimited')}
              </span>
              <span className="text-xs text-amber-200/80 font-medium">
                {t('spots')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
              {t('title')}
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <MapPin className="text-amber-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                    {t('locationLabel')}
                  </p>
                  <p className="text-white font-semibold">{t('location')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <CalendarClock className="text-amber-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                    {t('dateLabel')}
                  </p>
                  <p className="text-white font-semibold">{t('date')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/25 sm:col-span-2 lg:col-span-1">
                <UtensilsCrossed className="text-amber-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                    {t('priceLabel')}
                  </p>
                  <p className="text-2xl font-black text-amber-300">{t('price')}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t('priceNote')}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-400 mb-8 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <FileText size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p>{t('includes')}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-lg rounded-xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle size={22} />
                {t('cta')}
              </a>
              <a
                href={buildMailtoLink()}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-white/15 hover:border-amber-500/40 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all text-sm sm:text-base"
              >
                <Mail size={18} />
                {t('ctaEmail')}
              </a>
            </div>

            <p className="text-center sm:text-left text-xs text-gray-500 mt-4 leading-relaxed">
              {t('paymentNote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
