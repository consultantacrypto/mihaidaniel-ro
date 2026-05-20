'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('language');

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    // Media kit is EN-only — switching to RO goes home
    if (pathname === '/partnerships' && nextLocale === 'ro') {
      router.replace('/', { locale: 'ro' });
      return;
    }
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div
      className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5 text-xs font-bold"
      role="group"
      aria-label={t('switch')}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            locale === loc
              ? 'bg-white text-black'
              : 'text-gray-400 hover:text-white'
          }`}
          aria-pressed={locale === loc}
        >
          {t(loc)}
        </button>
      ))}
    </div>
  );
}
