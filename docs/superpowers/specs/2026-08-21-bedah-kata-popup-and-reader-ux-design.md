# Design Spec: Bedah Kata Pop-up Interaktif, Ukuran Font Mushaf, Tab Ayat Acak, dan UI Modern Bebas Emoji

**Tanggal:** 2026-08-21  
**Topik:** Qurabic-Indo Quran Reader & Interactive Word Breakdown Pop-up

---

## 1. Ringkasan & Tujuan

Pengembangan ini bertujuan untuk menghadirkan pengalaman belajar bahasa Al-Qur'an yang mendalam, intuitif, dan nyaman dibaca:
1. **Bedah Kata Interaktif (Word Breakdown Pop-up)**: Kartu popup besar dan jelas saat mengklik kata manapun di mode baca maupun ayat acak, memuat definisi bahasa Indonesia resmi (Kemenag RI), akar kata (root) berjarak, transliterasi, morfologi singkat, audio pelafalan per-kata, dan konteks ayat.
2. **Perbedaan Ukuran Font Mushaf yang Nyata**: Pilihan ukuran teks Arab (`sm`, `md`, `lg`, `xl`) dengan kontras skala yang sangat terasa, di mana opsi `lg` dan `xl` benar-benar besar dan nyaman untuk tadabbur tanpa mata lelah.
3. **Akses Tab Ayat Acak yang Menonjol**: Penempatan tab navigasi "Ayat Acak" yang jelas di header desktop, navigasi mobile, serta widget interaktif di halaman beranda.
4. **Pengelolaan Firebase & Status Akun yang Bersih**: Integrasi Firebase yang fleksibel (siap aktif via `.env.local`), dengan penanganan ramah bagi mode akun lokal/tamu tanpa klaim palsu status koneksi.
5. **Estetika UI Bebas Emoji**: Seluruh elemen antarmuka menggunakan icon vektor modern dari Lucide React dan tipografi editorial yang bersih.

---

## 2. Rincian Fitur & Desain Komponen

### A. Word Detail Pop-up (Bedah Kata Interaktif)
- **Komponen**: `components/WordEtymologyModal.tsx` & `components/QuranWordInteractive.tsx`
- **Data Source**: Live Word-by-Word (WBW) data dari `https://api.quran.com/api/v4` (Bahasa Indonesia) + `ROOT_DATABASE`.
- **Struktur Kartu**:
  1. **Header**: Judul modul "Bedah Kata Al-Qur'an", tombol tutup (`X`), status part of speech.
  2. **Banner Kata Utama**:
     - Teks Arab Uthmani berukuran besar dan jelas (font Arabic).
     - Tombol audio pelafalan per kata (dari Quran CDN `https://audio.qurancdn.com/wbw/...`).
     - Transliterasi Latin presisi (contoh: *zajratun*).
     - Makna / terjemahan kata per kata Bahasa Indonesia yang akurat.
  3. **Akar Kata & Morfologi Singkat**:
     - Huruf akar kata berjarak (contoh: `ز ج ر` / `ص ب ر`).
     - Jenis kata: *Isim* (Kata Benda), *Fi'il* (Kata Kerja: Madhi/Mudhari'/Amr), atau *Harf* (Partikel).
     - Wawasan etimologi klasik dari kamus mu'jam.
  4. **Konteks Ayat (Ayah In Context)**:
     - Potongan teks ayat lengkap tempat kata tersebut berada.
     - Kata yang sedang dibedah diberikan penyorotan (highlight) warna khusus.
     - Terjemahan ayat utuh (Kemenag RI).
  5. **Tombol Navigasi Lanjutan**:
     - "Bedah Akar Kata Lengkap di Corpus" untuk membuka katalog etimologi mendalam.

### B. Skala Ukuran Font Arab Al-Qur'an
- **Komponen**: `app/baca/page.tsx`
- **Skala Font**:
  - `sm` (Kecil): `text-2xl sm:text-3xl leading-[2.2]`
  - `md` (Sedang): `text-3xl sm:text-4xl leading-[2.4]`
  - `lg` (Besar): `text-5xl sm:text-6xl leading-[2.6]` (Sangat besar dan jelas)
  - `xl` (Ekstra Besar): `text-6xl sm:text-7xl leading-[2.8]` (Maksimal untuk display besar/bacaan fokus)

### C. Tab & Akses Ayat Acak
- **Desktop Navbar (`components/Navbar.tsx`)**:
  - Tab "Ayat Acak" dengan visual aksen khusus (`Sparkles` icon, styling pill tegas).
- **Mobile Bottom Nav (`components/MobileBottomNav.tsx`)**:
  - Tombol menu "Ayat Acak" di bilah navigasi bawah ponsel.
- **Beranda (`app/page.tsx`)**:
  - Section / Widget tab "Tadabbur Ayat Acak" yang bisa diacak langsung dari halaman depan.
- **Halaman Baca (`app/baca/page.tsx`)**:
  - Tombol aksi cepat untuk melompat ke ayat acak langsung dari header mushaf.

### D. Penanganan Firebase & Profil Pengguna
- **Komponen**: `lib/firebase.ts`, `lib/hooks/useAuth.ts`, `components/GoogleAuthModal.tsx`
- **Behavior**:
  - Jika `NEXT_PUBLIC_FIREBASE_API_KEY` valid diatur di `.env.local`, Firebase Auth & Google Sign-In aktif.
  - Jika belum diisi, modal menampilkan "Mode Akun Lokal / Tamu" yang transparan, memungkinkan pengguna mengetik nama/profil tanpa error, dan data bookmark tersimpan aman di `localStorage`.

### E. Pembersihan Emoji
- Seluruh file `.tsx` dibersihkan dari emoji teks, digantikan oleh icon Lucide SVG berstandar modern.

---

## 3. Rencana Verifikasi
- Pengujian interaksi klik kata pada Surah Al-Fatihah, Al-Baqarah, dan surah lainnya di `/baca`.
- Verifikasi pemutaran audio per-kata dan highlight konteks ayat pada kartu pop-up.
- Verifikasi pergantian ukuran font Arab dari `sm` hingga `xl` di mode Bookpaper, Terang, dan Malam.
- Pengujian navigasi Ayat Acak dari Navbar, Bottom Nav, dan Beranda.
- Verifikasi dialog masuk akun tanpa pesan error saat environment key kosong.
