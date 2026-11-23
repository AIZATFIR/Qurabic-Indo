import { buckwalterToArabic } from './buckwalter';
import type { NormalizedMorphologyRecord } from './types';

export interface QACLookupResult {
  rootBw?: string;
  rootArabic?: string;
  lemmaBw?: string;
  lemmaArabic?: string;
  pos: 'Isim' | "Fi'il" | 'Harf';
  posRaw: string;
  verbType?: 'Madhi' | "Mudhari'" | 'Amr';
  verbForm?: string;
  nounType?: "Isim Fa'il" | "Isim Maf'ul" | 'Masdar' | 'Nomina';
  wazanOrForm?: string;
  grammaticalRole: string;
}

type LookupTuple = [string, string, string, string, string];
type LookupMap = Record<string, LookupTuple>;

let locationsMap: LookupMap | undefined;
let tokensMap: LookupMap | undefined;

function getLocationsMap(): LookupMap {
  if (!locationsMap) locationsMap = require('./data/qac-locations.json') as LookupMap;
  return locationsMap;
}

function getTokensMap(): LookupMap {
  if (!tokensMap) tokensMap = require('./data/qac-tokens.json') as LookupMap;
  return tokensMap;
}

function parseLookupTuple(tuple: [string, string, string, string, string]): QACLookupResult {
  const [rootBw, lemmaBw, posRaw, typeRaw, formRaw] = tuple;
  const rootArabic = rootBw ? buckwalterToArabic(rootBw).split('').join(' ') : undefined;
  const lemmaArabic = lemmaBw ? buckwalterToArabic(lemmaBw) : undefined;

  let pos: 'Isim' | "Fi'il" | 'Harf' = 'Isim';
  let verbType: 'Madhi' | "Mudhari'" | 'Amr' | undefined;
  let nounType: "Isim Fa'il" | "Isim Maf'ul" | 'Masdar' | 'Nomina' | undefined;
  let verbForm = formRaw || undefined;
  let wazanOrForm = '';
  let grammaticalRole = '';

  if (posRaw === 'V') {
    pos = "Fi'il";
    if (typeRaw === 'PERF') verbType = 'Madhi';
    else if (typeRaw === 'IMPF') verbType = "Mudhari'";
    else if (typeRaw === 'IMPV') verbType = 'Amr';

    const fLabel = verbForm ? ` ${verbForm}` : ' Form I (Mujarrad)';
    wazanOrForm = `Fi'il ${verbType || ''}${fLabel}`.trim();
    grammaticalRole = `Fi'il ${verbType || 'Kata Kerja'}${fLabel}`.trim();
  } else if (posRaw === 'N' || posRaw === 'PN' || posRaw === 'ADJ') {
    pos = 'Isim';
    if (typeRaw === 'ACT_PCPL') {
      nounType = "Isim Fa'il";
      wazanOrForm = "Wazan Isim Fa'il (Pelaku)";
      grammaticalRole = "Isim Fa'il (Subjek / Pelaku)";
    } else if (typeRaw === 'PASS_PCPL') {
      nounType = "Isim Maf'ul";
      wazanOrForm = "Wazan Isim Maf'ul (Objek)";
      grammaticalRole = "Isim Maf'ul (Objek / Penerima)";
    } else if (typeRaw === 'VN') {
      nounType = 'Masdar';
      wazanOrForm = 'Masdar (Verbal Noun)';
      grammaticalRole = 'Masdar (Kata Benda Aksi / Kata Asal)';
    } else if (posRaw === 'ADJ') {
      nounType = 'Nomina';
      wazanOrForm = 'Shifah Musyabbahah';
      grammaticalRole = 'Isim Sifat (Kata Sifat / Adjektiva)';
    } else {
      nounType = 'Nomina';
      wazanOrForm = 'Isim Jamid / Bentuk Baku';
      grammaticalRole = 'Isim (Kata Benda / Nomina)';
    }
  } else if (posRaw === 'DEM') {
    pos = 'Isim';
    wazanOrForm = 'Isim Mabni (Tetap)';
    grammaticalRole = 'Isim Isyarah (Kata Benda Penunjuk / Demonstratif)';
  } else if (posRaw === 'REL') {
    pos = 'Isim';
    wazanOrForm = 'Isim Mabni (Tetap)';
    grammaticalRole = 'Isim Maushul (Kata Benda Penghubung / Relatif)';
  } else if (posRaw === 'PRON') {
    pos = 'Isim';
    wazanOrForm = 'Dhamir Mabni';
    grammaticalRole = 'Dhamir (Kata Ganti Orang)';
  } else {
    pos = 'Harf';
    wazanOrForm = 'Mabni (Tetap)';
    grammaticalRole = 'Harf / Partikel (Kata Tugas)';
  }

  return {
    rootBw: rootBw || undefined,
    rootArabic,
    lemmaBw: lemmaBw || undefined,
    lemmaArabic,
    pos,
    posRaw,
    verbType,
    verbForm,
    nounType,
    wazanOrForm,
    grammaticalRole
  };
}

/** Converts a morphology record already found by coordinate into the same lookup shape. */
export function lookupQACRecord(record: NormalizedMorphologyRecord): QACLookupResult {
  const posRaw = record.rawFeatures.match(/(?:^|\|)POS:([^|]+)/)?.[1] || record.pos;
  const typeRaw = record.verbType || record.nounType || '';
  return parseLookupTuple([
    record.root || '',
    record.lemma || '',
    posRaw,
    typeRaw,
    record.verbForm || '',
  ]);
}

/**
 * High-performance, zero-IO lookup by Quranic word coordinate (e.g. "2:208:4")
 */
export function lookupQACByLocation(location: string): QACLookupResult | null {
  const parts = location.split(':');
  const locKey = parts.length >= 3 ? `${parts[0]}:${parts[1]}:${parts[2]}` : location;
  const tuple = getLocationsMap()[locKey];
  if (!tuple) return null;
  return parseLookupTuple(tuple);
}

/**
 * High-performance, zero-IO lookup by normalized Arabic surface token
 */
export function lookupQACByToken(cleanArabicToken: string): QACLookupResult | null {
  if (!cleanArabicToken) return null;
  const tuple = getTokensMap()[cleanArabicToken];
  if (!tuple) return null;
  return parseLookupTuple(tuple);
}
