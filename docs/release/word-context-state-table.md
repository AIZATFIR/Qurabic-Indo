# Word study verse-context states

## Ayah search result pages

| State | Trigger / source | Expected display |
| --- | --- | --- |
| Initial loading | Query changes or language changes | Clear prior query results and show the existing search status |
| First page | Search request returns up to 30 verses | Render results and expose a next-page control only when more results exist |
| Loading more | User requests the next page | Keep current verses visible and disable only the page control |
| More results | Next page succeeds | Append verses without duplicates; retain the next-page control when more remain |
| Last page | Next page has fewer than 30 results | Append the page and hide the control |
| More-page error | Later request fails | Preserve loaded verses and offer retry for the same page |
| Query/language changed | Search effect cleanup runs | Abort in-flight work and discard results from the old query/language |
| Empty | First page returns no verses | Show the existing empty state, with no page control |
| Reloaded | Search page opens again | Start at page one; later pages remain user initiated |

| State | Trigger / source | Expected display |
| --- | --- | --- |
| Indonesian | Indonesian interface; Kemenag text is present in the selected word context | Arabic verse and Kemenag RI text; no English request |
| English, cached | English interface; resource 20 exists in the saved package | Arabic verse and Saheeh International text from IndexedDB |
| English, loading | No saved verse translation; valid surah and verse coordinates | Arabic verse and a short loading status while the server fetches resource 20 |
| English, available | Quran.com API returns a non-empty resource 20 translation | Arabic verse and Saheeh International text; source is named |
| English, unavailable | Empty API result, offline network, timeout, or upstream error for a known verse | No stale translation; show a localized unavailable status |
| English, no coordinates | No surah and verse are available from the word study | Do not render an incomplete verse-context section |
| Ayah/language changed | Effect dependencies change | Abort the previous request, ignore late IndexedDB results, and load only the selected verse/language |
| Reloaded | Word study is opened again | Read the saved verse translation first, then request online only when absent |

## Arabic dictionary root search

| State | Trigger / source | Expected display |
| --- | --- | --- |
| Idle | No Arabic query | No Arramooz groups or pagination control |
| Initial loading | A valid Arabic word query | Localized search status; do not show stale roots from the prior query |
| Page available | Search returns more than eight matching roots | Show the first eight roots and a control to load the next page |
| Loading more | User requests another page | Keep current roots visible and disable the page control with a loading label |
| More results available | Next request succeeds and more roots remain | Append the new roots in deterministic alphabetical order; retain prior results |
| Last page | Next request exhausts the matching roots | Append results and remove the pagination control |
| More-page error | A later request fails | Keep loaded roots visible and show a localized retry action |
| Query changed or page closed | Search effect is cleaned up | Abort pending pagination, reset the offset and discard old-query results |
| Empty | No Arramooz roots match | Show the existing empty-search message; do not show a page control |
| Reloaded | Same search URL is opened again | Start at the first page, then allow the user to continue paging |

## Arramooz forms on a root entry

| State | Trigger / source | Expected display |
| --- | --- | --- |
| Closed | Root page opens | Keep the additional form list collapsed unless no Lane definition is indexed |
| Initial loading | User opens the Arramooz list or the root has no Lane definition | Show a loading status; preserve any data already loaded for this root |
| Page available | First request returns up to 60 forms | Show source forms, loaded/total count, and a next-page control when more exist |
| Loading more | User requests the next form page | Keep already loaded rows visible and disable the control during the request |
| More forms available | Next request succeeds and records remain | Append the page in stable source order and preserve prior rows |
| Last page | No more records remain | Hide the next-page control |
| More-page error | A later request fails | Keep prior forms visible and offer retry at the next offset |
| Root changed | The component switches roots | Abort the old request and clear forms and offsets before loading the new root |
| Empty | No additional Arramooz forms exist | Show a localized empty state without a page control |
| Reloaded | Root page opens again | Start with the first page; later pages remain user initiated |

## Arabic Stop Words particle forms

| State | Trigger / source | Expected display |
| --- | --- | --- |
| Initial result | Query matches one or more particle lemmas | Show up to 60 source-classified forms per lemma and a next-page control when more remain |
| Loading more | User requests more forms for one lemma | Keep current forms visible and disable only that lemma's page control |
| More forms available | Page request succeeds | Append forms in stable source order and retain the next offset |
| Last page | No further forms remain | Remove that lemma's page control |
| Page error | A later request fails | Preserve loaded forms and offer retry at the same offset |
| Query changed or page closed | Search effect is cleaned up | Abort page request and clear old query's particle results |
| Empty | No source rows match | Keep the existing dictionary empty state |
| Reloaded | Same term is searched again | Start at the first source page |

## Tāj al-ʿArūs lookup matches

| State | Trigger / source | Expected display |
| --- | --- | --- |
| Initial result | Arabic form or root matches the Tāj index | Show up to 12 matching roots and the total match count |
| Loading more | User requests another page | Preserve loaded roots and show a loading state on the page control |
| More results available | Page request succeeds | Append the next roots without duplicates and keep the source order |
| Last page | No further matching roots remain | Remove the page control |
| Page error | A later request fails | Preserve loaded roots and offer retry at the same offset |
| Query changed or page closed | Search effect is cleaned up | Abort the request and reset matches and offset |
| Empty | No root/form matches | Keep the existing dictionary empty state |
| Reloaded | Search URL is opened again | Start at page zero |
