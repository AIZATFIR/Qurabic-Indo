import {
  applyContentMutations,
  clearStagedContentResources,
  commitStagedContentResource,
  completeOfflineQuranSync,
  ContentResourceGroup,
  discardStagedContentResource,
  deleteContentResource,
  deleteOfflineQuranPackage,
  getOfflineQuranPackage,
  markOfflineQuranPackageInconsistent,
  getContentRow,
  getContentRowsForResource,
  getSyncCheckpoint,
  QURAN_CONTENT_FILTER,
  stageContentResourceBatch,
} from './quran-content-store';
import { deleteCachedAudioForUrl, pruneUntrackedQuranFoundationAudio } from '../audio/audio-preloader';
import { normalizeQuranFoundationAudioUrl } from '../api/audio';
import { consumeQuranSnapshotStream } from './quran-snapshot-stream';
import { SURAH_LIST } from '../data/surah-list';

const MAX_SYNC_PAGES = 100;
// Refresh a day early so an active, connected reader stays inside the source's weekly sync window.
const MAX_OFFLINE_AGE_MS = 6 * 24 * 60 * 60 * 1000;
const QURAN_RESOURCE_COUNTS = {
  chapter: 114,
  verse: 6_236,
  word: 83_665,
  juz: 30,
  hizb: 60,
  rub_el_hizb: 240,
} as const;
const SURAH_AYAH_COUNTS = new Map(SURAH_LIST.map((surah) => [surah.number, surah.ayahsCount]));

function isValidQuranVerseKey(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const match = /^([1-9]\d?):([1-9]\d{0,2})$/.exec(value);
  if (!match) return false;
  const surah = Number(match[1]);
  const ayah = Number(match[2]);
  const ayahCount = SURAH_AYAH_COUNTS.get(surah);
  return ayahCount !== undefined && ayah <= ayahCount;
}

interface SyncMutation extends Record<string, unknown> {
  type?: string;
  sequence?: number;
  resource_group?: string;
  resource_id?: number;
  snapshot_url?: string;
}

interface SyncEnvelope {
  mutations?: SyncMutation[];
  has_more?: boolean;
  next_page_url?: string | null;
  next_sync_token?: string;
}

export interface OfflineSyncProgress {
  phase: 'sync' | 'snapshot';
  page?: number;
  resourceGroup?: string;
}

export interface OfflineSyncResult {
  status: 'saved' | 'updated' | 'current';
  lastSuccessfulSyncAt: string;
}

async function requestContentSync(payload: Record<string, string>, signal?: AbortSignal): Promise<Record<string, unknown>> {
  const response = await fetch('/api/content-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
    signal,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('Quran sync returned an unreadable response.');
  }
  if (!response.ok) {
    const message = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
      ? data.error
      : 'Quran sync could not be completed.';
    throw new Error(message);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Quran sync returned an invalid response.');
  }
  return data as Record<string, unknown>;
}

function getEnvelope(payload: Record<string, unknown>): SyncEnvelope {
  const value = payload.sync && typeof payload.sync === 'object'
    ? payload.sync as Record<string, unknown>
    : payload;
  return value as SyncEnvelope;
}

function getSnapshotIdentity(path: string): { group: ContentResourceGroup; id: number } {
  const match = /^\/api\/v4\/resources\/snapshots\/(quran_core|translations|recitations)\/(\d+)$/.exec(path);
  if (!match) throw new Error('Quran sync requested an unsupported resource snapshot.');
  return { group: match[1] as ContentResourceGroup, id: Number(match[2]) };
}

function getMutationIdentity(mutation: SyncMutation): { group: ContentResourceGroup; id: number } {
  if ((mutation.resource_group !== 'quran_core' && mutation.resource_group !== 'translations' && mutation.resource_group !== 'recitations') || !Number.isInteger(mutation.resource_id)) {
    throw new Error('Quran sync returned an unsupported resource.');
  }
  const group = mutation.resource_group as ContentResourceGroup;
  const id = Number(mutation.resource_id);
  const allowed = group === 'quran_core' ? id === 1 : group === 'translations' ? id === 20 || id === 33 : id === 7;
  if (!allowed) throw new Error('Quran sync returned an unsupported resource.');
  return { group, id };
}

