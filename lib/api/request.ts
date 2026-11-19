type UpstreamRequestInit = RequestInit & { next?: { revalidate?: number } };

export async function fetchJsonWithTimeout<T = any>(
  url: string,
  init: UpstreamRequestInit = {},
  timeoutMs = 6000
): Promise<{ response: Response; data?: T }> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const request = (async () => {
    const response = await fetch(url, { ...init, signal: controller.signal });
    return { response, data: response.ok ? await response.json() as T : undefined };
  })();
  const deadline = new Promise<never>((_resolve, reject) => {
    timeout = setTimeout(() => {
      controller.abort();
      reject(new Error(`Upstream request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([request, deadline]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
