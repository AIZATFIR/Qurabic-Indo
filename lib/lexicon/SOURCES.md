# Authoritative Source Verification: Lane's Arabic-English Lexicon

## 1. Overview & Provenance

* **Work**: *An Arabic-English Lexicon: Derived from the Best and the Most Copious Eastern Sources*
* **Author / Compiler**: Edward William Lane (1801–1876), completed and edited by Stanley Lane-Poole (1854–1931).
* **Publication Date**: Published in 8 volumes/parts between 1863 and 1893 (London: Williams and Norgate).
* **Primary Digitization**: Perseus Digital Library (Tufts University, Gregory Crane et al.).
* **Open Source Repository**: [laneslexicon/LexiconDatabase](https://github.com/laneslexicon/LexiconDatabase) & [laneslexicon/lexicon_xml](https://github.com/laneslexicon/lexicon_xml).

---

## 2. License & Legal Redistribution Analysis

1. **Original Text**:
   - Published in the 19th century (>130 years ago).
   - The printed text of *Lane's Arabic-English Lexicon* is completely in the **Public Domain worldwide**.

2. **Perseus Digital Library Digitization**:
   - Sourced under **Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0)** and Open Access for educational/humanities research.

3. **LanesLexicon Parser & Database Tools**:
   - The software and SQLite packaging by the `laneslexicon` organization are licensed under the **GNU General Public License v3.0 (GPL-3.0)**.
   - LICENSE file: [laneslexicon/LexiconDatabase/LICENSE](https://raw.githubusercontent.com/laneslexicon/LexiconDatabase/master/LICENSE).

4. **Redistribution Invariant for Qurabic**:
   - Permitted for offline indexing, chunking, and search within Qurabic.
   - Attribution must be explicitly maintained in all lexical responses:
     `"Sourced from Lane's Arabic-English Lexicon (Perseus Digital Library / Lane's Lexicon Project)"`.
   - Content must remain authentic to the original digitized work without paraphrasing or AI generation.

---

## 3. Database Schema Structure (`lexicon_schema.sql`)

The `laneslexicon` SQLite schema indexes roots, headwords, verb forms, and definitions as follows:

```sql
CREATE TABLE root (
  id INTEGER PRIMARY KEY,
  datasource INTEGER,
  word TEXT,          -- Arabic root word with diacritics
  bword TEXT,         -- Buckwalter transliteration of root
  letter TEXT,        -- Arabic section letter
  bletter TEXT,       -- Buckwalter section letter
  xml TEXT,           -- Formatted root overview XML
  page INTEGER        -- Printed volume page
);

CREATE TABLE entry (
  id INTEGER PRIMARY KEY,
  datasource INTEGER,
  root TEXT,          -- Arabic root (e.g. عون)
  broot TEXT,         -- Buckwalter root (e.g. Ewn)
  word TEXT,          -- Arabic headword/lemma (e.g. اسْتَعَانَ)
  bword TEXT,         -- Buckwalter headword
  itype TEXT,         -- Verb form (e.g. "10", "1", "8", etc.)
  nodeid TEXT,
  xml TEXT,           -- Full dictionary definition with classical citations
  perseusxml TEXT,    -- Original Perseus XML
  headword TEXT,
  page INTEGER
);

CREATE TABLE itype (
  id INTEGER PRIMARY KEY,
  itype INTEGER,      -- Form number (1-10)
  root TEXT,
  broot TEXT,
  nodeid TEXT,
  word TEXT,
  xml TEXT
);
```

---

## 4. Key Field Mappings to Qurabic

| Lane Database Field | Qurabic Morphological Anchor | Meaning / Purpose |
| :--- | :--- | :--- |
| `broot` (`Ewn`, `Sbr`, `xlT`, `ryb`) | `CanonicalRootDetail.id` / `QAC.root` | Case-sensitive Buckwalter root identifier |
| `itype` (`10`, `8`, `1`) | `QAC.verbForm` / `morphology.wazanOrForm` | Arabic verbal form (Form I to X) |
| `word` (`اسْتَعَانَ`, `صَبَرَ`, `رَيْب`) | `CanonicalWordDetail.lexical.lemmaArabic` | Arabic lemma / headword |
| `xml` / text | `CanonicalWordDetail.lexical.entries[].senses` | Original English classical definition & senses |
| `page` (e.g. `2202`, `1643`, `784`, `1205`) | `LexicalEntry.page` | Exact citation page in the 8-volume lexicon |

---

## 5. Verification Invariant

- **Zero LLM Fabrications**: If a word or root is not present in the Lane dataset, Qurabic returns:
  `hasLexicalData: false` and `"Makna leksikal belum tersedia."`
- **Coordinate-First Guardrail**: Dictionary definitions are joined strictly through the authoritative QAC coordinate $\rightarrow$ QAC Lemma / Root join, never through fuzzy string matching.
