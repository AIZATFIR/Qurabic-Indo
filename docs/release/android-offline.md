# Android offline content

Qurabic stores downloaded Quran text, translations, and synced recitation metadata in IndexedDB on the app's web origin. The Android WebView opens the reader at `/baca`; the service worker caches the reader shell and its referenced Next.js assets so the same origin can start offline after an initial online launch. If no reader shell has been cached, a small bilingual fallback explains that a connection is needed and offers a retry. Android audio downloads go directly into Capacitor `Directory.Data` (app-private storage), then resolve to a local WebView URL for playback. The implementation uses the Filesystem `downloadFile` API because Capacitor FileTransfer 2.0.7 requests public-storage permissions before downloading on Android versions below 11, even when the destination is app-private. Filesystem's direct download API is deprecated upstream, so reassess this path when a supported replacement avoids that permission gate. Downloading a surah proceeds one verse at a time; completed files stay available after an interrupted batch and are skipped on retry. These app-private files are removed when Qurabic is uninstalled. Web and PWA audio continue using the `qurabic-audio-cache-v1` CacheStorage bucket.

The service worker also caches the 2.2 MB MAQAM coordinate-to-gloss index with the reader shell. After an online launch, word study can use English stem glosses offline when the gloss API is unreachable. This does not provide offline Indonesian per-word translations, classical root definitions, or tafsir; attached Arabic prefixes and pronouns may also be absent from an English stem gloss.

The Android activity enables edge-to-edge layout. Capacitor SystemBars is configured to inject safe-area CSS variables, and the web layout uses the larger of those values and the browser `env(safe-area-inset-*)` values. This covers Android versions where WebView does not expose system-bar insets through `env()` consistently. Device verification remains required on Android 14 and Android 15/16, including WebView versions below and above 144, plus three-button and gesture navigation.

### Offline reader readiness

The offline pack action separately checks for the cached `/baca` document and every Next.js static asset referenced by that document. Text can still be saved when this shell check fails, but the UI tells the reader to open the reader online before relying on offline access.

| State | UI behavior |
| --- | --- |
| Checking service worker on first view | Wait up to three seconds for activation; do not claim the reader shell is ready while status is unknown. |
| Active service worker, reader page, and referenced assets cached | Show the saved Quran pack normally. |
| Worker inactive/unsupported, reader page or any referenced asset missing, or cache unavailable | Keep pack sync available and show a short instruction to open the reader online. |
| Pack sync running | Show sync progress; hide the shell warning until the check completes. |
| Reloaded or reopened | Recheck the cache; do not assume a previous readiness result is current. |

### Batas arsitektur dan izin Play Store

Capacitor loads the Qurabic-owned Vercel reader in a WebView. A new installation needs an online launch to cache the reader shell and an online Content Sync to download Quran text and translations; only then can the reader reopen those materials offline. Native app-specific behavior includes the offline Quran pack and user-requested recitation downloads to private app storage. In the Play Console review, verify the developer account controls or is authorized to load the site, and describe this first-launch requirement accurately. Do not claim that a fresh install reads the Quran without a connection.

## Server configuration

Set these as private server environment variables in Vercel. Never use a `NEXT_PUBLIC_` name or put the client secret in Android resources.

- `QF_CLIENT_ID`: Quran Foundation Content API client ID.
- `QF_CLIENT_SECRET`: matching confidential client secret.
- `QF_ENV=production`: production Quran Foundation environment. Do not leave this unset in production.
- `QF_CONTENT_SCOPES=content.sync.read content.quran.read content.translations.read`: Content Sync scope for Quran core, translations, and the Al-Afasy recitation resource.
- `QF_AUDIO_SCOPES=content.audio.read`: required by the integrated official Quran Foundation ayah-reciter catalog and per-verse audio lookup. Keep this separate from Content Sync scopes and request approval for the scope in the Quran Foundation Developer Console. Production uses only the official catalog; legacy EveryAyah/MP3Quran reciters remain development-only until their rights are resolved.
- `QF_SEARCH_SCOPES=search`: required for the server-side English verse search. Obtain Search API approval for the same backend client before enabling English search in production.

The Play Store AAB also requires Android upload-signing environment variables and a monotonically increasing `QURABIC_ANDROID_VERSION_CODE`; see [Play Store readiness](play-store-readiness.md). Do not commit signing files or passwords.

The production application must have approved Content API access for the requested scopes and resources. Without those credentials the app explains that offline sync is unavailable; it does not create a partial or guessed package. The audio catalog must also remain unavailable until `content.audio.read` is approved and the player has been switched to the official catalog.

The server-only adapter in `lib/quran-foundation/recitations.ts` and `/api/qf/recitations` fetches and validates the official reciter list and per-surah verse URLs. The player now uses that catalog and those URLs when the approved scope is configured; it caches a chapter's URL map in memory so ayah playback does not request the whole list repeatedly. Al-Afasy verse files continue to use the locally synced URL snapshot for offline playback. The adapter rejects URLs outside Quran Foundation's documented audio hosts. A production build now exposes only the official Al-Afasy resource until the approved catalog loads; if online API access is missing, playback reports an error rather than falling back to third-party audio. The legacy EveryAyah/MP3Quran choices remain available in development only until their rights are resolved.

## Content and refresh behavior

### Offline package consistency states

