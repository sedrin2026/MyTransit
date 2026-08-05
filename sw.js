const CACHE_NAME = 'my-transit-v9'; // ① キャッシュのバージョンを v9 に上げて古い記憶を強制リフレッシュ
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png', // 必要に応じてアイコンファイル名に合わせてください
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

// ② フェッチの仕組み：まずはネットから最新ファイルを取りに行く（オフライン時のみキャッシュを使用）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
