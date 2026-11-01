const CACHE_NAME = 'dishdrop-admin-v4'; // غيرنا الرقم عشان نجبره يتحدث
const STATIC_ASSETS = [
  '/SI_30300.html',
  '/manifest.json',
  '/test/MMHpanel.html',
  '/dish-drop-192.png',
  '/dish-drop-512.png',
  '/dish-drop-si.png',
  '/test/images/control-panel.webp',
  '/test/images/mmh-logo.png'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firestore') || event.request.url.includes('cloudflare')) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
