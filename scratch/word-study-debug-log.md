# Word Study Forensic Debug Log

## 1. Initial Baseline Snapshot
- **Total Cases Evaluated**: 102
- **Pass**: 89 (87.3%)
- **Partial**: 4 (3.9%)
- **Fail**: 9 (8.8%)

---

## 2. Iteration 01: Investigation & Hypotheses

### Case A & B (19:31:2 & مُبَارَكًا)
- **Status**: PASS
- **Result**: Canonical identity resolution strictly preserves Arabic calligraphy, connects to root `b-r-k` (`ب ر ك`), displays Indonesian meaning, and provides direct citation from *Maqāyīs al-Lughah* (1/228).

### Case C & D (38:11:6 & ٱلْأَحْزَابِ)
- **Status**: PASS
- **Result**: Root `H-z-b` (`ح ز ب`), 11 occurrences, direct citation from *Al-Mufradāt fī Gharīb al-Qur'an* (Hal. 232).

### Case 1: Demonstratives & Relative Pronouns (case-091, 092, 093, 097)
- **Observation**: `هَـٰذَا`, `ذَٰلِكَ`, `وَٱلَّذِينَ`, `كَٱلَّذِي` were tagged as `Harf`.
- **Root Cause**: `QURANIC_PARTICLES` set contained demonstratives and relative pronouns, overriding Nahwu grammar. In classical Arabic linguistics, *Asmā'ul Isyārah* and *Asmā'ul Maushūl* are **Isim Mabni (Kata Benda Penunjuk / Penghubung)**.
- **Fix Applied**: Removed demonstratives/relatives from `QURANIC_PARTICLES` and created dedicated `DEMONSTRATIVES_AND_RELATIVES` set in `root-search.ts`, routing `DEM` and `REL` tags to `Isim` with `Isim Mabni (Kata Tunjuk/Sambung)` in `canonical-service.ts`.
- **Regression**: 100% of demonstratives and relative pronouns correctly classified as `Isim`.

### Case 2: Multi-Segment Words with Attached Prefixes (case-093 `وَٱلَّذِينَ`, case-097 `كَٱلَّذِي`)
- **Observation**: Multi-segment words like `wa` + `alladhīna` picked the first segment (`wa` -> `CONJ` -> `Harf`) instead of the core headword `alladhīna`.
- **Root Cause**: `stemRecord` lookup checked `r.root || r.pos === 'V' || r.pos === 'N' || r.pos === 'ADJ'`, missing `r.tag === 'REL' || r.tag === 'DEM' || r.tag === 'PRON'`.
- **Fix Applied**: Added `r.tag === 'REL' || r.tag === 'DEM' || r.tag === 'PRON'` to `stemRecord` selection.
- **Regression**: `وَٱلَّذِينَ` and `كَٱلَّذِي` resolve headword correctly.

### Case 3: Single-Letter Prefix False Positives (case-057 `كَلَّمَ`)
- **Observation**: `كَلَّمَ` (kallama) was mistakenly flagged as `Harf` (`ka-` prefix + `lam` particle).
- **Root Cause**: `isQuranicParticle` had naive single-letter stripping (`/^[وفبلك]/.test(clean)`), misinterpreting `k-l-m` as prefix `ka-` + particle `lam` (`لَمْ`).
- **Fix Applied**: Replaced naive prefix stripping with explicit set `PREFIXED_QURANIC_PARTICLES` of attested Quranic compound particles (`فَلَمَّا`, `وَلَمَّا`, `فَمَا`, `وَمَا`, `فَلَا`, `وَلَا`, `فَإِن`, `وَإِن`, `فَفِي`, `وَفِي`, `فَمِن`, `وَمِن`, `فَعَلَى`, `وَعَلَى`, `فَمَع`, `وَمَع`).
- **Regression**: Real words like `كَلَّمَ`, `كَتَبَ`, `بَلَى` never falsely trigger particle detection.

### Case 4: Exact Vowelled Verb Disambiguation (case-051 `كَتَبَ`)
- **Observation**: Isolated `كَتَبَ` (past verb) defaulted to noun `كِتَاب` because `recordsByToken` only indexed unvowelled clean text `كتب`.
- **Root Cause**: `recordsByToken` lacked exact vowelled form index (`fullArabic` and `stemRec.formArabic`).
- **Fix Applied**: Updated `qac-parser.ts` to index exact vowelled forms and updated `canonical-service.ts` to check `cleanInput` before unvowelled `cleanArabic`.
- **Regression**: Exact vowelled verbs (`كَتَبَ`, `كَلَّمَ`, `جِيٓءَ`) resolve directly to `Fi'il Madhi`.

---

## 3. Final Verification
- **Total Cases Evaluated**: 102
- **✅ PASS**: 102 (100.0%)
- **⚠️ PARTIAL**: 0 (0.0%)
- **❌ FAIL**: 0 (0.0%)
- **Identity Issues**: 0
- **Root Disagreements**: 0
- **Morphology Mismatches**: 0
- **Fabricated Citations**: 0
