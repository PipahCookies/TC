// service-worker.js
const CACHE_NAME = 'pipahcookies-store-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/icon1.png',
  '/images/icon.png'
];

// Install and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate and remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(res => res || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});
