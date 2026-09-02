import fs from 'fs';
import path from 'path';

console.log('📦 Fetching complete Uthmani Quran & Kemenag Indonesian Translation in 2 fast batch requests...');

async function cacheFullQuran() {
  const cacheDir = path.join(process.cwd(), 'scratch/data_cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const arPath = path.join(cacheDir, 'quran_uthmani.json');
  const idPath = path.join(cacheDir, 'quran_indonesian.json');

  if (!fs.existsSync(arPath)) {
    console.log('Downloading Quran Uthmani text...');
    const arRes = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
    const arJson = await arRes.json();
    fs.writeFileSync(arPath, JSON.stringify(arJson.data.surahs), 'utf8');
    console.log('✅ Quran Uthmani cached successfully.');
  } else {
    console.log('Quran Uthmani already cached.');
  }

  if (!fs.existsSync(idPath)) {
    console.log('Downloading Indonesian Kemenag Translation...');
    const idRes = await fetch('https://api.alquran.cloud/v1/quran/id.indonesian');
    const idJson = await idRes.json();
    fs.writeFileSync(idPath, JSON.stringify(idJson.data.surahs), 'utf8');
    console.log('✅ Indonesian Kemenag Translation cached successfully.');
  } else {
    console.log('Indonesian Kemenag Translation already cached.');
  }

  console.log('🎉 Full Quran database cache is ready!');
}

cacheFullQuran();
