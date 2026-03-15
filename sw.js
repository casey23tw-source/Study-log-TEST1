const CACHE = "studylog-v32";
const ASSETS = [
  "/Study-log/",
  "/Study-log/index.html",
  "/Study-log/manifest.json",
  "/Study-log/icon-192.png",
  "/Study-log/icon-512.png",
];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener("fetch", function(e){
  e.respondWith(caches.match(e.request).then(function(r){
    return r || fetch(e.request).then(function(res){
      if(!res||res.status!==200||res.type!=="basic") return res;
      var clone = res.clone();
      caches.open(CACHE).then(function(c){c.put(e.request,clone);});
      return res;
    });
  }));
});
self.addEventListener("message", function(e){
  if(e.data==="skipWaiting") self.skipWaiting();
});
