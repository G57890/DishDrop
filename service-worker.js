const CACHE_NAME = 'dishdrop-admin-v3'; // رفعنا الإصدار للتأكد من التحديث
const STATIC_ASSETS = [
  // 1. الصفحات الأساسية وملف الإعدادات
  './SI_30300.html',
  './test/MMHpanel.html',
  './manifest.json',
  
  // 2. أيقونات التطبيق الأساسية (PWA Icons)
  './dish-drop-192.png',
  './dish-drop-512.png',
  
  // 3. صورة صفحة تسجيل الدخول
  './dish-drop-si.png',
  
  // 4. صور لوحة التحكم
  './test/images/control-panel.webp',
  './test/images/mmh-logo.png'
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
