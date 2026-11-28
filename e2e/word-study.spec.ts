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
    await expect(dialog.getByText(/Verse context \(Qur’an 18:\d+\)/)).toBeVisible();
    await expect(dialog.getByText(/QS\./)).toHaveCount(0);
  });

  test('Indonesian word study labels MAQAM fallback as an English stem gloss', async ({ page }) => {
    await page.route('**/api/word-glosses**', async (route) => {
      const url = new URL(route.request().url());
      const locations = (url.searchParams.get('locations') || '').split(',').filter(Boolean);
      await route.fulfill({
        status: 200,
        json: {
          meanings: Object.fromEntries(locations.map((location) => [location, 'establish'])),
          sources: Object.fromEntries(locations.map((location) => [location, 'maqam-english-gloss'])),
          language: 'id',
        },
      });
    });

    await page.goto('/kata/%D9%88%D9%8E%D8%A3%D9%8E%D9%82%D9%90%D9%85%D9%8F%D9%88%D8%A7?location=2%3A43%3A1', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('MAQAM · glos bentuk dasar (Inggris)', { exact: true }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('establish', { exact: true }).first()).toBeVisible();
    await page.getByRole('button', { name: 'MAQAM · glos bentuk dasar (Inggris)' }).first().click();
    const sources = page.getByRole('dialog').filter({ has: page.getByText('Sumber data', { exact: true }) });
    await expect(sources.getByText('MAQAM — glos leksikal Inggris')).toBeVisible();
    await expect(sources.getByText('Tanzil Project — teks sumber yang dirujuk MAQAM')).toBeVisible();
  });

  test('Indonesian Quran.com word glosses separate fused locative prepositions', async ({ page }) => {
    await page.route('**/api/word-glosses**', async (route) => {
      const locations = new URL(route.request().url()).searchParams.get('locations')?.split(',').filter(Boolean) || [];
      await route.fulfill({
        status: 200,
        json: {
          meanings: Object.fromEntries(locations.map((location) => [location, 'di dalamnya'])),
          sources: Object.fromEntries(locations.map((location) => [location, 'quran-com-wbw'])),
          language: 'id',
        },
      });
    });

    await page.goto('/kata/%D9%81%D9%90%D9%8A%D9%87%D9%90?location=18%3A3%3A2', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('di dalamnya', { exact: true }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Quran.com · Indonesia', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('didalamnya', { exact: true })).toHaveCount(0);
  });

  test('English word study labels MAQAM fallback by its source', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.route('**/api/word-glosses**', async (route) => {
      const url = new URL(route.request().url());
      const locations = (url.searchParams.get('locations') || '').split(',').filter(Boolean);
      await route.fulfill({
        status: 200,
        json: {
          meanings: Object.fromEntries(locations.map((location) => [location, 'establish'])),
          sources: Object.fromEntries(locations.map((location) => [location, 'maqam-english-gloss'])),
          language: 'en',
        },
      });
    });

    await page.goto('/kata/%D9%88%D9%8E%D8%A3%D9%8E%D9%82%D9%90%D9%85%D9%8F%D9%88%D8%A7?location=2%3A43%3A1', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('MAQAM · English stem gloss', { exact: true }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('MAQAM · glos bentuk dasar (Inggris)', { exact: true })).toHaveCount(0);
  });

  test('offline word study reads the cached MAQAM gloss pack', async ({ page }) => {
    await page.goto('/baca?surah=2', { waitUntil: 'domcontentloaded' });
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await expect.poll(() => page.evaluate(async () => {
      const cache = await caches.open('qurabic-reader-shell-v2');
      return Boolean(await cache.match(new URL('/data/maqam-glosses.json', location.origin)));
    }), { timeout: 20000 }).toBe(true);

    let interruptedApiRequest = false;
    await page.route('**/api/word-glosses**', async (route) => {
      if (!interruptedApiRequest) {
        interruptedApiRequest = true;
        await page.context().setOffline(true);
      }
      await route.abort();
    });
    await page.goto('/kata/%D9%84%D9%8E%D8%A7?location=2%3A2%3A3', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('MAQAM · glos bentuk dasar (Inggris)', { exact: true }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('no · not · non-', { exact: true }).first()).toBeVisible();
    await page.context().setOffline(false);
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

  test('word family pages expose every QAC form and load glosses for the active page only', async ({ page }) => {
    const requestedBatchSizes: number[] = [];
    await page.route('**/api/word-glosses**', async (route) => {
      const url = new URL(route.request().url());
      const locations = (url.searchParams.get('locations') || '').split(',').filter(Boolean);
      requestedBatchSizes.push(locations.length);
      await route.fulfill({
        status: locations.length > 48 ? 400 : 200,
        json: {
          meanings: Object.fromEntries(locations.map((location) => [location, `Gloss ${location}`])),
          language: 'id',
          source: 'Quran.com Word-by-Word · API v4',
        },
      });
    });

    await page.goto('/kata/%D9%88%D9%8E%D8%A3%D9%8E%D9%82%D9%90%D9%8A%D9%85%D9%8F%D9%88%D8%A7?location=2%3A43%3A1', { waitUntil: 'domcontentloaded' });
    const family = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Keluarga Kata dalam Al-Qur’an' }) });
    const familyPages = family.getByRole('navigation', { name: 'Halaman keluarga kata' });

    await expect(familyPages.getByText('1–12 dari 38 bentuk')).toBeVisible({ timeout: 20000 });
    await expect.poll(() => requestedBatchSizes.length, { timeout: 10000 }).toBeGreaterThan(0);
    expect(requestedBatchSizes.every((size) => size > 0 && size <= 48)).toBe(true);
    expect(requestedBatchSizes.reduce((total, size) => total + size, 0)).toBeLessThanOrEqual(13);
    const formLinks = family.locator('div.grid a[href^="/kata/"]');
    const firstPage = await formLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    const firstPageRequests = requestedBatchSizes.length;
    await familyPages.getByRole('button', { name: 'Berikutnya' }).click();
    await expect(familyPages.getByText('13–24 dari 38 bentuk')).toBeVisible();
    await expect.poll(() => requestedBatchSizes.length, { timeout: 10000 }).toBeGreaterThan(firstPageRequests);
    const secondPage = await formLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(secondPage).toHaveLength(12);
    expect(secondPage).not.toEqual(firstPage);
  });

  test('word study uses the local MAQAM glosses when the gloss API fails', async ({ page }) => {
    let requests = 0;
    await page.route('**/api/word-glosses**', async (route) => {
      requests += 1;
      const url = new URL(route.request().url());
      const locations = (url.searchParams.get('locations') || '').split(',').filter(Boolean);
      if (requests <= 2) {
        await route.fulfill({ status: 503, json: { error: 'temporarily unavailable' } });
        return;
      }
      await route.fulfill({
        status: 200,
        json: {
          meanings: Object.fromEntries(locations.map((location) => [location, `Gloss ${location}`])),
          language: 'id',
          source: 'Quran.com Word-by-Word · API v4',
        },
      });
    });

    await page.goto('/kata/%D9%88%D9%8E%D8%A3%D9%8E%D9%82%D9%90%D9%85%D9%8F%D9%88%D8%A7?location=2%3A43%3A1', { waitUntil: 'domcontentloaded' });
    const family = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Keluarga Kata dalam Al-Qur’an' }) });
    const familyError = family.getByRole('status').filter({ hasText: 'Sebagian makna keluarga kata gagal dimuat.' });
    await expect(family.getByText('MAQAM · glos bentuk dasar (Inggris)').first()).toBeVisible({ timeout: 15000 });
    await expect(familyError).toHaveCount(0);
    expect(requests).toBeGreaterThanOrEqual(2);
  });

  test('root page labels the QBQ summary and links a Quranic lemma directly to Qabas', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
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
    await expect(meaningSection).toContainText('Original English dictionary entry · Lane, 1863');
    const datasetSummary = meaningSection.locator('details').filter({ has: page.getByText('Open dataset summary · authorship is undocumented', { exact: true }) });
    await expect(datasetSummary).toBeVisible();
    await datasetSummary.locator('summary').click();
    await expect(datasetSummary.locator('p[lang="en"]')).toContainText('The root رَأَى primarily means');
    await expect(meaningSection.getByRole('link', { name: 'Open a related Qur’anic lemma in Qabas · Birzeit' })).toHaveAttribute('href', 'https://sina.birzeit.edu/qabas/lemma/202001196');
  });

  test('root page loads sourced Arabic forms outside the Quran only when requested', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/arramooz/search?')) requests.push(request.url());
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

  test('root page discloses QBQ authorship limits and preserves the cited Lane entry', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'id'));
    await page.goto('/akar/d-y-n', { waitUntil: 'domcontentloaded' });

    const meaningSection = page.locator('section[aria-labelledby="root-meaning-heading"]');
    const datasetSummary = meaningSection.locator('details').filter({ has: page.getByText('Buka ringkasan dataset · proses penulisan tidak terdokumentasi', { exact: true }) });
    await expect(datasetSummary).toBeVisible();
    await expect(meaningSection.locator('p[lang="en"]').first()).toContainText('He was, or became, obedient');
    await datasetSummary.locator('summary').click();
    await expect(datasetSummary.locator('p[lang="en"]')).toContainText('The root "dyn" primarily means to be obedient');
    await expect(meaningSection.locator('p').filter({ hasText: 'Kutipan asli Lane · bahasa Inggris' })).toBeVisible();
    await expect(meaningSection).toContainText('Buku I, Bagian 3, hlm. 943');
  });

  test('root page labels the QBQ summary and keeps the Lane excerpt available on demand', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.goto('/akar/S-b-r', { waitUntil: 'domcontentloaded' });

    const meaningSection = page.locator('section[aria-labelledby="root-meaning-heading"]');
    const datasetSummary = meaningSection.locator('details').filter({ has: page.getByText('Open dataset summary · authorship is undocumented', { exact: true }) });
    await expect(datasetSummary).toBeVisible();
    await expect(meaningSection.locator('p[lang="en"]').first()).toContainText('He confined him; held him in custody');
    await datasetSummary.locator('summary').click();
    await expect(datasetSummary.locator('p[lang="en"]')).toContainText('The root "Sbr" primarily means to confine or restrain');
    await expect(meaningSection.getByText('Read the full Lane excerpt · English', { exact: true })).toBeVisible();
  });

  test('root pages display Lane entries filed under alternate classical roots', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('qurabic_language', 'en'));
    const examples = [
      { slug: 'z-H-z-H', headword: 'زَحْزَحَ', citation: 'Book I, Part 3, p. 1218', laneRoot: 'Lane root: زح' },
      { slug: 'w-s-w-s', headword: 'وَسْوَسَ', citation: 'Book I, Part 8, p. 2939', laneRoot: 'Lane root: وس' },
      { slug: 'y-d-y', headword: 'يَدٌ', citation: 'Book I, Part 8, p. 3063', laneRoot: 'Lane root: يد' },
    ];

    for (const example of examples) {
      await page.goto(`/akar/${example.slug}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      const laneSection = page.locator('section[aria-labelledby="lane-heading"]');
      await expect(laneSection).toContainText(example.headword);
      await expect(laneSection).toContainText(example.citation);
      await expect(laneSection).toContainText(example.laneRoot);
    }
  });

  test('QBQ root summary stays readable in both language modes with Lane available on demand', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'id'));
    await page.goto('/akar/m-l-k', { waitUntil: 'domcontentloaded' });
    const indonesianMeaning = page.locator('section[aria-labelledby="root-meaning-heading"]');
    const indonesianSummary = indonesianMeaning.locator('details').filter({ has: page.getByText('Buka ringkasan dataset · proses penulisan tidak terdokumentasi', { exact: true }) });
    await expect(indonesianSummary).toBeVisible();
    await indonesianSummary.locator('summary').click();
    await expect(indonesianSummary.locator('p[lang="en"]')).toContainText('The root ملك (mlk) primarily means to possess or own');

    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    const englishMeaning = page.locator('section[aria-labelledby="root-meaning-heading"]');
    const englishSummary = englishMeaning.locator('details').filter({ has: page.getByText('Open dataset summary · authorship is undocumented', { exact: true }) });
    await expect(englishSummary).toBeVisible();
    await englishSummary.locator('summary').click();
    await expect(englishSummary.locator('p[lang="en"]')).toContainText('The root ملك (mlk) primarily means to possess or own');
    await expect(englishMeaning.getByText('Read the full Lane excerpt · English', { exact: true })).toBeVisible();
  });

  test('English root entry labels the indexed Lane text accurately', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.goto('/akar/r-H-m', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Original English dictionary entry · Lane, 1863', { exact: true })).toBeVisible();
    await expect(page.getByText('Open dataset summary · authorship is undocumented', { exact: true })).toBeVisible();
    await expect(page.getByText('Original English source excerpt · Lane, 1863')).toHaveCount(0);
    const laneExcerpt = page.locator('section[aria-labelledby="root-meaning-heading"] details').filter({ hasText: 'Read the full Lane excerpt · English' });
    await expect(laneExcerpt.locator('summary')).toHaveText('Read the full Lane excerpt · English');
    await laneExcerpt.locator('summary').click();
    await expect(laneExcerpt).toContainText('Edward William Lane, An Arabic-English Lexicon');
    const firstOccurrence = page.locator('#concordance a').first();
    await expect(firstOccurrence).toContainText('Qur’an');
    await expect(firstOccurrence).not.toContainText('QS.');
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
    await page.getByRole('link', { name: /Lihat definisi asli Lane · English/ }).click();
    const laneSection = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Definisi klasik · Lane’s Lexicon (English)' }) });
    await expect(laneSection).toBeVisible();
    await laneSection.getByRole('button', { name: /Baca 2 definisi Lane · English/ }).click();
    const secondSense = laneSection.locator('details').filter({ hasText: /Makna #2|Sense #2/ });
    await expect(secondSense).toBeVisible();
    await secondSense.locator('summary').click();
    await expect(secondSense).toContainText('Sometimes it is syn. with');
    await expect(page.getByRole('link', { name: /Qabas · Birzeit/ })).toHaveAttribute('href', 'https://sina.birzeit.edu/qabas/lemma/202003981');
  });

  test('halaman نَسْتَعِينُ menampilkan akar, frekuensi, dan keluarga kata', async ({ page }) => {
    await page.goto('/kata/%D9%86%D9%8E%D8%B3%D9%91%D8%AA%D9%8E%D8%B9%D9%90%D9%8A%D9%86%D9%8F', { waitUntil: 'networkidle' });

    // Cek judul kata & transliterasi
    await expect(page.locator('text=نَسْتَعِينُ').first()).toBeVisible();

    // Akar and corpus count remain visible in the current reader layout.
    await expect(page.locator('text=Akar Kata').first()).toBeVisible();
    await expect(page.getByText(/11× di Al-Qur.an/)).toBeVisible();

    // Cek keluarga kata
    await expect(page.getByRole('heading', { name: /Keluarga Kata dalam Al-Qur.an/ })).toBeVisible();
    await expect(page.locator('text=7 Bentuk')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Buka Kamus Akar' })).toHaveAttribute('href', '/akar/E-w-n');
  });

  test('halaman بَشَرٌ menampilkan data leksikal dan akar kata ب ش ر', async ({ page }) => {
    await page.goto('/kata/%D8%A8%D9%8E%D8%B4%D9%8E%D8%B1%D9%8C', { waitUntil: 'networkidle' });

    await expect(page.locator('text=بَشَرٌ').first()).toBeVisible();
    await expect(page.getByText(/123× di Al-Qur.an/)).toBeVisible();
    await expect(page.locator('text=Akar Kata').first()).toBeVisible();
  });
});
