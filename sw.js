const CACHE_NAME = 'my-transit-v3';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
