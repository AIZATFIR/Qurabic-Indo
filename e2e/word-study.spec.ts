import { test, expect } from '@playwright/test';

test.describe('Word Study (Qurabic Indo) Polish & Visual Regression', () => {
  test('hovering a Quran word warms its entry before opening the study card', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/word-detail?')) requests.push(request.url());
    });
    await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
    await page.getByRole('button', { name: 'Pengaturan Tampilan' }).click();
    await expect(page.getByText('Pengaturan Bacaan', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Tutup pengaturan' }).click();
    const firstWord = page.locator('[role="button"][aria-label^="Bedah kata:"]').first();
    await firstWord.waitFor({ state: 'visible', timeout: 30000 });
    const warmedResponsePromise = page.waitForResponse(response => response.url().includes('/api/word-detail?') && !response.url().includes('excerpt='), { timeout: 8000 });
    await firstWord.hover();
    const warmedResponse = await warmedResponsePromise;
    expect(warmedResponse.ok()).toBe(true);
    expect(new URL(warmedResponse.url()).searchParams.get('location')).toMatch(/^18:\d+:\d+$/);

    await firstWord.click();
    await expect(page.getByRole('dialog').getByText(/Makna Kata|Word meaning/, { exact: true })).toBeVisible();
    expect(requests).toHaveLength(1);
  });

  test('touching a Quran word starts loading its entry before opening the study card', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/word-detail?') && !request.url().includes('excerpt=')) requests.push(request.url());
    });
    await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
    const firstWord = page.locator('[role="button"][aria-label^="Bedah kata:"]').first();
    await firstWord.waitFor({ state: 'visible' });
    await page.waitForFunction(() => {
      const button = document.querySelector('[role="button"][aria-label^="Bedah kata:"]');
      return button && Object.keys(button).some((key) => key.startsWith('__reactProps$'));
    });
    await firstWord.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 1, isPrimary: true, button: 0, buttons: 1 });
    await expect.poll(() => requests.length, { timeout: 2000 }).toBe(1);
    expect(new URL(requests[0]).searchParams.get('location')).toMatch(/^18:\d+:\d+$/);

    await firstWord.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/Makna Kata|Word meaning/, { exact: true })).toBeVisible({ timeout: 10000 });
    expect(requests).toHaveLength(1);
  });

  test('pressing a Quran word with a mouse starts its entry request before the click', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/word-detail?') && !request.url().includes('excerpt=')) requests.push(request.url());
    });
    await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
    const firstWord = page.locator('[role="button"][aria-label^="Bedah kata:"]').first();
    await firstWord.waitFor({ state: 'visible' });
    await page.waitForFunction(() => {
      const button = document.querySelector('[role="button"][aria-label^="Bedah kata:"]');
      return button && Object.keys(button).some((key) => key.startsWith('__reactProps$'));
    });

    await firstWord.dispatchEvent('pointerdown', { pointerType: 'mouse', pointerId: 1, isPrimary: true, button: 0, buttons: 1 });
    await expect.poll(() => requests.length, { timeout: 2000 }).toBe(1);
    expect(new URL(requests[0]).searchParams.get('location')).toMatch(/^18:\d+:\d+$/);

    await firstWord.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/Makna Kata|Word meaning/, { exact: true })).toBeVisible({ timeout: 10000 });
    expect(requests).toHaveLength(1);
  });

  test('English word study does not leave its analysis heading in Indonesian', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /Explore word: ٱلْحَمْدُ/ }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Morphology & word meaning', { exact: true })).toBeVisible();
    await expect(dialog.getByText('Kajian Morfologi & Semantik Kata', { exact: true })).toHaveCount(0);
  });

  test('Arramooz forms load only when the supplemental section is opened', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/arramooz?')) requests.push(request.url());
    });
    await page.goto('/kata/%D8%B5%D9%8E%D8%A8%D9%8E%D8%B1%D9%8E', { waitUntil: 'networkidle' });
    const supplementalSection = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Bentuk Arab lain dari akar ini' }) });
    await expect(supplementalSection).toBeVisible();
    expect(requests).toHaveLength(0);
    await page.getByRole('button', { name: 'Lihat bentuk tambahan' }).click();
    await expect.poll(() => requests.length, { timeout: 5000 }).toBe(1);
    await expect(supplementalSection.locator('ul')).toContainText('صَبَرَ');
  });

  test('root page shows its sourced gloss and links a Quranic lemma directly to Qabas', async ({ page }) => {
    const supplementalRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/root-detail?')) supplementalRequests.push(request.url());
    });
    const response = await page.goto('/akar/r-A-y', { waitUntil: 'domcontentloaded' });
    const renderedHtml = await response?.text() || '';
    await page.waitForLoadState('networkidle');

    const meaningSection = page.locator('section[aria-labelledby="root-meaning-heading"]');
    expect(renderedHtml).not.toContain('Memuat data akar dan kamus');
    expect(supplementalRequests).toHaveLength(0);
    await expect(meaningSection).toContainText('Ringkasan Inggris · Quran bil-Quran · mengacu Lane; halaman dan metode penyuntingan tidak dicantumkan');
    await expect(meaningSection).toContainText('The root رَأَى primarily means');
    await expect(meaningSection.getByRole('link', { name: 'Lihat lema terkait di Qabas · Birzeit' })).toHaveAttribute('href', 'https://sina.birzeit.edu/qabas/lemma/202001196');
  });

  test('root page loads sourced Arabic forms outside the Quran only when requested', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/arramooz?')) requests.push(request.url());
    });
    await page.goto('/akar/S-b-r', { waitUntil: 'domcontentloaded' });
    const section = page.locator('section[aria-labelledby="other-root-forms-heading"]');
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading')).toHaveText('Bentuk lain yang tercatat');
    expect(requests).toHaveLength(0);

    await page.waitForFunction(() => {
      const button = document.querySelector('section[aria-labelledby="other-root-forms-heading"] button');
      return button && Object.keys(button).some((key) => key.startsWith('__reactProps$'));
    });
    await section.getByRole('button', { name: 'Tampilkan bentuk tambahan' }).click();
    await expect(section.getByRole('button', { name: 'Sembunyikan bentuk' })).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => requests.length, { timeout: 5000 }).toBe(1);
    await expect(section.locator('ul')).toContainText('صَبَرَ');
    await expect(section).toContainText('Arramooz');
    await expect(section).toContainText('GPL-2');

    await page.evaluate(() => localStorage.setItem('qurabic_language', 'en'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    const englishSection = page.locator('section[aria-labelledby="other-root-forms-heading"]');
    await expect(englishSection.getByRole('heading')).toHaveText('Other recorded forms');
    await page.waitForFunction(() => {
      const button = document.querySelector('section[aria-labelledby="other-root-forms-heading"] button');
      return button && Object.keys(button).some((key) => key.startsWith('__reactProps$'));
    });
    await englishSection.getByRole('button', { name: 'Show additional forms' }).click();
    await expect(englishSection.locator('ul')).toContainText('صَبَرَ');
    await expect(englishSection.getByText('Tampilkan bentuk tambahan')).toHaveCount(0);
  });

  test('roots without a Lane root record show QAC glosses with explicit source links', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'id'));
    await page.goto('/akar/n-d-w', { waitUntil: 'domcontentloaded' });
    let meaningSection = page.locator('section[aria-labelledby="root-meaning-heading"]');
    await expect(meaningSection).toContainText('Memanggil atau menyeru');
    await expect(meaningSection.getByRole('link', { name: /Quranic Arabic Corpus/ })).toHaveAttribute('href', 'https://corpus.quran.com/qurandictionary.jsp?q=ndw');
    await expect(meaningSection.getByRole('link', { name: 'Lane · Part 8, hlm. 3030' })).toHaveAttribute('href', 'https://lexicon.quranic-research.net/pdf/Page_3030.pdf');
    await expect(meaningSection).toContainText('ندى (ndy)');

    await page.goto('/akar/l-A-l-A', { waitUntil: 'domcontentloaded' });
    meaningSection = page.locator('section[aria-labelledby="root-meaning-heading"]');
    await expect(meaningSection).toContainText('mutiara');
    await expect(meaningSection.getByRole('link', { name: /Quranic Arabic Corpus/ })).toHaveAttribute('href', 'https://corpus.quran.com/qurandictionary.jsp?q=lAlA');
    await expect(meaningSection.getByRole('link', { name: /Lihat lema لُؤْلُؤَةٌ/ })).toHaveAttribute('href', 'https://www.laneslexicon.com/word/لؤلؤة');
  });

  test('root page leads with its readable source gloss and preserves the cited Lane entry', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'id'));
    await page.goto('/akar/d-y-n', { waitUntil: 'domcontentloaded' });

    const meaningSection = page.locator('section[aria-labelledby="root-meaning-heading"]');
    await expect(meaningSection).toContainText('Ringkasan Inggris · Quran bil-Quran · mengacu Lane; halaman dan metode penyuntingan tidak dicantumkan');
    await expect(meaningSection.locator('p[lang="en"]').first()).toContainText('The root "dyn" primarily means to be obedient');
    await expect(meaningSection.getByText('Kutipan asli Lane · bahasa Inggris', { exact: true })).toBeVisible();
    await expect(meaningSection.locator('details').filter({ hasText: 'Kutipan asli Lane · bahasa Inggris' })).toContainText('Part 3, p. 943');
  });

  test('root page leads with the readable sourced gloss and keeps noisy Lane text available on demand', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.goto('/akar/S-b-r', { waitUntil: 'domcontentloaded' });

    const meaningSection = page.locator('section[aria-labelledby="root-meaning-heading"]');
    await expect(meaningSection).toContainText('English summary · Quran bil-Quran · attributes Lane; page and editorial method not stated');
    await expect(meaningSection.locator('p[lang="en"]').first()).toContainText('The root "Sbr" primarily means to confine or restrain');
    await expect(meaningSection.getByText(/Original Lane entry/)).toBeVisible();
  });

  test('sourced root gloss stays readable in both language modes with Lane available on demand', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'id'));
    await page.goto('/akar/m-l-k', { waitUntil: 'domcontentloaded' });
    const indonesianMeaning = page.locator('section[aria-labelledby="root-meaning-heading"]');
    await expect(indonesianMeaning).toContainText('Ringkasan Inggris · Quran bil-Quran · mengacu Lane; halaman dan metode penyuntingan tidak dicantumkan');
    await expect(indonesianMeaning.locator('p[lang="en"]').first()).toContainText('The root ملك (mlk) primarily means to possess or own');

    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    const englishMeaning = page.locator('section[aria-labelledby="root-meaning-heading"]');
    await expect(englishMeaning).toContainText('English summary · Quran bil-Quran · attributes Lane; page and editorial method not stated');
    await expect(englishMeaning.locator('p[lang="en"]').first()).toContainText('The root ملك (mlk) primarily means to possess or own');
    await expect(englishMeaning.getByText('Original Lane entry · English', { exact: true })).toBeVisible();
  });

  test('English root entry labels the indexed Lane text accurately', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.goto('/akar/r-H-m', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('English summary · Quran bil-Quran · attributes Lane; page and editorial method not stated')).toBeVisible();
    await expect(page.getByText('Original English source excerpt · Lane, 1863')).toHaveCount(0);
    const laneExcerpt = page.locator('section[aria-labelledby="root-meaning-heading"] details').filter({ hasText: 'Original Lane entry · English' });
    await expect(laneExcerpt.getByText('Original Lane entry · English')).toBeVisible();
    await laneExcerpt.locator('summary').click();
    await expect(laneExcerpt).toContainText('Edward William Lane, An Arabic-English Lexicon');
  });

  test('rare roots show concise Quranic Arabic Corpus glosses with source links', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    const entries = [
      {
        root: 'n-w-s',
        gloss: 'nās (النَّاس) means “the people” or “mankind”',
        source: 'https://corpus.quran.com/qurandictionary.jsp?q=nws',
        related: 'https://lexicon.quranic-research.net/pdf/Page_2867.pdf',
      },
      {
        root: 'T-m-n',
        gloss: 'glosses forms of ط م ن as being secure, satisfied, or content',
        source: 'https://corpus.quran.com/qurandictionary.jsp?q=Tmn',
        related: 'https://lexicon.quranic-research.net/pdf/Page_1882.pdf',
      },
      {
        root: 'm-E-n',
        gloss: 'al-māʿūn (الْمَاعُون) is glossed as “small kindnesses”',
        source: 'https://corpus.quran.com/qurandictionary.jsp?q=mEn',
        related: 'https://lexicon.quranic-research.net/data/18_E/248_Ewn.html',
      },
    ];

    for (const entry of entries) {
      await page.goto(`/akar/${entry.root}`, { waitUntil: 'domcontentloaded' });
      const meaning = page.locator('section[aria-labelledby="root-meaning-heading"]');
      await expect(meaning.locator('p[lang="en"]').first()).toContainText(entry.gloss);
      await expect(meaning.getByRole('link', { name: /Open source · Quranic Arabic Corpus/ })).toHaveAttribute('href', entry.source);
      await expect(meaning.getByRole('link', { name: /Lane/ }).last()).toHaveAttribute('href', entry.related);
    }
  });

  test('root explanation uses a cited Lane source instead of generic placeholder copy', async ({ page }) => {
    await page.goto('/kata/%D8%A7%D9%84%D8%B1%D9%91%D9%8E%D8%AD%D9%90%D9%8A%D9%85%D9%90?location=1%3A1%3A4', { waitUntil: 'networkidle' });

    await expect(page.getByText('Each form is translated in its sample verse. Words sharing a root can have different meanings.')).toHaveCount(0);
    await page.getByRole('button', { name: 'Baca definisi asli Lane · English' }).click();
    const laneSection = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Definisi klasik · Lane’s Lexicon (English)' }) });
    const secondSense = laneSection.locator('details').filter({ hasText: 'Sense #2' });
    await secondSense.locator('summary').click();
    await expect(secondSense).toContainText('Sometimes it is syn. with');
    await expect(page.getByRole('link', { name: /Qabas · Birzeit/ })).toHaveAttribute('href', 'https://sina.birzeit.edu/qabas/lemma/202003981');
  });

  test('halaman نَسْتَعِينُ menampilkan bento akar, filosofi semantik, dan keluarga kata', async ({ page }) => {
    await page.goto('/kata/%D9%86%D9%8E%D8%B3%D9%91%D8%AA%D9%8E%D8%B9%D9%90%D9%8A%D9%86%D9%8F', { waitUntil: 'networkidle' });

    // Cek judul kata & transliterasi
    await expect(page.locator('text=نَسْتَعِينُ').first()).toBeVisible();

    // Cek bento akar kata ع و ن
    await expect(page.locator('text=Akar Kata').first()).toBeVisible();
    await expect(page.locator('text=11× di Al-Qur\'an')).toBeVisible();

    // Cek filosofi & intisari makna akar (mengisi ruang yang sebelumnya bolong)
    await expect(page.locator('text=Filosofi & Intisari Makna Akar')).toBeVisible();
    await expect(page.locator('text=Pertolongan, saling membantu')).toBeVisible();

    // Cek keluarga kata
    await expect(page.locator('text=Keluarga Kata dalam Al-Qur\'an')).toBeVisible();
    await expect(page.locator('text=7 Bentuk')).toBeVisible();
  });

  test('halaman بَشَرٌ menampilkan data leksikal dan akar kata ب ش ر', async ({ page }) => {
    await page.goto('/kata/%D8%A8%D9%8E%D8%B4%D9%8E%D8%B1%D9%8C', { waitUntil: 'networkidle' });

    await expect(page.locator('text=بَشَرٌ').first()).toBeVisible();
    await expect(page.locator('text=123× di Al-Qur\'an')).toBeVisible();
    await expect(page.locator('text=Akar Kata').first()).toBeVisible();
  });
});
