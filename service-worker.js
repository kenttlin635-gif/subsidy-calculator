const CACHE_NAME = 'subsidy-calculator-v30'; // 1. 升級至 v30
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 安裝 Service Worker 並儲存快取
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('快取已開啟');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 啟動階段：刪除舊快取 (非常重要，否則手機會一直抓到舊版)
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('正在刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截請求並回應
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果快取中有資料就使用快取，否則發送網路請求
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
