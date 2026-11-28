# Reader audio state table

| State | Required visible behavior |
|---|---|
| Before playback | Player stays hidden; no playback warning. |
| Waiting for audio | Player remains visible with a loading indicator and the selected ayah. Translation startup/buffering may wait up to 10 seconds before trying the next source. |
| Arabic running | Player identifies the selected human reciter and current ayah. |
| Translation running | Player identifies the human translation and selected interface language. |
| Done | Playback stops at the configured end; the player offers Play again and does not claim another track is active. |
| Cancelled or paused | Player shows a paused state; resuming continues or restarts the same ayah. |
| Reloaded | No audio is claimed to be playing; saved preferences may be restored, but playback requires a user action unless the URL explicitly requests autoplay. |
| Translation unavailable | Show a bilingual status that the human translation could not be loaded; Arabic recitation continues or resumes according to handsfree order. |
| Active verse lacks a known human translation recording | Check the current verse, not only the surah; show the limitation before/while it plays, preserve Arabic playback, and do not announce chapter-wide unavailability when neighboring verses are covered. |
| Recitation error | Show a bilingual alert with retry guidance; do not silently advance past an Arabic recitation failure. |
| Empty translation data | Do not synthesize speech. Skip the unavailable translation phase, disclose the limitation, and keep Arabic recitation usable. |
| Search request (`play=1`) | Keep the autoplay request in the URL while verse data or audio is pending. Clear it only after the selected ayah reaches `playing`; if browser autoplay is blocked, keep the player available for a user-initiated retry. |
| Search request fails | Do not clear `play=1` or claim playback. Keep the player’s loading/error state and retry action visible. |
| Standalone word or random-verse audio | Register the `Audio` object while it is loading/playing so app-wide ad shields can see it, even though the element is not attached to the DOM. |
| Standalone audio ended, errored, replaced, or unmounted | Remove the object from the active-audio registry and release the playback reference; the ad shield must no longer treat it as active. |
| Audio starts or navigation enters a protected reading route while an ad is preparing | Recheck the active audio registry and current route immediately before showing the ad; skip the ad if either guard is active. |
| Surah audio download starts | Download at most three ayah files concurrently; report completed files without loading the whole surah into memory. |
| Surah audio download is stopped | Finish the current small batch, keep completed files, then report that the surah download is incomplete. |
| Any file download fails | Wait for the active batch to settle, keep files already saved, and never report the surah as fully downloaded. |

Scope: `useQuranAudio` state transitions, standalone word/random-verse audio, and the compact/expanded `QuranAudioPlayer`. This table records the intended behavior before visual or timing verification; real-device playback checks remain a release gate.