function validateSnapshotCounts(
  group: ContentResourceGroup,
  id: number,
  counts: Map<string, number>,
  coreVerseKeys: Set<string>,
  translationKeys: Set<string>,
  recitationVerseKeys: Set<string>,
) {
  if (group === 'quran_core' && id === 1) {
    for (const [recordType, expectedCount] of Object.entries(QURAN_RESOURCE_COUNTS)) {
      const count = counts.get(recordType) || 0;
      if (count !== expectedCount) throw new Error('Quran sync returned an incomplete Quran core snapshot.');
    }
    if (coreVerseKeys.size !== QURAN_RESOURCE_COUNTS.verse) {
      throw new Error('Quran sync returned an incomplete Quran core snapshot.');
    }
    return;
  }

  if (group === 'translations' && (id === 20 || id === 33)) {
    if (translationKeys.size !== QURAN_RESOURCE_COUNTS.verse) {
      throw new Error('Quran sync returned an incomplete translation snapshot.');
    }
    return;
  }

  if (group === 'recitations' && id === 7 && recitationVerseKeys.size !== QURAN_RESOURCE_COUNTS.verse) {
    throw new Error('Quran sync returned an incomplete Al-Afasy recitation snapshot.');
  }
}

function getSnapshotError(response: Response): Promise<Error> {
  return response.json().then((data: unknown) => {
    const message = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
      ? data.error
      : 'Quran sync could not be completed.';
    return new Error(message);
  }).catch(() => new Error('Quran sync could not be completed.'));
}

