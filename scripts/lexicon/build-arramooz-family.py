#!/usr/bin/env python3
"""Build a small root-indexed subset of Arramooz for roots used by the Quran."""
import json
import re
import sqlite3
import sys
from pathlib import Path

if len(sys.argv) != 3:
    raise SystemExit('usage: build-arramooz-family.py ARRAMOOZ.sqlite OUTPUT.json')

DB_PATH, OUTPUT_PATH = map(Path, sys.argv[1:])
ROOTS_PATH = Path(__file__).resolve().parents[2] / 'lib/data/roots-summary.json'
DIACRITICS = re.compile(r'[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]')
ALIFS = str.maketrans({'آ': 'ا', 'أ': 'ا', 'إ': 'ا', 'ٱ': 'ا'})

def normalize(text):
    return DIACRITICS.sub('', text or '').translate(ALIFS).strip()

roots = json.loads(ROOTS_PATH.read_text(encoding='utf-8'))
root_keys = {normalize(root['rootArabicJoined']): root['id'] for root in roots}
output = {root_id: [] for root_id in root_keys.values()}
db = sqlite3.connect(f'file:{DB_PATH}?mode=ro', uri=True)

for row in db.execute('SELECT root, vocalized, wordtype, wazn, definition FROM nouns'):
    root, arabic, word_type, wazn, definition = row
    root_id = root_keys.get(normalize(root))
    if not root_id or not arabic:
        continue
    record = {'arabic': arabic, 'pos': 'noun'}
    if word_type:
        record['wordType'] = word_type
    if wazn:
        record['wazn'] = wazn
    if definition and definition.strip().strip('"'):
        record['definition'] = definition.strip().strip('"')
    output[root_id].append(record)

for root, arabic in db.execute('SELECT root, vocalized FROM verbs'):
    root_id = root_keys.get(normalize(root))
    if root_id and arabic:
        output[root_id].append({'arabic': arabic, 'pos': 'verb', 'wordType': 'فعل'})

for root_id, records in output.items():
    unique = {}
    for record in records:
        unique[(record['arabic'], record['pos'])] = record
    output[root_id] = sorted(unique.values(), key=lambda item: (item['pos'] != 'verb', item['arabic']))

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
OUTPUT_PATH.write_text(json.dumps(output, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
print(f'{sum(map(len, output.values()))} records across {sum(bool(v) for v in output.values())} roots; {OUTPUT_PATH.stat().st_size:,} bytes')
