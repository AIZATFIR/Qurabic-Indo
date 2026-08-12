const fs = require('fs');

let content = fs.readFileSync('/home/aizatfir/Project/Qurabic-Indo/lib/data/roots.ts', 'utf8');

// Ensure s-b-r tags contain "batu"
content = content.replace(
  `tags: ["sabar","s-b-r","صبر","ص ب ر",`,
  `tags: ["sabar","s-b-r","batu","sobaro","sobar","صبر","ص ب ر",`
);

fs.writeFileSync('/home/aizatfir/Project/Qurabic-Indo/lib/data/roots.ts', content, 'utf8');
console.log('Added batu tag!');
