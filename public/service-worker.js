const SHELL_CACHE = 'qurabic-reader-shell-v2';
const RUNTIME_CACHE = 'qurabic-static-runtime-v1';
const SHELL_PATHS = ['/', '/baca', '/offline.html'];
const SHELL_DATA_PATHS = ['/data/maqam-glosses.json'];
const MAX_RUNTIME_ENTRIES = 120;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    const responses = (await Promise.all(SHELL_PATHS.map(async (path) => {
      try {
        const response = await fetch(new Request(new URL(path, self.location.origin), { cache: 'reload' }));
        if (!response.ok) return null;
        const html = await response.clone().text();
        const assets = [...html.matchAll(/(?:src|href)=["']([^"']*\/_next\/static\/[^"']+)["']/g)]
          .map((match) => new URL(match[1], self.location.origin).toString());
        await cache.put(new URL(path, self.location.origin), response);
        return { assets };
      } catch {
        return null;
      }
    }))).filter(Boolean);

    const assets = [...new Set(responses.flatMap((entry) => entry.assets))];
    for (let index = 0; index < assets.length; index += 4) {
      await Promise.all(assets.slice(index, index + 4).map(async (asset) => {
        try {
          const response = await fetch(asset);
          if (response.ok) await cache.put(asset, response);
        } catch {
          // A single unavailable chunk must not prevent offline fallback installation.
        }
      }));
    }
    await Promise.all(SHELL_DATA_PATHS.map(async (path) => {
      try {
        const url = new URL(path, self.location.origin);
        const response = await fetch(new Request(url, { cache: 'reload' }));
        if (response.ok) await cache.put(url, response);
      } catch {
        // The app stays installable if optional offline word glosses cannot be fetched.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
      .filter((name) => (name.startsWith('qurabic-reader-shell-') && name !== SHELL_CACHE)
        || (name.startsWith('qurabic-static-runtime-') && name !== RUNTIME_CACHE))
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && (url.pathname === '/' || url.pathname === '/baca')) {
          const cache = await caches.open(SHELL_CACHE);
          await cache.put(new URL(url.pathname, self.location.origin), response.clone()).catch(() => undefined);
          return response;
        }
        if (response.ok) return response;
        const shell = await caches.open(SHELL_CACHE);
        const cachePath = url.pathname === '/' || url.pathname === '/baca' ? url.pathname : null;
        const cached = cachePath ? await shell.match(new URL(cachePath, self.location.origin)) : null;
        return cached || response;
      } catch {
        const shell = await caches.open(SHELL_CACHE);
        const cachePath = url.pathname === '/' || url.pathname === '/baca' ? url.pathname : null;
        const cached = cachePath ? await shell.match(new URL(cachePath, self.location.origin)) : null;
        if (cached) return cached;
        if (url.pathname !== '/baca') return Response.redirect(new URL('/baca', self.location.origin).toString(), 302);
        const offlinePage = await shell.match(new URL('/offline.html', self.location.origin));
        return offlinePage || new Response('<!doctype html><html lang="id"><meta charset="utf-8"><title>Qurabic offline</title><body><main>Hubungkan perangkat ke internet untuk membuka Qurabic.</main></body></html>', {
          status: 503,
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
    })());
    return;
  }

  if (url.pathname === '/data/maqam-glosses.json') {
    event.respondWith((async () => {
      const shell = await caches.open(SHELL_CACHE);
      const cached = await shell.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) await shell.put(request, response.clone()).catch(() => undefined);
      return response;
    })());
    return;
  }

  if (!url.pathname.startsWith('/_next/static/') && !url.pathname.startsWith('/icons/') && !url.pathname.startsWith('/fonts/')) return;

  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    if (cached) {
      void fetch(request).then(async (response) => {
        if (response.ok) {
          await cache.put(request, response.clone());
          const keys = await cache.keys();
          if (keys.length > MAX_RUNTIME_ENTRIES) {
            await Promise.all(keys.slice(0, keys.length - MAX_RUNTIME_ENTRIES).map((key) => cache.delete(key)));
          }
        }
      }).catch(() => undefined);
      return cached;
    }

    const shell = await caches.open(SHELL_CACHE);
    const precached = await shell.match(request);
    if (precached) return precached;

    const response = await fetch(request);
    if (response.ok) {
      try {
        await cache.put(request, response.clone());
        const keys = await cache.keys();
        if (keys.length > MAX_RUNTIME_ENTRIES) {
          await Promise.all(keys.slice(0, keys.length - MAX_RUNTIME_ENTRIES).map((key) => cache.delete(key)));
        }
      } catch {
        // Keep the online reader available when device storage is full.
      }
    }
    return response;
  })());
});
