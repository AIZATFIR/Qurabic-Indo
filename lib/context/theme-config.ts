export type ThemeType = 'bookpaper' | 'linen' | 'mist' | 'sage' | 'blend' | 'sand' | 'paperwhite' | 'simple' | 'modern';

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
    id: 'bookpaper',
    label: 'Bookpaper klasik',
    shortLabel: 'Bookpaper',
    bgHex: '#FAF5ED',
    primaryHex: '#2D5A43',
    borderHex: '#E5DACD',
    description: 'Warna kertas lama dengan aksen hijau teduh',
  },
  {
    id: 'linen',
    label: 'Linen',
    shortLabel: 'Linen',
    bgHex: '#FFFCF5',
    primaryHex: '#536C5A',
    borderHex: '#EAE5D9',
    description: 'Krem sangat terang dan lembut',
  },
  {
    id: 'mist',
    label: 'Kabut',
    shortLabel: 'Mist',
    bgHex: '#F7FAF9',
    primaryHex: '#48645A',
    borderHex: '#E0E9E5',
    description: 'Putih sejuk dengan sentuhan hijau',
  },
  {
    id: 'sage',
    label: 'Sage muda',
    shortLabel: 'Sage',
    bgHex: '#F5F9F3',
    primaryHex: '#526B4F',
    borderHex: '#E1E9DE',
    description: 'Hijau pucat yang nyaman untuk membaca',
  },
  {
    id: 'blend',
    label: 'Krem hangat',
    shortLabel: 'Krem',
    bgHex: '#FAF6EF',
    primaryHex: '#6E4C34',
    borderHex: '#E5DACB',
    description: 'Bookpaper dengan aksen cokelat hangat',
  },
  {
    id: 'sand',
    label: 'Pasir',
    shortLabel: 'Sand',
    bgHex: '#F1E8D8',
    primaryHex: '#70563A',
    borderHex: '#DED0B8',
    description: 'Kertas pasir hangat',
  },
  {
    id: 'paperwhite',
    label: 'Putih',
    shortLabel: 'White',
    bgHex: '#FFFFFF',
    primaryHex: '#4E5A51',
    borderHex: '#E4E7E3',
    description: 'Putih bersih dengan kontras lembut',
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
  'full-bookpaper': 'bookpaper',
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
  return theme === 'bookpaper' || theme === 'linen' || theme === 'mist' || theme === 'sage' || theme === 'blend' || theme === 'sand' || theme === 'paperwhite' || theme === 'simple' || theme === 'modern';
}
