// service-worker.js
const CACHE_NAME = 'pipahcookies-store-v3';
const BASE_PATH = '/com'; // <-- important for GitHub Pages subfolder

const ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/images/icon1.png`,
  `${BASE_PATH}/images/icon.png`
];

// Install and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
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
  const request = event.request;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(`${BASE_PATH}/index.html`))
    );
  } else {
    event.respondWith(
      caches.match(request).then(res => res || fetch(request))
    );
  }
});
