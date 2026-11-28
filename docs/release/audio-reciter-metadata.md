# Audio reciter metadata

Short descriptions in the audio player are deliberately factual and bilingual. They describe the recording format, the recitation style only where the audio source labels it, and an imam role only where an authoritative profile supports it. They do not characterize a reciter's voice as "moving", "soothing", or similar, and do not assign a maqam such as Jiharkah without recording-specific evidence.

## Source basis

- [EveryAyah recitation files](https://www.everyayah.com/recitations_ayat.html) names the Abdul Basit Murattal and Mujawwad editions and the Alafasy, Sudais, Husary, and Maher Al-Muaiqly recordings. The app's `everyAyahFolder` values point to this source's per-ayah files.
- [Quran Foundation recitation styles](https://api-docs.quran.foundation/docs/content_apis_versioned/4.0.0/recitation-styles/) describes *mujawwad* as melodic and *murattal* as a slower style used for study and practice. Those labels are only shown for editions explicitly identified as such in their source names.
- [Presidency of Religious Affairs at the Two Holy Mosques: Yasser Al-Dossary](https://prh.gov.sa/ar/%D8%B9%D9%84%D9%85%D8%A7%D8%A1-%D9%88%D9%85%D8%B4%D8%A7%D8%A6%D8%AE-%D8%A7%D9%84%D8%AD%D8%B1%D9%85%D9%8A%D9%86?catid=84:imem-s&id=247:%D9%81%D8%B6%D9%8A%D9%84%D8%A9-%D8%A7%D9%84%D8%B4%D9%8A%D8%AE-%D8%A7%D9%84%D8%A3%D8%B3%D8%AA%D8%A7%D8%B0-%D8%A7%D9%84%D8%AF%D9%83%D8%AA%D9%88%D8%B1-%D9%8A%D8%A7%D8%B3%D8%B1-%D8%A8%D9%86-%D8%B1%D8%A7%D8%B4%D8%AF-%D8%A7%D9%84%D8%AF%D9%88%D8%B3%D8%B1%D9%8A&view=article) is the official religious-affairs authority's imam profile directory.
- [Saudipedia: Abdulrahman Al-Sudais](https://saudipedia.com/en/abdulrahman-al-sudais) records his Grand Mosque imam and khateeb appointment; [Saudipedia: Maher Al-Muaiqly](https://saudipedia.com/en/maher-al-muaiqly) lists him as Imam and Khateeb of the Grand Mosque. Saudipedia is published by Saudi Arabia's Ministry of Media.

## Metadata limits

- "Verse by verse" and "full surah" describe how Qurabic addresses the recording, not a quality ranking.
- The source catalog names a reciter and, for some recordings, the style. It does not establish an individual maqam for each ayah.
- No synthetic voice is used for Qur'an recitation. Public builds keep spoken translation audio unavailable until both the recording and its redistribution terms are verified; development builds may use the existing human-recorded sources for coverage and playback work.
