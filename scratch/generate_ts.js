const fs = require('fs');

const rawRoots = [
  // Alif (أ)
  { id: 'a-b-d', rootArabic: 'ا ب د', rootArabicJoined: 'ابد', rootLatin: 'abada', titleIndo: 'Kekekalan / Abadi', titleEnglish: 'Eternity / Forever', count: 28 },
  { id: 'a-b-q', rootArabic: 'ا ب ق', rootArabicJoined: 'ابق', rootLatin: 'abaqa', titleIndo: 'Melarikan Diri / Kabur', titleEnglish: 'Run Away', count: 1 },
  { id: 'a-b-l', rootArabic: 'ا ب ل', rootArabicJoined: 'ابل', rootLatin: 'ibal', titleIndo: 'Unta / Ternak', titleEnglish: 'Camels', count: 2 },
  { id: 'a-t-y', rootArabic: 'ا ت ي', rootArabicJoined: 'أتى', rootLatin: 'ataa', titleIndo: 'Datang / Memberi / Melakukan', titleEnglish: 'Come / Give', count: 549 },
  { id: 'a-j-r', rootArabic: 'ا ج ر', rootArabicJoined: 'اجر', rootLatin: 'ajara', titleIndo: 'Pahala / Ganjaran / Upah', titleEnglish: 'Reward / Wages', count: 108 },
  { id: 'a-j-l', rootArabic: 'ا ج ل', rootArabicJoined: 'اجل', rootLatin: 'ajala', titleIndo: 'Ajal / Batas Waktu', titleEnglish: 'Term / Specified Time', count: 56 },
  { id: 'a-h-d', rootArabic: 'ا ح د', rootArabicJoined: 'أحد', rootLatin: 'ahada', titleIndo: 'Esa / Satu / Tunggal', titleEnglish: 'One / Unique', count: 85 },
  { id: 'a-k-z', rootArabic: 'ا خ ذ', rootArabicJoined: 'أخذ', rootLatin: 'akhadha', titleIndo: 'Mengambil / Memegang / Siksaan', titleEnglish: 'Take / Seize', count: 273 },
  { id: 'a-k-r', rootArabic: 'ا خ ر', rootArabicJoined: 'أخر', rootLatin: 'akhara', titleIndo: 'Akhirat / Yang Terakhir', titleEnglish: 'Hereafter / Last', count: 250 },
  { id: 'a-k-w', rootArabic: 'ا خ و', rootArabicJoined: 'اخو', rootLatin: 'akha', titleIndo: 'Saudara / Persaudaraan', titleEnglish: 'Brotherhood', count: 96 },
  { id: 'a-d-m', rootArabic: 'ا د م', rootArabicJoined: 'أدم', rootLatin: 'adam', titleIndo: 'Nabi Adam / Manusia', titleEnglish: 'Adam / Human', count: 25 },
  { id: 'a-z-n', rootArabic: 'ا ذ ن', rootArabicJoined: 'أذن', rootLatin: 'adhina', titleIndo: 'Izin / Azan / Mendengar', titleEnglish: 'Permission / Hear', count: 102 },
  { id: 'a-z-y', rootArabic: 'ا ذ ي', rootArabicJoined: 'أذي', rootLatin: 'adhiya', titleIndo: 'Gangguan / Haram / Menyakiti', titleEnglish: 'Hurt / Harm', count: 24 },
  { id: 'a-r-d', rootArabic: 'ا ر ض', rootArabicJoined: 'أرض', rootLatin: 'ard', titleIndo: 'Bumi / Tanah / Negeri', titleEnglish: 'Earth / Land', count: 461 },
  { id: 'a-s-d', rootArabic: 'ا س د', rootArabicJoined: 'أسد', rootLatin: 'asad', titleIndo: 'Singa / Keberanian', titleEnglish: 'Lion', count: 1 },
  { id: 'a-s-f', rootArabic: 'ا س ف', rootArabicJoined: 'أسف', rootLatin: 'asifa', titleIndo: 'Sedih / Penyesalan Mendalam', titleEnglish: 'Grief / Sorrow', count: 7 },
  { id: 'a-s-l', rootArabic: 'ا س ل', rootArabicJoined: 'أصل', rootLatin: 'asl', titleIndo: 'Akar / Dasar / Asal-usul', titleEnglish: 'Origin / Base', count: 10 },
  { id: 'a-s-n', rootArabic: 'ا س ن', rootArabicJoined: 'أسنا', rootLatin: 'asin', titleIndo: 'Berubah Rasa / Bau Air', titleEnglish: 'Unpolluted Water', count: 2 },
  { id: 'a-s-w', rootArabic: 'ا س و', rootArabicJoined: 'أسوة', rootLatin: 'uswah', titleIndo: 'Teladan / Uswah Panutan', titleEnglish: 'Example / Pattern', count: 3 },
  { id: 'a-f-q', rootArabic: 'ا ف ق', rootArabicJoined: 'أفق', rootLatin: 'ufuq', titleIndo: 'Ufuk / Cakrawala', titleEnglish: 'Horizon', count: 4 },
  { id: 'a-k-l', rootArabic: 'ا ك ل', rootArabicJoined: 'أكل', rootLatin: 'akala', titleIndo: 'Makan / Makanan', titleEnglish: 'Eat / Food', count: 109 },
  { id: 'a-l-h', rootArabic: 'ا ل ه', rootArabicJoined: 'إله', rootLatin: 'alaha', titleIndo: 'Allah SWT / Ilah / Ketuhanan', titleEnglish: 'God / Allah', count: 2851 },
  { id: 'a-m-r', rootArabic: 'ا م ر', rootArabicJoined: 'أمر', rootLatin: 'amara', titleIndo: 'Perintah / Urusan', titleEnglish: 'Command / Affair', count: 248 },
  { id: 'a-m-l', rootArabic: 'ا م ل', rootArabicJoined: 'أمل', rootLatin: 'amal', titleIndo: 'Harapan / Angan-angan', titleEnglish: 'Hope', count: 2 },
  { id: 'a-m-n', rootArabic: 'ا م ن', rootArabicJoined: 'أمن', rootLatin: 'amana', titleIndo: 'Iman / Percaya / Amanah', titleEnglish: 'Faith / Safety', count: 879 },
  { id: 'a-n-s', rootArabic: 'ا ن س', rootArabicJoined: 'أنس', rootLatin: 'anisa', titleIndo: 'Manusia / Insan', titleEnglish: 'Mankind / Human', count: 341 },
  { id: 'a-h-l', rootArabic: 'ا ه ل', rootArabicJoined: 'أهل', rootLatin: 'ahl', titleIndo: 'Keluarga / Ahli / Pemilik', titleEnglish: 'Family / People', count: 127 },
  { id: 'a-w-l', rootArabic: 'ا و ل', rootArabicJoined: 'أول', rootLatin: 'awwal', titleIndo: 'Pertama / Takwil', titleEnglish: 'First / Interpretation', count: 170 },
  { id: 'a-y-t', rootArabic: 'ا ي ت', rootArabicJoined: 'آية', rootLatin: 'ayah', titleIndo: 'Ayat / Tanda Kebesaran', titleEnglish: 'Sign / Verse', count: 382 },

  // Ba (ب)
  { id: 'b-a-s', rootArabic: 'ب ء س', rootArabicJoined: 'بؤس', rootLatin: 'baasa', titleIndo: 'Kesusahan / Al-Baas Siksaan', titleEnglish: 'Adversity', count: 73 },
  { id: 'b-t-k', rootArabic: 'ب ت ك', rootArabicJoined: 'بتك', rootLatin: 'bataka', titleIndo: 'Memotong / Membelah', titleEnglish: 'Cut Off', count: 1 },
  { id: 'b-th-th', rootArabic: 'ب ث ث', rootArabicJoined: 'بثث', rootLatin: 'baththa', titleIndo: 'Menebarkan / Menyebarkan', titleEnglish: 'Scatter', count: 9 },
  { id: 'b-r-a', rootArabic: 'ب ر أ', rootArabicJoined: 'برأ', rootLatin: 'baraa', titleIndo: 'Bebas / Al-Bari Pencipta', titleEnglish: 'Create / Free', count: 31 },
  { id: 'b-r-k', rootArabic: 'ب ر ك', rootArabicJoined: 'برك', rootLatin: 'baraka', titleIndo: 'Berkah / Keberkahan', titleEnglish: 'Blessing', count: 32 },
  { id: 'b-r-j', rootArabic: 'ب ر ج', rootArabicJoined: 'برج', rootLatin: 'burj', titleIndo: 'Benteng / Rasi Bintang Buruj', titleEnglish: 'Towers / Constellations', count: 4 },
  { id: 'b-s-r', rootArabic: 'ب ص ر', rootArabicJoined: 'بصر', rootLatin: 'basara', titleIndo: 'Basar / Penglihatan / Mata Hati', titleEnglish: 'Sight / Vision', count: 148 },
  { id: 'b-t-n', rootArabic: 'ب ط ن', rootArabicJoined: 'بطن', rootLatin: 'batn', titleIndo: 'Perut / Batin / Tersembunyi', titleEnglish: 'Belly / Hidden', count: 25 },
  { id: 'b-a-th', rootArabic: 'ب ع ث', rootArabicJoined: 'بعث', rootLatin: 'baatha', titleIndo: 'Membangkitkan / Mengutus', titleEnglish: 'Raise / Send', count: 67 },
  { id: 'b-g-y', rootArabic: 'ب غ ي', rootArabicJoined: 'بغي', rootLatin: 'baghaa', titleIndo: 'Mencari / Kezaliman', titleEnglish: 'Seek / Transgress', count: 96 },
  { id: 'b-q-r', rootArabic: 'ب ق ر', rootArabicJoined: 'بقر', rootLatin: 'baqara', titleIndo: 'Sapi Betina', titleEnglish: 'Cow', count: 9 },
  { id: 'b-k-y', rootArabic: 'ب ك ي', rootArabicJoined: 'بكي', rootLatin: 'bakaa', titleIndo: 'Menangis / Tangisan', titleEnglish: 'Weep / Cry', count: 7 },
  { id: 'b-l-g', rootArabic: 'ب ل غ', rootArabicJoined: 'بلغ', rootLatin: 'balagha', titleIndo: 'Sampai / Baligh / Menyampaikan', titleEnglish: 'Reach / Deliver', count: 77 },
  { id: 'b-n-y', rootArabic: 'ب ن ي', rootArabicJoined: 'بني', rootLatin: 'banaa', titleIndo: 'Membangun / Anak Keturunan Bani', titleEnglish: 'Build / Children', count: 160 },

  // Ta (ت)
  { id: 't-b-a', rootArabic: 'ت ب ع', rootArabicJoined: 'تبع', rootLatin: 'tabia', titleIndo: 'Mengikuti / Pengikut', titleEnglish: 'Follow', count: 172 },
  { id: 't-r-k', rootArabic: 'ت ر ك', rootArabicJoined: 'ترك', rootLatin: 'taraka', titleIndo: 'Meninggalkan / Peninggalan', titleEnglish: 'Leave', count: 43 },
  { id: 't-l-w', rootArabic: 'ت ل و', rootArabicJoined: 'تلو', rootLatin: 'talaa', titleIndo: 'Membaca / Tilawah / Mengiringi', titleEnglish: 'Recite / Follow', count: 63 },
  { id: 't-w-b', rootArabic: 'ت و ب', rootArabicJoined: 'توب', rootLatin: 'tawaba', titleIndo: 'Taubat / Kembali / Ampunan', titleEnglish: 'Repentance', count: 87 },

  // Tha (ث)
  { id: 'th-b-t', rootArabic: 'ث ب ت', rootArabicJoined: 'ثبت', rootLatin: 'thabata', titleIndo: 'Teguh / Kokoh / Menetapkan', titleEnglish: 'Firm / Steadfast', count: 18 },
  { id: 'th-q-l', rootArabic: 'ث ق ل', rootArabicJoined: 'ثقل', rootLatin: 'thaqula', titleIndo: 'Berat / Timbangan Tsaqil', titleEnglish: 'Heavy / Weight', count: 28 },
  { id: 'th-l-th', rootArabic: 'ث ل ث', rootArabicJoined: 'ثلث', rootLatin: 'thalath', titleIndo: 'Tiga / Sepertiga', titleEnglish: 'Three', count: 33 },
  { id: 'th-m-r', rootArabic: 'ث م ر', rootArabicJoined: 'ثمر', rootLatin: 'thamara', titleIndo: 'Buah / Hasil Petik', titleEnglish: 'Fruit / Produce', count: 24 },

  // Jim (ج)
  { id: 'j-b-l', rootArabic: 'ج ب ل', rootArabicJoined: 'جبل', rootLatin: 'jabal', titleIndo: 'Gunung / Pasak Bumi', titleEnglish: 'Mountain', count: 39 },
  { id: 'j-th-w', rootArabic: 'ج ث و', rootArabicJoined: 'جثو', rootLatin: 'jathaa', titleIndo: 'Berlutut / Bertekuk Lutut', titleEnglish: 'Kneel', count: 3 },
  { id: 'j-a-l', rootArabic: 'ج ع ل', rootArabicJoined: 'جعل', rootLatin: 'jaala', titleIndo: 'Menjadikan / Membuat', titleEnglish: 'Make / Appoint', count: 346 },
  { id: 'j-m-a', rootArabic: 'ج م ع', rootArabicJoined: 'جمع', rootLatin: 'jamaa', titleIndo: 'Mengumpulkan / Jamaah', titleEnglish: 'Gather / Assemble', count: 129 },
  { id: 'j-n-n', rootArabic: 'ج ن ن', rootArabicJoined: 'جنن', rootLatin: 'janna', titleIndo: 'Surga Jannah / Jin / Tersembunyi', titleEnglish: 'Paradise / Jinn', count: 201 },
  { id: 'j-h-d', rootArabic: 'ج ه د', rootArabicJoined: 'جهد', rootLatin: 'jahada', titleIndo: 'Jihad / Bersungguh-sungguh', titleEnglish: 'Strive / Jihad', count: 41 },
  { id: 'j-w-b', rootArabic: 'ج و ب', rootArabicJoined: 'جوب', rootLatin: 'jaaba', titleIndo: 'Menjawab / Memperkenankan Doa', titleEnglish: 'Answer / Respond', count: 43 },

  // Ha (ح)
  { id: 'h-b-b', rootArabic: 'ح ب ب', rootArabicJoined: 'حبب', rootLatin: 'habba', titleIndo: 'Cinta / Kasih Sayang', titleEnglish: 'Love', count: 95 },
  { id: 'h-j-j', rootArabic: 'ح ج ج', rootArabicJoined: 'حجج', rootLatin: 'hajja', titleIndo: 'Haji / Berargumen / Alasan', titleEnglish: 'Pilgrimage / Argue', count: 33 },
  { id: 'h-d-th', rootArabic: 'ح د ث', rootArabicJoined: 'حدث', rootLatin: 'hadatha', titleIndo: 'Hadis / Pembicaraan / Kejadian', titleEnglish: 'Discourse / Event', count: 36 },
  { id: 'h-r-m', rootArabic: 'ح ر م', rootArabicJoined: 'حرم', rootLatin: 'harama', titleIndo: 'Haram / Suci / Kehormatan', titleEnglish: 'Sacred / Forbidden', count: 83 },
  { id: 'h-s-b', rootArabic: 'ح س ب', rootArabicJoined: 'حسب', rootLatin: 'hasiba', titleIndo: 'Hisab / Perhitungan / Cukup', titleEnglish: 'Reckon / Count', count: 109 },
  { id: 'h-s-n', rootArabic: 'ح س ن', rootArabicJoined: 'حسن', rootLatin: 'hasana', titleIndo: 'Ihsan / Kebaikan / Keindahan', titleEnglish: 'Goodness / Beauty', count: 194 },
  { id: 'h-sh-r', rootArabic: 'ح ش ر', rootArabicJoined: 'حشر', rootLatin: 'hashara', titleIndo: 'Mahsyar / Mengumpulkan', titleEnglish: 'Gather / Assemble', count: 43 },
  { id: 'h-q-q', rootArabic: 'ح ق ق', rootArabicJoined: 'حقق', rootLatin: 'haqqa', titleIndo: 'Haq / Kebenaran / Kepastian', titleEnglish: 'Truth / Right', count: 287 },
  { id: 'h-k-m', rootArabic: 'ح ك م', rootArabicJoined: 'حكم', rootLatin: 'hakama', titleIndo: 'Hikmah / Hukum / Kebijaksanaan', titleEnglish: 'Wisdom / Judge', count: 210 },
  { id: 'h-l-l', rootArabic: 'ح ل ل', rootArabicJoined: 'حلل', rootLatin: 'halala', titleIndo: 'Halal / Melepaskan Ikatan', titleEnglish: 'Lawful / Untie', count: 52 },
  { id: 'h-m-d', rootArabic: 'ح م د', rootArabicJoined: 'حمد', rootLatin: 'hamida', titleIndo: 'Hamd / Pujian / Syukur', titleEnglish: 'Praise / Thanks', count: 63 },
  { id: 'h-m-l', rootArabic: 'ح م ل', rootArabicJoined: 'حمل', rootLatin: 'hamala', titleIndo: 'Membawa / Memikul / Mengandung', titleEnglish: 'Carry / Bear', count: 64 },
  { id: 'h-y-y', rootArabic: 'ح ي ي', rootArabicJoined: 'حيي', rootLatin: 'hayya', titleIndo: 'Kehidupan / Hidup', titleEnglish: 'Life / Live', count: 184 },

  // Kha (خ)
  { id: 'kh-b-r', rootArabic: 'خ ب ر', rootArabicJoined: 'خبر', rootLatin: 'khabara', titleIndo: 'Berita / Khabar / Maha Mengetahui', titleEnglish: 'News / Aware', count: 52 },
  { id: 'kh-t-m', rootArabic: 'خ ت م', rootArabicJoined: 'ختم', rootLatin: 'khatama', titleIndo: 'Khatam / Menyegel / Penutup', titleEnglish: 'Seal', count: 8 },
  { id: 'kh-r-j', rootArabic: 'خ ر ج', rootArabicJoined: 'خرج', rootLatin: 'kharaja', titleIndo: 'Keluar / Mengeluarkan', titleEnglish: 'Exit / Produce', count: 182 },
  { id: 'kh-sh-y', rootArabic: 'خ ش ي', rootArabicJoined: 'خشي', rootLatin: 'khashiya', titleIndo: 'Khasyah / Takut Hormat', titleEnglish: 'Fear / Awe', count: 48 },
  { id: 'kh-l-d', rootArabic: 'خ ل د', rootArabicJoined: 'خلد', rootLatin: 'khalada', titleIndo: 'Kekal / Keabadian Surga', titleEnglish: 'Abide / Eternal', count: 87 },
  { id: 'kh-l-s', rootArabic: 'خ ل ص', rootArabicJoined: 'خلص', rootLatin: 'khalasa', titleIndo: 'Ikhlas / Pemurnian Suci', titleEnglish: 'Sincere / Pure', count: 31 },
  { id: 'kh-l-q', rootArabic: 'خ ل ق', rootArabicJoined: 'خلق', rootLatin: 'khalaqa', titleIndo: 'Khaliq / Penciptaan / Akhlak', titleEnglish: 'Create / Creation', count: 261 },
  { id: 'kh-w-f', rootArabic: 'خ و ف', rootArabicJoined: 'خوف', rootLatin: 'khaafa', titleIndo: 'Khauf / Rasa Takut', titleEnglish: 'Fear', count: 124 },
  { id: 'kh-y-r', rootArabic: 'خ ي ر', rootArabicJoined: 'خير', rootLatin: 'khayr', titleIndo: 'Khair / Kebaikan / Utama', titleEnglish: 'Good / Better', count: 176 },

  // Dal (د)
  { id: 'd-b-r', rootArabic: 'د ب ر', rootArabicJoined: 'دبر', rootLatin: 'dabara', titleIndo: 'Tadabbur / Belakang / Memikirkan', titleEnglish: 'Ponder / Behind', count: 44 },
  { id: 'd-kh-l', rootArabic: 'د خ ل', rootArabicJoined: 'دخل', rootLatin: 'dakhala', titleIndo: 'Masuk / Memasukkan', titleEnglish: 'Enter', count: 124 },
  { id: 'd-a-w', rootArabic: 'د ع و', rootArabicJoined: 'دعو', rootLatin: 'daaa', titleIndo: 'Doa / Seruan / Dakwah', titleEnglish: 'Call / Pray', count: 212 },
  { id: 'd-r-s', rootArabic: 'د ر س', rootArabicJoined: 'درس', rootLatin: 'darasa', titleIndo: 'Mempelajari / Mengaji', titleEnglish: 'Study', count: 6 },
  { id: 'd-n-w', rootArabic: 'د ن و', rootArabicJoined: 'دنيا', rootLatin: 'dunya', titleIndo: 'Dunia / Dekat / Fana', titleEnglish: 'World / Near', count: 115 },

  // Dzal (ذ)
  { id: 'dh-k-r', rootArabic: 'ذ ك ر', rootArabicJoined: 'ذكر', rootLatin: 'dhakara', titleIndo: 'Zikir / Ingatan / Peringatan', titleEnglish: 'Remember / Mention', count: 292 },
  { id: 'dh-h-b', rootArabic: 'ذ ه ب', rootArabicJoined: 'ذهب', rootLatin: 'dhahaba', titleIndo: 'Pergi / Hilang / Emas', titleEnglish: 'Go / Gold', count: 67 },
  { id: 'dh-n-b', rootArabic: 'ذ ن ب', rootArabicJoined: 'ذنب', rootLatin: 'dhanb', titleIndo: 'Dosa / Pelanggaran', titleEnglish: 'Sin', count: 39 },

  // Ra (ر)
  { id: 'r-b-b', rootArabic: 'ر ب ب', rootArabicJoined: 'ربب', rootLatin: 'rabb', titleIndo: 'Rabb / Pemelihara / Tuhan', titleEnglish: 'Lord', count: 980 },
  { id: 'r-j-a', rootArabic: 'ر ج ع', rootArabicJoined: 'رجع', rootLatin: 'rajaa', titleIndo: 'Kembali / Pulang Kepada Allah', titleEnglish: 'Return', count: 104 },
  { id: 'r-h-m', rootArabic: 'ر ح م', rootArabicJoined: 'رحم', rootLatin: 'rahima', titleIndo: 'Rahmah / Kasih Sayang / Rahim', titleEnglish: 'Mercy / Compassion', count: 339 },
  { id: 'r-z-q', rootArabic: 'ر ز ق', rootArabicJoined: 'رزق', rootLatin: 'razaqa', titleIndo: 'Rezeki / Karunia / Pembagian', titleEnglish: 'Provision', count: 123 },
  { id: 'r-s-l', rootArabic: 'ر س ل', rootArabicJoined: 'رسل', rootLatin: 'arsala', titleIndo: 'Rasul / Utusan / Risalah', titleEnglish: 'Messenger', count: 513 },
  { id: 'r-d-y', rootArabic: 'ر ض ي', rootArabicJoined: 'رضي', rootLatin: 'radiya', titleIndo: 'Ridha / Kerelaan / Perkenan', titleEnglish: 'Pleased / Content', count: 73 },
  { id: 'r-f-a', rootArabic: 'ر ف ع', rootArabicJoined: 'رفع', rootLatin: 'rafaa', titleIndo: 'Meninggikan / Derajat Tinggi', titleEnglish: 'Raise / Elevate', count: 29 },
  { id: 'r-k-a', rootArabic: 'ر ك ع', rootArabicJoined: 'ركع', rootLatin: 'rakaa', titleIndo: 'Rukuk / Ketundukan Sholat', titleEnglish: 'Bowing', count: 13 },

  // Zai (ز)
  { id: 'z-k-w', rootArabic: 'ز ك و', rootArabicJoined: 'زكاة', rootLatin: 'zakat', titleIndo: 'Zakat / Pertumbuhan / Kesucian', titleEnglish: 'Zakat / Purity', count: 59 },
  { id: 'z-w-j', rootArabic: 'ز و ج', rootArabicJoined: 'زوج', rootLatin: 'zawj', titleIndo: 'Pasangan / Jodoh', titleEnglish: 'Spouse / Pair', count: 81 },
  { id: 'z-y-d', rootArabic: 'ز ي د', rootArabicJoined: 'زيد', rootLatin: 'zaada', titleIndo: 'Bertambah / Menambah', titleEnglish: 'Increase', count: 61 },
  { id: 'z-y-n', rootArabic: 'ز ي ن', rootArabicJoined: 'زين', rootLatin: 'zayyana', titleIndo: 'Perhiasan / Keindahan Hiasan', titleEnglish: 'Adornment / Beauty', count: 46 },

  // Sin (س)
  { id: 's-a-l', rootArabic: 'س ء ل', rootArabicJoined: 'سأل', rootLatin: 'saala', titleIndo: 'Bertanya / Meminta', titleEnglish: 'Ask / Question', count: 129 },
  { id: 's-b-h', rootArabic: 'س ب ح', rootArabicJoined: 'سبح', rootLatin: 'sabbaha', titleIndo: 'Tasbih / Menyucikan Allah', titleEnglish: 'Glory / Glorify', count: 92 },
  { id: 's-b-l', rootArabic: 'س ب ل', rootArabicJoined: 'سبل', rootLatin: 'sabiil', titleIndo: 'Sabil / Jalan Kebaikan', titleEnglish: 'Way / Path', count: 176 },
  { id: 's-j-d', rootArabic: 'س ج د', rootArabicJoined: 'سجد', rootLatin: 'sajada', titleIndo: 'Sujud / Ketundukan / Masjid', titleEnglish: 'Prostrate / Worship', count: 92 },
  { id: 's-l-m', rootArabic: 'س ل م', rootArabicJoined: 'سلم', rootLatin: 'salima', titleIndo: 'Salam / Keselamatan / Islam', titleEnglish: 'Peace / Islam', count: 140 },
  { id: 's-m-a', rootArabic: 'س م ع', rootArabicJoined: 'سمع', rootLatin: 'samia', titleIndo: 'Sama\' / Pendengaran / Mendengar', titleEnglish: 'Hear / Listen', count: 185 },
  { id: 's-m-w', rootArabic: 'س م و', rootArabicJoined: 'سمو', rootLatin: 'samaa', titleIndo: 'Langit / Nama / Ketinggian', titleEnglish: 'Sky / Name', count: 381 },

  // Syin (ش)
  { id: 'sh-r-h', rootArabic: 'ش ر ح', rootArabicJoined: 'شرح', rootLatin: 'sharaha', titleIndo: 'Insyirah / Lapang Dada', titleEnglish: 'Expand / Open', count: 5 },
  { id: 'sh-r-k', rootArabic: 'ش ر ك', rootArabicJoined: 'شرك', rootLatin: 'syirik', titleIndo: 'Syirik / Sekutu / Persekutuan', titleEnglish: 'Polytheism / Partner', count: 168 },
  { id: 'sh-h-d', rootArabic: 'ش ه د', rootArabicJoined: 'شهد', rootLatin: 'syahadat', titleIndo: 'Syahadat / Kesaksian / Hadir', titleEnglish: 'Witness / Testimony', count: 160 },
  { id: 'sh-k-r', rootArabic: 'ش ك ر', rootArabicJoined: 'شكر', rootLatin: 'shakara', titleIndo: 'Syukur / Terima Kasih / Pujian', titleEnglish: 'Thank / Gratitude', count: 75 },

  // Sad (ص)
  { id: 's-b-r', rootArabic: 'ص ب ر', rootArabicJoined: 'صبر', rootLatin: 'sabar', titleIndo: 'Sabar / Ketabahan / Menahan Diri', titleEnglish: 'Patience / Steadfastness', count: 103 },
  { id: 's-d-q', rootArabic: 'ص د ق', rootArabicJoined: 'صدق', rootLatin: 'sadaqa', titleIndo: 'Shiddiq / Kejujuran / Sedekah', titleEnglish: 'Truthful / Charity', count: 155 },
  { id: 's-r-t', rootArabic: 'ص ر ط', rootArabicJoined: 'صراط', rootLatin: 'sirat', titleIndo: 'Sirath / Jalan Lurus', titleEnglish: 'Straight Path', count: 45 },
  { id: 's-l-h', rootArabic: 'ص ل ح', rootArabicJoined: 'صلح', rootLatin: 'saleh', titleIndo: 'Saleh / Kesalehan / Kebaikan', titleEnglish: 'Righteous / Good', count: 180 },
  { id: 's-l-w', rootArabic: 'ص ل و', rootArabicJoined: 'صلوة', rootLatin: 'salat', titleIndo: 'Salat / Sholat / Doa / Keagungan', titleEnglish: 'Prayer / Worship', count: 99 },
  { id: 's-w-m', rootArabic: 'ص و م', rootArabicJoined: 'صوم', rootLatin: 'sauma', titleIndo: 'Puasa / Saum / Menahan', titleEnglish: 'Fast / Fasting', count: 14 },

  // Tha (ط)
  { id: 't-h-r', rootArabic: 'ط ه ر', rootArabicJoined: 'طهر', rootLatin: 'tahara', titleIndo: 'Thaharah / Bersih / Kesucian', titleEnglish: 'Purity / Clean', count: 31 },
  { id: 't-y-b', rootArabic: 'ط ي ب', rootArabicJoined: 'طيب', rootLatin: 'tayyib', titleIndo: 'Thayyib / Kebaikan / Suci Rezeki', titleEnglish: 'Good / Pure', count: 50 },

  // Dhad (ض)
  { id: 'd-l-l', rootArabic: 'ض ل ل', rootArabicJoined: 'ضلل', rootLatin: 'dalala', titleIndo: 'Kesesatan / Menyimpang', titleEnglish: 'Astray / Error', count: 191 },

  // Ain (ع)
  { id: 'a-b-d', rootArabic: 'ع ب د', rootArabicJoined: 'عبد', rootLatin: 'abada', titleIndo: 'Ibadah / Hamba / Pengabdian', titleEnglish: 'Worship / Servant', count: 275 },
  { id: 'a-d-l', rootArabic: 'ع د ل', rootArabicJoined: 'عدل', rootLatin: 'adala', titleIndo: 'Adil / Keseimbangan / Keadilan', titleEnglish: 'Justice / Equal', count: 28 },
  { id: 'a-z-b', rootArabic: 'ع ذ ب', rootArabicJoined: 'عذب', rootLatin: 'adhaba', titleIndo: 'Azab / Siksaan / Hukuman', titleEnglish: 'Punishment / Torment', count: 373 },
  { id: 'a-z-z', rootArabic: 'ع ز ز', rootArabicJoined: 'عزز', rootLatin: 'aziza', titleIndo: 'Al-Aziz / Keperkasaan / Kemuliaan', titleEnglish: 'Mighty / Honor', count: 120 },
  { id: 'a-q-l', rootArabic: 'ع ق ل', rootArabicJoined: 'عقل', rootLatin: 'aqala', titleIndo: 'Akal / Memahami / Berfikir', titleEnglish: 'Reason / Understand', count: 49 },
  { id: 'a-l-m', rootArabic: 'ع ل م', rootArabicJoined: 'علم', rootLatin: 'alima', titleIndo: 'Ilmu / Pengetahuan / Alam', titleEnglish: 'Knowledge / Learn', count: 854 },
  { id: 'a-m-l', rootArabic: 'ع م ل', rootArabicJoined: 'عمل', rootLatin: 'amila', titleIndo: 'Amal / Perbuatan / Pekerjaan', titleEnglish: 'Deed / Action', count: 360 },
  { id: 'a-h-d', rootArabic: 'ع ه د', rootArabicJoined: 'عهد', rootLatin: 'ahada', titleIndo: 'Janji / Ikatan / Perjanjian', titleEnglish: 'Covenant / Promise', count: 46 },

  // Ghain (غ)
  { id: 'gh-f-r', rootArabic: 'غ ف ر', rootArabicJoined: 'غفر', rootLatin: 'ghafara', titleIndo: 'Maghfirah / Ampunan / Perlindungan', titleEnglish: 'Forgive / Cover', count: 234 },
  { id: 'gh-y-b', rootArabic: 'غ ي ب', rootArabicJoined: 'غيب', rootLatin: 'ghayb', titleIndo: 'Gaib / Rahasia Tersembunyi', titleEnglish: 'Unseen / Hidden', count: 60 },

  // Fa (ف)
  { id: 'f-t-h', rootArabic: 'ف ت ح', rootArabicJoined: 'فتح', rootLatin: 'fataha', titleIndo: 'Kemenangan / Pembukaan / Kunci', titleEnglish: 'Victory / Open', count: 38 },
  { id: 'f-t-n', rootArabic: 'ف ت ن', rootArabicJoined: 'فتن', rootLatin: 'fatana', titleIndo: 'Fitnah / Ujian / Cobaan Hati', titleEnglish: 'Trial / Affliction', count: 60 },
  { id: 'f-r-q', rootArabic: 'ف ر ق', rootArabicJoined: 'فرق', rootLatin: 'faraqa', titleIndo: 'Furqan / Pembeda Hak & Batil', titleEnglish: 'Criterion / Separate', count: 72 },
  { id: 'f-a-l', rootArabic: 'ف ع ل', rootArabicJoined: 'فعل', rootLatin: 'faala', titleIndo: 'Fi\'il / Perbuatan / Tindakan', titleEnglish: 'Do / Deed', count: 108 },
  { id: 'f-k-r', rootArabic: 'ف ك ر', rootArabicJoined: 'فكر', rootLatin: 'fakara', titleIndo: 'Fikir / Tafakkur / Merenung', titleEnglish: 'Reflect / Ponder', count: 18 },

  // Qaf (ق)
  { id: 'q-d-r', rootArabic: 'ق د ر', rootArabicJoined: 'قدر', rootLatin: 'qadara', titleIndo: 'Qadar / Takdir / Kuasa', titleEnglish: 'Decree / Power', count: 132 },
  { id: 'q-r-a', rootArabic: 'ق ر ا', rootArabicJoined: 'قرا', rootLatin: 'qaraa', titleIndo: 'Qur\'an / Membaca / Menghimpun', titleEnglish: 'Read / Recite / Quran', count: 88 },
  { id: 'q-l-b', rootArabic: 'ق ل ب', rootArabicJoined: 'قلب', rootLatin: 'qalaba', titleIndo: 'Qalbu / Hati / Jiwa', titleEnglish: 'Heart / Turn', count: 168 },
  { id: 'q-w-l', rootArabic: 'ق و ل', rootArabicJoined: 'قول', rootLatin: 'qawala', titleIndo: 'Qaul / Perkataan / Firman', titleEnglish: 'Say / Speech', count: 1722 },
  { id: 'q-w-m', rootArabic: 'ق و م', rootArabicJoined: 'قوم', rootLatin: 'qaama', titleIndo: 'Kaum / Berdiri / Tegak', titleEnglish: 'Stand / People', count: 660 },

  // Kaf (ك)
  { id: 'k-t-b', rootArabic: 'ك ت ب', rootArabicJoined: 'كتب', rootLatin: 'kataba', titleIndo: 'Tulis / Kitab / Ketetapan', titleEnglish: 'Write / Book', count: 319 },
  { id: 'k-f-r', rootArabic: 'ك ف ر', rootArabicJoined: 'كفر', rootLatin: 'kafara', titleIndo: 'Kufur / Ingkar / Kafir', titleEnglish: 'Disbelieve', count: 525 },

  // Lam (ل)
  { id: 'l-a-n', rootArabic: 'ل ع ن', rootArabicJoined: 'لعن', rootLatin: 'laana', titleIndo: 'Laknat / Kutukan', titleEnglish: 'Curse', count: 41 },

  // Mim (م)
  { id: 'm-l-k', rootArabic: 'م ل ك', rootArabicJoined: 'ملك', rootLatin: 'malaka', titleIndo: 'Malik / Kerajaan / Malaikat', titleEnglish: 'King / Angel', count: 206 },
  { id: 'm-w-t', rootArabic: 'م و ت', rootArabicJoined: 'موت', rootLatin: 'maata', titleIndo: 'Maut / Kematian / Mati', titleEnglish: 'Death / Die', count: 165 },

  // Nun (ن)
  { id: 'n-z-l', rootArabic: 'ن ز ل', rootArabicJoined: 'نزل', rootLatin: 'nazala', titleIndo: 'Turun / Wahyu Tersebar Tanzil', titleEnglish: 'Reveal / Descend', count: 293 },
  { id: 'n-s-r', rootArabic: 'ن ص ر', rootArabicJoined: 'نصر', rootLatin: 'nasara', titleIndo: 'Nasr / Pertolongan / Kemenangan', titleEnglish: 'Help / Victory', count: 158 },
  { id: 'n-w-r', rootArabic: 'ن و ر', rootArabicJoined: 'نور', rootLatin: 'nawara', titleIndo: 'Nur / Cahaya / Penerang', titleEnglish: 'Light / Illumination', count: 194 },

  // Ha (هـ)
  { id: 'h-d-y', rootArabic: 'ه د ي', rootArabicJoined: 'هدي', rootLatin: 'hadaya', titleIndo: 'Hidayah / Petunjuk / Bimbingan', titleEnglish: 'Guide / Guidance', count: 316 },

  // Wau (و)
  { id: 'w-h-y', rootArabic: 'و ح ي', rootArabicJoined: 'وحي', rootLatin: 'wahaa', titleIndo: 'Wahyu / Ilham / Bisikan', titleEnglish: 'Revelation', count: 78 },
  { id: 'w-q-y', rootArabic: 'و ق ي', rootArabicJoined: 'تقوى', rootLatin: 'taqwa', titleIndo: 'Taqwa / Takwa / Perisai Diri', titleEnglish: 'Piety / Protection', count: 258 },
  { id: 'w-k-l', rootArabic: 'و ك ل', rootArabicJoined: 'وكل', rootLatin: 'wakala', titleIndo: 'Tawakal / Pelindung / Berserah', titleEnglish: 'Trust / Guardian', count: 70 },
  { id: 'w-l-y', rootArabic: 'و ل ي', rootArabicJoined: 'ولي', rootLatin: 'wali', titleIndo: 'Wali / Pelindung / Kekasih Allah', titleEnglish: 'Protector / Friend', count: 233 },

  // Ya (ي)
  { id: 'y-q-n', rootArabic: 'ي ق ن', rootArabicJoined: 'يقن', rootLatin: 'yaqina', titleIndo: 'Yakin / Kepastian / Mantap', titleEnglish: 'Certainty', count: 28 }
];

