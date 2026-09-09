/**
 * Qurabic Transliteration Engine — Arabic Unicode to Standard Indonesian Latin
 * Converts Arabic Quranic text (with or without diacritics) into readable,
 * standardized Latin transliteration. Eliminates raw Buckwalter codes.
 */

// Common high-frequency Quranic vocabulary mappings for instant, flawless output
const COMMON_WORD_TRANSLITERATIONS: Record<string, string> = {
  'الله': 'Allāh',
  'ٱللَّهِ': 'Allāh',
  'ٱللَّهَ': 'Allāh',
  'ٱللَّهُ': 'Allāh',
  'لِلَّهِ': 'lillāh',
  'بِٱللَّهِ': 'billāh',
  'وَٱللَّهُ': 'wallāhu',
  'فَٱللَّهُ': 'fallāhu',
  'الرحمن': 'ar-Raḥmān',
  'ٱلرَّحْمَٰنِ': 'ar-Raḥmān',
  'ٱلرَّحْمَٰنُ': 'ar-Raḥmān',
  'الرحيم': 'ar-Raḥīm',
  'ٱلرَّحِيمِ': 'ar-Raḥīm',
  'ٱلرَّحِيمُ': 'ar-Raḥīm',
  'الحمد': 'al-ḥamdu',
  'ٱلْحَمْدُ': 'al-ḥamdu',
  'رب': 'Rabbi',
  'رَبِّ': 'Rabbi',
  'رَبُّ': 'Rabbu',
  'رَبَّ': 'Rabba',
  'رَبَّنَا': 'Rabbanā',
  'العالمين': 'al-ʿālamīn',
  'ٱلْعَٰلَمِينَ': 'al-ʿālamīn',
  'مالك': 'māliki',
  'مَٰلِكِ': 'māliki',
  'دين': 'ad-dīn',
  'ٱلدِّينِ': 'ad-dīn',
  'إياك': 'iyyāka',
  'إِيَّاكَ': 'iyyāka',
  'نعبد': 'naʿbudu',
  'نَعْبُدُ': 'naʿbudu',
  'نستعين': 'nastaʿīn',
  'نَسْتَعِينُ': 'nastaʿīn',
  'اهدنا': 'ihdinā',
  'ٱهْدِنَا': 'ihdinā',
  'صراط': 'aṣ-ṣirāṭ',
  'ٱلصِّرَٰطَ': 'aṣ-ṣirāṭ',
  'مستقيم': 'al-mustaqīm',
  'ٱلْمُسْتَقِيمَ': 'al-mustaqīm',
  // Specific user target words
  'ٱلشَّهْرُ': 'asy-syahr',
  'ٱلشَّهْرَ': 'asy-syahr',
  'ٱلشَّهْرِ': 'asy-syahr',
  'شَهْرٌ': 'syahr',
  'شَهْرٍ': 'syahr',
  'شَهْرَ': 'syahr',
  'شَهْرُ': 'syahr',
  'شَهْر': 'syahr',
  'حُرُمَٰتُ': 'ḥurumāt',
  'ٱلْحُرُمَٰتُ': 'al-ḥurumāt',
  'حَرَامٌ': 'ḥarām',
  'ٱلْحَرَامُ': 'al-ḥarām',
  'ٱلْحَرَامِ': 'al-ḥarām',
  'ٱلْحَرَامَ': 'al-ḥarām',
  'مُحَرَّمٌ': 'muḥarram',
  'مُحَرَّمٍ': 'muḥarram',
  'مُحَرَّمَةٌ': 'muḥarramah',
  'حُرُمٌ': 'ḥurum',
  'حُرِّمَتْ': 'ḥurrimat',
  'حَرَّمْنَا': 'ḥarramnā',
  'حَرَّمَ': 'ḥarrama',
  'تُحَرِّمُوا۟': 'tuḥarrimū',
  'كَانَ': 'kāna',
  'كَانُوا۟': 'kānū',
  'يَكُونُ': 'yakūnu',
  'تَكُونُ': 'takūnu',
  'كُن': 'kun',
  'مَكَان': 'makān',
  'دَخَلَ': 'dakhala',
  'ٱدْخُلُوا۟': 'ud\'khulū',
  'يَدْخُلُونَ': 'yadkhulūn',
  'كَذَّبَ': 'kadzdzaba',
  'كَذَبَ': 'kadzaba',
  'يَكْذِبُونَ': 'yakdzibūn',
  'تُكَذِّبَانِ': 'tukadzdzibāni',
  'تَبَٰرَكَ': 'tabāraka',
  'بِيَدِهِ': 'biyadihi',
  'ٱلْمُلْكُ': 'al-mulk',
  'قَدِيرٌ': 'qadīr',
  'شَىْءٍۢ': 'syai\'in',
  'عَلَىٰ': '\'alā',
  'فِى': 'fī',
  'مِن': 'min',
  'إِلَىٰ': 'ilā',
  'وَهُوَ': 'wahuwa',
  'كُلِّ': 'kulli',
};

