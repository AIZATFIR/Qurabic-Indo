# Design Spec: Qurabic-Indo Full Quranic Arabic Corpus & Phonetic Search Engine

**Tanggal:** 2026-08-12  
**Status:** Feature Parity Update  
**Tujuan:** Menyamakan kelengkapan fitur dengan web resmi **Quranic Arabic Corpus (corpus.quran.com)** versi Bahasa Indonesia, serta menyempurnakan mesin pencari phonetics (misal: "sholat", "solat", "salat", "sholat", "taqwa", "zakat", "tobat").

---

## 1. Peningkatan Utama Mesin Pencari (Phonetic & Root Normalizer)

Pencarian Bahasa Indonesia memiliki variasi ejaan fonetik yang sangat beragam. Mesin pencari di `lib/search/root-search.ts` diperluas dengan **Phonetic Normalizer**:

| Input User | Pemetaan Normalisasi | Target Akar Kata |
|---|---|---|
| `sholat`, `solat`, `salat`, `shalat`, `shalah`, `shalaat` | `salat` | `ص-ل-و` (s-l-w) |
| `zakat`, `zakah`, `jakat` | `zakat` | `ز-ك-و` (z-k-w) |
| `taqwa`, `takwa`, `taqwaa` | `taqwa` | `و-ق-ي` (w-q-y) |
| `dzikir`, `dhikr`, `zikir` | `zikir` | `ذ-ك-ر` (z-k-r) |
| `syukur`, `shukur`, `sukr` | `syukur` | `ش-ك-ر` (s-k-r) |
| `syirik`, `shirk`, `sirk` | `syirik` | `ش-ر-ك` (s-r-k) |
| `tobat`, `taubah`, `taubat` | `taubat` | `ت-و-ب` (t-w-b) |
| `shaleh`, `sholeh`, `saleh`, `salih` | `saleh` | `ص-ل-ح` (s-l-h) |
| `quran`, `koran`, `qur'an` | `quran` | `ق-ر-ا` (q-r-a) |

---

## 2. Fitur Baru Quranic Arabic Corpus

1. **Word-by-Word Interlinear Analysis (Interlinear Per Kata):**
   - Setiap ayat pada Ayah Concordance dilengkapi breakdown per kata:
     - Teks Arab per kata (dengan harakat)
     - Transliterasi Latin per kata
     - Tag Morfologi Gramatikal (Isim / Fi'il / Haraf / Form I-X / Muzakkar / Muannats / Marfu' / Mansub / Majrur)
     - Terjemahan Bahasa Indonesia per kata.
2. **Treebank & Grammatical Syntax Tag Visualizer:**
   - Visualisasi POS (Part of Speech) dengan badge warna khusus ala Quranic Arabic Corpus:
     - **N (Isim / Noun):** Biru / Indigo Subdued
     - **V (Fi'il / Verb):** Hijau Emerald
     - **P (Haraf / Particle):** Amber / Orange
     - **PRON (Dhamir / Pronoun):** Ungu / Purple
3. **Database Akar Kata Lengkap Tambahan:**
   - Mendaftarkan akar kata utama termasuk:
     - `ص-ل-و` (Salat / Sholat / Doa / Keagungan)
     - `ز-ك-و` (Zakat / Tumbuh / Suci)
     - `و-ق-ي` (Taqwa / Takwa / Perlindungan)
     - `ش-ر-ك` (Syirik / Sekutu)
     - `ح-م-د` (Hamd / Pujian / Alhamdulillah)
     - `ص-ل-ح` (Saleh / Shalihat / Kebaikan)
     - `ش-ه-د` (Syahadat / Saksi / Persaksian)
     - `ص-ر-ط` (Sirath / Jalan Lurus)

---

## 3. Komponen Baru
- `components/WordByWordViewer.tsx`: Komponen interlinear breakdown perkata per ayat.
- `components/GrammarBadge.tsx`: Tag gramatikal sharaf & nahwu (N/V/P/PRON/Form I-X).
- Enhanced `lib/search/root-search.ts` dengan aturan Fonetik Indonesia.

---

## 4. Verification & Testing
- Unit Test Fonetik: `searchRoots('sholat')`, `searchRoots('solat')`, `searchRoots('takwa')`, `searchRoots('zakat')`.
- Build SSG Next.js validation (`npm run build`).
