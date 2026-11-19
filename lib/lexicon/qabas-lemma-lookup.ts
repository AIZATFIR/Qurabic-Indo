type QabasLemmaIndex = Record<string, Array<string | null>>;
let cachedIndex: QabasLemmaIndex | undefined;

function loadIndex(): QabasLemmaIndex {
  cachedIndex ??= require('./data/qabas-lemma-ids.json') as QabasLemmaIndex;
  return cachedIndex;
}

export function getQabasLemmaId(
  coordinate: string | undefined,
  index?: QabasLemmaIndex,
): string | undefined {
  const match = coordinate?.match(/^(\d+):(\d+):(\d+)$/);
  if (!match) return undefined;
  return (index || loadIndex())[`${match[1]}:${match[2]}`]?.[Number(match[3]) - 1] || undefined;
}
