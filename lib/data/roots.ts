import { RootWord } from '../types/morphology';
import rootsSummaryData from './roots-summary.json';

/**
 * ==============================================================================
 * QURABIC AUTHORITATIVE ROOT DATABASE (1,642 ROOTS)
 * ==============================================================================
 * Source of Truth: Quranic Arabic Corpus (QAC v0.4, Univ. of Leeds)
 * Cryptographic Source Hash: SHA-256 a1d12923815341face765083805d2148ed2d9f5cc3f7d6665219d887675d8c46
 * ==============================================================================
 */

export const ROOT_DATABASE: RootWord[] = rootsSummaryData as unknown as RootWord[];
