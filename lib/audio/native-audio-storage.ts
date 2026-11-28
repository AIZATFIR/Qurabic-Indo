import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

const AUDIO_DIRECTORY = 'qurabic-audio';
const pendingDownloads = new Map<string, Promise<void>>();
type NativeAudioDownloadOptions = Parameters<typeof Filesystem.downloadFile>[0];
type NativeAudioDownloader = (options: NativeAudioDownloadOptions) => Promise<unknown>;

export async function downloadNativeAudioToPrivateData(
  url: string,
  path: string,
  readTimeoutMs: number,
  download: NativeAudioDownloader = (options) => Filesystem.downloadFile(options),
): Promise<void> {
  // The current FileTransfer Android plugin requests public-storage permission on API < 30,
  // even for this app-private destination. Filesystem skips that check for Directory.Data.
  await download({
    url,
    path,
    directory: Directory.Data,
    connectTimeout: 15000,
    readTimeout: readTimeoutMs,
  });
}

export function isNativeAudioStorageAvailable(): boolean {
  return Capacitor.isNativePlatform();
}

function getAudioPath(url: string): string {
  const extension = new URL(url).pathname.match(/\.(mp3|m4a|aac|ogg|wav)$/i)?.[0]?.toLowerCase() ?? '.mp3';
  return `${AUDIO_DIRECTORY}/${encodeURIComponent(url)}${extension}`;
}

async function hasStoredFile(path: string): Promise<boolean> {
  try {
    const stat = await Filesystem.stat({ path, directory: Directory.Data });
    return stat.size > 0;
  } catch {
    return false;
  }
}

export async function getNativeStoredAudioUrl(url: string): Promise<string | undefined> {
  if (!isNativeAudioStorageAvailable()) return undefined;
  try {
    const path = getAudioPath(url);
    if (!(await hasStoredFile(path))) return undefined;
    const file = await Filesystem.getUri({ path, directory: Directory.Data });
    return Capacitor.convertFileSrc(file.uri);
  } catch {
    return undefined;
  }
}

export async function listNativeStoredAudioUrls(): Promise<string[]> {
  if (!isNativeAudioStorageAvailable()) return [];
  try {
    const result = await Filesystem.readdir({ path: AUDIO_DIRECTORY, directory: Directory.Data });
    return result.files.flatMap((entry) => {
      const name = typeof entry === 'string' ? entry : entry.name;
      if (/\.part$/i.test(name) || !/\.(mp3|m4a|aac|ogg|wav)$/i.test(name)) return [];
      const encodedUrl = name.replace(/\.(mp3|m4a|aac|ogg|wav)$/i, '');
      try { return [decodeURIComponent(encodedUrl)]; } catch { return []; }
    });
  } catch {
    return [];
  }
}

export async function deleteNativeStoredAudioFile(url: string): Promise<void> {
  if (!isNativeAudioStorageAvailable()) return;
  await pendingDownloads.get(url)?.catch(() => undefined);
  for (const path of [getAudioPath(url), `${getAudioPath(url)}.part`]) {
    try {
      await Filesystem.deleteFile({ path, directory: Directory.Data });
    } catch {
      // The file may not exist on this device.
    }
  }
}

export async function saveNativeAudioFile(url: string, readTimeoutMs: number): Promise<void> {
  if (!isNativeAudioStorageAvailable()) throw new Error('Native audio storage is unavailable');
  if (await hasStoredFile(getAudioPath(url))) return;

  const pending = pendingDownloads.get(url);
  if (pending) return pending;

  const path = getAudioPath(url);
  const temporaryPath = `${path}.part`;
  const download = (async () => {
    await Filesystem.mkdir({ path: AUDIO_DIRECTORY, directory: Directory.Data, recursive: true });
    try {
      await downloadNativeAudioToPrivateData(url, temporaryPath, readTimeoutMs);
      const temporaryFile = await Filesystem.stat({ path: temporaryPath, directory: Directory.Data });
      if (temporaryFile.size <= 0) throw new Error('Downloaded audio file is empty');
      await Filesystem.rename({ from: temporaryPath, to: path, directory: Directory.Data });
    } catch (error) {
      try {
        await Filesystem.deleteFile({ path: temporaryPath, directory: Directory.Data });
      } catch {
        // A partial file may not exist if the transfer failed before opening it.
      }
      if (await hasStoredFile(path)) return;
      throw error;
    }
  })();

  pendingDownloads.set(url, download);
  try {
    await download;
  } finally {
    if (pendingDownloads.get(url) === download) pendingDownloads.delete(url);
  }
}
