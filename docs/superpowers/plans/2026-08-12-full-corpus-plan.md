# Qurabic-Indo Full Corpus & Phonetic Search Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Qurabic-Indo with full **Quranic Arabic Corpus** feature parity (Word-by-word Interlinear Breakdown, Grammatical Syntax/POS Tags, Root Phonetic Normalizer for queries like `sholat`, `solat`, `takwa`, `zakat`, `syukur`, `tobat`), and add roots `ص-ل-و` (Sholat), `ز-ك-و` (Zakat), `و-ق-ي` (Takwa), `ش-ر-ك` (Syirik), `ح-م-د` (Hamd), `ص-ل-ح` (Saleh), and `ش-ه-د` (Syahadat).

**Architecture:** Next.js App Router with extended dataset types (`WordSegment`), POS Tag visualizer components (`GrammarBadge`, `WordByWordViewer`), and phonetic search pre-processor.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Lucide Icons.

---

### Task 1: Add Roots `ص-ل-و` (Sholat), `ز-ك-و` (Zakat), `و-ق-ي` (Takwa), `ش-ر-ك` (Syirik), `ح-م-د` (Hamd), `ص-ل-ح` (Saleh), `ش-ه-د` (Syahadat)

**Files:**
- Modify: `lib/data/roots.ts`
- Modify: `lib/types/morphology.ts`

- [ ] **Step 1: Update `lib/types/morphology.ts` to add `WordSegment` interface for Word-by-Word Interlinear Analysis**
- [ ] **Step 2: Add `ص-ل-و` (Sholat), `ز-ك-و` (Zakat), `و-ق-ي` (Takwa), `ش-ر-ك` (Syirik), `ح-م-د` (Hamd), `ص-ل-ح` (Saleh), and `ش-ه-د` (Syahadat) to `lib/data/roots.ts`**

---

### Task 2: Phonetic Search Normalizer (`lib/search/root-search.ts`)

**Files:**
- Modify: `lib/search/root-search.ts`
- Modify: `lib/search/root-search.test.ts`

- [ ] **Step 1: Write failing unit test for `sholat`, `solat`, `salat`, `takwa`, `zakat`, `tobat` in `lib/search/root-search.test.ts`**
- [ ] **Step 2: Implement Indonesian phonetic normalizer mapping in `lib/search/root-search.ts`**
- [ ] **Step 3: Verify unit tests pass**

---

### Task 3: Word-by-Word Interlinear & Grammatical Syntax Component

**Files:**
- Create: `components/GrammarBadge.tsx`
- Create: `components/WordByWordViewer.tsx`
- Modify: `components/AyahConcordance.tsx`

- [ ] **Step 1: Create `components/GrammarBadge.tsx` displaying POS tags (Noun/Isim, Verb/Fi'il, Particle/Haraf, Form I-X)**
- [ ] **Step 2: Create `components/WordByWordViewer.tsx` displaying interlinear word-by-word breakdown (Arabic, Transliteration, POS tag, Indonesian translation)**
- [ ] **Step 3: Integrate `WordByWordViewer` into `components/AyahConcordance.tsx`**

---

### Task 4: Verification & Deployment

- [ ] **Step 1: Run `npm test` to verify phonetic search and database lookups**
- [ ] **Step 2: Run `npm run build` to verify clean Next.js build**
- [ ] **Step 3: Commit and push to GitHub and Vercel**
