# Authoritative Source Verification & Provenance Chain: Lane's Arabic-English Lexicon

## 1. Overview & Provenance

* **Work**: *An Arabic-English Lexicon: Derived from the Best and the Most Copious Eastern Sources*
* **Author / Compiler**: Edward William Lane (1801–1876), edited and completed by Stanley Lane-Poole (1854–1893).
* **Historical Publication**: Published in 8 volumes/parts between 1863 and 1893 in London (Williams and Norgate).
* **Primary Digital Sources**:
  - Perseus Digital Library (Tufts University, Gregory Crane et al.).
  - Alpheios Project ([github.com/alpheios-project/lan](https://github.com/alpheios-project/lan)).
  - LanesLexicon Project ([github.com/laneslexicon/LexiconDatabase](https://github.com/laneslexicon/LexiconDatabase)).

---

## 2. Delineated 3-Tier License & Redistribution Analysis

To ensure complete legal rigor and avoid ambiguous claims, the licensing chain is separated into three distinct layers:

### Tier 1: Original 19th-Century Print Edition
- **Status**: **Public Domain worldwide**.
- **Rationale**: Published between 1863 and 1893 (>130 years ago). All underlying classical definitions and citations are out of copyright.

### Tier 2: Digital Text Corpora (Perseus Digital Library & Alpheios Project)
- **Status**: **Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0)**.
- **Terms**: Permits sharing and adapting the digital XML text for educational and non-commercial research, provided proper attribution is maintained and any derivative datasets are shared under compatible terms.
- **Attribution Invariant**: Every record served in Qurabic must explicitly link to or attribute:
  `"Sourced from Edward William Lane, An Arabic-English Lexicon (digitized by Perseus Digital Library & Alpheios Project)"`.

### Tier 3: LanesLexicon Desktop Software & SQLite Packaging
- **Status**: **GNU General Public License v3.0 (GPL-3.0)**.
- **Terms**: The Perl parser scripts and standalone `lexicon.sqlite` database bundled for the desktop application are covered by GPL-3.0.
- **Qurabic Architectural Separation**: Qurabic does **not** embed proprietary runtime dependencies. Qurabic ingests raw verified text entries into modular JSON chunk indices (`lib/lexicon/data/`), cleanly isolating application code from binary GPL database blobs while preserving attribution.

---

## 3. Database Schema Structure (`lexicon_schema.sql`)

The `laneslexicon` SQLite schema indexes roots, headwords, verb forms, and definitions as follows:

```sql
CREATE TABLE root (
  id INTEGER PRIMARY KEY,
  word TEXT,          -- Huruf akar Arab (e.g. عون, صبر, خلط, ريب)
  bword TEXT,         -- Transliterasi Buckwalter akar (e.g. Ewn, Sbr, xlT, ryb)
  xml TEXT,           -- Ikhtisar leksikal akar
  page INTEGER        -- Halaman jilid cetak asli
);

CREATE TABLE entry (
  id INTEGER PRIMARY KEY,
  root TEXT,          -- Akar Arab
  broot TEXT,         -- Buckwalter akar
  word TEXT,          -- Lemma / Headword Arab (e.g. اسْتَعَانَ, صَبَرَ)
  bword TEXT,         -- Lemma Buckwalter
  itype TEXT,         -- Wazan / Verb Form ("1", "4", "8", "10", dll.)
  xml TEXT,           -- Teks definisi kamus asli & kutipan otoritas klasik
  page INTEGER        -- Halaman rujukan cetak asli
);
```

---

## 4. Architectural Invariants for Qurabic

1. **Zero AI Paraphrasing / Synthetic Definitions**: All dictionary senses in `lane-pilot.json` and future chunks are verbatim extracts from the authenticated classical dictionary text.
2. **Coordinate-First QAC Binding**: Word lookups proceed strictly from the authenticated Quranic coordinate (`surah:ayah:word`) to the QAC Lemma and Root, and then to the Lexicon index.
3. **Honest Absence of Data**: If a root or word is unindexed in our verified dataset, Qurabic returns `hasLexicalData: false` and `"Makna leksikal belum tersedia."` instead of generating fallback prose.
4. **Particle Immunity**: Particles (Harf) are strictly precluded from matching roots or retrieving classical triliteral dictionary entries.
