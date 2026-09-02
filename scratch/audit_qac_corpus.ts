import fs from 'fs';
import path from 'path';

const qacPath = path.join(process.cwd(), 'lib/quranic-corpus-morphology-0.4.txt');

// Buckwalter to Arabic Unicode converter
const BUCKWALTER_TO_ARABIC: Record<string, string> = {
  "'": 'ء', '>': 'أ', '&': 'ؤ', '<': 'إ', '}': 'ئ', 'A': 'ا',
  'b': 'ب', 'p': 'ة', 't': 'ت', 'v': 'ث', 'j': 'ج', 'H': 'ح',
  'x': 'خ', 'd': 'د', '*': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س',
  '$': 'ش', 'S': 'ص', 'D': 'ض', 'T': 'ط', 'Z': 'ظ', 'E': 'ع',
  'g': 'غ', '_': 'ـ', 'f': 'ف', 'q': 'ق', 'k': 'ك', 'l': 'ل',
  'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و', 'Y': 'ى', 'y': 'ي',
  'F': 'ً', 'N': 'ٌ', 'K': 'ٍ', 'a': 'َ', 'u': 'ُ', 'i': 'ِ',
  '~': 'ّ', 'o': 'ْ', '^': 'ْ', '`': 'ٰ', '{': 'ٱ'
};

function buckwalterToArabic(bw: string): string {
  if (!bw) return '';
  return bw.split('').map(c => BUCKWALTER_TO_ARABIC[c] || c).join('');
}

interface QACSegment {
  surah: number;
  ayah: number;
  word: number;
  segment: number;
  form: string;
  formArabic: string;
  tag: string;
  pos: string;
  lemma?: string;
  lemmaArabic?: string;
  root?: string;
  rootArabic?: string;
  featuresRaw: string;
  verbForm?: string; // (I), (II), (IV), etc.
}