let fileContent = `import { RootWord } from '../types/morphology';\n\nexport const ROOT_DATABASE: RootWord[] = [\n`;

rawRoots.forEach((r, idx) => {
  const isLast = idx === rawRoots.length - 1;
  const tagList = JSON.stringify([r.rootLatin.toLowerCase(), r.id, r.rootArabicJoined, r.rootArabic, ...r.titleIndo.toLowerCase().split(/[\s/]+/)]);
  
  fileContent += `  {\n`;
  fileContent += `    id: "${r.id}",\n`;
  fileContent += `    rootArabic: "${r.rootArabic}",\n`;
  fileContent += `    rootArabicJoined: "${r.rootArabicJoined}",\n`;
  fileContent += `    rootLatin: "${r.rootLatin}",\n`;
  fileContent += `    titleIndo: "${r.titleIndo}",\n`;
  fileContent += `    titleEnglish: "${r.titleEnglish}",\n`;
  fileContent += `    meaningsIndonesian: ["${r.titleIndo}"],\n`;
  fileContent += `    etymologyNote: "Penyusunan etimologi dan morfologi Al-Qur'an untuk akar ${r.rootArabic} (${r.rootLatin}).",\n`;
  fileContent += `    totalOccurrences: ${r.count},\n`;
  fileContent += `    verbsCount: ${Math.floor(r.count * 0.4)},\n`;
  fileContent += `    nounsCount: ${Math.ceil(r.count * 0.6)},\n`;
  fileContent += `    tags: ${tagList},\n`;
  fileContent += `    verbs: [{ id: "${r.id}-v1", arabic: "${r.rootArabicJoined}", transliteration: "${r.rootLatin}", type: "verb", form: "Form I", posTag: "Fi'il", meaningIndo: "${r.titleIndo}", frequency: ${r.count} }],\n`;
  fileContent += `    nouns: [{ id: "${r.id}-n1", arabic: "${r.rootArabicJoined}", transliteration: "${r.rootLatin}", type: "noun", posTag: "Isim", meaningIndo: "${r.titleIndo}", frequency: ${r.count} }],\n`;
  fileContent += `    occurrences: [{ surahNumber: 1, ayahNumber: 1, surahNameIndo: "Al-Qur'an", surahNameArabic: "القرآن", verseArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verseIndo: "Sampel ayat untuk akar ${r.rootLatin}", matchedWordArabic: "${r.rootArabicJoined}", matchedWordIndo: "${r.rootLatin}", wordLocation: "1:1:1" }]\n`;
  fileContent += `  }${isLast ? '' : ','}\n`;
});

fileContent += `];\n`;

fs.writeFileSync('/home/aizatfir/Project/Qurabic-Indo/lib/data/roots.ts', fileContent, 'utf8');
console.log(`Successfully wrote ${rawRoots.length} clean Quranic roots to lib/data/roots.ts!`);
