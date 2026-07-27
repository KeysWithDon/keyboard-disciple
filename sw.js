const CACHE_NAME = "keyboard-disciple-progress-memory-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260727-clean-spacebar",
  "./refresh.css?v=20260727-progress-memory",
  "./app.js?v=20260727-progress-memory",
  "./manifest.webmanifest",
  "./assets/biblical-word-bank.js?v=20260723",
  "./assets/kjv-verses-1769.json",
  "./assets/keyboard-disciple-mark.png",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
      if (cached) {
        network.catch(() => {});
        return cached;
      }
      return network.catch(() => new Response("", { status: 503, statusText: "Offline" }));
    })
  );
});
