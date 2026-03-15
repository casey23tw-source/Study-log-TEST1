var CACHE = "studylog-v33";
var ASSETS = [
  "/Study-log/",
  "/Study-log/index.html",
  "/Study-log/manifest.json",
  "/Study-log/icon-192.png",
  "/Study-log/icon-512.png",
  "https://unpkg.com/react@18.2.0/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone@7.23.5/babel.min.js"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return Promise.all(ASSETS.map(function(url){
        return c.add(url).catch(function(err){
          console.log("Cache miss:", url);
        });
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(res){
        if(!res || res.status !== 200) return res;
        var clone = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        return res;
      }).catch(function(){
        return caches.match("/Study-log/index.html");
      });
    })
  );
});

self.addEventListener("message", function(e){
  if(e.data === "skipWaiting") self.skipWaiting();
});
