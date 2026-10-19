const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function main() {
  console.log('🔄 Membaca roots-database.json...');
  const rootsPath = path.join(__dirname, '../lib/data/roots-database.json');
  const roots = JSON.parse(fs.readFileSync(rootsPath, 'utf8'));

  const wordIdSet = new Set();
  let totalVerbs = 0;
  let totalNouns = 0;
  for (const r of roots) {
    for (const v of (r.verbs || [])) {
      wordIdSet.add(v.id);
      totalVerbs++;
    }
    for (const n of (r.nouns || [])) {
      wordIdSet.add(n.id);
      totalNouns++;
    }
  }
  console.log(`📊 Total roots: ${roots.length}, Total kata: ${wordIdSet.size} (${totalVerbs} verba, ${totalNouns} nomina)`);

  console.log('📖 Memetakan Quranic Arabic Corpus morphology...');
  const corpusPath = path.join(__dirname, '../lib/quranic-corpus-morphology-0.4.txt');
  const idLocations = new Map();

  const rl = readline.createInterface({
    input: fs.createReadStream(corpusPath),
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.startsWith('#') || !line.trim() || line.startsWith('LOCATION')) continue;
    const parts = line.split('\t');
    if (parts.length >= 4) {
      const locRaw = parts[0].replace(/[()]/g, '');
      const locParts = locRaw.split(':');
      const wordLoc = `${locParts[0]}:${locParts[1]}:${locParts[2]}`;
      const features = parts[3];
      const lemMatch = features.match(/LEM:([^|]+)/);
      const rootMatch = features.match(/ROOT:([^|]+)/);
      const posMatch = features.match(/POS:([^|]+)/);
      if (lemMatch && rootMatch && posMatch) {
        const lem = lemMatch[1];
        const root = rootMatch[1];
        const pos = posMatch[1];
        const type = (pos === 'V') ? 'v' : 'n';
        const id = `${type}-${root}-${lem}`;
        if (wordIdSet.has(id)) {
          if (!idLocations.has(id)) idLocations.set(id, []);
          idLocations.get(id).push(wordLoc);
        }
      }
    }
  }
  console.log(`✅ Morphological locations mapped: ${idLocations.size} kata.`);

  console.log('📚 Membaca kamus WBW 114 Surah...');
  const locToMeaning = new Map();
  for (let s = 1; s <= 114; s++) {
    const fn = path.join(__dirname, `../lib/data/wbw/surah_${String(s).padStart(3, '0')}.json`);
    if (!fs.existsSync(fn)) {
      throw new Error(`File WBW tidak ditemukan: ${fn}`);
    }
    const content = JSON.parse(fs.readFileSync(fn, 'utf8'));
    for (const words of Object.values(content)) {
      for (const w of words) {
        if (w.location && w.meaningIndo) {
          locToMeaning.set(w.location, w.meaningIndo.trim());
        }
      }
    }
  }
  console.log(`✅ Loaded ${locToMeaning.size} kata perkata dari 114 Surah.`);

  function cleanIndoGloss(str) {
    if (!str) return '';
    let s = str.trim();
    // Hilangkan pronomina penunjuk dalam kurung di awal
    s = s.replace(/^\((aku|kami|dia|mereka|kalian|kamu|orang-orang)\)\s*/i, '');
    // Hilangkan partikel/konjungsi depan
    s = s.replace(/^(dan|maka|lalu|bahkan|apakah|bahwa|kemudian|sungguh)\s+/i, '');
    // Hilangkan tanda penjelas format jamak
    s = s.replace(/\(jamak\)/gi, '');
    s = s.replace(/[()]/g, '');
    s = s.replace(/\s+/g, ' ').trim();
    return s;
  }

  console.log('✍️ Memperbarui meaningIndo pada roots-database.json...');
  let updatedCount = 0;
  let remainingPlaceholders = 0;

  for (const r of roots) {
    for (const v of (r.verbs || [])) {
      const locs = idLocations.get(v.id) || [];
      const freq = new Map();
      for (const l of locs) {
        const raw = locToMeaning.get(l);
        if (!raw) continue;
        const cleaned = cleanIndoGloss(raw);
        if (cleaned) freq.set(cleaned, (freq.get(cleaned) || 0) + 1);
      }
      const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
      const best = sorted[0]?.[0];
      if (best) {
        v.meaningIndo = best;
        updatedCount++;
      } else {
        remainingPlaceholders++;
      }
    }

    for (const n of (r.nouns || [])) {
      const locs = idLocations.get(n.id) || [];
      const freq = new Map();
      for (const l of locs) {
        const raw = locToMeaning.get(l);
        if (!raw) continue;
        const cleaned = cleanIndoGloss(raw);
        if (cleaned) freq.set(cleaned, (freq.get(cleaned) || 0) + 1);
      }
      const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
      const best = sorted[0]?.[0];
      if (best) {
        n.meaningIndo = best;
        updatedCount++;
      } else {
        remainingPlaceholders++;
      }
    }
  }

  fs.writeFileSync(rootsPath, JSON.stringify(roots, null, 2), 'utf8');
  console.log(`🎉 Berhasil memperbarui ${updatedCount} kata.`);
  console.log(`⚠️ Sisa placeholder: ${remainingPlaceholders}`);
}

main().catch(err => {
  console.error('❌ Terjadi kesalahan:', err);
  process.exit(1);
});
