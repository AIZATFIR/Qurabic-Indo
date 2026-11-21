const ROOT_DETAIL_TIMEOUT_MS = 12_000;

export async function fetchRootDetail<T>(rootId: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ROOT_DETAIL_TIMEOUT_MS);
  try {
    const response = await fetch(`/api/root-detail?root=${encodeURIComponent(rootId)}&v=2`, {
      cache: 'force-cache',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Root data unavailable');
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}
