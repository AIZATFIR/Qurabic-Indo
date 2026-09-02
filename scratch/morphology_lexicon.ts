import { VerbDerivation, NounDerivation } from '../lib/types/morphology';

export interface RootMorphologyDefinition {
  meaningsIndonesian: string[];
  etymologyNote: string;
  verbs: VerbDerivation[];
  nouns: NounDerivation[];
}

export const MORPHOLOGY_LEXICON: Record<string, RootMorphologyDefinition> = {
  // 1. kh-w-f (خ و ف) - Khauf
  'kh-w-f': {
    meaningsIndonesian: [
      'Rasa takut dan kegentaran hati terhadap bahaya atau siksa',
      'Kewaspadaan jiwa dalam ketaatan dan menjauhi maksiat',
      'Rasa cemas yang mendorong manusia berlindung kepada Allah'
    ],
    etymologyNote: 'Akar kata خ-و-ف (khaafa) dalam Lisan al-\'Arab dan Maqayis al-Lughah memiliki asal makna kegentaran hati dan hilangnya rasa aman saat menghadapi hal yang dikhawatirkan. Digunakan dalam Al-Qur\'an untuk rasa takut manusiawi, rasa takut akan siksa Allah, serta peringatan dari godaan setan.',
    verbs: [
      {
        id: 'kh-w-f-v1',
        arabic: 'خَافَ - يَخَافُ',
        transliteration: 'khāfa - yakhāfu',
        type: 'verb',
        form: 'Form I (Mujarrad)',
        posTag: "Fi'il Madhi & Mudhari'",
        meaningIndo: 'Merasa takut / gentar / khawatir',
        frequency: 45
      },
      {
        id: 'kh-w-f-v2',
        arabic: 'خَوَّفَ - يُخَوِّفُ',
        transliteration: 'khawwafa - yukhawwifu',
        type: 'verb',
        form: 'Form II (Fa\'\'ala)',
        posTag: "Fi'il Madhi & Mudhari'",
        meaningIndo: 'Menakut-nakuti / memberi ancaman',
        frequency: 3
      },
      {
        id: 'kh-w-f-v3',
        arabic: 'تَخَوَّفَ - يَتَخَوَّفُ',
        transliteration: 'takhawwafa - yatakhawwafu',
        type: 'verb',
        form: 'Form V (Tafa\'\'ala)',
        posTag: "Fi'il Madhi & Mudhari'",
        meaningIndo: 'Merasa cemas secara bertahap / waspada',
        frequency: 1
      }
    ],
    nouns: [
      {
        id: 'kh-w-f-n1',
        arabic: 'خَوْف',
        transliteration: 'khawf',
        type: 'noun',
        posTag: 'Isim Masdar',
        meaningIndo: 'Rasa takut / kekhawatiran jiwa',
        frequency: 65
      },
      {
        id: 'kh-w-f-n2',
        arabic: 'خَائِف',
        transliteration: 'khā\'if',
        type: 'noun',
        posTag: 'Isim Fa\'il',
        meaningIndo: 'Orang yang dalam keadaan takut / waspada',
        frequency: 2
      },
      {
        id: 'kh-w-f-n3',
        arabic: 'تَخْوِيف',
        transliteration: 'takhwīf',
        type: 'noun',
        posTag: 'Isim Masdar (Form II)',
        meaningIndo: 'Peringatan yang menakutkan / ancaman',
        frequency: 8
      }
    ]
  },

  // 2. k-t-b (ك ت ب) - Kataba
  'k-t-b': {
    meaningsIndonesian: [
      'Menghimpun huruf dan makna dalam bentuk tulisan',
      'Ketetapan takdir dan kewajiban hukum yang pasti',
      'Kitab suci wahyu (Taurat, Injil, Zabur, Al-Qur\'an)'
    ],
    etymologyNote: 'Dalam Maqayis al-Lughah, asal kata k-t-b (ك-ت-ب) bermakna ضم الشيء إلى الشيء (mengumpulkan dan menyatukan sesuatu dengan lainnya). Menulis disebut kataba karena ia menyatukan huruf-huruf menjadi kata dan kalimat. Dari sini pula lahir makna ketetapan takdir yang telah terikat pasti.',
    verbs: [
      {
        id: 'k-t-b-v1',
        arabic: 'كَتَبَ - يَكْتُبُ',
        transliteration: 'kataba - yaktubu',
        type: 'verb',
        form: 'Form I (Mujarrad)',
        posTag: "Fi'il Madhi & Mudhari'",
        meaningIndo: 'Menulis / menetapkan / mewajibkan',
        frequency: 56
      },
      {
        id: 'k-t-b-v2',
        arabic: 'اكْتَتَبَ - يَكْتَتِبُ',
        transliteration: 'iktataba - yaktatibu',
        type: 'verb',
        form: 'Form VIII (Ifta\'ala)',
        posTag: "Fi'il Madhi & Mudhari'",
        meaningIndo: 'Menyuruh menuliskan / mencatat untuk diri sendiri',
        frequency: 1
      },
      {
        id: 'k-t-b-v3',
        arabic: 'كَاتَبَ - يُكَاتِبُ',
        transliteration: 'kātaba - yukātibu',
        type: 'verb',
        form: 'Form III (Fā\'ala)',
        posTag: "Fi'il Madhi & Mudhari'",
        meaningIndo: 'Membuat perjanjian pembebasan tertulis',
        frequency: 1
      }
    ],
    nouns: [
      {
        id: 'k-t-b-n1',
        arabic: 'كِتَاب',
        transliteration: 'kitāb',
        type: 'noun',
        posTag: 'Isim Masdar / Jamid',
        meaningIndo: 'Kitab / buku wahyu / catatan amal / surat',
        frequency: 255
      },
      {
        id: 'k-t-b-n2',
        arabic: 'كَاتِب',
        transliteration: 'kātib',
        type: 'noun',
        posTag: 'Isim Fa\'il',
        meaningIndo: 'Juru tulis / pencatat dokumen',
        frequency: 5
      },
      {
        id: 'k-t-b-n3',
        arabic: 'كُتُب',
        transliteration: 'kutub',
        type: 'noun',
        posTag: 'Isim Jamak Taksir',
        meaningIndo: 'Kitab-kitab / lembaran-lembaran suci',
        frequency: 38
      }
    ]
  },

  // 3. s-b-r (ص ب ر) - Sabar
  's-b-r': {
    meaningsIndonesian: [
      'Menahan jiwa dari keluh kesah dan hawa nafsu',
      'Ketabahan teguh dalam ketaatan dan menghadapi ujian',
      'Daya tahan mental spiritual yang kokoh laksana batu padat'
    ],
    etymologyNote: 'Dalam Lisan al-\'Arab, as-sabr (الصبر) berarti al-habs (الحبس - menahan/mengendalikan). Berasal dari kata shobarah (batu gunung yang keras dan padat tak tergoyahkan), serta shobir (obat herbal pahit yang menyembuhkan penyakit). Sabar adalah kepahitan yang membuahkan kesembuhan jiwa.',
    verbs: [
      {
        id: 's-b-r-v1',
        arabic: 'صَبَرَ - يَصْبِرُ',
        transliteration: 'sabara - yasbiru',
        type: 'verb',
        form: 'Form I (Mujarrad)',
        posTag: "Fi'il Madhi & Mudhari'",
        meaningIndo: 'Bersabar / bertahan teguh / menahan diri',
        frequency: 60
      },
      {
        id: 's-b-r-v2',
        arabic: 'صَابَرَ - يُصَابِرُ',
        transliteration: 'sābara - yusābiru',
        type: 'verb',
        form: 'Form III (Fā\'ala)',
        posTag: "Fi'il Madhi & Mudhari'",
        meaningIndo: 'Menguatkan kesabaran bersama orang lain / melipatgandakan ketabahan',
        frequency: 1
      },
      {
        id: 's-b-r-v3',
        arabic: 'اصْطَبَرَ - يَصْطَبِرُ',
        transliteration: 'istabara - yastabiru',
        type: 'verb',
        form: 'Form VIII (Ifta\'ala)',
        posTag: "Fi'il Madhi & Mudhari'",
        meaningIndo: 'Bersabar dengan perjuangan keras yang berkelanjutan',
        frequency: 4
      }
    ],
    nouns: [
      {
        id: 's-b-r-n1',
        arabic: 'صَبْر',
        transliteration: 'sabr',
        type: 'noun',
        posTag: 'Isim Masdar',
        meaningIndo: 'Kesabaran / ketabahan jiwa',
        frequency: 14
      },
      {
        id: 's-b-r-n2',
        arabic: 'صَابِر / صَابِرِين',
        transliteration: 'sābir / sābirīn',
        type: 'noun',
        posTag: 'Isim Fa\'il',
        meaningIndo: 'Orang-orang yang bersabar dan tabah',
        frequency: 20
      },
      {
        id: 's-b-r-n3',
        arabic: 'صَبَّار',
        transliteration: 'sabbār',
        type: 'noun',
        posTag: 'Isim Shighah Mubalaghah',
        meaningIndo: 'Sangat penyabar dalam segala kondisi',
        frequency: 4
      }
    ]
  }
};
