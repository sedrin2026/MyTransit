const CACHE_NAME = 'my-transit-v5'; // バージョンを v5 に上げます
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './title.png',
  './bus_map.png',     // 🚌 西鉄バス路線図を追加
  './subway_map.png',  // 🚇 福岡市地下鉄路線図を追加
  './bus_weekday.json',
  './bus_saturday.json',
  './bus_holiday.json',
  './subway_weekday.json',
  './subway_saturday.json',
  './subway_holiday.json',
  './illust1772_thumb.gif',
  './illust3615_thumb.gif'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 💡 古いキャッシュを自動でお掃除して新しくするアクティベート処理
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
});

// 💡 パスの違いを無視して強制的にキャッシュから返す最強版
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        console.log('オフラインです');
      });
    })
  );
});
