export type ThemeType = 'half-bookpaper' | 'full-bookpaper' | 'langit' | 'earth' | 'dark' | 'bookpaper' | 'light' | 'green';

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
    id: 'half-bookpaper',
    label: 'Half Bookpaper',
    shortLabel: 'Half Paper',
    bgHex: '#FAF6EF',
    primaryHex: '#2B5740',
    borderHex: '#E5DACB',
  },
  {
    id: 'full-bookpaper',
    label: 'Full Bookpaper',
    shortLabel: 'Full Paper',
    bgHex: '#F3E9DA',
    primaryHex: '#234934',
    borderHex: '#DDD0BF',
  },
  {
    id: 'langit',
    label: 'Tema Langit',
    shortLabel: 'Langit',
    bgHex: '#F0F7FB',
    primaryHex: '#0284C7',
    borderHex: '#D1E6F3',
  },
  {
    id: 'earth',
    label: 'Tema Earth',
    shortLabel: 'Earth',
    bgHex: '#F5EFEB',
    primaryHex: '#7C4A2D',
    borderHex: '#DFCFC3',
  },
  {
    id: 'dark',
    label: 'Malam Obsidian',
    shortLabel: 'Malam',
    bgHex: '#0B1410',
    primaryHex: '#10B981',
    borderHex: '#1E3D30',
  },
];

export function isValidTheme(theme: string): theme is ThemeType {
  return ['half-bookpaper', 'full-bookpaper', 'langit', 'earth', 'dark', 'bookpaper', 'light', 'green'].includes(theme);
}
