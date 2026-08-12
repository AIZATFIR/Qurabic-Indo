const fs = require('fs');

let content = fs.readFileSync('/home/aizatfir/Project/Qurabic-Indo/lib/data/roots.ts', 'utf8');

// Remove duplicate etymologyNote properties if present
content = content.replace(/etymologyNote: "[^"]*",\s*etymologyNote:/g, 'etymologyNote:');

fs.writeFileSync('/home/aizatfir/Project/Qurabic-Indo/lib/data/roots.ts', content, 'utf8');
console.log('Cleaned duplicate properties in roots.ts!');
