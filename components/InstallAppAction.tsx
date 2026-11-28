'use client';

import { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Download, X } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type InstallAppActionProps = {
  variant?: 'icon' | 'row';
};

const playStoreUrl = (() => {
  const value = process.env.NEXT_PUBLIC_PLAY_STORE_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'play.google.com' && url.pathname.startsWith('/store/apps/details')
      ? url.toString()
      : null;
  } catch {
    return null;
  }
})();

export default function InstallAppAction({ variant = 'icon' }: InstallAppActionProps) {
  const { t } = useLanguage();
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [isInstalled, setIsInstalled] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    setIsInstalled(Capacitor.isNativePlatform() || standalone);
    const userAgent = window.navigator.userAgent;
    const isIPad = /Macintosh/.test(userAgent) && window.navigator.maxTouchPoints > 1;
    setPlatform(/iPad|iPhone|iPod/.test(userAgent) || isIPad ? 'ios' : /Android/i.test(userAgent) ? 'android' : 'other');

    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (instructionsOpen && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute('open', '');
      }
    } else if (!instructionsOpen && dialog.open) {
      dialog.close();
    }
  }, [instructionsOpen]);

  if (isInstalled) return null;

  const label = playStoreUrl
    ? t('Scarica da Google Play', 'Get it on Google Play')
    : t('Installa Qurabic', 'Install Qurabic');
  const actionClass = variant === 'row'
    ? 'flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-ink-primary hover:bg-canvas-soft focus-visible:outline-primary'
    : 'flex min-h-10 min-w-10 items-center justify-center rounded-full text-ink-primary hover:bg-canvas-soft focus-visible:outline-primary';

  const startInstall = async () => {
    if (!installPrompt) {
      setInstructionsOpen(true);
      return;
    }
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === 'accepted') setIsInstalled(true);
    } catch {
      setInstallPrompt(null);
      setInstructionsOpen(true);
    }
  };

  const action = playStoreUrl
    ? <a href={playStoreUrl} target="_blank" rel="noreferrer" className={actionClass} aria-label={label} title={label}>
        <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
        {variant === 'row' && <span>{label}</span>}
      </a>
    : <button type="button" onClick={() => void startInstall()} className={actionClass} aria-label={label} title={label}>
        <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
        {variant === 'row' && <span>{label}</span>}
      </button>;

  return <>
    {action}
    {!playStoreUrl && <dialog
      ref={dialogRef}
      aria-labelledby="install-qurabic-title"
      aria-describedby="install-qurabic-description"
      onClose={() => setInstructionsOpen(false)}
      className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-hairline bg-canvas-surface p-0 text-ink-primary shadow-hover backdrop:bg-black/30"
    >
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="install-qurabic-title" className="text-base font-semibold">{t('Pasang Qurabic', 'Install Qurabic')}</h2>
            <p id="install-qurabic-description" className="mt-1 text-sm text-ink-secondary">
              {t('Ini memasang versi web Qurabic ke layar utama; belum melalui Play Store.', 'This adds the Qurabic web app to your home screen; it is not a Play Store install.')}
            </p>
          </div>
          <button type="button" onClick={() => setInstructionsOpen(false)} className="rounded-lg p-1.5 text-ink-secondary hover:bg-canvas-soft" aria-label={t('Tutup', 'Close')}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm leading-6 text-ink-primary">
          {platform === 'ios'
            ? t('Di Safari, ketuk Bagikan lalu pilih Tambahkan ke Layar Utama.', 'In Safari, tap Share, then Add to Home Screen.')
            : platform === 'android'
              ? t('Buka menu browser ⋮ lalu pilih Instal aplikasi atau Tambahkan ke layar utama.', 'Open the browser menu ⋮, then choose Install app or Add to Home screen.')
              : t('Buka menu browser, lalu pilih Instal aplikasi atau Tambahkan ke layar utama.', 'Open the browser menu, then choose Install app or Add to Home screen.')}
        </p>
        <button type="button" onClick={() => setInstructionsOpen(false)} className="min-h-10 rounded-xl bg-canvas-soft px-4 text-sm font-medium text-ink-primary hover:bg-canvas-soft/80">
          {t('Mengerti', 'Got it')}
        </button>
      </div>
    </dialog>}
  </>;
}