async function auditQAC() {
  console.log('📖 Reading lib/quranic-corpus-morphology-0.4.txt...\n');
  const content = fs.readFileSync(qacPath, 'utf8');
  const lines = content.split('\n');

  let totalSegments = 0;
  const rootsMap = new Map<string, QACSegment[]>();
  const khwOccurrences: QACSegment[] = [];
  const sampleRecords: { raw: string; parsed: QACSegment }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('LOCATION')) continue;

    totalSegments++;
    const parts = trimmed.split('\t');
    if (parts.length < 4) continue;

    const locRaw = parts[0].replace(/[()]/g, '');
    const [sStr, aStr, wStr, segStr] = locRaw.split(':');
    const surah = parseInt(sStr, 10);
    const ayah = parseInt(aStr, 10);
    const word = parseInt(wStr, 10);
    const segment = parseInt(segStr, 10);

    const form = parts[1];
    const tag = parts[2];
    const featuresRaw = parts[3];

    // Extract Root
    const rootMatch = featuresRaw.match(/ROOT:([^|]+)/);
    const root = rootMatch ? rootMatch[1] : undefined;
    const rootArabic = root ? buckwalterToArabic(root).split('').join(' ') : undefined;

    // Extract Lemma
    const lemMatch = featuresRaw.match(/LEM:([^|]+)/);
    const lemma = lemMatch ? lemMatch[1] : undefined;
    const lemmaArabic = lemma ? buckwalterToArabic(lemma) : undefined;

    // Extract POS
    const posMatch = featuresRaw.match(/POS:([^|]+)/);
    const pos = posMatch ? posMatch[1] : tag;

    // Extract Verb Form e.g. (II), (IV), (V)
    const verbFormMatch = featuresRaw.match(/\((I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\)/);
    const verbForm = verbFormMatch ? verbFormMatch[1] : undefined;

    const segmentObj: QACSegment = {
      surah,
      ayah,
      word,
      segment,
      form,
      formArabic: buckwalterToArabic(form),
      tag,
      pos,
      lemma,
      lemmaArabic,
      root,
      rootArabic,
      featuresRaw,
      verbForm
    };

    if (sampleRecords.length < 8) {
      sampleRecords.push({ raw: trimmed, parsed: segmentObj });
    }

    if (root) {
      if (!rootsMap.has(root)) {
        rootsMap.set(root, []);
      }
      rootsMap.get(root)!.push(segmentObj);

      if (root === 'xwf') {
        khwOccurrences.push(segmentObj);
      }
    }
  }

  console.log('================================================================');
  console.log('📊 1. QURANIC ARABIC CORPUS (QAC v0.4) AUDIT SUMMARY');
  console.log('================================================================');
  console.log(`• Total morphological tokens/segments read : ${totalSegments.toLocaleString()} segments`);
  console.log(`• Total unique roots in Holy Quran        : ${rootsMap.size.toLocaleString()} roots`);
  console.log('================================================================\n');

  console.log('================================================================');
  console.log('📄 2. CONTOH 8 RECORD PERTAMA & PEMETAAN KOLOM');
  console.log('================================================================');
  sampleRecords.forEach((r, idx) => {
    console.log(`Record #${idx + 1}:`);
    console.log(`  Raw Text   : ${r.raw}`);
    console.log(`  Location   : Q.S. ${r.parsed.surah}:${r.parsed.ayah}, Kata ke-${r.parsed.word}, Segmen ${r.parsed.segment}`);
    console.log(`  Form (Arab): ${r.parsed.formArabic} (Buckwalter: ${r.parsed.form})`);
    console.log(`  Tag / POS  : ${r.parsed.tag} / ${r.parsed.pos}`);
    console.log(`  Root (Arab): ${r.parsed.rootArabic || '-'} (Buckwalter: ${r.parsed.root || '-'})`);
    console.log(`  Lemma      : ${r.parsed.lemmaArabic || '-'} (Buckwalter: ${r.parsed.lemma || '-'})`);
    console.log(`  Features   : ${r.parsed.featuresRaw}\n`);
  });

  console.log('================================================================');
  console.log('🎯 3. AUDIT EKSPLISIT ROOT خ و ف (Buckwalter: "xwf") DARI QAC');
  console.log('================================================================');
  console.log(`• Total kemunculan token root 'xwf' (خ و ف) : ${khwOccurrences.length} kemunculan eksak`);
  
  // Breakdown by POS & Verb Forms
  const posCounts: Record<string, number> = {};
  const verbFormCounts: Record<string, number> = {};
  khwOccurrences.forEach(o => {
    posCounts[o.pos] = (posCounts[o.pos] || 0) + 1;
    if (o.verbForm) {
      verbFormCounts[o.verbForm] = (verbFormCounts[o.verbForm] || 0) + 1;
    }
  });

  console.log('• Breakdown Kelas Kata (POS):', JSON.stringify(posCounts));
  console.log('• Breakdown Bentuk Fi\'il (Verb Forms):', JSON.stringify(verbFormCounts));
  console.log('\n• DAFTAR SELURUH KEMUNCULAN ROOT خ و ف DI SELURUH MUSHAF:');

  khwOccurrences.forEach((o, i) => {
    const loc = `(${o.surah}:${o.ayah}:${o.word}:${o.segment})`;
    console.log(
      `  [${String(i + 1).padStart(3, ' ')}] ${loc.padEnd(16, ' ')} ` +
      `Q.S. ${String(o.surah).padStart(3, ' ')}:${String(o.ayah).padEnd(3, ' ')} | ` +
      `Kata: ${o.formArabic.padEnd(12, ' ')} (${o.form.padEnd(10, ' ')}) | ` +
      `POS: ${o.pos.padEnd(4, ' ')} | ` +
      `Lemma: ${o.lemmaArabic || '-'} | ` +
      `Fitur: ${o.featuresRaw}`
    );
  });
  console.log('================================================================\n');
}

auditQAC();
