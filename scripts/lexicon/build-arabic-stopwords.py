#!/usr/bin/env python3
"""Build a queryable SQLite index from the pinned Arabic Stop Words TSV export."""
import csv
import re
import sqlite3
import sys
import unicodedata
from pathlib import Path

MARKS = re.compile(r'[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]')


def normalize(value: str) -> str:
    return MARKS.sub('', unicodedata.normalize('NFKC', value or '')).strip()


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit('Usage: build-arabic-stopwords.py SOURCE.tsv OUTPUT.sqlite')
    source, target = map(Path, sys.argv[1:])
    if target.exists():
        target.unlink()
    connection = sqlite3.connect(target)
    connection.executescript('''
        CREATE TABLE forms (
            word TEXT NOT NULL, normalized_word TEXT NOT NULL, vocalized TEXT NOT NULL,
            type TEXT NOT NULL, category TEXT NOT NULL, original TEXT NOT NULL,
            normalized_original TEXT NOT NULL, procletic TEXT NOT NULL, stem TEXT NOT NULL,
            encletic TEXT NOT NULL, tags TEXT NOT NULL
        );
    ''')
    rows = []
    with source.open(encoding='utf-8-sig', newline='') as stream:
        data = (line for line in stream if line.strip() and not line.startswith('#'))
        for row in csv.DictReader(data, delimiter='\t'):
            rows.append((row['word'], normalize(row['word']), row['vocalized'], row['type'],
                         row['category'], row['original'], normalize(row['original']),
                         row['procletic'], row['stem'], row['encletic'], row['tags']))
    connection.executemany('INSERT INTO forms VALUES (?,?,?,?,?,?,?,?,?,?,?)', rows)
    connection.executescript('''
        CREATE INDEX idx_forms_word ON forms(normalized_word, type);
        CREATE INDEX idx_forms_original ON forms(normalized_original, type);
        CREATE INDEX idx_forms_lemma ON forms(original, type);
    ''')
    connection.commit()
    print('Indexed', len(rows), 'source records; output:', target)
    connection.close()


if __name__ == '__main__':
    main()
