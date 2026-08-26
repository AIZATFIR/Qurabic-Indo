export type ThemeType = 'light' | 'bookpaper' | 'green' | 'dark';

export interface ThemeOption {
  id: ThemeType;
  label: string;
  shortLabel: string;
  bgHex: string;
  primaryHex: string;
  borderHex: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'bookpaper',
    label: 'Bookpaper',
    shortLabel: 'Paper',
    bgHex: '#FAF5ED',
    primaryHex: '#2D5A43',
    borderHex: '#E2D6C5',
  },
  {
    id: 'light',
    label: 'Terang',
    shortLabel: 'Light',
    bgHex: '#FAFCFA',
    primaryHex: '#059669',
    borderHex: '#E2ECE6',
  },
  {
    id: 'green',
    label: 'Hijau Zamrud',
    shortLabel: 'Green',
    bgHex: '#F0F9F4',
    primaryHex: '#047857',
    borderHex: '#CBE8D8',
  },
  {
    id: 'dark',
    label: 'Malam',
    shortLabel: 'Dark',
    bgHex: '#0B1410',
    primaryHex: '#10B981',
    borderHex: '#1E3D30',
  },
];

export function isValidTheme(theme: string): theme is ThemeType {
  return ['light', 'bookpaper', 'green', 'dark'].includes(theme);
}
