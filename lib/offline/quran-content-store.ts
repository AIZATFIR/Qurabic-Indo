import { normalizeQuranFoundationAudioUrl } from '../api/audio';

export const QURAN_CONTENT_FILTER = 'quran_core:1;translations:20,33;recitations:7';

const DATABASE_NAME = 'qurabic-quran-content';
const DATABASE_VERSION = 3;
const CONTENT_STORE = 'content';
const STAGING_STORE = 'staged-content';
const SYNC_STORE = 'sync-state';
const PACKAGE_STORE = 'offline-package';
let databasePromise: Promise<IDBDatabase> | undefined;

export type ContentResourceGroup = 'quran_core' | 'translations' | 'recitations';

export interface StoredContentRow {
  resourceGroup: ContentResourceGroup;
  resourceId: number;
  recordType: string;
  recordKey: string;
  chapterId?: number;
  data: Record<string, unknown>;
  updatedAt: string;
}

export interface ContentSyncCheckpoint {
  resourcesFilter: string;
  syncToken: string;
  lastSuccessfulSyncAt: string;
}

export interface OfflineQuranPackage {
  id: 'quran-content';
  resourcesFilter: string;
  savedAt: string;
  lastSuccessfulSyncAt: string;
  /** False while a multi-resource sync has changed rows but has not committed its token. */
  isConsistent?: boolean;
}

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('Offline storage is unavailable'));
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = (event) => {
      const database = request.result;
      if (!database.objectStoreNames.contains(CONTENT_STORE)) {
        const content = database.createObjectStore(CONTENT_STORE, {
          keyPath: ['resourceGroup', 'resourceId', 'recordType', 'recordKey'],
        });
        content.createIndex('by-resource', ['resourceGroup', 'resourceId'], { unique: false });
        content.createIndex('by-chapter', ['resourceGroup', 'resourceId', 'chapterId'], { unique: false });
      }
      if (!database.objectStoreNames.contains(STAGING_STORE)) {
        const staging = database.createObjectStore(STAGING_STORE, {
          keyPath: ['snapshotId', 'recordType', 'recordKey'],
        });
        staging.createIndex('by-snapshot', 'snapshotId', { unique: false });
      }
      if (!database.objectStoreNames.contains(SYNC_STORE)) {
        database.createObjectStore(SYNC_STORE, { keyPath: 'resourcesFilter' });
      }
      if (!database.objectStoreNames.contains(PACKAGE_STORE)) {
        database.createObjectStore(PACKAGE_STORE, { keyPath: 'id' });
      }
      if (event.oldVersion > 0 && event.oldVersion < 2) {
        const content = request.transaction!.objectStore(CONTENT_STORE);
        const cursorRequest = content.openCursor();
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result;
          if (!cursor) return;
          const row = cursor.value as StoredContentRow;
          if (row.chapterId === undefined) {
            const chapterId = getChapterId(row.recordType, row.data);
            if (chapterId !== undefined) cursor.update({ ...row, chapterId });
          }
          cursor.continue();
        };
      }
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => {
        request.result.close();
        databasePromise = undefined;
      };
      resolve(request.result);
    };
    request.onerror = () => {
      databasePromise = undefined;
      reject(new Error('Offline Quran storage could not be opened'));
    };
    request.onblocked = () => {
      databasePromise = undefined;
      reject(new Error('Close another Qurabic tab to update offline storage'));
    };
  });
  return databasePromise;
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(new Error('Offline Quran storage update was cancelled'));
    transaction.onerror = () => reject(new Error('Offline Quran storage update failed'));
  });
}

function readRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Offline Quran data could not be read'));
  });
}

function getChapterId(recordType: string, record: Record<string, unknown>): number | undefined {
  const candidate = record.chapter_id ?? record.chapterId;
  if (typeof candidate === 'number' && Number.isInteger(candidate)) return candidate;
  if (recordType === 'chapter' && typeof record.id === 'number' && Number.isInteger(record.id)) return record.id;
  if (typeof record.verse_key === 'string') {
    const match = /^(\d+):\d+$/.exec(record.verse_key);
    if (match) return Number(match[1]);
  }
  return undefined;
}

function makeStoredRow(
  resourceGroup: ContentResourceGroup,
  resourceId: number,
  recordType: string,
  recordKey: string,
  data: Record<string, unknown>,
): StoredContentRow {
  if (!recordType || !recordKey) throw new Error('Content sync row is missing its stable key');
  return {
    resourceGroup,
    resourceId,
    recordType,
    recordKey,
    chapterId: getChapterId(recordType, data),
    data,
    updatedAt: new Date().toISOString(),
  };
}

