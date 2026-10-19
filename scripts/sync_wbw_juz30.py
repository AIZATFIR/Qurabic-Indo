import urllib.request
import json
import os
import time

OUTPUT_DIR = "/home/aizatfir/projects/Qurabic-Indo/lib/data/wbw"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Surah details: Juz 30 (Surah 78 - 114) plus Surah Al-Fatihah (1)
SURAH_AYAH_COUNTS = {
    1: 7, 78: 40, 79: 46, 80: 42, 81: 29, 82: 19, 83: 36, 84: 25, 85: 22,
    86: 17, 87: 19, 88: 26, 89: 30, 90: 20, 91: 15, 92: 21, 93: 11, 94: 8,
    95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11, 101: 11, 102: 8, 103: 3,
    104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3, 111: 5, 112: 4,
    113: 5, 114: 6
}

def fetch_surah_wbw(surah: int, total_ayahs: int):
    out_file = os.path.join(OUTPUT_DIR, f"surah_{surah:03d}.json")
    if os.path.exists(out_file):
        print(f"[SKIP] Surah {surah} already exists.")
        return

    print(f"[FETCH] Starting Surah {surah} ({total_ayahs} ayahs)...")
    surah_data = {}
    
    for ayah in range(1, total_ayahs + 1):
        verse_key = f"{surah}:{ayah}"
        url = f"https://api.quran.com/api/v4/verses/by_key/{verse_key}?language=id&words=true&word_fields=text_uthmani,location,transliteration,translation"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Qurabic-Builder/1.0)'})
        success = False
        retries = 3
        
        while retries > 0 and not success:
            try:
                with urllib.request.urlopen(req, timeout=12) as resp:
                    payload = json.loads(resp.read().decode('utf-8'))
                    words = []
                    for w in payload.get('verse', {}).get('words', []):
                        if w.get('char_type_name') == 'word':
                            words.append({
                                'location': w.get('location'),
                                'arabic': w.get('text_uthmani') or w.get('text'),
                                'transliteration': w.get('transliteration', {}).get('text', ''),
                                'meaningIndo': w.get('translation', {}).get('text', '')
                            })
                    surah_data[verse_key] = words
                    success = True
            except Exception as e:
                retries -= 1
                time.sleep(1)
        time.sleep(0.1)

    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(surah_data, f, ensure_ascii=False, indent=2)
    print(f"[DONE] Surah {surah} saved -> {len(surah_data)} ayahs.")

if __name__ == '__main__':
    for s, count in sorted(SURAH_AYAH_COUNTS.items()):
        fetch_surah_wbw(s, count)
    print("[ALL DONE] WBW dataset ingestion complete.")
