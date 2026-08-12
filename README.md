# 📖 Qurabic-Indo Corpus

**Qurabic-Indo** adalah platform web modern berbahasa Indonesia untuk eksplorasi **Morfologi & Database Akar Kata Al-Qur'an (Quranic Arabic Corpus)**. Platform ini menyajikan penjelasan etimologi klasik, pencarian multi-bahasa instan, derivasi Kata Kerja (Fi'il) & Kata Benda (Isim), serta penelusuran ayat Al-Qur'an (Ayah Concordance).

---

## ✨ Fitur Utama

- 🔍 **Multi-Language Omni-Search Engine:**
  - Search by Arabic root: `ص-ب-ر` / `صبر`
  - Search by Latin transliteration: `sabar`, `sabara`, `kataba`, `k-t-b`
  - Search by Indonesian keywords: `batu` (etimologi sobaro), `tulis`, `menahan`, `kesabaran`
  - Search by English keywords: `patience`, `write`, `mercy`
- 💡 **Wawasan Etimologi Klasik (Lisan al-Arab & Mu'jam):**
  - Penjelasan akar kata secara mendalam (misal: *sobaro* = batu keras / tanaman pahit $\rightarrow$ ketabahan jiwa layaknya batu kokoh).
- 📊 **Klasifikasi Derivasi Sharaf (Fi'il & Isim):**
  - Kata Kerja: Form I, Form III, Form VIII, Fi'il Madhi, Mudhari', Amr.
  - Kata Benda: Masdar, Isim Fa'il, Isim Mubalaghah, Bentuk Jamak.
- 📖 **Ayah Concordance Explorer:**
  - Tampilan teks Al-Qur'an berharakat presisi, penanda kata turunan (*highlight*), dan terjemahan resmi Kemenag RI.
- 🎨 **Modern Emerald Obsidian Glassmorphism UI:**
  - Desain gelap (*Dark Mode*), cepat, responsif di mobile & desktop, serta didukung keyboard shortcut (`Ctrl + K` / `Cmd + K`).

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Glassmorphism UI
- **Icons:** Lucide React
- **Typography:** Amiri (Google Font Arabic) & Plus Jakarta Sans

---

## 🚀 Jalankan Secara Lokal

```bash
# Clone repository
git clone https://github.com/aizatfir/Qurabic-Indo.git
cd Qurabic-Indo

# Install dependencies
npm install

# Run unit tests
npm test

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 🌐 Deploy to Vercel

```bash
npm run build
```

Project ini siap di-deploy secara instan ke **Vercel** (`Qurabic Indo Corpus`).

---

## 📝 Lisensi

MIT License &copy; 2026 Qurabic-Indo
