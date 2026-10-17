// Bump on every release so iPads drop the old copy (docs/04-qa-and-release.md).
const CACHE = "ebooks-v11";

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

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
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
