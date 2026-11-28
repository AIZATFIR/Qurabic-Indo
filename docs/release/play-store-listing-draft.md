# Play Store listing draft

Draft for localized English (United States) and Indonesian listings. Google Play currently allows 30 characters for the title, 80 for the short description, and 4,000 for the full description. Keep separate screenshots for each language when the images contain text. See Google's [listing setup](https://support.google.com/googleplay/android-developer/answer/9859152) and [localization guidance](https://support.google.com/googleplay/android-developer/answer/9844778).

## Submission status: hold

Checked 29 November 2026: production `GET /api/qf/recitations?language=en` returns `503 EDGE_RATE_LIMIT_REQUIRED`. The offline reader also says sync is not enabled; the production sync route is gated by the same missing edge-rate-limit configuration. The audio and offline claims below describe intended behavior after release gates pass. Do not submit this listing until the Quran Foundation catalog and content sync work in production and audio/offline behavior is verified in a signed Android build.

## English (United States)

**Title**

Qurabic — Quran & Arabic

**Short description**

Read the Quran, listen to recitation, and explore word meanings and roots.

**Full description**

Read the Quran with room to pause, listen, and explore its Arabic.

Qurabic brings verse-by-verse reading together with human recitation, bilingual translations, and word study. Choose a paper tone and text size, or use Focus mode to keep attention on the ayah.

Explore a word in context:

• See Quran.com word-by-word glosses when connected.
• Follow Quranic roots, forms, and occurrences across the corpus.
• Open cited passages from Edward William Lane’s Arabic-English Lexicon when indexed.
• See Quranic Arabic Corpus morphology and grammar labels with their source identified.

Listen and review:

• Choose a human qari recording.
• Continue to the next ayah or repeat a verse while listening.
• Save eligible Al-Afasy recitation audio to app storage when Quran Foundation provides the approved recording.

Read offline:

• After connecting and completing the download, save Quran text and Indonesian Kemenag RI and English Saheeh International verse translations for all 114 surahs.
• Word glosses, root lookups, and other online sources are not included in that text pack.

Some particle explanations are AI-assisted study notes. They are labeled as unreviewed and are not presented as dictionary quotations or religious rulings. Source availability varies by entry; a missing source is not replaced with an invented citation.

Qurabic is a reading and language-learning aid. For religious guidance, consult qualified teachers and the cited primary sources.

## Bahasa Indonesia

**Judul**

Qurabic — Al-Qur’an & Arab

**Deskripsi singkat**

Baca Al-Qur’an, dengarkan tilawah, dan telusuri makna kata serta akarnya.

**Deskripsi lengkap**

Baca Al-Qur’an dengan ruang untuk berhenti, menyimak, dan mengenali bahasa Arabnya.

Qurabic memadukan bacaan per ayat, tilawah manusia, terjemahan Indonesia dan Inggris, serta kajian kata. Pilih warna kertas dan ukuran teks, atau gunakan Mode Fokus agar perhatian tetap pada ayat.

Telusuri kata dalam konteks:

• Lihat glos kata per kata dari Quran.com saat tersambung ke internet.
• Ikuti akar, bentuk kata, dan kemunculannya dalam korpus.
• Buka kutipan Edward William Lane, *An Arabic-English Lexicon*, jika tersedia untuk entri tersebut.
• Lihat label morfologi dan tata bahasa Quranic Arabic Corpus dengan sumbernya.

Dengarkan dan ulangi:

• Pilih rekaman qari manusia.
• Lanjut otomatis ke ayat berikutnya atau ulangi ayat saat menyimak.
• Simpan audio tilawah Al-Afasy yang memenuhi syarat ke penyimpanan aplikasi jika rekaman resminya tersedia melalui Quran Foundation.

Baca tanpa internet:

• Setelah terhubung dan unduhan selesai, simpan teks Al-Qur’an serta terjemahan ayat Kemenag RI dan Saheeh International untuk seluruh 114 surah.
• Glos kata, pencarian akar, dan sumber online lainnya tidak termasuk dalam paket teks tersebut.

Sebagian penjelasan partikel merupakan catatan belajar berbantuan AI. Catatan itu diberi label belum ditelaah dan tidak disajikan sebagai kutipan kamus atau fatwa. Ketersediaan sumber berbeda pada tiap entri; sumber yang tidak tersedia tidak diganti dengan kutipan rekaan.

Qurabic adalah alat bantu membaca dan belajar bahasa. Untuk bimbingan agama, rujuk guru yang kompeten dan sumber primer yang dicantumkan.

## Release checks before publishing

- Recheck character counts in Play Console after localization; punctuation and Quranic characters count toward the limits.
- Verify every listed feature against the signed build, production API access, and a physical Android device.
- Prepare English and Indonesian screenshots from the final build. Do not use screenshots from the currently deployed site as evidence for a different build.
- Keep this draft unpublished until rights, source disclosures, account declarations, signing, and closed testing are verified in Play Console.
