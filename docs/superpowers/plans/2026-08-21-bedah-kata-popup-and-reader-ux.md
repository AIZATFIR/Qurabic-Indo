# Bedah Kata Pop-up Interaktif, Skala Font Mushaf, Tab Ayat Acak & UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menghadirkan pop-up bedah kata interaktif yang kaya dan mendalam saat membaca Al-Qur'an (dengan definisi kata resmi Kemenag RI, akar kata berjarak, audio per kata, bedah morfologi, dan konteks ayat), memperbesar skala font Arab (ukuran `lg` dan `xl` sangat jelas dan besar), menambahkan tab navigasi Ayat Acak yang mudah diakses, membenahi mode akun Firebase/Lokal, serta membersihkan seluruh emoji di UI.

**Architecture:** Menggunakan data live Word-by-Word (WBW) resmi dari Quran.com API v4 (Bahasa Indonesia) yang dipadukan dengan database etimologi lokal `ROOT_DATABASE`. Komponen modal direfaktor menjadi kartu interaktif responsif (desktop dialog & mobile sheet). Navigasi dan state akun diperjelas tanpa klaim koneksi palsu.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React Icons, Quran.com API v4, AlQuran Cloud API, Firebase Auth / LocalStorage Sync.

## Global Constraints
- Tidak menggunakan emoji teks apapun di antarmuka; ganti dengan Lucide SVG icons.
- Font Arab harus memiliki kontras skala ukuran yang tegas antar opsi `sm`, `md`, `lg`, dan `xl`.
- Pop-up bedah kata harus menampilkan makna kata yang sebenarnya (bukan teks placeholder "Potongan kata 1").
- Mode tamu/lokal harus berfungsi 100% tanpa error ketika API key Firebase belum diisi.

---

### Task 1: Integrasi Word-by-Word Live Data di Mode Baca & API Helper

**Files:**
- Modify: `app/baca/page.tsx`
- Modify: `lib/api/quran-corpus-api.ts`

- [ ] **Step 1: Update API helper untuk mengambil data Word-By-Word (WBW) per surah dari Quran.com API v4**
- [ ] **Step 2: Pasang fallback ke AlQuran Cloud bila terjadi timeout jaringan**
- [ ] **Step 3: Update `app/baca/page.tsx` untuk menggunakan data kata perkata riil (teks Arab Uthmani, arti Indonesia per kata, transliterasi, audio WBW, lokasi ayat)**
- [ ] **Step 4: Verifikasi di browser bahwa kata-kata dalam surah menampilkan transliterasi dan arti kata asli**

---

### Task 2: Refactor Modal Bedah Kata Interaktif (Flashcard-Style Word Breakdown)

**Files:**
- Modify: `components/WordEtymologyModal.tsx`
- Modify: `components/QuranWordInteractive.tsx`