const ARABIC_LETTERS_MAP: Record<string, string> = {
  'ء': '\'',
  'أ': 'a',
  'إ': 'i',
  'ؤ': 'u',
  'ئ': 'i',
  'آ': 'ā',
  'ٱ': 'a',
  'ا': 'a',
  'ب': 'b',
  'ت': 't',
  'ث': 'ts',
  'ج': 'j',
  'ح': 'ḥ',
  'خ': 'kh',
  'د': 'd',
  'ذ': 'dz',
  'ر': 'r',
  'ز': 'z',
  'س': 's',
  'ش': 'sy',
  'ص': 'ṣ',
  'ض': 'ḍ',
  'ط': 'ṭ',
  'ظ': 'ẓ',
  'ع': 'ʿ',
  'غ': 'gh',
  'ف': 'f',
  'ق': 'q',
  'ك': 'k',
  'ل': 'l',
  'م': 'm',
  'ن': 'n',
  'ه': 'h',
  'هـ': 'h',
  'و': 'w',
  'ي': 'y',
  'ى': 'ā',
  'ة': 'h',
};

/**
 * Cleanly converts an Arabic word to readable phonetic Indonesian Latin transliteration
 */
export function transliterateArabic(arabic: string): string {
  if (!arabic) return '';

  const trimmed = arabic.trim();
  if (COMMON_WORD_TRANSLITERATIONS[trimmed]) {
    return COMMON_WORD_TRANSLITERATIONS[trimmed];
  }

  // Handle common prefixed articles
  if (trimmed.startsWith('ٱلشَّ') || trimmed.startsWith('الشَّ')) {
    return 'asy-sy' + transliterateArabic(trimmed.slice(trimmed.startsWith('ٱلشَّ') ? 3 : 3));
  }
  if (trimmed.startsWith('ٱلرَّ') || trimmed.startsWith('الرَّ')) {
    return 'ar-r' + transliterateArabic(trimmed.slice(trimmed.startsWith('ٱلرَّ') ? 3 : 3));
  }
  if (trimmed.startsWith('ٱلْ') || trimmed.startsWith('الْ') || trimmed.startsWith('ٱل') || trimmed.startsWith('ال')) {
    const rest = trimmed.replace(/^(ٱلْ|الْ|ٱل|ال)/, '');
    return 'al-' + transliterateArabic(rest);
  }

  // Char-by-char phonetic conversion supporting vowels
  let result = '';
  const len = trimmed.length;

  for (let i = 0; i < len; i++) {
    const char = trimmed[i];
    const next = i + 1 < len ? trimmed[i + 1] : '';
    const next2 = i + 2 < len ? trimmed[i + 2] : '';

    // Vowels
    if (char === 'َ') {
      if (next === 'ا' || next === 'ى' || next === 'ٰ') {
        result += 'ā';
        i++;
      } else {
        result += 'a';
      }
      continue;
    }
    if (char === 'ِ') {
      if (next === 'ي' && (next2 === '' || !/[ًٌٍَُِّْٰٓ]/.test(next2))) {
        result += 'ī';
        i++;
      } else {
        result += 'i';
      }
      continue;
    }
    if (char === 'ُ') {
      if (next === 'و' && (next2 === '' || !/[ًٌٍَُِّْٰٓ]/.test(next2))) {
        result += 'ū';
        i++;
      } else {
        result += 'u';
      }
      continue;
    }
    if (char === 'ٰ') {
      result += 'ā';
      continue;
    }
    if (char === 'ً') {
      result += 'an';
      continue;
    }
    if (char === 'ٍ') {
      result += 'in';
      continue;
    }
    if (char === 'ٌ') {
      result += 'un';
      continue;
    }
    if (char === 'ّ') {
      // Doubling handled if previous consonant exists
      if (result.length > 0) {
        const lastChar = result[result.length - 1];
        if (/[a-zA-Z]/.test(lastChar)) {
          result += lastChar;
        }
      }
      continue;
    }
    if (char === 'ْ' || char === 'ٓ' || char === 'ۖ' || char === 'ۗ' || char === 'ۚ' || char === 'ۛ' || char === 'ۜ' || char === 'ۢ') {
      continue;
    }

    // Consonants
    const mapped = ARABIC_LETTERS_MAP[char];
    if (mapped) {
      result += mapped;
    }
  }

  // Clean up duplicate vowels like aa -> ā
  const cleaned = result
    .replace(/aa/g, 'ā')
    .replace(/ii/g, 'ī')
    .replace(/uu/g, 'ū')
    .replace(/-+/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned || trimmed;
}

/**
 * Checks if a string looks like a raw Buckwalter consonant root (e.g. Hrm, $hr, kwn, Ebd)
 * and should NEVER be displayed as a user-facing word transliteration.
 */
export function isRawBuckwalterRoot(text?: string): boolean {
  if (!text) return false;
  const clean = text.trim();
  // 1-4 chars with uppercase or special characters without vowels (except w, y)
  return /^[A-Z\$\*\_]{1,4}$/.test(clean) ||
    /^[\$\*][a-z]{1,3}$/.test(clean) ||
    /^[A-Z][a-z]{1,2}$/.test(clean) && !/[aeiou]/.test(clean.toLowerCase());
}
