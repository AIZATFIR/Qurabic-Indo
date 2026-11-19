export function createLaneManifestLookup(
  quranManifest: Record<string, string | null>,
  loadFullManifest: () => Record<string, string>,
) {
  let fullManifest: Record<string, string> | undefined;

  return (key: string, quranOnly = false): string | undefined => {
    if (Object.hasOwn(quranManifest, key)) {
      const quranChunk = quranManifest[key];
      if (quranChunk || quranOnly) return quranChunk || undefined;
    }
    fullManifest ||= loadFullManifest();
    return fullManifest[key];
  };
}
