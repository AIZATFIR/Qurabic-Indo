# Third-party notices

## Unslop

The project-local `.agents/skills/unslop` skill and its references are from **Unslop**, by Damir Sokolovsky (@heydamir), licensed under CC BY 4.0. The skill is used as design guidance and has not been incorporated into product runtime code.

- Source: https://github.com/heydamir/unslop
- License: https://creativecommons.org/licenses/by/4.0/
- Source revision: `620163e` (main, installed 2026-11-27)

## Capacitor audio storage plugins

The Android audio download flow uses the official Capacitor `@capacitor/filesystem` plugin, distributed under the MIT License.

- Source: https://github.com/ionic-team/capacitor-filesystem
- Source: https://github.com/ionic-team/capacitor-file-transfer
- License: https://opensource.org/license/mit

## Arabic Stop Words dataset

The Arabic particle classification index is derived from Taha Zerrouki’s Arabic Stop Words 0.9, pinned at revision `f6018e22e02067022231d4dbda0e46b4b1b7e1e7`. The original TSV, SQLite index, source attribution (`lib/data/ARABIC-STOPWORDS-ATTRIBUTION.md`), and GPL-2 license text are included in `lib/data/`. Qurabic displays only the source’s particle-tagged morphology rows and does not translate them into dictionary definitions.

- Source: https://github.com/linuxscout/arabicstopwords
- License: GNU General Public License version 2 (`lib/data/ARABIC-STOPWORDS-GPL-2.0.txt`)

## Tāj al-ʿArūs root and form index

The adapted SQLite index `lib/data/taj-al-arus-roots.sqlite` and its original source dump `lib/data/third-party/khorsi-taj-al-arus-source.sql.bz2` derive from **Arabic Roots and Derivatives** by Ahmed Khorsi. The source project describes its data as extracted from *Tāj al-ʿArūs* and is marked Beta. The derived index is distributed under the source's Creative Commons Attribution-ShareAlike 3.0 license. It contains forms and stems, not dictionary definitions.

- Source: https://sourceforge.net/projects/arabicrootsandderivatives/
- License: https://creativecommons.org/licenses/by-sa/3.0/
- Source checksum (SHA-256): `2f1b2e30baf95630b94efb548704cd78892938a6afae6bd4a11baf55ddaa86c1`
- Index checksum (SHA-256): `8eae60fc9d217b779cefc69aed9834155f394d07f6a5073ee6ec3f325534cad2`

## Quranic Arabic Corpus morphology

