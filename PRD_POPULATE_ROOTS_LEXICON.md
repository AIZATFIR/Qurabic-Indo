# PRD: Populate Meaning Indo & Lexicon di Qurabic-Indo

## Problem Statement
Di dalam database akar kata (`lib/data/roots-database.json`), sebanyak 4,423 entri kata (words) masih berisi makna placeholder: `"meaningIndo": "Bentuk ..."` (default generic). Ini menyebabkan tampilan kartu kosakata kata perkata dan relasi akar kata di web Qurabic-Indo kosong / nyam-nyam tidak bermakna.

## Objectives
1. Buat script parser/filler berbasis Node.js/Python yang membaca data kata perkata Al-Quran Indonesia (misal dari dataset WBW yang sudah ada di `lib/data/wbw/*.json` atau referensi Kemenag/lexicon).
2. Petakan kata Arab / transliterasi ke makna bahasa Indonesia yang sahih dan kontekstual.
3. Update `lib/data/roots-database.json` sehingga field `meaningIndo` tidak lagi berisi placeholder `"Bentuk ..."`.
4. Jalankan verifikasi script dan pastikan struktur JSON tetap valid dan Next.js dapat membaca database tanpa error.
