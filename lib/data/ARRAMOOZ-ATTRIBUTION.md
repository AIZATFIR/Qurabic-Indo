# Arramooz data attribution

The root-indexed subset in `arramooz-quran-roots.json` is derived from the Arabic morphology dictionary maintained at <https://github.com/linuxscout/arramooz> (upstream revision `b055c5dea51b8a9152e7e66a7ca3b6f713fb187d`). The project README says its data was generated from manually collected Ayaspell source data.

The upstream project is distributed under GNU General Public License version 2. Its license text is included in `ARRAMOOZ-GPL-2.0.txt`. Qurabic includes original Arabic forms, word types, patterns, and available Arabic definitions for roots present in its Quranic root index. Qurabic does not translate or rewrite these definitions.

The generation script is `scripts/lexicon/build-arramooz-family.py`; it accepts the upstream SQLite file as a local input and is not included in the application bundle.
