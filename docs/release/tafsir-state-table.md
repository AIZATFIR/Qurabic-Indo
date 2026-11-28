# Reader tafsir states

| State | Required behavior |
|---|---|
| Closed | Tafsir text is not fetched until a verse's tafsir is opened. |
| Loading | Show a localized loading state for the selected verse. |
| Available | Show the Indonesian text, archive label, and the existing provenance note. |
| Source has no entry | Show that no Indonesian tafsir was returned for this verse. |
| Request failed | Show a localized connection/load error and a retry action; do not call the tafsir unavailable. |
| Another verse opens | Only the newest request controls the visible loading indicator; completed responses may cache under their own verse key. |
| Surah changes | Clear visible/cache state and ignore responses for the previous surah. |
| Closed while loading | Cancel the pending request and clear its loading state. |
| Reopened after failure | Retry the request without requiring a page reload. |

The source is Indonesian-only. English mode labels it as Indonesian tafsir and must not imply an English translation exists.

## Search result tafsir

| State | Required behavior |
|---|---|
| Closed | Do not request tafsir until the user opens it. |
| Loading | Show a localized status; English mode must say the source text is Indonesian. |
| Available | Show Indonesian text, archive label, and the provenance limitation. |
| Source has no entry | Show an unavailable message, not a network error. |
| Request failed | Offer retry; do not replace the text with generated commentary. |
| Closed while loading | Abort the request; reopening can request it again. |
