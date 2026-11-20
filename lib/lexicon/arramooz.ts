import recordsByRoot from '@/lib/data/arramooz-quran-roots.json';
import type { ArramoozForm } from './arramooz-shared';
export type { ArramoozForm } from './arramooz-shared';

export function getArramoozForms(rootId: string): ArramoozForm[] {
  return (recordsByRoot as Record<string, ArramoozForm[]>)[rootId] ?? [];
}
