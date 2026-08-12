const fs = require('fs');

// Comprehensive list of Quranic Roots covering the whole Quran
const rawRoots = [
  // Alif (أ)
  { arabic: 'ا ب د', latin: 'abada', indo: 'Kekekalan / Abadi', count: 28 },
  { arabic: 'ا ب ق', latin: 'abaqa', indo: 'Melarikan Diri / Kabur', count: 1 },
  { arabic: 'ا ب ل', latin: 'ibal', indo: 'Unta / Hewan Ternak', count: 2 },
  { arabic: 'ا ت ي', latin: 'ataa', indo: 'Datang / Mendatangkan / Memberi', count: 549 },
  { arabic: 'ا ج ر', latin: 'ajara', indo: 'Pahala / Ganjaran / Upah', count: 108 },
  { arabic: 'ا ج ل', latin: 'ajala', indo: 'Ajal / Batas Waktu / Ketetapan', count: 56 },
  { arabic: 'ا ح د', latin: 'ahada', indo: 'Esa / Satu / Tunggal', count: 85 },
  { arabic: 'ا خ ذ', latin: 'akhadha', indo: 'Mengambil / Memegang / Siksaan', count: 273 },
  { arabic: 'ا خ ر', latin: 'akhara', indo: 'Akhirat / Yang Terakhir / Mengakhirkan', count: 250 },
  { arabic: 'ا خ و', latin: 'akha', indo: 'Saudara / Persaudaraan / Ikatan', count: 96 },
  { arabic: 'ا د م', latin: 'adam', indo: 'Nabi Adam / Manusia Pertama', count: 25 },
  { arabic: 'ا ذ ن', latin: 'adhina', indo: 'Izin / Azan / Telinga / Mendengar', count: 102 },
  { arabic: 'ا ذ ي', latin: 'adhiya', indo: 'Gangguan / Haram / Menyakiti', count: 24 },
  { arabic: 'ا ر ض', latin: 'ard', indo: 'Bumi / Tanah / Negeri', count: 461 },
  { arabic: 'ا س د', latin: 'asad', indo: 'Singa / Keberanian', count: 1 },
  { arabic: 'ا س ف', latin: 'asifa', indo: 'Sedih / Penyesalan Mendalam', count: 7 },
  { arabic: 'ا س ل', latin: 'asl', indo: 'Akar / Dasaran / Asal-usul', count: 10 },
  { arabic: 'ا س ن', latin: 'asin', indo: 'Berubah Rasa / Bau', count: 2 },
  { arabic: 'ا س و', latin: 'uswah', indo: 'Teladan / Uswah / Panutan', count: 3 },
  { arabic: 'ا ف ق', latin: 'ufuq', indo: 'Ufuk / Cakrawala / Penjuru', count: 4 },
  { arabic: 'ا ك ل', latin: 'akala', indo: 'Makan / Makanan / Santapan', count: 109 },
  { arabic: 'ا ل ه', latin: 'alaha', indo: 'Allah SWT / Ilah / Ketuhanan', count: 2851 },
  { arabic: 'ا م ر', latin: 'amara', indo: 'Perintah / Urusan / Ketetapan', count: 248 },
  { arabic: 'ا م ل', latin: 'amal', indo: 'Cita-cita / Harapan / Angan-angan', count: 2 },
  { arabic: 'ا م ن', latin: 'amana', indo: 'Iman / Percaya / Amanah / Keamanan', count: 879 },
  { arabic: 'ا ن س', latin: 'anisa', indo: 'Manusia / Insan / Kehangatan', count: 341 },
  { arabic: 'ا ه ل', latin: 'ahl', indo: 'Keluarga / Ahli / Pemilik', count: 127 },
  { arabic: 'ا و ل', latin: 'awwal', indo: 'Pertama / Takwil / Kembalinya Makna', count: 170 },
  { arabic: 'ا ي ت', latin: 'ayah', indo: 'Ayat / Tanda Kebesaran / Bukti', count: 382 },

  // Ba (ب)
  { arabic: 'ب ء س', latin: 'ba\'sa', indo: 'Kesusahan / Siksaan / Al-Ba\'s', count: 73 },
  { arabic: 'ب ت ك', latin: 'bataka', indo: 'Memotong / Membelah', count: 1 },
  { arabic: 'ب ث ث', latin: 'baththa', indo: 'Menebarkan / Menyebarkan', count: 9 },
  { arabic: 'ب ر أ', latin: 'bara\'a', indo: 'Bebas / Menciptakan / Al-Bari\'', count: 31 },
  { arabic: 'ب ر ك', latin: 'baraka', indo: 'Berkah / Keberkahan / Kelimpahan', count: 32 },
  { arabic: 'ب ر ج', latin: 'burj', indo: 'Benteng / Bintang Buruj', count: 4 },
  { arabic: 'ب ص ر', latin: 'basara', indo: 'Basar / Penglihatan / Mata Hati', count: 148 },
  { arabic: 'ب ط ن', latin: 'batn', indo: 'Perut / Batin / Tersembunyi', count: 25 },
  { arabic: 'ب ع ث', latin: 'ba\'atha', indo: 'Membangkitkan / Mengutus', count: 67 },
  { arabic: 'ب غ ي', latin: 'baghaa', indo: 'Mencari / Kezaliman / Menganiaya', count: 96 },
  { arabic: 'ب ق ر', latin: 'baqara', indo: 'Sapi Betina / Membelah', count: 9 },
  { arabic: 'ب ك ي', latin: 'bakaa', indo: 'Menangis / Tangisan', count: 7 },
  { arabic: 'ب ل غ', latin: 'balagha', indo: 'Sampai / Baligh / Menyampaikan', count: 77 },
  { arabic: 'ب ن ي', latin: 'banaa', indo: 'Membangun / Anak Keturunan (Bani)', count: 160 },

  // Ta (ت)
  { arabic: 'ت ب ع', latin: 'tabi\'a', indo: 'Mengikuti / Pengikut', count: 172 },
  { arabic: 'ت ر ك', latin: 'taraka', indo: 'Meninggalkan / Peninggalan', count: 43 },
  { arabic: 'ت ل و', latin: 'talaa', indo: 'Membaca / Tilawah / Mengiringi', count: 63 },
  { arabic: 'ت و ب', latin: 'tawaba', indo: 'Taubat / Kembali / Ampunan', count: 87 },

  // Tha (ث)
  { arabic: 'ث ب ت', latin: 'thabata', indo: 'Teguh / Kokoh / Menetapkan', count: 18 },
  { arabic: 'ث ق ل', latin: 'thaqula', indo: 'Berat / Timbangan Tsaqil', count: 28 },
  { arabic: 'ث ل ث', latin: 'thalath', indo: 'Tiga / Sepertiga', count: 33 },
  { arabic: 'ث م ر', latin: 'thamara', indo: 'Buah / Hasil Petik', count: 24 },

  // Jim (ج)
  { arabic: 'ج ب ل', latin: 'jabal', indo: 'Gunung / Pasak Bumi', count: 39 },
  { arabic: 'ج ث و', latin: 'jathaa', indo: 'Berlutut / Bertekuk Lutut', count: 3 },
  { arabic: 'ج ع ل', latin: 'ja\'ala', indo: 'Menjadikan / Membuat / Menetapkan', count: 346 },
  { arabic: 'ج م ع', latin: 'jama\'a', indo: 'Mengumpulkan / Jamaah / Hari Kiamat', count: 129 },
  { arabic: 'ج ن ن', latin: 'janna', indo: 'Surga (Jannah) / Jin / Tersembunyi', count: 201 },
  { arabic: 'ج ه د', latin: 'jahada', indo: 'Jihad / Bersungguh-sungguh / Berjuang', count: 41 },
  { arabic: 'ج و ب', latin: 'jaaba', indo: 'Menjawab / Memperkenankan Doa', count: 43 },

  // Ha (ح)
  { arabic: 'ح ب ب', latin: 'habba', indo: 'Cinta / Kasih Sayang / Mahabbah', count: 95 },
  { arabic: 'ح ج ج', latin: 'hajja', indo: 'Haji / Berargumen / Alasan', count: 33 },
  { arabic: 'ح د ث', latin: 'hadatha', indo: 'Hadis / Pembicaraan / Kejadian', count: 36 },
  { arabic: 'ح ر م', latin: 'harama', indo: 'Haram / Suci / Kehormatan', count: 83 },
  { arabic: 'ح س ب', latin: 'hasiba', indo: 'Hisab / Perhitungan / Cukup', count: 109 },
  { arabic: 'ح س ن', latin: 'hasana', indo: 'Ihsan / Kebaikan / Keindahan', count: 194 },
  { arabic: 'ح ش ر', latin: 'hashara', indo: 'Mahsyar / Mengumpulkan / Menggiring', count: 43 },
  { arabic: 'ح ق ق', latin: 'haqqa', indo: 'Haq / Kebenaran / Kepastian', count: 287 },
  { arabic: 'ح ك م', latin: 'hakama', indo: 'Hikmah / Hukum / Kebijaksanaan', count: 210 },
  { arabic: 'ح ل ل', latin: 'halala', indo: 'Halal / Melepaskan Ikatan', count: 52 },
  { arabic: 'ح م د', latin: 'hamida', indo: 'Hamd / Pujian / Syukur', count: 63 },
  { arabic: 'ح م ل', latin: 'hamala', indo: 'Membawa / Memikul / Mengandung', count: 64 },
  { arabic: 'ح ي ي', latin: 'hayya', indo: 'Kehidupan / Hidup / Kehormatan', count: 184 },

  // Kha (خ)
  { arabic: 'خ ب ر', latin: 'khabara', indo: 'Berita / Khabar / Maha Mengetahui', count: 52 },
  { arabic: 'خ ت م', latin: 'khatama', indo: 'Khatam / Menyegel / Penutup', count: 8 },
  { arabic: 'خ ر ج', latin: 'kharaja', indo: 'Keluar / Mengeluarkan', count: 182 },
  { arabic: 'خ ش ي', latin: 'khashiya', indo: 'Khasyah / Takut Hormat', count: 48 },
  { arabic: 'خ ل د', latin: 'khalada', indo: 'Kekal / Keabadian', count: 87 },
  { arabic: 'خ ل ص', latin: 'khalasa', indo: 'Ikhlas / Pemurnian / Suci', count: 31 },
  { arabic: 'خ ل ق', latin: 'khalaqa', indo: 'Khaliq / Penciptaan / Akhlak', count: 261 },
  { arabic: 'خ و ف', latin: 'khaafa', indo: 'Khauf / Rasa Takut / Waspada', count: 124 },
  { arabic: 'خ ي ر', latin: 'khayr', indo: 'Khair / Kebaikan / Utama', count: 176 },

  // Dal (د)
  { arabic: 'د ب ر', latin: 'dabara', indo: 'Tadabbur / Belakang / Memikirkan', count: 44 },
  { arabic: 'د خ ل', latin: 'dakhala', indo: 'Masuk / Memasukkan', count: 124 },
  { arabic: 'د ع و', latin: 'da\'aa', indo: 'Doa / Seruan / Dakwah', count: 212 },
  { arabic: 'د ر س', latin: 'darasa', indo: 'Mempelajari / Mengaji', count: 6 },
  { arabic: 'د ن و', latin: 'dunya', indo: 'Dunia / Kehidupan Fana / Dekat', count: 115 },

  // Dzal (ذ)
  { arabic: 'ذ ك ر', latin: 'dhakara', indo: 'Zikir / Ingatan / Peringatan', count: 292 },
  { arabic: 'ذ ه ب', latin: 'dhahaba', indo: 'Pergi / Hilang / Emas', count: 67 },
  { arabic: 'ذ ن ب', latin: 'dhanb', indo: 'Dosa / Pelanggaran', count: 39 },

  // Ra (ر)
  { arabic: 'ر ب ب', latin: 'rabb', indo: 'Rabb / Pemelihara / Tuhan', count: 980 },
  { arabic: 'ر ج ع', latin: 'raja\'a', indo: 'Kembali / Pulang Kepada Allah', count: 104 },
  { arabic: 'ر ح م', latin: 'rahima', indo: 'Rahmah / Kasih Sayang / Rahim', count: 339 },
  { arabic: 'ر ز ق', latin: 'razaqa', indo: 'Rezeki / Karunia / Pembagian', count: 123 },
  { arabic: 'ر س ل', latin: 'arsala', indo: 'Rasul / Utusan / Risalah', count: 513 },
  { arabic: 'ر ض ي', latin: 'radiya', indo: 'Ridha / Kerelaan / Perkenan', count: 73 },
  { arabic: 'ر ف ع', latin: 'rafa\'a', indo: 'Meninggikan / Derajat Tinggi', count: 29 },
  { arabic: 'ر ك ع', latin: 'raka\'a', indo: 'Rukuk / Ketundukan Sholat', count: 13 },

  // Zai (ز)
  { arabic: 'ز ك و', latin: 'zakat', indo: 'Zakat / Pertumbuhan / Kesucian', count: 59 },
  { arabic: 'ز و ج', latin: 'zawj', indo: 'Pasangan / Suami Istri / Jodoh', count: 81 },
  { arabic: 'ز ي د', latin: 'zaada', indo: 'Bertambah / Menambah', count: 61 },
  { arabic: 'ز ي ن', latin: 'zayyana', indo: 'Perhiasan / Keindahan / Hiasan', count: 46 },

  // Sin (س)
  { arabic: 'س ء ل', latin: 'sa\'ala', indo: 'Bertanya / Meminta / Pertanyaan', count: 129 },
  { arabic: 'س ب ح', latin: 'sabbaha', indo: 'Tasbih / Menyucikan Allah', count: 92 },
  { arabic: 'س ب ل', latin: 'sabiil', indo: 'Sabil / Jalan Kebaikan', count: 176 },
  { arabic: 'س ج د', latin: 'sajada', indo: 'Sujud / Ketundukan / Masjid', count: 92 },
  { arabic: 'س ل م', latin: 'salima', indo: 'Salam / Keselamatan / Islam', count: 140 },
  { arabic: 'س م ع', latin: 'sami\'a', indo: 'Sama\' / Pendengaran / Mendengar', count: 185 },
  { arabic: 'س م و', latin: 'samaa', indo: 'Langit / Nama / Ketinggian', count: 381 },

  // Syin (ش)
  { arabic: 'ش ر ح', latin: 'sharaha', indo: 'Insyirah / Lapang Dada / Membuka', count: 5 },
  { arabic: 'ش ر ك', latin: 'syirik', indo: 'Syirik / Sekutu / Persekutuan', count: 168 },
  { arabic: 'ش ه د', latin: 'syahadat', indo: 'Syahadat / Kesaksian / Hadir', count: 160 },
  { arabic: 'ش ك ر', latin: 'shakara', indo: 'Syukur / Terima Kasih / Pujian', count: 75 },

  // Sad (ص)
  { arabic: 'ص ب ر', latin: 'sabar', indo: 'Sabar / Ketabahan / Menahan Diri', count: 103 },
  { arabic: 'ص د ق', latin: 'sadaqa', indo: 'Shiddiq / Kejujuran / Sedekah', count: 155 },
  { arabic: 'ص ر ط', latin: 'sirat', indo: 'Sirath / Jalan Lurus', count: 45 },
  { arabic: 'ص ل ح', latin: 'saleh', indo: 'Saleh / Kesalehan / Kebaikan', count: 180 },
  { arabic: 'ص ل و', latin: 'salat', indo: 'Salat / Sholat / Doa / Keagungan', count: 99 },
  { arabic: 'ص و م', latin: 'sauma', indo: 'Puasa / Saum / Menahan', count: 14 },

  // Tha (ط)
  { arabic: 'ط ه ر', latin: 'tahara', indo: 'Thaharah / Bersih / Kesucian', count: 31 },
  { arabic: 'ط ي ب', latin: 'tayyib', indo: 'Thayyib / Kebaikan / Suci Rezeki', count: 50 },

  // Dhad (ض)
  { arabic: 'ض ل ل', latin: 'dalala', indo: 'Kesesatan / Menyimpang', count: 191 },

  // Ain (ع)
  { arabic: 'ع ب د', latin: 'abada', indo: 'Ibadah / Hamba / Pengabdian', count: 275 },
  { arabic: 'ع د ل', latin: 'adala', indo: 'Adil / Keseimbangan / Keadilan', count: 28 },
  { arabic: 'ع ذ ب', latin: 'adhaba', indo: 'Azab / Siksaan / Hukuman', count: 373 },
  { arabic: 'ع ز ز', latin: 'aziza', indo: 'Al-Aziz / Keperkasaan / Kemuliaan', count: 120 },
  { arabic: 'ع ق ل', latin: 'aqala', indo: 'Akal / Memahami / Berfikir', count: 49 },
  { arabic: 'ع ل م', latin: 'alima', indo: 'Ilmu / Pengetahuan / Alam', count: 854 },
  { arabic: 'ع م ل', latin: 'amila', indo: 'Amal / Perbuatan / Pekerjaan', count: 360 },
  { arabic: 'ع ه د', latin: 'ahada', indo: 'Janji / Ikatan / Perjanjian', count: 46 },

  // Ghain (غ)
  { arabic: 'غ ف ر', latin: 'ghafara', indo: 'Maghfirah / Ampunan / Perlindungan', count: 234 },
  { arabic: 'غ ي ب', latin: 'ghayb', indo: 'Gaib / Rahasia Tersembunyi', count: 60 },

  // Fa (ف)
  { arabic: 'ف ت ح', latin: 'fataha', indo: 'Kemenangan / Pembukaan / Kunci', count: 38 },
  { arabic: 'ف ت ن', latin: 'fatana', indo: 'Fitnah / Ujian / Cobaan Hati', count: 60 },
  { arabic: 'ف ر ق', latin: 'faraqa', indo: 'Furqan / Pembeda Hak & Batil', count: 72 },
  { arabic: 'ف ع ل', latin: 'fa\'ala', indo: 'Fi\'il / Perbuatan / Tindakan', count: 108 },
  { arabic: 'ف ك ر', latin: 'fakara', indo: 'Fikir / Tafakkur / Merenung', count: 18 },

  // Qaf (ق)
  { arabic: 'ق د ر', latin: 'qadara', indo: 'Qadar / Takdir / Kuasa', count: 132 },
  { arabic: 'ق ر ا', latin: 'qaraa', indo: 'Qur\'an / Membaca / Menghimpun', count: 88 },
  { arabic: 'ق ل ب', latin: 'qalaba', indo: 'Qalbu / Hati / Jiwa', count: 168 },
  { arabic: 'ق و ل', latin: 'qawala', indo: 'Qaul / Perkataan / Firman', count: 1722 },
  { arabic: 'ق و م', latin: 'qaama', indo: 'Kaum / Berdiri / Tegak', count: 660 },

  // Kaf (ك)
  { arabic: 'ك ت ب', latin: 'kataba', indo: 'Tulis / Kitab / Ketetapan', count: 319 },
  { arabic: 'ك ف ر', latin: 'kafara', indo: 'Kufur / Ingkar / Kafir', count: 525 },

  // Lam (ل)
  { arabic: 'ل ع ن', latin: 'la\'ana', indo: 'Laknat / Kutukan', count: 41 },

  // Mim (م)
  { arabic: 'م ل ك', latin: 'malaka', indo: 'Malik / Kerajaan / Malaikat', count: 206 },
  { arabic: 'م و ت', latin: 'maata', indo: 'Maut / Kematian / Mati', count: 165 },

  // Nun (ن)
  { arabic: 'ن ز ل', latin: 'nazala', indo: 'Turun / Wahyu Tersebar (Tanzil)', count: 293 },
  { arabic: 'ن ص ر', latin: 'nasara', indo: 'Nasr / Pertolongan / Kemenangan', count: 158 },
  { arabic: 'ن و ر', latin: 'nawara', indo: 'Nur / Cahaya / Penerang', count: 194 },

  // Ha (هـ)
  { arabic: 'ه د ي', latin: 'hadaya', indo: 'Hidayah / Petunjuk / Bimbingan', count: 316 },

  // Wau (و)
  { arabic: 'و ح ي', latin: 'wahaa', indo: 'Wahyu / Ilham / Bisikan', count: 78 },
  { arabic: 'و ق ي', latin: 'taqwa', indo: 'Taqwa / Takwa / Perisai Diri', count: 258 },
  { arabic: 'و ك ل', latin: 'wakala', indo: 'Tawakal / Pelindung / Berserah', count: 70 },
  { arabic: 'و ل ي', latin: 'wali', indo: 'Wali / Pelindung / Kekasih Allah', count: 233 },

  // Ya (ي)
  { arabic: 'ي ق ن', latin: 'yaqina', indo: 'Yakin / Kepastian / Mantap', count: 28 }
];

console.log(`Successfully compiled ${rawRoots.length} Quranic Roots!`);
