# Draf Google Play Data safety

Status: draf berbasis inspeksi kode, belum untuk dikirim. Google Play meminta deklarasi mencakup data yang dikirim oleh aplikasi, WebView yang dikendalikan aplikasi, serta SDK pihak ketiga. Cocokkan kembali dengan APK release dan traffic perangkat sebelum mengisi Play Console.

## Pemeriksaan artefak lokal

Pada 28 November 2026, APK release unsigned dibangun tanpa ID AdMob. DEX-nya tidak memuat paket Firebase, Analytics, Crashlytics, Google Ads, atau UMP; manifest-nya hanya meminta internet, status jaringan, dan wake lock. Pemeriksaan kode aktif pada `app`, `components`, `lib/api`, `lib/audio`, dan `lib/offline` juga tidak menemukan integrasi analytics/telemetry. Temuan ini hanya mencakup artefak lokal: aplikasi memuat UI dari Vercel melalui WebView, jadi bundle production, permintaan jaringan nyata, penyimpanan log Vercel, dan peran pemroses penyedia tetap harus diperiksa sebelum formulir Data safety diajukan.

## Alur yang terlihat di kode

| Alur | Data yang meninggalkan perangkat | Penerima / tujuan | Bukti dan batas |
|---|---|---|---|
| Pencarian ayat, kata, akar, dan partikel | Teks pencarian; pencarian English juga diteruskan ke Quran Foundation Search API | Qurabic/Vercel untuk pencarian lokal server; Quran Foundation untuk pencarian English | Kebijakan privasi menjelaskan isi permintaan. Log retensi Vercel belum diaudit. |
| Baca surah, buka studi kata, akar, ayat acak, atau English reader | Surah/bahasa yang dipilih; koordinat ayat/kata; permintaan glos dan terjemahan | Qurabic/Vercel lalu Quran.com; jika fallback terjemahan Indonesia aktif, eQuran.id, Gading Quran API, atau AlQuran Cloud | Hanya saat pengguna membuka/memuat data; belum diuji melalui traffic perangkat. |
| Buka tafsir Indonesia | Nomor surah dan ayat | Server Qurabic/Vercel lalu mirror GitHub yang dipatok | Hak teks sumber masih perlu klarifikasi; ini bukan alur akun. |
| Sinkronkan paket offline | Resource dan token sinkronisasi | Qurabic/Vercel lalu Quran Foundation Content Sync | Kredensial production belum diverifikasi; isi paket tidak memuat data akun. |
| Putar tilawah pada build production | Permintaan file audio dari perangkat | Host audio resmi Quran Foundation | Katalog resmi per qari; jalur offline Al-Afasy disimpan di storage privat aplikasi. Handsfree terjemahan lisan dinonaktifkan di production sampai haknya diverifikasi. |
| Tampilkan iklan Android | Consent/device/ad request metadata yang dikelola SDK | Google AdMob/UMP | Permintaan iklan hanya setelah status UMP mengizinkan. Konfigurasi pesan UMP dan traffic produksi belum diuji. |
| Video kajian | Permintaan pemutar YouTube | Google/YouTube | Hanya ketika pengguna membuka video. |

## Kandidat pengisian Play Console

- **Data dikumpulkan:** jangan pilih “tidak ada” sebelum inspeksi APK dan pengujian traffic. Pencarian dan koordinat ayat memang keluar dari perangkat. Google menyatakan transmisi oleh WebView/SDK juga perlu dinilai, termasuk pemrosesan sementara.
- **Data dibagikan:** belum dapat diputuskan dari repo saja. Quran.com, Quran Foundation, hosting, penyedia audio/video, serta AdMob menerima permintaan layanan. Klasifikasi “shared” bergantung pada definisi Google dan peran pemroses masing-masing.
- **Data tersimpan lokal:** preferensi, riwayat pencarian lokal, akar tersimpan, paket teks/terjemahan, dan audio yang dipilih pengguna berada di storage browser atau privat aplikasi. Ini bukan bukti bahwa data tersebut dikirim ke server.
- **Akun:** tidak ada route atau komponen aplikasi yang memasang `GoogleAuthModal`; modul Firebase Auth hanya dipakai oleh modal yang saat ini tidak dirujuk dari aplikasi. Login dan sinkronisasi akun tidak tersedia pada alur produk aktif. Dependency Firebase tetap ada di manifest proyek; pastikan bundler mengeluarkannya dari artefak release sebelum menyatakan data akun tidak dikumpulkan.
- **Keamanan:** endpoint yang diperiksa memakai HTTPS. Jangan centang deklarasi enkripsi menyeluruh sampai semua host produksi, redirect, dan traffic SDK diuji.
- **Penghapusan akun/data:** tidak ada akun Qurabic untuk dihapus. Sediakan instruksi hapus data lokal melalui pengaturan Android/browser; konfirmasi pertanyaan Data deletion Play Console berdasarkan jawaban akun dan data aktual.

## Sebelum mengirim formulir

1. Bangun APK/AAB release yang sama dengan artifact yang akan diunggah; inventarisasi semua SDK dan manifest merger.
2. Rekam traffic saat pencarian, buka root/tafsir, sinkron offline, audio, YouTube, consent ditolak/diterima, dan iklan diminta.
3. Pastikan kebijakan retensi/log Vercel dan perjanjian penyedia; jangan menyimpulkan “ephemeral” hanya dari tidak adanya tabel database.
4. Lengkapi kategori dan tujuan data menurut formulir Play Console terkini, lalu cocokkan ringkasannya dengan kebijakan privasi.

Rujukan: [Google Play Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en), [UMP Android](https://developers.google.com/admob/android/privacy), kebijakan privasi Qurabic di `app/privacy/PrivacyPolicyContent.tsx`.