export async function stageContentResourceBatch(
  snapshotId: string,
  resourceGroup: ContentResourceGroup,
  resourceId: number,
  records: Record<string, unknown>[],
): Promise<void> {
  if (!records.length) return;
  const database = await openDatabase();
  const transaction = database.transaction(STAGING_STORE, 'readwrite');
  const complete = transactionComplete(transaction);
  const staging = transaction.objectStore(STAGING_STORE);
  try {
    for (const record of records) {
      const recordType = typeof record.record_type === 'string'
        ? record.record_type
        : resourceGroup === 'translations' ? 'translation' : '';
      const recordKey = record.id === undefined || record.id === null ? '' : String(record.id);
      staging.add({ snapshotId, ...makeStoredRow(resourceGroup, resourceId, recordType, recordKey, record) });
    }
  } catch (error) {
    transaction.abort();
    await complete.catch(() => undefined);
    throw error;
  }
  await complete;
}

export async function commitStagedContentResource(
  snapshotId: string,
  resourceGroup: ContentResourceGroup,
  resourceId: number,
): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction([CONTENT_STORE, STAGING_STORE], 'readwrite');
  const complete = transactionComplete(transaction);
  const content = transaction.objectStore(CONTENT_STORE);
  const staging = transaction.objectStore(STAGING_STORE);
  const oldRows = content.index('by-resource').openCursor(IDBKeyRange.only([resourceGroup, resourceId]));

  oldRows.onsuccess = () => {
    const cursor = oldRows.result;
    if (cursor) {
      cursor.delete();
      cursor.continue();
      return;
    }

    const stagedRows = staging.index('by-snapshot').openCursor(IDBKeyRange.only(snapshotId));
    stagedRows.onsuccess = () => {
      const stagedCursor = stagedRows.result;
      if (!stagedCursor) return;
      const staged = stagedCursor.value as StoredContentRow & { snapshotId: string };
      content.put({
        resourceGroup: staged.resourceGroup,
        resourceId: staged.resourceId,
        recordType: staged.recordType,
        recordKey: staged.recordKey,
        chapterId: staged.chapterId,
        data: staged.data,
        updatedAt: staged.updatedAt,
      });
      stagedCursor.delete();
      stagedCursor.continue();
    };
    stagedRows.onerror = () => transaction.abort();
  };
  oldRows.onerror = () => transaction.abort();
  await complete;
}

export async function discardStagedContentResource(snapshotId: string): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(STAGING_STORE, 'readwrite');
  const complete = transactionComplete(transaction);
  const rows = transaction.objectStore(STAGING_STORE).index('by-snapshot').openCursor(IDBKeyRange.only(snapshotId));
  rows.onsuccess = () => {
    const cursor = rows.result;
    if (cursor) { cursor.delete(); cursor.continue(); }
  };
  rows.onerror = () => transaction.abort();
  await complete;
}

export async function clearStagedContentResources(): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(STAGING_STORE, 'readwrite');
  const complete = transactionComplete(transaction);
  transaction.objectStore(STAGING_STORE).clear();
  await complete;
}

export async function applyContentMutations(
  mutations: Array<Record<string, unknown>>,
): Promise<void> {
  if (!mutations.length) return;
  const database = await openDatabase();
  const transaction = database.transaction(CONTENT_STORE, 'readwrite');
  const complete = transactionComplete(transaction);
  const content = transaction.objectStore(CONTENT_STORE);
  const ordered = [...mutations].sort((a, b) => Number(a.sequence || 0) - Number(b.sequence || 0));

  try {
    for (const mutation of ordered) {
      const resourceGroup = mutation.resource_group;
      const resourceId = Number(mutation.resource_id);
      const recordType = typeof mutation.record_type === 'string' ? mutation.record_type : '';
      const recordKey = typeof mutation.record_key === 'string' ? mutation.record_key : '';
      const type = mutation.type;
      if (!Number.isInteger(resourceId) || !((resourceGroup === 'quran_core' && resourceId === 1) || (resourceGroup === 'translations' && (resourceId === 20 || resourceId === 33)) || (resourceGroup === 'recitations' && resourceId === 7))) {
        throw new Error('Content sync returned an unsupported resource');
      }

      if (type === 'RESOURCE_UPDATE') continue;
      if (type === 'RESOURCE_DELETE') throw new Error('A deleted resource must be removed separately');

      if (type === 'ROW_DELETE') {
        if (!recordType || !recordKey) throw new Error('Content sync row deletion is missing its key');
        content.delete([resourceGroup, resourceId, recordType, recordKey]);
        continue;
      }

      if (type === 'ROW_CREATE' || type === 'ROW_UPDATE') {
        if (!recordType || !recordKey || !mutation.data || typeof mutation.data !== 'object' || Array.isArray(mutation.data)) {
          throw new Error('Content sync row update is incomplete');
        }
        content.put(makeStoredRow(resourceGroup, resourceId, recordType, recordKey, mutation.data as Record<string, unknown>));
        continue;
      }

      if (type === 'RESOURCE_CREATE' || type === 'RESOURCE_INVALIDATE') {
        throw new Error('A resource snapshot must be fetched before applying this mutation');
      }

      throw new Error('Content sync returned an unsupported change');
    }
  } catch (error) {
    transaction.abort();
    await complete.catch(() => undefined);
    throw error;
  }

  await complete;
}

