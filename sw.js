const CACHE_NAME = 'my-transit-v10'; // バージョンを v10 に上げます
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './illust1772_thumb.gif',
  './illust3615_thumb.gif',
  './bus-map.png',
  './subway-map.png',
  './bus_weekday.json',
  './bus_saturday.json',
  './bus_holiday.json',
  './subway_weekday.json',
  './subway_saturday.json',
  './subway_holiday.json'
];

// インストール時にキャッシュを作成
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// アクティベート時に古いキャッシュを完全消去
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

// フェッチの修正：ネットを優先しつつ、オフラインや失敗時は確実にキャッシュを返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // ネットワーク接続が失敗（オフライン）した場合の処理
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // もし個別ファイルのキャッシュが見つからない場合、index.htmlを返す（PWAの基本）
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});
