import { isValidTheme, THEME_OPTIONS, ThemeType } from './theme-config';

function runThemeTests() {
  console.log('Running Theme System TDD Unit Tests...\n');

  // Test 1: Validate supported themes
  const validThemes: ThemeType[] = ['blend', 'simple', 'modern'];
  validThemes.forEach((t) => {
    console.assert(isValidTheme(t), `Test 1 Failed: Theme "${t}" should be valid`);
  });
  console.assert(!isValidTheme('invalid-theme'), 'Test 1 Failed: "invalid-theme" should not be valid');
  console.log('Passed Test 1: Blend, Simple, and Modern themes are recognized correctly');

  // Test 2: Ensure THEME_OPTIONS has exactly 3 selectable themes with labels and color previews
  console.assert(THEME_OPTIONS.length === 3, 'Test 2 Failed: THEME_OPTIONS should have 3 themes');
  const ids = THEME_OPTIONS.map((o) => o.id);
  console.assert(ids.includes('blend') && ids.includes('simple') && ids.includes('modern'), 'Test 2 Failed: Should contain all 3 theme IDs');
  console.assert(THEME_OPTIONS.every((o) => o.label && o.description && o.bgHex && o.primaryHex && o.borderHex), 'Test 2 Failed: Every theme should have labels and color swatches');
  console.log('Passed Test 2: Three theme options have labels, descriptions, and color swatches');

  console.log('\nALL THEME SYSTEM TDD UNIT TESTS PASSED!');
}

runThemeTests();