export async function deleteContentResource(resourceGroup: ContentResourceGroup, resourceId: number): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(CONTENT_STORE, 'readwrite');
  const complete = transactionComplete(transaction);
  const request = transaction.objectStore(CONTENT_STORE).index('by-resource').openCursor(IDBKeyRange.only([resourceGroup, resourceId]));
  request.onsuccess = () => {
    const cursor = request.result;
    if (cursor) { cursor.delete(); cursor.continue(); }
  };
  request.onerror = () => transaction.abort();
  await complete;
}

export async function getContentRowsForResource(
  resourceGroup: ContentResourceGroup,
  resourceId: number,
): Promise<StoredContentRow[]> {
  const database = await openDatabase();
  const transaction = database.transaction(CONTENT_STORE, 'readonly');
  const request = transaction.objectStore(CONTENT_STORE).index('by-resource').getAll(
    IDBKeyRange.only([resourceGroup, resourceId]),
  );
  return readRequest(request) as Promise<StoredContentRow[]>;
}

export async function getContentRow(
  resourceGroup: ContentResourceGroup,
  resourceId: number,
  recordType: string,
  recordKey: string,
): Promise<StoredContentRow | undefined> {
  const database = await openDatabase();
  const request = database.transaction(CONTENT_STORE, 'readonly').objectStore(CONTENT_STORE).get(
    [resourceGroup, resourceId, recordType, recordKey],
  );
  return readRequest(request) as Promise<StoredContentRow | undefined>;
}

export async function getQuranFoundationRecitationAudioUrl(chapterId: number, verseNumber: number): Promise<string | undefined> {
  const urls = await getQuranFoundationRecitationAudioUrls(chapterId);
  return urls[verseNumber];
}

export async function fetchQuranFoundationRecitationAudioUrls(chapterId: number, recitationId = 7): Promise<Record<number, string>> {
  if (!Number.isInteger(chapterId) || chapterId < 1 || chapterId > 114 || recitationId !== 7) {
    throw new Error('Unsupported Quran Foundation recitation request.');
  }
  const params = new URLSearchParams({ recitation: String(recitationId), surah: String(chapterId) });
  const response = await fetch(`/api/qf/recitations?${params}`, { signal: AbortSignal.timeout(10_000) });
  const payload = await response.json().catch(() => null) as { files?: unknown } | null;
  if (!response.ok || !Array.isArray(payload?.files)) throw new Error('Quran Foundation audio is unavailable.');

  const urls: Record<number, string> = {};
  for (const file of payload.files) {
    if (!file || typeof file !== 'object') continue;
    const row = file as Record<string, unknown>;
    if (typeof row.verseKey !== 'string') continue;
    const match = row.verseKey.match(/^(\d+):(\d+)$/);
    const url = typeof row.url === 'string' ? normalizeQuranFoundationAudioUrl(row.url) : undefined;
    if (!match || Number(match[1]) !== chapterId || !url) continue;
    const verseNumber = Number(match[2]);
    if (!Number.isInteger(verseNumber) || verseNumber < 1 || urls[verseNumber]) continue;
    urls[verseNumber] = url;
  }
  if (!Object.keys(urls).length) throw new Error('Quran Foundation returned no audio for this surah.');

  await applyContentMutations(Object.entries(urls).map(([verseNumber, url]) => ({
    type: 'ROW_UPDATE',
    resource_group: 'recitations',
    resource_id: recitationId,
    record_type: 'audio_file',
    record_key: `local-download:${chapterId}:${verseNumber}`,
    data: { verse_key: `${chapterId}:${verseNumber}`, url },
  })));
  return urls;
}

/** Load the synced audio map once for batch download or removal operations. */
export async function getQuranFoundationRecitationAudioUrls(chapterId: number): Promise<Record<number, string>> {
  const rows = await getContentRowsForChapter('recitations', 7, chapterId);
  const urls: Record<number, string> = {};
  for (const row of rows) {
    if (row.recordType !== 'audio_file' || row.data.verse_key === undefined) continue;
    const match = typeof row.data.verse_key === 'string'
      ? row.data.verse_key.match(/^(\d+):(\d+)$/)
      : null;
    if (!match || Number(match[1]) !== chapterId) continue;
    const url = typeof row.data.url === 'string' ? normalizeQuranFoundationAudioUrl(row.data.url) : undefined;
    if (url) urls[Number(match[2])] = url;
  }
  return urls;
}

