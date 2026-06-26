const CACHE_NAME = "gem-book-v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

/* ---------------- インストール ---------------- */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // ← 即有効化
});

/* ---------------- アクティベート（重要） ---------------- */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // ← 古いキャッシュ削除
          }
        })
      );
    })
  );

  self.clients.claim(); // ← 即切り替え
});

/* ---------------- フェッチ ---------------- */
self.addEventListener("fetch", event => {

  // HTMLは常に最新優先（重要）
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
