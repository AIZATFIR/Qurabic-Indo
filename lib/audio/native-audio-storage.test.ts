import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Directory } from '@capacitor/filesystem';
import { downloadNativeAudioToPrivateData } from './native-audio-storage';

test('native audio downloads target app-private Data without public-storage permissions', async () => {
  let received: Record<string, unknown> | undefined;
  await downloadNativeAudioToPrivateData(
    'https://verses.quran.com/Alafasy/mp3/018001.mp3',
    'qurabic-audio/temporary.mp3.part',
    45_000,
    async (options) => {
      received = options as Record<string, unknown>;
      return { path: 'private-file' };
    },
  );

  assert.deepEqual(received, {
    url: 'https://verses.quran.com/Alafasy/mp3/018001.mp3',
    path: 'qurabic-audio/temporary.mp3.part',
    directory: Directory.Data,
    connectTimeout: 15_000,
    readTimeout: 45_000,
  });
});
