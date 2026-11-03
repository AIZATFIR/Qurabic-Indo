export type ThemeType = 'blend' | 'simple' | 'modern';

export interface ThemeOption {
  id: ThemeType;
  label: string;
  shortLabel: string;
  bgHex: string;
  primaryHex: string;
  borderHex: string;
  description: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'blend',
    label: 'Gabungan',
    shortLabel: 'Blend',
    bgHex: '#F5F4EF',
    primaryHex: '#205B43',
    borderHex: '#DFE3DA',
    description: 'Tenang dengan aksen hijau modern',
  },
  {
    id: 'simple',
    label: 'Sederhana',
    shortLabel: 'Simple',
    bgHex: '#F7F8F6',
    primaryHex: '#42584C',
    borderHex: '#E2E5E1',
    description: 'Ringan dan minimal',
  },
  {
    id: 'modern',
    label: 'Modern',
    shortLabel: 'Modern',
    bgHex: '#EEF6F1',
    primaryHex: '#08764F',
    borderHex: '#D5E6DB',
    description: 'Warna lebih berani, bentuk lebih lembut',
  },
];

const LEGACY_THEME_MAP: Record<string, ThemeType> = {
  'half-bookpaper': 'blend',
  'full-bookpaper': 'blend',
  bookpaper: 'blend',
  light: 'simple',
  langit: 'modern',
  earth: 'blend',
  green: 'modern',
  dark: 'modern',
};

export function normalizeTheme(theme: string): ThemeType | null {
  if (isValidTheme(theme)) return theme;
  return LEGACY_THEME_MAP[theme] ?? null;
}

export function isValidTheme(theme: string): theme is ThemeType {
  return theme === 'blend' || theme === 'simple' || theme === 'modern';
}
