'use client';

import { Link as LocaleLink } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Youtube, Twitter, Linkedin, Mail, MapPin, ShieldCheck, Globe, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');

  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-16 pb-8 font-[var(--font-inter)] mt-auto">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <LocaleLink href="/" className="flex items-center gap-2 group">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">MD</div>
               <span className="text-xl font-black text-white font-[var(--font-space)]">MIHAI DANIEL</span>
            </LocaleLink>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('tagline')}
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://www.youtube.com/@DanielMihaiCrypto" icon={<Youtube size={20} />} label="YouTube" />
              <SocialLink href="https://x.com/MIhaiDanielWeb3" icon={<Twitter size={20} />} label="Twitter/X" />
              <SocialLink href="https://www.linkedin.com/in/mihaidanielmarius/" icon={<Linkedin size={20} />} label="LinkedIn" />
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Globe size={18} className="text-blue-500"/> {t('platform')}
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
                <li><LocaleLink href="/curs" className="hover:text-blue-400 transition-colors">{t('course')}</LocaleLink></li>
                <li><LocaleLink href="/consultanta-crypto" className="hover:text-blue-400 transition-colors">{t('consultancy')}</LocaleLink></li>
                <li><LocaleLink href="/academie" className="hover:text-blue-400 transition-colors">{t('academy')}</LocaleLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-500"/> {t('company')}
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
                <li>
                    <LocaleLink href="/despre" className="hover:text-green-400 transition-colors flex items-center gap-2">
                        {t('about')} <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">{t('aboutBadge')}</span>
                    </LocaleLink>
                </li>
                <li>
                    <LocaleLink href="/contact" className="hover:text-green-400 transition-colors">
                        {t('contact')}
                    </LocaleLink>
                </li>
                <li><LocaleLink href="/termeni" className="hover:text-green-400 transition-colors">{t('terms')}</LocaleLink></li>
                <li><LocaleLink href="/confidentialitate" className="hover:text-green-400 transition-colors">{t('privacy')}</LocaleLink></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <MapPin size={18} className="text-purple-500"/> {t('office')}
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                    <MapPin className="mt-1 text-gray-600 shrink-0" size={16} />
                    <span>{t('address')}<br/>{t('addressLine2')}</span>
                </li>
                <li className="flex items-center gap-3">
                    <Mail className="text-gray-600 shrink-0" size={16} />
                    <a href="mailto:consultantacrypto.ro@gmail.com" className="hover:text-white transition-colors">consultantacrypto.ro@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                    <Clock className="text-gray-600 shrink-0" size={16} />
                    <span>{t('hours')}</span>
                </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 mb-8">
            <p className="text-xs text-gray-500 leading-relaxed text-justify opacity-70 hover:opacity-100 transition-opacity">
                {t('disclaimer')}
            </p>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            &copy; {currentYear} {t('copyright')}
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 rounded-full border border-green-500/10">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] text-green-400 font-mono font-bold">{t('status')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={label}
            className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
        >
            {icon}
        </a>
    );
}
