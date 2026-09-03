/**
 * Qurabic Lexicon Acquisition Pipeline - Deterministic Parser
 * Codename: Lexicon Harvest
 */

import { LaneEntryRecord, LexicalSense } from '../../lib/lexicon/types';
import { getVolumeForPage } from './normalize-lane';
import { buckwalterToArabic } from '../../lib/morphology/buckwalter';

export function cleanPerseusXml(pxml: string): string {
  if (!pxml) return '';
  // 1. Strip <form>...</form> block
  let t = pxml.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '');
  // 2. Replace break markers
  t = t.replace(/<lb\s*\/?>/gi, ' ');
  // 3. Strip all other XML tags
  t = t.replace(/<[^>]+>/g, ' ');
  // 4. Decode HTML entities
  t = t.replace(/&amp;/g, '&')
       .replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>')
       .replace(/&quot;/g, '"')
       .replace(/&#39;/g, "'");
  // 5. Normalize whitespace
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

export function extractPrimaryDefinition(cleanText: string): string {
  if (!cleanText) return '';
  
  // Strip cross-references like ": see 1", ": and see also ...", ": see the next paragraph"
  let s = cleanText.replace(/^:\s*(and\s+)?see\s+[^.]+\.\s*/i, '').trim();
  
  // Look for first sentence ending in period or semicolon
  const match = s.match(/^([^.;]{10,250}[.;])/);
  if (match) {
    const candidate = match[1].trim();
    if (!candidate.toLowerCase().startsWith('see ') && candidate.length > 15) {
      return candidate;
    }
  }

  // Fallback: first 200 characters up to whole word
  if (s.length > 200) {
    const truncated = s.slice(0, 200);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 50 ? truncated.slice(0, lastSpace) : truncated) + '...';
  }

  return s;
}

export function parseEntryToSenses(
  cleanText: string,
  entryId: string,
  page: number,
  itype?: string
): LexicalSense[] {
  const volume = getVolumeForPage(page);
  const senses: LexicalSense[] = [];

  if (!cleanText) return senses;

  // Split on Lane's sense dividers: "― -b2-", "― -b3-", "-A2-", "-A3-", paragraph divisions
  const parts = cleanText.split(/(?:―\s*-[a-z0-9]+-|-A[0-9]+-)/i).map(p => p.trim()).filter(p => p.length > 0);

  if (parts.length <= 1) {
    senses.push({
      senseIndex: 1,
      text: cleanText.length > 600 ? cleanText.slice(0, 600) + '...' : cleanText,
      source: "Lane's Arabic-English Lexicon",
      citation: {
        volume,
        page,
        entryId,
        itype
      }
    });
    return senses;
  }

  parts.slice(0, 5).forEach((partText, idx) => {
    senses.push({
      senseIndex: idx + 1,
      text: partText.length > 500 ? partText.slice(0, 500) + '...' : partText,
      source: "Lane's Arabic-English Lexicon",
      citation: {
        volume,
        page,
        entryId,
        itype
      }
    });
  });

  return senses;
}

export function parseRawLaneRow(row: {
  id: number;
  word?: string;
  bword?: string;
  bareword?: string;
  root?: string;
  broot?: string;
  itype?: string;
  page?: number;
  perseusxml?: string;
}): LaneEntryRecord {
  const entryId = `lane_${row.id}`;
  const page = row.page || 1;
  const volume = getVolumeForPage(page);

  const cleanText = cleanPerseusXml(row.perseusxml || '');
  const primaryDef = extractPrimaryDefinition(cleanText);
  const senses = parseEntryToSenses(cleanText, entryId, page, row.itype);

  const rootBw = (row.broot || '').trim();
  const rootArabic = row.root?.trim() || (rootBw ? buckwalterToArabic(rootBw) : '');
  const headwordBw = (row.bword || '').trim();
  const headwordArabic = row.word?.trim() || (headwordBw ? buckwalterToArabic(headwordBw) : '');

  return {
    entryId,
    rootArabic,
    rootBw,
    headwordArabic,
    headwordBw,
    bareword: row.bareword || '',
    itype: row.itype?.trim() || undefined,
    volume,
    page,
    definition: primaryDef || undefined,
    sourceDefinition: cleanText || undefined,
    translationMethod: 'classical_source',
    senses,
    rawSourceText: cleanText
  };
}
