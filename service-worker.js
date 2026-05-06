// 1. 更新版本號，確保瀏覽器識別為新版本
const CACHE_NAME = 'subsidy-calculator-v41';

// 2. 需要快取的靜態檔案
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 安裝階段：將靜態資源存入快取
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('V41 快取已成功建立');
        return cache.addAll(urlsToCache);
      })
  );
});

// 啟動階段：清理所有不是 V37 的舊快取 (關鍵修正)
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('正在清理過時快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截請求：優先從快取讀取（實現秒開 App），若無快取則發送網路請求
self.addEventListener('fetch', function(event) {
  // 排除 Google Sheets 的 CSV 請求，讓 index.html 內的 fetch 自己處理
  if (event.request.url.includes('docs.google.com')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果快取中有資料就使用快取，否則嘗試從網路抓取
        return response || fetch(event.request);
      })
  );
});
