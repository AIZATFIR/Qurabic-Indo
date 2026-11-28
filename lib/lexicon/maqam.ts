import { createClient, type Client } from '@libsql/client';
import path from 'path';
import { formatMaqamGloss } from './maqam-gloss-format';

export interface MaqamLexicalGloss {
  lemma: string;
  gloss: string;
  pos: string;
  root?: string;
}

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    client = createClient({ url: `file:${path.join(process.cwd(), 'lib/data/maqam-glosses.sqlite')}` });
  }
  return client;
}

export async function getMaqamWordGlosses(locations: string[]): Promise<Record<string, MaqamLexicalGloss>> {
  const unique = [...new Set(locations.filter((location) => /^\d{1,3}:\d{1,3}:\d{1,3}$/.test(location)))];
  if (!unique.length) return {};
  const placeholders = unique.map(() => '?').join(',');
  const result = await getClient().execute({
    sql: `SELECT location, lemma, gloss, pos, root FROM glosses WHERE location IN (${placeholders})`,
    args: unique,
  });
  const glosses: Record<string, MaqamLexicalGloss> = {};
  for (const row of result.rows) {
    const location = String(row.location);
    glosses[location] = {
      lemma: String(row.lemma),
      gloss: String(row.gloss),
      pos: String(row.pos),
      ...(row.root ? { root: String(row.root) } : {}),
    };
  }
  return glosses;
}