| State | Trigger | Required behavior |
| --- | --- | --- |
| No saved package | Fresh install or package removed | Show the download action; never serve partial rows as a saved pack |
| Consistent package | Complete bootstrap/sync committed | Allow offline reading and show the last successful sync time |
| Sync begins with changes | A sync page contains mutations for an existing package | Keep stored rows, but mark the package unavailable for offline reading before applying the first mutation |
| Sync in progress | More pages or snapshots remain | Keep the update control busy; do not label changing rows as a usable offline pack |
| Sync succeeds | All pages complete and the next sync token commits | Mark the package consistent and restore offline reading |
| Sync fails or is cancelled after changes | Network, storage, validation, or cancellation error | Preserve stored rows and the old checkpoint, but require a completed sync before offline use |
| Retry | User retries with the old checkpoint | Replay the pending source changes and restore consistency only after success |
| Reloaded while inconsistent | App restarts before the retry succeeds | Treat cached rows as unavailable offline and offer update when online |

The downloaded pack contains canonical Quran text (`quran_core:1`), the two verse translation resources used by Qurabic: Saheeh International (`translations:20`) and Kemenag RI (`translations:33`), and Al-Afasy recitation metadata (`recitations:7`) if it is available to the approved Content Sync client. Audio files are downloaded separately at the user's request. Each snapshot is checked against the complete resource before being marked saved: Quran core contains 114 chapters, 6,236 verses, 83,665 words, 30 juz, 60 hizb, and 240 rubʿ al-hizb rows; each translation must contain 6,236 unique, non-empty verse rows.

Quran Foundation's prelive dataset contains only Al-Fatihah and Al-Baqarah and cannot create a complete Qurabic pack. Use the approved production environment for a full download. When online, Qurabic checks for stale packs on reader launch, when connectivity returns, when the app becomes visible, and every 12 hours while open. It starts a refresh after six days to leave a one-day buffer inside the source's weekly sync window, and stores the new sync token only after every page and required snapshot has been applied. Each resource snapshot is staged and swapped atomically, so an interrupted snapshot cannot replace that resource with partial rows. A refresh spanning multiple resources is not a single cross-resource transaction: as soon as a page with changes arrives, Qurabic marks the package unavailable for offline reading until the entire sync succeeds. If sync fails, the prior checkpoint and all stored rows remain so the same changes can be retried, but potentially mixed rows are not served offline. Before displaying a consistent package, the reader also validates the selected surah's text, words, and translation.

Offline data includes Arabic text, verse translations, and synced Al-Afasy audio metadata. Arramooz, Arabic Stop Words classifications, and the Tāj al-ʿArūs form index are served by separate APIs and are not included in the offline pack; dictionary and root-form lookups need a connection. The recitation snapshot is accepted only with a valid Quran Foundation audio URL for every one of 6,236 verse keys. When sync changes or deletes a URL, Qurabic removes the superseded downloaded file. Word-by-word meanings, root entries, and tafsir are separate layers; the reader labels the word-study limitation when only the text pack is available. Users can explicitly save or remove Al-Afasy recordings for one verse or a complete surah. Native downloads use Capacitor Filesystem's app-private `DATA` directory, then verify and resolve each file for playback; the web reader uses CacheStorage. Other reciters and human translation recordings stream online and are not saved offline until their recording rights are verified.

Verse translation search can also fall back to the complete locally saved Kemenag or Saheeh translation if the online search request fails. The fallback checks that all 6,236 translation records and the corresponding Arabic text for each result are present; incomplete or inconsistent packages are not searched. Results identify the offline source. This does not make root lookup, word study, or tafsir available offline.

### Word-by-word offline data

Quran Foundation Content Sync supports the `word_by_word_translations` resource group for eligible one-word translation resources. The official snapshot example identifies resource `85` as English and shows rows keyed by `word_id`; it does not establish that an Indonesian resource is published or approved for this app. Resource IDs are environment-specific, and a snapshot for a resource that is not public returns `404`. QUL also lists an Indonesian word-by-word translation, resource `96`, but its licence page says copyright information is unavailable. Do not bundle or serve that dataset until its rights are clarified. If either language is added from Quran Foundation, it must be obtained and refreshed through Content Sync, validated against the complete Quran word set, and kept inside the end-user experience. The current Android pack does not include these word glosses. Production credentials are not present in this workspace, so a production snapshot and Indonesian resource ID remain unverified.

References: [Content Sync groups and resource availability](https://api-docs.quran.com/docs/tutorials/content-sync/getting-started/) and [word-by-word snapshot schema](https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/resources-snapshot/).

## Source conditions

- Quran Foundation requires resources available through Content Sync to be obtained and maintained through Content Sync, with a new sync at least every seven days when connected. Previously synced content can remain available during outages and should sync promptly when connectivity returns.
- Keep the content inside Qurabic's end-user experience. Do not publish the synced records as a separate dataset or API.
- The audio player credits Quran Foundation and the selected reciter; QF Content Sync, Kemenag RI, and Saheeh International remain separately attributed in the source registry.
- User-requested recitation downloads use Quran Foundation audio hosts and remain in private app storage. Keep synced audio records current, replace or delete files when the source URL changes or is removed, and delete files on user request or when access ends. The player does not persistently cache streamed audio during playback.

References: [Quran Foundation Developer Terms](https://api-docs.quran.com/legal/developer-terms/), [Content Sync Getting Started](https://api-docs.quran.com/docs/tutorials/content-sync/getting-started/), [recitation catalog and audio API](https://api-docs.quran.foundation/docs/content_apis_versioned/4.0.0/recitations/), [audio usage FAQ](https://api-docs.quran.foundation/docs/tutorials/faq/), [Client Flow](https://api-docs.quran.com/docs/tutorials/content-sync/client-flow/), and [Offline Cache Patterns](https://api-docs.quran.com/docs/tutorials/content-sync/offline-cache-patterns/).
