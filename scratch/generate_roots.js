const fs = require('fs');

const fullRoots = [
  // A / Alif
  { id: 'a-b-d', rootArabic: 'ا ب د', rootArabicJoined: 'ابد', rootLatin: 'abada', titleIndo: 'Kekekalan / Abadi', titleEnglish: 'Eternity / Forever', occurrences: 28, tags: ['abadi', 'kekal', 'forever'] },
  { id: 'a-j-r', rootArabic: 'ا ج ر', rootArabicJoined: 'اجر', rootLatin: 'ajara', titleIndo: 'Pahala / Ganjaran / Upah', titleEnglish: 'Reward / Wages', occurrences: 108, tags: ['pahala', 'ganjaran', 'upah', 'reward'] },
  { id: 'a-h-d', rootArabic: 'ا ح د', rootArabicJoined: 'أحد', rootLatin: 'ahada', titleIndo: 'Satu / Tunggal / Esa', titleEnglish: 'One / Unique', occurrences: 85, tags: ['esa', 'satu', 'tunggal', 'ikhlas'] },
  { id: 'a-k-z', rootArabic: 'ا خ ذ', rootArabicJoined: 'أخذ', rootLatin: 'akhadha', titleIndo: 'Mengambil / Memegang / Siksaan', titleEnglish: 'Take / Seize / Punishment', occurrences: 273, tags: ['ambil', 'pegang', 'siksa'] },
  { id: 'a-k-w', rootArabic: 'ا خ و', rootArabicJoined: 'اخو', rootLatin: 'akha', titleIndo: 'Saudara / Persaudaraan', titleEnglish: 'Brother / Brotherhood', occurrences: 96, tags: ['saudara', 'ikwan', 'persaudaraan'] },
  { id: 'a-r-d', rootArabic: 'ا ر ض', rootArabicJoined: 'أرض', rootLatin: 'ard', titleIndo: 'Bumi / Tanah / Negeri', titleEnglish: 'Earth / Land', occurrences: 461, tags: ['bumi', 'tanah', 'negeri', 'earth'] },
  { id: 'a-s-l', rootArabic: 'ا س ل', rootArabicJoined: 'أصل', rootLatin: 'asl', titleIndo: 'Akar / Dasar / Asal-usul', titleEnglish: 'Origin / Root / Base', occurrences: 10, tags: ['akar', 'dasar', 'asal'] },
  { id: 'a-k-l', rootArabic: 'ا ك ل', rootArabicJoined: 'أكل', rootLatin: 'akala', titleIndo: 'Makan / Makanan / Rezeki', titleEnglish: 'Eat / Food', occurrences: 109, tags: ['makan', 'makanan', 'santap'] },
  { id: 'a-l-h', rootArabic: 'ا ل ه', rootArabicJoined: 'إله', rootLatin: 'alaha', titleIndo: 'Allah / Ilah / Ketuhanan', titleEnglish: 'God / Allah', occurrences: 2851, tags: ['allah', 'tuhan', 'ilah'] },
  { id: 'a-m-r', rootArabic: 'ا م ر', rootArabicJoined: 'أمر', rootLatin: 'amara', titleIndo: 'Perintah / Urusan / Ketetapan', titleEnglish: 'Command / Affair', occurrences: 248, tags: ['perintah', 'urusan', 'amr'] },
  { id: 'a-m-n', rootArabic: 'ا م ن', rootArabicJoined: 'أمن', rootLatin: 'amana', titleIndo: 'Iman / Aman / Amanah', titleEnglish: 'Faith / Safety / Trust', occurrences: 879, tags: ['iman', 'percaya', 'aman', 'amanah'] },
  { id: 'a-n-s', rootArabic: 'ا ن س', rootArabicJoined: 'أنس', rootLatin: 'anisa', titleIndo: 'Manusia / Kehangatan Jiwa', titleEnglish: 'Human / Warmth', occurrences: 341, tags: ['manusia', 'insan', 'sejenis'] },
  { id: 'a-y-t', rootArabic: 'ا ي ت', rootArabicJoined: 'آية', rootLatin: 'ayah', titleIndo: 'Ayat / Tanda Kebesaran / Bukti', titleEnglish: 'Sign / Verse', occurrences: 382, tags: ['ayat', 'tanda', 'bukti'] },

  // B / Ba
  { id: 'b-r-k', rootArabic: 'ب ر ك', rootArabicJoined: 'برك', rootLatin: 'baraka', titleIndo: 'Berkah / Keberkahan / Kelimpahan', titleEnglish: 'Blessing / Abundance', occurrences: 32, tags: ['berkah', 'barakah', 'berkat'] },
  { id: 'b-s-r', rootArabic: 'ب ص ر', rootArabicJoined: 'بصر', rootLatin: 'basara', titleIndo: 'Penglihatan / Basar / Mata Hati', titleEnglish: 'Vision / Sight', occurrences: 148, tags: ['lihat', 'penglihatan', 'mata', 'basar'] },
  { id: 'b-a-t', rootArabic: 'ب ع ث', rootArabicJoined: 'بعث', rootLatin: 'ba\'atha', titleIndo: 'Membangkitkan / Mengutus', titleEnglish: 'Raise / Send', occurrences: 67, tags: ['bangkit', 'utus', 'rasul'] },
  { id: 'b-g-y', rootArabic: 'ب غ ي', rootArabicJoined: 'بغي', rootLatin: 'baghaa', titleIndo: 'Mencari / Kezaliman / Melampaui', titleEnglish: 'Seek / Transgress', occurrences: 96, tags: ['cari', 'zalim', 'lampau'] },
  { id: 'b-n-y', rootArabic: 'ب ن ي', rootArabicJoined: 'بني', rootLatin: 'banaa', titleIndo: 'Membangun / Anak Keturunan', titleEnglish: 'Build / Children', occurrences: 160, tags: ['bangun', 'anak', 'bani'] },

  // T / Ta
  { id: 't-b-a', rootArabic: 'ت ب ع', rootArabicJoined: 'تبع', rootLatin: 'tabi\'a', titleIndo: 'Mengikuti / Pengikut', titleEnglish: 'Follow / Follower', occurrences: 172, tags: ['ikut', 'mengikuti', 'pengikut'] },
  { id: 't-r-k', rootArabic: 'ت ر ك', rootArabicJoined: 'ترك', rootLatin: 'taraka', titleIndo: 'Meninggalkan / Warisan', titleEnglish: 'Leave / Abandon', occurrences: 43, tags: ['tinggal', 'meninggalkan', 'waris'] },
  { id: 't-l-w', rootArabic: 'ت ل و', rootArabicJoined: 'تلو', rootLatin: 'talaa', titleIndo: 'Membaca / Tilawah / Mengiringi', titleEnglish: 'Recite / Follow', occurrences: 63, tags: ['baca', 'tilawah', 'recite'] },
  { id: 't-w-b', rootArabic: 'ت و ب', rootArabicJoined: 'توب', rootLatin: 'tawaba', titleIndo: 'Taubat / Kembali / Ampunan', titleEnglish: 'Repentance / Return', occurrences: 87, tags: ['taubat', 'tobat', 'kembali'] },

  // J / Jim
  { id: 'j-b-l', rootArabic: 'ج ب ل', rootArabicJoined: 'جبل', rootLatin: 'jabal', titleIndo: 'Gunung / Pasak Bumi', titleEnglish: 'Mountain', occurrences: 39, tags: ['gunung', 'pasak', 'mountain'] },
  { id: 'j-a-l', rootArabic: 'ج ع ل', rootArabicJoined: 'جعل', rootLatin: 'ja\'ala', titleIndo: 'Menjadikan / Membuat / Menetapkan', titleEnglish: 'Make / Create / Appoint', occurrences: 346, tags: ['jadi', 'menjadikan', 'buat'] },
  { id: 'j-m-a', rootArabic: 'ج م ع', rootArabicJoined: 'جمع', rootLatin: 'jama\'a', titleIndo: 'Mengumpulkan / Jamaah / Hari Kiamat', titleEnglish: 'Gather / Assemble', occurrences: 129, tags: ['kumpul', 'jamaah', 'himpun'] },
  { id: 'j-n-n', rootArabic: 'ج ن ن', rootArabicJoined: 'جنن', rootLatin: 'janna', titleIndo: 'Surga / Jin / Tersembunyi', titleEnglish: 'Paradise / Jinn / Hidden', occurrences: 201, tags: ['surga', 'jannah', 'jin', 'taman'] },
  { id: 'j-h-d', rootArabic: 'ج ه د', rootArabicJoined: 'جهد', rootLatin: 'jahada', titleIndo: 'Jihad / Bersungguh-sungguh / Perjuangan', titleEnglish: 'Strive / Struggle / Jihad', occurrences: 41, tags: ['jihad', 'sungguh', 'juang'] },

  // H / Ha
  { id: 'h-b-b', rootArabic: 'ح ب ب', rootArabicJoined: 'حبب', rootLatin: 'habba', titleIndo: 'Cinta / Kasih / Mahabbah', titleEnglish: 'Love / Affection', occurrences: 95, tags: ['cinta', 'kasih', 'suka'] },
  { id: 'h-r-m', rootArabic: 'ح ر م', rootArabicJoined: 'حرم', rootLatin: 'harama', titleIndo: 'Haram / Suci / Kehormatan', titleEnglish: 'Sacred / Forbidden', occurrences: 83, tags: ['haram', 'suci', 'terlarang'] },
  { id: 'h-s-b', rootArabic: 'ح س ب', rootArabicJoined: 'حسب', rootLatin: 'hasiba', titleIndo: 'Hisab / Perhitungan / Cukup', titleEnglish: 'Calculate / Reckon', occurrences: 109, tags: ['hisab', 'hitung', 'cukup'] },
  { id: 'h-s-n', rootArabic: 'ح س ن', rootArabicJoined: 'حسن', rootLatin: 'hasana', titleIndo: 'Ihsan / Kebaikan / Keindahan', titleEnglish: 'Goodness / Beauty', occurrences: 194, tags: ['ihsan', 'baik', 'indah', 'elok'] },
  { id: 'h-q-q', rootArabic: 'ح ق ق', rootArabicJoined: 'حقق', rootLatin: 'haqqa', titleIndo: 'Haq / Kebenaran / Kepastian', titleEnglish: 'Truth / Right', occurrences: 287, tags: ['haq', 'benar', 'pasti'] },
  { id: 'h-k-m', rootArabic: 'ح ك م', rootArabicJoined: 'حكم', rootLatin: 'hakama', titleIndo: 'Hikmah / Hukum / Kebijaksanaan', titleEnglish: 'Wisdom / Judge', occurrences: 210, tags: ['hukum', 'hikmah', 'bijak'] },
  { id: 'h-m-d', rootArabic: 'ح م د', rootArabicJoined: 'حمد', rootLatin: 'hamida', titleIndo: 'Hamd / Pujian / Syukur', titleEnglish: 'Praise / Thanks', occurrences: 63, tags: ['puji', 'hamd', 'alhamdulillah'] },
  { id: 'h-y-y', rootArabic: 'ح ي ي', rootArabicJoined: 'حيي', rootLatin: 'hayya', titleIndo: 'Kehidupan / Hidup / Kehormatan', titleEnglish: 'Life / Live', occurrences: 184, tags: ['hidup', 'kehidupan', 'hayat'] },

  // Kh / Kha
  { id: 'k-b-r', rootArabic: 'خ ب ر', rootArabicJoined: 'خبر', rootLatin: 'khabara', titleIndo: 'Khabar / Berita / Maha Mengetahui', titleEnglish: 'News / Aware', occurrences: 52, tags: ['kabar', 'berita', 'tahu'] },
  { id: 'k-r-j', rootArabic: 'خ ر ج', rootArabicJoined: 'خرج', rootLatin: 'kharaja', titleIndo: 'Keluar / Mengeluarkan', titleEnglish: 'Exit / Produce', occurrences: 182, tags: ['keluar', 'terbit'] },
  { id: 'k-l-d', rootArabic: 'خ ل د', rootArabicJoined: 'خلد', rootLatin: 'khalada', titleIndo: 'Kekal / Keabadi di Surga/Neraka', titleEnglish: 'Abide / Immortality', occurrences: 87, tags: ['kekal', 'abadi', 'surga'] },
  { id: 'k-l-q', rootArabic: 'خ ل ق', rootArabicJoined: 'خلق', rootLatin: 'khalaqa', titleIndo: 'Khaliq / Penciptaan / Akhlak', titleEnglish: 'Create / Creation', occurrences: 261, tags: ['cipta', 'pencipta', 'akhlak'] },
  { id: 'k-w-f', rootArabic: 'خ و ف', rootArabicJoined: 'خوف', rootLatin: 'khaafa', titleIndo: 'Khauf / Rasa Takut / Kewaspadaan', titleEnglish: 'Fear / Danger', occurrences: 124, tags: ['takut', 'khauf', 'waspada'] },
  { id: 'k-y-r', rootArabic: 'خ ي ر', rootArabicJoined: 'خير', rootLatin: 'khayr', titleIndo: 'Khair / Kebaikan / Utama', titleEnglish: 'Good / Better', occurrences: 176, tags: ['baik', 'kebaikan', 'kebajikan'] },

  // D / Dal
  { id: 'd-k-l', rootArabic: 'د خ ل', rootArabicJoined: 'دخل', rootLatin: 'dakhala', titleIndo: 'Masuk / Memasukkan', titleEnglish: 'Enter / Admission', occurrences: 124, tags: ['masuk', 'pintu'] },
  { id: 'd-a-w', rootArabic: 'د ع و', rootArabicJoined: 'دعو', rootLatin: 'da\'aa', titleIndo: 'Doa / Seruan / Dakwah', titleEnglish: 'Call / Pray / Invite', occurrences: 212, tags: ['doa', 'seru', 'dakwah'] },
  { id: 'd-n-w', rootArabic: 'د ن و', rootArabicJoined: 'دنيا', rootLatin: 'dunya', titleIndo: 'Dunia / Dekat / Kehidupan Fana', titleEnglish: 'World / Near', occurrences: 115, tags: ['dunia', 'dekat', 'fana'] },

  // Dh / Dzal
  { id: 'z-k-r', rootArabic: 'ذ ك ر', rootArabicJoined: 'ذكر', rootLatin: 'dhakara', titleIndo: 'Zikir / Ingatan / Peringatan', titleEnglish: 'Remember / Mention', occurrences: 292, tags: ['zikir', 'ingat', 'peringatan'] },
  { id: 'z-n-b', rootArabic: 'ذ ن ب', rootArabicJoined: 'ذنب', rootLatin: 'dhanb', titleIndo: 'Dosa / Kesalahan / Pelanggaran', titleEnglish: 'Sin / Fault', occurrences: 39, tags: ['dosa', 'salah', 'ampun'] },

  // R / Ra
  { id: 'r-b-b', rootArabic: 'ر ب ب', rootArabicJoined: 'ربب', rootLatin: 'rabb', titleIndo: 'Rabb / Pemelihara / Tuhan', titleEnglish: 'Lord / Provider', occurrences: 980, tags: ['rabb', 'tuhan', 'pemelihara'] },
  { id: 'r-j-a', rootArabic: 'ر ج ع', rootArabicJoined: 'رجع', rootLatin: 'raja\'a', titleIndo: 'Kembali / Pulang Kepada Allah', titleEnglish: 'Return / Turn back', occurrences: 104, tags: ['kembali', 'pulang', 'pulang'] },
  { id: 'r-h-m', rootArabic: 'ر ح م', rootArabicJoined: 'رحم', rootLatin: 'rahima', titleIndo: 'Rahmah / Kasih Sayang / Rahim', titleEnglish: 'Mercy / Compassion', occurrences: 339, tags: ['rahmah', 'kasih', 'sayang'] },
  { id: 'r-z-q', rootArabic: 'ر ز ق', rootArabicJoined: 'رزق', rootLatin: 'razaqa', titleIndo: 'Rezeki / Karunia / Pembagian', titleEnglish: 'Provision / Sustenance', occurrences: 123, tags: ['rezeki', 'karunia', 'makan'] },
  { id: 'r-s-l', rootArabic: 'ر س ل', rootArabicJoined: 'رسل', rootLatin: 'arsala', titleIndo: 'Rasul / Utusan / Risalah', titleEnglish: 'Messenger / Send', occurrences: 513, tags: ['rasul', 'utusan', 'kirim'] },
  { id: 'r-d-y', rootArabic: 'ر ض ي', rootArabicJoined: 'رضي', rootLatin: 'radiya', titleIndo: 'Ridha / Kerelaan / Perkenan', titleEnglish: 'Pleased / Content', occurrences: 73, tags: ['ridha', 'rela', 'suka'] },
  { id: 'r-f-a', rootArabic: 'ر ف ع', rootArabicJoined: 'رفع', rootLatin: 'rafa\'a', titleIndo: 'Meninggikan / Mengangkat', titleEnglish: 'Raise / Elevate', occurrences: 29, tags: ['tinggi', 'angkat', 'derajat'] },

  // Z / Zai
  { id: 'z-k-w', rootArabic: 'ز ك و', rootArabicJoined: 'زكاة', rootLatin: 'zakat', titleIndo: 'Zakat / Pertumbuhan / Kesucian', titleEnglish: 'Zakat / Purity', occurrences: 59, tags: ['zakat', 'suci', 'bersih'] },

  // S / Sin
  { id: 's-b-h', rootArabic: 'س ب ح', rootArabicJoined: 'سبح', rootLatin: 'sabbaha', titleIndo: 'Tasbih / Menyucikan Allah', titleEnglish: 'Glory / Praise', occurrences: 92, tags: ['tasbih', 'suci', 'puji'] },
  { id: 's-b-l', rootArabic: 'س ب ل', rootArabicJoined: 'سبل', rootLatin: 'sabiil', titleIndo: 'Sabil / Jalan / Jalur', titleEnglish: 'Way / Path', occurrences: 176, tags: ['jalan', 'sabil', 'petunjuk'] },
  { id: 's-j-d', rootArabic: 'س ج د', rootArabicJoined: 'سجد', rootLatin: 'sajada', titleIndo: 'Sujud / Ketundukan', titleEnglish: 'Prostrate / Worship', occurrences: 92, tags: ['sujud', 'tunduk', 'masjid'] },
  { id: 's-l-m', rootArabic: 'س ل م', rootArabicJoined: 'سلم', rootLatin: 'salima', titleIndo: 'Salam / Keselamatan / Kedamaian / Islam', titleEnglish: 'Peace / Islam', occurrences: 140, tags: ['salam', 'islam', 'damai', 'selamat'] },
  { id: 's-m-a', rootArabic: 'س م ع', rootArabicJoined: 'سمع', rootLatin: 'sami\'a', titleIndo: 'Sama\' / Pendengaran / Mendengar', titleEnglish: 'Hear / Listen', occurrences: 185, tags: ['dengar', 'pendengaran', 'sama'] },
  { id: 's-m-w', rootArabic: 'س م و', rootArabicJoined: 'سمو', rootLatin: 'samaa', titleIndo: 'Langit / Nama / Ketinggian', titleEnglish: 'Sky / Name', occurrences: 381, tags: ['langit', 'nama', 'sama'] },

  // Sh / Syin
  { id: 's-r-k', rootArabic: 'ش ر ك', rootArabicJoined: 'شرك', rootLatin: 'syirik', titleIndo: 'Syirik / Sekutu / Persekutuan', titleEnglish: 'Polytheism / Partner', occurrences: 168, tags: ['syirik', 'sekutu', 'syirk'] },
  { id: 's-k-r', rootArabic: 'ش ك ر', rootArabicJoined: 'شكر', rootLatin: 'shakara', titleIndo: 'Syukur / Terima Kasih / Pujian', titleEnglish: 'Thank / Gratitude', occurrences: 75, tags: ['syukur', 'terima kasih', 'puji'] },
  { id: 's-h-d', rootArabic: 'ش ه د', rootArabicJoined: 'شهد', rootLatin: 'syahadat', titleIndo: 'Syahadat / Kesaksian / Hadir', titleEnglish: 'Witness / Testimony', occurrences: 160, tags: ['syahadat', 'saksi', 'syahid'] },

  // S / Sad
  { id: 's-b-r', rootArabic: 'ص ب ر', rootArabicJoined: 'صبر', rootLatin: 'sabar', titleIndo: 'Sabar / Ketabahan / Menahan Diri', titleEnglish: 'Patience / Steadfastness', occurrences: 103, tags: ['sabar', 'sobar', 'tabah'] },
  { id: 's-d-q', rootArabic: 'ص د ق', rootArabicJoined: 'صدق', rootLatin: 'sadaqa', titleIndo: 'Shiddiq / Kejujuran / Sedekah', titleEnglish: 'Truthful / Charity', occurrences: 155, tags: ['jujur', 'sedekah', 'benar'] },
  { id: 's-r-t', rootArabic: 'ص ر ط', rootArabicJoined: 'صراط', rootLatin: 'sirat', titleIndo: 'Sirath / Jalan Lurus', titleEnglish: 'Straight Path', occurrences: 45, tags: ['sirath', 'jalan', 'lurus'] },
  { id: 's-l-h', rootArabic: 'ص ل ح', rootArabicJoined: 'صلح', rootLatin: 'saleh', titleIndo: 'Saleh / Kesalehan / Kebaikan', titleEnglish: 'Righteous / Good', occurrences: 180, tags: ['saleh', 'sholeh', 'baik'] },
  { id: 's-l-w', rootArabic: 'ص ل و', rootArabicJoined: 'صلوة', rootLatin: 'salat', titleIndo: 'Salat / Sholat / Doa / Keagungan', titleEnglish: 'Prayer / Worship', occurrences: 99, tags: ['sholat', 'salat', 'solat', 'doa'] },

  // T / Tha
  { id: 't-h-r', rootArabic: 'ط ه ر', rootArabicJoined: 'طهر', rootLatin: 'tahara', titleIndo: 'Thaharah / Bersih / Kesucian', titleEnglish: 'Purity / Clean', occurrences: 31, tags: ['suci', 'bersih', 'thaharah'] },
  { id: 't-y-b', rootArabic: 'ط ي ب', rootArabicJoined: 'طيب', rootLatin: 'tayyib', titleIndo: 'Thayyib / Kebaikan / Kesucian Rezeki', titleEnglish: 'Good / Pure', occurrences: 50, tags: ['thayyib', 'baik', 'suci'] },

  // Dh / Dhad
  { id: 'd-l-l', rootArabic: 'ض ل ل', rootArabicJoined: 'ضلل', rootLatin: 'dalala', titleIndo: 'Kesesatan / Menyimpang', titleEnglish: 'Astray / Error', occurrences: 191, tags: ['sesat', 'menyimpang', 'rugi'] },

  // Gh / Ghain
  { id: 'g-f-r', rootArabic: 'غ ف ر', rootArabicJoined: 'غفر', rootLatin: 'ghafara', titleIndo: 'Maghfirah / Ampunan / Perlindungan', titleEnglish: 'Forgive / Cover', occurrences: 234, tags: ['ampun', 'maghfirah', 'ghafur'] },
  { id: 'g-y-b', rootArabic: 'غ ي ب', rootArabicJoined: 'غيب', rootLatin: 'ghayb', titleIndo: 'Gaib / Tersembunyi / Rahasia', titleEnglish: 'Unseen / Hidden', occurrences: 60, tags: ['gaib', 'tersembunyi', 'rahasia'] },

  // F / Fa
  { id: 'f-t-h', rootArabic: 'ف ت ح', rootArabicJoined: 'فتح', rootLatin: 'fataha', titleIndo: 'Kemenangan / Pembukaan / Kunci', titleEnglish: 'Victory / Open', occurrences: 38, tags: ['menang', 'buka', 'kunci'] },
  { id: 'f-t-n', rootArabic: 'ف ت ن', rootArabicJoined: 'فتن', rootLatin: 'fatana', titleIndo: 'Fitnah / Ujian / Cobaan Hati', titleEnglish: 'Trial / Affliction', occurrences: 60, tags: ['fitnah', 'ujian', 'cobaan'] },
  { id: 'f-r-q', rootArabic: 'ف ر ق', rootArabicJoined: 'فرق', rootLatin: 'faraqa', titleIndo: 'Furqan / Pembeda Hak & Batil / Pemisah', titleEnglish: 'Criterion / Separate', occurrences: 72, tags: ['furqan', 'pembeda', 'pisah'] },
  { id: 'f-a-l', rootArabic: 'ف ع ل', rootArabicJoined: 'فعل', rootLatin: 'fa\'ala', titleIndo: 'Fi\'il / Perbuatan / Tindakan', titleEnglish: 'Do / Act / Deed', occurrences: 108, tags: ['buat', 'tindak', 'fiil'] },

  // Q / Qaf
  { id: 'q-d-r', rootArabic: 'ق د ر', rootArabicJoined: 'قدر', rootLatin: 'qadara', titleIndo: 'Qadar / Takdir / Kemampuan / Ukuran', titleEnglish: 'Decree / Power / Measure', occurrences: 132, tags: ['takdir', 'kuasa', 'ukuran', 'qadar'] },
  { id: 'q-r-a', rootArabic: 'ق ر ا', rootArabicJoined: 'قرا', rootLatin: 'qaraa', titleIndo: 'Qur\'an / Membaca / Menghimpun', titleEnglish: 'Read / Recite / Quran', occurrences: 88, tags: ['quran', 'baca', 'ngaji'] },
  { id: 'q-l-b', rootArabic: 'ق ل ب', rootArabicJoined: 'قلب', rootLatin: 'qalaba', titleIndo: 'Qalbu / Hati / Membalikkan', titleEnglish: 'Heart / Turn', occurrences: 168, tags: ['hati', 'qalbu', 'jiwa'] },
  { id: 'q-w-l', rootArabic: 'ق و ل', rootArabicJoined: 'قول', rootLatin: 'qawala', titleIndo: 'Qaul / Perkataan / Firman', titleEnglish: 'Say / Speech', occurrences: 1722, tags: ['kata', 'firman', 'qaul'] },
  { id: 'q-w-m', rootArabic: 'ق و م', rootArabicJoined: 'قوم', rootLatin: 'qaama', titleIndo: 'Kaum / Berdiri / Tegak / Salat', titleEnglish: 'Stand / People', occurrences: 660, tags: ['berdiri', 'kaum', 'tegak'] },

  // K / Kaf
  { id: 'k-t-b', rootArabic: 'ك ت ب', rootArabicJoined: 'كتب', rootLatin: 'kataba', titleIndo: 'Tulis / Kitab / Ketetapan Hukum', titleEnglish: 'Write / Book', occurrences: 319, tags: ['tulis', 'kitab', 'catat'] },
  { id: 'k-f-r', rootArabic: 'ك ف ر', rootArabicJoined: 'كفر', rootLatin: 'kafara', titleIndo: 'Kufur / Meringkari / Kafir', titleEnglish: 'Disbelieve / Cover', occurrences: 525, tags: ['kufur', 'ingkar', 'kafir'] },

  // L / Lam
  { id: 'l-a-n', rootArabic: 'ل ع ن', rootArabicJoined: 'لعن', rootLatin: 'la\'ana', titleIndo: 'Laknat / Kutukan / Jauh dari Rahmat', titleEnglish: 'Curse / Damnation', occurrences: 41, tags: ['laknat', 'kutuk', 'jauh'] },

  // M / Mim
  { id: 'm-l-k', rootArabic: 'م ل ك', rootArabicJoined: 'ملك', rootLatin: 'malaka', titleIndo: 'Malik / Kerajaan / Kepemilikan / Malaikat', titleEnglish: 'King / Owner / Angel', occurrences: 206, tags: ['raja', 'milik', 'malaikat', 'malik'] },
  { id: 'm-w-t', rootArabic: 'م و ت', rootArabicJoined: 'موت', rootLatin: 'maata', titleIndo: 'Maut / Kematian / Mati', titleEnglish: 'Death / Die', occurrences: 165, tags: ['mati', 'maut', 'kematian'] },

  // N / Nun
  { id: 'n-z-l', rootArabic: 'ن ز ل', rootArabicJoined: 'نزل', rootLatin: 'nazala', titleIndo: 'Turun / Wahyu Tersebar', titleEnglish: 'Reveal / Descend', occurrences: 293, tags: ['turun', 'wahyu', 'tanzil'] },
  { id: 'n-s-r', rootArabic: 'ن ص ر', rootArabicJoined: 'نصر', rootLatin: 'nasara', titleIndo: 'Nasr / Pertolongan / Kemenangan', titleEnglish: 'Help / Victory', occurrences: 158, tags: ['tolong', 'menang', 'anshar'] },
  { id: 'n-w-r', rootArabic: 'ن و ر', rootArabicJoined: 'نور', rootLatin: 'nawara', titleIndo: 'Nur / Cahaya / Penerang', titleEnglish: 'Light / Illumination', occurrences: 194, tags: ['cahaya', 'nur', 'terang'] },

  // H / Ha (Soft)
  { id: 'h-d-y', rootArabic: 'ه د ي', rootArabicJoined: 'هدي', rootLatin: 'hadaya', titleIndo: 'Hidayah / Petunjuk / Bimbingan', titleEnglish: 'Guide / Guidance', occurrences: 316, tags: ['hidayah', 'petunjuk', 'bimbingan'] },

  // W / Wau
  { id: 'w-h-y', rootArabic: 'و ح ي', rootArabicJoined: 'وحي', rootLatin: 'wahaa', titleIndo: 'Wahyu / Ilham / Bisikan Suci', titleEnglish: 'Revelation / Inspiration', occurrences: 78, tags: ['wahyu', 'ilham', 'bisikan'] },
  { id: 'w-q-y', rootArabic: 'و ق ي', rootArabicJoined: 'تقوى', rootLatin: 'taqwa', titleIndo: 'Taqwa / Takwa / Perisai Diri', titleEnglish: 'Piety / Protection', occurrences: 258, tags: ['takwa', 'taqwa', 'pelihara'] },
  { id: 'w-k-l', rootArabic: 'و ك ل', rootArabicJoined: 'وكل', rootLatin: 'wakala', titleIndo: 'Tawakal / Pelindung / Berserah', titleEnglish: 'Trust / Guardian', occurrences: 70, tags: ['tawakal', 'serah', 'wakil'] },
  { id: 'w-l-y', rootArabic: 'و ل ي', rootArabicJoined: 'ولي', rootLatin: 'wali', titleIndo: 'Wali / Pelindung / Penolong / Kekasih Allah', titleEnglish: 'Protector / Friend', occurrences: 233, tags: ['wali', 'pelindung', 'teman'] },

  // Y / Ya
  { id: 'y-q-n', rootArabic: 'ي ق ن', rootArabicJoined: 'يقن', rootLatin: 'yaqina', titleIndo: 'Yakin / Kepastian / Mantap', titleEnglish: 'Certainty / Sure', occurrences: 28, tags: ['yakin', 'pasti', 'mantap'] }
];

console.log(`Generated ${fullRoots.length} comprehensive Quranic root entries!`);
