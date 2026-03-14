const CACHE = "studylog-v3";
const ASSETS = [
  "/Study-log-TEST1/",
  "/Study-log-TEST1/index.html",
  "/Study-log-TEST1/manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match("/Study-log-TEST1/index.html")))
  );
});

// 收到主程式訊息
self.addEventListener("message", e => {
  if(e.data === "skipWaiting") self.skipWaiting();
});
