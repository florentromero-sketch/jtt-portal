self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('jtt-portal-v1').then(cache => {
      return cache.addAll([
        '/jtt-portal/',
        '/jtt-portal/index.html',
        '/jtt-portal/manifest.json',
        '/jtt-portal/icon-192.png',
        '/jtt-portal/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
