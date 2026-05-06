const CACHE_NAME = 'subsidy-calculator-v42';

// 需要快取的靜態資源與外部 CDN 連結
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js'
];

// 安裝階段：將所有資源存入快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('V42 全能離線快取已建立');
      return cache.addAll(urlsToCache);
    })
  );
  // 強制讓新的 Service Worker 立即接管，不用等待舊版結束
  self.skipWaiting();
});

// 啟動階段：清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 攔截請求：優先從快取讀取
self.addEventListener('fetch', (event) => {
  // 排除 Google Sheets 的動態資料抓取，以免卡住手動同步功能
  if (event.request.url.includes('docs.google.com')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
