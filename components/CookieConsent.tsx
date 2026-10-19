'use client';

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { syncAttributionWithConsent } from '@/lib/attribution';
import {
  CONSENT_CHANGE_EVENT,
  OPEN_CONSENT_EVENT,
  readStoredConsent,
  writeStoredConsent,
} from '@/lib/consent';

type View = 'banner' | 'settings' | 'hidden';

const choiceButton =
  'h-11 w-full rounded-xl border px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400';

const bannerListeners = new Set<() => void>();
let settingsOpen = false;

function emitBanner() {
  for (const listener of bannerListeners) listener();
}

function subscribeBanner(listener: () => void) {
  bannerListeners.add(listener);
  return () => bannerListeners.delete(listener);
}

function bannerSnapshot(): View {
  if (settingsOpen) return 'settings';
  return readStoredConsent() ? 'hidden' : 'banner';
}

function bannerServerSnapshot(): View {
  return 'banner';
}

function openSettingsPanel() {
  settingsOpen = true;
  document.documentElement.classList.add('consent-open');
  emitBanner();
}

export default function CookieConsent() {
  const t = useTranslations('consent');
  const rootRef = useRef<HTMLDivElement>(null);
  const view = useSyncExternalStore(subscribeBanner, bannerSnapshot, bannerServerSnapshot);
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);

  useEffect(() => {
    const onOpen = () => {
      const consent = readStoredConsent();
      setHasChoice(Boolean(consent));
      setAnalyticsOn(consent?.analytics === 'granted');
      openSettingsPanel();
    };
    const onChange = () => {
      settingsOpen = false;
      emitBanner();
    };
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
      window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const el = rootRef.current;
    if (view === 'hidden' || !el) {
      root.classList.remove('consent-unknown', 'consent-open');
      root.style.setProperty('--cookie-banner-offset', '0px');
      return;
    }
    if (view === 'banner') root.classList.add('consent-unknown');
    if (view === 'settings') root.classList.add('consent-open');

    const apply = () => {
      root.style.setProperty('--cookie-banner-offset', `${el.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [view]);

  const showSettings = () => {
    const consent = readStoredConsent();
    setHasChoice(Boolean(consent));
    setAnalyticsOn(consent?.analytics === 'granted');
    openSettingsPanel();
  };

  const choose = (analytics: 'granted' | 'denied') => {
    setAnalyticsOn(analytics === 'granted');
    writeStoredConsent(analytics);
    syncAttributionWithConsent();
  };

  if (view === 'hidden') return null;

  return (
    <div
      ref={rootRef}
      className="cookie-banner fixed inset-x-0 bottom-0 z-40 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4"
    >
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-consent-title"
        className="mx-auto max-h-[42vh] max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0f1e]/95 p-4 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:max-h-none sm:p-5"
      >
        {view === 'settings' ? (
          <Settings
            analyticsOn={analyticsOn}
            hasChoice={hasChoice}
            onAnalytics={setAnalyticsOn}
            onAccept={() => choose('granted')}
            onRefuse={() => choose('denied')}
            onSave={() => choose(analyticsOn ? 'granted' : 'denied')}
            onClose={hasChoice ? () => {
              settingsOpen = false;
              emitBanner();
            } : undefined}
          />
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 sm:max-w-xl">
              <h2 id="cookie-consent-title" className="text-sm font-bold text-white">
                {t('title')}
              </h2>
              <p className="mt-1 text-sm leading-snug text-gray-300">
                {t('body')}{' '}
                <Link href="/confidentialitate#cookie-uri" className="text-blue-300 underline underline-offset-2 hover:text-white">
                  {t('privacy')}
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:w-64">
              <Choices onAccept={() => choose('granted')} onRefuse={() => choose('denied')} />
              <button
                type="button"
                onClick={showSettings}
                className="text-sm font-medium text-gray-300 underline underline-offset-2 hover:text-white"
              >
                {t('settings')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Choices({ onAccept, onRefuse }: { onAccept: () => void; onRefuse: () => void }) {
  const t = useTranslations('consent');
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={onAccept}
        className={`${choiceButton} border-transparent bg-white text-black hover:bg-gray-200`}
      >
        {t('accept')}
      </button>
      <button
        type="button"
        onClick={onRefuse}
        className={`${choiceButton} border-white/25 bg-white/10 text-white hover:bg-white/15`}
      >
        {t('refuse')}
      </button>
    </div>
  );
}

function Settings({
  analyticsOn,
  hasChoice,
  onAnalytics,
  onAccept,
  onRefuse,
  onSave,
  onClose,
}: {
  analyticsOn: boolean;
  hasChoice: boolean;
  onAnalytics: (value: boolean) => void;
  onAccept: () => void;
  onRefuse: () => void;
  onSave: () => void;
  onClose?: () => void;
}) {
  const t = useTranslations('consent');
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h2 id="cookie-consent-title" className="text-sm font-bold text-white">
          {t('settings')}
        </h2>
        {onClose && (
          <button type="button" onClick={onClose} className="text-sm text-gray-400 hover:text-white">
            {t('close')}
          </button>
        )}
      </div>
      <Category
        title={t('necessary')}
        help={t('necessaryHelp')}
        checked
        locked
        status={t('alwaysOn')}
      />
      <Category
        title={t('analytics')}
        help={t('analyticsHelp')}
        checked={analyticsOn}
        onChange={onAnalytics}
      />
      <Choices onAccept={onAccept} onRefuse={onRefuse} />
      <button
        type="button"
        onClick={onSave}
        className="h-11 w-full rounded-xl border border-white/15 text-sm font-semibold text-gray-200 hover:bg-white/5"
      >
        {t('save')}
      </button>
      {!hasChoice && (
        <p className="text-xs text-gray-500">
          <Link href="/cookies" className="underline underline-offset-2 hover:text-gray-300">
            {t('policy')}
          </Link>
        </p>
      )}
    </div>
  );
}

function Category({
  title,
  help,
  checked,
  locked,
  status,
  onChange,
}: {
  title: string;
  help: string;
  checked: boolean;
  locked?: boolean;
  status?: string;
  onChange?: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <p className="text-xs leading-snug text-gray-400">{help}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={locked || undefined}
        disabled={locked}
        onClick={() => onChange?.(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-white/15'
        } ${locked ? 'cursor-not-allowed opacity-80' : ''}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
        <span className="sr-only">{status ?? title}</span>
      </button>
    </div>
  );
}
