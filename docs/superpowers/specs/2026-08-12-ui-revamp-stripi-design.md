# Design Spec: Qurabic-Indo UI Revamp (Stripi-Inspired Design System)

**Tanggal:** 2026-08-12  
**Status:** Revamp Specification  
**Inspirasi Design:** Stripi Financial-Infrastructure Design Language (Electric Indigo `#3904e7`, Deep Ink `#0d253d`, Soft Canvas `#f6f9fc`, Gradient Mesh Backdrop, Sohne/Inter Typography, Pill CTAs)

---

## 1. Perubahan Utama Visual & Aesthetic

Sistem UI berganti dari Dark Obsidian Emerald ke **Stripi-Inspired Atmospheric Light & Clean Infrastructure Shell**:

1. **Color Palette:**
   - **Primary:** Electric Indigo (`#3904e7` / `#533afd`)
   - **Primary Deep / Press:** `#4434d4` / `#2e2b8c`
   - **Primary Subdued Tag:** `#b9b9f9` (Subdued Indigo Background)
   - **Ink Primary (Teks Utama):** `#0d253d` (Deep Navy)
   - **Ink Secondary / Mute:** `#273951` / `#64748d`
   - **Canvas Soft (Background):** `#f6f9fc` (Clean Off-White)
   - **Canvas Surface (Kartu):** `#ffffff` (Pure White)
   - **Hairline Border:** `#e3e8ee`
   - **Hairline Input:** `#a8c3de`
   - **Accents:** Ruby `#ea2261`, Magenta `#f96bee`, Lemon `#9b6829`

2. **Tipografi & Formats:**
   - **Font Sans:** Inter / SF Pro Display / System UI
   - **Font Arab:** Amiri / Scheherazade New
   - **Font Features:** `font-feature-settings: "ss01" 1, "tnum" 1` secara global.
   - **Negative Tracking:** Letter-spacing negatif pada judul display (`letter-spacing: -1.4px` pada display-xxl, `-0.64px` pada display-lg).
   - **Tabular Figures (`tnum`):** Angka frekuensi kemunculan dan jumlah bentuk kata menggunakan angka tabular monospace yang rapi.

3. **Komponen & Elevasi:**
   - **Buttons:** Pill Buttons dengan `rounded-full` (`rounded-[9999px]`) dan `px-6 py-2`.
   - **Cards:** Serba putih (`bg-white`), hairline border (`border-[#e3e8ee]`), bayangan halus (`shadow-[0_4px_24px_-6px_rgba(0,55,112,0.08)]`), hover lift dengan transisi halus (`hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(0,55,112,0.12)]`).
   - **Gradient Mesh Backdrop:** Atmospheric backdrop di hero section dengan sentuhan pastel indigo & magenta.

---

## 2. Struktur Komponen yang Di-Rombak

- **`tailwind.config.js` & `app/globals.css`:** Mendaftarkan seluruh token warna, tipografi, font-feature `ss01` dan `tnum`, shadow-soft, serta utility class `.gradient-mesh`.
- **`components/Navbar.tsx`:** Menggunakan header putih bersih dengan batas hairline border, branding `Qurabic (Indo)`, link navigasi clean, tombol search, dan Sign In pill button.
- **`app/page.tsx`:** Implementasi persis `code.html` prototype:
  - Hero Header dengan Gradient Mesh & headline XXL `Qurabic`.
  - Search input kapsul dengan tombol indigo.
  - Section "Explore Root Words" dengan kartu akar kata (`ع ل م`, `ق و ل`, `ر ح م`, `ص ب ر`).
  - Section "Featured Lemmas" untuk bentuk kata populer (`كِتَاب`, `نُور`, `حَقّ`, `صَبْر`).
- **`components/RootCard.tsx`:** Kartu akar kata gaya Stripi (Tag Subdued Indigo, Occurrences Tabular, Teks Arab `ع ل م`, Etimologi Bahasa Indonesia, chevron right icon).
- **`components/EtymologyCard.tsx` & `components/DerivativesGrid.tsx` & `components/AyahConcordance.tsx`:** Penyesuaian skema warna & border ke gaya Stripi Canvas.
- **`app/akar/[slug]/page.tsx` & `app/morfologi/page.tsx`:** Halaman detail & katalog disesuaikan 100% dengan tema baru.

---

## 3. Verifikasi
- Re-run unit tests: `npm test`
- Build Next.js: `npm run build`
- Deploy update ke GitHub (`main`) & Vercel.
