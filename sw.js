const CACHE_NAME = 'my-transit-v13';

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
  './bus_weekday_jiroumaru_sankenya.json',
  './bus_saturday.json',
  './bus_saturday_jiroumaru_sankenya.json',
  './bus_holiday.json',

  './subway_weekday.json',
  './subway_saturday.json',
  './subway_holiday.json',
  './subway_hashimoto_hakata_weekday.json',
  './subway_hashimoto_hakata_weekend.json'
];

// インストール処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// アクティベート処理（古いキャッシュの削除）
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// フェッチ処理（キャッシュ優先、ネットワークフォールバック）
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
