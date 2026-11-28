#!/usr/bin/env python3
"""Build the CC BY-SA Arabic Roots and Derivatives SQLite lookup index."""

import argparse
import re
import sqlite3
import unicodedata
from pathlib import Path

ROW = re.compile(r"\((\d+), '((?:''|[^'])*)', '((?:''|[^'])*)', '((?:''|[^'])*)', '((?:''|[^'])*)'\)")
HAMZA_VARIANTS = str.maketrans({'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ؤ': 'ء', 'ئ': 'ء', 'ى': 'ي'})


def normalize_root(value: str) -> str:
    return root_key(value).translate(HAMZA_VARIANTS)


def root_key(value: str) -> str:
    value = ''.join(char for char in unicodedata.normalize('NFD', value) if not unicodedata.category(char).startswith('M'))
    return re.sub(r'[\sـ]+', '', value)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path, help='UTF-8 MySQL dump from KhorsiCorpus.sql.bz2')
    parser.add_argument('output', type=Path, help='SQLite database to write')
    args = parser.parse_args()

    dump = args.source.read_text(encoding='utf-8')
    rows = [
        (int(row_id), root, root_key(root), normalize_root(root), word, unvowelword, stem)
        for row_id, root, word, unvowelword, stem in ROW.findall(dump)
    ]
    if len(rows) != 142_786:
        raise SystemExit(f'Expected 142,786 source records; parsed {len(rows)}.')

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.unlink(missing_ok=True)
    with sqlite3.connect(args.output) as db:
        db.executescript('''
            PRAGMA journal_mode = OFF;
            PRAGMA synchronous = OFF;
            CREATE TABLE forms (
                source_id INTEGER PRIMARY KEY,
                root TEXT NOT NULL,
                root_key TEXT NOT NULL,
                root_norm TEXT NOT NULL,
                word TEXT NOT NULL,
                unvowelword TEXT NOT NULL,
                nonormstem TEXT NOT NULL
            );
            CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
        ''')
        db.executemany('INSERT INTO forms VALUES (?, ?, ?, ?, ?, ?, ?)', rows)
        db.executescript('''
            CREATE INDEX forms_root_key ON forms(root_key, root, source_id);
            CREATE INDEX forms_root ON forms(root, source_id);
            CREATE INDEX forms_root_norm ON forms(root_norm, root, source_id);
            CREATE INDEX forms_unvowelword ON forms(unvowelword);
        ''')
        db.executemany('INSERT INTO metadata VALUES (?, ?)', [
            ('source', 'Arabic Roots and Derivatives · Ahmed Khorsi'),
            ('work', 'Tāj al-ʿArūs'),
            ('license', 'CC BY-SA 3.0'),
            ('source_records', str(len(rows))),
            ('source_roots', str(len({row[1] for row in rows}))),
        ])
        db.commit()
        db.execute('VACUUM')

    print(f'Indexed {len(rows):,} forms across {len({row[1] for row in rows}):,} source roots into {args.output} ({args.output.stat().st_size:,} bytes).')


if __name__ == '__main__':
    main()
