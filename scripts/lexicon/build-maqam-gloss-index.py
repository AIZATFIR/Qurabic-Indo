#!/usr/bin/env python3
"""Build Qurabic's coordinate index from the official MAQAM CSV release.

Only lexical annotations and Quran coordinates are retained. Quran text and
morphosyntactic fields outside lemma/gloss/POS/root are intentionally omitted.
"""
import argparse
import csv
import os
import json
import sqlite3
import tempfile

EXPECTED_ROWS = 77_429


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('source_csv')
    parser.add_argument('output_db')
    parser.add_argument('--public-json', help='Also write a compact coordinate-to-gloss fallback for offline clients')
    args = parser.parse_args()
    os.makedirs(os.path.dirname(os.path.abspath(args.output_db)), exist_ok=True)
    fd, temp_path = tempfile.mkstemp(prefix='maqam-', suffix='.sqlite', dir=os.path.dirname(os.path.abspath(args.output_db)))
    os.close(fd)
    count = 0
    try:
        db = sqlite3.connect(temp_path)
        db.execute('PRAGMA journal_mode=OFF')
        db.execute('PRAGMA synchronous=OFF')
        db.execute('CREATE TABLE glosses (location TEXT PRIMARY KEY, lemma TEXT NOT NULL, gloss TEXT NOT NULL, pos TEXT NOT NULL, root TEXT)')
        db.execute('CREATE INDEX glosses_root_idx ON glosses(root)')
        with open(args.source_csv, encoding='utf-8-sig', newline='') as source:
            reader = csv.DictReader(source)
            required = {'surah_index', 'verse_index', 'word_index', 'lex', 'stemgloss', 'pos', 'root'}
            if not required.issubset(reader.fieldnames or []):
                raise ValueError(f'Missing required columns: {sorted(required - set(reader.fieldnames or []))}')
            batch = []
            for row in reader:
                location = f"{int(row['surah_index'])}:{int(row['verse_index'])}:{int(row['word_index'])}"
                lemma, gloss, pos = row['lex'].strip(), row['stemgloss'].strip(), row['pos'].strip()
                root = row['root'].strip()
                if not lemma or not gloss or not pos:
                    raise ValueError(f'Empty lexical annotation at {location}')
                if root in ('', 'NTWS'):
                    root = None
                batch.append((location, lemma, gloss, pos, root))
                if len(batch) >= 1000:
                    db.executemany('INSERT INTO glosses VALUES (?, ?, ?, ?, ?)', batch)
                    count += len(batch)
                    batch.clear()
            if batch:
                db.executemany('INSERT INTO glosses VALUES (?, ?, ?, ?, ?)', batch)
                count += len(batch)
        if count != EXPECTED_ROWS:
            raise ValueError(f'Expected {EXPECTED_ROWS} coordinate rows; found {count}')
        db.execute('CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)')
        db.executemany('INSERT INTO metadata VALUES (?, ?)', [
            ('source', 'MAQAM Quranic Corpus'),
            ('rows', str(count)),
            ('release', '2e52c1354a901e998a311c94f43d14c99f467f6f'),
            ('fields', 'location,lemma,English stem gloss,POS,root'),
        ])
        db.commit()
        db.execute('PRAGMA optimize')
        db.close()
        os.replace(temp_path, args.output_db)
        os.chmod(args.output_db, 0o644)
        print(f'Built {count:,} MAQAM lexical gloss rows at {args.output_db}')
        if args.public_json:
            os.makedirs(os.path.dirname(os.path.abspath(args.public_json)), exist_ok=True)
            json_fd, json_temp = tempfile.mkstemp(prefix='maqam-', suffix='.json', dir=os.path.dirname(os.path.abspath(args.public_json)))
            try:
                with os.fdopen(json_fd, 'w', encoding='utf-8') as target:
                    target.write('{')
                    first = True
                    with sqlite3.connect(args.output_db) as indexed:
                        for location, gloss in indexed.execute('SELECT location, gloss FROM glosses ORDER BY location'):
                            if not first:
                                target.write(',')
                            target.write(json.dumps(location, ensure_ascii=False))
                            target.write(':')
                            target.write(json.dumps(gloss, ensure_ascii=False))
                            first = False
                    target.write('}')
                os.replace(json_temp, args.public_json)
                os.chmod(args.public_json, 0o644)
                print(f'Built offline fallback JSON at {args.public_json}')
            except Exception:
                if os.path.exists(json_temp):
                    os.unlink(json_temp)
                raise
    except Exception:
        if os.path.exists(temp_path):
            os.unlink(temp_path)
        raise


if __name__ == '__main__':
    main()