async function storeSnapshotStream(
  snapshotPath: string,
  resourceGroup: ContentResourceGroup,
  resourceId: number,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch('/api/content-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ operation: 'snapshot', snapshot_path: snapshotPath }),
    cache: 'no-store',
    signal,
  });
  if (!response.ok) throw await getSnapshotError(response);
  if (!response.body) throw new Error('Quran sync snapshot stream is unavailable.');

  const snapshotId = `qf-${resourceGroup}-${resourceId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const counts = new Map<string, number>();
  const coreVerseKeys = new Set<string>();
  const translationKeys = new Set<string>();
  const recitationVerseKeys = new Set<string>();
  const currentRecitationUrls = new Set<string>();
  const hadRecitationMetadata = resourceGroup === 'recitations'
    && (await getContentRowsForResource('recitations', 7)).some((row) => row.recordType === 'audio_file');
  const isFirstRecitationSync = resourceGroup === 'recitations' && !hadRecitationMetadata;
  const recordIds = new Set<string>();
  let batch: Record<string, unknown>[] = [];
  const flush = async () => {
    if (!batch.length) return;
    const rows = batch;
    batch = [];
    await stageContentResourceBatch(snapshotId, resourceGroup, resourceId, rows);
  };

  try {
    const snapshot = await consumeQuranSnapshotStream(response.body, async (record) => {
      if (signal?.aborted) throw new DOMException('Offline Quran sync cancelled', 'AbortError');
      if (record.id === undefined || record.id === null) throw new Error('Quran sync snapshot contains a row without an ID.');

      if (resourceGroup === 'quran_core') {
        const recordType = typeof record.record_type === 'string' ? record.record_type : '';
        if (!Object.prototype.hasOwnProperty.call(QURAN_RESOURCE_COUNTS, recordType)) {
          throw new Error('Quran sync returned an unsupported Quran record type.');
        }
        const recordKey = `${recordType}:${String(record.id)}`;
        if (recordIds.has(recordKey)) throw new Error('Quran sync returned a duplicate Quran record ID.');
        recordIds.add(recordKey);
        counts.set(recordType, (counts.get(recordType) || 0) + 1);
        if (recordType === 'verse') {
          const verseKey = record.verse_key;
          if (!isValidQuranVerseKey(verseKey) || coreVerseKeys.has(verseKey)) {
            throw new Error('Quran sync returned an incomplete Quran core snapshot.');
          }
          coreVerseKeys.add(verseKey);
        }
      } else if (resourceGroup === 'translations') {
        const verseKey = record.verse_key;
        if (!isValidQuranVerseKey(verseKey)
          || typeof record.text !== 'string' || !record.text.trim() || translationKeys.has(verseKey)) {
          throw new Error('Quran sync returned an incomplete translation snapshot.');
        }
        const recordId = String(record.id);
        if (recordIds.has(recordId)) throw new Error('Quran sync returned a duplicate translation record ID.');
        recordIds.add(recordId);
        translationKeys.add(verseKey);
      } else {
        const recordType = typeof record.record_type === 'string' ? record.record_type : '';
        const recordId = `${recordType}:${String(record.id)}`;
        if (!['audio_file', 'chapter_audio_file', 'audio_segment'].includes(recordType) || recordIds.has(recordId)) {
          throw new Error('Quran sync returned an unsupported or duplicate recitation record.');
        }
        recordIds.add(recordId);
        if (recordType === 'audio_file') {
          const verseKey = record.verse_key;
          const audioUrl = typeof record.url === 'string' ? normalizeQuranFoundationAudioUrl(record.url) : undefined;
          if (!isValidQuranVerseKey(verseKey) || !audioUrl || recitationVerseKeys.has(verseKey)) {
            throw new Error('Quran sync returned an invalid Al-Afasy audio file.');
          }
          recitationVerseKeys.add(verseKey);
          currentRecitationUrls.add(audioUrl);
        } else if (recordType === 'chapter_audio_file' && (typeof record.audio_url !== 'string' || !normalizeQuranFoundationAudioUrl(record.audio_url))) {
          throw new Error('Quran sync returned an invalid Al-Afasy chapter audio file.');
        }
      }

      batch.push(record);
      if (batch.length >= 200) await flush();
    });

    await flush();
    if (snapshot.resource_group !== resourceGroup || Number(snapshot.resource_id) !== resourceId) {
      throw new Error('Quran sync snapshot does not match the requested resource.');
    }
    validateSnapshotCounts(resourceGroup, resourceId, counts, coreVerseKeys, translationKeys, recitationVerseKeys);
    if (signal?.aborted) throw new DOMException('Offline Quran sync cancelled', 'AbortError');
    await commitStagedContentResource(snapshotId, resourceGroup, resourceId);
    if (resourceGroup === 'recitations') {
      await pruneUntrackedQuranFoundationAudio(currentRecitationUrls, isFirstRecitationSync);
    }
  } catch (error) {
    await discardStagedContentResource(snapshotId).catch(() => undefined);
    throw error;
  }
}

async function applySyncPage(
  mutations: SyncMutation[],
  bootstrap: boolean,
  seenResources: Set<string>,
  onProgress?: (progress: OfflineSyncProgress) => void,
  signal?: AbortSignal,
): Promise<void> {
  const ordered = [...mutations].sort((a, b) => Number(a.sequence || 0) - Number(b.sequence || 0));
  let rowMutations: SyncMutation[] = [];

  const flushRows = async () => {
    if (!rowMutations.length) return;
    const obsoleteRecitationUrls = new Set<string>();
    for (const mutation of rowMutations) {
      if (mutation.resource_group !== 'recitations' || Number(mutation.resource_id) !== 7 || mutation.record_type !== 'audio_file') continue;
      const recordKey = typeof mutation.record_key === 'string' ? mutation.record_key : '';
      if (!recordKey) continue;
      const previous = await getContentRow('recitations', 7, 'audio_file', recordKey);
      const previousUrl = typeof previous?.data.url === 'string' ? normalizeQuranFoundationAudioUrl(previous.data.url) : undefined;
      const nextUrl = mutation.type === 'ROW_DELETE' || !mutation.data || typeof mutation.data !== 'object'
        ? undefined
        : typeof (mutation.data as Record<string, unknown>).url === 'string'
          ? normalizeQuranFoundationAudioUrl((mutation.data as Record<string, unknown>).url as string)
          : undefined;
      if (previousUrl && previousUrl !== nextUrl) obsoleteRecitationUrls.add(previousUrl);
    }
    await applyContentMutations(rowMutations);
    rowMutations = [];
    if (obsoleteRecitationUrls.size) {
      const remainingRows = await getContentRowsForResource('recitations', 7);
      const remainingUrls = new Set(remainingRows
        .filter((row) => row.recordType === 'audio_file' && typeof row.data.url === 'string')
        .map((row) => normalizeQuranFoundationAudioUrl(row.data.url as string))
        .filter((url): url is string => Boolean(url)));
      for (const oldUrl of obsoleteRecitationUrls) {
        if (!remainingUrls.has(oldUrl)) await deleteCachedAudioForUrl(oldUrl);
      }
      await pruneUntrackedQuranFoundationAudio(remainingUrls);
    }
  };

  for (const mutation of ordered) {
    if (signal?.aborted) throw new DOMException('Offline Quran sync cancelled', 'AbortError');
    const identity = getMutationIdentity(mutation);
    const resourceKey = `${identity.group}:${identity.id}`;

    if (mutation.type === 'RESOURCE_CREATE' || mutation.type === 'RESOURCE_INVALIDATE') {
      await flushRows();
      const snapshotPath = typeof mutation.snapshot_url === 'string' ? mutation.snapshot_url : '';
      const snapshotIdentity = getSnapshotIdentity(snapshotPath);
      if (snapshotIdentity.group !== identity.group || snapshotIdentity.id !== identity.id) {
        throw new Error('Quran sync resource and snapshot do not match.');
      }

      onProgress?.({ phase: 'snapshot', resourceGroup: identity.group });
      await storeSnapshotStream(snapshotPath, identity.group, identity.id, signal);
      seenResources.add(resourceKey);
      continue;
    }

    if (mutation.type === 'RESOURCE_DELETE') {
      await flushRows();
      const oldRows = identity.group === 'recitations'
        ? await getContentRowsForResource(identity.group, identity.id)
        : [];
      await deleteContentResource(identity.group, identity.id);
      if (identity.group === 'recitations') {
        const urls = new Set(oldRows
          .filter((row) => row.recordType === 'audio_file' && typeof row.data.url === 'string')
          .map((row) => normalizeQuranFoundationAudioUrl(row.data.url as string))
          .filter((url): url is string => Boolean(url)));
        for (const url of urls) await deleteCachedAudioForUrl(url);
        continue;
      }
      await deleteOfflineQuranPackage();
      throw new Error('A Quran resource is no longer available. Download the offline pack again after the app updates.');
    }

    rowMutations.push(mutation);
  }

  await flushRows();
}

let localContentLockActive = false;

async function runOfflineQuranContentSync(
  force = false,
  onProgress?: (progress: OfflineSyncProgress) => void,
  signal?: AbortSignal,
): Promise<OfflineSyncResult> {
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    throw new Error('Offline Quran storage is unavailable on this device.');
  }
  if (!navigator.onLine) throw new Error('Connect to the internet to save or update the offline Quran pack.');

  await clearStagedContentResources();
  const savedPackage = await getOfflineQuranPackage();
  const checkpoint = savedPackage ? await getSyncCheckpoint(QURAN_CONTENT_FILTER) : undefined;
  const lastSuccessfulSync = checkpoint?.lastSuccessfulSyncAt || savedPackage?.lastSuccessfulSyncAt;
  if (!force && savedPackage && savedPackage.isConsistent !== false && lastSuccessfulSync) {
    const age = Date.now() - Date.parse(lastSuccessfulSync);
    if (Number.isFinite(age) && age >= 0 && age < MAX_OFFLINE_AGE_MS) {
      return { status: 'current', lastSuccessfulSyncAt: lastSuccessfulSync };
    }
  }

  try {
    const bootstrap = !savedPackage || !checkpoint?.syncToken;
    const seenResources = new Set<string>();
    let cursor: string | undefined;
    let finalToken = '';
    let completed = false;
    let page = 0;

    while (page < MAX_SYNC_PAGES) {
      if (signal?.aborted) throw new DOMException('Offline Quran sync cancelled', 'AbortError');
      page += 1;
      onProgress?.({ phase: 'sync', page });
      const request: Record<string, string> = { operation: bootstrap ? 'bootstrap' : 'sync' };
      if (!bootstrap && page === 1) request.sync_token = checkpoint!.syncToken;
      if (cursor) request.cursor = cursor;

      const payload = await requestContentSync(request, signal);
      const envelope = getEnvelope(payload);
      const mutations = Array.isArray(envelope.mutations) ? envelope.mutations : [];
      if (signal?.aborted) throw new DOMException('Offline Quran sync cancelled', 'AbortError');
      if (savedPackage && mutations.length > 0) await markOfflineQuranPackageInconsistent();
      await applySyncPage(mutations, bootstrap, seenResources, onProgress, signal);

      if (envelope.has_more) {
        if (typeof envelope.next_page_url !== 'string' || !envelope.next_page_url) {
          throw new Error('Quran sync pagination ended unexpectedly.');
        }
        cursor = envelope.next_page_url;
        continue;
      }

      if (typeof envelope.next_sync_token !== 'string' || !envelope.next_sync_token) {
        throw new Error('Quran sync did not return a completion checkpoint.');
      }
      finalToken = envelope.next_sync_token;
      completed = true;
      break;
    }

    if (!completed || !finalToken) throw new Error('Quran sync exceeded the allowed page limit.');
    if (signal?.aborted) throw new DOMException('Offline Quran sync cancelled', 'AbortError');
    if (bootstrap) {
      for (const required of ['quran_core:1', 'translations:20', 'translations:33']) {
        if (!seenResources.has(required)) throw new Error('The complete Quran text and translation pack is not available yet.');
      }
    }

    const now = new Date().toISOString();
    const nextCheckpoint = {
      resourcesFilter: QURAN_CONTENT_FILTER,
      syncToken: finalToken,
      lastSuccessfulSyncAt: now,
    };
    await completeOfflineQuranSync(nextCheckpoint, {
      id: 'quran-content',
      resourcesFilter: QURAN_CONTENT_FILTER,
      savedAt: savedPackage?.savedAt || now,
      lastSuccessfulSyncAt: now,
      isConsistent: true,
    });

    return { status: savedPackage ? 'updated' : 'saved', lastSuccessfulSyncAt: now };
  } catch (error) {
    if (!savedPackage) await deleteOfflineQuranPackage().catch(() => undefined);
    throw error;
  }
}

export async function syncOfflineQuranContent(
  force = false,
  onProgress?: (progress: OfflineSyncProgress) => void,
  signal?: AbortSignal,
): Promise<OfflineSyncResult> {
  return withOfflineQuranLock(() => runOfflineQuranContentSync(force, onProgress, signal));
}

export async function withOfflineQuranLock<T>(operation: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request('qurabic-quran-content-sync', { mode: 'exclusive', ifAvailable: true }, (lock) => {
      if (!lock) throw new Error('Quran content storage is busy in another Qurabic tab.');
      return operation();
    });
  }

  if (localContentLockActive) throw new Error('Quran content storage is already busy.');
  localContentLockActive = true;
  try {
    return await operation();
  } finally {
    localContentLockActive = false;
  }
}
