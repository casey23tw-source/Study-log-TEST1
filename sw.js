var CACHE = "studylog-v61";
var ASSETS = [
  "/Study-log/",
  "/Study-log/index.html",
  "/Study-log/manifest.json",
  "/Study-log/icon-192.png",
  "/Study-log/icon-512.png"
];

self.addEventListener("install", function(e){
  // 不自動 skipWaiting，等用戶確認才更新
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  e.respondWith(
    caches.match(e.request).then(function(r){
      if(r) return r;
      return fetch(e.request).then(function(res){
        if(!res || res.status !== 200 || res.type !== "basic") return res;
        var clone = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        return res;
      });
    })
  );
});

// 只有收到 skipWaiting 訊息才更新
self.addEventListener("message", function(e){
  if(e.data === "skipWaiting") self.skipWaiting();
});
    })
  );
});

// 只有收到 skipWaiting 訊息才更新
self.addEventListener("message", function(e){
  if(e.data === "skipWaiting") self.skipWaiting();
});