- [ ] **Step 1: Update `WordEtymologyModal.tsx` dengan layout kartu flashcard yang luas dan mudah dibaca:**
  - Header: Judul modul dan tombol close.
  - Kartu kata utama: Teks Arab Uthmani besar, tombol audio per kata (`https://audio.qurancdn.com/wbw/...`), transliterasi Latin, dan arti kata Indonesia.
  - Bagian akar kata: Huruf akar berjarak (contoh: `ز ج ر` atau `ص ب ر`) beserta artinya.
  - Bagian morfologi: Tag Part of Speech (Isim / Fi'il / Harf), bentuk kata, dan frekuensi kemunculan.
  - Konteks ayat: Teks ayat lengkap dengan kata terpilih di-highlight warna aksen + terjemahan ayat utuh Kemenag RI.
  - Tombol aksi: "Buka Bedah Akar Kata Lengkap di Corpus".
- [ ] **Step 2: Update `QuranWordInteractive.tsx` agar meneruskan data lengkap (lokasi ayat, audio URL, teks ayat, terjemahan ayat, root) ke modal**
- [ ] **Step 3: Verifikasi klik pada kata di mode baca membuka modal kartu yang informatif dan audio berfungsi**

---

### Task 3: Peningkatan Skala Ukuran Font Arab Al-Qur'an

**Files:**
- Modify: `app/baca/page.tsx`

- [ ] **Step 1: Modifikasi kelas ukuran font Arab agar perbedaannya sangat terasa nyata:**
  - `sm`: `text-2xl sm:text-3xl leading-[2.2]`
  - `md`: `text-3xl sm:text-4xl leading-[2.4]`
  - `lg`: `text-5xl sm:text-6xl leading-[2.6]` (Sangat besar dan jelas)
  - `xl`: `text-6xl sm:text-7xl leading-[2.8]` (Ekstra besar untuk tadabbur mendalam)
- [ ] **Step 2: Pastikan padding dan line-height tidak bertabrakan saat ukuran `lg` atau `xl` diaktifkan**
- [ ] **Step 3: Verifikasi perubahan ukuran font di ketiga tema (Bookpaper, Terang, Malam)**

---

### Task 4: Akses & Tab Ayat Acak yang Menonjol

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `components/MobileBottomNav.tsx`
- Modify: `app/page.tsx`
- Modify: `app/baca/page.tsx`
- Modify: `app/ayat-random/page.tsx`

- [ ] **Step 1: Berikan styling tab aksen menonjol pada menu "Ayat Acak" di `Navbar.tsx` dan `MobileBottomNav.tsx`**
- [ ] **Step 2: Tambahkan tombol aksi cepat "Acak Ayat" di header reader `app/baca/page.tsx`**
- [ ] **Step 3: Tambahkan interactive widget/tab "Tadabbur Ayat Acak" di halaman beranda `app/page.tsx`**
- [ ] **Step 4: Update `app/ayat-random/page.tsx` agar kata-katanya juga interaktif dengan modal bedah kata**

---

### Task 5: Penanganan Status Firebase & Mode Akun Tamu

**Files:**
- Modify: `lib/firebase.ts`
- Modify: `lib/hooks/useAuth.ts`
- Modify: `components/GoogleAuthModal.tsx`

- [ ] **Step 1: Periksa ketersediaan Firebase config nyata via environment variables**
- [ ] **Step 2: Jika belum dikonfigurasi, tampilkan mode "Akun Tamu / Lokal" tanpa klaim palsu "Firebase Live"**
- [ ] **Step 3: Sediakan form nama profil kustom yang langsung aktif dan menyimpan data ke `localStorage`**
- [ ] **Step 4: Pastikan saat API keys dimasukkan di `.env.local`, Google OAuth langsung aktif secara mulus**

---

### Task 6: Pembersihan Seluruh Emoji di UI & Penggantian dengan Lucide Icons

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/morfologi/page.tsx`
- Modify: `app/favorit/page.tsx`
- Modify: `app/cari/page.tsx`
- Modify: `components/EtymologyCard.tsx`
- Modify: `components/DerivativesGrid.tsx`
- Modify: `components/RootCard.tsx`
- Modify: `components/OmniSearch.tsx`
- Modify: `components/GrammarLegendModal.tsx`

- [ ] **Step 1: Scan seluruh file `.tsx` dan ganti seluruh emoji teks dengan icon vector Lucide**
- [ ] **Step 2: Jalankan linter dan test suite (`npm run build` / `npm run lint`) untuk memastikan tidak ada error**

---

## Verification Plan

### Automated Verification
- `npm run build` untuk memastikan seluruh tipe TypeScript dan rute SSG/SSR valid tanpa error.

### Manual Verification
- Buka `/baca` dan klik beberapa kata pada Surah Al-Fatihah dan surah lainnya untuk memvalidasi pop-up bedah kata (akar kata, definisi, audio, konteks ayat).
- Coba toggle ukuran font `SM`, `MD`, `LG`, `XL` dan rasakan perbedaannya.
- Buka tab "Ayat Acak" dari Navbar, Bottom Nav, dan Beranda.
- Uji modal akun untuk memastikan login tamu/lokal bekerja mulus.
