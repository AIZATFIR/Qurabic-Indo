import { createClient, type Client } from '@libsql/client';
import path from 'path';

let client: Client | null = null;

export function getTajAlArusDatabase(): Client {
  if (!client) {
    const dbPath = path.join(process.cwd(), 'lib/data/taj-al-arus-roots.sqlite');
    client = createClient({ url: `file:${dbPath}` });
  }
  return client;
}
