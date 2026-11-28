# Play Store Release Readiness Plan

> **For agentic workers:** Execute natively in the current session; defer heavyweight verification until the implementation pass is complete.

**Goal:** Make Qurabic's Android app and web experience trustworthy and releaseable, with the requested bilingual Quran reading, sourced word study, useful offline behavior, and Play Store compliance evidence.

**Architecture:** Keep the existing Next.js and Capacitor architecture while removing correctness gaps in the reader, data attribution, audio, and offline pack flow. Treat Quran Foundation, Kemenag, Saheeh International, QAC, Lane, and other lexical sources as separate datasets with explicit provenance and coverage; never fill missing scholarly data with generated prose. Separate repository readiness from externally controlled production credentials, Play Console declarations, and signing.

**Tech Stack:** Next.js, TypeScript, Capacitor/Android Gradle, IndexedDB, Service Worker, Playwright, Quran Foundation Content API.

**Spec:** User requirements in this conversation; `docs/release/play-store-readiness.md`; `docs/release/android-offline.md`.

## Global Constraints

- Preserve Indonesian and English UI and content behavior.
- No unsupported lexical, morphology, tafsir, or recitation claims. Any AI-assisted learning note must be visibly labeled as unreviewed and kept separate from sourced dictionary material.
- Arabic verse text must remain source-verified and exact.
- Keep the 8 GB RAM constraint in mind; do not eagerly parse large lexical chunks.
- Finish implementation before the full test/build pass.
- Do not push, deploy, publish, delete, or write production data without explicit authorization.

## Review Focus

- Partial or stale offline snapshots: a selected surah must never mix incompatible Arabic, word, and translation layers.
- Empty Indonesian or English data: no autoplay/translation control may hang or silently claim success.
- Android first launch without network: the shell must explain its actual capability and recover cleanly.
- Audio buffering, downloads, looping, and navigation between search and reader must preserve the intended ayah and locale.
- Older installs, stored preferences, and interrupted upgrades must remain usable.

## Workstreams

### 1. Source and learning content

- Audit root, lexicon, Quran-by-Quran, particle, morphology, and tafsir coverage with counts and provenance.
- Improve root and particle explanations only from source-backed bulk datasets; report uncovered entries honestly.
- Keep original Lane English and readable summaries separate, with exact citation metadata.
- Validate English mode end-to-end and remove generic or stale placeholder copy.

### 2. Reader and search experience

- Make ayah search results expose the reader's meaningful controls, including play and language-appropriate text.
- Search-result playback state contract:

  | State | Required visible behavior |
  |---|---|
  | Idle | Each verse offers Play; shared player is hidden. |
  | Switching surah | Stop the old track, then start the selected verse under the new surah metadata. |
  | Loading | Selected verse shows a spinner; shared player exposes loading state. |
  | Playing | Selected verse offers Pause; shared player opens compact with transport, then can expand to settings. |
  | Paused | Selected verse offers Play and resumes the same verse. |
  | Full-surah-only reciter | A search-result request temporarily uses the per-verse Al-Afasy recording, identifies the fallback in the UI, and preserves the reader's saved qari preference. |
  | Ended or error | Selected verse offers Play again; player reports playback error when present. |
  | Filter/query change | Playback may continue; the shared player remains available while results change. |
  | Route unmount | Stop and release audio resources. |

- Confirm ayah jumps land at the ayah start and behave across long verses, focus mode, and search navigation.
- Keep audio controls compact, genuinely minimizable, and complete for play/pause/next/loop/repeat/reciter selection.
- Ensure hands-free mode handles absent or delayed translations and audio failures without stuck state.

### 3. Android and offline

- Audit offline pack completeness, storage cleanup, sync resumption, and WebView/service-worker fallback.
- Improve first-launch and offline behavior without making unsupported full-offline claims.
- Verify Android manifest, permissions, SDK levels, app icon, versioning, release signing gates, and package contents.

### 4. Store compliance and release evidence

- Reconcile privacy policy and disclosures with actual storage, analytics, ads, downloads, and third-party SDK behavior.
- Prepare bilingual Play listing assets and claims from verified product capabilities.
- Run type/build/unit/Playwright checks after implementation, then device checks for install, upgrade, offline, audio, and storage failure paths.
- Produce an upload-signed AAB only after credentials and version are supplied; do not submit or publish without explicit approval.

## Completion evidence

- Data coverage report with counts by source, language, and entry kind; no unsupported fallback meanings.
- English/Indonesian reader and search rendered evidence, including audio entry points.
- Successful typecheck, relevant unit tests, Playwright smoke, production build, and Android AAB inspection.
- Device test record for fresh install, online sync, offline reopen, audio, upgrade, storage-full, and recovery.
- Play Console declarations/listing and signing are only considered complete when evidenced in the actual console and with a valid signed bundle.
