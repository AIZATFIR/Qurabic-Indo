const MAX_HEADER_LENGTH = 64 * 1024;
const MAX_RECORD_LENGTH = 1024 * 1024;
const MAX_TRAILER_LENGTH = 64 * 1024;

/** Parse one JSON object at a time from a Content Sync snapshot response. */
export async function consumeQuranSnapshotStream(
  stream: ReadableStream<Uint8Array>,
  onRecord: (record: Record<string, unknown>) => Promise<void>,
): Promise<Record<string, unknown>> {
  const reader = stream.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let chunk = '';
  let chunkOffset = 0;
  let ended = false;

  const nextChar = async (): Promise<string | null> => {
    while (chunkOffset >= chunk.length) {
      if (ended) return null;
      const result = await reader.read();
      if (result.done) {
        chunk = decoder.decode();
        chunkOffset = 0;
        ended = true;
        if (!chunk.length) return null;
      } else {
        chunk = decoder.decode(result.value, { stream: true });
        chunkOffset = 0;
      }
    }
    return chunk[chunkOffset++];
  };

  try {
    let header = '';
    while (!header.includes('"records"')) {
      const char = await nextChar();
      if (char === null) throw new Error('Quran sync snapshot ended before its records.');
      header += char;
      if (header.length > MAX_HEADER_LENGTH) throw new Error('Quran sync snapshot header is too large.');
    }
    while (!/"records"\s*:\s*\[$/.test(header)) {
      const char = await nextChar();
      if (char === null) throw new Error('Quran sync snapshot has an invalid records field.');
      header += char;
      if (header.length > MAX_HEADER_LENGTH) throw new Error('Quran sync snapshot header is too large.');
    }

    let expectRecord = true;
    let afterComma = false;
    while (true) {
      let char = await nextChar();
      while (char !== null && /\s/.test(char)) char = await nextChar();
      if (char === null) throw new Error('Quran sync snapshot ended before its records were complete.');

      if (!expectRecord) {
        if (char === ']') break;
        if (char !== ',') throw new Error('Quran sync snapshot has an invalid record separator.');
        expectRecord = true;
        afterComma = true;
        continue;
      }

      if (char === ']') {
        if (afterComma) throw new Error('Quran sync snapshot has a trailing record separator.');
        break;
      }
      if (char !== '{') throw new Error('Quran sync snapshot contains a non-object record.');

      let recordText = '{';
      let objectDepth = 1;
      let inString = false;
      let escaped = false;
      while (objectDepth > 0) {
        char = await nextChar();
        if (char === null) throw new Error('Quran sync snapshot contains a truncated record.');
        recordText += char;
        if (recordText.length > MAX_RECORD_LENGTH) throw new Error('Quran sync record is unexpectedly large.');

        if (inString) {
          if (escaped) escaped = false;
          else if (char === '\\') escaped = true;
          else if (char === '"') inString = false;
          continue;
        }
        if (char === '"') inString = true;
        else if (char === '{') objectDepth += 1;
        else if (char === '}') objectDepth -= 1;
      }

      const record: unknown = JSON.parse(recordText);
      if (!record || typeof record !== 'object' || Array.isArray(record)) {
        throw new Error('Quran sync snapshot contains an invalid record.');
      }
      await onRecord(record as Record<string, unknown>);
      expectRecord = false;
      afterComma = false;
    }

    let trailer = '';
    while (true) {
      const char = await nextChar();
      if (char === null) break;
      trailer += char;
      if (trailer.length > MAX_TRAILER_LENGTH) throw new Error('Quran sync snapshot trailer is too large.');
    }

    const envelope: unknown = JSON.parse(`${header.slice(0, -1)}[]${trailer}`);
    if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) {
      throw new Error('Quran sync snapshot envelope is invalid.');
    }
    return envelope as Record<string, unknown>;
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    throw error;
  } finally {
    reader.releaseLock();
  }
}
