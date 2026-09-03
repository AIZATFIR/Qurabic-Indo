/**
 * Qurabic Lexicon Acquisition Pipeline - Audit & Verification Suite
 * Codename: Lexicon Harvest
 */

import { getQACAuthoritativeIndex } from '../../lib/morphology/qac-parser';
import { resolveClassicalLexiconForLemma } from '../../lib/lexicon/lane-loader';
import { resolveCanonicalWordDetail } from '../../lib/morphology/canonical-service';

export interface AuditReport {
  totalQacLemmas: number;
  resolvedLemmas: number;
  unresolvedLemmas: number;
  coveragePercentage: number;
  sampleResults: Array<{
    coordinate: string;
    wordArabic: string;
    lemma: string;
    root?: string;
    resolved: boolean;
    definitionSnippet?: string;
    page?: number;
    volume?: number;
    isRootEntry?: boolean;
  }>;
}

const SAMPLE_BENCHMARKS = [
  { coordinate: '1:5:4', arabic: 'نَسْتَعِينُ', lemma: '{sotaEaAna', root: 'Ewn' },
  { coordinate: '10:24:9', arabic: 'فَٱخْتَلَطَ', lemma: '{xotalaTa', root: 'xlT' },
  { coordinate: '2:2:4', arabic: 'رَيْبَ', lemma: 'rayob', root: 'ryb' },
  { coordinate: '2:153:6', arabic: 'الصَّابِرِينَ', lemma: 'SaAbir', root: 'Sbr' },
  { coordinate: '1:1:3', arabic: 'ٱلرَّحْمَٰنِ', lemma: 'raHoma`n', root: 'rHm' },
  { coordinate: '12:80:1', arabic: 'فَلَمَّآ', lemma: 'lam~aA', root: undefined },
  { coordinate: '12:51:7', arabic: 'عِندِنَا', lemma: 'Einda', root: undefined },
  { coordinate: '2:5:1', arabic: 'أُو۟لَـٰٓئِكَ عَلَىٰ', lemma: 'EalaY`', root: undefined },
  { coordinate: '1:1:1', arabic: 'بِسْمِ', lemma: '{som', root: 'smw' },
  { coordinate: '2:255:3', arabic: 'لَا تَأْخُذُهُۥ', lemma: 'Aaxa*a', root: 'Ax*' },
  { coordinate: '2:255:10', arabic: 'يَـُٔودُهُۥ', lemma: 'AaAda', root: 'Awd' },
  { coordinate: '2:194:9', arabic: 'فَٱعْتَدُوا۟', lemma: '{EotadaY', root: 'Edw' },
  { coordinate: '2:263:1', arabic: 'قَوْلٌ', lemma: 'qawol', root: 'qwl' },
  { coordinate: '2:284:7', arabic: 'يُحَاسِبْكُم', lemma: 'HaAsaba', root: 'Hsb' },
  { coordinate: '3:103:2', arabic: 'وَٱعْتَصِمُوا۟', lemma: '{EotaSama', root: 'ESm' },
  { coordinate: '3:14:1', arabic: 'زُيِّنَ', lemma: 'zuy~ina', root: 'zyn' },
  { coordinate: '4:29:4', arabic: 'بَيْنَكُم', lemma: 'bayona', root: undefined },
  { coordinate: '4:1:1', arabic: 'يَـٰٓأَيُّهَا', lemma: 'Aay~uhaA', root: undefined },
  { coordinate: '5:3:3', arabic: 'ٱلْمَيْتَةُ', lemma: 'mayotap', root: 'mwt' },
  { coordinate: '5:90:3', arabic: 'ٱلْخَمْرُ', lemma: 'xamor', root: 'xmr' }
];

export async function runLexiconAudit(): Promise<AuditReport> {
  const qacIndex = getQACAuthoritativeIndex();
  const uniqueLemmas = Array.from(qacIndex.recordsByLemma.keys());

  let resolvedCount = 0;
  let unresolvedCount = 0;

  for (const lem of uniqueLemmas) {
    const records = qacIndex.recordsByLemma.get(lem) || [];
    const rootBw = records.find(r => r.root)?.root;
    const res = await resolveClassicalLexiconForLemma(lem, rootBw);

    if (res.hasLexicalData && res.senses.length > 0) {
      resolvedCount++;
    } else {
      unresolvedCount++;
    }
  }

  const sampleResults = [];
  for (const sample of SAMPLE_BENCHMARKS) {
    const detail = resolveCanonicalWordDetail(sample.coordinate);
    const lex = detail.lexicon;

    sampleResults.push({
      coordinate: sample.coordinate,
      wordArabic: sample.arabic,
      lemma: sample.lemma,
      root: sample.root,
      resolved: !!lex?.hasLexicalData,
      definitionSnippet: lex?.definition || lex?.senses[0]?.text.slice(0, 100),
      page: lex?.page,
      volume: lex?.volume,
      isRootEntry: lex?.isRootEntry
    });
  }

  return {
    totalQacLemmas: uniqueLemmas.length,
    resolvedLemmas: resolvedCount,
    unresolvedLemmas: unresolvedCount,
    coveragePercentage: (resolvedCount / uniqueLemmas.length) * 100,
    sampleResults
  };
}

if (require.main === module) {
  (async () => {
    console.log('Running Qurabic Lexicon Harvest Audit...');
    const report = await runLexiconAudit();
    console.log('====================================================');
    console.log(`• Total Unique QAC Lemmas : ${report.totalQacLemmas}`);
    console.log(`• Resolved Lemmas         : ${report.resolvedLemmas} (${report.coveragePercentage.toFixed(2)}%)`);
    console.log(`• Unresolved Lemmas       : ${report.unresolvedLemmas}`);
    console.log('====================================================');
    console.log('\n--- 20 Sample Lemma Benchmark Audit ---');
    console.table(report.sampleResults.map(s => ({
      Coord: s.coordinate,
      Arabic: s.wordArabic,
      Lemma: s.lemma,
      Resolved: s.resolved ? '✅ PASS' : '❌ FAIL',
      Page: s.page ? `p.${s.page} (Vol ${s.volume})` : '-',
      Type: s.isRootEntry ? 'Root Entry' : 'Exact Lemma',
      Snippet: (s.definitionSnippet || '').slice(0, 45) + '...'
    })));
  })();
}
