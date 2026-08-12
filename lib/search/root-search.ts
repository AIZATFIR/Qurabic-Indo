import { RootWord } from '../types/morphology';
import { ROOT_DATABASE } from '../data/roots';

// Removes Arabic diacritics / harakat for accurate searching
export function stripArabicHarakat(text: string): string {
  return text.replace(/[\u064B-\u0652\u0670\u0640]/g, '');
}

// Normalizes input strings (Latin, Arabic, or Indonesian)
export function normalizeQuery(query: string): string {
  if (!query) return '';
  let cleaned = query.trim().toLowerCase();
  
  // Normalize hyphenated root representations e.g. "s-b-r" or "ص-ب-ر"
  cleaned = cleaned.replace(/[-_.\s]+/g, '');
  
  // Strip Arabic diacritics
  cleaned = stripArabicHarakat(cleaned);

  return cleaned;
}

export function searchRoots(query: string): RootWord[] {
  const normalized = normalizeQuery(query);
  if (!normalized) return ROOT_DATABASE;

  return ROOT_DATABASE.filter((root) => {
    // 1. Direct ID / Slug match (e.g. "s-b-r", "sbr")
    const idClean = root.id.replace(/-/g, '');
    if (idClean.includes(normalized)) return true;

    // 2. Arabic root match (e.g. "صبر", "ص ب ر")
    const arabicJoinedClean = stripArabicHarakat(root.rootArabicJoined);
    const arabicSpacedClean = stripArabicHarakat(root.rootArabic.replace(/\s+/g, ''));
    if (arabicJoinedClean.includes(normalized) || arabicSpacedClean.includes(normalized)) return true;

    // 3. Latin root match (e.g. "sabar", "sabara", "kataba")
    if (root.rootLatin.toLowerCase().includes(normalized)) return true;

    // 4. Indonesian & English title match
    if (root.titleIndo.toLowerCase().includes(normalized)) return true;
    if (root.titleEnglish.toLowerCase().includes(normalized)) return true;

    // 5. Tag & Etymology match (e.g. "sobaro", "batu", "tulis", "patience")
    const tagMatch = root.tags.some(tag => normalizeQuery(tag).includes(normalized));
    if (tagMatch) return true;

    // 6. Meanings match
    const meaningMatch = root.meaningsIndonesian.some(m => m.toLowerCase().includes(normalized));
    if (meaningMatch) return true;

    if (root.etymologyNote.toLowerCase().includes(normalized)) return true;

    // 7. Derivatives match (Verbs & Nouns)
    const verbMatch = root.verbs.some(v => 
      v.transliteration.toLowerCase().includes(normalized) || 
      v.meaningIndo.toLowerCase().includes(normalized) ||
      stripArabicHarakat(v.arabic).includes(normalized)
    );
    if (verbMatch) return true;

    const nounMatch = root.nouns.some(n => 
      n.transliteration.toLowerCase().includes(normalized) || 
      n.meaningIndo.toLowerCase().includes(normalized) ||
      stripArabicHarakat(n.arabic).includes(normalized)
    );
    if (nounMatch) return true;

    return false;
  });
}

export function getRootBySlug(slug: string): RootWord | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  
  return ROOT_DATABASE.find(r => 
    r.id.toLowerCase() === cleanSlug || 
    r.rootLatin.toLowerCase() === cleanSlug ||
    r.rootArabicJoined === cleanSlug ||
    r.id.replace(/-/g, '') === cleanSlug.replace(/-/g, '')
  );
}
