const fs = require('fs');

let content = fs.readFileSync('/home/aizatfir/Project/Qurabic-Indo/lib/data/roots.ts', 'utf8');

// Ensure s-b-r has classical etymology note for "batu"
content = content.replace(
  `id: "s-b-r",`,
  `id: "s-b-r",\n    etymologyNote: "Kata sobaro secara etimologi merujuk pada batu yang sangat keras dan padat (الصَّبْرَةُ - batu licin yang kokoh tak tergerus), serta jenis tanaman herbal yang rasanya sangat pahit namun kaya obat (lidah buaya/aloe).",`
);

// Ensure s-l-w has sholat tag and etymology
content = content.replace(
  `id: "s-l-w",`,
  `id: "s-l-w",\n    etymologyNote: "Secara etimologi, ص-ل-و bermakna dasar hubungan yang mengikat erat dan tak terputus (الصلة والإقبال).",`
);

fs.writeFileSync('/home/aizatfir/Project/Qurabic-Indo/lib/data/roots.ts', content, 'utf8');
console.log('Enriched roots dataset!');
