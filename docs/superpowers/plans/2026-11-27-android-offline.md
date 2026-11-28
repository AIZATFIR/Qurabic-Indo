# Android Offline Reading Implementation Plan

> **For agentic workers:** Implement task by task in this session. Keep each step small and avoid loading the full corpus into memory.

**Goal:** Let Qurabic readers explicitly save Quran text and selected translations, plus requested recitation audio, for offline use in Android's private app storage while keeping Quran Foundation content current and properly attributed.

**Architecture:** A server-only Content Sync adapter holds Quran Foundation OAuth credentials and exposes only approved resources and sync operations. Quran Foundation publishes core text and verse translations as full resources, so Qurabic downloads one complete text/translation pack; audio downloads remain explicit per verse or supported short surah. The app stores content in IndexedDB, renders local data immediately, and performs incremental sync when online.

**Tech Stack:** Next.js route handlers, server-side `fetch`, IndexedDB, Capacitor Android WebView.

**Spec:** User requests in this conversation; official Quran Foundation Developer Terms and Content Sync docs linked from the relevant release notes.

## Global Constraints

- Never expose `QF_CLIENT_SECRET` or an access token to browser/native code.
- Do not create offline copies from regular Quran Foundation API responses when Content Sync supports the resource.
- Keep a successful Content Sync checkpoint no older than 7 days when online.
- Keep Quran Foundation content within the app's end-user experience; do not publish it as a dataset/API/package.
- Explicit full-text-pack download, storage status, full-pack deletion, bounded memory, and bilingual UI are required.
- Do not run builds or E2E until the user-requested development pass is complete.
- Quran Foundation's prelive corpus contains only two surahs; do not mark a resource pack complete unless the full production snapshot counts validate.
- Current turn follows the user's instruction to finish development before tests/builds; defer all test and build commands until the implementation pass is complete.

## Review Focus

- Missing production credentials: show a usable online state and explain offline sync is unavailable without exposing secrets.
- Partial snapshots or failed pages: keep the previous complete local chapter and sync token.
- Duplicate/out-of-order updates: applying the same sync response twice must produce the same local state.
- Offline launch: previously saved content remains readable with no network.
- Storage exhaustion or user deletion: surface failure clearly and remove only the selected saved content.

### Task 1: Server-side Quran Foundation Content Sync adapter

**Files:**
- Create: `lib/quran-foundation/content-sync.ts`
- Create: `app/api/content-sync/route.ts`
- Test later: `lib/quran-foundation/content-sync.test.ts`

**Interface:** Route accepts a fixed operation (`bootstrap`, `sync`, or `snapshot`) and an allowlisted content filter. It obtains OAuth credentials from server environment variables and returns only Content Sync responses needed by the app.

- [ ] Add token acquisition with explicit environment selection, timeout, non-logging errors, and server-only credentials.
- [ ] Restrict upstream URLs to the official Content API host; reject arbitrary URLs and resource filters.
- [ ] Proxy bootstrap, paginated deltas, and snapshots without storing a checkpoint before the client confirms complete application.
- [ ] Add tests for missing credentials, invalid operations, upstream failure, and allowlisted requests.

### Task 2: IndexedDB cache and safe sync application

**Files:**
- Create: `lib/offline/quran-content-store.ts`
- Create: `lib/offline/quran-content-sync.ts`
- Test later: `lib/offline/quran-content-sync.test.ts`

**Interface:** Store `quran_core`, translation rows, one package status, and per-filter sync tokens with stable keys and timestamps. Apply changes idempotently; replace one resource atomically after its complete snapshot arrives.

- [ ] Add schema versioning and chapter indexes without importing the full corpus into JS memory.
- [ ] Implement bootstrap, cursor paging, bounded snapshot loading, row create/update/delete, and token commit after success.
- [ ] Add tests for duplicate changes, failed snapshot rollback, token isolation, and recovery.

### Task 3: Reader download and offline-first read path

**Files:**
- Modify: `app/baca/page.tsx`
- Modify: `components/QuranAudioPlayer.tsx` only for download status integration if needed.
- Create: `components/OfflineSurahActions.tsx`
- Test later: Playwright offline reading coverage.

- [ ] Add bilingual full-text-pack download, progress, saved state, refresh, and delete controls; explain that the pack includes all 114 surahs.
- [ ] Read saved content immediately when offline; fetch/sync online when needed and update each resource only after its complete snapshot succeeds.
- [ ] Keep root/word study honest about which locally saved layers are available.
- [ ] Add tests for saved, loading, offline, stale, failed, and deleted states.

### Task 4: Android launch and release readiness

**Files:**
- Modify: `capacitor.config.ts`, Android packaging config, and release documentation after offline behavior is in place.

- [ ] Ensure the native package can launch a cached local shell and reach saved chapters without the production web host.
- [ ] Confirm private storage, deletion behavior, source credits, privacy disclosures, signing, and release AAB configuration.
- [ ] Run the agreed build and Playwright/device checks after implementation is complete.
- [ ] Verify release artifacts and Play Console declarations before any public upload.
