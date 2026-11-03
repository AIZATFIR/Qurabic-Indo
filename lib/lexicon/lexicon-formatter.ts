/** Preserve transcribed source text; guessing Buckwalter corrupts English words. */
export function formatLexiconSenseText(rawText: string): string {
  return rawText?.trim() || '';
}

export interface LexiconToken {
  type: 'arabic' | 'citation' | 'text';
  content: string;
}

/**
 * Parses formatted Lane's Lexicon sense text into distinct segments
 * so Arabic words can be rendered with large, dedicated font-arabic and <bdi> isolation.
 */
export function parseLexiconSenseTokens(rawText: string): LexiconToken[] {
  const formatted = formatLexiconSenseText(rawText);
  if (!formatted) return [];

  // Match Arabic chunks (one or more Arabic words/harakat)
  const segments: LexiconToken[] = [];
  const regex = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+(?:\s+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)*)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(formatted)) !== null) {
    if (match.index > lastIndex) {
      const textPart = formatted.substring(lastIndex, match.index);
      if (textPart) {
        segments.push({ type: 'text', content: textPart });
      }
    }

    segments.push({ type: 'arabic', content: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < formatted.length) {
    segments.push({ type: 'text', content: formatted.substring(lastIndex) });
  }

  return segments;
}
