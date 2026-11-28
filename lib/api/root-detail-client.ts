const ROOT_DETAIL_TIMEOUT_MS = 12_000;

export async function fetchRootDetail<T>(rootId: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ROOT_DETAIL_TIMEOUT_MS);
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener('abort', abort, { once: true });
  try {
    const response = await fetch(`/api/root-detail?root=${encodeURIComponent(rootId)}&v=5`, {
      cache: 'force-cache',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Root data unavailable');
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}
