import { AuthoritativeRootMorphology } from './types';
import { RootWord, VerseOccurrence } from '../types/morphology';
import { ROOT_DATABASE } from '../data/roots';
import { PILOT_XWF_AUTHORITATIVE_DATA } from './pilot-data';
import { CURATED_ROOT_SEMANTICS } from '../data/root-semantics';

/**
 * Returns Authoritative Root Morphology & Occurrences for pilot root in QAC v0.4
 */
export function getAuthoritativeRootMorphology(rootBw: string): AuthoritativeRootMorphology | null {
  if (rootBw === 'xwf' || rootBw === 'kh-w-f') {
    return PILOT_XWF_AUTHORITATIVE_DATA;
  }
  return null;
}

/**
 * Checks if the requested slug/root is part of the authoritative pilot validation
 */
export function isAuthoritativePilotRoot(slug: string): boolean {
  if (!slug) return false;
  const s = slug.toLowerCase().trim();
  return s === 'kh-w-f' || s === 'khwf' || s === 'xwf' || s === 'x-w-f' || s === 'خ-و-ف';
}

/**
 * Resolves RootWord for pilot roots directly from QAC authoritative index
 */
export function getAuthoritativePilotRootWord(slug: string): RootWord | null {
  if (!isAuthoritativePilotRoot(slug)) return null;

  const authData = getAuthoritativeRootMorphology('xwf');
  if (!authData) return null;

  const xwfSemantics = CURATED_ROOT_SEMANTICS['x-w-f'];

  return {
    id: 'kh-w-f',
    rootArabic: authData.rootArabic,
    rootArabicJoined: 'خوف',
    rootLatin: 'khauf',
    titleIndo: xwfSemantics?.titleIndo || 'Rasa Takut / Kekhawatiran / Kewaspadaan / Khauf',
    titleEnglish: 'Fear / Dread / Apprehension',
    coreMeaning: xwfSemantics?.coreMeaning,
    usagePatterns: xwfSemantics?.usagePatterns,
    contextualNote: xwfSemantics?.contextualNote,
    meaningsIndonesian: xwfSemantics?.meaningsIndonesian || [
      'Rasa takut dan kegentaran hati kepada Allah',
      'Kekhawatiran manusiawi terhadap bahaya',
      'Peringatan ancaman siksa dan hisab',
      'Kewaspadaan batin dalam memelihara ketaatan'
    ],
    etymologyNote: xwfSemantics?.coreMeaning || 'Akar kata خ و ف berkaitan dengan rasa takut dan kewaspadaan.',
    totalOccurrences: authData.totalSegments,
    verbsCount: authData.verbsCount,
    nounsCount: authData.nounsCount,
    verbs: authData.verbs,
    nouns: authData.nouns,
    occurrences: authData.occurrences,
    tags: ['khauf', 'takut', 'khawatir', 'xwf', 'x-w-f', 'kh-w-f', 'خوف', 'خ و ف']
  };
}

/**
 * Loads full occurrences array on-demand from chunk storage
 */
export function getRootOccurrencesFromChunk(slug: string): VerseOccurrence[] {
  if (!slug || typeof window !== 'undefined') return [];
  try {
    const nodeReq = (globalThis as any).require || eval('require');
    const fs = nodeReq('fs');
    const path = nodeReq('path');
    const clean = slug.trim();
    const filePath = path.join(process.cwd(), 'lib/data/occurrences', `${clean}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    const lowerPath = path.join(process.cwd(), 'lib/data/occurrences', `${clean.toLowerCase()}.json`);
    if (fs.existsSync(lowerPath)) {
      return JSON.parse(fs.readFileSync(lowerPath, 'utf8'));
    }
  } catch (e) {}
  return [];
}
