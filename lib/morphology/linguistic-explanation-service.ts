/**
 * Optional shape retained for API compatibility. A linguistic explanation is
 * not published unless its claims have been reviewed and individually sourced.
 */
export interface LinguisticExplanation {
  wordArabic: string;
  rootArabicJoined: string;
  rootArabicSpaced: string;
  baseLemmaArabic: string;
  baseLemmaMeaning: string;
  primaryMeaning: string;
  narrativeText: string;
  quranicThemeText?: string;
  fullText: string;
  isCurated: boolean;
}

/**
 * Fail closed until source-reviewed profiles are available. Root membership
 * alone cannot establish a lexical definition or a Quranic theological theme.
 */
export function getLinguisticExplanation(_params: {
  wordArabic: string;
  rootArabic?: string;
  rootSlug?: string;
  lemmaArabic?: string;
  pos?: string;
  posLabelIndo?: string;
  primaryMeaning?: string;
  isParticle?: boolean;
}): LinguisticExplanation | null {
  return null;
}
