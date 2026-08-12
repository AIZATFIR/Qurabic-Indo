# Qurabic-Indo UI Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp the Qurabic-Indo UI to match the new **Stripi-Inspired Design Language** (Electric Indigo `#3904e7`, Deep Ink `#0d253d`, Canvas Soft `#f6f9fc`, Gradient Mesh Header, Tabular Figures `tnum`, negative letter-spacing headlines, pill buttons, and hairline borders).

**Architecture:** Next.js App Router with updated Tailwind CSS design system tokens matching `design.md` and `code.html`.

**Tech Stack:** Next.js 14+, TypeScript, Tailwind CSS, Lucide React, Google Fonts (Inter & Amiri).

---

### Task 1: Update Tailwind Config & Global Design Tokens

**Files:**
- Modify: `tailwind.config.js`
- Modify: `app/globals.css`

- [ ] **Step 1: Update `tailwind.config.js` with Stripi color palette (`primary`, `primary-deep`, `ink-primary`, `canvas-soft`, `hairline`, `ruby`, `magenta`, `lemon`), font sizes, letter spacing, and shadow tokens**
- [ ] **Step 2: Update `app/globals.css` to enable `ss01` and `tnum` font features globally and add `.gradient-mesh` background**

---

### Task 2: Update Navbar Component (`components/Navbar.tsx`)

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Restyle Navbar with clean white surface, hairline border (`border-[#e3e8ee]`), Indigo logo `Qurabic (Indo)`, navigation links (`Roots`, `Morfologi`, `Akar Sabar`), search trigger, and Sign In pill button**

---

### Task 3: Update RootCard & Lemma Components (`components/RootCard.tsx`)

**Files:**
- Modify: `components/RootCard.tsx`

- [ ] **Step 1: Restyle `RootCard.tsx` with white canvas card, hairline border, subdued indigo tag (`bg-[#b9b9f9] text-[#4434d4]`), tabular figure occurrences, Arabic root header, etymology note highlight, and chevron icon**

---

### Task 4: Update Homepage (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rebuild Homepage layout matching `code.html` prototype**
- [ ] **Step 2: Add Hero section with Gradient Mesh backdrop, Display XXL headline `Qurabic`, search input pill bar**
- [ ] **Step 3: Add Featured Roots Grid and Featured Lemmas Section (`كِتَاب`, `نُور`, `حَقّ`, `صَبْر`)**

---

### Task 5: Update Root Detail & Morphology Catalog Pages

**Files:**
- Modify: `components/EtymologyCard.tsx`
- Modify: `components/DerivativesGrid.tsx`
- Modify: `components/AyahConcordance.tsx`
- Modify: `components/OmniSearch.tsx`
- Modify: `app/akar/[slug]/page.tsx`
- Modify: `app/morfologi/page.tsx`

- [ ] **Step 1: Update `EtymologyCard`, `DerivativesGrid`, `AyahConcordance`, and `OmniSearch` to match light canvas theme**
- [ ] **Step 2: Update `/akar/[slug]` and `/morfologi` page layouts**

---

### Task 6: Verification & Deployment

- [ ] **Step 1: Run `npm test` to verify search engine integrity**
- [ ] **Step 2: Run `npm run build` to verify clean SSG static page generation**
- [ ] **Step 3: Git commit and push to GitHub & Vercel**
