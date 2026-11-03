# Lexicon data sources

## Lane’s Arabic-English Lexicon

- Work: Edward William Lane, *An Arabic-English Lexicon*, London: Williams and Norgate, 1863–1893.
- Digital text: [Alpheios Lane repository](https://github.com/alpheios-project/lan), whose README credits original digitization to the Perseus Digital Library at Tufts University and corrections to the Alpheios Project.
- Alpheios identifies its digital text as [CC BY-SA 3.0 US](https://creativecommons.org/licenses/by-sa/3.0/us/).
- Local ingestion reads `data/lexicon/lane/raw/lexicon.sqlite`. Its upstream distribution is [LanesLexicon/LexiconDatabase](https://github.com/laneslexicon/LexiconDatabase), which includes a GPL-3.0 license. Conversion to JSON does not itself remove upstream obligations. Retain attribution and consult the actual upstream license files when redistributing data.
- Runtime JSON: `lib/lexicon/data/chunks/`, indexed by `manifest.json`.
- Printed part/page values are copied from the source records. Digital transcription, automatic sense extraction, and root matching may contain errors; records have not all received an independent scholarly review.

The interface preserves the transcribed English text. It no longer guesses which Latin tokens are Buckwalter: that heuristic corrupted ordinary words such as “Hence” and “English”. Arabic already encoded as Unicode receives direction and font formatting only.

## Word translations and morphology

- Primary Indonesian and English word glosses: Quran.com API v4, keyed by `surah:ayah:word`. The exported responses do not include an individual translator attribution; do not label them Kemenag translations.
- Whole-verse Indonesian translations are a separate source (Kemenag resource 33 and fallback mirrors). English reader translation uses resource 20 (Saheeh International).
- Roots, lemmas and grammatical features: [Quranic Arabic Corpus v0.4](https://corpus.quran.com/documentation/), whose documentation describes manual morphological/syntactic annotation. Indonesian class labels are interface translations, not quotations from a classical lexicon.
- Short standalone particle labels: QAC descriptions, for example `wa (and)` and [kallā, “Nay!”, aversion particle (78:4:1)](https://corpus.quran.com/wordbyword.jsp?chapter=78&verse=4). The UI distinguishes these localized grammar labels from Quran.com contextual word translations.

## Display boundaries

A word gloss is not a definition of its entire root. A root-entry match is not proof that each dictionary sense applies to the selected verse. Lane source language remains English and is labeled. Generated root narratives, unreviewed philosophical summaries and automatically constructed conjugations are excluded from word and root detail displays.

[QUL morphology resources](https://qul.tarteel.ai/resources/morphology) provide roots, lemmas and stems, and [QUL translations](https://qul.tarteel.ai/resources/translation) provide downloadable word and verse translations. These resources can support the corpus layer, but do not themselves supply a classical root dictionary interpretation.
