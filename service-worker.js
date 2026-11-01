const CACHE_NAME = 'dishdrop-admin-v1';
const STATIC_ASSETS = [
  './SI_30300.html',
  './MMHpanel.html',
  './manifest.json',
  './images/control-panel.webp',
  './images/mmh-logo.png'
];

// تخزين الملفات الأساسية عند التثبيت
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// مسح الكاش القديم عند التحديث
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

// استراتيجية (Network First) لضمان تحديث البيانات دائماً
self.addEventListener('fetch', (event) => {
  // تخطي طلبات فايربيس وكلاودفلير لعدم التدخل في قاعدة البيانات
  if (event.request.url.includes('firestore') || event.request.url.includes('cloudflare')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
