export function getRootEntryLoadState(uniqueAyahs: number, hasLexicon: boolean, occurrenceCount: number) {
  return {
    rootData: uniqueAyahs === 0 || !hasLexicon,
    occurrences: occurrenceCount === 0,
  };
}