export async function getContentRowsForChapter(
  resourceGroup: ContentResourceGroup,
  resourceId: number,
  chapterId: number,
): Promise<StoredContentRow[]> {
  const database = await openDatabase();
  const transaction = database.transaction(CONTENT_STORE, 'readonly');
  const request = transaction.objectStore(CONTENT_STORE).index('by-chapter').getAll(
    IDBKeyRange.only([resourceGroup, resourceId, chapterId]),
  );
  return readRequest(request) as Promise<StoredContentRow[]>;
}

export async function getConsistentOfflineChapterRows(
  chapterId: number,
  translationResourceId: 20 | 33,
): Promise<{
  packageState: OfflineQuranPackage | undefined;
  coreRows: StoredContentRow[];
  translationRows: StoredContentRow[];
}> {
  const database = await openDatabase();
  const transaction = database.transaction([PACKAGE_STORE, CONTENT_STORE], 'readonly');
  const complete = transactionComplete(transaction);
  const packageRequest = transaction.objectStore(PACKAGE_STORE).get('quran-content');
  const content = transaction.objectStore(CONTENT_STORE);
  const range = (resourceGroup: ContentResourceGroup, resourceId: number) => IDBKeyRange.only([
    resourceGroup,
    resourceId,
    chapterId,
  ]);
  const coreRequest = content.index('by-chapter').getAll(range('quran_core', 1));
  const translationRequest = content.index('by-chapter').getAll(range('translations', translationResourceId));
  let packageState: unknown;
  let coreRows: unknown;
  let translationRows: unknown;
  try {
    [packageState, coreRows, translationRows] = await Promise.all([
      readRequest(packageRequest),
      readRequest(coreRequest),
      readRequest(translationRequest),
    ]);
  } catch (error) {
    await complete.catch(() => undefined);
    throw error;
  }
  await complete;
  return {
    packageState: packageState as OfflineQuranPackage | undefined,
    coreRows: coreRows as StoredContentRow[],
    translationRows: translationRows as StoredContentRow[],
  };
}

export async function getSyncCheckpoint(resourcesFilter: string): Promise<ContentSyncCheckpoint | undefined> {
  const database = await openDatabase();
  const request = database.transaction(SYNC_STORE, 'readonly').objectStore(SYNC_STORE).get(resourcesFilter);
  return readRequest(request) as Promise<ContentSyncCheckpoint | undefined>;
}

export async function completeOfflineQuranSync(
  checkpoint: ContentSyncCheckpoint,
  packageState: OfflineQuranPackage,
): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction([SYNC_STORE, PACKAGE_STORE], 'readwrite');
  const complete = transactionComplete(transaction);
  transaction.objectStore(SYNC_STORE).put(checkpoint);
  transaction.objectStore(PACKAGE_STORE).put(packageState);
  await complete;
}

export async function markOfflineQuranPackageInconsistent(): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(PACKAGE_STORE, 'readwrite');
  const complete = transactionComplete(transaction);
  const store = transaction.objectStore(PACKAGE_STORE);
  const request = store.get('quran-content');
  request.onsuccess = () => {
    const packageState = request.result as OfflineQuranPackage | undefined;
    if (packageState) store.put({ ...packageState, isConsistent: false });
  };
  request.onerror = () => transaction.abort();
  await complete;
}

export async function getOfflineQuranPackage(): Promise<OfflineQuranPackage | undefined> {
  const database = await openDatabase();
  const request = database.transaction(PACKAGE_STORE, 'readonly').objectStore(PACKAGE_STORE).get('quran-content');
  return readRequest(request) as Promise<OfflineQuranPackage | undefined>;
}

export async function deleteOfflineQuranPackage(): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction([CONTENT_STORE, SYNC_STORE, PACKAGE_STORE, STAGING_STORE], 'readwrite');
  const complete = transactionComplete(transaction);
  const contentIndex = transaction.objectStore(CONTENT_STORE).index('by-resource');
  const resources: Array<[ContentResourceGroup, number]> = [
    ['quran_core', 1],
    ['translations', 20],
    ['translations', 33],
    ['recitations', 7],
  ];
  for (const [resourceGroup, resourceId] of resources) {
    const request = contentIndex.openCursor(IDBKeyRange.only([resourceGroup, resourceId]));
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) { cursor.delete(); cursor.continue(); }
    };
    request.onerror = () => transaction.abort();
  }
  transaction.objectStore(SYNC_STORE).delete(QURAN_CONTENT_FILTER);
  transaction.objectStore(PACKAGE_STORE).delete('quran-content');
  transaction.objectStore(STAGING_STORE).clear();
  await complete;
}
