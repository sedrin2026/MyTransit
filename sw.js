const CACHE_NAME = 'my-transit-v7'; // バージョンを v7 に上げます
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './illust1772_thumb.gif',
  './illust3615_thumb.gif',
  './bus-map.png',     // 💡 ハイフンに変更
  './subway-map.png',  // 💡 ハイフンに変更
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

// アクティベート時に古いキャッシュを削除
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

// フェッチ（オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
