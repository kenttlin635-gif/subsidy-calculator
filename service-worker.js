const CACHE_NAME = 'subsidy-calculator-v31'; // 改為 v31
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 安裝階段：儲存快取
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('V31 快取已開啟');
        return cache.addAll(urlsToCache);
      })
  );
});

// 啟動階段：清理舊版的快取 (重要！)
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('正在清理舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截請求
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果快取中有(像 index.html)，就直接給
        if (response) {
          return response;
        }
        // 否則去網路上抓 (像 Google Sheets 的 CSV)
        return fetch(event.request);
      })
  );
});
