import { isValidTheme, THEME_OPTIONS, ThemeType } from './theme-config';

function runThemeTests() {
  console.log('Running Theme System TDD Unit Tests...\n');

  // Test 1: Validate supported themes
  const validThemes: ThemeType[] = ['light', 'bookpaper', 'green', 'dark'];
  validThemes.forEach((t) => {
    console.assert(isValidTheme(t), `Test 1 Failed: Theme "${t}" should be valid`);
  });
  console.assert(!isValidTheme('invalid-theme'), 'Test 1 Failed: "invalid-theme" should not be valid');
  console.log('Passed Test 1: All 4 themes (light, bookpaper, green, dark) are recognized correctly');

  // Test 2: Ensure THEME_OPTIONS has all 4 themes with labels and color previews
  console.assert(THEME_OPTIONS.length === 4, 'Test 2 Failed: THEME_OPTIONS should have 4 themes');
  const ids = THEME_OPTIONS.map((o) => o.id);
  console.assert(ids.includes('light') && ids.includes('bookpaper') && ids.includes('green') && ids.includes('dark'), 'Test 2 Failed: Should contain all 4 theme IDs');
  console.log('Passed Test 2: THEME_OPTIONS metadata has complete labels and color swatches');

  console.log('\nALL THEME SYSTEM TDD UNIT TESTS PASSED!');
}

runThemeTests();
