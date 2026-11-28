'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Database, ExternalLink, LockKeyhole, Network } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { hasAdPrivacyOptions, isNativeApp, showAdPrivacyOptions } from '@/lib/ads/admob';

export default function PrivacyPolicyContent() {
  const { language, t } = useLanguage();
  const [adPrivacyOptionsAvailable, setAdPrivacyOptionsAvailable] = useState(false);
  const [adPrivacyMessage, setAdPrivacyMessage] = useState('');

  useEffect(() => {
    if (!isNativeApp()) return;
    let active = true;
    void hasAdPrivacyOptions().then((available) => {
      if (active) setAdPrivacyOptionsAvailable(available);
    });
    return () => { active = false; };
  }, []);

  const sections = language === 'en'
    ? [
        {
          title: 'Information stored on your device',
          body: 'Qurabic stores reading preferences, language and theme choices, saved roots, recent searches, and audio settings in your browser or the app’s private storage. When you choose to download the offline pack, Quran text and the Indonesian Kemenag RI and English Saheeh International translations are also stored on your device. In a browser, saved audio stays in browser storage. On Android, downloaded recitations are kept in Qurabic’s private app storage and are removed when the app is uninstalled. Qurabic does not sync this local data to a Qurabic account.',
        },
        {
          title: 'Requests to Qurabic',
          body: 'When you search verse text, an Arabic root, word, or particle, the search term is sent to a Qurabic API to find matching content. Search terms are included in the request URL. The app is hosted by Vercel, which processes the request and standard technical metadata under its own policies. Qurabic does not provide an account service or maintain a separate server-side search history.',
        },
        {
          title: 'External services',
          body: 'When you search English verse translations, Qurabic forwards the search phrase to Quran Foundation Search API, which returns matching verses; the server then requests their Saheeh International translation through Quran Foundation Content API resource 20. Indonesian verse search uses Qurabic’s local corpus. When you view a root entry, word study, or random verse, Qurabic’s server requests contextual word-by-word glosses from Quran.com API v4 for the displayed verse and word coordinates. In English mode, visible verse keys are also sent in small batches to Qurabic’s server to request Saheeh International translation resource 20 from Quran.com. These requests contain Quran locations, not your account details or search phrase. When you open Indonesian tafsir, Qurabic’s server requests the selected verse from a pinned public quran-json archive on GitHub; that request contains the surah and ayah numbers. When you download or update the offline pack, Qurabic’s server requests Quran text, translations, and Al-Afasy recitation metadata through Quran Foundation Content Sync. The request contains resource and sync information, not your email, profile, or verse-search phrase. Production Qur’an recitation is requested from Quran Foundation audio hosts. Spoken translation audio is disabled in public builds until its recording and distribution rights are verified. Opening a study video loads an embedded YouTube player. On Android, when production AdMob IDs are configured, the Google UMP SDK checks consent information on app launch. If consent is required, its form appears before an eligible ad request; if ads are not allowed, Qurabic does not request them. Interstitials may appear after a completed quiz or when an eligible non-reading dialog closes. Qurabic blocks ads throughout Quran reading, word/root study, morphology, dictionary, verse search, random verse, and reflection routes. AdMob initializes only after consent allows ads and an ad is requested. Google may process device, usage, consent, and advertising data under its own policies. Other listed providers may process connection, device, or usage data under their own policies.',
        },
        {
          title: 'Your choices and deletion',
          body: 'You can clear saved searches in the search window and remove Al-Afasy offline audio by verse or surah from the audio player settings. You can also remove local preferences and all saved app data by clearing Qurabic’s site data in your browser or the app’s storage in Android settings. To ask a question about this policy, contact the project maintainer through the repository link below; please do not post private information in a public issue.',
        },
      ]
    : [
        {
          title: 'Informasi yang disimpan di perangkat',
          body: 'Qurabic menyimpan preferensi membaca, pilihan bahasa dan tema, akar kata tersimpan, pencarian terakhir, serta pengaturan audio di browser atau penyimpanan privat aplikasi. Jika Anda memilih mengunduh paket offline, teks Al-Qur’an beserta terjemahan Kemenag RI dan Saheeh International juga disimpan di perangkat. Di browser, audio tersimpan di penyimpanan browser. Di Android, rekaman yang diunduh disimpan di penyimpanan privat Qurabic dan terhapus saat aplikasi di-uninstall. Data lokal ini tidak disinkronkan ke akun Qurabic.',
        },
        {
          title: 'Permintaan ke Qurabic',
          body: 'Saat mencari teks ayat, akar kata, kata Arab, atau partikel, istilah pencarian dikirim ke API Qurabic untuk menemukan konten yang cocok. Istilah pencarian tercantum di URL permintaan. Aplikasi di-host oleh Vercel, yang memproses permintaan dan metadata teknis standar sesuai kebijakannya. Qurabic tidak menyediakan akun atau membuat riwayat pencarian server tersendiri.',
        },
        {
          title: 'Layanan pihak ketiga',
          body: 'Saat mencari terjemahan ayat berbahasa Inggris, Qurabic meneruskan frasa pencarian ke Quran Foundation Search API; server lalu meminta terjemahan Saheeh International melalui Content API resource 20. Pencarian ayat berbahasa Indonesia memakai korpus lokal Qurabic. Saat membuka entri akar, bedah kata, atau ayat acak, server Qurabic meminta glos kontekstual per kata dari Quran.com API v4 berdasarkan koordinat ayat dan kata yang ditampilkan. Dalam mode English, kunci ayat yang terlihat juga dikirim secara berkelompok ke server Qurabic untuk meminta terjemahan Saheeh International resource 20 dari Quran.com. Permintaan ini berisi lokasi ayat, bukan detail akun atau frasa pencarian Anda. Saat membuka tafsir Indonesia, server Qurabic meminta teks ayat terpilih dari arsip publik quran-json yang dipatok versinya di GitHub; permintaan tersebut hanya memuat nomor surah dan ayat. Saat mengunduh atau memperbarui paket offline, server Qurabic meminta teks Al-Qur’an, terjemahan, dan metadata tilawah Al-Afasy melalui Quran Foundation Content Sync. Permintaan ini berisi informasi resource dan sinkronisasi, bukan email, profil, atau frasa pencarian ayat Anda. Audio tilawah Al-Qur’an pada build production diminta dari host audio Quran Foundation. Audio terjemahan lisan dinonaktifkan di build publik sampai rekaman dan hak distribusinya terverifikasi. Membuka video kajian akan memuat pemutar YouTube. Di Android, jika ID AdMob produksi disetel, Google UMP memeriksa status persetujuan iklan saat aplikasi dibuka. Jika persetujuan diperlukan, formulirnya muncul sebelum iklan yang memenuhi syarat diminta; jika iklan tidak diizinkan, Qurabic tidak meminta iklan. Iklan interstitial dapat muncul setelah kuis selesai atau saat dialog non-baca yang memenuhi syarat ditutup. Qurabic memblokir iklan di seluruh rute baca Al-Qur’an, studi kata/akar, morfologi, kamus, pencarian ayat, ayat acak, dan refleksi. AdMob hanya diinisialisasi setelah persetujuan mengizinkan iklan dan iklan diminta. Google dapat memproses data perangkat, penggunaan, persetujuan, dan iklan sesuai kebijakannya. Penyedia lain yang disebutkan juga dapat memproses data koneksi, perangkat, atau penggunaan sesuai kebijakan mereka.',
        },
        {
          title: 'Pilihan dan penghapusan data',
          body: 'Anda dapat menghapus pencarian tersimpan dari jendela pencarian serta menghapus tilawah offline Al-Afasy per ayat atau per surah melalui pengaturan pemutar audio. Preferensi lokal dan seluruh data tersimpan juga dapat dihapus dengan membersihkan data situs Qurabic di browser atau penyimpanan aplikasi di pengaturan Android. Untuk bertanya tentang kebijakan ini, hubungi pengelola melalui tautan repositori di bawah; jangan kirim informasi pribadi melalui issue publik.',
        },
      ];

  const providers = [
    { name: t('Vercel · hosting', 'Vercel · hosting'), href: 'https://vercel.com/legal/privacy-policy' },
    { name: t('Quran Foundation · ketentuan developer', 'Quran Foundation · Developer Terms'), href: 'https://api-docs.quran.com/legal/developer-terms/' },
    { name: t('Quran.com / Quran Foundation · privasi', 'Quran.com / Quran Foundation · privacy'), href: 'https://quran.com/privacy' },
    { name: t('GitHub · kebijakan privasi', 'GitHub · privacy statement'), href: 'https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement' },
    { name: t('Google · AdMob dan YouTube', 'Google · AdMob and YouTube'), href: 'https://policies.google.com/privacy' },
    { name: t('Kontak · repositori Qurabic', 'Contact · Qurabic repository'), href: 'https://github.com/AIZATFIR/Qurabic-Indo/issues' },
  ];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-8 font-sans sm:px-8 sm:pt-12">
      <Link href="/" className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-2 text-sm text-ink-secondary hover:bg-canvas-soft hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t('Kembali ke beranda', 'Back to home')}
      </Link>

      <header className="border-b border-hairline pb-6">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          {t('Informasi privasi', 'Privacy information')}
        </p>
        <h1 className="text-3xl font-semibold text-ink-primary sm:text-4xl">{t('Kebijakan Privasi', 'Privacy Policy')}</h1>
        <p className="mt-3 text-sm text-ink-secondary">
          {t('Terakhir diperbarui 28 November 2026', 'Last updated 28 November 2026')}
        </p>
      </header>

      <section className="mt-7 rounded-[var(--radius-surface)] border border-hairline bg-canvas-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Database className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold text-ink-primary">{sections[0].title}</h2>
            <p className="mt-2 text-base leading-relaxed text-ink-secondary">{sections[0].body}</p>
          </div>
        </div>
      </section>

      <div className="divide-y divide-hairline">
        {sections.slice(1).map((section, index) => (
          <section key={section.title} className="py-6">
            <div className="flex items-start gap-3">
              {index === 0
                ? <Network className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                : <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
              <div>
                <h2 className="text-lg font-semibold text-ink-primary">{section.title}</h2>
                <p className="mt-2 text-base leading-relaxed text-ink-secondary">{section.body}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <nav aria-label={t('Kebijakan layanan terkait', 'Related service policies')} className="border-t border-hairline pt-5">
        <h2 className="mb-3 text-base font-semibold text-ink-primary">{t('Kebijakan layanan terkait dan kontak', 'Related service policies and contact')}</h2>
        <ul className="space-y-2">
          {providers.map((provider) => (
            <li key={provider.href}>
              <a href={provider.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                {provider.name}<ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {adPrivacyOptionsAvailable && (
        <section className="mt-6 border-t border-hairline pt-5">
          <h2 className="text-base font-semibold text-ink-primary">
            {t('Pilihan privasi iklan', 'Ad privacy choices')}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-ink-secondary">
            {t('Ubah pilihan persetujuan iklan untuk aplikasi Android ini.', 'Update your ad consent choices for this Android app.')}
          </p>
          <button
            type="button"
            onClick={() => {
              setAdPrivacyMessage('');
              void showAdPrivacyOptions().then((opened) => {
                if (!opened) setAdPrivacyMessage(t('Pilihan privasi iklan tidak dapat dibuka. Coba lagi nanti.', 'Ad privacy options could not be opened. Try again later.'));
              });
            }}
            className="mt-2 inline-flex min-h-11 items-center text-base text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {t('Kelola pilihan iklan', 'Manage ad choices')}
          </button>
          {adPrivacyMessage && <p role="status" className="text-sm text-ink-secondary">{adPrivacyMessage}</p>}
        </section>
      )}
    </main>
  );
}
