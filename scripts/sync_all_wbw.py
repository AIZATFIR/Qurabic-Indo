import urllib.request
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

OUTPUT_DIR = "/home/aizatfir/projects/Qurabic-Indo/lib/data/wbw"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def fetch_page(page, retries=5):
    url = f"https://api.quran.com/api/v4/verses/by_page/{page}?language=id&words=true&word_fields=text_uthmani,location,transliteration,translation"
    headers = {'User-Agent': 'Mozilla/5.0 (Qurabic-Indo-Sync/1.0)'}
    req = urllib.request.Request(url, headers=headers)
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                return (page, data.get('verses', []))
        except Exception as e:
            if attempt == retries:
                print(f"[ERROR] Failed page {page}: {e}")
                raise
            time.sleep(1.0 * attempt)
    return (page, [])

def main():
    print("🚀 Fetching all 604 pages of Quran WBW...")
    t0 = time.time()
    all_verses = []
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_page, p): p for p in range(1, 605)}
        completed = 0
        for future in as_completed(futures):
            page, verses = future.result()
            all_verses.extend(verses)
            completed += 1
            if completed % 50 == 0 or completed == 604:
                print(f"[{completed}/604 pages] fetched ({(time.time()-t0):.1f}s elapsed)")

    print(f"Total verses fetched: {len(all_verses)}. Organizing by surah...")
    surah_dict = {s: {} for s in range(1, 115)}
    
    for v in all_verses:
        verse_key = v.get('verse_key') # e.g. "2:255"
        surah_num = int(verse_key.split(':')[0])
        words = []
        for w in v.get('words', []):
            if w.get('char_type_name') == 'word':
                words.append({
                    'location': w.get('location'),
                    'arabic': w.get('text_uthmani') or w.get('text'),
                    'transliteration': (w.get('transliteration') or {}).get('text', ''),
                    'meaningIndo': (w.get('translation') or {}).get('text', '')
                })
        surah_dict[surah_num][verse_key] = words

    # Sort verses in each surah properly
    for s in range(1, 115):
        s_data = surah_dict[s]
        # sort keys by ayah number
        sorted_keys = sorted(s_data.keys(), key=lambda k: int(k.split(':')[1]))
        ordered_data = {k: s_data[k] for k in sorted_keys}
        out_file = os.path.join(OUTPUT_DIR, f"surah_{s:03d}.json")
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(ordered_data, f, ensure_ascii=False, indent=2)

    print(f"✅ All 114 surah files written successfully in {(time.time()-t0):.1f}s!")

if __name__ == '__main__':
    main()
