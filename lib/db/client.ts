import { createClient, Client } from '@libsql/client';
import path from 'path';

let clientInstance: Client | null = null;

export function getQurabicDb(): Client {
  if (!clientInstance) {
    const dbPath = path.join(process.cwd(), 'lib/db/qurabic.db');
    clientInstance = createClient({
      url: `file:${dbPath}`,
    });
  }
  return clientInstance;
}

export interface WordRecord {
  id: number;
  surah: number;
  ayah: number;
  word_num: number;
  arabic: string;
  translation?: string;
  root?: string;
  lemma?: string;
  pos?: string;
  features?: string;
}

export async function getVerseWords(surah: number, ayah: number): Promise<WordRecord[]> {
  const db = getQurabicDb();
  const rs = await db.execute({
    sql: 'SELECT * FROM words WHERE surah = ? AND ayah = ? ORDER BY word_num ASC',
    args: [surah, ayah],
  });
  return rs.rows as unknown as WordRecord[];
}

export async function getWordsByRoot(root: string): Promise<WordRecord[]> {
  const db = getQurabicDb();
  const rs = await db.execute({
    sql: 'SELECT * FROM words WHERE root = ? ORDER BY surah, ayah, word_num ASC',
    args: [root],
  });
  return rs.rows as unknown as WordRecord[];
}

export async function getAyahDetails(surah: number, ayah: number) {
  const db = getQurabicDb();
  const rs = await db.execute({
    sql: 'SELECT * FROM ayahs WHERE surah = ? AND ayah = ? LIMIT 1',
    args: [surah, ayah],
  });
  return rs.rows[0];
}
