const CACHE_NAME = 'my-transit-v8';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
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

// フェッチ（ネットワーク優先にして画像が確実に表示されるようにする）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // ネットワークから取得できたら、それを返す
        return response;
      })
      .catch(() => {
        // オフラインのときはキャッシュから探す
        return caches.match(event.request);
      })
  );
});
