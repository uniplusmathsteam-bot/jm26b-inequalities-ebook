// Bump on every release so iPads drop the old copy (docs/04-qa-and-release.md).
const CACHE = "ebooks-v18";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

const STATIC = /\/(assets|vendor|pages)\//;
const MEDIA = /\/media\/[^/]+\.mp4$/;

/* Safari asks for video in byte ranges, which the cache cannot store, so the whole file is cached and sliced. */
async function media(request) {
  const cache = await caches.open(CACHE);
  let whole = await cache.match(request.url);
  if (!whole) {
    const response = await fetch(request.url);
    if (response.status !== 200) return response;
    await cache.put(request.url, response.clone());
    whole = response;
  }
  const range = /bytes=(\d*)-(\d*)/.exec(request.headers.get("range") || "");
  if (!range) return whole;
  const body = await whole.arrayBuffer();
  const start = Number(range[1] || 0);
  const end = range[2] ? Math.min(Number(range[2]), body.byteLength - 1) : body.byteLength - 1;
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": whole.headers.get("Content-Type") || "video/mp4",
      "Content-Range": `bytes ${start}-${end}/${body.byteLength}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (MEDIA.test(new URL(request.url).pathname)) {
    event.respondWith(media(request));
    return;
  }
  const store = (response) => {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, copy));
    }
    return response;
  };
  if (STATIC.test(new URL(request.url).pathname)) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then(store)));
    return;
  }
  event.respondWith(fetch(request).then(store).catch(() => caches.match(request)));
});