The QAC v0.4 morphology file and precompiled indexes are attributed to the Language Research Group, University of Leeds. The [download terms](https://corpus.quran.com/download/) permit use in apps with attribution and no modifications; the [FAQ](https://corpus.quran.com/faq.jsp) separately describes downloaded annotation as non-commercial research data. Qurabic has requested no written clarification, so commercial or monetized Play distribution is not cleared. Do not treat the repository's GPL label as resolving this conflict.

- Source: https://corpus.quran.com/
- Local source: `lib/quranic-corpus-morphology-0.4.txt`
- Attribution: show Quranic Arabic Corpus and version 0.4 wherever its annotations are presented.

## Lane's Arabic-English Lexicon

The displayed transcription is attributed to the Perseus Digital Library at Tufts University and corrections by the Alpheios Project. Alpheios identifies its digital text as [CC BY-SA 3.0 US](https://creativecommons.org/licenses/by-sa/3.0/us/). The local ingestion was processed from [LexiconDatabase](https://github.com/laneslexicon/LexiconDatabase), which also includes a GPL-3.0 license; preserve both upstream notices and confirm which terms apply to each generated chunk before release.

- Source: https://github.com/alpheios-project/lan
- Local index: `lib/lexicon/data/chunks/`
- Display: keep Edward William Lane, *An Arabic-English Lexicon*, volume/part/page, Perseus, and Alpheios attribution beside excerpts.

## Quran.com word-by-word gloss exports

The 117 legacy JSON exports under `lib/data/wbw/` and `lib/data/wbw-*-glosses.json` are retained in the Git repository at the user's request. Current application routes do not read them, and `next.config.js` excludes them from Next.js output tracing. They remain third-party API content; no redistribution grant for this repository copy has been recorded. Do not add them to a release bundle or claim they are open-licensed. Keep the exports until the user requests otherwise; resolve repository redistribution rights before publishing further Git history containing them.

- Runtime source: Quran.com API v4, requested for displayed verse/word coordinates.
- Source docs: https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/verses-by-chapter-number
- Attribution: Quran.com; the API does not identify a translator for each word gloss.

## MAQAM Quranic Corpus lexical glosses

The SQLite index `lib/data/maqam-glosses.sqlite` and compact JSON index `public/data/maqam-glosses.json` are modified extracts of the MAQAM Quranic Corpus, pinned at commit `2e52c1354a901e998a311c94f43d14c99f467f6f`. Qurabic retains Quran word coordinates plus MAQAM's lemma, English stem gloss, POS, and root fields; it omits the source Quran text and other morphosyntactic fields. The original dataset is attributed to CAMeL Lab and licensed CC BY 4.0. The attribution and source paper are linked in the app's MAQAM source drawer. The indexed glosses are modified/normalized for display (underscores become spaces; semicolon alternatives become separators), and are labeled as English stem glosses; attached prefixes or pronouns may not be included. Underlying Quran text is obtained separately and is not included in these indexes.

- Dataset: https://github.com/CAMeL-Lab/MAQAM-Quranic-Corpus/tree/2e52c1354a901e998a311c94f43d14c99f467f6f
- Paper: https://aclanthology.org/2026.arabicnlp-main.11/
- License: https://creativecommons.org/licenses/by/4.0/
- Underlying text attribution cited by MAQAM: Tanzil Project, CC BY 3.0, https://tanzil.net/docs/Text_License. The Qurabic MAQAM extracts omit Quran text; displayed Uthmani text is sourced separately from Quran.com.
- Build: `scripts/lexicon/build-maqam-gloss-index.py`

## Root meaning datasets with unresolved third-party rights

The following datasets are used in root study or are retained in the public source tree. Repository-level licenses do not establish rights to the third-party dictionary text or annotations they contain. Their inclusion is not a statement that Play Store distribution is cleared.

- **Quran bil-Quran**: `lib/data/quran-bil-quran-roots.json`; upstream repository declares MIT and credits Lane and Maqāyīs al-Lugha, but per-entry citations and third-party redistribution rights are unresolved. Source: https://github.com/R3GENESI5/quran-bil-quran
- **Tafsir archive**: runtime data is requested from pinned `rioastamal/quran-json@73b1d52`; the repository declares MIT, but the underlying tafsir text's rights and provenance are not independently documented. Source: https://github.com/rioastamal/quran-json/tree/73b1d5262f30695f5d17d9a61ce6b6af9b74aeda
- **Quran Foundation content**: production text, translations, and recitations are requested through Quran Foundation APIs and Content Sync, under its [Developer Terms](https://api-docs.quran.com/legal/developer-terms/). Keep required source/version attribution and synchronization behavior; do not redistribute raw API responses as a data package.

## QuranMorph and Qabas lemma links

The local `lib/lexicon/data/qabas-lemma-ids.json` file maps Quran word positions to Qabas lemma IDs using QuranMorph by Akra, Hammouda, and Jarrar. SinaLab identifies QuranMorph as [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); retain the paper citation and author attribution. Qurabic stores IDs/links, not Qabas dictionary definitions. Qabas definitions remain at Birzeit University and are not copied into Qurabic.

- Source paper: https://jarrar.info/publications/AHJ25.pdf
- Qabas attribution and terms: https://sina.birzeit.edu/qabas/about
