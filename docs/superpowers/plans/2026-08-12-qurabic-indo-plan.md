# Qurabic-Indo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modern, flagship web application for Quranic Arabic Root Word Corpus in Bahasa Indonesia (Qurabic-Indo) with multi-language search (Arabic, Latin transliteration, Indonesian, English), detailed morphological derivative analysis (Verbs & Nouns), etymological notes (e.g. *sobaro = batu keras*), and verse concordances.

**Architecture:** Next.js App Router with TypeScript and Tailwind CSS. The app features an offline-first search normalizer indexing root data, dynamic root detail pages (`/akar/[slug]`), interactive verb/noun derivation grids, and an Ayah concordance player.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Lucide React Icons, Google Fonts (Amiri & Plus Jakarta Sans).

## Global Constraints

- **Language Support:** Bahasa Indonesia primary interface with full Arabic diacritics.
- **Search Capabilities:** Multi-query (Arabic `ص-ب-ر`, Latin `sabar`, Indonesian `batu`/`menahan`, English `patience`).
- **Styling:** Emerald Obsidian Glassmorphism theme (`#0B0F17` background, `#10B981` emerald primary, `#F59E0B` warm gold accent).

---

### Task 1: Project Setup & UI Design System Tokens

**Files:**
- Create: `package.json`
- Create: `tailwind.config.js`
- Create: `app/layout.tsx`
- Create: `app/globals.css`

**Interfaces:**
- Produces: Base CSS tokens for Dark Obsidian, Emerald glow, Amiri & Plus Jakarta Sans typography.

- [ ] **Step 1: Initialize Next.js project with Tailwind CSS & TypeScript**
- [ ] **Step 2: Add Google Fonts (Amiri & Plus Jakarta Sans) and configure CSS variables**
- [ ] **Step 3: Define dark mode glassmorphic styling utilities in `app/globals.css`**
- [ ] **Step 4: Verify dev server builds cleanly**

---

### Task 2: Data Schema & Root Word Morphology Library

**Files:**
- Create: `lib/types/morphology.ts`
- Create: `lib/data/roots.ts`

**Interfaces:**
- Consumes: Type definitions for `RootWord`, `DerivativeWord`, `VerseOccurrence`.
- Produces: Exported dataset `ROOT_DATABASE` containing rich entries (`ص-ب-ر`, `ك-ت-ب`, `ع-ل-م`, `ر-ح-م`, `ن-ص-ر`).

- [ ] **Step 1: Create TypeScript interface `lib/types/morphology.ts`**
- [ ] **Step 2: Create dataset `lib/data/roots.ts` including etymology notes ("sobaro = batu keras / tanaman pahit"), Fi'il Forms, Isim Forms, and Verse occurrences**
- [ ] **Step 3: Add unit tests/validation script `lib/data/roots.test.ts` to verify schema integrity**

---

### Task 3: Multi-Language Search Engine & Transliteration Normalizer

**Files:**
- Create: `lib/search/root-search.ts`
- Create: `lib/search/root-search.test.ts`

**Interfaces:**
- Consumes: `ROOT_DATABASE` from `lib/data/roots.ts`
- Produces: `searchRoots(query: string): RootWord[]` and `getRootBySlug(slug: string): RootWord | null`

- [ ] **Step 1: Write failing unit test for `searchRoots` matching Arabic, Latin, Indonesian, and English queries**
- [ ] **Step 2: Implement search normalizer and fuzzy matcher in `lib/search/root-search.ts`**
- [ ] **Step 3: Run tests to ensure `searchRoots("sabar")`, `searchRoots("صبر")`, and `searchRoots("batu")` pass**

---

### Task 4: UI Components (Navbar & Omni-Search Bar)

**Files:**
- Create: `components/Navbar.tsx`
- Create: `components/OmniSearch.tsx`

**Interfaces:**
- Consumes: `searchRoots` search function
- Produces: Interactive top navigation and search overlay component with live suggestions.

- [ ] **Step 1: Create `components/Navbar.tsx` with glassmorphic header and branding**
- [ ] **Step 2: Create `components/OmniSearch.tsx` with real-time dropdown results and keyboard shortcut (`Ctrl+K`)**
- [ ] **Step 3: Verify search interaction visually**

---

### Task 5: Homepage & Trending Root Cards

**Files:**
- Create: `app/page.tsx`
- Create: `components/RootCard.tsx`

**Interfaces:**
- Consumes: `ROOT_DATABASE` and `RootCard` component
- Produces: Main landing page with Hero search, feature cards, and trending root cards.

- [ ] **Step 1: Create `components/RootCard.tsx` displaying root Arabic, Latin, frequency, and Indonesian meaning preview**
- [ ] **Step 2: Assemble `app/page.tsx` with Hero section and Bento Grid layout**
- [ ] **Step 3: Verify page render**

---

### Task 6: Dynamic Root Detail Page (`/akar/[slug]`)

**Files:**
- Create: `app/akar/[slug]/page.tsx`
- Create: `components/EtymologyCard.tsx`
- Create: `components/DerivativesGrid.tsx`
- Create: `components/AyahConcordance.tsx`

**Interfaces:**
- Consumes: `getRootBySlug(slug)`
- Produces: Comprehensive root details, etymology notes, verb/noun tabs, and verse occurrences player.

- [ ] **Step 1: Create `components/EtymologyCard.tsx` showing classical dictionary insight (e.g. "Sobaro = batu keras")**
- [ ] **Step 2: Create `components/DerivativesGrid.tsx` separating Verbs (Fi'il) and Nouns (Isim)**
- [ ] **Step 3: Create `components/AyahConcordance.tsx` with verse text, translation, and word highlighting**
- [ ] **Step 4: Build dynamic page `app/akar/[slug]/page.tsx`**

---

### Task 7: Morphology Library Index Page (`/morfologi`)

**Files:**
- Create: `app/morfologi/page.tsx`

**Interfaces:**
- Consumes: `ROOT_DATABASE`
- Produces: Morphology catalog page with filter by category and frequency sorting.

- [ ] **Step 1: Implement `app/morfologi/page.tsx` with search filter and root grid**
- [ ] **Step 2: Verify full navigation flow across site**
