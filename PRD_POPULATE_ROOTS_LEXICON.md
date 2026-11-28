# PRD: Populate Meaning Indo & Lexicon di Qurabic-Indo

> Superseded implementation note: do not build root or lexical definitions by copying word-gloss dumps into the application. Root/word/ayah views now request contextual word glosses at runtime from Quran.com API v4. The tracked legacy exports remain a separate release-cleanup item. Runtime word glosses are translations by location, not classical dictionary definitions.

## Problem Statement
Di dalam database akar kata (`lib/data/roots-database.json`), sebanyak 4,423 entri kata (words) masih berisi makna placeholder: `"meaningIndo": "Bentuk ..."` (default generic). Ini menyebabkan tampilan kartu kosakata kata perkata dan relasi akar kata di web Qurabic-Indo kosong / nyam-nyam tidak bermakna.

## Objectives
1. Use a licensed runtime or Content Sync source for contextual word glosses; do not call a word translation a lexical definition.
2. Keep Arabic lemma/root explanations separate from verse-context translations and show source coverage honestly.
3. Only populate classical lexical definitions from cited, rights-cleared dictionaries; do not derive them from word glosses or AI.
4. Remove the legacy bundled exports only after the repository cleanup is reviewed and authorized.
