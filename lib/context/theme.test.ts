import assert from 'node:assert/strict';
import { isValidTheme, normalizeTheme, THEME_OPTIONS, ThemeType } from './theme-config';

function runThemeTests() {
  console.log('Running Theme System TDD Unit Tests...\n');

  // Test 1: Validate supported themes
  const validThemes: ThemeType[] = ['bookpaper', 'linen', 'mist', 'sage', 'blend', 'sand', 'paperwhite', 'simple', 'modern'];
  validThemes.forEach((t) => {
    assert.equal(isValidTheme(t), true, `Theme "${t}" should be valid`);
  });
  assert.equal(isValidTheme('invalid-theme'), false, 'Unknown themes should not be valid');
  assert.equal(normalizeTheme('full-bookpaper'), 'bookpaper', 'Legacy full-bookpaper preference should restore the classic palette');
  assert.equal(normalizeTheme('half-bookpaper'), 'blend', 'Legacy half-bookpaper preference should retain its blend palette');
  console.log('Passed Test 1: All nine themes and legacy preferences are recognized correctly');

  // Test 2: Ensure all selectable paper themes have labels and distinct previews
  assert.equal(THEME_OPTIONS.length, 9, 'THEME_OPTIONS should have nine themes');
  const ids = THEME_OPTIONS.map((o) => o.id);
  assert.deepEqual(new Set(ids).size, THEME_OPTIONS.length, 'Theme IDs should be unique');
  assert.ok(validThemes.every(id => ids.includes(id)), 'Every paper theme should be included');
  assert.ok(THEME_OPTIONS.every((o) => o.label && o.description && o.bgHex && o.primaryHex && o.borderHex), 'Every theme should have labels and color swatches');
  const classic = THEME_OPTIONS.find((o) => o.id === 'bookpaper');
  assert.equal(classic?.bgHex, '#FAF5ED', 'Classic Bookpaper should use the original page color');
  assert.equal(classic?.primaryHex, '#2D5A43', 'Classic Bookpaper should use the original green accent');
  console.log('Passed Test 2: Nine theme options have labels, descriptions, and color swatches');

  console.log('\nALL THEME SYSTEM TDD UNIT TESTS PASSED!');
}

runThemeTests();
